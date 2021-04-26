import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, Keyboard, TextInput, ActivityIndicator } from 'react-native';
import MonthPicker from 'react-native-month-year-picker'
import { faCalendarPlus, faInfoCircle, faFileAlt } from '@fortawesome/pro-light-svg-icons'
import _ from 'lodash'

import moment from 'moment';
import 'moment/locale/fr'
moment.locale('fr')

import { Appbar, FormSection, ItemPicker, Loading, Toast, TurnoverGoal } from '../../components'
import MyInput from '../../components/TextInput'

import firebase, { db, auth } from '../../firebase'
import * as theme from "../../core/theme";
import { constants } from "../../core/constants";
import { generateId, navigateToScreen, myAlert, updateField, nameValidator, setToast, load, pickImage, isEditOffline, refreshClient, refreshComContact, refreshTechContact, priceValidator } from "../../core/utils";
import { notAvailableOffline, handleFirestoreError } from '../../core/exceptions';

import { fetchDocs, getResponsableByRole } from "../../api/firestore-api";
import { uploadFiles } from "../../api/storage-api";
import { processMain, getCurrentStep, getCurrentAction, getPhaseId } from '../../core/process'

import { connect } from 'react-redux'

class AddGoal extends Component {
    constructor(props) {
        super(props)
        this.fetchGoal = this.fetchGoal.bind(this)

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleDeleteGoal = this.handleDeleteGoal.bind(this)
        this.myAlert = myAlert.bind(this)

        this.initialState = {}
        this.isInit = true
        this.currentUser = firebase.auth().currentUser

        this.userId = this.props.navigation.getParam('userId', auth.currentUser.uid)
        this.GoalId = this.props.navigation.getParam('GoalId', '')
        this.currentTurnover = this.props.navigation.getParam('currentTurnover', '')
        this.incomeSources = this.props.navigation.getParam('incomeSources', [])
        this.isEdit = this.GoalId ? true : false
        this.GoalId = this.isEdit ? this.GoalId : moment().format('YYYY')
        this.monthYear = this.props.navigation.getParam('monthYear', '')
        this.title = this.isEdit ? "Modifier l'objectif" : "Nouvel objectif"

        this.state = {
            //ID
            GoalId: this.GoalId,
            //TEXTINPUTS
            target: { value: 0, error: '' },
            current: 0,
            description: '',

            //Pickers
            monthYear: new Date(),

            //logs (Auto-Gen)
            createdAt: '',
            createdBy: { id: '', fullName: '' },
            editedAt: '',
            editedBy: { id: '', fullName: '' },

            showMonthPicker: false,
            error: '',
            loading: true,
            docNotFound: false,
        }
    }

    async componentDidMount() {

        if (this.isEdit) {
            const docNotFound = await this.fetchGoal() //Get current process
            if (docNotFound) {
                load(this, false)
                return
            }

            this.initialState = _.cloneDeep(this.state)
        }

        else this.initialState = _.cloneDeep(this.state)

        load(this, false)
    }

    //FETCHES: #edit
    async fetchGoal() {
        await db.collection('Users').doc(this.userId).collection('Turnover').doc(this.GoalId).get().then((doc) => {
            if (!doc.exists) {
                this.setState({ docNotFound: true })
                return true
            }

            let { monthYear, target, description } = this.state
            let { createdAt, createdBy, editedAt, editedBy } = this.state
            let { error, loading } = this.state

            //General info
            let monthsTurnovers = doc.data()
            const goal = monthsTurnovers[this.monthYear]
            monthYear = moment(goal.monthYear, 'MM-YYYY').toDate()
            target.value = goal.target
            description = goal.description
            const current = this.currentTurnover

            //َActivity
            createdAt = goal.createdAt
            createdBy = goal.createdBy
            editedAt = goal.editedAt
            editedBy = goal.editedBy

            this.setState({ monthYear, target, current, description, createdAt, createdBy, editedAt, editedBy }, async () => {
                //if (this.isInit)

                this.initialState = _.cloneDeep(this.state)
                //this.isInit = false
            })
        })
    }

