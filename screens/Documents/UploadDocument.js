import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Keyboard, Alert } from 'react-native';
import { Card, Title, TextInput } from 'react-native-paper'
import DocumentPicker from 'react-native-document-picker';
import { faTimes, faCloudUploadAlt, faMagic, faFileInvoice, faFileInvoiceDollar, faBallot, faFileCertificate, faFile, faFolderPlus, faHandHoldingUsd, faHandshake, faHomeAlt, faGlobeEurope, faReceipt, faFilePlus, faFileSearch, faFileAlt, faFileEdit, faPen, fal, faCamera, faImages, faInfoCircle } from '@fortawesome/pro-light-svg-icons'
import _ from 'lodash'
import { connect } from 'react-redux'

import moment from 'moment';
import 'moment/locale/fr'
moment.locale('fr')

import ActivitySection from '../../containers/ActivitySection'
import Appbar from '../../components/Appbar'
import FormSection from '../../components/FormSection'
import SquarePlus from '../../components/SquarePlus'
import MyInput from '../../components/TextInput'
import Picker from "../../components/Picker"
import ItemPicker from "../../components/ItemPicker"
import Button from "../../components/Button"
import ModalOptions from "../../components/ModalOptions"
import UploadProgress from "../../components/UploadProgress"
import Toast from "../../components/Toast"
import EmptyList from "../../components/EmptyList"
import Loading from "../../components/Loading"
import LoadDialog from "../../components/LoadDialog"

import firebase, { db, auth } from '../../firebase'
import { fetchDocument, fetchDocuments } from "../../api/firestore-api";
import { uploadFileNew } from "../../api/storage-api";
import { generateId, navigateToScreen, myAlert, updateField, nameValidator, setToast, load, pickDoc, articles_fr, isEditOffline, setPickerDocTypes, refreshProject, pickImage, saveFile, convertImageToPdf, displayError, formatDocument, unformatDocument } from "../../core/utils";
import * as theme from "../../core/theme";
import { constants, errorMessages } from "../../core/constants";
import { blockRoleUpdateOnPhase } from '../../core/privileges';
import CustomIcon from '../../components/CustomIcon';

//Pickers items
const states = [
    { label: 'A faire', value: 'A faire' },
    { label: 'En cours', value: 'En cours' },
    { label: 'Validé', value: 'Validé' },
]

const docSources = [
    { label: 'Importer', value: 'upload', icon: faCloudUploadAlt },
    { label: 'Générer', value: 'generate', icon: faMagic }
]

const imageSources = [
    { label: 'Caméra', value: 'upload', icon: faCamera },
    { label: 'Gallerie', value: 'generate', icon: faImages }
]

const genOrderSources = [
    { label: 'Une commande existante', value: 'oldOrder', icon: faFileSearch },
    { label: 'Une nouvelle commande', value: 'newOrder', icon: faFilePlus },
]

const genFicheEEBSources = [
    { label: 'Une simulation existante', value: 'oldSimulation', icon: faFileSearch },
    { label: 'Une nouvelle simulation', value: 'newSimulation', icon: faFilePlus },
]

const properties = ["project", "name", "type", "state", "attachment", "orderData", "createdAt", "createdBy", "editedAt", "editedBy"]

class UploadDocument extends Component {

