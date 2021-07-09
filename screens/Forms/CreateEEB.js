import { faVials } from '@fortawesome/pro-duotone-svg-icons';
import { faBuilding, faCheck, faHouse, faTimes, faUser } from '@fortawesome/pro-light-svg-icons';
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Image, FlatList } from 'react-native';
import { ProgressBar, Checkbox } from "react-native-paper";
import { connect } from 'react-redux'
import _ from 'lodash'
import Modal from 'react-native-modal'
import Pdf from "react-native-pdf"

import { AddressInput, Appbar, Button, CustomIcon, LoadDialog, Picker, TextInput } from '../../components';
import NumberInput from '../../components/NumberInput';
import SquareOption from '../../components/SquareOption';
import { constants } from '../../core/constants';

import * as theme from '../../core/theme'
import { ficheEEBModel as pages } from '../../core/ficheEEBModel'
import { nameValidator, positiveNumberValidator, setAddress, refreshAddress, emailValidator, generateId, generateFichEEB, chunk } from '../../core/utils';
import { db } from '../../firebase';
import ModalHeader from '../../components/ModalHeader';
import { ScrollView } from 'react-native';
import { ficheEEBBase64 } from '../../core/files';
import TextInputMask from 'react-native-text-input-mask';

class CreateEEB extends Component {
    constructor(props) {
        super(props)

        this.goNext = this.goNext.bind(this)
        this.goBack = this.goBack.bind(this)
        this.toggleModal = this.toggleModal.bind(this)
        this.setAddress = setAddress.bind(this)
        this.refreshAddress = refreshAddress.bind(this)
        
        this.project = this.props.navigation.getParam('project', '')

        this.state = {
            showWelcomeMessage: true,
            showSuccessMessage: false,
            pagesDone: [],
            pageIndex: 0,
            stepIndex: 0,
            progress: 0.5,
            isPdfModalVisible: false,
            pdfBase64: "",
            loading: false,

            //Fields
            nameSir: "",
            nameMiss: "",
            proSituationSir: "",
            ageSir: "",
            proSituationMiss: "",
            ageMiss: "",
            familySituation: "",
            houseOwnership: "",
            yearsHousing: "",
            taxIncome: "",
            familyMembersCount: "",
            childrenCount: "",
            aidAndSub: "",
            housingType: "",
            landSurface: "",
            livingSurface: "",
            heatedSurface: "",
            yearHomeConstruction: "",
            roofType: "",
            cadastralRef: "",
            livingLevelsCount: "",
            roomsCount: "",
            ceilingHeight: "",
            slopeOrientation: "",
            slopeSupport: "",
            basementType: "",
            wallMaterial: "",
            wallThickness: "",
            internalWallsIsolation: "",
            externalWallsIsolation: "",
            floorIsolation: "",
            lostAticsIsolation: "",
            windowType: "",
            glazingType: "",
            hotWaterProduction: [],
            yearInstallationHotWater: "",
            heaters: "",
            transmittersTypes: [],
            yearInstallationHeaters: "",
            idealTemperature: "",
            isMaintenanceContract: "",
            isElectricityProduction: "",
            elecProdType: "",
            elecProdInstallYear: "",
            yearlyElecCost: "",
            roofLength: "",
            roofWidth: "",
            roofTilt: "",
            phone: "",
            disablePhoneContact: true,
            address: "",
            email: "",
        }
    }

