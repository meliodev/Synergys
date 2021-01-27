import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, Keyboard } from 'react-native';
import { TextInput } from 'react-native';
import { Card, Title, FAB, ProgressBar, List } from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import firebase from '@react-native-firebase/app'

import ImagePicker from 'react-native-image-picker'
import ImageView from 'react-native-image-view'
import { SliderBox } from "react-native-image-slider-box"

import moment from 'moment';
import 'moment/locale/fr'
moment.locale('fr')

import Appbar from '../../components/Appbar'
import MyInput from '../../components/TextInput'
import Picker from "../../components/Picker"
import AutoCompleteUsers from '../../components/AutoCompleteUsers'
import Toast from "../../components/Toast"
import Loading from "../../components/Loading"

import * as theme from "../../core/theme";
import { constants, adminId } from "../../core/constants";
import { generatetId, myAlert, updateField, nameValidator, setToast, load } from "../../core/utils";
import { handleSetError } from '../../core/exceptions';

import { fetchDocs } from "../../api/firestore-api";
import { uploadFiles } from "../../api/storage-api";

import { connect } from 'react-redux'

const db = firebase.firestore()

const states = [
    { label: 'En attente', value: 'En attente' },
    { label: 'En cours', value: 'En cours' },
    { label: 'Terminé', value: 'Terminé' },
    { label: 'Annulé', value: 'Annulé' },
]