    constructor(props) {
        super(props)

        //Inputs
        this.refreshProject = refreshProject.bind(this)

        //Submit
        this.handleSubmit = this.handleSubmit.bind(this)
        this.persistDocument = this.persistDocument.bind(this)
        this.uploadFile = this.uploadFile.bind(this)
        this.uploadFileNew = uploadFileNew.bind(this)
        this.unformatDocument_conversion = this.unformatDocument_conversion.bind(this)

        //Document source (gen/upload)
        this.toggleModal = this.toggleModal.bind(this)
        this.resetModalOptions = this.resetModalOptions.bind(this)
        this.startGenPdf = this.startGenPdf.bind(this) //Start Pdf gen flow
        this.getGenPdf = this.getGenPdf.bind(this) //End Pdf gen flow

        //Delete
        this.myAlert = myAlert.bind(this)
        this.showAlert = this.showAlert.bind(this)

        //Init
        this.initialState = {}
        this.isInit = true

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
        this.onGoBack = this.props.navigation.getParam('onGoBack', undefined) //Not editable

        this.currentRole = this.props.role.id
        this.types = setPickerDocTypes(this.currentRole, this.dynamicType, this.documentType)
        this.docSources = docSources
        this.imageSources = imageSources
        this.genOrderSources = genOrderSources
        this.genFicheEEBSources = genFicheEEBSources

        const defaultState = this.setDefaultState()

        this.state = {
            //TEXTINPUTS
            name: defaultState.name || "",
            nameError: "",
            description: "",

            //Screens
            project: defaultState.project || { id: '', name: '' },
            projectError: '',

            //Pickers
            state: 'En cours',
            type: defaultState.type || 'Autre',

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
            attachmentSource: '', //upload || generation || conversion
            orderData: null,

            loading: true,
            docNotFound: false,
            loadingConversion: false,
            modalLoading: false,
            toastType: '',
            toastMessage: ''
        }
    }

    setDefaultState() {
        let defaultState = {}

        if (this.project && this.documentType) {
            const name = `${this.documentType.value} - ${this.project.id}`
            defaultState = {
                name,
                type: this.documentType.value,
            }
        }

        if (this.project) {
            defaultState.project = this.project
        }

        return defaultState
    }

    async componentDidMount() {
        if (this.isEdit) await this.initEditMode(this.DocumentId)
        this.initialState = _.cloneDeep(this.state)
        load(this, false)
    }

    componentWillUnmount() {
        this.resetModalOptions()
        this.unsubscribeAttachmentListener && this.unsubscribeAttachmentListener()
    }

    async initEditMode(DocumentId) {
        let document = await fetchDocument('Documents', DocumentId)
        document = await this.setDocument(document)
        if (!document) return
        await this.setSignatures(DocumentId)
        await this.attachmentListener(DocumentId)
    }

    async setDocument(document) {
        if (!document)
            this.setState({ docNotFound: true })
        else {
            document = formatDocument(document, properties)
            this.setState(document)
        }
        return document
    }

    async setSignatures(DocumentId) {
        const query = db.collection('Documents').doc(DocumentId).collection('AttachmentHistory')
        let attachmentHistoryDocs = await fetchDocuments(query)
        if (attachmentHistoryDocs === []) return
        attachmentHistoryDocs = attachmentHistoryDocs.filter((doc) => doc.sign_proofs_data)
        const signatures = attachmentHistoryDocs.map((doc) => {
            const { signedBy, signedAt } = doc.sign_proofs_data
            return { signedBy, signedAt }
        })
        this.setState({ signatures })
    }

    attachmentListener(DocumentId) {
        return new Promise((resolve, reject) => {
            const query = db.collection('Documents').doc(DocumentId)
            this.unsubscribeAttachmentListener = query.onSnapshot(async (doc) => {
                if (!doc.exists) resolve(true)
                const localAttachment = this.state.attachment
                if (!localAttachment) resolve(true)
                const remoteAttachment = doc.data().attachment
                const remoteStatus = remoteAttachment.pending

                if (!remoteStatus) {
                    this.setState({ attachment: remoteAttachment })
                    this.initialState.attachment = remoteAttachment
                    this.unsubscribeAttachmentListener()
                }
                resolve(true)
            })
        })
    }

    //SUBMISSION
    validateInputs() {
        let { project, name, attachment } = this.state
        let projectError = nameValidator(project.id, '"Projet"')
        let nameError = nameValidator(name, '"Nom du document"')

        if (projectError || nameError) {
            this.setState({ projectError, nameError, loading: false, loadingConversion: false })
            return false
        }
        return true
    }