    welcomeMessage() {
        const title = "SIMULATION EN LIGNE"
        const message = "Bienvenue sur l’outil de simulation en ligne et de dépôt de dossier d’aide. Les informations que vous renseignez seront utilisées uniquement pour calculer vos montants d’aides et les équipements préconisés. En fin de formulaire, vous aurez la possibilité de transformer votre simulation en dépôt de dossier en ligne. À tout moment vous pouvez être rappelé par un conseiller pour être accompagné dans votre démarche."
        const instructions = [
            "Renseigner vos informations et découvrez votre montant d’aides et les produits que nous vous recommandons",
            "Déposer votre dossier d’aide directement en ligne!",
            "Suivez l’avancement de vos demandes"
        ]
        return (
            <View style={{ flex: 1, backgroundColor: theme.colors.white }}>
                <View style={{ justifyContent: "center", paddingTop: theme.padding * 3, backgroundColor: "#003250", borderBottomWidth: 2, borderBottomColor: theme.colors.primary }}>
                    <CustomIcon icon={faVials} style={{ alignSelf: "center" }} size={65} color={theme.colors.white} secondaryColor={theme.colors.primary} />
                    <Text style={[theme.customFontMSmedium.h3, { color: theme.colors.white, textAlign: "center", letterSpacing: 1, marginBottom: 48, marginTop: 16 }]}>{title}</Text>
                </View>
                <View style={{ flex: 1, paddingHorizontal: theme.padding, paddingVertical: theme.padding * 2 }}>
                    <Text style={[theme.customFontMSregular.body, { opacity: 0.8 }]}>{message}</Text>
                    <View style={{ borderColor: theme.colors.gray_light, borderWidth: StyleSheet.hairlineWidth, marginVertical: 24 }} />
                    {
                        instructions.map((instruction, index) => {
                            const count = index + 1
                            return (
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ color: theme.colors.primary }}>{count}. </Text>
                                    <Text style={[theme.customFontMSregular.caption, { marginBottom: 8 }]}>
                                        {instruction}
                                    </Text>
                                </View>
                            )
                        })
                    }
                </View>

