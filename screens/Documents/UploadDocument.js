import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Keyboard, Alert, Platform, BackHandler } from 'react-native';
import { Card, Title, TextInput, ProgressBar } from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import firebase from '@react-native-firebase/app'
import { connect } from 'react-redux'

// import FilePickerManager from 'react-native-file-picker';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob'
import RNFS from 'react-native-fs'

import moment from 'moment';
import 'moment/locale/fr'
moment.locale('fr')

import OffLineBar from '../../components/OffLineBar'
import Appbar from '../../components/Appbar'
import MyInput from '../../components/TextInput'
import Picker from "../../components/Picker"
import Button from "../../components/Button"
import UploadProgress from "../../components/UploadProgress"
import Toast from "../../components/Toast"
import Loading from "../../components/Loading"

import { fetchDocs } from "../../api/firestore-api";
import { uploadFile, uploadFileOffline } from "../../api/storage-api";
import { generatetId, myAlert, updateField, downloadFile, nameValidator, setToast, load } from "../../core/utils";
import * as theme from "../../core/theme";
import { constants } from "../../core/constants";
import { handleFirestoreError } from '../../core/exceptions';

const db = firebase.firestore()

const states = [
    { label: 'A faire', value: 'A faire' },
    { label: 'En cours', value: 'En cours' },
    { label: 'Validé', value: 'Validé' },
]

const types = [
    { label: 'Bon de commande', value: 'Bon de commande' },
    { label: 'Devis', value: 'Devis' },
    { label: 'Facture', value: 'Facture' },
    { label: 'Dossier CEE', value: 'Dossier CEE' },
    { label: 'Prime de rénovation', value: 'Prime de rénovation' },
    { label: 'Aide et subvention', value: 'Aide et subvention' },
    { label: 'Action logement', value: 'Action logement' },
]

class UploadDocument extends Component {
    constructor(props) {
        super(props)
        this.customBackHandler = this.customBackHandler.bind(this)
        this.fetchDocument = this.fetchDocument.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleUpload = this.handleUpload.bind(this)
        this.persistDocument = this.persistDocument.bind(this)
        this.offLineSubmit = this.offLineSubmit.bind(this)
        // this.pickFile = this.pickFile.bind(this)
        this.pickDoc = this.pickDoc.bind(this)
        this.myAlert = myAlert.bind(this)
        this.showAlert = this.showAlert.bind(this)
        this.refreshProject = this.refreshProject.bind(this)
        this.uploadFile = uploadFile.bind(this)
        this.uploadFileOffline = uploadFileOffline.bind(this)
        this.deleteFile = this.deleteFile.bind(this)

        this.initialState = {}
        this.isInit = true
        this.currentUser = firebase.auth().currentUser

        this.DocumentId = this.props.navigation.getParam('DocumentId', '')
        this.isEdit = this.DocumentId ? true : false
        this.DocumentId = this.isEdit ? this.DocumentId : generatetId('GS-DOC-')

        this.title = this.DocumentId ? 'Nouveau document' : 'Modifier le document'
        this.project = this.props.navigation.getParam('project', '')

        this.cachePath = ''

        this.state = {
            //TEXTINPUTS
            name: { value: "Doc 1", error: '' },
            description: { value: "aaa", error: '' },

            //Screens
            project: { id: 'GS-PR-m5Ip', name: 'Projet A' },
            projectError: '',

            //Pickers
            state: 'A faire',
            type: 'Devis',

            //File Picker
            attachment: null,

            //logs
            createdBy: { id: '', fullName: '' },
            createdAt: '',
            editedBy: { id: '', fullName: '' },
            editededAt: '',
            signatures: [],

            error: '',
            loading: false,
            uploading: false,
            toastType: '',
            toastMessage: ''
        }
    }