    async handleSubmit(isConversion, DocumentId) {
        Keyboard.dismiss()

        //0. Reject offline updates
        const { isConnected } = this.props.network
        let isEditOffLine = isEditOffline(this.isEdit, isConnected)
        if (isEditOffLine) return

        //1. Is loading or no edit ?
        const loadingOrNoEdit = this.state.loading || _.isEqual(this.state, this.initialState)
        if (loadingOrNoEdit) return
        this.setState({ loading: true, loadingConversion: isConversion })

        //2. POSEUR & COMMERCIAL PHASES UPDATES PRIVILEGES: Check if user has privilege to update selected project
        const isBlockedUpdates = blockRoleUpdateOnPhase(this.currentRole, this.state.project.step)
        if (isBlockedUpdates) {
            Alert.alert('Accès refusé', `Utilisateur non autorisé à modifier un projet dans la phase ${this.state.project.step}.`)
            this.setState({ loading: false, loadingConversion: false })
            return
        }

        //3. Validate
        const isValid = this.validateInputs()
        if (!isValid) return

        //4. Persist
        const props = ["project", "name", "description", "type", "state", "attachment", "attachmentSource", "orderData"]
        let document = unformatDocument(this.state, props, this.props.currentUser, this.isEdit)
        const { attachment } = this.state
        const isNewAttachment = attachment && !attachment.downloadURL

        if (isNewAttachment)
            document.attachment.pending = true

        if (isConversion)
            document = this.unformatDocument_conversion(document)

        await this.persistDocument(document, DocumentId)
        this.documentListener()
        this.refreshState(document, DocumentId, isConversion)

        //5. Upload
        if (isNewAttachment)
            var fileUploaded = await this.handleUpload(document, DocumentId, isConversion, isConnected)

        this.initialState = _.cloneDeep(this.state)

        //6. Go back (Process context only)
        if (this.documentType && fileUploaded) {
            const { onGoBack } = this.props.navigation.state.params
            if (onGoBack) onGoBack()
            this.props.navigation.goBack()
        }

        this.setState({ loading: false, loadingConversion: false })
    }

    //1. Persist
    persistDocument(document, DocumentId) {
        return new Promise((resolve, reject) => {
            const batch = db.batch()
            const documentRef = db.collection('Documents').doc(DocumentId)
            const attachmentsRef = db.collection('Documents').doc(DocumentId).collection('AttachmentHistory').doc()
            batch.set(documentRef, document, { merge: true })
            batch.set(attachmentsRef, document.attachment)
            batch.commit()
            this.documentListener = db.collection('Documents').doc(DocumentId).onSnapshot((doc) => resolve(true)) //Listener to handle offline persistance without using async/await
        })
    }

    unformatDocument_conversion(document) {
        document.createdAt = moment().format()
        document.createdBy = this.props.currentUser
        document.name = `${document.name} (Facture générée)`
        document.type = 'Facture'
        document.attachmentSource = 'conversion'
        document.conversionSource = this.DocumentId //Id of the current "Devis"
        return document
    }

    //2. Refresh locally
    refreshState(document, DocumentId, isConversion) {
        if (isConversion) {
            this.DocumentId = DocumentId
            const { name, type, attachmentSource, conversionSource } = document
            this.setState({ name, type, attachmentSource, conversionSource })
        }

        if (!this.isEdit || isConversion) {
            const { createdAt, createdBy } = document
            this.setState({ createdAt, createdBy }, () => {
                this.isEdit = true
                this.initialState = _.cloneDeep(this.state)
            })
        }
    }

    //3. Upload
    async handleUpload(document, DocumentId, isConversion, isConnected) {
        if (!this.isEdit || isConversion)
            await this.attachmentListener(DocumentId)

        if (!isConnected)
            this.setState({ loading: false, loadingConversion: false })

        const fileUploaded = await this.uploadFile(isConversion, DocumentId)
        if (!fileUploaded)
            setToast(this, 'e', errorMessages.documents.upload) //#task: put it on redux store
        return fileUploaded
    }

