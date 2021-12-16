import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Platform, ActivityIndicator, Alert, BackHandler } from "react-native";
import { ProgressBar } from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import firebase, { db, functions } from '../../firebase'
import Dialog from "react-native-dialog"
import _ from 'lodash'
import { connect } from 'react-redux'
import DeviceInfo from 'react-native-device-info';
import { NetworkInfo } from "react-native-network-info";
import SmsRetriever from 'react-native-sms-retriever'

import moment from 'moment';
import 'moment/locale/fr'
moment.locale('fr')

import Pdf from "react-native-pdf";
import RNFS from 'react-native-fs'
import RNFetchBlob from 'rn-fetch-blob'
import { PDFDocument, rgb } from "pdf-lib";

import * as theme from '../../core/theme'
import { autoSignDocs, constants, downloadDir, errorMessages, docsConfig, termsDir, termsUrl } from '../../core/constants'
import { loadLog, setToast, uint8ToBase64, base64ToArrayBuffer, load, updateField, myAlert, uuidGenerator, displayError } from '../../core/utils'
import { uploadFile } from "../../api/storage-api";
import { script as emailTemplate } from '../../emailTemplates/signatureRequest'

import Appbar from '../../components/Appbar'
import Button from '../../components/Button'
import LoadDialog from '../../components/LoadDialog'
import Toast from '../../components/Toast'
import TermsConditions from "../../components/TermsConditions";

class Signature extends Component {

