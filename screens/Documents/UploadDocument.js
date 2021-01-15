import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Keyboard, Alert, Platform } from 'react-native';
import { Card, Title, TextInput, ProgressBar } from 'react-native-paper'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import firebase from '@react-native-firebase/app'
import { connect } from 'react-redux'

import FilePickerManager from 'react-native-file-picker';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob'
import RNFS from 'react-native-fs'

import moment from 'moment';
import 'moment/locale/fr'
moment.locale('fr')

import Appbar from '../../components/Appbar'
import MyInput from '../../components/TextInput'
import Picker from "../../components/Picker"
import Button from "../../components/Button"
import Toast from "../../components/Toast"
import Loading from "../../components/Loading"

import { fetchDocs } from "../../api/firestore-api";
import { generatetId, myAlert, updateField, downloadFile, nameValidator, setToast, load } from "../../core/utils";
import * as theme from "../../core/theme";
import { constants } from "../../core/constants";
import { handleSetError } from '../../core/exceptions';

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
        this.fetchDocument = this.fetchDocument.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        // this.pickFile = this.pickFile.bind(this)
        this.pickDoc = this.pickDoc.bind(this)
        this.myAlert = myAlert.bind(this)
        this.showAlert = this.showAlert.bind(this)
        this.refreshProject = this.refreshProject.bind(this)
        this.uploadFile = this.uploadFile.bind(this)
        this.deleteFile = this.deleteFile.bind(this)

        this.initialState = {}
        this.isInit = true
        this.currentUser = firebase.auth().currentUser

        this.DocumentId = this.props.navigation.getParam('DocumentId', '')
        this.isEdit = this.props.navigation.getParam('isEdit', false)
        this.title = this.props.navigation.getParam('title', '')
        this.project = this.props.navigation.getParam('project', '')

        this.cachePath = ''

        this.state = {
            //AUTO-GENERATED
            DocumentId: '', //Not editable

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
            attachment: {
                path: '',
                type: '',
                name: '',
                size: '',
                progress: 0
            },

            //logs
            createdBy: { id: '', fullName: '' },
            createdAt: '',
            editedBy: { id: '', fullName: '' },
            editededAt: '',
            signatures: [],

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
        }

        else {
            if (this.project)  // coming from CreateProject Screen
                this.setState({ project: this.project })

            const DocumentId = generatetId('GS-DOC-')
            this.setState({ DocumentId }, () => this.initialState = this.state)
        }
    }

    //on Edit
    async fetchDocument() {
        await db.collection('Documents').doc(this.DocumentId).get().then((doc) => {
            console.log('onsnapshot..')

            let { DocumentId, project, name, description, type, state, attachment } = this.state
            let { createdAt, createdBy, editedAt, editedBy } = this.state
            let { error, loading } = this.state

            //General info
            DocumentId = this.DocumentId
            project = doc.data().project
            name.value = doc.data().name
            description.value = doc.data().description

            //َActivity
            createdAt = doc.data().createdAt
            createdBy = doc.data().createdBy
            editedAt = doc.data().editedAt
            editedBy = doc.data().editedBy

            //State & Type
            state = doc.data().state
            type = doc.data().type

            //Attachment
            attachment = doc.data().attachment

            this.setState({ DocumentId, project, name, description, state, type, attachment, createdAt, createdBy, editedAt, editedBy }, () => {
                if (this.isInit)
                    this.initialState = this.state

                this.isInit = false
            })
        })
    }

    async fetchSignees() {
        let signatures = []

        db.collection('Documents').doc(this.DocumentId).collection('Attachments')
            //.orderBy('signedAt', 'DESC')
            .get().then((querysnapshot) => {
                querysnapshot.forEach((doc) => {
                    console.log(doc.id)
                    let signData = { signedBy: '', signedAt: '' }

                    if (doc.data().sign_proofs_data) {
                        signData.signedBy = doc.data().sign_proofs_data.signedBy
                        signData.signedAt = doc.data().sign_proofs_data.signedAt
                        signatures.push(signData)
                    }
                })
                this.setState({ signatures })
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
        let docId = this.DocumentId
        let docURL = this.initialState.attachment.downloadURL

        await db.collection('Documents').doc(docId).update({ deleted: true })
            .then(async () => this.props.navigation.goBack()) //removed deleteAttachment: Client wants to keep all files archived.
            .catch((e) => console.error(e))
    }

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
                            name: `Scan ${moment().format('DD-MM-YYYY HHmmss')}.pdf`,
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

    //Resolves with 'success' or 'failure'
    async uploadFile() {
        let { attachment, project, type, name, DocumentId } = this.state

        const metadata = {
            uploadedBy: this.currentUser.uid,
            type: type,
            name: name.value
        }

        const reference = firebase.storage().ref(`Projects/${project.id}/Documents/${type}/${DocumentId}/${moment().format('ll')}/${attachment.name}`)
        const uploadTask = reference.putFile(attachment.path, { customMetadata: metadata })

        const promise = new Promise((resolve, reject) => {
            uploadTask
                .on('state_changed', async function (tasksnapshot) {
                    var progress = Math.round((tasksnapshot.bytesTransferred / tasksnapshot.totalBytes) * 100)
                    console.log('Upload attachment ' + progress + '% done')
                    attachment.progress = progress / 100
                    this.setState({ attachment })
                }.bind(this))

            uploadTask
                .then((res) => {
                    attachment.downloadURL = res.downloadURL
                    this.setState({ attachment })
                    resolve('success')
                })
                .catch(err => {
                    this.setState({ loading: false })
                    setToast(this, 'e', "Erreur lors de l'exportation de la pièce jointe, veuillez réessayer.")
                    reject('failure')
                })
        })

        return promise
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

    async handleSubmit() {
        //Handle Loading or No edit done
        if (this.state.loading || this.state === this.initialState) return

        load(this, true)

        //0. Validate inputs
        const isValid = this.validateInputs()
        if (!isValid) return

        //1. Upload attachment & Create Document
        if (this.state.attachment.name) {

            //1.1 Delete existing file (edit mode)
            // if (this.isEdit && this.initialState.attachment !== this.state.attachment)
            //     await this.deleteFile()

            //1.2 Upload file
            if (this.isEdit && this.initialState.attachment !== this.state.attachment || !this.isEdit) {

                this.setState({ uploading: true })
                const result = await this.uploadFile()
                this.setState({ uploading: false })
                if (result === 'failure') return

                //Move document to Synergys/Documents (to open & sign later.. without downloading file)
                const fromPath = this.cachePath
                const Dir = Platform.OS === 'ios' ? RNFetchBlob.fs.dirs.DocumentDir : RNFetchBlob.fs.dirs.DownloadDir
                const destPath = `${Dir}/Synergys/Documents/${this.state.attachment.name}`
                await RNFS.moveFile(fromPath, destPath)
            }

            // 2. ADDING document to firestore
            let { DocumentId, project, name, description, type, state, attachment } = this.state

            attachment.generation = 'upload' //possible values: ['upload', 'sign', 'app'] upload: uploaded by user; sign: generated after signature; app: pdf generated by app
            delete attachment.progress

            let document = {
                project: project,
                name: name.value,
                description: description.value,
                type: type,
                state: state,
                attachment: attachment, //To Keep track of last attached file
                editedAt: moment().format('lll'),
                editedBy: { id: this.currentUser.uid, fullName: this.currentUser.displayName },
                deleted: false,
            }

            if (!this.isEdit) {
                document.createdAt = moment().format('lll')
                document.createdBy = { id: this.currentUser.uid, fullName: this.currentUser.displayName }
            }

            console.log('Ready to add document & attachment...')
            const batch = db.batch()
            const documentRef = db.collection('Documents').doc(DocumentId)
            const attachmentsRef = db.collection('Documents').doc(DocumentId).collection('Attachments').doc()
            batch.set(documentRef, document, { merge: true })
            batch.set(attachmentsRef, attachment)

            batch.commit()
                .then(() => this.props.navigation.goBack())
                .catch(e => handleSetError(e))
                .finally(() => this.setState({ loading: false, uploading: false }))
        }
    }

    async deleteFile() {
        let fileRef = firebase.storage().refFromURL(this.initialState.attachment.downloadURL)
        await fileRef.delete()
            .then(() => console.log(`File with url: ${this.initialState.attachment.downloadURL} has been deleted !`))
            .catch(e => {
                this.setState({ loading: false })
                setToast(this, 'e', 'Erreur inattendue, veuillez réessayer.')
            })
    }

    refreshProject(project) {
        this.setState({ project, projectError: '' })
    }

    renderAttachment() {
        let { attachment, loading } = this.state

        let readableSize = attachment.size / 1000
        readableSize = readableSize.toFixed(2)

        return (
            <View style={{ elevation: 1, backgroundColor: theme.colors.gray50, width: '90%', height: 60, alignSelf: 'center', borderRadius: 5, marginTop: 15 }}>
                <View style={{ flex: 0.9, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 0.17, justifyContent: 'center', alignItems: 'center' }}>
                        <MaterialCommunityIcons name='image' size={24} color={theme.colors.primary} />
                    </View>

                    <View style={{ flex: 0.68 }}>
                        <Text numberOfLines={1} ellipsizeMode='middle' style={[theme.customFontMSmedium.body]}>{attachment.name}</Text>
                        <Text style={[theme.customFontMSmedium.caption, { color: theme.colors.placeholder }]}>{readableSize} KB</Text>
                    </View>

                    <View style={{ flex: 0.15, justifyContent: 'center', alignItems: 'center' }}>
                        {!loading &&
                            <MaterialCommunityIcons
                                name='close'
                                size={21}
                                color={theme.colors.placeholder}
                                style={{ paddingVertical: 19, paddingHorizontal: 5 }}
                                onPress={() => {
                                    const attachment = {
                                        path: '',
                                        type: '',
                                        name: '',
                                        size: '',
                                        progress: 0
                                    }
                                    this.setState({ attachment })
                                }}
                            />
                        }
                    </View>
                </View>
                <View style={{ flex: 0.1, justifyContent: 'flex-end' }}>
                    <ProgressBar progress={attachment.progress} color={theme.colors.primary} visible={true} />
                </View>
            </View>
        )
    }

    renderSignees() {
        const { signatures } = this.state
        console.log(signatures)

        return signatures.map((signature, index) => {
            return (
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: 30, marginBottom: 10 }}>
                    <MaterialCommunityIcons name='pen' size={24} color={theme.colors.placeholder} />
                    <View>
                        <Text numberOfLines={1} style={[theme.customFontMSmedium.body, { marginLeft: 15 }]}><Text style={[theme.customFontMSsemibold.body, { color: theme.colors.primary }]} onPress={() => this.props.navigation.navigate('Profile', { userId: signature.signedBy.id })}>{signature.signedBy.fullName}</Text> a signé le document</Text>
                        <Text style={[theme.customFontMSmedium.caption, { marginLeft: 15, color: theme.colors.placeholder }]}>le {moment(signature.signedAt, 'lll').format('ll')} à {moment(signature.signedAt, 'lll').format('HH:mm')}</Text>
                    </View>
                </View >
            )
        })
    }

    render() {
        let { DocumentId, project, name, description, type, state, attachment } = this.state
        let { createdAt, createdBy, editedAt, editedBy, signatures } = this.state
        let { error, loading, uploading, toastType, toastMessage, projectError } = this.state

        return (
            <View style={styles.container}>
                <Appbar back={!loading} close title titleText={loading ? 'Exportation du document...' : this.isEdit ? name.value : 'Nouveau document'} check={!loading} handleSubmit={this.handleSubmit} del={this.isEdit && !loading} handleDelete={this.showAlert} />

                {loading ?
                    <View style={{ flex: 1 }}>
                        {uploading && this.renderAttachment()}
                        <Loading size='small' style={{ justifyContent: 'flex-start', marginTop: 15 }} />
                    </View>
                    :
                    <View style={{ flex: 1 }}>
                        {this.isEdit &&
                            <Button mode="outlined" style={{ marginTop: 0 }} onPress={() => {
                                this.props.navigation.navigate('Signature', { onGoBack: this.fetchDocument, ProjectId: project.id, DocumentId: this.DocumentId, DocumentType: type, fileName: this.state.attachedFile.name, url: this.state.attachedFile.downloadURL })
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
                                        value={DocumentId}
                                        editable={false}
                                        disabled
                                    />

                                    <TouchableOpacity onPress={this.pickDoc}>
                                        <MyInput
                                            label="Pièce jointe"
                                            value={attachment.name}
                                            editable={false}
                                            multiline
                                            right={<TextInput.Icon name='attachment' color={theme.colors.placeholder} onPress={this.pickDoc} />} />
                                    </TouchableOpacity>

                                    <MyInput
                                        label="Nom du document"
                                        returnKeyType="done"
                                        value={name.value}
                                        onChangeText={text => updateField(this, name, text)}
                                        error={!!name.error}
                                        errorText={name.error}
                                        multiline={true}
                                    />

                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('ListProjects', { onGoBack: this.refreshProject, prevScreen: 'UploadDocument', isRoot: false, title: 'Choix du projet', showFAB: false })}>
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
                                style={[styles.signButton, { backgroundColor: this.isEdit ? theme.colors.primary : theme.colors.gray50 }]}
                                onPress={() => {
                                    if (this.isEdit)
                                        this.props.navigation.navigate('Signature', { onGoBack: this.fetchDocument, ProjectId: project.id, DocumentId: this.DocumentId, DocumentType: type, fileName: this.state.attachedFile.name, url: this.state.attachedFile.downloadURL, initMode: 'sign' })
                                }}>
                                <Text style={[theme.customFontMSmedium.body, { color: this.isEdit ? '#fff' : theme.colors.gray }]}>signer</Text>
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

