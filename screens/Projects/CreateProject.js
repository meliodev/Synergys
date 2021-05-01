import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, Keyboard, TextInput, ActivityIndicator } from 'react-native';
import { Card, Title, FAB, ProgressBar, List, TextInput as TextInputPaper } from 'react-native-paper'
import _ from 'lodash'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { faInfoCircle, faQuoteRight, faTasks, faFolder, faImage, faTimes, faChevronRight, faFileAlt, faCheckCircle, faEye, faArrowRight, faRedo, faAddressBook, faEuroSign } from '@fortawesome/pro-light-svg-icons'
import { faPlusCircle } from '@fortawesome/pro-solid-svg-icons'

import ImagePicker from 'react-native-image-picker'
import ImageView from 'react-native-image-view'
import { SliderBox } from "react-native-image-slider-box"

import moment from 'moment';
import 'moment/locale/fr'
moment.locale('fr')

import { Appbar, AutoCompleteUsers, Button, UploadProgress, FormSection, CustomIcon, TextInput as MyInput, ItemPicker, AddressInput, Picker, ProcessAction, ColorPicker, AddAttachment, Toast, Loading, EmptyList } from '../../components'

import firebase, { db, auth } from '../../firebase'
import * as theme from "../../core/theme";
import { constants, adminId, highRoles } from "../../core/constants";
import { generateId, navigateToScreen, myAlert, updateField, nameValidator, setToast, load, pickImage, isEditOffline, refreshClient, refreshComContact, refreshTechContact, setAddress } from "../../core/utils";
import { notAvailableOffline, handleFirestoreError } from '../../core/exceptions';

import { fetchDocs, getResponsableByRole } from "../../api/firestore-api";
import { uploadFiles } from "../../api/storage-api";
import { processMain, getCurrentStep, getCurrentAction, getPhaseId, getLatestProcessModelVersion } from '../../core/process'

import { connect } from 'react-redux'
import { ActivitySection } from '../../containers/ActivitySection';

const states = [
    { label: 'En attente', value: 'En attente' },
    { label: 'En cours', value: 'En cours' },
    { label: 'Terminé', value: 'Terminé' },
    { label: 'Annulé', value: 'Annulé' },
]

const steps = [
    { label: 'Initialisation', value: 'Initialisation' },
    { label: 'Rendez-vous 1', value: 'Rendez-vous 1' },
    { label: 'Rendez-vous N', value: 'Rendez-vous N' },
    { label: 'Visite technique', value: 'Visite technique' },
    { label: 'Installation', value: 'Installation' },
    { label: 'Maintenance', value: 'Maintenance' },
]

const imagePickerOptions = {
    title: 'Selectionner une image',
    takePhotoButtonTitle: 'Prendre une photo',
    chooseFromLibraryButtonTitle: 'Choisir de la librairie',
    cancelButtonTitle: 'Annuler',
    noData: true,
}