const steps = [
    { label: 'Prospect', value: 'Prospect' },
    { label: 'Chantier', value: 'Chantier' },
    { label: 'SAV', value: 'SAV' },
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
        this.refreshClient = this.refreshClient.bind(this)
        this.refreshAddress = this.refreshAddress.bind(this)

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleDeleteProject = this.handleDeleteProject.bind(this)
        this.handleDeleteImage = this.handleDeleteImage.bind(this)
        //this.deleteAttachments = this.deleteAttachments.bind(this)

        this.myAlert = myAlert.bind(this)
        this.uploadImages = uploadFiles.bind(this)
        this.showAlert = this.showAlert.bind(this)
        this.pickImage = this.pickImage.bind(this)

        this.initialState = {}
        this.isInit = true
        this.currentUser = firebase.auth().currentUser

        this.ProjectId = this.props.navigation.getParam('ProjectId', '')
        this.isEdit = this.ProjectId ? true : false
        this.title = this.ProjectId ? 'Modifier le projet' : 'Nouveau projet'

        this.state = {
            //AUTO-GENERATED
            ProjectId: '', //Not editable

            //TEXTINPUTS
            name: { value: "", error: '' },
            description: { value: "", error: '' },
            note: { value: "", error: '' },

            //Screens
            address: { description: '', place_id: '', marker: { latitude: '', longitude: '' } },
            addressError: '',
            client: { id: '', fullName: '' },

            //Pickers
            state: 'En attente',
            step: 'Prospect',

            //Tag Autocomplete
            suggestions: [],
            tagsSelected: [],

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

            error: '',
            loading: false
        }
    }

    async componentDidMount() {
        if (this.isEdit) {
            load(this, true)
            await this.fetchProject()
            this.fetchDocuments()
            this.fetchTasks()
            load(this, false)
        }

        //#task: avoid conflicts add auto-gen string
        else {
            const ProjectId = generatetId('GS-PR-')
            this.fetchSuggestions()
            this.setState({ ProjectId }, () => this.initialState = this.state)
        }
    }

    componentWillUnmount() {
        if (this.isEdit) {
            this.unsubscribeDocs && this.unsubscribeDocs()
            this.unsubscribeAgenda && this.unsubscribeAgenda()
            this.unsubscribeTasks && this.unsubscribeTasks()
        }
    }

    //FETCHES: #edit
    async fetchProject() {
        await db.collection('Projects').doc(this.ProjectId).get().then((doc) => {
            if (doc.exists) {
                let { ProjectId, client, name, description, note, address, state, step } = this.state
                let { createdAt, createdBy, editedAt, editedBy, attachedImages } = this.state
                let { error, loading } = this.state

                //General info
                const project = doc.data()
                ProjectId = this.ProjectId
                client = project.client
                name.value = project.name
                description.value = project.description
                note.value = project.note

                //َActivity
                createdAt = project.createdAt
                createdBy = project.createdBy
                console.log('createdBy', createdBy)
                editedAt = project.editedAt
                editedBy = project.editedBy

                //Images
                attachedImages = project.attachments
                attachedImages = attachedImages.filter((image) => !image.deleted)

                //State
                state = project.state
                step = project.step

                //Address
                address = project.address

                const imagesView = attachedImages.map((image) => {
                    return ({ source: { uri: image.downloadURL } })
                })

                const imagesCarousel = attachedImages.map((image) => image.downloadURL)

                this.setState({ createdAt, createdBy, editedAt, editedBy, attachedImages, imagesView, imagesCarousel, ProjectId, client, name, description, note, address, state, step }, () => {
                    if (this.isInit)
                        this.initialState = this.state

                    this.isInit = false
                })
            }
        })
    }

    fetchDocuments() {
        this.unsubscribeDocs = db.collection('Documents').where('deleted', '==', false).where('project.id', '==', this.ProjectId).orderBy('createdAt', 'DESC').onSnapshot((querysnapshot) => {
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
        this.unsubscribeAgenda = db.collection('Agenda').onSnapshot((querysnapshot) => {
            let tasksList = []
            let taskTypes = []
            querysnapshot.forEach(async (dateDoc) => {
                const date = dateDoc.id
                const query = dateDoc.ref.collection('Tasks').where('project.id', '==', this.ProjectId)
                this.unsubscribeTasks = query.onSnapshot((tasksSnapshot) => {
                    tasksSnapshot.forEach((doc) => {
                        const task = doc.data()
                        task.id = doc.id
                        task.date = dateDoc.id
                        tasksList.push(task)
                        taskTypes.push(task.type)
                    })

                    taskTypes = [...new Set(taskTypes)]
                    this.setState({ tasksList, taskTypes })
                })
            })
        })
    }

    fetchSuggestions() {
        const query = db.collection('Users')
        fetchDocs(this, query, 'suggestions', '', () => { })
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
    validateInputs() {
        let { client, name, address } = this.state

        let clientError = nameValidator(client.fullName, '"Client"')
        let nameError = nameValidator(name.value, '"Nom du projet"')
        let addressError = nameValidator(address.description, '"Emplacemment"')

        if (clientError || nameError || addressError) {
            name.error = nameError
            Keyboard.dismiss()
            this.setState({ clientError, name, addressError, loading: false })
            setToast(this, 'e', 'Erreur de saisie, veuillez verifier les champs.')
            return false
        }

        return true
    }

    async handleSubmit() {
        //Handle Loading or No edit done
        let { error, loading, attachments } = this.state
        if (loading || this.state === this.initialState) return
        load(this, true)

        const isValid = this.validateInputs()
        if (!isValid) return


        let { ProjectId, client, name, description, note, address, state, step, tagsSelected } = this.state

        //1. UPLOADING FILES
        // console.log('1')
        if (attachments.length > 0) {
            this.title = 'Exportation des images...'
            const reference = firebase.storage().ref('/Projects/' + ProjectId + '/Images/')
            await this.uploadImages(attachments, reference, this.state.attachedImages)
        }

        let { attachedImages } = this.state
        if (this.isEdit && this.initialState.attachedImages !== attachedImages)
            attachedImages = attachedImages.concat(this.initialState.attachedImages)

        //subscribers = editedBy + Admin + Tags added
        const currentUser = { id: this.currentUser.uid, fullName: this.currentUser.displayName }
        const admin = { id: adminId, email: 'contact@groupe-synergys.fr' }
        const subscribers = tagsSelected.map((user) => { return { id: user.id, email: user.email } })
        subscribers.push(currentUser)

        if (adminId !== currentUser.id)
            subscribers.push(admin)

        //2. ADDING project DOCUMENT
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
            attachments: attachedImages,
            subscribers: subscribers,
            deleted: false,
        }

        if (!this.isEdit) {
            project.createdAt = moment().format('lll')
            project.createdBy = currentUser
        }

        console.log('Ready to update ticket project...')
        await db.collection('Projects').doc(ProjectId).set(project, { merge: true })
            .then(() => this.props.navigation.goBack())
            .catch((e) => handleSetError(e))
            .finally(() => {
                this.title = 'Nouveau projet'
                load(this, false)
            })
    }

    showAlert() {
        const title = "Supprimer le projet"
        const message = 'Etes-vous sûr de vouloir supprimer ce projet ? Cette opération est irreversible.'
        const handleConfirm = async () => await this.handleDeleteProject()
        this.myAlert(title, message, handleConfirm)
    }

    async handleDeleteProject() {
        load(this, true)
        await db.collection('Projects').doc(this.ProjectId).update({ deleted: true })
            .then(() => this.props.navigation.goBack())
            .catch((e) => setToast(this, 'e', "Erreur lors de l'archivage du projet, veuillez réesayer."))
            .finally(() => load(this, false))
    }

    //Delete URLs from FIRESTORE 
    async handleDeleteImage(allImages, currentImage) {
        const newAttachments = this.state.attachedImages
        newAttachments[currentImage].deleted = true

        await db.collection('Projects').doc(this.ProjectId).update({ attachments: newAttachments })
        this.fetchProject()
        this.setState({ isImageViewVisible: false })
        //await this.deleteAttachments(allImages, currentImage)
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

    pickImage() {
        ImagePicker.showImagePicker(imagePickerOptions, response => {

            if (response.didCancel) console.log('User cancelled photo picker')
            else if (response.error) console.log('ImagePicker Error: ', response.error)
            else if (response.customButton) console.log('User tapped custom button: ', response.customButton)

            else {
                let attachments = this.state.attachments

                const image = {
                    path: response.path,
                    type: response.type,
                    name: response.fileName,
                    size: response.fileSize,
                    progress: 0,
                }

                attachments.push(image)
                this.setState({ attachments })
            }
        })
    }

    renderAttachments(attachments, type, isUpload) {
        let { loading } = this.state

        return attachments.map((image, key) => {

            if (!isUpload) {
                var DocumentId = image.DocumentId
                image = image.attachment
            }

            let readableSize = image.size / 1000
            readableSize = readableSize.toFixed(1)

            return (
                <TouchableOpacity
                    onPress={() => {
                        if (!isUpload)
                            this.props.navigation.navigate('UploadDocument', { isEdit: true, DocumentId: DocumentId })
                    }}
                    style={styles.attachment}>

                    <View style={{ flex: 0.9, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 0.17, justifyContent: 'center', alignItems: 'center' }}>
                            <MaterialCommunityIcons name={type === 'image' ? 'image' : 'folder'} size={24} color={type === 'image' ? theme.colors.primary : theme.colors.gray} />
                        </View>

                        <View style={{ flex: 0.68 }}>
                            <Text numberOfLines={1} ellipsizeMode='middle' style={[theme.customFontMSmedium.body]}>{image.name}</Text>
                            <Text style={[theme.customFontMSmedium.caption, { color: theme.colors.placeholder }]}>{readableSize} KB</Text>
                        </View>

                        <View style={{ flex: 0.15, justifyContent: 'center', alignItems: 'center' }}>
                            {!isUpload ?
                                < MaterialIcons
                                    name='keyboard-arrow-right'
                                    size={21}
                                    color={theme.colors.placeholder}
                                    style={{ paddingVertical: 19, paddingHorizontal: 5 }}
                                    onPress={() => this.props.navigation.navigate('UploadDocument', { isEdit: true, DocumentId: DocumentId })}
                                />
                                :
                                !loading &&
                                < MaterialCommunityIcons
                                    name='close'
                                    size={21}
                                    color={theme.colors.placeholder}
                                    style={{ paddingVertical: 19, paddingHorizontal: 5 }}
                                    onPress={() => {
                                        attachments.splice(key, 1)
                                        this.setState({ attachments })
                                    }}
                                />
                            }
                        </View>
                    </View>

                    {isUpload &&
                        <View style={{ flex: 0.1, justifyContent: 'flex-end' }}>
                            <ProgressBar progress={image.progress} color={theme.colors.primary} visible={true} />
                        </View>
                    }

                </TouchableOpacity>
            )
        })
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
        let { ProjectId, client, clientError, name, description, note, address, addressError, state, step } = this.state
        let { createdAt, createdBy, editedAt, editedBy, isImageViewVisible, imageIndex, imagesView, imagesCarousel, attachments } = this.state
        let { documentsList, documentTypes, tasksList, taskTypes, expandedTaskId, suggestions, tagsSelected } = this.state
        let { error, loading, toastMessage, toastType } = this.state

        return (
            <View style={styles.container}>
                <Appbar back={!loading} close title titleText={this.title} check={!loading} handleSubmit={this.handleSubmit} del={this.isEdit && !loading} handleDelete={this.showAlert} />

                <ScrollView style={styles.container}>

                    {!loading &&
                        <Card style={{ margin: 5 }}>
                            <Card.Content>
                                <Title>Informations générales</Title>
                                <MyInput
                                    label="Numéro du projet"
                                    returnKeyType="done"
                                    value={ProjectId}
                                    editable={false}
                                    disabled />

                                <MyInput
                                    label="Nom du projet"
                                    returnKeyType="done"
                                    value={name.value}
                                    onChangeText={text => updateField(this, name, text)}
                                    error={!!name.error}
                                    errorText={name.error}
                                    multiline={true} />

                                <MyInput
                                    label="Description"
                                    returnKeyType="done"
                                    value={description.value}
                                    onChangeText={text => updateField(this, description, text)}
                                    error={!!description.error}
                                    errorText={description.error}
                                    multiline={true} />

                                <TouchableOpacity onPress={() => this.props.navigation.navigate('ListClients', { onGoBack: this.refreshClient, prevScreen: 'CreateProject', titleText: 'Clients' })}>
                                    <MyInput
                                        label="Client"
                                        value={client.fullName}
                                        error={!!clientError}
                                        errorText={clientError}
                                        editable={false} />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => this.props.navigation.navigate('Address', { onGoBack: this.refreshAddress, currentAddress: this.state.address })}>
                                    <MyInput
                                        label="Emplacement"
                                        value={address.description}
                                        error={!!addressError}
                                        errorText={addressError}
                                        editable={false}
                                        multiline={true} />
                                </TouchableOpacity>

                                <Picker
                                    returnKeyType="next"
                                    value={step}
                                    error={!!step.error}
                                    errorText={step.error}
                                    selectedValue={step}
                                    onValueChange={(step) => this.setState({ step })}
                                    title="Étape"
                                    elements={steps} />

                                <Picker
                                    returnKeyType="next"
                                    value={state}
                                    error={!!state.error}
                                    errorText={state.error}
                                    selectedValue={state}
                                    onValueChange={(state) => this.setState({ state })}
                                    title="État"
                                    elements={states} />

                                <View style={{ marginTop: 10 }}>
                                    <Text style={[{ fontSize: 12, color: theme.colors.placeholder }]}>Collaborateurs</Text>
                                    <AutoCompleteUsers
                                        suggestions={suggestions}
                                        tagsSelected={tagsSelected}
                                        main={this}
                                        placeholder="Ajouter un utilisateur"
                                        autoFocus={false}
                                        showInput={true}
                                        editable={true}
                                        suggestionsBellow={false}
                                    />
                                </View>


                            </Card.Content>
                        </Card>
                    }

                    {!loading &&
                        <Card style={{ margin: 5 }}>
                            <Card.Content>
                                <Title style={{ marginBottom: 15 }}>Bloc Notes</Title>
                                <TextInput
                                    underlineColorAndroid="transparent"
                                    placeholder="Rapportez des notes utiles..."
                                    placeholderTextColor="grey"
                                    numberOfLines={7}
                                    multiline={true}
                                    onChangeText={text => updateField(this, note, text)}
                                    value={note.value}
                                    style={styles.note}
                                    autoCapitalize='sentences' />
                            </Card.Content>
                        </Card>
                    }

                    {!loading && this.isEdit &&
                        <Card style={{ margin: 5 }}>
                            <Card.Content>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Title>Tâches</Title>
                                    <Text onPress={() => this.props.navigation.navigate('Agenda', { isAgenda: false, projectFilter: { id: this.ProjectId, name: this.state.name } })} style={[theme.customFontMSsemibold.caption, { color: theme.colors.primary }]}>Planning du projet</Text>
                                </View>

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

                            </Card.Content>
                        </Card>
                    }

                    {!loading && this.isEdit &&
                        <Card style={{ margin: 5 }}>
                            <Card.Content>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Title>Documents</Title>
                                    <Text onPress={() => this.props.navigation.navigate('UploadDocument', { project: { id: this.ProjectId, name: this.initialState.name.value } })} style={[theme.customFontMSsemibold.caption, { color: theme.colors.primary }]}>Ajouter un document</Text>
                                </View>

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

                            </Card.Content>
                        </Card>
                    }

                    <Card style={{ paddingBottom: 20, margin: 5 }}>
                        <Card.Content>
                            {!loading &&
                                <View>
                                    <Title style={{ marginBottom: 15 }}>Photos et plan du lieu</Title>
                                </View>
                            }
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
                        </Card.Content>

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

                        {!loading ?
                            <TouchableOpacity onPress={this.pickImage} style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 15, marginTop: 15 }}>
                                <Entypo name='camera' color={theme.colors.primary} size={19} />
                                <Text style={[theme.customFontMSsemibold.body, { color: theme.colors.primary, textAlign: 'center', marginLeft: 10 }]}>Ajouter une photo</Text>
                            </TouchableOpacity>
                            :
                            <Loading size='small' style={{ marginTop: 15 }} />
                        }

                    </Card>

                    {this.isEdit && !loading &&
                        <Card style={{ margin: 5 }}>
                            <Card.Content>
                                <Title>Activité</Title>
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
        //fcmToken: state.fcmtoken
    }
}

export default connect(mapStateToProps)(CreateProject)



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

