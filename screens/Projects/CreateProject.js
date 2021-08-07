import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, Keyboard, TextInput, ActivityIndicator } from 'react-native';
import { Card, Title, FAB, ProgressBar, List, TextInput as TextInputPaper } from 'react-native-paper'
import _ from 'lodash'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { faInfoCircle, faQuoteRight, faTasks, faFolder, faImage, faTimes, faChevronRight, faFileAlt, faCheckCircle, faEye, faArrowRight, faRedo, faAddressBook, faEuroSign, faRetweet, faUser } from '@fortawesome/pro-light-svg-icons'
import { faPlusCircle } from '@fortawesome/pro-solid-svg-icons'
import ImagePicker from 'react-native-image-picker'
import ImageView from 'react-native-image-view'
import { SliderBox } from "react-native-image-slider-box"

import moment from 'moment';
import 'moment/locale/fr'
moment.locale('fr')

import ActivitySection from '../../containers/ActivitySection';
import { Appbar, AutoCompleteUsers, Button, UploadProgress, FormSection, CustomIcon, TextInput as MyInput, ItemPicker, AddressInput, Picker, ProcessAction, ColorPicker, SquarePlus, Toast, Loading, EmptyList } from '../../components'

import firebase, { db, auth } from '../../firebase'
import * as theme from "../../core/theme";
import { constants, adminId, highRoles } from "../../core/constants";
import { blockRoleUpdateOnPhase } from '../../core/privileges';
import { generateId, navigateToScreen, myAlert, updateField, nameValidator, setToast, load, pickImage, isEditOffline, refreshClient, refreshComContact, refreshTechContact, refreshAddress, setAddress, formatDocument, unformatDocument, displayError } from "../../core/utils";
import { notAvailableOffline, handleFirestoreError } from '../../core/exceptions';

import { fetchDocs, fetchDocument } from "../../api/firestore-api";
import { uploadFiles } from "../../api/storage-api";
import { getLatestProcessModelVersion } from '../../core/process'

import { connect } from 'react-redux'
import ModalCheckBoxes from '../../components/ModalCheckBoxes';

const states = [
    { label: 'En attente', value: 'En attente' },
    { label: 'En cours', value: 'En cours' },
    { label: 'Terminé', value: 'Terminé' },
    { label: 'Annulé', value: 'Annulé' },
]

const steps = [
    { label: 'Prospect', value: 'Prospect' },
    { label: 'Visite technique préalable', value: 'Visite technique préalable' },
    { label: 'Présentation étude', value: 'Présentation étude' },
    { label: 'Visite technique', value: 'Visite technique' },
    { label: 'Installation', value: 'Installation' },
    { label: 'Maintenance', value: 'Maintenance' },
]

const workTypes = [
    { label: 'PAC AIR/EAU', value: 'PAC AIR/EAU', selected: false },
    { label: 'PAC AIR/AIR (climatisation)', value: 'PAC AIR/AIR (climatisation)', selected: false },
    { label: 'BALLON THERMODYNAMIQUE', value: 'BALLON THERMODYNAMIQUE', selected: false },
    { label: 'BALLON SOLAIRE THERMIQUE', value: 'BALLON SOLAIRE THERMIQUE', selected: false },
    { label: 'PHOTOVOLTAÏQUE', value: 'PHOTOVOLTAÏQUE', selected: false },
    { label: 'PHOTOVOLTAÏQUE HYBRIDE', value: 'PHOTOVOLTAÏQUE HYBRIDE', selected: false },
    { label: 'ISOLATION ', value: 'ISOLATION ', selected: false },
    { label: 'VMC DOUBLE FLUX ', value: 'VMC DOUBLE FLUX ', selected: false },
    { label: 'POÊLE A GRANULES ', value: 'POÊLE A GRANULES ', selected: false },
    { label: 'RADIATEUR INERTIE ', value: 'RADIATEUR INERTIE ', selected: false },
]