class CreateProject extends Component {
    constructor(props) {
        super(props)
        this.fetchProject = this.fetchProject.bind(this)
        this.fetchDocs = fetchDocs.bind(this)
        this.refreshClient = refreshClient.bind(this)
        this.refreshComContact = refreshComContact.bind(this)
        this.refreshTechContact = refreshTechContact.bind(this)
        this.refreshAddress = this.refreshAddress.bind(this)
        this.setAddress = setAddress.bind(this)

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleDeleteProject = this.handleDeleteProject.bind(this)
        this.handleDeleteImage = this.handleDeleteImage.bind(this)
        //this.deleteAttachments = this.deleteAttachments.bind(this)

        this.myAlert = myAlert.bind(this)
        this.uploadFiles = uploadFiles.bind(this)
        this.showAlert = this.showAlert.bind(this)
        this.pickImage = this.pickImage.bind(this)

        this.initialState = {}
        this.isInit = true
        this.currentUser = firebase.auth().currentUser
        this.isCurrentHighRole = highRoles.includes(this.props.role.id)

        this.ProjectId = this.props.navigation.getParam('ProjectId', '')
        this.isEdit = this.ProjectId ? true : false
        this.ProjectId = this.isEdit ? this.ProjectId : generateId('GS-PR-')
        this.title = this.isEdit ? 'Modifier le projet' : 'Nouveau projet'
        this.isClient = this.props.role.id === 'client'

        this.state = {
            //TEXTINPUTS
            name: { value: "", error: '' },
            description: { value: "", error: '' },
            note: { value: "", error: '' },

            //Screens
            address: { description: '', place_id: '', marker: { latitude: '', longitude: '' }, error: '' },
            client: { id: '', fullName: '', email: '', role: '' },

            //Pickers
            state: 'En cours',
            step: 'Initialisation',

            //Subscribers (collaborators)
            subscribers: [],
            comContact: { id: '', fullName: '', email: '', role: '' },
            techContact: { id: '', fullName: '', email: '', role: '' },

            //Billing
            bill: { amount: '' },

            color: theme.colors.primary,

            //logs (Auto-Gen)
            createdAt: '',
            createdBy: { id: '', fullName: '' },
            editedAt: '',
            editedBy: { id: '', fullName: '' },

            //Images
            attachments: [],
            attachedImages: [],
            isImageViewVisible: false,
            imageIndex: 0,
            imagesView: [],
            imagesCarousel: [],

            //Documents
            documentsList: [],
            documentTypes: [],
            expandedId: '',

            //Tasks
            tasksList: [],
            taskTypes: [],
            expandedTaskId: '',

            //Process
            process: null,
            processFetched: false,

            error: '',
            loading: true,
            docNotFound: false,

            //Specific privileges (poseur & commercial)
            isBlockedUpdates: false
        }
    }

    async componentDidMount() {

        if (this.isEdit) {
            const docNotFound = await this.fetchProject() //Get current process
            if (docNotFound) {
                load(this, false)
                return
            }
            this.fetchDocuments()
            this.fetchTasks()
            this.initialState = _.cloneDeep(this.state)
        }

        else this.initialState = _.cloneDeep(this.state)

        load(this, false)
    }

    componentWillUnmount() {
        if (this.isEdit) {
            if (this.unsubscribeDocuments)
                this.unsubscribeDocuments()

            this.unsubscribeTasks()
        }
    }


    //FETCHES: #edit
    async fetchProject() {
        await db.collection('Projects').doc(this.ProjectId).get().then((doc) => {
            if (!doc.exists) {
                this.setState({ docNotFound: true })
                return true
            }

            let { client, name, description, note, address, state, step, subscribers, comContact, techContact, bill, color } = this.state
            let { createdAt, createdBy, editedAt, editedBy, attachedImages, process } = this.state
            let { error, loading } = this.state
            var imagesView = []
            var imagesCarousel = []

            //General info
            const project = doc.data()
            client = project.client
            name.value = project.name
            description.value = project.description
            note.value = project.note
            subscribers = project.subscribers
            comContact = project.subscribers.filter((sub) => sub.role === 'Commercial')[0]
            techContact = project.subscribers.filter((sub) => sub.role === 'Poseur')[0]
            bill = project.bill || {}
            color = project.color

            //َActivity
            createdAt = project.createdAt
            createdBy = project.createdBy
            editedAt = project.editedAt
            editedBy = project.editedBy

            process = project.process

            //Images
            attachedImages = project.attachments || []

            if (attachedImages) {
                attachedImages = attachedImages.filter((image) => !image.deleted)
                imagesView = attachedImages.map((image) => { return ({ source: { uri: image.downloadURL } }) })
                imagesCarousel = attachedImages.map((image) => image.downloadURL)
            }

            //State
            state = project.state
            step = project.step

            //Address
            address = project.address

            //IMPORTANT FOR UI PRIVILLEGES
            const currentRole = this.props.role.id
            const isBlockedUpdates = this.blockRoleUpdateOnPhase(currentRole, step)

            //PROCESS ACTION PROJECT DATA
            this.project = {
                id: this.ProjectId,
                name: name.value,
                client,
                step,
                subscribersIds: subscribers.map((sub) => sub.id),
                subscribers,
                address
            }

            this.setState({ createdAt, createdBy, editedAt, editedBy, attachedImages, imagesView, imagesCarousel, client, name, description, note, address, state, step, subscribers, comContact, techContact, bill, color, process, processFetched: true, isBlockedUpdates }, async () => {
                //if (this.isInit)
                this.initialState = _.cloneDeep(this.state)
                //this.isInit = false
            })
        })
    }


