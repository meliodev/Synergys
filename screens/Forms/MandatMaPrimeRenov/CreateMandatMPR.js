
import React, { Component } from 'react';
import { View, Text, StyleSheet, } from 'react-native'
import { faVials } from '@fortawesome/pro-duotone-svg-icons';

import StepsForm from '../../../containers/StepsForm'
import { CustomIcon, Button } from '../../../components/index'

import { mandatMPRModel } from '../../../core/forms'
import { mandatMPRBase64 } from '../../../assets/files/mandatMPRBase64'

import { generatePdfForm } from '../../../core/utils'
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
    "createdAt",
    "createdBy",
    "editedAt",
    "editedBy",
    "isSubmitted",
]

const initialState = {
    sexe: "",
    applicantFirstName: "",
    applicantLastName: "",
    address: "",
    addressCode: "",
    commune: "",
    email: "",
    createdIn: "",
}

class CreateMandatMPR extends Component {
    constructor(props) {
        super(props)
        this.MandatMPRId = this.props.navigation.getParam('MandatMPRId', '')

        this.state = {

        }
    }

    render() {
        return (
            <StepsForm
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