    async uploadFile(isConversion, DocumentId) {
        var { project, type, attachment } = this.state
        const storageRefPath = `Projects/${project.id}/Documents/${type}/${DocumentId}/${moment().format('ll')}/${attachment.name}`
        const fileUploaded = await this.uploadFileNew(attachment, storageRefPath, DocumentId, false)
        return fileUploaded
    }

    //DELETION
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

    //ATTACHMENT COMPONENT
    async onPressAttachment(canWrite) {
        if (!canWrite) return

        if (!this.isEdit && !this.documentType) { //Creation & not pre-defined document type {
            this.toggleModal()
        }

        else { //this.isEdit || !this.isEdit && this.documentType
            let modalContent = ''
            const { type } = this.state
            let isGenerable = type === 'Devis' || type === 'Facture' || type === "Fiche EEB"
            if (isGenerable) modalContent = 'docSources'
            else modalContent = 'imageSources'
            this.setState({ modalContent, showModal: true })
        }
    }

    onPressUploadPending(uploadRunning) {
        if (auth.currentUser.uid === this.state.editedBy.id) {
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
                    <UploadProgress
                        attachment={attachment}
                        showProgress={reduxAttachment}
                        pending={uploadNotRunning}
                        onPress={() => this.onPressUploadPending(!uploadNotRunning)}
                    />
                </TouchableOpacity>
            )
        }