    // processListener() {
    //     this.unsubscribeProcessListener = db.collection('Projects').doc(this.ProjectId).onSnapshot((doc) => {
    //         if (doc.exists) {
    //             const process = doc.data()
    //             this.setState({ process })
    //         }
    //     })
    // }

    blockRoleUpdateOnPhase(role, phase) {
        let isBlockedUpdates = false
        const comPhases = ['Initialisation', 'Rendez-vous 1', 'Rendez-vous N']
        const techPhases = ['Visite technique', 'Installation', 'Maintenance']
        const isComPhase = comPhases.includes(phase)
        const isTechPhase = techPhases.includes(phase)

        if (role === 'com' && isTechPhase || role === 'poseur' && isComPhase)
            isBlockedUpdates = true

        return isBlockedUpdates
    }

    fetchDocuments() {
        this.unsubscribeDocuments = db.collection('Documents').where('deleted', '==', false).where('project.id', '==', this.ProjectId).orderBy('createdAt', 'DESC').onSnapshot((querysnapshot) => {
            if (querysnapshot.empty) return

            let documentsList = []
            let documentTypes = []
            querysnapshot.forEach((doc) => {
                const document = doc.data()
                document.id = doc.id
                documentsList.push(document)
                documentTypes.push(document.type)
            })
            documentTypes = [...new Set(documentTypes)]
            this.setState({ documentsList, documentTypes })
        })
    }

    fetchTasks() {
        this.unsubscribeTasks = db.collection('Agenda').where('project.id', '==', this.ProjectId).onSnapshot((agendaSnapshot) => {
            if (agendaSnapshot.empty) return

            let tasksList = []
            let taskTypes = []

            agendaSnapshot.forEach(async (taskDoc) => {
                const task = taskDoc.data()
                task.id = taskDoc.id
                task.date = taskDoc.dateKey
                tasksList.push(task)
                taskTypes.push(task.type)

                taskTypes = [...new Set(taskTypes)]
                this.setState({ tasksList, taskTypes })
            })
        })
    }

    refreshAddress(address) {
        this.setState({ address })
    }

    //Inputs validation
    validateInputs(isConnected) {
        let { client, name, address, comContact, techContact } = this.state

        let clientError = nameValidator(client.fullName, '"Client"')
        let nameError = nameValidator(name.value, '"Nom du projet"')
        let comContactError = nameValidator(comContact.id, '"Contact commercial"')
        let techContactError = nameValidator(techContact.id, '"Contact technique"')
        let addressError = '' //Address optional on offline mode
        //var addressError = isConnected ? nameValidator(address.description, '"Emplacemment"') : '' //Address optional on offline mode

        if (clientError || nameError || addressError || comContactError || techContactError) {
            name.error = nameError
            client.error = clientError
            comContact.error = comContactError
            techContact.error = techContactError
            address.error = addressError
            Keyboard.dismiss()
            this.setState({ client, name, address, comContact, techContact, loading: false })
            setToast(this, 'e', 'Erreur de saisie, veuillez verifier les champs.')
            return false
        }

        return true
    }

