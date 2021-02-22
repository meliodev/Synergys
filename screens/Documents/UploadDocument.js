import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Keyboard, Alert, Platform, BackHandler, ActivityIndicator } from 'react-native';
import { Card, Title, TextInput, ProgressBar } from 'react-native-paper'
import Modal from 'react-native-modal'
import Dialog from "react-native-dialog"

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

import Appbar from '../../components/Appbar'
import RadioButton from '../../components/RadioButton'
import MyInput from '../../components/TextInput'
import Picker from "../../components/Picker"
import Button from "../../components/Button"
import UploadProgress from "../../components/UploadProgress"
import Toast from "../../components/Toast"
import Loading from "../../components/Loading"

import { fetchDocs } from "../../api/firestore-api";
import { uploadFileNew } from "../../api/storage-api";
import { generatetId, navigateToScreen, myAlert, updateField, downloadFile, nameValidator, setToast, load, pickDoc, articles_fr } from "../../core/utils";
import * as theme from "../../core/theme";
import { constants } from "../../core/constants";
import { handleFirestoreError } from '../../core/exceptions';

import { onUploadProgressStart, onUploadProgressChange, onUploadProgressEnd, setRole } from '../../core/redux'

const db = firebase.firestore()

const states = [
    { label: 'A faire', value: 'A faire' },
    { label: 'En cours', value: 'En cours' },
    { label: 'Validé', value: 'Validé' },
]

const types = [
    { label: 'Bon de commande', value: 'Bon de commande', icon: 'format-list-numbered', selected: false },
    { label: 'Devis', value: 'Devis', icon: 'alpha-d-box-outline', selected: false },
    { label: 'Facture', value: 'Facture', icon: 'cash-usd-outline', selected: false },
    { label: 'Dossier CEE', value: 'Dossier CEE', icon: 'certificate', selected: false },
    { label: 'Prime de rénovation', value: 'Prime de rénovation', icon: 'offer', selected: false },
    { label: 'Aide et subvention', value: 'Aide et subvention', icon: 'handshake', selected: false },
    { label: 'Action logement', value: 'Action logement', icon: 'home-floor-a', selected: false },
]

class UploadDocument extends Component {
    constructor(props) {
        super(props)

        //Submit
        this.refreshProject = this.refreshProject.bind(this)
        this.pickDoc = this.pickDoc.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.persistDocument = this.persistDocument.bind(this)
        this.uploadFile = this.uploadFile.bind(this)
        this.uploadFileNew = uploadFileNew.bind(this)
        this.onPressUploadPending = this.onPressUploadPending.bind(this)
        this.renderPopUpMenuPdfSelection = this.renderPopUpMenuPdfSelection.bind(this)
        this.renderModalPdfOptions = this.renderModalPdfOptions.bind(this)
        this.togglePopUpMenu_pdfSelection = this.togglePopUpMenu_pdfSelection.bind(this)
        this.toggleModal_pdfOptions = this.toggleModal_pdfOptions.bind(this)
        this.togglePopUps = this.togglePopUps.bind(this)
        this.handleConfirmGen = this.handleConfirmGen.bind(this)
        this.handleCancelGen = this.handleCancelGen.bind(this)
        this.startGenPdf = this.startGenPdf.bind(this) //Start Pdf gen flow
        this.getGeneratedPdf = this.getGeneratedPdf.bind(this) //End Pdf gen flow

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
        this.isEdit = this.DocumentId ? true : false
        this.DocumentId = this.isEdit ? this.DocumentId : generatetId('GS-DOC-')
        this.title = this.DocumentId ? 'Nouveau document' : 'Modifier le document'
        this.project = this.props.navigation.getParam('project', '')

        this.state = {
            //TEXTINPUTS
            name: { value: "Doc 1", error: '' },
            description: { value: "aaa", error: '' },

            //Screens
            project: { id: '', name: '' },
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

            showPopUpmenu_pdfSelection: false,
            showModal_pdfOptions: false,
            showDialog: false,
            modalContent: 'docType',
            attachmentSource: '', //upload or generation
            types: types,
            checked: '',

            error: '',
            loading: false,
            toastType: '',
            toastMessage: ''
        }
    }