    constructor(props) {
        super(props)
        this.currentUser = firebase.auth().currentUser
        this.initMode = this.props.navigation.getParam('initMode', '')

        //Storage ref url
        this.ProjectId = this.props.navigation.getParam('ProjectId', '')
        this.DocumentId = this.props.navigation.getParam('DocumentId', '')
        this.DocumentType = this.props.navigation.getParam('DocumentType', '')
        this.fileName = this.props.navigation.getParam('fileName', '')
        this.sourceUrl = this.props.navigation.getParam('url', '')
        this.originalFilePath = `${downloadDir}/Synergys/Documents/${this.fileName}`

        this.onSignaturePop = this.props.navigation.getParam('onSignaturePop', '') //Navigation pop times when  signature is done
        this.canSign = this.props.navigation.getParam('canSign', false)

        this.onAcceptTerms = this.onAcceptTerms.bind(this)
        this.tick = this.tick.bind(this)
        this.readFile = this.readFile.bind(this)
        this.toggleTerms = this.toggleTerms.bind(this)
        this.startSignature = this.startSignature.bind(this)
        this.verifyUser = this.verifyUser.bind(this)
        this.sendCode = this.sendCode.bind(this)
        this.verifyCode = this.verifyCode.bind(this)
        this.retrySign = this.retrySign.bind(this)
        this.confirmSign = this.confirmSign.bind(this)
        this.uploadFile = uploadFile.bind(this)
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this)
        this.myAlert = myAlert.bind(this)

        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick)

        this.state = {
            fileDownloaded: false,
            pdfEditMode: false,

            signatureBase64: null,
            signatureArrayBuffer: null,

            pdfBase64: null,
            pdfArrayBuffer: null,

            newPdfSaved: false,
            newPdfPath: null,
            signedAttachment: {
                path: '',
                type: '',
                name: '',
                size: '',
                progress: 0
            },

            pageWidth: 0,
            pageHeight: 0,

            filePath: this.originalFilePath,

            uploading: false,
            loading: false,
            loadingMessage: '',
            toastType: '',
            toastMessage: '',

            showTerms: false,

            showDialog: false,
            status: false,
            statusMessage: '',
            codeApproved: false,
            approvalMessage: '',
            code: '',

            phoneNumber: '',
            timeLeft: 60,

            //Data of proofs
            signee: '',
            ref: '',
            motif: '',
        }
    }

    async componentDidMount() {
        await this.init()
    }

    //##BackHandler
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    async init() {
        try {
            loadLog(this, true, 'Initialisation de la page...')
            await this.loadOriginalFile(this.originalFilePath)
            if (this.initMode === 'sign')
                this.toggleTerms()
        }
        catch (e) {
            const { message } = e
            displayError({ message })
        }
        finally {
            loadLog(this, false, '')
        }
    }

    //1. Download, Read & Load file
    async loadOriginalFile(filePath) {
        try {
            const { config, fs } = RNFetchBlob
            const fileExist = await RNFetchBlob.fs.exists(filePath)
            //Download file
            if (!fileExist) {
                this.setState({ loadingMessage: 'Téléchargement du document...' })
                await this.downloadFile(filePath, this.sourceUrl)
            }
            //Read file
            this.setState({ fileDownloaded: true, loadingMessage: 'Initialisation du document...' })
            await this.readFile(filePath)
        }
        catch (e) {
            throw new Error("Erreur lors du chargement du document, veuillez réessayer plus tard.")
        }
    }

    downloadFile(path, sourceUrl) {
        let downloadProgress = 0
        return RNFetchBlob
            .config({ path, fileCache: true })
            .fetch('GET', sourceUrl, {})
            .progress((received, total) => {
                downloadProgress = Math.round((received / total) * 100)
                const loadingMessage = `Téléchargement en cours... ${downloadProgress.toString()}%`
                this.setState({ loadingMessage })
            })
    }

    readFile(filePath) {
        return RNFS.readFile(filePath, "base64")
            .then((pdfBase64) => {
                const pdfArrayBuffer = base64ToArrayBuffer(pdfBase64)
                this.setState({ pdfBase64, pdfArrayBuffer })
            })
    }

    //2. Show/hide terms
    toggleTerms() {
        const { showTerms } = this.state
        this.setState({ showTerms: !showTerms })
    }

    //3. OTP verification + Email send
    async verifyUser() {
        try {
            this.setState({ showTerms: false, showDialog: true })
            const { timeLeft } = this.state
            if (timeLeft > 0 && timeLeft < 60) return
            this.setState({ timeLeft: 60, status: true, statusMessage: "Génération d'un code secure..." })
            await this.sendCode()
            this.tick()
            this.sendEmail()
            this.setState({ status: false, statusMessage: "" })
        }
        catch (e) {
            setToast(this, 'e', "Erreur lors de l'envoie du code, veuillez réessayer...")
            this.setState({ showDialog: false })
        }
    }

    async sendCode() {
        const errorMessage = "Erreur lors de l'envoi du code. Veuillez réessayer plus tard"
        try {
            const user = await db.collection('Users').doc(firebase.auth().currentUser.uid).get() //#task: not needed when using SMS RETRIEVER
            const phoneNumber = user.data().phone
            this.setState({ phoneNumber })
            const sendCode = functions.httpsCallable('sendCode')
            const resp = await sendCode({ phoneNumber: phoneNumber })
            if (resp.data.status !== 'pending')
                throw new Error(errorMessage)
        }
        catch (e) {
            throw new Error(errorMessage)
        }
    }

    async verifyCode() {
        this.setState({ status: true, statusMessage: 'Vérification du code...' })
        const { phoneNumber } = this.state
        const verifyCode = functions.httpsCallable('verifyCode')
        const resp = await verifyCode({ phoneNumber: phoneNumber, code: this.state.code })
        if (resp.data.status === 'pending') {
            this.setState({ status: false, statusMessage: '' })
            Alert.alert('', 'Le code que vous avez saisi est incorrecte.', [{ text: 'OK', style: 'cancel' }], { cancelable: false })
            return
        }

        else if (resp.data.error) {
            Alert.alert('', 'Erreur inattendue lors de la vérification du code', [{ text: 'OK', style: 'cancel' }], { cancelable: false })
            return
        }
 
        //UX security
        else if (resp.data.status === 'approved') {
            setTimeout(() => this.setState({ codeApproved: true, approvalMessage: 'Code approuvé...' }), 0)
            setTimeout(() => this.setState({ approvalMessage: 'Signature autorisée...' }), 2000)
            setTimeout(() => this.setState({ showDialog: false }), 4000)
            setTimeout(() => this.startSignature(), 4200)
        }
    }

    sendEmail() {
        const html = emailTemplate(this.sourceUrl)
        const sendMail = functions.httpsCallable('sendEmail')
        return sendMail({ receivers: this.currentUser.email, subject: "Vous avez un document à signer.", html, attachments: [] })
    }

    tick() {
        this.countDown = setInterval(() => {
            let { timeLeft } = this.state
            if (timeLeft === 1)
                clearInterval(this.countDown)
            timeLeft -= 1
            this.setState({ timeLeft })
        }, 1000)
    }

    renderDialog = () => {
        let { code, showDialog, codeApproved, status, timeLeft } = this.state
        let disableResend = timeLeft > 0

        if (status || codeApproved)
            return (
                <View style={styles.dialogContainer}>
                    <Dialog.Container visible={this.state.showDialog}>
                        {status && <Dialog.Title style={[theme.customFontMSsemibold.header, { marginBottom: 5 }]}>{this.state.statusMessage}</Dialog.Title>}
                        {codeApproved && <Dialog.Title style={[theme.customFontMSsemibold.header, { marginBottom: 5 }]}>{this.state.approvalMessage}</Dialog.Title>}
                        <ActivityIndicator color={theme.colors.primary} size='small' />
                    </Dialog.Container>
                </View>
            )

        else return (
            <View style={styles.dialogContainer}>
                <Dialog.Container visible={this.state.showDialog}>
                    <Dialog.Title style={[theme.customFontMSsemibold.header, { marginBottom: 5 }]}>Veuillez saisir le code de sécurité que nous vous avons transmis via SMS au +33*******{this.state.phoneNumber.slice(-2)}</Dialog.Title>
                    <Dialog.Input
                        label="Code de confirmation"
                        returnKeyType="done"
                        value={this.state.code}
                        onChangeText={code => this.setState({ code: Number(code) })}
                        autoFocus={showDialog} />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 15, paddingHorizontal: constants.ScreenWidth * 0.03 }}>
                        <TouchableOpacity disabled={disableResend} onPress={this.verifyUser}>
                            <Text style={[theme.customFontMSmedium.body, { color: disableResend ? theme.colors.placeholder : theme.colors.primary }]}>Renvoyer le code</Text>
                        </TouchableOpacity>
                        <Text style={{ color: theme.colors.placeholder }}>00:{timeLeft < 10 && 0}{timeLeft}</Text>
                    </View>
                    <Dialog.Button label="Annuler" onPress={() => this.setState({ showDialog: false })} style={{ color: theme.colors.error }} />
                    <Dialog.Button label="Valider" onPress={async () => await this.verifyCode()} style={{ color: theme.colors.primary }} />
                </Dialog.Container>
            </View>
        )
    }

    //4. Signature process
    startSignature() {
        this.setState({
            showTerms: false,
            pdfEditMode: true,
            toastType: 'info',
            toastMessage: "Touchez à l'endroit où vous voulez placer la signature."
        })
    }

    calculatePaddingTop(pdfDoc) {
        const screenWidth = constants.ScreenWidth
        const screenHeight = constants.ScreenHeight
        const pages = pdfDoc.getPages()
        const firstPage = pages[0]
        const ratio = firstPage.getHeight() / firstPage.getWidth()
        const pageWidth = screenWidth
        const pageHeight = pageWidth * ratio
        const paddingTop = (screenHeight - pageHeight) / 2
        return paddingTop
    }

    handleSingleTap = async (page, x, y, isAuto, signatures) => {

        const { pdfEditMode } = this.state
        if (!pdfEditMode) return
        loadLog(this, true, 'Début du processus de signature...')

        setTimeout(async () => {
            try {
                //Getting tapped page
                const pdfDoc = await PDFDocument.load(this.state.pdfArrayBuffer)
                const pages = pdfDoc.getPages()

                //Adjust paddingTop
                const paddingTop = this.calculatePaddingTop(pdfDoc)
                this.setState({ filePath: null, pdfEditMode: false, loadingMessage: 'Insertion de la signature...' })

                //Constants
                const signee = firebase.auth().currentUser.displayName
                const ref = await uuidGenerator()
                const motif = 'Acceptation des conditions'
                const signedAt = moment().format('Do/MM/YYYY, HH:mm')
                this.setState({ signee, signedAt, ref, motif })

                const signature = `Signé électroniquement par: ${signee} \n Référence: ${ref} \n Date ${signedAt} \n Motif: ${motif}`

                if (isAuto) {
                    for (const s of signatures) {
                        const { pageIndex, position } = s
                        const { x, y } = position
                        if (pageIndex < pages.length)
                            pages[pageIndex].drawText(signature, {
                                x,
                                y,
                                size: 10,
                                lineHeight: 10,
                                color: rgb(0, 0, 0),
                            })
                    }
                }

                else {
                    const firstPage = pages[page - 1]

                    if (Platform.OS == 'android') {
                        firstPage.drawText(signature, {
                            x: (firstPage.getWidth() * x) / (this.state.pageWidth) - 16 * 6,
                            y: (firstPage.getHeight() - ((firstPage.getHeight() * y) / this.state.pageHeight)) + paddingTop + 12 * this.state.pageHeight * 0.005,
                            size: 10,
                            lineHeight: 10,
                            color: rgb(0, 0, 0),
                        })
                    }

                    else {
                        firstPage.drawText(signature, {
                            x: (firstPage.getWidth() * x) / (this.state.pageWidth) - 16 * 6,
                            y: (firstPage.getHeight() - ((firstPage.getHeight() * y) / this.state.pageHeight)) + paddingTop + 16 * 2,
                            size: 12,
                            color: rgb(0.95, 0.1, 0.1),
                        })
                    }
                }

                this.setState({ loadingMessage: 'Génération du document signé...' })
                const pdfBytes = await pdfDoc.save()
                const pdfBase64 = uint8ToBase64(pdfBytes)
                const path = `${downloadDir}/Synergys/Documents/Scan signé ${moment().format('DD-MM-YYYY HHmmss')}.pdf`
                this.setState({ loadingMessage: 'Enregistrement du document signé...' })
                RNFS.writeFile(path, pdfBase64, "base64")
                    .then((success) => this.setState({
                        newPdfSaved: true,
                        newPdfPath: path,
                        pdfBase64,
                        pdfArrayBuffer: base64ToArrayBuffer(pdfBase64),
                        filePath: path
                    }))
                    .catch((err) => setToast(this, 'e', 'Erreur inattendue, veuillez réessayer.'))
                    .finally(() => loadLog(this, false, ''))
            }
            catch (e) {
                console.log('error...', e)
                displayError({ message: errorMessages.pdfGen })
            }
        }, 1000)

    }

    //5.1 Retry sign
    async retrySign() {
        try {
            //Delete new generated signed pdf from device
            loadLog(this, true, 'Réinitialisation du processus de signature...')
            await this.deleteFileFromLocal(this.state.newPdfPath)
            this.setState({ loadingMessage: 'Chargement du document original...' })
            //Reset original file
            this.setState({ filePath: this.originalFilePath, newPdfPath: null })
            await this.loadOriginalFile(this.originalFilePath)
            loadLog(this, false, '')
            //start signature
            this.startSignature()
        }
        catch (e) {
            Alert.alert('Erreur inattendue. Veuillez réessayer.')
        }
    }

    deleteFileFromLocal(filePath) {
        return RNFS.exists(filePath)
            .then((result) => {
                return RNFS.unlink(filePath)
            })
    }

    //5.2 Confirm sign
    async confirmSign() {
        try {
            await this.uploadSignedFile()
            //Data of proofs
            const ipLocalAddress = await NetworkInfo.getIPAddress()
            const ipV4Address = await NetworkInfo.getIPV4Address()
            const macAddress = await DeviceInfo.getMacAddress()
            const android_id = await DeviceInfo.getAndroidId()
            const app_name = await DeviceInfo.getApplicationName()
            const device = await DeviceInfo.getDevice()
            const device_id = await DeviceInfo.getDeviceId()

            //store max of data (Audit) about the signee
            const document = {
                attachment: this.state.signedAttachment,
                attachmentSource: 'signature',
                //Data of proofs
                sign_proofs_data: {
                    //User identity     
                    signedBy: {
                        id: this.currentUser.uid,
                        fullName: this.currentUser.displayName,
                        email: this.currentUser.email,
                        role: this.props.role.value
                    },
                    //only when signGenerated = true
                    //Timestamp
                    signedAt: moment().format(),//only when signGenerated = true
                    //Device data
                    phoneNumber: this.state.phoneNumber,//only when signGenerated = true
                    ipLocalAddress: ipLocalAddress,
                    ipV4Address: ipV4Address,
                    macAddress: macAddress,
                    android_id: android_id,
                    app_name: app_name,
                    device: device,
                    device_id: device_id,
                    //Signature reference
                    ref: this.state.ref,
                    //Other data
                    motif: this.state.motif,
                }
            }

            const newDocument = _.cloneDeep(document)
            newDocument.createdAt = moment().format()
            newDocument.createdBy = {
                id: this.currentUser.uid,
                fullName: this.currentUser.displayName,
                email: this.currentUser.email,
                role: this.props.role.value
            }

            await db.collection('Documents').doc(this.DocumentId).set(document, { merge: true })
            await db.collection('Documents').doc(this.DocumentId).collection('AttachmentHistory').add(newDocument)
            this.props.navigation.state.params.onGoBack && this.props.navigation.state.params.onGoBack() //refresh document to get url of new signed document
            this.props.navigation.pop(this.onSignaturePop)
        }

        catch (e) {
            setToast(this, 'e', "Erreur lors de l'importation du document signé, veuillez réessayer.")
        }

        finally {
            this.setState({ uploading: false })
        }
    }

    async uploadSignedFile() {
        try {
            this.setState({ uploading: true })
            const stats = await RNFetchBlob.fs.stat(this.state.newPdfPath)
            let signedAttachment = {
                path: this.state.newPdfPath,
                type: 'application/pdf',
                name: stats.filename,
                size: stats.size,
                progress: 0
            }
            this.setState({ signedAttachment })
            const metadata = {
                signedAt: moment().format(),
                signedBy: this.currentUser.uid,
                phoneNumber: this.state.phoneNumber
            }
            const storageRefPath = `Projects/${this.ProjectId}/Documents/${this.DocumentType}/${this.DocumentId}/${moment().format('ll')}/${signedAttachment.name}`
            const response = await this.uploadFile(signedAttachment, storageRefPath, true, metadata)
            return response
        }

        catch (e) {
            throw new Error("Erreur lors de l'importation du document.")
        }
    }

    renderAttachment() {
        let attachment = this.state.signedAttachment
        let readableSize = attachment.size / 1000
        readableSize = readableSize.toFixed(1)

        return (
            <View style={{ elevation: 1, backgroundColor: theme.colors.gray50, width: '90%', height: 60, alignSelf: 'center', borderRadius: 5, marginTop: 15 }}>
                <View style={{ flex: 0.9, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 0.17, justifyContent: 'center', alignItems: 'center' }}>
                        <MaterialCommunityIcons name='pdf-box' size={24} color={theme.colors.primary} />
                    </View>
                    <View style={{ flex: 0.68 }}>
                        <Text numberOfLines={1} ellipsizeMode='middle' style={[theme.customFontMSmedium.body]}>{attachment.name}</Text>
                        <Text style={[theme.customFontMSmedium.caption, { color: theme.colors.placeholder }]}>{readableSize} KB</Text>
                    </View>
                    <View style={{ flex: 0.15, justifyContent: 'center', alignItems: 'center' }} />
                </View>
                <View style={{ flex: 0.1, justifyContent: 'flex-end' }}>
                    <ProgressBar progress={attachment.progress} color={theme.colors.primary} visible={true} />
                </View>
            </View>
        )
    }

    handleBackButtonClick() {
        const { newPdfSaved } = this.state

        if (newPdfSaved) {
            const title = "Annuler la signature"
            const message = 'La signature ne sera pas enregistré'
            const handleConfirm = () => this.props.navigation.goBack(null)
            this.myAlert(title, message, handleConfirm)
        }
        else this.props.navigation.goBack(null)
        return true
    }

    onAcceptTerms() {
        //Auto Sign
        const isAutoSign = autoSignDocs.includes(this.DocumentType) //#task: add isGenerated as condition + remove Devis & Facture

        if (isAutoSign) {
            const config = docsConfig(0)
            const { signatures } = config[this.DocumentType]

            this.setState({
                showTerms: false,
                pdfEditMode: true,
                // toastType: 'info',
                // toastMessage: "Touchez à l'endroit où vous voulez placer la signature."
            }, () => this.handleSingleTap(null, null, null, true, signatures))
        }

        else this.startSignature()
        //#task: Replace this.startSignature by this.verifyUser
    }

    render() {
        let { fileDownloaded, filePath, pdfEditMode, newPdfSaved, showDialog, showTerms, uploading, loading, loadingMessage, toastType, toastMessage } = this.state
        var { canUpdate } = this.props.permissions.documents
        const { isConnected } = this.props.network

        if (uploading) {
            return (
                <View style={styles.container}>
                    <Appbar
                        back
                        title
                        titleText={'Importation du document signé...'}
                    />
                    {this.renderAttachment()}
                </View>
            )
        }

        else return (
            <View style={styles.container}>
                {!pdfEditMode &&
                    <Appbar
                        back={true}
                        title
                        titleText={this.fileName}
                        customBackHandler={this.handleBackButtonClick}
                    />
                }
                {fileDownloaded &&
                    <View style={styles.pdfContainer}>
                        <Pdf
                            minScale={1.0}
                            maxScale={1.0}
                            scale={1.0}
                            spacing={0}
                            fitPolicy={0}
                            enablePaging={true}
                            source={{ uri: filePath }}
                            usePDFKit={false}
                            onLoadComplete={(numberOfPages, filePath, { width, height }) => {
                                this.setState({ pageWidth: width, pageHeight: height })
                            }}
                            onPageSingleTap={(page, x, y) => {
                                this.handleSingleTap(page, x, y, false, [])
                            }}
                            style={[styles.pdf]} />
                    </View>
                }
                {!pdfEditMode && filePath &&
                    <View>
                        {newPdfSaved &&
                            <View style={styles.buttonsContainer}>
                                <TouchableOpacity onPress={this.retrySign} style={[styles.button1, { backgroundColor: theme.colors.white, borderWidth: StyleSheet.hairlineWidth, borderColor: theme.colors.gray_dark }]}>
                                    <Text style={[theme.customFontMSsemibold.body, { color: theme.colors.gray_dark, marginLeft: 5 }]}>RÉESSAYER</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={this.confirmSign} style={[styles.button1, { backgroundColor: theme.colors.primary }]}>
                                    <Text style={[theme.customFontMSsemibold.body, { color: '#fff', marginLeft: 5 }]}>VALIDER</Text>
                                </TouchableOpacity>
                            </View>}

                        {!newPdfSaved && fileDownloaded && isConnected && canUpdate &&
                            <TouchableOpacity onPress={() => this.setState({ showTerms: true })} style={styles.button2}>
                                <FontAwesome5 name='signature' size={17} color='#fff' style={{ marginRight: 7 }} />
                                <Text style={[theme.customFontMSsemibold.header, { color: '#fff', marginLeft: 7, letterSpacing: 1 }]}>SIGNER</Text>
                            </TouchableOpacity>
                        }
                    </View>
                }
                {showTerms &&
                    <TermsConditions
                        showTerms={showTerms}
                        toggleTerms={this.toggleTerms}
                        //acceptTerms={this.verifyUser}
                        acceptTerms={this.onAcceptTerms}
                        downloadPdf={() => {
                            setToast(this, 'i', 'Début du téléchargement...')
                            this.downloadFile(termsDir, termsUrl)
                        }} />
                }
                {showDialog && this.renderDialog()}
                {loading &&
                    <LoadDialog
                        loading={loading}
                        message={loadingMessage}
                    />
                }
                <Toast
                    duration={3500}
                    message={toastMessage}
                    type={toastType}
                    onDismiss={() => this.setState({ toastMessage: '' })}
                    containerStyle={{ bottom: 0 }}
                />
            </View >
        )
    }
}