    //#OOS
    async handleSubmit() {
        const { isConnected } = this.props.network
        let isEditOffLine = isEditOffline(this.isEdit, isConnected)
        if (isEditOffLine) return

        //Handle Loading or No edit done
        let { loading, attachments } = this.state
        if (loading || _.isEqual(this.state, this.initialState)) return

        load(this, true)

        const isValid = this.validateInputs(isConnected)
        if (!isValid) return

        let { client, name, description, note, address, state, step, comContact, techContact, bill, color } = this.state
        const currentUser = {
            id: auth.currentUser.uid,
            fullName: auth.currentUser.displayName,
            email: auth.currentUser.email,
            role: this.props.role.value,
        }

        //1. UPLOADING FILES (ONLINE ONLY)
        if (isConnected) {
            if (attachments.length > 0) {
                this.title = 'Exportation des images...'
                const storageRefPath = `/Projects/${this.ProjectId}/Images/`
                const uploadedImages = await this.uploadFiles(attachments, storageRefPath)
                if (uploadedImages) {
                    const previousAttachedImages = this.initialState.attachedImages
                    var attachedImages = previousAttachedImages.concat(uploadedImages)
                    this.setState({ attachedImages })
                }
            }
        }

        //2. Set project
        let adminSub = await getResponsableByRole('Admin')
        let dcSub = await getResponsableByRole('Directeur commercial')
        let rtSub = await getResponsableByRole('Responsable technique')
        if (!adminSub || !dcSub || !rtSub) return

        let subscribers = [adminSub, dcSub, rtSub, comContact, techContact, currentUser]

        //remove duplicates
        subscribers = subscribers.reduce((unique, o) => {
            if (!unique.some(obj => obj.id === o.id && obj.email === o.email && obj.fullName === o.fullName && obj.role === o.role)) {
                unique.push(o)
            }
            return unique
        }, [])

        const subscribersIds = subscribers.map((sub) => sub.id)

        let project = {
            client,
            name: name.value,
            description: description.value,
            note: note.value,
            state,
            step,
            address,
            editedAt: moment().format(),
            editedBy: currentUser,
            subscribers,
            subscribersIds,
            bill,
            color: color,
            deleted: false,
        }

        if (!this.isEdit) {
            project.createdAt = moment().format()
            project.createdBy = currentUser
            project.process = {
                version: getLatestProcessModelVersion(this.props.processModels)
            }
        }

        if (isConnected) {
            project.attachments = attachedImages
        }

        db.collection('Projects').doc(this.ProjectId).set(project, { merge: true }) //Nothing to wait for -> data persisted to local cache
        this.props.navigation.goBack()
    }

    showAlert() {
        const title = "Supprimer le projet"
        const message = 'Etes-vous sûr de vouloir supprimer ce projet ? Cette opération est irreversible.'
        const handleConfirm = () => this.handleDeleteProject()
        this.myAlert(title, message, handleConfirm)
    }

    //#OOS
    handleDeleteProject() {
        load(this, true)
        db.collection('Projects').doc(this.ProjectId).update({ deleted: true })
        setTimeout(() => this.props.navigation.goBack(), 1000)
    }

    //Delete URLs from FIRESTORE 
    async handleDeleteImage(allImages, currentImage) {
        const newAttachments = this.state.attachedImages
        newAttachments[currentImage].deleted = true

        db.collection('Projects').doc(this.ProjectId).update({ attachments: newAttachments })
        setTimeout(() => {
            this.fetchProject()
            this.setState({ isImageViewVisible: false })
            //await this.deleteAttachments(allImages, currentImage)
        }, 1000)
    }

    //Delete Images from STORAGE //#RULE: NEVER DELETE FILES
    // async deleteAttachments(allImages, currentImage) {
    //     let urls = []

    //     if (allImages)
    //         urls = this.initialState.attachedImages.map(image => image.downloadURL) //Delete all images

    //     else
    //         urls = [this.initialState.attachedImages[currentImage].downloadURL] //Delete single image

    //     const promises = []
    //     for (let i = 0; i < urls.length; i++) {
    //         const deletion = firebase.storage().refFromURL(urls[i]).delete()
    //         promises.push(deletion)
    //     }

    //     await Promise.all(promises)
    //         .then(() => console.log('All images were deleted from STORAGE'))
    //         .catch(e => Alert.alert(e))

    //     if (allImages)
    //         this.props.navigation.goBack()

    //     // else
    //     //     this.fetchProject()
    // }

    async pickImage() {
        let { attachments } = this.state
        attachments = await pickImage(attachments)
        this.setState({ attachments })
    }


