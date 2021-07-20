import { faBuilding, faCheck, faHouse, faTimes, faUser } from '@fortawesome/pro-light-svg-icons';
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Image, FlatList, BackHandler, TouchableOpacity } from 'react-native';
import { ProgressBar, Checkbox } from "react-native-paper";
import { connect } from 'react-redux'
import _ from 'lodash'
import Modal from 'react-native-modal'
import Pdf from "react-native-pdf"
import DatePicker from 'react-native-date-picker'

import moment from 'moment';
import 'moment/locale/fr'
moment.locale('fr')

import { AddressInput, Appbar, Button, CustomIcon, EmptyList, LoadDialog, Loading, Picker, TextInput, Toast } from '../components';
import NumberInput from '../components/NumberInput';
import SquareOption from '../components/SquareOption';
import { constants } from '../core/constants';

import * as theme from '../core/theme'
import { nameValidator, positiveNumberValidator, emailValidator, generateId, chunk, formatDocument, myAlert, saveFile } from '../core/utils';
import { db } from '../firebase';
import ModalHeader from '../components/ModalHeader';
import { ScrollView } from 'react-native';
import { ficheEEBBase64 } from '../core/files';
import { setStatusBarColor } from '../core/redux';
import TextInputMask from 'react-native-text-input-mask';
import { fetchDocument } from '../api/firestore-api';
import StepIndicator from 'react-native-step-indicator';
import { SafeAreaView } from 'react-native';
import { Alert } from 'react-native';
import { read } from 'react-native-fs';

class StepsForm extends Component {
    constructor(props) {
        super(props)

        this.handleSubmit = this.handleSubmit.bind(this)
        this.goNext = this.goNext.bind(this)
        this.goBack = this.goBack.bind(this)
        this.toggleModal = this.toggleModal.bind(this)
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.myAlert = myAlert.bind(this)
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick)

        this.isEdit = this.props.DocId !== ""
        this.DocId = this.isEdit ? this.props.DocId : generateId(this.props.idPattern)

        this.project = this.props.navigation.getParam('project', '')
        this.DocumentId = this.props.navigation.getParam('DocumentId', '')
        this.popCount = this.props.navigation.getParam('popCount', 1)