                <Button
                    mode="contained"
                    style={{ position: "absolute", bottom: theme.padding, alignSelf: "center", width: constants.ScreenWidth - theme.padding * 2, backgroundColor: theme.colors.primary }}
                    onPress={() => this.setState({ showWelcomeMessage: false })}>
                    Commencer
                </Button>
            </View>
        )
    }

    renderStep(step, index) {
        const { stepIndex } = this.state
        const isSelected = stepIndex === index
        const backgroundColor = isSelected ? theme.colors.primary : theme.colors.white
        const borderColor = isSelected ? theme.colors.white : theme.colors.gray_medium
        const color = isSelected ? theme.colors.white : theme.colors.gray_medium

        return (
            <View style={[styles.step, { backgroundColor, borderColor }]}>
                <Text style={[theme.customFontMSregular.caption, { color }]}>{step}</Text>
            </View>
        )
    }

    renderSteps() {
        const steps = ["Votre Foyer", "Votre Habitation", "Votre Bilan"]
        return (
            <View style={{ alignItems: 'center' }}>
                <FlatList
                    horizontal={true}
                    data={steps}
                    keyExtractor={step => step}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    renderItem={({ item, index }) => this.renderStep(item, index)}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        )
    }

    renderProgression() {
        const { pagesDone } = this.state
        const progress = Math.round((pagesDone.length / pages.length) * 100)

        return (
            <View style={{ marginTop: 16 }}>
                <ProgressBar
                    progress={progress / 100}
                    color={theme.colors.primary}
                    visible={true}
                />
                <Text style={[theme.customFontMSregular.small, { color: theme.colors.gray_dark, marginVertical: 8 }]}>{progress}%</Text>
            </View>
        )
    }

    renderSeparator() {
        return <View style={{ height: 4 }} />
    }

    renderTitle() {
        const { pageIndex } = this.state
        const { title } = pages[pageIndex]
        return <Text style={[theme.customFontMSmedium.header, { textAlign: 'center', marginTop: 16, letterSpacing: 1 }]}>{title}</Text>
    }


    renderLabel(label, items) {
        return <Text style={[theme.customFontMSregular.body, { textAlign: 'center', marginBottom: 8 }]}>{label}</Text>
    }

    renderForm() {
        return (
            <View style={{ flex: 1, justifyContent: 'center' }}>
                {this.renderFields()}
            </View>
        )
    }

    renderFields() {
        const { pageIndex } = this.state

        const { id, layout, fields, items } = pages[pageIndex]
        const fieldsComponents = fields.map((field) => {

            const value = this.state[field.id]
            const error = this.state[field.errorId]
            const { id, type, items, isConditional, condition, isNumeric, isEmail, isMultiOptions, mendatory } = field
            const asterisk = mendatory ? ' *' : ''
            const label = field.label + asterisk

            const emptyString = condition && !condition.values && !this.state[condition.with]
            const optionNotSelected = condition && condition.values && !condition.values.includes(this.state[condition.with])
            const hidePage = isConditional && (emptyString || optionNotSelected)

            if (hidePage) {
                return null
            }

            switch (field.type) {
                case "textInput":
                    if (field.mask)
                        return (
                            <TextInput
                                label={label}
                                returnKeyType="done"
                                keyboardType={isNumeric ? 'numeric' : isEmail ? "email-address" : "default"}
                                value={value}
                                onChangeText={value => {
                                    let update = {}
                                    update[id] = value
                                    this.setState(update)
                                }}
                                error={error}
                                errorText={error}
                                editable={true}
                                render={props =>
                                    <TextInputMask
                                        {...props}
                                        {...(field.mask && { mask: field.mask })}
                                    />
                                }
                            />
                        )
                    else return (
                        <TextInput
                            label={label}
                            returnKeyType="done"
                            keyboardType={isNumeric ? 'numeric' : isEmail ? "email-address" : "default"}
                            value={value}
                            onChangeText={value => {
                                let update = {}
                                update[id] = value
                                this.setState(update)
                            }}
                            error={error}
                            errorText={error}
                            editable={true}
                        />
                    )

                case "picker":
                    return (
                        <Picker
                            returnKeyType="next"
                            value={value}
                            error={error}
                            errorText={error}
                            selectedValue={value}
                            onValueChange={(value) => {
                                let update = {}
                                update[field.id] = value
                                this.setState(update)
                            }}
                            title={label}
                            elements={items}
                            enabled={true}
                            style={field.style}
                        />
                    )

                case "options":
                    if (isMultiOptions) {
                        items.forEach((e) => e.selected = this.state[id].includes(e.label))
                    }
                    else items.forEach((e) => e.selected = e.label === this.state[id])
                    const containerStyle = { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', paddingHorizontal: 10 }


                    return (
                        <View>
                            {this.renderLabel(label, items)}
                            <View style={[containerStyle, { justifyContent: items && items.length > 1 ? 'space-between' : 'center' }]}>
                                {items.map((item, index) => {
                                    if (item.isConditional && !item.condition.values.includes(this.state[item.condition.with])) {
                                        return null
                                    }

                                    else return (
                                        <SquareOption
                                            element={item}
                                            index={index}
                                            elementSize={constants.ScreenWidth * 0.4}
                                            onPress={() => {
                                                const { value } = item
                                                var selectedOptions = this.state[id]

                                                if (isMultiOptions) {
                                                    if (selectedOptions.includes(value)) {
                                                        selectedOptions = selectedOptions.filter((option) => option !== value)
                                                    }
                                                    else selectedOptions.push(value)
                                                }
                                                else {
                                                    if (this.state[id] === value)
                                                        selectedOptions = ""
                                                    else selectedOptions = value
                                                    console.log(id, selectedOptions)
                                                }
                                                let update = {}
                                                update[id] = selectedOptions
                                                this.setState(update)
                                            }}
                                        />
                                    )
                                })}
                            </View>
                            {error ? <Text style={[theme.customFontMSregular.caption, { color: theme.colors.error, textAlign: 'center', marginTop: 8 }]}>{error}</Text> : null}
                        </View>
                    )

                case "number":
                    return (
                        <View style={field.style}>
                            {this.renderLabel(label)}
                            <NumberInput
                                changeValue={(operation) => {
                                    let value = this.state[id]
                                    value = Number(value)
                                    if (operation === "add") {
                                        if (value === "")
                                            value = 1
                                        else value += 1
                                    }
                                    else {
                                        if (value === "" || value === 0) return
                                        else value -= 1
                                    }
                                    value = value.toString()
                                    let update = {}
                                    update[id] = value
                                    this.setState(update)
                                }}
                                label={label}
                                value={value}
                                onChangeText={value => {
                                    let update = {}
                                    update[id] = value
                                    this.setState(update)
                                }}
                                placeholder={field.placeholder && field.placeholder || ""}
                                error={error}
                                errorText={error}
                                editable={true}
                            />
                        </View>
                    )

                case "address":
                    return (
                        <AddressInput
                            label='Adresse postale'
                            offLine={!this.props.network.isConnected}
                            onPress={() => this.props.navigation.navigate('Address', { onGoBack: this.refreshAddress })}
                            onChangeText={this.setAddress}
                            clearAddress={() => this.setAddress('')}
                            address={this.state.address}
                            addressError={this.state.addressError}
                            editable={true}
                        />
                    )

                case "checkbox":
                    return (
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: -10, marginTop: 10 }}>
                            <Checkbox
                                status={this.state.disablePhoneContact ? 'unchecked' : 'checked'}
                                onPress={() => this.setState({ disablePhoneContact: !this.state.disablePhoneContact })}
                                color={theme.colors.primary}
                            />
                            <Text style={[theme.customFontMSregular.body, { color: theme.colors.gray_dark }]}>{label}</Text>
                        </View>
                    )
            }
        })

        const arr = fieldsComponents.filter((e) => e !== null)
        const noField = arr.length === 0
        if (noField) this.setState({ pageIndex: this.state.pageIndex + 1 })

        return fieldsComponents
    }

    renderButtons() {
        const { pageIndex } = this.state
        const isLastPage = pageIndex === pages.length - 1
        const title = isLastPage ? "Soumettre" : "Continuer"

        return (
            <View style={styles.buttonsContainer}>
                {pageIndex > 0 ?
                    <Button
                        mode="outlined"
                        icon="arrow-left"
                        style={{ width: constants.ScreenWidth * 0.45 }}
                        outlinedColor={theme.colors.primary}
                        onPress={this.goBack}
                    >
                        Retour
                    </Button>
                    :
                    <View style={{ width: constants.ScreenWidth * 0.45 }} />
                }
                <Button
                    mode="contained"
                    style={{ width: constants.ScreenWidth * 0.45, backgroundColor: theme.colors.primary }}
                    onPress={this.goNext}>
                    {title}
                </Button>
            </View>
        )
    }

    goNext() {
        const { pageIndex, pagesDone, stepIndex } = this.state

        //Verify fields
        const isValid = this.verifyFields(pageIndex)
        if (!isValid) return

        //Add Page browsed
        pagesDone.push(pageIndex)
        this.setState({ pagesDone })

        //Remove errors
        for (const field of pages[pageIndex].fields) {
            let errorUpdate = {}
            if (field.errorId) {
                errorUpdate[field.errorId] = ""
                this.setState(errorUpdate)
            }
        }

        //Increment step
        if (pages[pageIndex].isLast)
            this.setState({ stepIndex: stepIndex + 1 })

        const isLastPage = pageIndex === pages.length - 1

        //Submit
        if (isLastPage)
            this.handleSubmit()

        //Increment page
        else this.setState({ pageIndex: pageIndex + 1 })
    }

    goBack() {
        let { pageIndex, pagesDone, stepIndex } = this.state

        //Pop page browsed
        this.setState({ pageIndex: pagesDone[pagesDone.length - 1] }, () => {
            pagesDone.pop()
            this.setState({ pagesDone })
        })

        //Decrement step
        if (pages[pageIndex].isFirst)
            this.setState({ stepIndex: stepIndex - 1 })
    }

    verifyFields(pageIndex) {
        const { fields } = pages[pageIndex]

        for (const field of fields) {
            const { id, label, type, mendatory, isConditional, condition, isEmail, errorId } = field

            if (mendatory) {

                if (type === "number")
                    var error = positiveNumberValidator(this.state[id], `"${label}"`)
                else if (isEmail)
                    var error = emailValidator(this.state[id])
                else var error = nameValidator(this.state[id], `"${label}"`)

                if (error !== "") {
                    if (!isConditional || isConditional && this.state[condition.with] !== "") {
                        let errorUpdate = {}
                        errorUpdate[errorId] = error
                        this.setState(errorUpdate)
                        return false
                    }
                }
            }
        }
        return true
    }

    extractForm(state) {
        delete state.showWelcomeMessage
        delete state.showSuccessMessage
        delete state.pagesDone
        delete state.pageIndex
        delete state.stepIndex
        delete state.progress
        delete state.isPdfModalVisible
        delete state.pdfBase64
        delete state.loading
        return state
    }

    async handleSubmit() {
        this.setState({ loading: true })
        const state = _.cloneDeep(this.state)
        let form = this.extractForm(state)
        form = this.addFormLogs(form)
        const formId = generateId('GS-EEB-')
        const pdfBase64 = await generateFichEEB(form)
        db.collection('Eeb').doc(formId).set(form)
        this.setState({ pdfBase64, showSuccessMessage: true, loading: false })
    }

    addFormLogs(form) {
        form.createdAt = moment().format()
        form.createdBy = this.props.currentUser
        form.estimation = "9000" //provisoire
        //Add project reference if we are on process context
        if (this.project)
            form.project = this.project
    }

    successMessage() {
        const title = "Estimation de votre prime: "
        const estimation = "9732€"
        const message1 = "Ce que nous vous recommandons"
        const message2 = "Et Maintenant ?"
        const instructions = [
            "Renseigner vos informations et découvrez votre montant d’aides et les produits que nous vous recommandons",
            "Déposer votre dossier d’aide directement en ligne!",
            "Suivez l’avancement de vos demandes"
        ]
        return (
            <View style={{ flex: 1, backgroundColor: theme.colors.white }}>
                <View style={{ justifyContent: "center", paddingTop: theme.padding * 2, backgroundColor: "#003250", borderBottomWidth: 2, borderBottomColor: theme.colors.primary }}>
                    <Text style={[theme.customFontMSmedium.header, { color: theme.colors.white, textAlign: "center", letterSpacing: 1, marginBottom: 48, marginTop: 16 }]}>
                        {title}
                        <Text style={[theme.customFontMSmedium.h2, { color: theme.colors.primary }]}>{estimation}</Text>
                    </Text>
                </View>

                <View style={{ flex: 1, paddingHorizontal: theme.padding, paddingVertical: theme.padding * 2 }}>
                    <Text style={[theme.customFontMSregular.body, { opacity: 0.8 }]}>{message1}</Text>
                    <Text style={[theme.customFontMSregular.body, { opacity: 0.8 }]}>{message2}</Text>
                    <View style={{ borderColor: theme.colors.gray_light, borderWidth: StyleSheet.hairlineWidth, marginVertical: 24 }} />
                </View>

                <Button
                    mode="contained"
                    style={{ position: "absolute", bottom: theme.padding, alignSelf: "center", width: constants.ScreenWidth - theme.padding * 2, backgroundColor: theme.colors.primary }}
                    onPress={() => this.setState({ isPdfModalVisible: true })}>
                    Générer une fiche EEB
                </Button>
            </View>
        )
    }

    toggleModal() {
        this.setState({ isPdfModalVisible: !this.state.isPdfModalVisible })
    }

    render() {
        const { showWelcomeMessage, showSuccessMessage, isPdfModalVisible, pdfBase64, loading } = this.state

        if (pdfBase64)
            var source = { uri: `data:application/pdf;base64,${pdfBase64}` }

        return (
            <View style={styles.mainContainer}>
                <Appbar close title titleText="Etude et Evaluation des besoins" />

                {showWelcomeMessage ?
                    this.welcomeMessage()
                    :
                    showSuccessMessage ?
                        this.successMessage()
                        :
                        <View style={styles.container}>
                            <View style={styles.header}>
                                {this.renderSteps()}
                                {this.renderProgression()}
                            </View>

                            {this.renderSeparator()}

                            <View style={styles.body}>
                                {this.renderTitle()}
                                {this.renderForm()}
                            </View>

                            {this.renderButtons()}
                        </View>
                }

                <Modal
                    isVisible={isPdfModalVisible}
                    onSwipeComplete={this.toggleModal}
                    onBackButtonPress={this.toggleModal}
                    onBackdropPress={this.toggleModal}
                    style={styles.modal}>
                    <View style={styles.scrollableModal}>
                        <ModalHeader title={"Fiche EEB générée"} toggleModal={this.toggleModal} />
                        {pdfBase64 !== "" &&
                            <View style={{ flex: 1 }}>
                                <Pdf source={source} style={modalStyles.pdf} />
                            </View>
                        }
                    </View>
                </Modal>

                <LoadDialog
                    message={"Traitement en cours"}
                    loading={loading}
                />
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        role: state.roles.role,
        permissions: state.permissions,
        network: state.network,
        currentUser: state.currentUser
        //fcmToken: state.fcmtoken
    }
}