    renderAttachments(attachments, type, isUpload) {
        let { loading } = this.state

        const onPressAttachment = (isUpload, DocumentId) => {
            if (isUpload) return
            this.props.navigation.navigate('UploadDocument', { DocumentId })
        }

        const setRightIcon = (key) => {
            const rightIconName = isUpload ? faTimes : faChevronRight
            return (
                <TouchableOpacity style={{ flex: 0.15, justifyContent: 'center', alignItems: 'center' }} onPress={() => onPressRightIcon(key)}>
                    {!loading &&
                        <CustomIcon
                            icon={rightIconName}
                            style={{ color: theme.colors.gray_dark }}
                            size={19}
                        />}
                </TouchableOpacity>
            )
        }

        const onPressRightIcon = (key) => {
            if (isUpload) {
                attachments.splice(key, 1)
                this.setState({ attachments })
            }
        }

        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                {attachments.map((attachment, key) => {
                    if (!isUpload) {
                        var DocumentId = attachment.id
                        attachment = attachment.attachment
                    }

                    const rightIcon = setRightIcon(key)

                    return (
                        <UploadProgress
                            attachment={attachment}
                            showRightIcon
                            rightIcon={rightIcon}
                            onPress={() => onPressAttachment(isUpload, DocumentId)}
                            showProgress={isUpload}
                        />
                    )
                })}
                {isUpload && loading && <Loading />}
            </View>
        )

    }


    renderTasks(tasksList) {

        const onPressTask = (taskDate, TaskId) => {
            this.props.navigation.navigate('CreateTask', { isEdit: true, title: 'Modifier la tâche', TaskId })
        }

        return tasksList.map((task, key) => {

            return (
                <TouchableOpacity style={[styles.task, { backgroundColor: task.color }]} onPress={() => onPressTask(task.date, task.id)} >
                    <View style={{ flex: 0.5, justifyContent: 'center', paddingRight: 5 }}>
                        <Text style={[theme.customFontMSregular.body, { color: '#fff' }]} numberOfLines={1}>{task.name}</Text>
                    </View>
                    <View style={{ flex: 0.5, alignItems: 'flex-end', justifyContent: 'center', paddingLeft: 5 }}>
                        <Text style={[theme.customFontMSregular.caption, { color: '#fff' }]} numberOfLines={1}>{task.assignedTo.fullName}</Text>
                    </View>
                </TouchableOpacity>
            )
        })
    }

    renderPlacePictures(canWrite) {

        const { isImageViewVisible, imageIndex, imagesView, imagesCarousel, attachments, loading } = this.state

        return (
            <FormSection
                sectionTitle='Photos et plan du lieu'
                sectionIcon={faImage}
                showSection={!loading}
                form={
                    <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                        {imagesView.length > 0 &&
                            <ImageView
                                images={imagesView}
                                imageIndex={0}
                                onImageChange={(imageIndex) => this.setState({ imageIndex })}
                                isVisible={isImageViewVisible}
                                onClose={() => this.setState({ isImageViewVisible: false })}
                                renderFooter={(currentImage) => (
                                    <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                                        <TouchableOpacity
                                            style={{ padding: 10, backgroundColor: 'black', opacity: 0.8, borderRadius: 50, margin: 10 }}
                                            onPress={() => this.handleDeleteImage(false, imageIndex)}>
                                            <MaterialCommunityIcons name='delete' size={24} color='#fff' />
                                        </TouchableOpacity>
                                    </View>)}
                            />
                        }

                        {!loading &&
                            <View style={{ flex: 1, marginTop: 15, justifyContent: 'center', alignItems: 'center' }}>
                                {imagesCarousel.length > 0 &&
                                    <SliderBox
                                        images={imagesCarousel}
                                        sliderBoxHeight={200}
                                        onCurrentImagePressed={imageIndex => this.setState({ imageIndex, isImageViewVisible: true })}
                                        dotColor={theme.colors.secondary}
                                        inactiveDotColor="gray"
                                        paginationBoxVerticalPadding={20}
                                        //autoplay
                                        circleLoop
                                        resizeMethod={'resize'}
                                        resizeMode={'cover'}
                                        paginationBoxStyle={{
                                            position: "absolute",
                                            bottom: 0,
                                            padding: 0,
                                            alignItems: "center",
                                            alignSelf: "center",
                                            justifyContent: "center",
                                            paddingVertical: 10
                                        }}
                                        dotStyle={{
                                            width: 10,
                                            height: 10,
                                            borderRadius: 5,
                                            marginHorizontal: 0,
                                            padding: 0,
                                            margin: 0,
                                            backgroundColor: "rgba(128, 128, 128, 0.92)"
                                        }}
                                        ImageComponentStyle={{ borderRadius: 10, width: '95%', marginTop: 5 }}
                                        imageLoadingColor="#2196F3"
                                    //onPressDelete={(currentImage) => this.handleDeleteImage(false, currentImage)}
                                    />}
                            </View>
                        }

                        {this.renderAttachments(attachments, 'image', true)}
                    </View>
                } />
        )
    }


    render() {
        let { client, name, description, note, address, state, step, bill, color } = this.state
        let { createdAt, createdBy, editedAt, editedBy } = this.state
        let { documentsList, documentTypes, tasksList, taskTypes, expandedTaskId, comContact, techContact } = this.state
        let { error, loading, docNotFound, toastMessage, toastType } = this.state
        const { process, processFetched } = this.state
        const { isBlockedUpdates } = this.state

        //Privilleges
        let { canCreate, canUpdate, canDelete } = this.props.permissions.projects
        const canWrite = (canUpdate && this.isEdit && !isBlockedUpdates || canCreate && !this.isEdit && !isBlockedUpdates)

        const canCreateDocument = this.props.permissions.documents.canCreate
        const canReadTasks = this.props.permissions.tasks.canRead
        const showBillSection = this.isEdit && (this.isCurrentHighRole || bill)

        const { isConnected } = this.props.network

        if (docNotFound)
            return (
                <View style={styles.mainContainer}>
                    <Appbar close title titleText={this.title} />
                    <EmptyList icon={faTimes} header='Projet introuvable' description="Le projet est introuvable dans la base de données. Il se peut qu'il ait été supprimé." offLine={!isConnected} />
                </View>
            )

        else return (
            <View style={styles.mainContainer}>
                <Appbar close title titleText={this.title} check={this.isEdit ? canWrite && !loading : !loading} handleSubmit={this.handleSubmit} del={canDelete && this.isEdit && !loading} handleDelete={this.showAlert} loading={loading} />

                {loading ?
                    this.renderPlacePictures(canWrite)
                    :
                    <ScrollView style={styles.dataContainer}>

                        {this.isEdit ?
                            (processFetched ?
                                <View>
                                    <ProcessAction
                                        initialProcess={process}
                                        project={this.project}
                                        clientId={client.id}
                                        step={step}
                                        canUpdate={canWrite && !this.isClient}
                                        isAllProcess={false}
                                        role={this.props.role}
                                    />
                                </View>
                                :
                                <Loading style={{ paddingVertical: 50 }} />
                            )
                            : null
                        }

                        <FormSection
                            sectionTitle='Informations générales'
                            sectionIcon={this.isEdit ? faRedo : faInfoCircle}
                            onPressIcon={() => {
                                if (!this.isEdit) return
                                this.fetchProject()
                            }}
                            iconColor={this.isEdit ? theme.colors.primary : theme.colors.gray_dark}
                            form={
                                <View style={{ flex: 1 }}>
                                    <MyInput
                                        label="Numéro du projet"
                                        returnKeyType="done"
                                        value={this.ProjectId}
                                        editable={false}
                                        disabled
                                    />

                                    <MyInput
                                        label="Nom du projet *"
                                        returnKeyType="done"
                                        value={name.value}
                                        onChangeText={text => updateField(this, name, text)}
                                        error={name.error}
                                        errorText={name.error}
                                        multiline={true}
                                        editable={canWrite}
                                        autoFocus={!this.isEdit}
                                    />

                                    {!this.isClient &&
                                        <ItemPicker
                                            onPress={() => navigateToScreen(this, 'ListClients', { onGoBack: this.refreshClient, prevScreen: 'CreateProject', isRoot: false })}
                                            label='Client concerné *'
                                            value={client.fullName}
                                            errorText={client.error}
                                            editable={canWrite}
                                        />
                                    }

                                    <AddressInput
                                        offLine={!isConnected}
                                        onPress={() => navigateToScreen(this, 'Address', { onGoBack: this.refreshAddress, currentAddress: address })}
                                        onChangeText={this.setAddress}
                                        clearAddress={() => this.setAddress('')}
                                        address={address}
                                        addressError={address.error}
                                        editable={canWrite}
                                        isEdit={this.isEdit}
                                    />

                                    <Picker
                                        returnKeyType="next"
                                        value={step}
                                        error={!!step.error}
                                        errorText={step.error}
                                        selectedValue={step}
                                        onValueChange={(step) => this.setState({ step })}
                                        title="Phase *"
                                        elements={steps}
                                        enabled={canWrite}
                                    />

                                    <Picker
                                        returnKeyType="next"
                                        value={state}
                                        selectedValue={state}
                                        onValueChange={(state) => this.setState({ state })}
                                        title="État *"
                                        elements={states}
                                        enabled={canWrite}
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

                                    <ColorPicker
                                        label='Couleur du projet'
                                        selectedColor={color}
                                        updateParentColor={(selectedColor) => this.setState({ color: selectedColor })}
                                        editable={canWrite}
                                    />
                                </View>
                            } />

                        <FormSection
                            sectionTitle='Contacts'
                            sectionIcon={faAddressBook}
                            form={
                                <View style={{ flex: 1 }}>
                                    <ItemPicker
                                        onPress={() => navigateToScreen(this, 'ListEmployees', {
                                            onGoBack: this.refreshComContact,
                                            prevScreen: 'CreateProject',
                                            isRoot: false,
                                            titleText: 'Choisir un commercial',
                                            query: db.collection('Users').where('role', '==', 'Commercial').where('deleted', '==', false)
                                        })
                                        }
                                        label="Contact commercial *"
                                        value={comContact.fullName}
                                        error={!!comContact.error}
                                        errorText={comContact.error}
                                        editable={canWrite}
                                        style={{ marginTop: theme.padding }}
                                    />
                                    <ItemPicker
                                        onPress={() => navigateToScreen(this, 'ListEmployees', {
                                            onGoBack: this.refreshTechContact,
                                            prevScreen: 'CreateProject',
                                            isRoot: false,
                                            titleText: 'Choisir un poseur',
                                            query: db.collection('Users').where('role', '==', 'Poseur').where('deleted', '==', false)
                                        })
                                        }
                                        label="Contact technique *"
                                        value={techContact.fullName}
                                        error={!!techContact.error}
                                        errorText={techContact.error}
                                        editable={canWrite}
                                    />
                                </View>
                            } />

                        {showBillSection && < FormSection
                            sectionTitle='Facturation'
                            sectionIcon={faEuroSign}
                            form={
                                <View style={{ flex: 1 }}>
                                    <MyInput
                                        label="Montant facturé (€)*"
                                        returnKeyType="done"
                                        keyboardType='numeric'
                                        value={bill && bill.amount || ''}
                                        onChangeText={amount => {
                                            bill.amount = amount
                                            this.setState({ bill })
                                        }}
                                    // error={!!price.error}
                                    // errorText={price.error}
                                    />
                                </View>
                            } />
                        }

                        <FormSection
                            sectionTitle='Bloc Notes'
                            sectionIcon={faQuoteRight}
                            formContainerStyle={{ paddingTop: 25 }}
                            form={
                                <View style={{ flex: 1 }}>
                                    <TextInput
                                        underlineColorAndroid="transparent"
                                        placeholder="Rapportez des notes utiles..."
                                        placeholderTextColor={theme.colors.gray_dark}
                                        numberOfLines={7}
                                        multiline={true}
                                        onChangeText={text => updateField(this, note, text)}
                                        value={note.value}
                                        style={styles.note}
                                        autoCapitalize='sentences'
                                        editable={canWrite} />
                                </View>
                            } />

                        {this.isEdit &&
                            <FormSection
                                sectionTitle='Tâches'
                                sectionIcon={faTasks}
                                form={
                                    <View style={{ flex: 1 }}>

                                        {canReadTasks &&
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5, marginTop: 10, }}>
                                                <CustomIcon icon={faEye} color={theme.colors.primary} size={14} />
                                                <Text
                                                    onPress={() => this.props.navigation.navigate('Agenda', { isAgenda: false, isRoot: false, projectFilter: { id: this.ProjectId, name: this.state.name } })}
                                                    style={[theme.customFontMSregular.caption, { color: theme.colors.primary, marginLeft: 5 }]}>{this.props.role.level === 1 ? "Voir mon agenda pour ce projet" : "Voir le planning du projet"}</Text>
                                            </View>
                                        }

                                        <List.AccordionGroup
                                            expandedId={expandedTaskId}
                                            onAccordionPress={(expandedId) => {
                                                if (expandedTaskId === expandedId)
                                                    this.setState({ expandedTaskId: '' })
                                                else
                                                    this.setState({ expandedTaskId: expandedId })
                                            }}>
                                            {taskTypes.map((type) => {
                                                let filteredTasks = tasksList.filter((task) => task.type === type)

                                                return (
                                                    <List.Accordion showArrow title={type} id={type} titleStyle={theme.customFontMSregular.body}>
                                                        {this.renderTasks(filteredTasks)}
                                                    </List.Accordion>
                                                )
                                            })}
                                        </List.AccordionGroup>
                                    </View>
                                } />
                        }

                        {this.isEdit &&
                            <FormSection
                                sectionTitle='Documents'
                                sectionIcon={faFolder}
                                form={
                                    <View style={{ flex: 1 }}>
                                        {canCreateDocument && canWrite &&
                                            <Text
                                                onPress={() => this.props.navigation.navigate('UploadDocument', { project: { id: this.ProjectId, name: this.initialState.name.value, client: this.initialState.client, subscribers: this.initialState.subscribers } })}
                                                style={[theme.customFontMSregular.caption, { color: theme.colors.primary, marginBottom: 5, marginTop: 10 }]}>+ Ajouter un document</Text>}

                                        <List.AccordionGroup
                                            expandedId={this.state.expandedId}
                                            onAccordionPress={(expandedId) => {
                                                if (this.state.expandedId === expandedId)
                                                    this.setState({ expandedId: '' })
                                                else
                                                    this.setState({ expandedId })
                                            }}>
                                            {documentTypes.map((type) => {
                                                let filteredDocuments = documentsList.filter((doc) => doc.type === type)

                                                return (
                                                    <List.Accordion showArrow title={type} id={type} titleStyle={theme.customFontMSregular.body}>
                                                        {this.renderAttachments(filteredDocuments, 'pdf', false)}
                                                    </List.Accordion>
                                                )
                                            })}
                                        </List.AccordionGroup>
                                    </View>
                                } />
                        }

                        {this.renderPlacePictures(canWrite)}
                        {canWrite && isConnected && <AddAttachment onPress={this.pickImage} style={{ marginLeft: theme.padding, marginBottom: theme.padding }} />}

                        {this.isEdit &&
                            <ActivitySection
                                createdBy={createdBy}
                                createdAt={createdAt}
                                editedBy={editedBy}
                                editedAt={editedAt}
                                navigation= {this.props.navigation}
                            />
                        }
                    </ScrollView>
                }

                <Toast
                    containerStyle={{ bottom: constants.ScreenWidth * 0.6 }}
                    message={toastMessage}
                    type={toastType}
                    onDismiss={() => this.setState({ toastMessage: '' })} />

            </View >
        )
    }
}

const mapStateToProps = (state) => {
    return {
        role: state.roles.role,
        permissions: state.permissions,
        network: state.network,
        processModels: state.process.processModels
        //fcmToken: state.fcmtoken
    }
}

export default connect(mapStateToProps)(CreateProject)



const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: theme.colors.background
    },
    dataContainer: {
        flex: 1,
        //paddingHorizontal: theme.padding
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
    note: {
        //backgroundColor: 'green',
        alignSelf: 'center',
        textAlignVertical: 'top',
        backgroundColor: '#ffffff',
        borderRadius: 5,
        paddingTop: 15,
        paddingLeft: 15,
        width: constants.ScreenWidth * 0.91,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 2,
    },
    attachment: {
        // flex: 1,
        elevation: 1,
        backgroundColor: theme.colors.gray50,
        width: '90%',
        height: 60,
        alignSelf: 'center',
        borderRadius: 5,
        marginTop: 15
    },
    task: {
        //flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginHorizontal: 15,
        marginBottom: 10,
        //marginTop: 10,
    },
})