        this.state = {
            showWelcomeMessage: !this.isEdit,
            showSuccessMessage: false,
            pagesDone: [],
            pageIndex: 0,
            stepIndex: 0,
            progress: 0,
            isPdfModalVisible: false,
            pdfBase64: "",
            loading: false,
            toastMessage: "",
            toastType: "",
            docNotFound: false,
            submitted: false,
            readOnly: this.isEdit,
            initialLoading: true,
            ...this.props.initialState
        }
    }

    //##Initialization
    async componentDidMount() {
        setStatusBarColor(this, { backgroundColor: "#003250", barStyle: "light-content" })
        if (this.isEdit) await this.initEditMode()
        this.initialState = _.cloneDeep(this.state)
        this.setState({ initialLoading: false })
    }

    async initEditMode() {
        let document = await fetchDocument(this.props.collection, this.DocId)
        document = this.setDocument(document)
        if (!document) return
        const pdfBase64 = await this.props.generatePdf(document)
        this.setState({ pdfBase64 })
    }

    setDocument(document) {
        if (!document)
            this.setState({ docNotFound: true })
        else {
            document = formatDocument(document, this.props.stateProperties)
            this.setState(document)
        }
        return document
    }

    //##Steps
    renderSteps(pages, steps) {

        return (
            <View style={styles.stepsContainer}>
                {steps.map((step, index) => {
                    if (step === "")
                        return <View style={styles.stepsSeparator} />

                    else return (
                        <TouchableOpacity
                            style={{ flexDirection: "row", alignItems: "center" }}
                            onPress={() => {
                                if (!this.isEdit) return
                                //Verify fields
                                const isValid = this.verifyFields(this.state.pageIndex)
                                if (!isValid) return
                                const firstPageIndex = pages.findIndex((page) => index === page.stepIndex)
                                this.setState({ pageIndex: firstPageIndex, stepIndex: index })
                            }}
                        >
                            {this.renderStep(step, index)}
                        </TouchableOpacity>
                    )
                })
                }
            </View >
        )
    }

    renderStep(step, index) {
        const { stepIndex } = this.state
        const isSelected = stepIndex === index
        const backgroundColor = isSelected ? theme.colors.primary : theme.colors.white
        const borderColor = isSelected ? theme.colors.white : theme.colors.gray_medium
        const color = isSelected ? theme.colors.white : theme.colors.gray_medium

        return (
            <View style={[styles.step, { backgroundColor }]}>
                <Text style={[theme.customFontMSregular.caption, { color }]}>{step}</Text>
            </View>
        )
    }

    renderProgression(pages) {
        const { pagesDone } = this.state
        const progress = Math.round((pagesDone.length / (pages.length - 1)) * 100)

        return (
            <View style={{ marginTop: 16, backgroundColor: '#003250' }}>
                <ProgressBar
                    progress={progress / 100}
                    color={theme.colors.primary}
                    visible={true}
                />
                <Text style={[theme.customFontMSregular.small, { color: theme.colors.white, marginVertical: 8 }]}>
                    {progress}%
                </Text>
            </View>
        )
    }

    //##Form
    renderTitle(pages) {
        const { pageIndex } = this.state
        const { title } = pages[pageIndex]
        return (
            <Text style={[theme.customFontMSmedium.header, { textAlign: 'center', marginTop: 16, letterSpacing: 1 }]}>
                {title}
            </Text>
        )
    }

    renderLabel(label, items) {
        return (
            <Text style={[theme.customFontMSregular.body, { textAlign: 'center', marginTop: 24, marginBottom: 8 }]}>
                {label}
            </Text>
        )
    }

    renderForm(pages) {
        const { pageIndex } = this.state

        if (pages[pageIndex].id === "submit")
            return this.successMessage()

        else return (
            <ScrollView contentContainerStyle={styles.formContainer}>
                {this.renderFields(pages, pageIndex)}
            </ScrollView>
        )
    }

    renderFields(pages, pageIndex) {
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
                                    this.removeErrors()
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
                                this.removeErrors()
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

                                //0. Rollback
                                if (field.rollBack) {
                                    for (const f of field.rollBack.fields) {
                                        if (f.type === "string")
                                            update[f.id] = ""
                                        else if (f.type === "array")
                                            update[f.id] = []
                                    }
                                }

                                //1. Change value
                                update[field.id] = value
                                this.setState(update)
                            }}
                            title={label}
                            elements={items}
                            enabled={true}
                            style={field.style}
                        />
                    )
                    break;

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

                                                let update = {}

                                                //0. Rollback
                                                if (item.rollBack) {
                                                    for (const field of item.rollBack.fields) {
                                                        if (field.type === "string")
                                                            update[field.id] = ""
                                                        else if (field.type === "array")
                                                            update[field.id] = []
                                                    }
                                                }

                                                //1. Update value & Go Next
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
                                                }
                                                update[id] = selectedOptions

                                                if (pages[pageIndex].fields.length === 1 && !isMultiOptions)
                                                    this.setState(update, () => this.goNext())

                                                else this.setState(update)
                                            }}
                                        />
                                    )
                                })}
                            </View>
                            {error ? <Text style={[theme.customFontMSregular.caption, { color: theme.colors.error, textAlign: 'center', marginTop: 8 }]}>{error}</Text> : null}
                        </View>
                    )
                    break;

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
                    break;

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
                    break;

                case "datePicker":
                    return (
                        <View>
                            {this.renderLabel(label)}
                            <DatePicker
                                date={value}
                                onDateChange={(selectedDate) => {
                                    let update = {}
                                    update[id] = selectedDate
                                    this.setState(update)
                                }}
                                mode='date'
                                locale='fr'
                                androidVariant="nativeAndroid"
                                fadeToColor={theme.colors.primary}
                                style={{ alignSelf: "center", marginTop: 32 }}
                            />
                        </View>
                    )
            }
        })

        const arr = fieldsComponents.filter((e) => e !== null)
        const noField = arr.length === 0
        if (noField) this.setState({ pageIndex: this.state.pageIndex + 1 })

        return fieldsComponents
    }

    renderButtons(pages) {
        const { pageIndex } = this.state
        const isSubmit = pages[pageIndex].id === 'submit'
        const isLastFormPage = pageIndex === pages.length - 2
        const title = isSubmit ? "Soumettre" : isLastFormPage ? "Terminer" : "Continuer"

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

    //##Handlers
    goNext() {
        const { pageIndex, pagesDone, stepIndex } = this.state
        const { pages, collection } = this.props

        //Verify fields
        const isValid = this.verifyFields(pageIndex)
        if (!isValid) return

        //Add Page browsed
        pagesDone.push(pageIndex)
        this.setState({ pagesDone })

        //Remove errors
        this.removeErrors()

        //Increment step
        if (pages[pageIndex].isLast)
            this.setState({ stepIndex: stepIndex + 1 })

        //Show results
        const isLastFormPage = pageIndex === pages.length - 2
        const isSubmit = pages[pageIndex].id === 'submit'

        if (isLastFormPage) {
            this.setResults(collection === "Eeb")
        }

        else if (isSubmit) {
            this.handleSubmit()
        }

        //Increment page
        else this.setState({ pageIndex: pageIndex + 1 })
    }

    goBack() {
        let { pageIndex, pagesDone, stepIndex } = this.state
        const { pages } = this.props

        if (pageIndex === pages.length - 1)
            this.setState({ showSuccessMessage: false })

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
        const { pages } = this.props
        const { fields } = pages[pageIndex]

        let error = ""

        if (pages[pageIndex].exclusiveMendatory) {
            let isError = true
            for (const field of fields) {
                isError = isError && this.state[field.id] === ""
            }

            error = isError ? "Veuillez remplir au moins un champs" : ""

            if (error !== "") {
                for (const field of fields) {
                    let errorUpdate = {}
                    errorUpdate[field.errorId] = error
                    this.setState(errorUpdate)
                }
                return false
            }
        }

        else {
            for (const field of fields) {
                const { id, label, type, mendatory, isConditional, condition, isEmail, errorId } = field

                if (mendatory) {
                    if (type === "number")
                        error = positiveNumberValidator(this.state[id], `"${label}"`)
                    else if (isEmail)
                        error = emailValidator(this.state[id])
                    else error = nameValidator(this.state[id], `"${label}"`)

                    if (error !== "") {
                        const isHandleError = !isConditional
                            || isConditional && !condition.values && this.state[condition.with] !== ""
                            || isConditional && condition.values && condition.values.includes(this.state[condition.with])

                        if (isHandleError) {
                            let errorUpdate = {}
                            errorUpdate[errorId] = error
                            this.setState(errorUpdate)
                            return false
                        }
                    }
                }
            }
        }

        return true
    }

    removeErrors() {
        const { pageIndex, pagesDone, stepIndex } = this.state

        for (const field of this.props.pages[pageIndex].fields) {
            let errorUpdate = {}
            if (field.errorId) {
                errorUpdate[field.errorId] = ""
                this.setState(errorUpdate)
            }
        }
    }

    //##Logic: Submit
    handleSubmit() {

        this.setState({ loading: true })

        //Verify onPress Check icon
        if (this.isEdit) {
            const isValid = this.verifyFields(this.state.pageIndex)
            if (!isValid) {
                this.setState({ loading: false })
                return
            }
        }

        const { idPattern, collection } = this.props
        const DocId = this.isEdit ? this.DocId : generateId(idPattern)
        let form = this.unformatDocument()
        form = this.addFormLogs(form)
        db.collection(collection).doc(DocId).set(form)

        this.isEdit = true
        this.DocId = DocId
        this.setState({
            pageIndex: 0,
            pagesDone: [],
            submitted: true,
            readOnly: true,
            loading: false,
            toastMessage: "Formulaire enregistré avec succès !",
            toastType: "success"
        })
    }

    addFormLogs(form) {

        if (!this.isEdit) {
            form.createdAt = moment().format()
            form.createdBy = this.props.currentUser

            //Add draft tag
            if (this.state.pageIndex < this.props.pages.length - 1)
                form.isDraft = true
        }

        else form.isDraft = false

        form.editedAt = moment().format()
        form.editedBy = this.props.currentUser
        //Add project reference if we are on process context
        if (this.project)
            form.project = this.project
        return form
    }

    unformatDocument() {
        const state = _.cloneDeep(this.state)
        let form = this.extractForm(state)
        return form
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
        delete state.toastMessage
        delete state.toastType
        delete state.docNotFound
        delete state.initialLoading
        delete state.submitted
        delete state.readOnly
        return state
    }

    //##Logic: Results
    async setResults(calculEstimation) {
        this.setState({ loading: true })

        const form = this.unformatDocument()
        const pdfBase64 = await this.props.generatePdf(form)
        this.setState({ pdfBase64 })

        if (calculEstimation) {
            const products = this.setProducts(form)
            const colorCat = this.setColorCat(form)
            const estimation = this.setEstimation(products, colorCat)

            this.setState({
                products,
                colorCat,
                estimation,
                showSuccessMessage: true,
                pageIndex: this.state.pageIndex + 1,
                loading: false
            })
        }

        else this.handleSubmit()
    }

    setProducts(form) {
        let products = []
        const { transmittersTypes, heaters, lostAticsIsolation, lostAticsIsolationAge, heatedSurface, slopeOrientation, roofLength, roofWidth, yearlyElecCost, livingSurface, hotWaterProduction } = form
        const pacAirAir = "Pac air air (climatisation)"
        const pacAirEau = "PAC AIR EAU"
        const isoCombles = "Isolation des combles"
        const ballonThermo = "Ballon thermodynamique"
        const photovolt = "Photovoltaïque"

        if (transmittersTypes.includes("Radiateurs électriques"))
            products.push(pacAirAir)

        const heatersValues = ["Chaudière", "Gaz", "Fioul"]
        if (heatersValues.includes(heaters))
            products.push(pacAirEau)

        if (lostAticsIsolation == "Oui" && lostAticsIsolationAge > 6 && heatedSurface > 24)
            products.push(isoCombles)

        // const slopeOrientationValues = ["Sud-Est/Sud-Ouest", "Sud"]
        // const roofSurface = Number(roofWidth) * Number(roofLength)
        // const yearlyCost_PerSquareMeter = yearlyElecCost / livingSurface
        // if (slopeOrientationValues.includes(slopeOrientation) && roofSurface > 20 && yearlyCost_PerSquareMeter > 10)
        //     products.push(photovolt)

        if (hotWaterProduction.includes("Cumulus électrique") || hotWaterProduction.includes("Chaudière"))
            products.push(ballonThermo)

        return products
    }

    setColorCat(form) {

        let { taxIncome, familyMembersCount } = form
        taxIncome = Number(taxIncome)
        familyMembersCount = Number(familyMembersCount)

        let personnesSupplementaires = familyMembersCount - 5
        if (personnesSupplementaires < 0) {
            personnesSupplementaires = 0
        }

        let couleurChoisie = 'Aucun'
        const isOneMember = familyMembersCount === 1
        const isTwoMembers = familyMembersCount === 2
        const isThreeMembers = familyMembersCount === 3
        const isFourMembers = familyMembersCount === 4
        const isFiveMembers = familyMembersCount === 5
        const isMoreThanFive = familyMembersCount >= 6

        if (taxIncome <= 14879 && isOneMember
            || (taxIncome <= 21760 && isTwoMembers)
            || (taxIncome <= 26170 && isThreeMembers)
            || (taxIncome <= 30572 && isFourMembers)
            || (taxIncome <= 34993 && isFiveMembers)
            || (taxIncome <= (34993 + (4412 * personnesSupplementaires)) && isMoreThanFive)) {
            couleurChoisie = 'blue'
        }

        else if ((taxIncome <= 19074 && isOneMember)
            || (taxIncome <= 27896 && isTwoMembers)
            || (taxIncome <= 33547 && isThreeMembers)
            || (taxIncome <= 39192 && isFourMembers)
            || (taxIncome <= 44860 && isFiveMembers)
            || (taxIncome <= (44860 + (5651 * personnesSupplementaires)) && isMoreThanFive)) {
            couleurChoisie = 'yellow'
        }

        else if ((taxIncome <= 29148 && isOneMember)
            || (taxIncome <= 42848 && isTwoMembers)
            || (taxIncome <= 51592 && isThreeMembers)
            || (taxIncome <= 60336 && isFourMembers)
            || (taxIncome <= 69081 && isFiveMembers)
            || (taxIncome <= (69081 + (8744 * personnesSupplementaires)) && isMoreThanFive)) {
            couleurChoisie = 'purple'
        }

        else if ((taxIncome > 29148 && isOneMember)
            || (taxIncome > 42848 && isTwoMembers)
            || (taxIncome > 51592 && isThreeMembers)
            || (taxIncome > 60336 && isFourMembers)
            || (taxIncome > 69081 && isFiveMembers)
            || (taxIncome > (69081 + (8744 * personnesSupplementaires)) && isMoreThanFive)) {
            couleurChoisie = 'pink'
        }

        return couleurChoisie
    }

    setEstimation(products, colorCat) {
        let totalAide = 0
        const isPacAirAir = products.includes("Pac air air (climatisation)") ? 1 : 0
        const isPacAirEau = products.includes("PAC AIR EAU") ? 1 : 0
        const isIsolationComble = products.includes("Isolation des combles") ? 1 : 0
        const isPhotovoltaique = products.includes("Photovoltaïque") ? 1 : 0
        const isBallonThermo = products.includes("Ballon thermodynamique") ? 1 : 0
        let { lostAticsSurface } = this.state
        lostAticsSurface = Number(lostAticsSurface)

        if (colorCat == 'blue') {
            totalAide = (8364 * isPacAirEau) + (900 * isPacAirAir) + (1368 * isBallonThermo) + (22 * lostAticsSurface * isIsolationComble) + (0 * isPhotovoltaique)
        }

        else if (colorCat == 'yellow') {
            totalAide = (7364 * isPacAirEau) + (450 * isPacAirAir) + (884 * isBallonThermo) + (22 * lostAticsSurface * isIsolationComble) + (0 * isPhotovoltaique)
        }

        else if (colorCat == 'purple') {
            totalAide = (4727 * isPacAirEau) + (450 * isPacAirAir) + (484 * isBallonThermo) + (11 * lostAticsSurface * isIsolationComble) + (0 * isPhotovoltaique)
        }

        else if (colorCat == 'pink') {
            totalAide = (2727 * isPacAirEau) + (450 * isPacAirAir) + (84 * isBallonThermo) + (11 * lostAticsSurface * isIsolationComble) + (0 * isPhotovoltaique)
        }

        return totalAide
    }

    //##Success
    successMessage() {
        const title = "Estimation de votre prime: "
        const { products, colorCat, estimation, submitted } = this.state
        const message1 = "Ce que nous vous recommandons"
        const message2 = "Et Maintenant ?"
        const instructions = [
            "Renseigner vos informations et découvrez votre montant d’aides et les produits que nous vous recommandons",
            "Déposer votre dossier d’aide directement en ligne!",
            "Suivez l’avancement de vos demandes"
        ]

        const labels = [
            "OK",
            "Un conseiller vous contacte par téléphone et valide votre dossier.",
            "Synergys vous remet votre étude et votre devis.",
            "Le devis accepté, nous entamons les travaux.",
            "Pour les aides ? Vous n'avez pas à les avancer, Synergys est mandataire administratif et financier de maprimerénov'!"
        ]

        return (
            <View style={{ flex: 1 }}>
                <ScrollView style={{ backgroundColor: theme.colors.white }} contentContainerStyle={{ paddingBottom: 8 }}>

                    <View style={styles.sucessMessageContent}>
                        <View style={[styles.colorCatCircle, { backgroundColor: colorCat }]} />
                        <Text style={[theme.customFontMSmedium.body, styles.successMessageTitle]}>
                            {title}
                            <Text style={[theme.customFontMSmedium.h2, { color: theme.colors.primary }]}>{estimation}€</Text>
                        </Text>
                    </View>

                    <View style={{ padding: theme.padding }}>
                        <Text style={[theme.customFontMSsemibold.body, { opacity: 0.8, marginBottom: 16 }]}>{message1}</Text>
                        {products.map((product) => {
                            return (
                                <View style={{ flexDirection: "row" }}>
                                    <Image source={this.getImage(product)} style={{ alignSelf: 'center', width: 15, height: 15 }} />
                                    <Text style={[theme.customFontMSregular.body, { marginLeft: 8 }]}>{product}</Text>
                                </View>
                            )
                        }
                        )}
                    </View>

                    <View style={{ width: constants.ScreenWidth - theme.padding * 2, alignSelf: 'center', borderColor: theme.colors.gray_light, borderWidth: StyleSheet.hairlineWidth }} />

                    <View style={{ flex: 1, padding: theme.padding }}>
                        <Text style={[theme.customFontMSsemibold.body, { opacity: 0.8, marginBottom: 16 }]}>{message2}</Text>
                        {this.renderTrackingSteps()}
                        <Image source={require('../assets/images/maprimerenove.jpg')} style={{ width: constants.ScreenWidth - theme.padding * 2, height: constants.ScreenWidth - theme.padding * 2, alignSelf: 'center' }} />
                    </View>
                </ScrollView>

                {submitted && this.renderBottomCenterButton("Générer une fiche EEB", this.toggleModal)}
            </View>
        )
    }

    renderTrackingSteps() {
        const steps = [
            { circleColor: 'green', barColor: "green", textColor: theme.colors.secondary, title: 'OK', caption: "L'estimation de votre prime à été calculée" },
            { circleColor: 'green', barColor: theme.colors.graySilver, textColor: theme.colors.secondary, title: 'Contact', caption: 'Un conseiller vous contacte par téléphone et valide votre dossier.' },
            { circleColor: theme.colors.graySilver, barColor: theme.colors.graySilver, textColor: theme.colors.graySilver, title: 'Etude et devis', caption: 'Synergys vous remet votre étude et votre devis.' },
            { circleColor: theme.colors.graySilver, barColor: theme.colors.graySilver, textColor: theme.colors.graySilver, title: 'Travaux', caption: 'Le devis accepté, nous entamons les travaux.' },
            { circleColor: theme.colors.graySilver, barColor: theme.colors.graySilver, textColor: theme.colors.graySilver, title: 'Aide', caption: "Pour les aides ? Vous n'avez pas à les avancer, Synergys est mandataire administratif et financier de maprimerénov !" }
        ]

        return steps.map((step, index) => {
            return (
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ alignItems: 'center' }}>
                        <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: step.circleColor }} />
                        {index !== steps.length - 1 && <View style={{ flex: 1, width: 2, backgroundColor: step.barColor }} />}
                    </View>

                    <View style={{ flex: 1, paddingLeft: 16, marginBottom: 24 }}>
                        <Text style={[theme.customFontMSsemibold.body, { marginTop: -4, color: step.textColor }]}>{step.title}</Text>
                        <Text style={[theme.customFontMSregular.caption, { color: theme.colors.gray_dark }]}>{step.caption}</Text>
                    </View>
                </View>
            )
        })
    }

    getImage(name) {
        switch (name) {
            case "Pac air air (climatisation)":
                return require("../assets/icons/pacAirAir.png")
                break;
            case "PAC AIR EAU":
                return require("../assets/icons/pacAirEau.png")
                break;
            case "Ballon thermodynamique":
                return require("../assets/icons/ballonThermo.png")
                break;
            case "Isolation des combles":
                return require("../assets/icons/isoCombles.png")
                break;
            default:
                return require("../assets/icons/pacAirAir.png")
                break;
        }
    }

    //##BackHandler
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        const { showWelcomeMessage, submitted, readOnly } = this.state

        if (!this.isEdit && !showWelcomeMessage && !submitted) {
            const title = "Abandonner"
            const message = 'Les données saisies seront perdues. Êtes-vous sûr de vouloir annuler ?'
            const handleConfirm = () => this.props.navigation.goBack(null);
            this.myAlert(title, message, handleConfirm)
        }

        else {
            if (!readOnly)
                this.setState({ readOnly: true })
            else this.props.navigation.goBack(null);
        }
        return true;
    }

    //##Helpers
    toggleModal() {
        this.setState({ isPdfModalVisible: !this.state.isPdfModalVisible })
    }

    async savePdfBase64(pdfBase64) {
        const pdfName = `Scan généré ${moment().format('DD-MM-YYYY HHmmss')}.pdf`
        saveFile(pdfBase64, pdfName, 'base64')
            .then((destPath) => {
                this.props.navigation.state.params.onGoBack({
                    pdfBase64Path: destPath,
                    pdfName,
                    DocumentId: this.DocumentId
                })
                this.props.navigation.pop(this.popCount)
            })
            .catch((e) => {
                Alert.alert('', e.message)
                return
            })
    }

    renderBottomCenterButton(title, onPress) {
        return (
            <Button
                mode="contained"
                style={styles.bottomCenterButton}
                onPress={onPress}>
                {title}
            </Button>
        )
    }

    renderContent() {
        const { initialLoading, readOnly, showWelcomeMessage, showSuccessMessage, submitted } = this.state
        const { pages, steps } = this.props

        if (initialLoading)
            return <Loading />

        else if (this.isEdit && readOnly)
            return this.props.renderOverview()

        else if (showWelcomeMessage && this.props.welcomeMessage) {
            const callBack = () => this.setState({ showWelcomeMessage: false })
            return this.props.welcomeMessage(callBack)
        }

        else return (
            <View style={styles.container}>
                {!showSuccessMessage &&
                    <View style={styles.header}>
                        {this.renderSteps(pages, steps)}
                        {this.renderProgression(pages)}
                    </View>
                }

                <View style={styles.body}>
                    {!showSuccessMessage && this.renderTitle(pages)}
                    {this.renderForm(pages)}
                </View>

                {!submitted && this.renderButtons(pages)}
            </View>
        )
    }

    render() {
        const {
            showWelcomeMessage,
            showSuccessMessage,
            isPdfModalVisible,
            pdfBase64,
            submitted,
            readOnly,
            loading,
            initialLoading,
            docNotFound,
            toastMessage,
            toastType
        } = this.state

        if (pdfBase64)
            var source = { uri: `data:application/pdf;base64,${pdfBase64}` }

        if (docNotFound)
            return (
                <View style={styles.mainContainer}>
                    <Appbar
                        close
                        title
                        titleText={this.title}
                    />
                    <EmptyList
                        icon={faTimes}
                        header='Simulation introuvable'
                        description="La simulation est introuvable dans la base de données. Il se peut qu'elle ait été supprimé."
                        offLine={!this.props.network.isConnected}
                    />
                </View>
            )

        return (
            <View style={styles.mainContainer}>
                <Appbar
                    appBarColor={"#003250"}
                    iconsColor={theme.colors.white}
                    close
                    title
                    check={!readOnly}
                    handleSubmit={this.handleSubmit}
                    edit={this.isEdit && readOnly}
                    handleEdit={() => this.setState({ submitted: false, readOnly: false })}
                    titleText={this.props.titleText}
                    customBackHandler={this.handleBackButtonClick}
                />

                {this.renderContent()}

                <Modal
                    isVisible={isPdfModalVisible}
                    onSwipeComplete={this.toggleModal}
                    onBackButtonPress={this.toggleModal}
                    onBackdropPress={this.toggleModal}
                    style={styles.modal}
                >
                    <View style={styles.scrollableModal}>
                        <ModalHeader
                            title={"Fiche EEB générée"}
                            toggleModal={this.toggleModal}
                        />
                        {pdfBase64 !== "" &&
                            <View style={{ flex: 1 }}>
                                <Pdf source={source} style={modalStyles.pdf} />
                            </View>
                        }
                        {this.renderBottomCenterButton("Valider la fiche EEB", () => this.savePdfBase64(pdfBase64))}
                    </View>
                </Modal>

                <LoadDialog
                    message={"Traitement en cours"}
                    loading={loading}
                />

                <Toast
                    duration={3500}
                    message={toastMessage}
                    type={toastType}
                    onDismiss={() => this.setState({ toastMessage: '' })}
                    containerStyle={{ bottom: constants.ScreenHeight * 0.1 }}
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

export default connect(mapStateToProps)(StepsForm)

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    formContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingBottom: 24,
        paddingHorizontal: theme.padding
    },
    header: {
        backgroundColor: "#003250",
        paddingHorizontal: theme.padding
    },
    step: {
        borderWidth: 1,
        borderColor: "#003250",
        padding: 8,
        paddingHorizontal: 16,
        borderRadius: 4,
    },
    stepsSeparator: {
        flex: 1,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: theme.colors.white,
    },
    body: {
        flex: 1,
        backgroundColor: theme.colors.white,
        // paddingHorizontal: theme.padding
    },
    stepsContainer: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: "space-between",
        backgroundColor: "#003250"
    },
    buttonsContainer: {
        paddingHorizontal: theme.padding,
        backgroundColor: theme.colors.background,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    bottomCenterButton: {
        position: "absolute",
        bottom: 0,
        alignSelf: "center",
        width: constants.ScreenWidth - theme.padding * 2,
        backgroundColor: theme.colors.primary
    },
    sucessMessageContent: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: theme.padding * 2,
        backgroundColor: "#003250",
        borderBottomWidth: 2,
        borderBottomColor: theme.colors.primary
    },
    colorCatCircle: {
        height: 18,
        width: 18,
        borderRadius: 9,
        backgroundColor: 'green',
        marginTop: 6
    },
    successMessageTitle: {
        color: theme.colors.white,
        textAlign: "center",
        letterSpacing: 1,
        marginLeft: 8
    },
    overviewContainer: {
        flexGrow: 1,
        paddingTop: theme.padding / 2,
        paddingBottom: theme.padding * 3,
        backgroundColor: theme.colors.gray_extraLight
    },
    overviewRow: {
        flexDirection: "row",
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: theme.colors.gray_light,
        marginHorizontal: theme.padding,
    },
    overviewText: {
        flex: 0.5,
        paddingHorizontal: theme.padding / 2,
        paddingRight: theme.padding * 2,
        paddingVertical: theme.padding / 2,
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

const itemStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: constants.ScreenWidth,
    },
    trackingRow: {
        flex: 0.5,
        flexDirection: 'row'
    },
    trackingLineRight: {
        borderRightWidth: 1
    },
    trackingLineLeft: {
        borderLeftWidth: 1
    },
    trackingCircle: {
        position: 'absolute',
        width: 16,
        height: 16,
        borderRadius: 8,
    },
    iconContainer: {
        flex: 0.25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconBackground: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: constants.ScreenWidth * 0.085,
        width: constants.ScreenWidth * 0.17,
        height: constants.ScreenWidth * 0.17,
    },

    textContainer: {
        flex: 0.6,
        justifyContent: 'center',
        paddingLeft: 15,
        paddingRight: 10,
    },
});


















        //DONE
        //Submit color, estimation & products
        //Algo: products not showing all
        //Scrollview on recap simulation
        //"Générer une fiche eeb" button is showed even after pressing faPen
        //message: Enregistré avec succés
        // Save draft (check icon when this.isEdit === false)
        // Tag drafts
        // Navigate to pageindex onPress field recap
        // Cancel attachment removes reference

        //TO FIX
        //Soumettre: crash when editing existing field (try speed)
        //--> Check screenshot of error