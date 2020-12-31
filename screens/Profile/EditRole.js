
import React, { Component } from 'react'
import { StyleSheet, Alert, View } from 'react-native'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'

import Appbar from '../../components/Appbar'
import AddressSearch from '../../components/AddressSearch'
import MyInput from '../../components/TextInput'
import Picker from "../../components/Picker";
import Toast from "../../components/Toast"
import Loading from "../../components/Loading"

import * as theme from "../../core/theme"
import { constants, rolesRedux } from '../../core/constants'

import { updateField } from "../../core/utils"

import firebase from 'react-native-firebase'
const functions = firebase.functions()
const db = firebase.firestore()

import { connect } from 'react-redux'

const roles = [
    { label: 'Admin', value: 'Admin' },
    { label: 'Directeur commercial', value: 'Directeur commercial' },
    { label: 'Commercial', value: 'Commercial' },
    { label: 'Responsable technique', value: 'Responsable technique' },
    { label: 'Poseur', value: 'Poseur' },
    { label: 'Client', value: 'Client' }
]

class EditRole extends Component {

    constructor(props) {
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.setCustomClaim = this.setCustomClaim.bind(this)
        this.setRole = this.setRole.bind(this)

        this.prevScreen = this.props.navigation.getParam('prevScreen', '')
        this.userId = this.props.navigation.getParam('userId', '')
        this.currentRole = this.props.navigation.getParam('currentRole', '')

        this.state = {
            role: '',
            loading: false,
        }
    }

    componentDidMount() {
        this.setState({ role: this.currentRole })
    }

    setRole(role) {
        const action = { type: "ROLE", value: role }
        this.props.dispatch(action)
    }

    async handleSubmit() {
        console.log(`Changing from ${this.currentRole} to ${this.state.role} role`)

        if (this.currentRole !== this.state.role) {
            this.setState({ loading: true })
            db.collection('Users').doc(this.userId).update({ role: this.state.role })
                .then(() => this.setCustomClaim())
                .catch(e => {
                    this.setState({ loading: false })
                    Alert.alert('Erreur inattendue, veuillez réessayer plus tard.')
                })
        }
    }

    setCustomClaim() {
        const setCustomClaim = functions.httpsCallable('setCustomClaim')
        setCustomClaim({ role: this.state.role, userId: this.userId })
            .then(result => {

                if (this.userId === firebase.auth().currentUser.uid) {
                    firebase.auth().currentUser.getIdToken(true)
                    for (const role of rolesRedux) {
                        if (role.value === this.state.role.toLocaleLowerCase())
                            this.setRole(role)
                    }
                }

                this.props.navigation.state.params.onGoBack('success', 'Le rôle a été modifié avec succès')
                this.props.navigation.goBack()

            })
            .catch(err => Alert.alert('Erreur inattendue, veuillez réessayer plus tard.'))
            .finally(() => this.setState({ loading: false }))
    }

    render() {
        let { newEmail, loading } = this.state

        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <Appbar back={!loading} title titleText="Changer le rôle" check={!loading} handleSubmit={this.handleSubmit} />

                {loading ?
                    <Loading size='large' />
                    :
                    <View style={{ flex: 1, padding: 20 }}>
                        <Picker
                            label="Rôle"
                            returnKeyType="next"
                            value={this.state.role}
                            selectedValue={this.state.role}
                            onValueChange={(role) => this.setState({ role })}
                            title="Type d'utilisateur"
                            elements={roles}
                        />
                    </View>
                }

                <Toast
                    containerStyle={{ bottom: constants.ScreenWidth * 0.6 }}
                    message={this.state.toastMessage}
                    type={this.state.toastType}
                    onDismiss={() => this.setState({ toastMessage: '' })} />
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

export default connect(mapStateToProps)(EditRole)


const styles = StyleSheet.create({
    dialogContainer: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: "center",
        justifyContent: "center",
    }
})