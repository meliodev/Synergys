
import React, { Component } from 'react';
import { View, Text, StyleSheet, } from 'react-native'
import { faVials } from '@fortawesome/pro-duotone-svg-icons';

import StepsForm from '../../../containers/StepsForm'
import { CustomIcon, Button } from '../../../components/index'

import { mandatMPRModel } from '../../../core/forms'
import { mandatMPRBase64 } from '../../../assets/files/mandatMPRBase64'

import { generatePdfForm, retrieveFirstAndLastNameFromFullName } from '../../../core/utils'
import { constants } from '../../../core/constants'
import * as theme from '../../../core/theme'
import { db } from '../../../firebase';

const properties = [
    "sexe",
    "applicantFirstName",
    "applicantLastName",
    "address",
    "addressCode",
    "commune",
    "email",
    "phone",
    "createdIn",
]

let initialState = {
    sexe: "",
    applicantFirstName: "",//Auto
    applicantLastName: "",//Auto
    address: "",//Auto
    addressCode: "",//Old
    commune: "",//Old
    email: "",//Auto
    phone: "", //Auto
    createdIn: "",//Auto
    version: 1
}

class CreateMandatMPR extends Component {
    constructor(props) {
        super(props)
        this.MandatMPRId = this.props.navigation.getParam('MandatMPRId', '')

        this.project = this.props.navigation.getParam('project', null)
        this.clientFullName = this.project ? this.project.client.fullName : ""
        this.clientPhone = this.project ? this.project.client.phone : ""
        this.clientAddress = this.project ? this.project.address : ""
        this.clientPhone = this.project ? this.project.client.phone : ""
        this.clientEmail = this.project ? this.project.client.email : ""

        const { firstName: clientFirstName, lastName: clientLastName } = retrieveFirstAndLastNameFromFullName(this.clientFullName)
        initialState.applicantFirstName = clientFirstName
        initialState.applicantLastName = clientLastName
        initialState.address = this.clientAddress.description
        initialState.phone = this.clientPhone
        initialState.email = this.clientEmail
        initialState.createdIn = this.clientAddress.description

        this.state = {
        }
    }

    render() {
        return (
            <StepsForm
                autoGen={true}
                titleText="Créer un mandat Maprimerénov"
                navigation={this.props.navigation}
                stateProperties={properties}
                initialState={initialState}
                idPattern={"GS-MMPR-"}
                DocId={this.MandatMPRId}
                collection={"MandatsMPR"}
                //welcomeMessage={this.welcomeMessage}
                steps={["Identité", "", "Habitation", "", "Coordonnées"]}
                pages={mandatMPRModel}
                generatePdf={(formInputs) => generatePdfForm(formInputs, "MandatsMPR")}
                genButtonTitle="Générer un Mandat Maprimerénov"
                fileName="Mandat MaPrimeRénov"
            />
        )
    }
}

export default CreateMandatMPR
