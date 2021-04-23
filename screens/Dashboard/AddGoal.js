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
        this.isEdit = this.GoalId ? true : false
        this.GoalId = this.isEdit ? this.GoalId : moment().format('MM-YYYY')
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

            let { monthYear, target, current, description } = this.state
            let { createdAt, createdBy, editedAt, editedBy } = this.state
            let { error, loading } = this.state

            //General info
            let goal = doc.data()
            monthYear = goal.monthYear
            target.value = goal.target
            description = goal.description

            current = 0
            for (var projectId in goal.projectsIncome) {
                current += Number(goal.projectsIncome[projectId])
            }

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

        let goal = {
            monthYear,
            target: target.value,
            description: description.value,
            editedAt: moment().format(),
            editedBy: currentUser,
            deleted: false,
        }

        if (!this.isEdit) {
            goal.createdAt = moment().format()
            goal.createdBy = currentUser
        }

        db.collection('Users').doc(this.userId).collection('Turnover').doc(GoalId).set(goal, { merge: true }) //Nothing to wait for -> data persisted to local cache
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
        const { GoalId, target, current } = this.initialState
        const monthTemp = moment(GoalId, 'MM-YYYY').format('MMMM')
        const month = monthTemp.charAt(0).toUpperCase() + monthTemp.slice(1)
        const year = moment(GoalId, 'MM-YYYY').format('YYYY')

        const goal = {
            id: GoalId,
            month,
            year,
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
                                                const GoalId = moment(selectedDate).format('MM-YYYY')
                                                this.setState({ monthYear: selectedDate, GoalId, showMonthPicker: false })
                                            }}
                                            value={monthYear}
                                            minimumDate={new Date()}
                                            maximumDate={new Date(2025, 5)}
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
                                            value={moment(editedAt).format('ll')}
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