const comSteps = ['Prospect', 'Visite technique préalable', 'Présentation étude']
const techSteps = ['Visite technique', 'Installation', 'Maintenance']

const imagePickerOptions = {
    title: 'Selectionner une image',
    takePhotoButtonTitle: 'Prendre une photo',
    chooseFromLibraryButtonTitle: 'Choisir de la librairie',
    cancelButtonTitle: 'Annuler',
    noData: true,
}

const properties = ["client", "name", "note", "address", "state", "step", "color", "comContact", "techContact", "intervenant", "bill", "attachments", "process", "createdBy", "createdAt", "editedBy", "editedAt"]

class CreateProject extends Component {
    constructor(props) {
        super(props)
      //  this.fetchDocs = fetchDocs.bind(this)
        this.refreshClient = refreshClient.bind(this)
        this.refreshComContact = refreshComContact.bind(this)
        this.refreshTechContact = refreshTechContact.bind(this)
        this.refreshAddress = refreshAddress.bind(this)
        this.setAddress = setAddress.bind(this)
        this.customBackHandler = this.customBackHandler.bind(this)

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleDeleteProject = this.handleDeleteProject.bind(this)
        this.handleDeleteImage = this.handleDeleteImage.bind(this)
        this.handleRefresh = this.handleRefresh.bind(this)
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
        this.isEdit = this.ProjectId !== ""
        this.ProjectId = this.isEdit ? this.ProjectId : generateId('GS-PR-')
        this.title = this.isEdit ? 'Modifier le projet' : 'Nouveau projet'
        this.isClient = this.props.role.id === 'client'
        this.storageRefPath = `/Projects/${this.ProjectId}/Images/`

        this.client = this.props.navigation.getParam('client', { id: '', fullName: '', email: '', role: '' })
        this.address = this.props.navigation.getParam('address', { description: '', place_id: '', marker: { latitude: '', longitude: '' }, error: '' })

        this.state = {
            //TEXTINPUTS
            name: "",
            nameError: "",
            workTypes: workTypes,
            isModalVisible: false,
            note: "",

            //Screens
            address: this.address,
            client: this.client,

            //Pickers
            state: 'En cours',
            step: 'Prospect',
            color: theme.colors.primary,
            process: null,

            comContact: { id: '', fullName: '', email: '', role: '' },
            techContact: { id: '', fullName: '', email: '', role: '' },
            intervenant: null,

            //Billing
            bill: { amount: '', closedAt: '', closedBy: { id: '', fullName: '', email: '', role: '' } },

            //logs (Auto-Gen)
            createdAt: '',
            createdBy: { id: '', fullName: '' },
            editedAt: '',
            editedBy: { id: '', fullName: '' },

            //Images
            newAttachments: [],
            attachments: [],
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
            hasPriorTechVisit: false,
            hasPriorTechVisitError: '',

            error: '',
            loading: true,
            docNotFound: false,

            //Specific privileges (poseur & commercial)
            isBlockedUpdates: false,

            scrollViewRef: null
        }
    }

    async componentDidMount() {
        if (this.isEdit) await this.initEditMode()
        this.initialState = _.cloneDeep(this.state)
        load(this, false)
    }

    async initEditMode() {
        let query = db.collection("Projects").doc(this.ProjectId)
        return new Promise((resolve, reject) => {
            query.onSnapshot(async (doc) => {
                if (!doc.exists) return null
                let project = doc.data()
                project.id = doc.id
                this.project = _.pick(project, ['id', 'name', 'client', 'step', 'comContact', 'techContact', 'intervenant', 'address'])
                project = this.setProject(project)
                if (!project) return
                this.setImageCarousel(project.attachments)
                this.setUserAccess(project.step)
                await this.fetchOtherData()
                resolve(true)
            })
        })
    }

    setProject(project) {
        if (!project)
            this.setState({ docNotFound: true })

        else {
            this.setWorkTypes(project)
            project = formatDocument(project, properties, [])
            this.setState(project)
        }
        return project
    }

