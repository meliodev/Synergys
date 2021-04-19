import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Keyboard, Alert, Platform, BackHandler } from 'react-native';
import { Card, Title, TextInput } from 'react-native-paper'
import { connect } from 'react-redux'
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs'
import { faCloudUploadAlt, faMagic, faFileInvoice, faFileInvoiceDollar, faBallot, faFileCertificate, faFile, faFolderPlus, faHandHoldingUsd, faHandshake, faHomeAlt, faGlobeEurope, faReceipt, faFilePlus, faFileSearch, faFileAlt, faFileEdit, faPen, fal } from '@fortawesome/pro-light-svg-icons'
import _ from 'lodash'

import moment from 'moment';
import 'moment/locale/fr'
moment.locale('fr')

import Appbar from '../../components/Appbar'
import AddAttachment from '../../components/AddAttachment'
import MyInput from '../../components/TextInput'
import Picker from "../../components/Picker"
import ItemPicker from "../../components/ItemPicker"
import Button from "../../components/Button"
import ModalOptions from "../../components/ModalOptions"
import UploadProgress from "../../components/UploadProgress"
import Toast from "../../components/Toast"
import Loading from "../../components/Loading"
import LoadDialog from "../../components/LoadDialog"

import firebase, { db } from '../../firebase'
import { fetchDocs } from "../../api/firestore-api";
import { uploadFileNew } from "../../api/storage-api";
import { generateId, navigateToScreen, myAlert, updateField, downloadFile, nameValidator, setToast, load, pickDoc, articles_fr, isEditOffline, setPickerDocTypes } from "../../core/utils";
import * as theme from "../../core/theme";
import { constants } from "../../core/constants";
import { blockRoleUpdateOnPhase } from '../../core/privileges';
import { handleFirestoreError } from '../../core/exceptions';
import CustomIcon from '../../components/CustomIcon';

const states = [
    { label: 'A faire', value: 'A faire' },
    { label: 'En cours', value: 'En cours' },
    { label: 'Validé', value: 'Validé' },
]

const docSources = [
    { label: 'Importer', value: 'upload', icon: faCloudUploadAlt },
    { label: 'Générer', value: 'generate', icon: faMagic }
]

const genSources = [
    { label: 'Une commande existante', value: 'oldOrder', icon: faFileSearch },
    { label: 'Une nouvelle commande', value: 'newOrder', icon: faFilePlus },
]

class UploadDocument extends Component {
    constructor(props) {
        super(props)

        //Inputs
        this.refreshProject = this.refreshProject.bind(this)

        //Attachment handlers
        this.pickDoc = this.pickDoc.bind(this)
        this.onPressAttachment = this.onPressAttachment.bind(this)
        this.onPressUploadPending = this.onPressUploadPending.bind(this)

        //Submit
        this.handleSubmit = this.handleSubmit.bind(this)
        this.persistDocument = this.persistDocument.bind(this)
        this.uploadFile = this.uploadFile.bind(this)
        this.uploadFileNew = uploadFileNew.bind(this)

        //Document source (gen/upload)
        this.resetModalOptions = this.resetModalOptions.bind(this)
        this.modalOptionsConfig = this.modalOptionsConfig.bind(this)
        this.toggleModal = this.toggleModal.bind(this)
        this.startGenPdf = this.startGenPdf.bind(this) //Start Pdf gen flow
        this.getGenPdf = this.getGenPdf.bind(this) //End Pdf gen flow

        //Delete
        this.myAlert = myAlert.bind(this)
        this.showAlert = this.showAlert.bind(this)
        this.deleteFile = this.deleteFile.bind(this)

        //Init
        this.fetchDocument = this.fetchDocument.bind(this)
        this.initialState = {}
        this.isInit = true
        this.currentUser = firebase.auth().currentUser

        //Params
        this.DocumentId = this.props.navigation.getParam('DocumentId', '')
        this.isEdit = this.DocumentId !== ''
        this.DocumentId = this.isEdit ? this.DocumentId : generateId('GS-DOC-')

        //Navigation goBack behaviours
        this.onSignaturePop = this.props.navigation.getParam('onSignaturePop', 1)

        //Process params
        this.dynamicType = this.props.navigation.getParam('dynamicType', false)
        this.documentType = this.props.navigation.getParam('documentType', undefined) //Not editable
        this.project = this.props.navigation.getParam('project', undefined) //Not editable

        const currentRole = this.props.role.id
        this.types = setPickerDocTypes(currentRole, this.dynamicType, this.documentType)
        this.docSources = docSources
        this.genSources = genSources

        this.state = {
            //TEXTINPUTS
            name: { value: "", error: '' },
            description: { value: "", error: '' },

            //Screens
            project: this.project || { id: '', name: '' },
            projectError: '',

            //Pickers
            state: 'En cours',
            type: (this.documentType && this.documentType.value) || 'Autre',

            //File Picker
            attachment: null,

            //Logs
            createdBy: { id: '', fullName: '' },
            createdAt: '',
            editedBy: { id: '', fullName: '' },
            editededAt: '',
            signatures: [],

            //Pdf generation
            showModal: false,
            modalContent: 'docTypes',
            attachmentSource: '', //upload or generation or conversion
            order: null,
            checked: '',

            error: '',
            loading: false,
            loadingConversion: false,
            toastType: '',
            toastMessage: ''
        }
    }