    //Inputs validation
    validateInputs() {
        let { target } = this.state

        let targetError = priceValidator(target.value, `"Chiffre d'affaire cible"`)

        if (targetError) {
            target.error = targetError
            Keyboard.dismiss()
            this.setState({ targetError, loading: false })
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
        let { loading } = this.state
        if (loading || _.isEqual(this.state, this.initialState)) return

        load(this, true)

        const isValid = this.validateInputs(isConnected)
        if (!isValid) return

        let { GoalId, monthYear, target, description } = this.state

        const currentUser = {
            id: this.currentUser.uid,
            fullName: this.currentUser.displayName
        }

        const formatedMonthYear = moment(monthYear).format('MM-YYYY')

        let monthlyGoal = {
            monthYear: formatedMonthYear,
            target: target.value,
            description,
            editedAt: moment().format(),
            editedBy: currentUser,
            lastMonthEdited: formatedMonthYear,
            deleted: false,
        }

        if (!this.isEdit) {
            monthlyGoal.createdAt = moment().format()
            monthlyGoal.createdBy = currentUser
        }

        let payload = {}
        payload[formatedMonthYear] = monthlyGoal

        db.collection('Users').doc(this.userId).collection('Turnover').doc(GoalId).set(payload, { merge: true })
        this.props.navigation.state.params.onGoBack()
        this.props.navigation.goBack()
    }

    showAlert() {
        const title = "Supprimer l'ojectif"
        const message = 'Êtes-vous sûr de vouloir supprimer cet objectif ?'
        const handleConfirm = () => this.handleDeleteGoal()
        this.myAlert(title, message, handleConfirm)
    }

    //#OOS
    handleDeleteGoal() {
        load(this, true)
        db.collection('Users').doc(this.userId).collection('Turnover').doc(this.state.GoalId).update({ deleted: true })
        setTimeout(() => {
            load(this, false)
            this.props.navigation.goBack(), 1000
        })
    }

    goalOverview() {
        const { GoalId, target, current, monthYear } = this.initialState
        console.log('.....', moment(monthYear, 'X').format('lll'))
        const monthTemp = moment(monthYear).format('MMMM')
        const month = monthTemp.charAt(0).toUpperCase() + monthTemp.slice(1)

        const goal = {
            id: GoalId,
            month,
            year: GoalId,
            target: target.value,
            current
        }

        return (
            <View style={{ marginTop: 10 }}>
                <TurnoverGoal
                    goal={goal}
                    index={0}
                    onPress={() => console.log('No action...')}
                    isList={false}
                />
            </View>
        )
    }

    renderIncomeSources() {

        const onPressProjectId = (ProjectId) => this.props.navigation.navigate('CreateProject', { ProjectId })
        const textStyle = theme.customFontMSregular.body

        return (
            <FormSection
                sectionTitle='Historique des sources'
                sectionIcon={faFileAlt}
                form={
                    <View style={styles.incSourcesContainer}>
                        <View style={styles.incSourcesHeader}>
                            <Text style={[textStyle]}>Projet</Text>
                            <Text style={[textStyle]}>Revenu</Text>
                        </View>

                        {this.incomeSources.map((source, index) => {
                            return (
                                <TouchableOpacity
                                    onPress={() => onPressProjectId(source.projectId)}
                                    style={styles.incSourcesRow}
                                >
                                    <Text style={[textStyle, { color: theme.colors.primary }]}>{source.projectId}</Text>
                                    <Text style={[textStyle]}>€ {source.amount}</Text>
                                </TouchableOpacity>
                            )
                        })}
                    </ View>
                }
            />
        )
    }

    render() {
        let { monthYear, target, description } = this.state
        let { createdAt, createdBy, editedAt, editedBy } = this.state
        let { showMonthPicker, error, loading, docNotFound, toastMessage, toastType } = this.state

        //Privilleges
        let { canCreate, canUpdate, canDelete } = this.props.permissions.users
        const canWrite = (canUpdate && this.isEdit || canCreate && !this.isEdit)

        const { isConnected } = this.props.network

        if (docNotFound)
            return (
                <View style={styles.mainContainer}>
                    <Appbar close title titleText={this.title} />
                    <EmptyList icon={faTimes} header='Objectif introuvable' description="L'objectif est introuvable dans la base de données. Il se peut qu'il ait été supprimé." offLine={!isConnected} />
                </View>
            )

        else return (
            <View style={styles.mainContainer}>
                <Appbar close title titleText={this.title} check={this.isEdit ? canWrite && !loading : !loading} handleSubmit={this.handleSubmit} del={canDelete && this.isEdit && !loading} handleDelete={this.showAlert} loading={loading} />

                {loading ?
                    <Loading />
                    :
                    <ScrollView style={styles.dataContainer}>
                        {this.isEdit && this.goalOverview()}
                        <FormSection
                            sectionTitle='Détails'
                            sectionIcon={faInfoCircle}
                            iconColor={theme.colors.gray_dark}
                            form={
                                <View style={{ flex: 1 }}>

                                    {showMonthPicker && (
                                        <MonthPicker
                                            onChange={(event, newDate) => {
                                                const selectedDate = newDate || monthYear
                                                const GoalId = moment(selectedDate).format('YYYY')
                                                this.setState({ monthYear: selectedDate, GoalId, showMonthPicker: false })
                                            }}
                                            value={monthYear}
                                            minimumDate={new Date()}
                                            maximumDate={new Date(2030, 5)}
                                            locale="fr"
                                            cancelButton="Annuler"
                                            okButton="Valider"
                                        />
                                    )}

                                    <ItemPicker
                                        onPress={() => this.setState({ showMonthPicker: !showMonthPicker })}
                                        label={'Mois *'}
                                        value={moment(monthYear).format('MMMM YYYY').charAt(0).toUpperCase() + moment(monthYear).format('MMMM YYYY').slice(1)}
                                        editable={canWrite}
                                        showAvatarText={false}
                                        icon={faCalendarPlus}
                                    />

                                    <MyInput
                                        label="Chiffre d'affaire cible (€) *"
                                        returnKeyType="done"
                                        keyboardType='numeric'
                                        value={target.value}
                                        onChangeText={text => updateField(this, target, text)}
                                        error={!!target.error}
                                        errorText={target.error}
                                    />

                                    <MyInput
                                        label="Description"
                                        returnKeyType="done"
                                        value={description}
                                        onChangeText={text => updateField(this, description, text)}
                                        multiline={true}
                                        editable={canWrite}
                                    />

                                </View>
                            } />

                        {this.isEdit && this.incomeSources.length > 0 && this.renderIncomeSources()}

                        {this.isEdit &&
                            <FormSection
                                sectionTitle='Activité'
                                sectionIcon={faFileAlt}
                                form={
                                    <View style={{ flex: 1 }}>
                                        <MyInput
                                            label="Date de création"
                                            returnKeyType="done"
                                            value={moment(createdAt).format('ll')}
                                            editable={false}
                                        />

                                        <TouchableOpacity>
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
                                            value={moment(editedAt).format('ll')}
                                            editable={false}
                                        />

                                        <TouchableOpacity>
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
        //fcmToken: state.fcmtoken
    }
}

export default connect(mapStateToProps)(AddGoal)

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: theme.colors.background
    },
    dataContainer: {
        flex: 1,
    },
    incSourcesContainer: {
        flex: 1,
        backgroundColor: theme.colors.white,
        borderRadius: 25,
        elevation: 3,
        marginTop: 12
    },
    incSourcesHeader: {
        flexDirection: 'row',
        padding: theme.padding,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        justifyContent: 'space-between',
        backgroundColor: '#EAF7F1'
    },
    incSourcesRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: theme.padding,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: theme.colors.gray_light,
    }
})