export default connect(mapStateToProps)(CreateEEB)

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        // backgroundColor: 'pink',
        // backgroundColor: theme.colors.white
    },
    container: {
        flex: 1,
        //  backgroundColor: 'pink',
        //paddingHorizontal: theme.padding
    },
    header: {
        backgroundColor: theme.colors.white,
        paddingHorizontal: theme.padding
    },
    step: {
        borderWidth: 1,
        padding: 8,
        paddingHorizontal: 16,
        borderRadius: 16,
    },
    separator: {
        width: 5,
        height: StyleSheet.hairlineWidth,
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: theme.colors.gray_medium
    },
    body: {
        flex: 1,
        backgroundColor: theme.colors.white,
        paddingHorizontal: theme.padding
    },
    buttonsContainer: {
        paddingHorizontal: theme.padding,
        backgroundColor: theme.colors.white,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },


    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    scrollableModal: {
        height: constants.ScreenHeight * 0.93,
        borderTopLeftRadius: constants.ScreenWidth * 0.03,
        borderTopRightRadius: constants.ScreenWidth * 0.03,
        backgroundColor: '#fff'
    },
    scrollableModalContent1: {
        height: 200,
        backgroundColor: '#87BBE0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollableModalText1: {
        fontSize: 20,
        color: 'white',
    },
    scrollableModalContent2: {
        height: 200,
        backgroundColor: '#A9DCD3',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollableModalText2: {
        fontSize: 20,
        color: 'white',
    },
})

const modalStyles = StyleSheet.create({
    modal: {
        width: constants.ScreenWidth,
        marginTop: constants.ScreenHeight * 0.07,
        marginHorizontal: 0,
        marginBottom: 0,
        borderTopLeftRadius: constants.ScreenWidth * 0.03,
        borderTopRightRadius: constants.ScreenWidth * 0.03,
        backgroundColor: theme.colors.background
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: theme.colors.primary,
        borderTopLeftRadius: constants.ScreenWidth * 0.03,
        borderTopRightRadius: constants.ScreenWidth * 0.03,
        paddingHorizontal: theme.padding,
        paddingVertical: 10
    },
    pdf: {
        flex: 1,
        width: constants.ScreenWidth, //fixed to screen width
        height: 500,
        backgroundColor: theme.colors.gray50
    },
})
















