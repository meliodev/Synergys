import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Keyboard, Alert, Image, Platform } from 'react-native';
import { Card, Title, TextInput } from 'react-native-paper'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Modal from 'react-native-modal'
import firebase from '@react-native-firebase/app'
import ImageView from 'react-native-image-view'
import { connect } from 'react-redux'

import moment from 'moment';
import 'moment/locale/fr'
moment.locale('fr')

import Appbar from '../../components/Appbar'
import MyInput from '../../components/TextInput'
import Picker from "../../components/Picker"
import Button from "../../components/Button"
import RadioButton from "../../components/RadioButton"
import UploadProgress from "../../components/UploadProgress"
import Toast from "../../components/Toast"
import Loading from "../../components/Loading"

import { fetchDocs } from "../../api/firestore-api";
import { generatetId, myAlert, updateField, pickImage, renderImages, nameValidator, priceValidator, setToast, load } from "../../core/utils";
import * as theme from "../../core/theme";
import { constants } from "../../core/constants";
import { handleSetError } from '../../core/exceptions';
import { ImageBackground } from 'react-native';

const db = firebase.firestore()

class CreateProduct extends Component {
    constructor(props) {
        super(props)
        this.fetchProduct = this.fetchProduct.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.pickImage = this.pickImage.bind(this)
        this.handleDeleteImage = this.handleDeleteImage.bind(this)

        this.myAlert = myAlert.bind(this)
        this.showAlert = this.showAlert.bind(this)

        this.initialState = {}
        this.isInit = true
        this.currentUser = firebase.auth().currentUser

        this.ProductId = this.props.navigation.getParam('ProductId', '')
        this.isEdit = this.props.navigation.getParam('isEdit', false)
        this.title = this.props.navigation.getParam('title', 'Nouvel article')

        this.state = {
            //AUTO-GENERATED
            ProductId: '', //Not editable
            checked: 'first',
            type: 'product',
            name: { value: 'Machine à laver', error: '' },
            brand: { value: 'LG', error: '' },
            description: { value: 'lorem ipsum dolor', error: '' },
            price: { value: '850', error: '' },

            //logs
            createdBy: { id: '', fullName: '' },
            createdAt: '',
            editedBy: { id: '', fullName: '' },
            editededAt: '',

            //Images
            attachments: [],
            attachedImages: [],
            isImageViewVisible: false,
            imageIndex: 0,
            imagesView: [],

            error: '',
            loading: false,
            toastType: '',
            toastMessage: '',

        }
    }

    async componentDidMount() {
        if (this.isEdit) {
            await this.fetchProduct()
        }

        else {
            const ProductId = generatetId('GS-AR-')
            this.setState({ ProductId }, () => this.initialState = this.state)
        }
    }

    //on Edit
    async fetchProduct() {
        await db.collection('Products').doc(this.ProductId).get().then((doc) => {
            let { ProductId, type, name, brand, description, price, attachedImages } = this.state
            let { createdAt, createdBy, editedAt, editedBy } = this.state
            let { error, loading } = this.state

            //General info
            const product = doc.data()
            ProductId = doc.id
            name.value = product.name
            brand.value = product.brand
            description.value = product.description
            price.value = product.price

            //Images
            attachedImages = product.attachments
            attachedImages = attachedImages.filter((image, index) => image.deleted === false)

            console.log('attachedImages', attachedImages)

            //َActivity
            createdAt = product.createdAt
            createdBy = product.createdBy
            editedAt = product.editedAt
            editedBy = product.editedBy

            this.setState({ ProductId, name, brand, description, price, attachedImages, createdAt, createdBy, editedAt, editedBy }, () => {
                if (this.isInit)
                    this.initialState = this.state

                this.isInit = false
            })
        })
    }

    showAlert() {
        const title = "Supprimer l'article"
        const message = 'Etes-vous sûr de vouloir supprimer cet article ? Cette opération est irreversible.'
        const handleConfirm = () => this.handleDelete()
        this.myAlert(title, message, handleConfirm)
    }

    async handleDelete() {
        await db.collection('Products').doc(this.ProductId).update({ deleted: true })
            .then(async () => this.props.navigation.goBack())
            .catch((e) => console.error(e))
    }

    //submit
    validateInputs() {
        let { name, brand, price } = this.state

        let nameError = nameValidator(name.value, `"Nom de l'article"`)
        let brandError = nameValidator(brand.value, `"Marque de l'article"`)
        let priceError = priceValidator(price.value)

        if (nameError || brandError || priceError) {
            Keyboard.dismiss()
            name.error = nameError
            price.error = priceError
            brand.error = brandError
            this.setState({ name, brand, price, loading: false })
            return false
        }

        return true
    }

    setProductType(checked, type) {
        this.setState({ checked, type })
    }