    async componentDidMount() {

        if (this.isEdit) {
            await this.fetchDocument(this.DocumentId)
            await this.fetchSignees()
            this.attachmentListener(this.DocumentId)
        }

        else {
            if (this.project)  // coming from CreateProject Screen
                this.setState({ project: this.project }, () => this.initialState = _.cloneDeep(this.state))

            else this.initialState = _.cloneDeep(this.state)
        }
    }

    componentWillUnmount() {
        this.resetModalOptions()
        this.unsubscribeAttachmentListener && this.unsubscribeAttachmentListener()
    }

    //on Edit
    async fetchDocument(DocumentId) {
        await db.collection('Documents').doc(DocumentId).get().then((doc) => {

            let { project, name, description, type, state, attachment, order } = this.state
            let { createdAt, createdBy, editedAt, editedBy, loading } = this.state

            //General info
            const document = doc.data()
            project = document.project
            name.value = document.name
            description.value = document.description
            order = document.orderData

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

            this.setState({ project, name, description, order, createdAt, createdBy, editedAt, editedBy, state, type, attachment }, () => {
                // if (this.isInit)
                this.initialState = _.cloneDeep(this.state)
                // this.isInit = false
            })
        })
    }

    async fetchSignees() {
        let signatures = []

        return db.collection('Documents').doc(this.DocumentId).collection('AttachmentHistory').get().then((querysnapshot) => {
            if (querysnapshot.empty) return

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

    //A user starts an upload task while offline.. After user comes back online... the upload task starts running.
    // --> Listener to detect when the attachment is uploaded (pending = false)
    attachmentListener(DocumentId) {
        this.unsubscribeAttachmentListener = db.collection('Documents').doc(DocumentId).onSnapshot((doc) => {

            const prevAttachment = this.state.attachment
            if (!prevAttachment) return

            const nextAttachment = doc.data().attachment

            const prevStatus = prevAttachment.pending
            const nextStatus = nextAttachment.pending

            if (!nextStatus) { //#IMPORTANT Switch to Edit Mode after upload completes
                this.isEdit = true
                this.setState({ loading: false, loadingConversion: false })
                this.fetchDocument(DocumentId)
            }

            if (prevStatus && !nextStatus) {
                this.setState({ attachment: nextAttachment })
                // setToast(this, 's', 'Le document a été exporté avec succès.')
            }
        })
    }

    //Submit handler
    async handleSubmit(isConversion, DocumentId) {
        Keyboard.dismiss()

        //Reject offline updates
        const { isConnected } = this.props.network
        let isEditOffLine = isEditOffline(this.isEdit, isConnected)
        if (isEditOffLine) return

        //0. Handle isLoading or No edit done
        if (this.state.loading || _.isEqual(this.state, this.initialState)) return
        load(this, true)

        if (isConversion) {
            this.setState({ loadingConversion: true })
        }

        //1. Validate inputs
        const isValid = this.validateInputs()
        if (!isValid) return

        //POSEUR & COMMERCIAL PHASES UPDATES PRIVILEGES: Check if user has privilege to update selected project
        const currentRole = this.props.role.id
        const isBlockedUpdates = blockRoleUpdateOnPhase(currentRole, this.state.project.step)
        if (isBlockedUpdates) {
            Alert.alert('Accès refusé', `Utilisateur non autorisé à modifier un projet dans la phase ${this.state.project.step}.`)
            load(this, false)
            return
        }

        //2. SetDocument (Initiate attachment with pending = true)
        this.persistDocument(isConversion, DocumentId)

        //3. Handle upload offline (an upload file can not be edited)
        if (!_.isEqual(this.state.attachment, this.initialState.attachment)) {

            if (!this.isEdit) {
                this.attachmentListener(DocumentId) //Listens when pending = false and refreshes attachment
            }

            const fileUploaded = await this.uploadFile(isConversion, DocumentId)

            if (isConversion) {
                this.isEdit = true
                this.setState({ loading: false, loadingConversion: false })
                this.fetchDocument(DocumentId)
            }

            if (!fileUploaded) {
                setToast(this, 'e', "Erreur lors de l'exportation de la pièce jointe, veuillez réessayer.") //#task: put it on redux store
                return
            }
        }

        //4. Go back if we came here from process action
        if (this.documentType) {
            this.props.navigation.goBack()
        }
    }

    validateInputs() {
        let { project, name, attachment } = this.state

        let projectError = nameValidator(project.id, '"Projet"')
        let nameError = nameValidator(name.value, '"Nom du document"')

        if (projectError || nameError) {
            name.error = nameError
            Keyboard.dismiss()
            this.setState({ projectError, name, loading: false, loadingConversion: false })
            return false
        }

        return true
    }

    async persistDocument(isConversion, DocumentId) {
        //1. ADDING document to firestore
        const { project, name, description, type, state, attachment, attachmentSource, order } = this.state
        const currentUser = { id: this.currentUser.uid, fullName: this.currentUser.displayName }

        if (!_.isEqual(attachment, this.initialState.attachment))
            attachment.pending = true

        let document = {
            project,
            name: name.value,
            description: description.value,
            type,
            state,
            attachment, //To Keep track of last attached file
            attachmentSource,
            editedAt: moment().format(),
            editedBy: currentUser,
            orderData: order,
            deleted: false,
        }

        if (!this.isEdit || isConversion) {
            document.createdAt = moment().format()
            document.createdBy = currentUser
        }

        if (isConversion) {
            document.name = `${document.name} (Facture générée)`
            document.type = 'Facture'
            document.attachmentSource = 'conversion'
            document.conversionSource = this.DocumentId //Id of the current "Devis"
        }

        console.log('Ready to set document...')
        const batch = db.batch()
        const documentRef = db.collection('Documents').doc(DocumentId)
        const attachmentsRef = db.collection('Documents').doc(DocumentId).collection('AttachmentHistory').doc()
        batch.set(documentRef, document, { merge: true })
        batch.set(attachmentsRef, attachment)
        batch.commit()
        //.catch(e => handleFirestoreError(e))  //Online Only
        // setTimeout(() => this.props.navigation.goBack(), 2000) //#task: stay here
    }

    async uploadFile(isConversion, DocumentId) {
        var { project, type, attachment } = this.state

        // if (this.isEdit && !isConversion && attachment && attachment.pending) { //creation + not conversion
        //     console.log('................')
        //     return //User tries to update Document data while an attachment is still pending..
        // }

        const storageRefPath = `Projects/${project.id}/Documents/${type}/${DocumentId}/${moment().format('ll')}/${attachment.name}`
        const fileUploaded = await this.uploadFileNew(attachment, storageRefPath, DocumentId, false)

        return fileUploaded
    }

    //Delete document
    showAlert() {
        const title = "Supprimer le document"
        const message = 'Etes-vous sûr de vouloir supprimer ce document ? Cette opération est irreversible.'
        const handleConfirm = () => this.handleDelete()
        this.myAlert(title, message, handleConfirm)
    }

    handleDelete() {
        db.collection('Documents').doc(this.DocumentId).update({ deleted: true })
        this.props.navigation.goBack() //removed deleteAttachment: Client wants to keep all files archived.
    }

    //Delete #task: handle online and offline
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

    //Attachment component handlers
    onPressAttachment(canWrite) {

        if (!canWrite) return

        if (!this.isEdit && !this.documentType)  //Creation & not pre-defined document type
            this.toggleModal()

        else {
            const type = this.isEdit ? this.state.type : this.documentType.value //this.isEdit || !this.isEdit && this.documentType
            let isQuoteOrBill = type === 'Devis' || type === 'Facture'
            if (isQuoteOrBill)
                this.setState({ modalContent: 'docSources', showModal: true })
            else this.pickDoc()
        }

        return
    }

    onPressUploadPending(uploadRunning) {
        if (firebase.auth().currentUser.uid === this.state.editedBy.id) {
            if (uploadRunning) return
            else Alert.alert("", "L'exportation de la pièce jointe va commencer dès que votre appareil se connecte à internet.")
        }

        //In case remote user presses the attachment while it is still pending.
        else Alert.alert("", "Ce document est en cours d'exportation. Le document sera bientôt disponible, veuillez patienter...")
    }

    renderAttachment(canWrite) {
        const { attachment } = this.state

        //upload task is running -> show progress for local user
        if (attachment) {
            var reduxAttachment = this.props.documents.newAttachments[this.DocumentId] || null
            attachment.progress = reduxAttachment ? reduxAttachment.progress : null
            var uploadNotRunning = (!reduxAttachment || reduxAttachment && reduxAttachment.progress === 0) //remote user & local user before upload starts
        }

        if (attachment && attachment.pending) { //local & remote 
            return (
                <TouchableOpacity style={{ marginTop: 15 }}>
                    <Text style={[theme.customFontMSmedium.caption, { color: theme.colors.placeholder }]}>Pièce jointe</Text>
                    <UploadProgress attachment={attachment} showProgress={reduxAttachment} pending={uploadNotRunning} onPress={() => this.onPressUploadPending(!uploadNotRunning)} />
                </TouchableOpacity>
            )
        }

        else if (attachment && !attachment.pending) {
            return (
                <TouchableOpacity
                    onPress={() => this.onPressAttachment(canWrite)}>
                    <MyInput
                        label="Pièce jointe"
                        value={attachment && attachment.name}
                        editable={false}
                        multiline
                        right={<TextInput.Icon name='attachment' color={theme.colors.placeholder} onPress={() => this.onPressAttachment(canWrite)} />}
                    />
                </TouchableOpacity>
            )
        }

        else if (!attachment) {
            return (
                <View style={{ marginVertical: 10, marginTop: 15 }}>
                    <Text style={[theme.customFontMSregular.caption, { marginBottom: 5 }]}>Pièce jointe</Text>
                    <AddAttachment
                        style={{ marginTop: 5 }}
                        onPress={() => this.onPressAttachment(canWrite)}
                    />
                </View>
            )
        }
    }

    //*********************** Pdf generation flow ***************************
    toggleModal() {
        this.setState({ showModal: !this.state.showModal, modalContent: 'docTypes' })
    }

    modalOptionsConfig() {

        const { modalContent, type } = this.state
        const masculins = ['Devis', 'Bon de commande', 'Dossier CEE']

        if (modalContent === 'docTypes') {
            return {
                title: `Choisissez le type du document`,
                columns: 3,
                elements: this.types,
            }
        }

        else if (modalContent === 'docSources') {
            return {
                title: `Créer ${articles_fr('un', masculins, type)} ${type.toLowerCase()}`,
                columns: 2,
                elements: this.docSources,
            }
        }

        else if (modalContent === 'genSources') {
            return {
                title: `Générer ${articles_fr('un', masculins, type)} ${type.toLowerCase()} à partir de:`,
                columns: 2,
                elements: this.genSources,
            }
        }
    }

    resetModalOptions() {
        const { attachment, type } = this.initialState
        this.setState({ attachment, type })
    }

    async pickDoc() {
        const attachment = await pickDoc(true, [DocumentPicker.types.pdf])

        if (attachment.hasCanceled) {
            const { attachment, type } = this.initialState
            this.setState({ attachment, type })
            return
        }

        this.setState({ attachment, order: null }) //order: Form fields to generate a pdf 
    }

    startGenPdf(index) {
        const { type } = this.state
        this.toggleModal()
        const navParams = { autoGenPdf: true, docType: type, DocumentId: this.DocumentId, project: this.project, onGoBack: this.getGenPdf }

        //Existing order
        if (index === 0) {
            navParams.isRoot = false
            navParams.titleText = 'Choix de la commande'
            navParams.popCount = 3
            this.props.navigation.navigate('ListOrders', navParams)
        }

        //New order
        else if (index === 1) {
            navParams.popCount = 2
            this.props.navigation.navigate('CreateOrder', navParams)
        }

        return
    }

    getGenPdf(genPdf) {
        const { pdfBase64Path: path, pdfName: name, order, isConversion } = genPdf
        //order: The order from which this "Devis" was generated
        //isConversion: Conversion from Devis to Facture (boolean)

        const attachment = {
            path,
            type: 'application/pdf',
            name,
            size: 100,
            progress: 0,
        }

        this.setState({ attachment, order }, () => {
            if (isConversion) {
                var DocumentId = genPdf.DocumentId
                this.handleSubmit(true, DocumentId)
            }

            else return
        })
    }

    convertProposalToBill() {
        if (!this.isEdit) return
        const { order } = this.state
        const navParams = { order, docType: 'Facture', DocumentId: generateId('GS-DOC-'), isConversion: true, onGoBack: this.getGenPdf }
        this.props.navigation.navigate('PdfGeneration', navParams)
    }

    navigateToSignature(signMode, isConnected, allowSign) {

        if (!this.isEdit) return

        if (signMode) {
            if (!isConnected) {
                Alert.alert('', 'La signature digitale est indisponible en mode hors-ligne.')
                return
            }
            if (!allowSign) return
        }

        const { project, type, attachment } = this.initialState

        var params = {
            onGoBack: () => this.fetchDocument(this.DocumentId),
            ProjectId: project.id,
            DocumentId: this.DocumentId,
            DocumentType: type,
            fileName: attachment.name,
            url: attachment.downloadURL,
            onSignaturePop: this.onSignaturePop,
        }

        if (signMode)
            params.initMode = 'sign'

        navigateToScreen(this, 'Signature', params)
    }

    renderSignees() {
        const { signatures } = this.state

        return signatures.map((signature, index) => {
            const { signedAt, signedBy } = signature
            const signDate = moment(signedAt, 'lll').format('ll')
            const signTime = moment(signedAt, 'lll').format('HH:mm')
            // const navigateToSigneeProfile = () => this.props.navigation.navigate('Profile', { userId: signedBy.id })

            return (
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: 30, marginBottom: 10 }}>
                    <CustomIcon icon={faPen} size={24} color={theme.colors.placeholder} />
                    <View>
                        <Text numberOfLines={1} style={[theme.customFontMSmedium.body, { marginLeft: 15 }]}>
                            <Text style={[theme.customFontMSsemibold.body, { color: theme.colors.primary }]}>{signedBy.fullName} </Text>
                             a signé le document</Text>
                        <Text style={[theme.customFontMSmedium.caption, { marginLeft: 15, color: theme.colors.placeholder }]}>le {signDate} à {signTime}</Text>
                    </View>
                </View>
            )
        })
    }

    render() {
        let { project, name, description, type, state, attachment, order } = this.state
        let { createdAt, createdBy, editedAt, editedBy, signatures } = this.state
        let { error, loading, loadingConversion, toastType, toastMessage, projectError } = this.state
        const { checked, modalContent, showModal, attachmentSource } = this.state
        const { isConnected } = this.props.network

        let { canCreate, canUpdate, canDelete } = this.props.permissions.documents
        const canWrite = (canUpdate && this.isEdit || canCreate && !this.isEdit)

        const { title, columns, elements, autoValidation } = this.modalOptionsConfig()
        const attachmentUploaded = attachment && !attachment.pending
        const allowSign = this.isEdit && attachmentUploaded

        if (loadingConversion) return (
            <View style={styles.container}>
                <Appbar close title titleText='Exportation du document...' />
                <LoadDialog loading={loadingConversion} message="Conversion du document en cours. Veuillez patienter..." />
            </View>
        )

        else return (
            <View style={styles.container}>
                <Appbar
                    close title
                    titleText={loading ? 'Exportation du document...' : this.isEdit ? 'Modifier le document' : 'Nouveau document'}
                    loading={loading}
                    check={this.isEdit ? canWrite && !loading : !loading}
                    handleSubmit={() => this.handleSubmit(false, this.DocumentId)}
                    del={canDelete && this.isEdit && !loading}
                    handleDelete={this.showAlert} />

                <View style={{ flex: 1 }}>
                    {this.isEdit && attachment && !attachment.pending &&
                        <Button mode="outlined" style={{ marginTop: 0 }} onPress={() => this.navigateToSignature()}>
                            <Text style={[theme.customFontMSmedium.body, styles.viewDocumentButton]}>VOIR LE DOCUMENT</Text>
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

                                {/* <Picker
                                        returnKeyType="next"
                                        value={type}
                                        error={!!type.error}
                                        errorText={type.error}
                                        selectedValue={type}
                                        onValueChange={(type) => this.setState({ type })}
                                        title="Type"
                                        elements={types}
                                        enabled={canWrite}
                                    /> */}

                                <ItemPicker
                                    onPress={() => {
                                        if (this.project || this.isEdit) return //pre-defined project
                                        navigateToScreen(this, 'ListProjects', { onGoBack: this.refreshProject, isRoot: false, prevScreen: 'UploadDocument', titleText: 'Choix du projet', showFAB: false })
                                    }}
                                    label="Projet concerné *"
                                    value={project.name}
                                    error={!!projectError}
                                    errorText={projectError}
                                    editable={canWrite}
                                    showAvatarText={false}
                                />

                                {this.renderAttachment(canWrite)}

                                {type !== '' &&
                                    <MyInput
                                        label="Type *"
                                        returnKeyType="done"
                                        value={type}
                                        editable={false}
                                        disabled
                                    />}

                                <ModalOptions
                                    title={title}
                                    columns={columns}
                                    //modalStyle={{ marginTop: constants.ScreenHeight * 0.5 }}
                                    modalStyle={{ marginTop: modalContent === 'docTypes' ? 0 : constants.ScreenHeight * 0.5 }}
                                    isVisible={showModal}
                                    toggleModal={() => {
                                        this.toggleModal()
                                        this.resetModalOptions()
                                    }}
                                    //  handleCancel={this.handleCancelGen}
                                    // handleConfirm={this.handleConfirmModal}
                                    elements={elements}
                                    autoValidation={true}

                                    handleSelectElement={(elements, index) => {

                                        if (modalContent === 'docTypes') {
                                            const type = this.types[index].value
                                            this.setState({ type })
                                            let isQuoteOrBill = type === 'Devis' || type === 'Facture'
                                            if (isQuoteOrBill) this.setState({ modalContent: 'docSources' })
                                            else {
                                                this.toggleModal()
                                                this.pickDoc()
                                            }
                                        }

                                        else if (modalContent === 'docSources') {
                                            const attachmentSource = index === 0 ? 'upload' : 'generation'
                                            this.setState({ attachmentSource })
                                            if (attachmentSource === 'upload') {
                                                this.toggleModal()
                                                this.pickDoc()
                                            }
                                            else this.setState({ modalContent: 'genSources' })
                                        }

                                        else if (modalContent === 'genSources') {
                                            this.startGenPdf(index)
                                        }
                                    }}
                                />

                                <MyInput
                                    label="Nom du document *"
                                    returnKeyType="done"
                                    value={name.value}
                                    onChangeText={text => updateField(this, name, text)}
                                    error={!!name.error}
                                    errorText={name.error}
                                    multiline={true}
                                    editable={canWrite}
                                />

                                <MyInput
                                    label="Description"
                                    returnKeyType="done"
                                    value={description.value}
                                    onChangeText={text => updateField(this, description, text)}
                                    error={!!description.error}
                                    errorText={description.error}
                                    multiline={true}
                                    editable={canWrite}
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
                                    enabled={canWrite}
                                    containerStyle={{ marginBottom: 0 }}
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
                        {type === 'Devis' && order ? //Document type is "Devis" & Devis was generated from an order form
                            <Button
                                mode="contained"
                                style={[styles.signButton, { width: constants.ScreenWidth * 0.6, backgroundColor: this.isEdit && attachment && !attachment.pending ? theme.colors.primary : theme.colors.gray50 }]}
                                onPress={() => this.convertProposalToBill(isConnected, true)}>
                                <Text style={[theme.customFontMSmedium.caption, { color: this.isEdit && attachment && !attachment.pending ? '#fff' : theme.colors.gray }]}>Convertir en facture</Text>
                            </Button>
                            :
                            <View />
                        }

                        {(canWrite || this.props.role.id === 'client') &&
                            <Button
                                mode="contained"
                                style={[styles.signButton, { backgroundColor: allowSign ? theme.colors.primary : theme.colors.gray_light }]}
                                onPress={() => this.navigateToSignature(true, isConnected, allowSign)}>
                                <Text style={[theme.customFontMSmedium.body, { color: allowSign ? '#fff' : theme.colors.gray }]}>Signer</Text>
                            </Button>
                        }
                    </View>

                    <Toast
                        message={toastMessage}
                        type={toastType}
                        onDismiss={() => this.setState({ toastMessage: '' })} />
                </View>

            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        role: state.roles.role,
        permissions: state.permissions,
        network: state.network,
        documents: state.documents
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
    viewDocumentButton: {
        textAlign: 'center',
        color: theme.colors.primary
    },
    footerContainer: {
        flexDirection: 'row',
        borderColor: theme.colors.gray100,
        borderWidth: 1,
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        paddingLeft: constants.ScreenWidth * 0.025,
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

const modalStyles1 = StyleSheet.create({
    modal: {
        width: constants.ScreenWidth,
        marginTop: constants.ScreenHeight * 0.6,
        marginHorizontal: 0,
        marginBottom: 0,
        borderTopLeftRadius: constants.ScreenWidth * 0.03,
        borderTopRightRadius: constants.ScreenWidth * 0.03,
    },
    container: {
        flex: 1,
        paddingTop: constants.ScreenHeight * 0.02,
        backgroundColor: '#fff',
        borderTopLeftRadius: constants.ScreenWidth * 0.03,
        borderTopRightRadius: constants.ScreenWidth * 0.03,
    },
    buttonsContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fff',
    },
    column: {
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

const modalStyles2 = StyleSheet.create({
    modal: {
        width: constants.ScreenWidth,
        marginTop: constants.ScreenHeight * 0.3,
        marginHorizontal: 0,
        marginBottom: 0,
        borderTopLeftRadius: constants.ScreenWidth * 0.03,
        borderTopRightRadius: constants.ScreenWidth * 0.03,
    },
    container: {
        flex: 1,
        paddingTop: constants.ScreenHeight * 0.02,
        backgroundColor: '#fff',
        borderTopLeftRadius: constants.ScreenWidth * 0.03,
        borderTopRightRadius: constants.ScreenWidth * 0.03,
    },
    buttonsContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fff',
    },
    column: {
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'center'
    }
})



//OLD

// async pickDoc() {
//     try {
//         const res = await DocumentPicker.pick({
//             type: [DocumentPicker.types.pdf],
//         })

//         // const attachment = {
//         //     path: res.uri,
//         //     type: 'application/pdf',
//         //     name: `Scan-${moment().format('DD-MM-YYYY-HHmmss')}.pdf`,
//         //     size: res.size,
//         //     progress: 0
//         // }

//       //  this.setState({ attachment })

//         //Android only
//         if (res.uri.startsWith('content://')) {
//             //const uriComponents = res.uri.split('/')
//             //const fileNameAndExtension = uriComponents[uriComponents.length - 1]
//             // this.cachePath = `${RNFS.TemporaryDirectoryPath}/${'temporaryDoc'}${Date.now()}`

//             const Dir = Platform.OS === 'ios' ? RNFS.DocumentDirectoryPath : RNFS.DownloadDirectoryPath
//             const destFolder = `${Dir}/Synergys/Documents`
//             await RNFS.mkdir(destFolder)
//             //this.cachePath = `${destFolder}/${'temporaryDoc'}${Date.now()}`
//             this.cachePath = `${destFolder}/test.pdf`
//             await RNFS.moveFile(res.uri, this.cachePath)

//                 // await RNFS.copyFile(res.uri, this.cachePath) //copy file to get access to the relative path. DocumentPicker (with android) provides only absolute path which cannot be used with firebase storage
//                 .then(() => {
//                     const attachment = {
//                         //originalPath: res.uri,
//                         path: this.cachePath,
//                         type: 'application/pdf',
//                         name: `Scan-${moment().format('DD-MM-YYYY-HHmmss')}.pdf`,
//                         size: res.size,
//                         progress: 0
//                     }

//                     RNFS.exists(this.cachePath).then(() => console.log('File exist !'))

//                     this.setState({ attachment })
//                 })
//                 .catch((e) => Alert.alert(e))
//         }
//     }

//     catch (err) {
//         if (DocumentPicker.isCancel(err)) return
//         else Alert.alert(err)
//     }
// }


//OLD
// customBackHandler() {
//     const { loading, uploading } = this.state

//     if (loading || uploading) {
//         this.uploadTask.pause()

//         const title = "Annuler l'opération"
//         const message = "Êtes-vous sûr(e) de vouloir annuler l'exportation du document. Toutes les nouvelles données saisies seront perdues."

//         const handleConfirm = () => {
//             this.uploadTask.cancel()
//             this.props.navigation.goBack()
//         }

//         const handleCancel = () => this.uploadTask.resume()

//         this.myAlert(title, message, handleConfirm, handleCancel)
//     }

//     else this.props.navigation.goBack(null)
//     return true
// }



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



       // renderDialogGenPdf() {
    //     const { type, checked, dialogElement } = this.state
    //     const title = `Générer un ${type.toLowerCase()} à partir de:`

    //     const renderTitle = (dialogElement, type) => {
    //         if (dialogElement === 'docTypes') return `Choisissez le type du document`
    //         else if (dialogElement === 'genSources') return `Générer un ${type.toLowerCase()} à partir de:`
    //     }

    //     const Form = ({ dialogElement }) => {
    //         if (dialogElement === 'docTypes') {
    //             return this.renderdocTypesForm()
    //         }

    //         else if (dialogElement === 'genSources') {
    //             return (
    //                 <RadioButton
    //                     checked={checked}
    //                     firstChoice={{ title: 'Une commande existante', value: 'oldOrder' }}
    //                     secondChoice={{ title: 'Une nouvelle commande', value: 'newOrder' }}
    //                     onPress1={() => this.setState({ checked: 'first' })}
    //                     onPress2={() => this.setState({ checked: 'second' })}
    //                     isRow={false}
    //                     textRight={true} />
    //             )
    //         }
    //     }

    //     return (
    //         <View style={styles.dialogContainer} >
    //             <Dialog.Container visible={this.state.showDialog}>
    //                 <Dialog.Title style={[theme.customFontMSsemibold.header, { marginBottom: 5 }]}>{renderTitle(dialogElement, type)}</Dialog.Title>
    //                 {/* <Form element={dialogElement} /> */}
    //                 <Dialog.Button label="Annuler" onPress={this.toggleDialogGenPdf} style={{ color: theme.colors.error }} />
    //                 <Dialog.Button label="Confirmer" onPress={this.handleDialogConfirm} />
    //             </Dialog.Container>
    //         </View >
    //     )
    // }