        else if (attachment && !attachment.pending) {
            return (
                <TouchableOpacity onPress={() => this.onPressAttachment(canWrite)}>
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
                    <SquarePlus
                        style={{ marginTop: 5 }}
                        onPress={() => this.onPressAttachment(canWrite)}
                    />
                </View>
            )
        }
    }

    //*********************** Pdf generation/upload flow *************************** 
    //0.
    modalOptionsConfig() {
        const { modalContent, type } = this.state

        if (modalContent === 'docTypes') {
            return {
                title: `Choisissez le type du document`,
                columns: 3,
                elements: this.types,
            }
        }

        else if (modalContent === 'docSources') {
            const masculins = ['Devis', 'Bon de commande', 'Dossier CEE']
            return {
                title: `Créer ${articles_fr('un', masculins, type)} ${type.toLowerCase()}`,
                columns: 2,
                elements: this.docSources,
            }
        }

        else if (modalContent === 'imageSources') {
            return {
                title: `Source`,
                columns: 2,
                elements: this.imageSources,
            }
        }

        else if (modalContent === 'genOrderSources') {
            const masculins = ['Devis', 'Bon de commande', 'Dossier CEE']
            return {
                title: `Générer ${articles_fr('un', masculins, type)} ${type.toLowerCase()} à partir de:`,
                columns: 2,
                elements: this.genOrderSources,
            }
        }

        else if (modalContent === 'genFicheEEBSources') {
            return {
                title: `Générer une fiche EEB à partir de:`,
                columns: 2,
                elements: this.genFicheEEBSources,
            }
        }
    }

    toggleModal(reset) {
        this.setState({ showModal: !this.state.showModal, modalContent: 'docTypes' })
        if (reset) this.resetModalOptions()
    }

    resetModalOptions() {
        const { attachment, type } = this.initialState
        this.setState({ attachment, type })
    }

    //1.
    async configDocument(elements, index) {

        this.setState({ modalLoading: true })
        const { modalContent } = this.state

        if (modalContent === 'docTypes')
            this.configDocTypes(index)

        else if (modalContent === 'docSources')
            this.configDocSources(index)

        else if (modalContent === 'imageSources')
            await this.configImageSources(index)

        else if (modalContent === 'genOrderSources' || modalContent === 'genFicheEEBSources')
            this.startGenPdf(index)

        this.setState({ modalLoading: false })
    }

    //2.
    configDocTypes(index) {
        const type = this.types[index].value
        this.setState({ type })
        const isGenerable = type === 'Devis' || type === 'Facture' || type === "Fiche EEB"
        if (isGenerable) this.setState({ modalContent: 'docSources' })
        else this.setState({ modalContent: 'imageSources' })
    }

    //3.
    configDocSources(index) {
        const attachmentSource = index === 0 ? 'upload' : 'generation'
        this.setState({ attachmentSource })
        if (attachmentSource === 'upload')
            this.setState({ modalContent: 'imageSources' })
        else {
            const { type } = this.state
            if (type === 'Facture')
                this.setState({ modalContent: 'genOrderSources' })
            if (type === 'Fiche EEB')
                this.setState({ modalContent: 'genFicheEEBSources' })
            else if (type === 'Devis')
                this.startGenPdf(1)
        }
    }

    //3.1 Images
    async configImageSources(index) {
        const isCamera = index === 0
        const result = await this.setAttachment(isCamera)
        const { attachment, error } = result
        if (error) displayError(error)
        else this.setState({ attachment, orderData: null })
        this.toggleModal()
    }

    async setAttachment(isCamera) {
        try {
            let attachment = null
            if (isCamera) {
                const attachments = await pickImage([], true, false)
                if (attachments.length === 0) throw new Error("ignore")
                attachment = attachments[0]
            }
            else attachment = await this.pickDoc()
            if (!attachment) throw new Error("ignore")
            attachment = await this.handleImageToPdfConversion(attachment)
            return { attachment }
        }

        catch (error) {
            return { error }
        }
    }

    async pickDoc() {
        try {
            const attachment = await pickDoc(true, [DocumentPicker.types.pdf, DocumentPicker.types.images])
            return attachment
        }
        catch (e) {
            const { message } = e
            displayError({ message })
        }
    }

    async handleImageToPdfConversion(attachment) {
        const isImage = attachment.type.includes('image/')
        if (!isImage) return attachment
        try {
            const pdfBase64 = await convertImageToPdf(attachment)
            const fileName = `Scan-${moment().format('DD-MM-YYYY-HHmmss')}.pdf`
            const destPath = await saveFile(pdfBase64, fileName, 'base64')
            attachment.path = destPath
            attachment.name = fileName
            return attachment
        }
        catch (e) {
            return e
        }
    }

    //3.2 Generation
    startGenPdf(index) {
        const { type, project } = this.state
        this.toggleModal()

        const navParams = {
            autoGenPdf: true,
            docType: type,
            DocumentId: this.DocumentId,
            project: project, //#test change from this.project to this.state.project (for filtering list of orders/simulations)
            isConversion: false,
            onGoBack: this.getGenPdf
        }

        if (type === "Devis" || type === "Facture") {
            var titleText = "Choix de la commande"
            var listScreen = "ListOrders"
            var creationScreen = "CreateOrder"
            var popCount = index === 0 ? 3 : 2
        }

        else if (type === "Fiche EEB") {
            var titleText = "Choix de la simulation"
            var listScreen = "ListForms"
            var creationScreen = "CreateEEB"
            var popCount = index === 0 ? 2 : 1
        }

        //Existing order
        if (index === 0) {
            navParams.isRoot = false
            navParams.titleText = titleText
            navParams.popCount = popCount
            this.props.navigation.navigate(listScreen, navParams)
        }

        //New order
        else if (index === 1) {
            navParams.popCount = popCount
            this.props.navigation.navigate(creationScreen, navParams)
        }
    }

    convertProposalToBill() {
        const { orderData } = this.state
        const navParams = {
            order: orderData,
            docType: 'Facture',
            DocumentId: generateId('GS-DOC-'),
            isConversion: true,
            onGoBack: this.getGenPdf
        }
        this.props.navigation.navigate('PdfGeneration', navParams)
    }

    getGenPdf(genPdf) {
        const { pdfBase64Path: path, pdfName: name, order, isConversion } = genPdf //#todo:  order is specific to devis/facture
        //order: The order from which this "Devis" was generated
        //isConversion: Conversion from Devis to Facture (boolean)
        const attachment = {
            path,
            type: 'application/pdf',
            name,
            size: 100,
            progress: 0,
        }

        this.setState({ attachment, orderData: order || null }, () => {
            if (!isConversion) return
            var DocumentId = genPdf.DocumentId
            this.handleSubmit(isConversion, DocumentId)
        })
    }

    //********************************************************************************************************************* */
    //Signature
    navigateToSignature(signMode, isConnected, allowSign) {

        if (signMode) {
            if (!isConnected) {
                Alert.alert('', 'La signature digitale est indisponible en mode hors-ligne.')
                return
            }
            if (!allowSign) return
        }

        const { project, type, attachment } = this.initialState

        const onGoBack = () => {
            if (this.onGoBack) this.onGoBack()
            else this.initEditMode(this.DocumentId)
        }

        var params = {
            onGoBack,
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
            const signDate = moment(signedAt).format('ll')
            const signTime = moment(signedAt).format('HH:mm')

            return (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
                    <CustomIcon icon={faPen} size={21} color={theme.colors.placeholder} />
                    <View>
                        <Text numberOfLines={1} style={[theme.customFontMSregular.body, { marginLeft: 15 }]}>
                            <Text style={[theme.customFontMSregular.body, { color: theme.colors.primary }]}>{signedBy.fullName} </Text>
                             a signé le document</Text>
                        <Text style={[theme.customFontMSregular.caption, { marginLeft: 15, color: theme.colors.placeholder }]}>le {signDate} à {signTime}</Text>
                    </View>
                </View>
            )
        })
    }

    render() {
        let { project, name, description, type, state, attachment, orderData } = this.state
        let { createdAt, createdBy, editedAt, editedBy, signatures } = this.state
        let { loading, docNotFound, loadingConversion, modalLoading, toastType, toastMessage, projectError, nameError } = this.state
        const { checked, modalContent, showModal, attachmentSource } = this.state
        const { isConnected } = this.props.network

        let { canCreate, canUpdate, canDelete } = this.props.permissions.documents
        canUpdate = canUpdate || this.props.role.id === 'client' && createdBy.id === auth.uid
        const canWrite = (canUpdate && this.isEdit || canCreate && !this.isEdit) && !loading
        canDelete = canDelete && this.isEdit && !loading

        const { title, columns, elements } = this.modalOptionsConfig()
        const attachmentUploaded = attachment && !attachment.pending
        const isEditAndAttachmentUploaded = this.isEdit && attachmentUploaded
        const allowViewDocument = isEditAndAttachmentUploaded
        const showSignatures = this.isEdit && signatures.length > 0

        const showDocOperations = isEditAndAttachmentUploaded
        const isGeneratedQuote = type === 'Devis' && orderData
        const allowConversion = isGeneratedQuote
        const allowSign = canUpdate || this.props.role.id === 'client'

        // console.log('name', name)

        if (docNotFound)
            return (
                <View style={styles.container}>
                    <Appbar close title titleText='Modifier le document' />
                    <EmptyList icon={faTimes} header='Document introuvable' description="Le document est introuvable dans la base de données. Il se peut qu'il ait été supprimé." offLine={!isConnected} />
                </View>
            )

        else if (loadingConversion)
            return (
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
                    check={canWrite}
                    handleSubmit={() => this.handleSubmit(false, this.DocumentId)}
                    del={canDelete}
                    handleDelete={this.showAlert} />

                <View style={{ flex: 1 }}>
                    {allowViewDocument &&
                        <Button mode="outlined" style={{ marginTop: 0 }} onPress={() => this.navigateToSignature()}>
                            <Text style={[theme.customFontMSmedium.body, styles.viewDocumentButton]}>VOIR LE DOCUMENT</Text>
                        </Button>
                    }

                    <ScrollView keyboardShouldPersistTaps="always" style={styles.container} contentContainerStyle={{ backgroundColor: theme.colors.white, paddingBottom: constants.ScreenWidth * 0.02 }}>

                        <FormSection
                            sectionTitle='Informations générales'
                            sectionIcon={faInfoCircle}
                            form={
                                <View style={{ flex: 1, backgroundColor: theme.colors.white }}>
                                    <MyInput
                                        label="Numéro du document"
                                        returnKeyType="done"
                                        value={this.DocumentId}
                                        editable={false}
                                        disabled
                                    />

                                    <ItemPicker
                                        onPress={() => {
                                            if (this.project || this.isEdit || loading) return //pre-defined project
                                            navigateToScreen(this, 'ListProjects', { onGoBack: this.refreshProject, isRoot: false, prevScreen: 'UploadDocument', titleText: 'Choix du projet', showFAB: false })
                                        }}
                                        label="Projet concerné *"
                                        value={project.name}
                                        error={!!projectError}
                                        errorText={projectError}
                                        editable={canWrite}
                                        showAvatarText={false}
                                    />

                                    {project.id !== "" && this.renderAttachment(canWrite)}

                                    {type !== '' && project.id !== "" &&
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
                                        isLoading={modalLoading}
                                        modalStyle={{ marginTop: modalContent === 'docTypes' ? 0 : constants.ScreenHeight * 0.5 }}
                                        isVisible={showModal}
                                        toggleModal={() => this.toggleModal()}
                                        elements={elements}
                                        autoValidation={true}
                                        handleSelectElement={async (elements, index) => this.configDocument(elements, index)}
                                    />

                                    <MyInput
                                        label="Nom du document *"
                                        returnKeyType="done"
                                        value={name}
                                        onChangeText={name => this.setState({ name, nameError })}
                                        error={!!nameError}
                                        errorText={nameError}
                                        multiline={true}
                                        editable={canWrite}
                                    />

                                    <MyInput
                                        label="Description"
                                        returnKeyType="done"
                                        value={description}
                                        onChangeText={description => this.setState({ description })}
                                        // error={!!description.error}
                                        // errorText={description.error}
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
                                </View>
                            }
                        />

                        {showSignatures &&
                            <Card style={{ margin: 5 }}>
                                <Card.Content>
                                    <Title>Signatures</Title>
                                    {this.renderSignees()}
                                </Card.Content>
                            </Card>
                        }

                        {this.isEdit &&
                            <ActivitySection
                                createdBy={createdBy}
                                createdAt={createdAt}
                                editedBy={editedBy}
                                editedAt={editedAt}
                                navigation={this.props.navigation}
                            />
                        }

                    </ScrollView>

                    {showDocOperations &&
                        <View style={styles.footerContainer}>
                            {allowConversion ?
                                <Button
                                    mode="contained"
                                    style={[styles.signButton, { width: constants.ScreenWidth * 0.6, backgroundColor: theme.colors.primary }]}
                                    onPress={() => this.convertProposalToBill(isConnected, true)}>
                                    <Text style={[theme.customFontMSmedium.caption, { color: '#fff' }]}>Convertir en facture</Text>
                                </Button>
                                :
                                <View />
                            }

                            {allowSign &&
                                <Button
                                    mode="contained"
                                    style={[styles.signButton, { backgroundColor: theme.colors.primary }]}
                                    onPress={() => this.navigateToSignature(true, isConnected, allowSign)}>
                                    <Text style={[theme.customFontMSmedium.body, { color: '#fff' }]}>Signer</Text>
                                </Button>
                            }
                        </View>
                    }

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
        documents: state.documents,
        currentUser: state.currentUser
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