    async handleSubmit() {
        //Handle Loading or No edit done
        if (this.state.loading || this.state === this.initialState) return

        load(this, true)

        //0. Validate inputs
        const isValid = this.validateInputs()
        if (!isValid) return

        //1. UPLOADING FILES
        if (this.state.attachments.length > 0) { //new attachments
            this.title = 'Exportation des images...'
            await this.uploadImages()
        }

        // 2. ADDING product to firestore
        let { ProductId, type, name, brand, description, price, attachedImages } = this.state

        let product = {
            type: type,
            name: name.value,
            brand: brand.value,
            description: description.value,
            price: price.value,
            attachments: attachedImages,
            editedAt: moment().format('lll'),
            editedBy: { id: this.currentUser.uid, fullName: this.currentUser.displayName },
            deleted: false,
        }

        if (!this.isEdit) {
            product.createdAt = moment().format('lll')
            product.createdBy = { id: this.currentUser.uid, fullName: this.currentUser.displayName }
        }

        console.log('Ready to add product...')
        db.collection('Products').doc(this.ProductId).set(product, { merge: true })
            .then(() => {
                this.setState({ loading: false })
                this.props.navigation.state.params.onGoBack(product)
                this.props.navigation.goBack()
            })
            .catch(e => {
                this.setState({ loading: false })
                handleSetError(e)
            })
    }

    //Images
    async pickImage() {
        const { attachments } = this.state
        const newAttachments = await pickImage(attachments)
        console.log('newAttachments', newAttachments)
        this.setState({ attachments: newAttachments }, () => console.log(this.state.attachments))
    }

    async uploadImages() {
        const promises = []
        const images = this.state.attachments
        let attachedImages = []
        let urls = []

        for (let i = 0; i < images.length; i++) {
            const reference = firebase.storage().ref('/Products/' + this.state.type + '/' + this.state.ProductId + '/Images/' + images[i].name)
            const uploadTask = reference.putFile(images[i].path) //#only android (uri instead of path for ios)
            promises.push(uploadTask)

            uploadTask.on('state_changed', async function (snapshot) {
                var progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                console.log('Upload file ' + i + ': ' + progress + '% done')
                images[i].progress = progress / 100
                this.setState({ images })
            }.bind(this))

            uploadTask.then((result) => {
                urls.push(result.downloadURL)
                console.log('task ' + i + ' finished')
            })
        }

        await Promise.all(promises)
            .then(async (results) => {
                attachedImages = results.map((res) => ({ downloadURL: res.downloadURL, name: res.metadata.name, size: res.metadata.size, contentType: res.metadata.contentType, local: false, deleted: false }))
                attachedImages = attachedImages.concat(this.initialState.attachedImages)
                this.setState({ attachedImages, attachments: [] })
                console.log('ALL IMAGES ARE UPLOADED')
            })
            .catch(err => {
                if (this.isEdit) this.title = 'Modifier le projet'
                else this.title = 'Nouveau projet'
                setToast(this, 'e', 'Erreur lors du téléchargement des images, veuillez réessayer.')

                //Delete uploaded images in case of failure of one of them
                for (let i = 0; i < urls.length; i++) {
                    firebase.storage().refFromURL(urls[i]).delete()
                }
            })
    }

    renderAttachments() {
        const { attachments } = this.state
        return attachments.map((image, key) => {
            return <UploadProgress attachment={image} />
        })
    }

    async handleDeleteImage(deleteAll, index) {
        const newAttachedImages = this.state.attachedImages
        newAttachedImages[index].deleted = true

        await db.collection('Products').doc(this.ProductId).update({ attachments: newAttachedImages })
        this.fetchProduct()
        this.setState({ isImageViewVisible: false })
    }