    async componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.customBackHandler)

        if (this.isEdit) {
            await this.fetchDocument()
            await this.fetchSignees()
            this.attachmentListener()
        }

        else {
            if (this.project)  // coming from CreateProject Screen
                this.setState({ project: this.project }, () => this.initialState = this.state)

            else this.initialState = this.state
        }
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.customBackHandler)
        this.unsubscribeAttachmentListener && this.unsubscribeAttachmentListener()
    }

    //on Edit
    async fetchDocument() {
        await db.collection('Documents').doc(this.DocumentId).get().then((doc) => {

            let { project, name, description, type, state, attachment } = this.state
            let { createdAt, createdBy, editedAt, editedBy } = this.state
            let { error, loading } = this.state

            //General info
            const document = doc.data()
            project = document.project
            name.value = document.name
            description.value = document.description

            //َActivity
            createdAt = document.createdAt
            createdBy = document.createdBy
            editedAt = document.editedAt
            editedBy = document.editedBy

            //State & Type
            state = document.state
            type = document.type

            //Attachment
            attachment = document.attachment

            this.setState({ project, name, description, state, type, attachment, createdAt, createdBy, editedAt, editedBy }, () => {
                if (this.isInit)
                    this.initialState = this.state

                this.isInit = false
            })
        })
    }

    async fetchSignees() {
        let signatures = []

        db.collection('Documents').doc(this.DocumentId).collection('Attachments').get().then((querysnapshot) => {
            querysnapshot.forEach((doc) => {
                const document = doc.data()
                let signData = { signedBy: '', signedAt: '' }

                if (document.sign_proofs_data) {
                    signData.signedBy = document.sign_proofs_data.signedBy
                    signData.signedAt = document.sign_proofs_data.signedAt
                    signatures.push(signData)
                }
            })
            this.setState({ signatures })
        })
    }

    //1. after user come back online... an upload task started previously is now running
    //2. Detect when attachment is uploaded (pending = false)
    attachmentListener() {
        this.unsubscribeAttachmentListener = db.collection('Documents').doc(this.DocumentId).onSnapshot((doc) => {
            const prevAttachment = this.state.attachment
            if (!prevAttachment) return

            const nextAttachment = doc.data().attachment

            const prevStatus = prevAttachment.pending
            const nextStatus = nextAttachment.pending

            if (prevStatus && !nextStatus) {
                this.setState({ attachment: nextAttachment })
            }
        })
    }

    //Delete document
    showAlert() {
        const title = "Supprimer le document"
        const message = 'Etes-vous sûr de vouloir supprimer ce document ? Cette opération est irreversible.'
        const handleConfirm = () => this.handleDelete()
        this.myAlert(title, message, handleConfirm)
    }

    async handleDelete() {
        await db.collection('Documents').doc(this.DocumentId).update({ deleted: true })
            .then(async () => this.props.navigation.goBack()) //removed deleteAttachment: Client wants to keep all files archived.
            .catch((e) => console.error(e))
    }

    async pickDoc() {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf],
            })

            //Android only
            if (res.uri.startsWith('content://')) {
                //const uriComponents = res.uri.split('/')
                //const fileNameAndExtension = uriComponents[uriComponents.length - 1]
                this.cachePath = `${RNFS.TemporaryDirectoryPath}/${'temporaryDoc'}${Date.now()}`

                await RNFS.copyFile(res.uri, this.cachePath) //copy file to get access to the relative path. DocumentPicker (with android) provides only absolute path which cannot be used with firebase storage
                    .then(() => {
                        const attachment = {
                            path: this.cachePath,
                            type: 'application/pdf',
                            name: `Scan-${moment().format('DD-MM-YYYY-HHmmss')}.pdf`,
                            size: res.size,
                            progress: 0
                        }

                        this.setState({ attachment })
                    })
                    .catch((e) => Alert.alert(e))
            }
        }

        catch (err) {
            if (DocumentPicker.isCancel(err)) return
            else Alert.alert(err)
        }
    }

    //Offline (Creation only) **************************************************************
    async offLineSubmit() {
        if (this.isEdit) {
            Alert.alert('', 'Les mises à jours sont indisponibles en mode hors-ligne')
            return
        }

        // //Handle isLoading or No edit done
        // if (this.state.loading || this.state === this.initialState) return

        // load(this, true)

        // //0. Validate inputs
        // const isValid = this.validateInputs()
        // if (!isValid) return


        //Upload file (store it on cache so user can view it)
        await this.handleUploadOffline()

        //SetDocument
        this.handlePersistOffline()
    }

    async handleUploadOffline() {
        //1. Upload file
        var { project, name, description, type, state, attachment } = this.state

        const reference = firebase.storage().ref(`Projects/${project.id}/Documents/${type}/${this.DocumentId}/${moment().format('ll')}/${attachment.name}`)
        this.uploadFileOffline(attachment, reference, this.DocumentId)

        //Optional: Move document to Synergys/Documents (to open & sign later.. without downloading file)
        const fromPath = this.cachePath
        const Dir = Platform.OS === 'ios' ? RNFetchBlob.fs.dirs.DocumentDir : RNFetchBlob.fs.dirs.DownloadDir //#issue: DownloadDir (SD card) is not always available on device
        const destPath = `${Dir}/Synergys/Documents/${attachment.name}`
        await RNFS.moveFile(fromPath, destPath)
    }

    handlePersistOffline() {
        // 2. ADDING document to firestore
        const { project, name, description, type, state, attachment } = this.state
        const currentUser = { id: this.currentUser.uid, fullName: this.currentUser.displayName }
        attachment.pending = true
        console.log('ATTACHMENT', attachment)

        let document = {
            project: project,
            name: name.value,
            description: description.value,
            type: type,
            state: state,
            attachment: attachment, //To Keep track of last attached file
            editedAt: moment().format('lll'),
            editedBy: currentUser,
            deleted: false,
        }

        if (!this.isEdit) {
            document.createdAt = moment().format('lll')
            document.createdBy = currentUser
        }

        console.log('Ready to add document & attachment...')
        const batch = db.batch()
        const documentRef = db.collection('Documents').doc(this.DocumentId)
        const attachmentsRef = db.collection('Documents').doc(this.DocumentId).collection('Attachments').doc()
        batch.set(documentRef, document, { merge: true })
        batch.set(attachmentsRef, attachment)
        batch.commit() //commit locally

        console.log('going back...')
        this.props.navigation.goBack() //#task: SetTimeout
    }

    //Online ******************************************************************************
    async handleSubmit() {
        //Handle isLoading or No edit done
        if (this.state.loading || this.state === this.initialState) return

        load(this, true)

        //0. Validate inputs
        const isValid = this.validateInputs()
        if (!isValid) return

        //1. Upload attachment
        const newAttachment = this.state.attachment
        const intialAttachment = this.initialState.attachment


        if (newAttachment && (this.isEdit && newAttachment !== intialAttachment || !this.isEdit)) {  //Overwrite or Create new attachment
            const uploadResult = await this.handleUpload()
            if (uploadResult === 'failure') return
        }

        await this.persistDocument()
    }

    validateInputs() {
        let { project, name, attachment } = this.state

        let projectError = nameValidator(project.id, '"Projet"')
        let nameError = nameValidator(name.value, '"Nom du document"')

        if (projectError || nameError) {
            name.error = nameError
            Keyboard.dismiss()
            this.setState({ projectError, name, loading: false })
            return false
        }

        return true
    }

    async handleUpload() {
        //1. Upload file
        const promise = new Promise(async (resolve, reject) => {

            var { project, name, description, type, state, attachment } = this.state

            this.setState({ uploading: true })
            const reference = firebase.storage().ref(`Projects/${project.id}/Documents/${type}/${this.DocumentId}/${moment().format('ll')}/${attachment.name}`)
            const result = await this.uploadFile(attachment, reference, true)
            this.setState({ uploading: false })

            if (result === 'failure') {
                this.setState({ uploading: false, loading: false })
                setToast(this, 'e', "Erreur lors de l'exportation de la pièce jointe, veuillez réessayer.")
                reject('failure')
            }

            //Optional: Move document to Synergys/Documents (to open & sign later.. without downloading file)
            const fromPath = this.cachePath
            const Dir = Platform.OS === 'ios' ? RNFetchBlob.fs.dirs.DocumentDir : RNFetchBlob.fs.dirs.DownloadDir //#issue: DownloadDir (SD card) is not always available on device
            const destPath = `${Dir}/Synergys/Documents/${attachment.name}`
            await RNFS.moveFile(fromPath, destPath)

            resolve('success')
        })

        return promise
    }

    async persistDocument() {
        // 2. ADDING document to firestore
        const { project, name, description, type, state, attachment } = this.state
        const currentUser = { id: this.currentUser.uid, fullName: this.currentUser.displayName }

        let document = {
            project: project,
            name: name.value,
            description: description.value,
            type: type,
            state: state,
            attachment: attachment, //To Keep track of last attached file
            editedAt: moment().format('lll'),
            editedBy: currentUser,
            deleted: false,
        }

        if (!this.isEdit) {
            document.createdAt = moment().format('lll')
            document.createdBy = currentUser
        }

        console.log('Ready to add document & attachment...')
        const batch = db.batch()
        const documentRef = db.collection('Documents').doc(this.DocumentId)
        const attachmentsRef = db.collection('Documents').doc(this.DocumentId).collection('Attachments').doc()
        batch.set(documentRef, document, { merge: true })
        batch.set(attachmentsRef, attachment)

        batch.commit()
            .then(() => this.props.navigation.goBack())
            .catch(e => handleFirestoreError(e))
            .finally(() => this.setState({ uploading: false, loading: false }))
    }

    async deleteFile() {
        let fileRef = firebase.storage().refFromURL(this.initialState.attachment.downloadURL)
        await fileRef.delete().catch(e => {
            this.setState({ loading: false })
            setToast(this, 'e', 'Erreur inattendue, veuillez réessayer.')
        })
    }

    refreshProject(project) {
        this.setState({ project, projectError: '' })
    }

    renderAttachment() {
        const { attachment } = this.state
        return <UploadProgress attachment={attachment} />
    }

    renderSignees() {
        const { signatures } = this.state

        return signatures.map((signature, index) => {
            const { signedAt, signedBy } = signature
            const signDate = moment(signedAt, 'lll').format('ll')
            const signTime = moment(signedAt, 'lll').format('HH:mm')
            const navigateToSigneeProfile = () => this.props.navigation.navigate('Profile', { userId: signedBy.id })

            return (
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: 30, marginBottom: 10 }}>
                    <MaterialCommunityIcons name='pen' size={24} color={theme.colors.placeholder} />
                    <View>
                        <Text numberOfLines={1} style={[theme.customFontMSmedium.body, { marginLeft: 15 }]}>
                            <Text style={[theme.customFontMSsemibold.body, { color: theme.colors.primary }]} onPress={navigateToSigneeProfile}>{signedBy.fullName}</Text>
                             a signé le document</Text>
                        <Text style={[theme.customFontMSmedium.caption, { marginLeft: 15, color: theme.colors.placeholder }]}>le {signDate} à {signTime}</Text>
                    </View>
                </View>
            )
        })
    }

    customBackHandler() {
        const { loading, uploading } = this.state

        if (loading || uploading) {
            this.uploadTask.pause()

            const title = "Annuler l'opération"
            const message = "Êtes-vous sûr(e) de vouloir annuler l'exportation du document. Toutes les nouvelles données saisies seront perdues."

            const handleConfirm = () => {
                this.uploadTask.cancel()
                this.props.navigation.goBack()
            }

            const handleCancel = () => this.uploadTask.resume()

            this.myAlert(title, message, handleConfirm, handleCancel)
        }

        else this.props.navigation.goBack(null)
        return true
    }

    renderAttachmentInput() {
        const { attachment } = this.state

        if (attachment && attachment.pending)
            return (
                <TouchableOpacity style={{ marginTop: 15 }}>
                    <Text style={[theme.customFontMSmedium.caption, { color: theme.colors.placeholder }]}>Pièce jointe</Text>
                    <UploadProgress attachment={attachment} showProgress={false} pending={true} onPress={() => {
                        if (firebase.auth().currentUser.uid === this.state.editedBy.id)
                            Alert.alert("", "L'exportation de la pièce jointe va commencer dès que votre appareil se connecte à internet.")

                        else //In case another user views the document while the attachment is still uploading.
                            Alert.alert("", "Ce document est en cours d'exportation par un autre utilisateur. Le document sera bientôt disponible, veuillez patienter...")
                    }} />
                </TouchableOpacity>
            )

        else return (
            <TouchableOpacity onPress={this.pickDoc}>
                <MyInput
                    label="Pièce jointe"
                    value={attachment && attachment.name}
                    editable={false}
                    multiline
                    right={<TextInput.Icon name='attachment' color={theme.colors.placeholder} onPress={this.pickDoc} />} />
            </TouchableOpacity>
        )
    }

    render() {
        let { project, name, description, type, state, attachment } = this.state
        let { createdAt, createdBy, editedAt, editedBy, signatures } = this.state
        let { error, loading, uploading, toastType, toastMessage, projectError } = this.state

        const { isConnected } = this.props.network

        return (
            <View style={styles.container}>
                {!isConnected && <OffLineBar />}
                <Appbar back close customBackHandler={this.customBackHandler} title titleText={loading ? 'Exportation du document...' : this.isEdit ? name.value : 'Nouveau document'} check={!loading} handleSubmit={isConnected ? this.handleSubmit : this.offLineSubmit} del={this.isEdit && !loading} handleDelete={this.showAlert} />

                {loading ?
                    <View style={{ flex: 1 }}>
                        {uploading && this.renderAttachment()}
                        <Loading size='small' style={{ justifyContent: 'flex-start', marginTop: 15 }} />
                    </View>
                    :
                    <View style={{ flex: 1 }}>
                        {this.isEdit && attachment && !attachment.pending && isConnected &&
                            <Button mode="outlined" style={{ marginTop: 0 }} onPress={() => {
                                const { project, type, attachment } = this.initialState
                                this.props.navigation.navigate('Signature', { onGoBack: this.fetchDocument, ProjectId: project.id, DocumentId: this.DocumentId, DocumentType: type, fileName: attachment.name, url: attachment.downloadURL })
                            }}>
                                <Text style={[theme.customFontMSmedium.body, { textAlign: 'center', color: theme.colors.primary }]}>AFFICHER LE DOCUMENT</Text>
                            </Button>
                        }

                        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: constants.ScreenWidth * 0.02 }}>

                            <Card style={{ margin: 5 }}>
                                <Card.Content>
                                    <Title>Informations générales</Title>

                                    <MyInput
                                        label="Numéro du document"
                                        returnKeyType="done"
                                        value={this.DocumentId}
                                        editable={false}
                                        disabled
                                    />


                                    {this.renderAttachmentInput()}

                                    <MyInput
                                        label="Nom du document"
                                        returnKeyType="done"
                                        value={name.value}
                                        onChangeText={text => updateField(this, name, text)}
                                        error={!!name.error}
                                        errorText={name.error}
                                        multiline={true}
                                    />

                                    <TouchableOpacity onPress={() => this.props.navigation.push('ListProjects', { onGoBack: this.refreshProject, prevScreen: 'UploadDocument', isRoot: false, titleText: 'Choix du projet', showFAB: false })}>
                                        <MyInput
                                            label="Choisir un projet"
                                            value={project.name}
                                            error={!!projectError}
                                            errorText={projectError}
                                            editable={false} />
                                    </TouchableOpacity>

                                    <MyInput
                                        label="Description"
                                        returnKeyType="done"
                                        value={description.value}
                                        onChangeText={text => updateField(this, description, text)}
                                        error={!!description.error}
                                        errorText={description.error}
                                        multiline={true}
                                    />

                                    <Picker
                                        returnKeyType="next"
                                        value={type}
                                        error={!!type.error}
                                        errorText={type.error}
                                        selectedValue={type}
                                        onValueChange={(type) => this.setState({ type })}
                                        title="Type"
                                        elements={types}
                                    />

                                    <Picker
                                        returnKeyType="next"
                                        value={state}
                                        error={!!state.error}
                                        errorText={state.error}
                                        selectedValue={state}
                                        onValueChange={(state) => this.setState({ state })}
                                        title="Etat"
                                        elements={states}
                                    />
                                </Card.Content>
                            </Card>

                            {this.isEdit &&
                                <Card style={{ margin: 5 }}>
                                    <Card.Content>
                                        <Title style={{ marginBottom: 15 }}>Activité</Title>

                                        {signatures !== [] && this.renderSignees()}

                                        <MyInput
                                            label="Date de création"
                                            returnKeyType="done"
                                            value={createdAt}
                                            editable={false}
                                        />

                                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile', { userId: createdBy.id })}>
                                            <MyInput
                                                label="Crée par"
                                                returnKeyType="done"
                                                value={createdBy.fullName}
                                                editable={false}
                                                link
                                            />
                                        </TouchableOpacity>

                                        <MyInput
                                            label="Dernière mise à jour"
                                            returnKeyType="done"
                                            value={editedAt}
                                            editable={false}
                                        />

                                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile', { userId: editedBy.id })}>
                                            <MyInput
                                                label="Dernier intervenant"
                                                returnKeyType="done"
                                                value={editedBy.fullName}
                                                editable={false}
                                                link
                                            />
                                        </TouchableOpacity>

                                    </Card.Content>
                                </Card>
                            }

                        </ScrollView>

                        <View style={styles.footerContainer}>
                            <Button
                                mode={this.isEdit ? "contained" : "outlined"}
                                style={[styles.signButton, { backgroundColor: this.isEdit && attachment && !attachment.pending ? theme.colors.primary : theme.colors.gray50 }]}
                                onPress={() => {
                                    const { project, type, attachment } = this.initialState
                                    if (!isConnected) {
                                        Alert.alert('', 'La signature digitale est indisponible en mode hors-ligne.')
                                        return
                                    }

                                    if (this.isEdit && attachment && !attachment.pending) {
                                        this.props.navigation.navigate('Signature', { onGoBack: this.fetchDocument, ProjectId: project.id, DocumentId: this.DocumentId, DocumentType: type, fileName: attachment.name, url: attachment.downloadURL, initMode: 'sign' })
                                    }
                                }}>
                                <Text style={[theme.customFontMSmedium.body, { color: this.isEdit && attachment && !attachment.pending ? '#fff' : theme.colors.gray }]}>signer</Text>
                            </Button>
                        </View>

                        <Toast
                            message={toastMessage}
                            type={toastType}
                            onDismiss={() => this.setState({ toastMessage: '' })} />
                    </View>
                }

            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        role: state.roles.role,
        network: state.network
        //fcmToken: state.fcmtoken
    }
}