    setWorkTypes(project) {
        let { workTypes } = this.state
        for (let wt of workTypes) {
            if (project.workTypes && project.workTypes.includes(wt.value))
                wt.selected = true
        }
        this.setState({ workTypes })
    }

    setImageCarousel(attachments) {
        if (typeof (attachments) === 'undefined' || attachments && attachments.length === 0) return
        attachments = attachments.filter((image) => !image.deleted)
        const imagesView = attachments.map((image) => { return ({ source: { uri: image.downloadURL } }) })
        const imagesCarousel = attachments.map((image) => image.downloadURL)
        this.setState({ imagesView, imagesCarousel })
    }

    setUserAccess(step) {
        const currentRole = this.props.role.id
        const isBlockedUpdates = blockRoleUpdateOnPhase(currentRole, step)
        this.setState({ isBlockedUpdates })
    }

    async fetchOtherData() {
        await this.fetchDocuments()
        await this.fetchTasks()
    }

    fetchDocuments() {
        const query = db
            .collection('Documents')
            .where('deleted', '==', false)
            .where('project.id', '==', this.ProjectId)
            .orderBy('createdAt', 'DESC')

        return query.get().then((querysnapshot) => {
            if (querysnapshot.empty) return
            let documentsList = []
            let documentTypes = []
            querysnapshot.forEach((doc) => {
                let document = doc.data()
                document.id = doc.id
                documentsList.push(document)
                documentTypes.push(document.type)
            })
            documentTypes = [...new Set(documentTypes)]
            this.setState({ documentsList, documentTypes })
        })
    }

    fetchTasks() {
        const query = db.collection('Agenda').where('project.id', '==', this.ProjectId)
        return query.get().then((agendaSnapshot) => {
            if (agendaSnapshot.empty) return
            let tasksList = []
            let taskTypes = []
            agendaSnapshot.forEach(async (taskDoc) => {
                const task = taskDoc.data()
                //task.id = taskDoc.id
                task.date = taskDoc.dateKey
                tasksList.push(task)
                taskTypes.push(task.type)
                taskTypes = [...new Set(taskTypes)]
                this.setState({ tasksList, taskTypes })
            })
        })
    }

    //Inputs validation
    validateInputs(isConnected) {
        let { client, name, address, comContact, techContact, step, hasPriorTechVisit } = this.state

        const isStepTech = techSteps.includes(step)
        const clientError = nameValidator(client.fullName, '"Client"')
        const nameError = nameValidator(name, '"Nom du projet"')
        const comContactError = nameValidator(comContact.id, '"Contact commercial"')
        const techContactError = isStepTech ? nameValidator(techContact.id, '"Contact technique"') : ''
        const addressError = '' //Address optional on offline mode
        //var addressError = isConnected ? nameValidator(address.description, '"Emplacemment"') : '' //Address optional on offline mode
        const hasPriorTechVisitError = this.isEdit ? "" : hasPriorTechVisit ? "" : "La création d'une visite technique préalable est obligatoire."

        if (clientError || nameError || addressError || comContactError || techContactError || hasPriorTechVisitError) {
            client.error = clientError
            comContact.error = comContactError
            techContact.error = techContactError
            address.error = addressError
            this.setState({ client, nameError, address, comContact, techContact, hasPriorTechVisitError, loading: false })
            setToast(this, 'e', 'Erreur de saisie, veuillez verifier les champs.')
            return false
        }

        return true
    }

    catch(e) {
        const { message } = e
        displayError({ message })
    }