    render() {
        let { ProductId, checked, name, brand, description, price } = this.state
        let { createdAt, createdBy, editedAt, editedBy } = this.state
        let { error, loading, toastType, toastMessage } = this.state
        let { attachments, attachedImages, isImageViewVisible, imageIndex } = this.state

        const allImages = attachments.concat(attachedImages) //local images + remote images

        let imagesView = allImages.map((image) => {
            if (image.local) return ({ source: { uri: image.path } }) //local
            else return ({ source: { uri: image.downloadURL } }) //remote
        })

        // let imagesView = [{ source: { uri: "file:///storage/emulated/0/DCIM/Screenshots/Screenshot_20201225-192848.png" } }]
        // console.log('imagesView', imagesView)

        return (
            <View style={styles.container}>
                <Appbar back={!loading} title titleText={this.title} check={!loading} loading={loading} handleSubmit={this.handleSubmit} del={this.isEdit && !loading} handleDelete={this.showAlert} />

                {loading ?
                    <View style={{ flex: 1 }}>
                        <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
                            {this.renderAttachments(attachments)}
                        </ScrollView>
                    </View>
                    :
                    <View style={{ flex: 1 }}>

                        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: constants.ScreenWidth * 0.02 }}>

                            <Card style={{ margin: 5, paddingVertical: 10 }}>
                                <Card.Content>

                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <View>
                                            <Text style={theme.customFontMSregular.body}>Type de l'article</Text>
                                            <RadioButton
                                                checked={checked}
                                                firstChoice={{ title: 'Service', value: 'service' }}
                                                secondChoice={{ title: 'Produit', value: 'good' }}
                                                onPress1={() => this.setProductType('first', 'service')}
                                                onPress2={() => this.setProductType('second', 'good')}
                                                style={{ marginBottom: 10 }}
                                                textRight={true}
                                                isRow={false} />
                                        </View>

                                        {imagesView.length === 0 ?
                                            <TouchableOpacity style={styles.imagesBox} onPress={this.pickImage}>
                                                <Text style={[theme.customFontMSsemibold.caption, { color: '#333' }]}>+ Ajouter</Text>
                                                <Text style={[theme.customFontMSsemibold.caption, { color: '#333' }]}>une image</Text>
                                            </TouchableOpacity>
                                            :
                                            <View>
                                                <TouchableOpacity onPress={() => this.setState({ isImageViewVisible: true })}>
                                                    <ImageBackground source={{ uri: imagesView[0].source.uri }} style={{ width: 90, height: 90 }}>
                                                        {imagesView.length > 1 &&
                                                            <View style={styles.imagesCounter}>
                                                                <Text style={[theme.customFontMSmedium.caption, { color: '#fff' }]}>+{imagesView.length - 1}</Text>
                                                            </View>
                                                        }
                                                    </ImageBackground>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={styles.addImage} onPress={this.pickImage}>
                                                    <Text style={theme.customFontMSmedium.caption}>+ Ajouter</Text>
                                                </TouchableOpacity>
                                            </View>
                                        }

                                    </View>

                                    <MyInput
                                        label="Numéro de l'article"
                                        returnKeyType="done"
                                        value={ProductId}
                                        editable={false}
                                        disabled
                                    />

                                    <MyInput
                                        label="Nom de l'article"
                                        returnKeyType="done"
                                        value={name.value}
                                        onChangeText={text => updateField(this, name, text)}
                                        error={!!name.error}
                                        errorText={name.error}
                                        multiline={true} />

                                    <MyInput
                                        label="Marque de l'article"
                                        returnKeyType="done"
                                        value={brand.value}
                                        onChangeText={text => updateField(this, brand, text)}
                                        error={!!brand.error}
                                        errorText={brand.error}
                                        multiline={true} />

                                    <MyInput
                                        label="Description"
                                        returnKeyType="done"
                                        value={description.value}
                                        onChangeText={text => updateField(this, description, text)}
                                        error={!!description.error}
                                        errorText={description.error}
                                        multiline={true} />

                                    <MyInput
                                        label="Prix de vente"
                                        returnKeyType="done"
                                        keyboardType='numeric'
                                        value={price.value}
                                        onChangeText={text => updateField(this, price, text)}
                                        error={!!price.error}
                                        errorText={price.error}
                                        multiline={true} />
                                </Card.Content>
                            </Card>

                        </ScrollView>

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

export default connect(mapStateToProps)(CreateProduct)



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
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    imagesBox: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 90,
        height: 90,
        backgroundColor: theme.colors.gray50,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderRadius: 1
    },
    imagesCounter: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        right: 0,
        width: 30,
        height: 15,
        backgroundColor: '#000',
        opacity: 0.65
    },
    imageThumbNail: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 90,
        height: 90,
    },
    addImage: {
        width: 90,
        marginTop: 5,
        paddingVertical: 5,
        backgroundColor: theme.colors.gray50,
        justifyContent: 'center',
        alignItems: 'center'
    },
})












// <Modal
// isVisible={this.state.showImages}
// style={{ maxHeight: constants.ScreenHeight * 0.8, padding: 10, backgroundColor: '#fff', }}>
// <MaterialCommunityIcons name='close' size={21} style={{ position: 'absolute', right: 10, top: 10 }} />
// <View style={{ flex: 1 }}>
//     <Text style={[theme.customFontMSsemibold.h3, { textAlign: 'center' }]}>Images de l'article</Text>
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <Text style={[theme.customFontMSsemibold.body, { color: theme.colors.placeholder, marginBottom: 10 }]}>Aucune image</Text>
//         <Button loading={loading} mode="outlined" onPress={this.pickImage} style={{width: constants.ScreenWidth*0.5, borderWidth: 2, borderColor: theme.colors.primary}}>
//             <Text style={theme.customFontMSsemibold.caption}>Ajouter une image</Text>
//         </Button>
//     </View>
// </View>
// </Modal>