export default connect(mapStateToProps)(UploadDocument)



const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    fab: {
        //flex: 1,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end',
        marginBottom: 10,
        width: 50,
        height: 50,
        borderRadius: 100,
    },
    footerContainer: {
        flexDirection: 'row',
        borderColor: theme.colors.gray100,
        borderWidth: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        backgroundColor: '#DCEDC8'
    },
    signButton: {
        width: constants.ScreenWidth * 0.25,
        height: constants.ScreenWidth * 0.09,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15
    }
})






//OLD
   // async deleteAttachment(docURL) {
    //     let fileRef = firebase.storage().refFromURL(docURL)
    //     await fileRef.delete()
    //         .then(() => console.log('File deleted from cloud storage'))
    //         .catch(e => console.error(e))
    // }

    // pickFile() {
    //     FilePickerManager.showFilePicker(null, (response) => {
    //         console.log('Response = ', response)

    //         if (response.didCancel) {
    //             console.log('User cancelled file picker');
    //         }
    //         else if (response.error) {
    //             console.log('FilePickerManager Error: ', response.error);
    //         }
    //         else {
    //             const attachment = {
    //                 path: response.path,
    //                 type: response.type,
    //                 name: `Scan ${moment().format('DD-MM-YYYY HHmmss')}.pdf`,
    //                 //name: response.fileName,
    //                 size: response.readableSize,
    //                 progress: 0
    //             }

    //             this.setState({ attachment, attachmentError: '' })
    //         }
    //     })
    // }