    //#OOS
    async handleSubmit() {
        Keyboard.dismiss()

        if (this.state.loading || _.isEqual(this.state, this.initialState)) return
        load(this, true)

        const { isConnected } = this.props.network
        let isEditOffLine = isEditOffline(this.isEdit, isConnected)
        if (isEditOffLine) {
            load(this, false)
            return
        }

        const isValid = this.validateInputs(isConnected)
        if (!isValid) {
            load(this, false)
            return
        }

        let attachments = this.initialState.attachments
        //1. UPLOADING FILES (ONLINE ONLY)
        if (isConnected) {
            const { newAttachments } = this.state
            if (newAttachments.length > 0) {
                this.title = 'Exportation des images...'
                const uploadedImages = await this.uploadFiles(newAttachments, this.storageRefPath)
                this.title = this.isEdit ? "Modifier le projet" : "Nouveau projet"
                if (uploadedImages) {
                    attachments = attachments.concat(uploadedImages)
                    this.setImageCarousel(attachments)
                    this.setState({ attachments, newAttachments: [] })
                }
                else setToast(this, 'e', "Les images n'ont pas pu être importées. Veuillez réessayer.")
            }
        }

        const props = ["name", "client", "note", "state", "step", "address", "color", "bill", "comContact", "techContact", "intervenant"]
        let project = unformatDocument(this.state, props, this.props.currentUser, this.isEdit)
        project.attachments = attachments
        project.process = {
            version: getLatestProcessModelVersion(this.props.processModels)
        }
        const selectedWorkTypes = this.state.workTypes.filter((wt) => wt.selected === true)
        const selectedWorkTypesValues = selectedWorkTypes.map((wt) => wt.value)
        project.workTypes = selectedWorkTypesValues

        db.collection('Projects').doc(this.ProjectId).set(project, { merge: true })
        await this.refreshState(project)
    }

    async refreshState(project) {
        try {
            const toastMessage = this.isEdit ? 'Le projet a été modifié' : 'Le projet a été crée.'
            if (!this.isEdit) {
                const { createdAt, createdBy } = project
                this.setState({ createdAt, createdBy }, async () => {
                    this.project = _.pick(project, ['name', 'client', 'step', 'comContact', 'techContact', 'intervenant', 'address'])
                    this.project.id = this.ProjectId
                    this.title = 'Modifier le projet'
                    this.isEdit = true
                    this.setState({ process: project.process }) //re-rendering (showing process)
                    this.setImageCarousel(project.attachments)
                    this.setUserAccess(project.step)
                    await this.fetchOtherData()
                })
            }

            load(this, false)
            setToast(this, 's', toastMessage)
            this.initialState = _.cloneDeep(this.state)
        }
        catch (e) {
            const { message } = e
            displayError({ message })
        }
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
        let { attachments } = this.state
        attachments[currentImage].deleted = true
        db.collection('Projects').doc(this.ProjectId).update({ attachments })
        this.setState({ attachments, isImageViewVisible: false })
    }

    async pickImage() {
        let { newAttachments } = this.state
        newAttachments = await pickImage(newAttachments)
        this.setState({ newAttachments })
    }

