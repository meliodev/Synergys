import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, Keyboard, TextInput, ActivityIndicator } from 'react-native';
import { Card, Title, FAB, ProgressBar, List, TextInput as TextInputPaper } from 'react-native-paper'
import _ from 'lodash'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { faInfoCircle, faQuoteRight, faTasks, faFolder, faImage, faTimes, faChevronRight, faFileAlt, faCheckCircle } from '@fortawesome/pro-light-svg-icons'
import { faPlusCircle } from '@fortawesome/pro-solid-svg-icons'

import firebase from '@react-native-firebase/app'

import ImagePicker from 'react-native-image-picker'
import ImageView from 'react-native-image-view'
import { SliderBox } from "react-native-image-slider-box"

import moment from 'moment';
import 'moment/locale/fr'
moment.locale('fr')

import { Appbar, AutoCompleteUsers, Button, UploadProgress, FormSection, CustomIcon, TextInput as MyInput, ItemPicker, AddressInput, Picker, ProcessAction, ColorPicker, AddAttachment, Toast, Loading } from '../../components'

import * as theme from "../../core/theme";
import { constants, adminId } from "../../core/constants";
import { generateId, navigateToScreen, myAlert, updateField, nameValidator, setToast, load, pickImage, isEditOffline } from "../../core/utils";
import { notAvailableOffline, handleFirestoreError } from '../../core/exceptions';

import { fetchDocs } from "../../api/firestore-api";
import { uploadFiles } from "../../api/storage-api";
import { processMain, getCurrentStep, getCurrentAction, getPhaseId } from '../../core/process'

import { connect } from 'react-redux'