    async componentDidMount() {
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

    //A user starts an upload task while offline.. After user comes back online... the upload task starts running.
    // --> Listener to detect when the attachment is uploaded (pending = false)
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

    async pickDoc() {
        const attachment = await pickDoc(true, [DocumentPicker.types.pdf])
        this.setState({ attachment })
    }

    //Submit handler
    async handleSubmit() {
        const { isConnected } = this.props.network

        if (!isConnected && this.isEdit) { //&& !isConnected
            Alert.alert('', 'Les mises à jours sont indisponibles en mode hors-ligne')
            return
        }

        //0. Handle isLoading or No edit done
        if (this.state.loading || this.state === this.initialState) return
        load(this, true)

        //1. Validate inputs
        const isValid = this.validateInputs()
        if (!isValid) return

        //2. SetDocument
        await this.persistDocument()

        //3. Handle upload offline
        this.uploadFile()
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

    async persistDocument() {
        //1. ADDING document to firestore
        const { project, name, description, type, state, attachment } = this.state
        const currentUser = { id: this.currentUser.uid, fullName: this.currentUser.displayName }
        attachment.pending = true

        let document = {
            project: project,
            name: name.value,
            description: description.value,
            type: type,
            state: state,
            attachment: attachment, //To Keep track of last attached file
            editedAt: moment().format('lll'),
            editedBy: currentUser,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            deleted: false,
        }

        if (!this.isEdit) {
            document.createdAt = moment().format('lll')
            document.createdBy = currentUser
        }

        console.log('Ready to set document...')
        const batch = db.batch()
        const documentRef = db.collection('Documents').doc(this.DocumentId)
        const attachmentsRef = db.collection('Documents').doc(this.DocumentId).collection('Attachments').doc()
        batch.set(documentRef, document, { merge: true })
        batch.set(attachmentsRef, attachment)
        batch.commit()
        //.catch(e => handleFirestoreError(e))  //Online Only

        this.props.navigation.goBack()
    }

    async uploadFile() {
        var { project, type, attachment } = this.state
        const storageRefPath = `Projects/${project.id}/Documents/${type}/${this.DocumentId}/${moment().format('ll')}/${attachment.name}`

        const result = await this.uploadFileNew(attachment, storageRefPath, this.DocumentId, false) //resolves only when online

        if (result === 'failure')
            setToast(this, 'e', "Erreur lors de l'exportation de la pièce jointe, veuillez réessayer.") //#task: put it on redux store
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

    onPressUploadPending(uploadNotRunning) {
        if (firebase.auth().currentUser.uid === this.state.editedBy.id) {
            if (!uploadNotRunning) return //upload is running...
            Alert.alert("", "L'exportation de la pièce jointe va commencer dès que votre appareil se connecte à internet.")
        }

        else //In case remote user press the attachment while it is still uploading.
            Alert.alert("", "Ce document est en cours d'exportation par un autre utilisateur. Le document sera bientôt disponible, veuillez patienter...")
    }

    //Renderers
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

    renderAttachment(canUpdate) {
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
                    <UploadProgress attachment={attachment} showProgress={reduxAttachment} pending={uploadNotRunning} onPress={() => this.onPressUploadPending(uploadNotRunning)} />
                </TouchableOpacity>
            )
        }

        else if ((attachment && !attachment.pending) || !attachment) {
            return (
                <TouchableOpacity
                    onPress={() => {
                        if (!canUpdate) return
                        this.togglePopUpMenu_pdfSelection()
                    }}>
                    <MyInput
                        label="Pièce jointe"
                        value={attachment && attachment.name}
                        editable={false}
                        multiline
                        right={<TextInput.Icon name='attachment' color={theme.colors.placeholder} onPress={this.togglePopUpMenu_pdfSelection} />} />
                </TouchableOpacity>
            )
        }
    }

    //Pdf generation flow
    pdfSelectionOption(option) {
        this.setState({ attachmentSource: option })
        this.togglePopUps()
    }

    togglePopUps() {
        this.togglePopUpMenu_pdfSelection()
        this.toggleModal_pdfOptions()
    }

    togglePopUpMenu_pdfSelection() {
        this.setState({ showPopUpmenu_pdfSelection: !this.state.showPopUpmenu_pdfSelection })
    }

    toggleModal_pdfOptions() {
        this.setState({ showModal_pdfOptions: !this.state.showModal_pdfOptions, modalContent: 'docType' })
    }

    handleConfirmGen() {
        const { modalContent, attachmentSource } = this.state

        if (modalContent === 'docType') {
            if (attachmentSource === 'generate') {
                this.setState({ modalContent: 'genConfig' })
            }

            else if (attachmentSource === 'upload') {
                this.toggleModal_pdfOptions()
                this.pickDoc()
            }
        }

        else if (modalContent === 'genConfig') {
            this.startGenPdf()
        }
    }

    handleCancelGen() {
        const { modalContent } = this.state
        if (modalContent === 'genConfig')
            this.setState({ modalContent: 'docType' })

        else if (modalContent === 'docType')
            this.toggleModal_pdfOptions()
    }

    startGenPdf() {
        const { checked, type } = this.state
        this.toggleModal_pdfOptions()

        if (checked === 'first') {
            this.props.navigation.navigate('ListOrders', { isRoot: false, titleText: 'Choix de la commande', autoGenPdf: true, docType: type, onGoBack: this.getGeneratedPdf })
        }
        else if (checked === 'second') {
            this.props.navigation.navigate('CreateOrder', { autoGenPdf: true, docType: type })
        }
        else return
    }

    getGeneratedPdf(genPdf) {
        const path = genPdf.pdfBase64Path
        const name = genPdf.pdfName

        const attachment = {
            path,
            type: 'application/pdf',
            name,
            size: 100,
            progress: 0
        }

        this.setState({ attachment })
    }

    renderPopUpMenuPdfSelection() {

        const CircleButton = ({ iconName, title, onPress }) => {
            const circleButtonSize = constants.ScreenWidth * 0.2
            const circleButtonStyle = { justifyContent: 'center', alignItems: 'center', marginBottom: 15, width: circleButtonSize, height: circleButtonSize, borderRadius: circleButtonSize / 2, borderWidth: 1, borderColor: theme.colors.gray_light }
            return (
                <View style={modalStyles1.column}>
                    <TouchableOpacity style={circleButtonStyle} onPress={onPress}>
                        <MaterialCommunityIcons name={iconName} color={theme.colors.black} size={constants.ScreenWidth * 0.07} />
                    </TouchableOpacity>
                    <Text style={[theme.customFontMSregular.body, { color: theme.colors.placeholder }]}>{title}</Text>
                </View>
            )
        }

        return (
            <Modal
                isVisible={this.state.showPopUpmenu_pdfSelection}
                onSwipeComplete={this.togglePopUpMenu_pdfSelection}
                swipeDirection="down"
                animationIn="slideInUp"
                animationOut="slideOutDown"
                onBackdropPress={this.togglePopUpMenu_pdfSelection}
                style={modalStyles1.modal} >

                <View style={modalStyles1.container}>
                    <Text style={[theme.customFontMSmedium.header, { textAlign: 'center' }]}>Créer</Text>
                    <View style={modalStyles1.buttonsContainer}>
                        <CircleButton iconName='upload' title='Importer' onPress={() => this.pdfSelectionOption('upload')} />
                        <CircleButton iconName='creation' title='Générer' onPress={() => this.pdfSelectionOption('generate')} />
                    </View>
                </View>
            </Modal>
        )
    }

    renderModalPdfOptions() {
        const { type, checked, modalContent } = this.state

        const renderTitle = (modalContent, type) => {
            const masculins = ['Devis', 'Bon de commande', 'Dossier CEE']
            if (modalContent === 'docType') return `Choisissez le type du document`
            else if (modalContent === 'genConfig') return `Générer ${articles_fr('un', masculins, type)} ${type.toLowerCase()} à partir de:`
        }

        const Form = ({ modalContent }) => {
            if (modalContent === 'docType') {
                return this.renderDocTypeForm()
            }

            else if (modalContent === 'genConfig') {
                return (
                    <View style={{ paddingLeft: 15 }}>
                        <RadioButton
                            checked={checked}
                            firstChoice={{ title: 'Une commande existante', value: 'oldOrder' }}
                            secondChoice={{ title: 'Une nouvelle commande', value: 'newOrder' }}
                            onPress1={() => this.setState({ checked: 'first' })}
                            onPress2={() => this.setState({ checked: 'second' })}
                            isRow={false}
                            textRight={true} />
                    </View>
                )
            }
        }

        return (
            <Modal
                isVisible={this.state.showModal_pdfOptions}
                onSwipeComplete={this.toggleModal_pdfOptions}
                swipeDirection="right"
                animationIn="slideInRight"
                animationOut="slideOutLeft"
                onBackdropPress={this.toggleModal_pdfOptions}
                style={modalStyles2.modal} >

                <View style={modalStyles2.container}>
                    <Title style={[theme.customFontMSsemibold.header, { marginBottom: 10, textAlign: 'center' }]}>{renderTitle(modalContent, type)}</Title>
                    <Form modalContent={modalContent} />
                    <View style={{ position: 'absolute', bottom: 10, alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Button mode="outlined" onPress={this.handleCancelGen} style={{ width: '40%' }}>Retour</Button>
                        <Button mode="contained" onPress={this.handleConfirmGen} style={{ width: '45%' }}>Confirmer</Button>
                    </View>
                </View>
            </Modal>
        )
    }

    renderDocTypeForm() {
        const { types } = this.state
        const elementSize = constants.ScreenWidth * 0.3

        const elementStaticStyle = () => {
            return {
                borderRadius: 5,
                justifyContent: 'center',
                alignItems: 'center',
                margin: elementSize * 0.03,
                width: elementSize,
                height: elementSize,
                elevation: 2,
                backgroundColor: theme.colors.white
            }
        }

        const elementDynamicStyle = (isSelected) => {
            if (isSelected) return {
                elevation: 0,
                borderWidth: 1,
                borderColor: theme.colors.primary
            }
            else return {}
        }

        const selectType = (index) => {
            //Unselect all types
            types.forEach((type, key) => types[key].selected = false)

            //Select chosen type
            types[index].selected = true
            this.setState({ types, type: types[index].value })
        }

        const Element = ({ type, index }) => {
            const color = type.selected ? theme.colors.primary : theme.colors.black

            return (
                <TouchableOpacity style={[elementStaticStyle(), elementDynamicStyle(type.selected)]} onPress={() => selectType(index)}>
                    <View style={{ height: elementSize * 0.55, justifyContent: 'center' }}>
                        <MaterialCommunityIcons name={type.icon} size={elementSize * 0.3} color={color} />
                    </View>
                    <View style={{ height: elementSize * 0.45 }}>
                        <Text style={[theme.customFontMSmedium.body, { textAlign: 'center', color }]}>{type.label}</Text>
                    </View>
                </TouchableOpacity>
            )
        }

        return (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'center', paddingLeft: elementSize * 0.08 }}>
                {types.map((type, index) => {
                    return (<Element type={type} index={index} />)
                })}
            </View>
        )
    }

    navigateToSignature(isConnected, signMode) {
        if (!isConnected) {
            Alert.alert('', 'La signature digitale est indisponible en mode hors-ligne.')
            return
        }

        const { canUpdate } = this.props.permissions.documents
        const { project, type, attachment } = this.initialState

        var params = {
            onGoBack: this.fetchDocument,
            ProjectId: project.id,
            DocumentId: this.DocumentId,
            DocumentType: type,
            fileName: attachment.name,
            url: attachment.downloadURL
        }

        if (signMode)
            params.initMode = 'sign'

        navigateToScreen(this, canUpdate, 'Signature', params)
    }

    render() {
        let { project, name, description, type, state, attachment } = this.state
        let { createdAt, createdBy, editedAt, editedBy, signatures } = this.state
        let { error, loading, toastType, toastMessage, projectError } = this.state

        var { canUpdate, canDelete } = this.props.permissions.documents
        canUpdate = (canUpdate || !this.isEdit)

        const { isConnected } = this.props.network

        return (
            <View style={styles.container}>
                <Appbar back close title titleText={loading ? 'Exportation du document...' : this.isEdit ? name.value : 'Nouveau document'} check={this.isEdit ? canUpdate && !loading : !loading} handleSubmit={this.handleSubmit} del={canDelete && this.isEdit && !loading} handleDelete={this.showAlert} />

                {loading ?
                    <View style={{ flex: 1 }}>
                        <Loading size='small' style={{ justifyContent: 'flex-start', marginTop: 15 }} />
                    </View>
                    :
                    <View style={{ flex: 1 }}>
                        {this.isEdit && attachment && !attachment.pending &&
                            <Button mode="outlined" style={{ marginTop: 0 }} onPress={() => this.navigateToSignature(isConnected, false)}>
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

                                    <Picker
                                        returnKeyType="next"
                                        value={type}
                                        error={!!type.error}
                                        errorText={type.error}
                                        selectedValue={type}
                                        onValueChange={(type) => this.setState({ type })}
                                        title="Type"
                                        elements={types}
                                        enabled={canUpdate}
                                    />

                                    {this.renderAttachment(canUpdate)}
                                    {this.renderPopUpMenuPdfSelection()}
                                    {this.renderModalPdfOptions()}

                                    <MyInput
                                        label="Nom du document"
                                        returnKeyType="done"
                                        value={name.value}
                                        onChangeText={text => updateField(this, name, text)}
                                        error={!!name.error}
                                        errorText={name.error}
                                        multiline={true}
                                        editable={canUpdate}
                                    />


                                    <TouchableOpacity onPress={() => navigateToScreen(this, canUpdate, 'ListProjects', { onGoBack: this.refreshProject, isRoot: false, prevScreen: 'UploadDocument', titleText: 'Choix du projet', showFAB: false })}>
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
                                        editable={canUpdate}
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
                                        enabled={canUpdate}
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
                                onPress={() => this.navigateToSignature(isConnected, true)}>
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
    //         if (dialogElement === 'docType') return `Choisissez le type du document`
    //         else if (dialogElement === 'genConfig') return `Générer un ${type.toLowerCase()} à partir de:`
    //     }

    //     const Form = ({ dialogElement }) => {
    //         if (dialogElement === 'docType') {
    //             return this.renderDocTypeForm()
    //         }

    //         else if (dialogElement === 'genConfig') {
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