const mapStateToProps = (state) => {
    return {
        role: state.roles.role,
        permissions: state.permissions,
        network: state.network,
        //fcmToken: state.fcmtoken
    }
}

export default connect(mapStateToProps)(Signature)

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerText: {
        color: "#508DBC",
        fontSize: 20,
        marginBottom: 20,
        alignSelf: "center"
    },
    pdfContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'pink',
    },
    pdf: {
        flex: 1,
        width: constants.ScreenWidth, //fixed to screen width
        backgroundColor: theme.colors.gray50
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 5
    },
    button1: {
        width: constants.ScreenWidth * 0.45,
        height: constants.ScreenWidth * 0.1,
        borderRadius: 5,
        alignItems: "center",
        //backgroundColor: theme.colors.primary,
        padding: 10,
        marginVertical: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15
    },
    button2: {
        width: constants.ScreenWidth * 0.9,
        alignSelf: 'center',
        borderRadius: 5,
        alignItems: "center",
        backgroundColor: theme.colors.primary,
        padding: 10,
        marginVertical: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 8
    },
    buttonText: {
        color: "#DAFFFF",
    },
    message: {
        alignItems: "center",
        paddingVertical: 2,
        paddingHorizontal: 15,
        backgroundColor: theme.colors.secondary
    },
    color: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'black'
    },
    dialogContainer: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: "center",
        justifyContent: "center",
    }
});