const db = firebase.firestore()

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
        this.fetchDocs = fetchDocs.bind(this)
        this.refreshClient = this.refreshClient.bind(this)
        this.refreshAddress = this.refreshAddress.bind(this)

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

        this.ProjectId = this.props.navigation.getParam('ProjectId', '')
        this.isEdit = this.ProjectId ? true : false
        this.ProjectId = this.isEdit ? this.ProjectId : generateId('GS-PR-')
        this.title = this.isEdit ? 'Modifier le projet' : 'Nouveau projet'

        this.state = {
            //TEXTINPUTS
            name: { value: "Project G", error: '' },
            description: { value: "", error: '' },
            note: { value: "", error: '' },

            //Screens
            address: { description: '', place_id: '', marker: { latitude: '', longitude: '' } },
            addressError: '',
            client: { id: 'GS-CL-9o1z', fullName: 'Client 1' },
            clientError: '',

            //Pickers
            state: 'En attente',
            step: 'Rendez-vous 1',

            //Tag Autocomplete
            suggestions: [],
            tagsSelected: [],

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
            loading: true
        }
    }

    async componentDidMount() {

        if (this.isEdit) {

            this.focusListener = this.props.navigation.addListener('willFocus', async () => {
                //this.setState({ processUpdated: false })
                await this.fetchProject() //Get current process
                await this.fetchDocuments()
                await this.fetchTasks()
                this.initialState = this.state
                // await this.processMain(this.state.process)
            })
        }

        else this.initialState = this.state

        this.fetchSuggestions()
        load(this, false)
    }


    //FETCHES: #edit
    async fetchProject() {
        await db.collection('Projects').doc(this.ProjectId).get().then((doc) => {
            if (doc.exists) {
                let { client, name, description, note, address, state, step, tagsSelected, color } = this.state
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
                tagsSelected = project.subscribers
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

                this.setState({ createdAt, createdBy, editedAt, editedBy, attachedImages, imagesView, imagesCarousel, client, name, description, note, address, state, step, tagsSelected, color, process, processFetched: true }, async () => {
                    //if (this.isInit)

                    this.initialState = this.state

                    //this.isInit = false
                })
            }
        })
    }

    fetchDocuments() {
        db.collection('Documents').where('deleted', '==', false).where('project.id', '==', this.ProjectId).orderBy('createdAt', 'DESC').get().then((querysnapshot) => {
            if (querysnapshot.empty) return

            let documentsList = []
            let documentTypes = []
            querysnapshot.forEach((doc) => {
                const document = doc.data()
                documentsList.push(document)
                documentTypes.push(document.type)
            })
            documentTypes = [...new Set(documentTypes)]
            this.setState({ documentsList, documentTypes })
        })
    }

    fetchTasks() {
        db.collection('Agenda').where('project.id', '==', this.ProjectId).get().then((agendaSnapshot) => {
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

    fetchSuggestions() {
        const query = db.collection('Users')
        this.fetchDocs(query, 'suggestions', '', () => { })
    }

    //Screen inputs
    refreshClient(isPro, id, nom, prenom) {
        let fullName = ''
        let client = { id: '', fullName: '' }

        if (isPro)
            fullName = nom

        else
            fullName = prenom + ' ' + nom

        client.id = id
        client.fullName = fullName

        this.setState({ client })
    }

    refreshAddress(address) {
        this.setState({ address, addressError: '' })
    }

    //Inputs validation
    validateInputs(isConnected) {
        let { client, name, address } = this.state

        let clientError = nameValidator(client.fullName, '"Client"')
        let nameError = nameValidator(name.value, '"Nom du projet"')
        var addressError = isConnected ? nameValidator(address.description, '"Emplacemment"') : '' //Address optional on offline mode

        if (clientError || nameError || addressError) {
            name.error = nameError
            Keyboard.dismiss()
            this.setState({ clientError, name, addressError, loading: false })
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
        if (loading || this.state === this.initialState) return

        load(this, true)

        const isValid = this.validateInputs(isConnected)
        if (!isValid) return

        let { client, name, description, note, address, state, step, tagsSelected, color } = this.state

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
        //subscribers = currentUser + collaborators (tags)
        const currentUser = { id: this.currentUser.uid, fullName: this.currentUser.displayName }
        const currentSubscriber = { id: this.currentUser.uid, fullName: this.currentUser.displayName, email: this.currentUser.email }

        var subscribers = tagsSelected.map((user) => { return { id: user.id, email: user.email, fullName: user.fullName } })
        subscribers.push(currentSubscriber)

        subscribers = subscribers.reduce((unique, o) => {
            if (!unique.some(obj => obj.id === o.id && obj.email === o.email && obj.fullName === o.fullName)) {
                unique.push(o)
            }
            return unique
        }, [])

        let project = {
            client: client,
            name: name.value,
            description: description.value,
            note: note.value,
            state: state,
            step: step,
            address: address,
            editedAt: moment().format('lll'),
            editedBy: currentUser,
            subscribers: subscribers,
            color: color,
            deleted: false,
        }

        if (!this.isEdit) {
            project.createdAt = moment().format('lll')
            project.createdBy = currentUser
            project.process = {}
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
                {attachments.map((image, key) => {
                    if (!isUpload) {
                        var DocumentId = image.DocumentId
                        image = image.attachment
                    }

                    const rightIcon = setRightIcon(key)

                    return (
                        <UploadProgress
                            attachment={image}
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

        return tasksList.map((task, key) => {
            return (
                <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('CreateTask', { isEdit: true, title: 'Modifier la tâche', DateId: task.date, TaskId: task.id })}
                    style={[styles.attachment, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15 }]}>
                    <Text style={theme.customFontMSregular.body}>{task.name}</Text>
                    <MaterialIcons
                        name='keyboard-arrow-right'
                        size={21}
                        color={theme.colors.placeholder}
                        style={{ paddingVertical: 19, paddingHorizontal: 5 }}
                    />
                </TouchableOpacity>
            )
        })
    }


    render() {
        let { client, clientError, name, description, note, address, addressError, state, step, color } = this.state
        let { createdAt, createdBy, editedAt, editedBy, isImageViewVisible, imageIndex, imagesView, imagesCarousel, attachments } = this.state
        let { documentsList, documentTypes, tasksList, taskTypes, expandedTaskId, suggestions, tagsSelected } = this.state
        let { error, loading, toastMessage, toastType } = this.state
        const { process, processFetched } = this.state

        let { canUpdate, canDelete } = this.props.permissions.projects
        canUpdate = (canUpdate || !this.isEdit)
        const canCreateDocument = this.props.permissions.documents.canCreate

        const { isConnected } = this.props.network
        const project = { id: this.ProjectId, name: name.value }

        return (
            <View style={styles.mainContainer}>
                <Appbar close={!loading} title titleText={this.title} check={this.isEdit ? canUpdate && !loading : !loading} handleSubmit={this.handleSubmit} del={canDelete && this.isEdit && !loading} handleDelete={this.showAlert} loading={loading} />

                <ScrollView style={styles.dataContainer}>

                    {!loading && this.isEdit ?
                        (processFetched ?
                            <ProcessAction
                                initialProcess={process}
                                project={project}
                                clientId={client.id}
                                step={step}
                            />
                            :
                            <Loading style={{ paddingVertical: 50 }} />
                        )
                        : null
                    }

                    {!loading &&
                        <FormSection
                            sectionTitle='Informations générales'
                            sectionIcon={faInfoCircle}
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
                                        editable={canUpdate}
                                    />

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

                                    <ColorPicker
                                        label='Couleur du projet'
                                        selectedColor={color}
                                        updateParentColor={(selectedColor) => this.setState({ color: selectedColor })} />

                                    <ItemPicker
                                        onPress={() => navigateToScreen(this, canUpdate, 'ListClients', { onGoBack: this.refreshClient, userType: 'client', prevScreen: 'CreateProject', isRoot: false, titleText: 'Clients' })}
                                        label='Client concerné *'
                                        value={client.fullName}
                                        errorText={clientError}
                                    />

                                    <AddressInput
                                        offLine={!isConnected}
                                        onPress={() => navigateToScreen(this, canUpdate, 'Address', { onGoBack: this.refreshAddress, currentAddress: address })}
                                        address={address}
                                        addressError={addressError}
                                    />

                                    <Picker
                                        returnKeyType="next"
                                        value={step}
                                        error={!!step.error}
                                        errorText={step.error}
                                        selectedValue={step}
                                        onValueChange={(step) => {
                                            this.setState({ step })
                                        }}
                                        title="Phase *"
                                        elements={steps}
                                        enabled={canUpdate}
                                        containerStyle={{ marginBottom: 5 }} />

                                    <Picker
                                        returnKeyType="next"
                                        value={state}
                                        selectedValue={state}
                                        onValueChange={(state) => this.setState({ state })}
                                        title="État *"
                                        elements={states}
                                        enabled={canUpdate} />

                                    <View style={{ marginTop: 10 }}>
                                        <Text style={theme.customFontMSregular.caption}>Collaborateurs</Text>
                                        <AutoCompleteUsers
                                            suggestions={suggestions}
                                            tagsSelected={tagsSelected}
                                            main={this}
                                            placeholder="Ajouter un utilisateur"
                                            autoFocus={false}
                                            showInput={true}
                                            suggestionsBellow={false}
                                            editable={canUpdate}
                                        />
                                    </View>
                                </View>
                            } />
                    }

                    {!loading &&
                        <FormSection
                            sectionTitle='Bloc Notes'
                            sectionIcon={faQuoteRight}
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
                                        editable={canUpdate} />
                                </View>
                            } />
                    }

                    {!loading && this.isEdit &&
                        <FormSection
                            sectionTitle='Tâches'
                            sectionIcon={faTasks}
                            form={
                                <View style={{ flex: 1 }}>
                                    <Text
                                        onPress={() => this.props.navigation.navigate('Agenda', { isAgenda: false, projectFilter: { id: this.ProjectId, name: this.state.name } })}
                                        style={[theme.customFontMSregular.caption, { color: theme.colors.primary }]}>Voir le planning du projet</Text>

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
                                                <List.Accordion showArrow title={type} id={type}>
                                                    {this.renderTasks(filteredTasks)}
                                                </List.Accordion>
                                            )
                                        })}
                                    </List.AccordionGroup>
                                </View>
                            } />
                    }

                    {!loading && this.isEdit &&
                        <FormSection
                            sectionTitle='Documents'
                            sectionIcon={faFolder}
                            form={
                                <View style={{ flex: 1 }}>
                                    {canCreateDocument && <Text onPress={() => this.props.navigation.navigate('UploadDocument', { project: { id: this.ProjectId, name: this.initialState.name.value } })} style={[theme.customFontMSregular.caption, { color: theme.colors.primary }]}>Ajouter un document</Text>}

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
                                                <List.Accordion showArrow title={type} id={type}>
                                                    {this.renderAttachments(filteredDocuments, 'pdf', false)}
                                                </List.Accordion>
                                            )
                                        })}
                                    </List.AccordionGroup>
                                </View>
                            } />
                    }

                    {isConnected &&
                        <FormSection
                            sectionTitle='Photos et plan du lieu'
                            sectionIcon={faImage}
                            form={
                                <View style={{ flex: 1 }}>
                                    {imagesView.length > 0 &&
                                        <ImageView
                                            images={imagesView}
                                            imageIndex={0}
                                            onImageChange={(imageIndex) => this.setState({ imageIndex: imageIndex })}
                                            isVisible={this.state.isImageViewVisible}
                                            onClose={() => this.setState({ isImageViewVisible: false })}
                                            renderFooter={(currentImage) => (
                                                <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                                                    <TouchableOpacity
                                                        style={{ padding: 10, backgroundColor: 'black', opacity: 0.8, borderRadius: 50, margin: 10 }}
                                                        onPress={() => this.handleDeleteImage(false, this.state.imageIndex)}>
                                                        <MaterialCommunityIcons name='delete' size={24} color='#fff' />
                                                    </TouchableOpacity>
                                                </View>)}
                                        />
                                    }

                                    {!loading &&
                                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                            {imagesCarousel.length > 0 &&
                                                <SliderBox
                                                    images={imagesCarousel}
                                                    sliderBoxHeight={200}
                                                    onCurrentImagePressed={index => this.setState({ imageIndex: index, isImageViewVisible: true })}
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
                                    {canUpdate && !loading && <AddAttachment onPress={this.pickImage} style={{ marginTop: 5 }} />}

                                </View>
                            } />
                    }

                    {!loading && this.isEdit &&
                        <FormSection
                            sectionTitle='Activité'
                            sectionIcon={faFileAlt}
                            form={
                                <View style={{ flex: 1 }}>
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

                                </View>
                            }
                        />
                    }
                </ScrollView>

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
    }
})