    renderAttachments(newAttachments, type, isUpload) {
        let { loading } = this.state

        const onPressAttachment = (isUpload, DocumentId) => {
            if (isUpload) return
            this.props.navigation.navigate('UploadDocument', { DocumentId })
        }

        const setRightIcon = (key) => {
            const rightIconStyle = { flex: 0.15, justifyContent: 'center', alignItems: 'center' }
            return (
                <TouchableOpacity style={rightIconStyle} onPress={() => onPressRightIcon(key)}>
                    <CustomIcon
                        icon={isUpload ? faTimes : faChevronRight}
                        style={{ color: theme.colors.gray_dark }}
                        size={16}
                    />
                </TouchableOpacity>
            )
        }

        const onPressRightIcon = (key) => {
            if (!isUpload) return
            newAttachments.splice(key, 1)
            this.setState({ newAttachments })
        }

        return (
            <View style={styles.attachmentsContainer}>
                {newAttachments.map((attachment, key) => {
                    if (!isUpload) {
                        var DocumentId = attachment.id
                        attachment = attachment.attachment
                    }
                    return (
                        <UploadProgress
                            attachment={attachment}
                            showRightIcon={!loading}
                            rightIcon={setRightIcon(key)}
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

    renderPlacePictures(canWrite, isConnected) {

        const { isImageViewVisible, imageIndex, imagesView, imagesCarousel, newAttachments, loading } = this.state

        return (
            <FormSection
                hide={!this.isEdit}
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
                                    />
                                }
                            </View>
                        }
                        {this.renderAttachments(newAttachments, 'image', true)}
                        {canWrite && isConnected && !loading && <SquarePlus onPress={this.pickImage} style={{ marginTop: 8 }} />}
                    </View>
                } />
        )
    }

    async handleRefresh() {
        load(this, true)
        await this.initEditMode()
        load(this, false)
    }

    renderTasksForm() {
        const canCreateTasks = this.props.permissions.tasks.canCreate
        const { tasksList, taskTypes, expandedTaskId, name, client, step, address, comContact, techContact, intervenant, hasPriorTechVisitError } = this.state

        const onPressLink1 = () => {
            this.props.navigation.navigate('Agenda', {
                isAgenda: false,
                isRoot: false,
                projectFilter: { id: this.ProjectId, name: this.state.name }
            })
        }

        const onPressLink2 = () => {
            this.props.navigation.navigate('CreateTask', {
                project: { id: this.ProjectId, name, client, step, address, comContact, techContact, intervenant },
                dynamicType: true,
                taskType: { label: 'Visite technique préalable', value: 'Visite technique préalable', natures: ['com'] },
                onGoBack: (refresh, task) => {
                    let { tasksList, taskTypes } = this.state
                    tasksList.push(task)
                    taskTypes.push('Visite technique préalable')
                    this.setState({ tasksList, taskTypes, hasPriorTechVisit: true })
                }
            })
        }

        return (
            <FormSection
                sectionTitle='Tâches'
                sectionIcon={faTasks}
                form={tasksList.length > 0 ?
                    <View style={{ flex: 1 }}>

                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5, marginTop: 10 }}>
                            <CustomIcon icon={faEye} color={theme.colors.primary} size={14} />
                            <Text
                                onPress={onPressLink1}
                                style={[theme.customFontMSregular.caption, { color: theme.colors.primary, marginLeft: 5 }]}>
                                {this.props.role.level === 1 ? "Voir mon agenda pour ce projet" : "Voir le planning du projet"}
                            </Text>
                        </View>

                        <List.AccordionGroup
                            expandedId={expandedTaskId}
                            onAccordionPress={(expandedId) => {
                                const isExpanded = expandedTaskId === expandedId
                                this.setState({ expandedTaskId: isExpanded ? '' : expandedId })
                            }}
                        >
                            {this.state.taskTypes.map((type) => {
                                let filteredTasks = this.state.tasksList.filter((task) => task.type === type)
                                return (
                                    <List.Accordion
                                        id={type}
                                        showArrow
                                        title={type}
                                        titleStyle={theme.customFontMSregular.body}
                                    >
                                        {this.renderTasks(filteredTasks)}
                                    </List.Accordion>
                                )
                            })}
                        </List.AccordionGroup>
                    </View>
                    :
                    <View style={{ flex: 1 }}>
                        <ItemPicker
                            onPress={onPressLink2}
                            label='Créer une visite technique préalable *'
                            errorText={hasPriorTechVisitError}
                            editable={canCreateTasks}
                        />
                    </View>
                } />
        )
    }

    customBackHandler() {
        const { hasPriorTechVisit, tasksList } = this.state
        if (!this.isEdit && hasPriorTechVisit) {
            const title = "Abandon du projet"
            const message = 'Êtes-vous sûr de vouloir abandonner la création du projet. Les données saisies seront perdues.'
            const handleConfirm = () => {
                //Delete "Visite technique préalable"
                if (tasksList.length > 0) {
                    const taskId = tasksList[0].id
                    db.collection("Agenda").doc(taskId).delete()
                }
                this.props.navigation.goBack()
            }
            this.myAlert(title, message, handleConfirm)
        }
        else this.props.navigation.goBack()
    }

    render() {
        let {
            client, name, workTypes, note, address, state, step, bill, color, process,
            createdAt, createdBy, editedAt, editedBy,
            documentsList, documentTypes, taskTypes, comContact, techContact,
            nameError, loading, docNotFound, toastMessage, toastType,
            isBlockedUpdates
        } = this.state
        const { isConnected } = this.props.network

        //Privilleges
        let { canCreate, canUpdate, canDelete } = this.props.permissions.projects
        const canWrite = (canUpdate && this.isEdit && !isBlockedUpdates || canCreate && !this.isEdit && !isBlockedUpdates)
        const canCreateDocument = this.props.permissions.documents.canCreate
        const canReadTasks = this.props.permissions.tasks.canRead

        const showBillSection = this.isEdit && (this.isCurrentHighRole || bill)
        const showProcessAction = this.isEdit && this.project && process

        const isStepTech = techSteps.includes(step)
        const fields = [name, client.id, address.description, comContact.id]
        let showTasksForm = !fields.includes("") && (!isStepTech || isStepTech && techContact.id !== "")
        showTasksForm = canReadTasks && (this.isEdit || !this.isEdit && showTasksForm)
        const showContactTechnic = isStepTech || (process && process.rdn && process.rdn.steps.technicalVisitCreation) //Step containing tech contact definition (before VT Phase)

        if (docNotFound)
            return (
                <View style={styles.mainContainer}>
                    <Appbar close title titleText={this.title} />
                    <EmptyList
                        icon={faTimes}
                        header='Projet introuvable'
                        description="Le projet est introuvable dans la base de données. Il se peut qu'il ait été supprimé."
                        offLine={!isConnected}
                    />
                </View>
            )

        else return (
            <View style={styles.mainContainer}>
                <Appbar
                    close
                    title
                    titleText={this.title}
                    check={this.isEdit ? canWrite && !loading : !loading}
                    handleSubmit={this.handleSubmit}
                    del={canDelete && this.isEdit && !loading}
                    handleDelete={this.showAlert} loading={loading}
                    refresh={this.isEdit && !loading}
                    handleRefresh={this.handleRefresh}
                    customBackHandler={this.customBackHandler}
                />

                {loading ?
                    this.renderPlacePictures(canWrite, isConnected)
                    :
                    <ScrollView style={styles.dataContainer} keyboardShouldPersistTaps="always" ref={ref => this.scrollView = ref}>

                        {showProcessAction &&
                            <View>
                                <ProcessAction
                                    process={this.state.process}
                                    project={this.project}
                                    clientId={client.id}
                                    step={step}
                                    canUpdate={canWrite && !this.isClient}
                                    isAllProcess={false}
                                    role={this.props.role}
                                    scrollTo={(position) => this.scrollView.scrollTo(position)}
                                />
                            </View>
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

                        <FormSection
                            sectionTitle='Informations générales'
                            sectionIcon={faInfoCircle}
                            isLoading={loading}
                            form={
                                <View style={{ flex: 1 }}>

                                    {this.isEdit &&
                                        <MyInput
                                            label="Numéro du projet"
                                            returnKeyType="done"
                                            value={this.ProjectId}
                                            editable={false}
                                            disabled
                                        />
                                    }

                                    <MyInput
                                        label="Nom du projet *"
                                        returnKeyType="done"
                                        value={name}
                                        onChangeText={name => this.setState({ name, nameError: '' })}
                                        error={nameError}
                                        errorText={nameError}
                                        multiline={true}
                                        editable={canWrite && !this.isClient}
                                    // autoFocus={!this.isEdit}
                                    />

                                    {!this.isClient &&
                                        <Picker
                                            returnKeyType="next"
                                            value={step}
                                            error={!!step.error}
                                            errorText={step.error}
                                            selectedValue={step}
                                            onValueChange={(step) => this.setState({ step })}
                                            title="Étape *"
                                            elements={steps}
                                            enabled={canWrite && !this.isClient}
                                        />
                                    }

                                    {!this.isClient && this.isEdit &&
                                        <Picker
                                            returnKeyType="next"
                                            value={state}
                                            selectedValue={state}
                                            onValueChange={(state) => this.setState({ state })}
                                            title="État *"
                                            elements={states}
                                            enabled={canWrite && !this.isClient}
                                        />
                                    }

                                    {this.isClient &&
                                        <MyInput
                                            label="Phase *"
                                            value={step + ' ' + state}
                                            error={nameError}
                                            errorText={nameError}
                                            multiline={true}
                                            editable={false}
                                        />
                                    }

                                    <ModalCheckBoxes
                                        items={workTypes}
                                        itemsFetched={true}
                                        updateItems={(workTypes) => this.setState({ workTypes })}
                                        onPressItem={(item) => console.log(item)}
                                    />

                                    {/* <ColorPicker
                                        label='Couleur du projet'
                                        selectedColor={color}
                                        updateParentColor={(selectedColor) => this.setState({ color: selectedColor })}
                                        editable={canWrite}
                                    /> */}
                                </View>
                            } />

                        <FormSection
                            sectionTitle='Client'
                            sectionIcon={faUser}
                            form={
                                <View style={{ flex: 1 }}>
                                    {!this.isClient &&
                                        <ItemPicker
                                            onPress={() => navigateToScreen(this, 'ListClients', { onGoBack: this.refreshClient, prevScreen: 'CreateProject', isRoot: false })}
                                            label='Client concerné *'
                                            value={client.fullName}
                                            errorText={client.error}
                                            editable={canWrite && !this.isEdit && this.client.id === ""}
                                        />
                                    }

                                    {client.id !== "" &&
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
                                    }

                                </View>
                            }
                        />

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
                                        value={comContact.fullName || ''}
                                        error={!!comContact.error}
                                        errorText={comContact.error}
                                        editable={canWrite && !this.isClient}
                                    />

                                    {showContactTechnic &&
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
                                            value={techContact.fullName || ''}
                                            error={!!techContact.error}
                                            errorText={techContact.error}
                                            editable={canWrite && highRoles.includes(this.props.role.id)}
                                        />
                                    }
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
                                        value={bill.amount}
                                        onChangeText={amount => {
                                            bill.amount = amount
                                            this.setState({ bill })
                                        }}
                                        editable={canWrite && !this.isClient}
                                    // error={!!price.error}
                                    // errorText={price.error}
                                    />
                                </View>
                            } />
                        }

                        {showTasksForm && this.renderTasksForm()}

                        <FormSection
                            hide={!this.isEdit}
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
                                        onChangeText={note => this.setState({ note })}
                                        value={note}
                                        style={styles.note}
                                        autoCapitalize='sentences'
                                        editable={canWrite} />
                                </View>
                            } />

                        {this.isEdit &&
                            <FormSection
                                sectionTitle='Documents'
                                sectionIcon={faFolder}
                                form={
                                    <View style={{ flex: 1 }}>
                                        {canCreateDocument && canWrite &&
                                            <Text
                                                onPress={() => this.props.navigation.navigate('UploadDocument', { project: this.project })}
                                                style={[theme.customFontMSregular.caption, { color: theme.colors.primary, marginBottom: 5, marginTop: 16 }]}>+ Ajouter un document</Text>
                                        }

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

                        {this.renderPlacePictures(canWrite, isConnected)}
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
        processModels: state.process.processModels,
        currentUser: state.currentUser
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
    attachmentsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
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


    //Delete Images from STORAGE //#RULE: NEVER DELETE FILES
    // async deleteAttachments(allImages, currentImage) {
    //     let urls = []

    //     if (allImages)
    //         urls = this.initialState.attachments.map(image => image.downloadURL) //Delete all images

    //     else
    //         urls = [this.initialState.attachments[currentImage].downloadURL] //Delete single image

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