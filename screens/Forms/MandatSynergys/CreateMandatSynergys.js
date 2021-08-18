
import React, { Component } from 'react';
import { View, Text, StyleSheet, } from 'react-native'
import { faVials } from '@fortawesome/pro-duotone-svg-icons';

import StepsForm from '../../../containers/StepsForm'
import { CustomIcon, Button } from '../../../components/index'

import { mandatSynergysModel } from '../../../core/forms'
import { mandatMPRBase64 } from '../../../assets/files/mandatMPRBase64'

import { generatePdfForm } from '../../../core/utils'
import { constants } from '../../../core/constants'
import * as theme from '../../../core/theme'
import { db } from '../../../firebase';

const properties = [
    "serviceProvider",
    "serviceType",
    "productTypes",
    "clientFirstName",
    "clientLastName",
    "addressClient",
    "addressCodeClient",
    "addressCityClient",
    "fixedPhoneClient",
    "mobilePhoneClient",
    "emailClient",
    "isSiteInfoEqualToClientInfo",
    "siteName",
    "addressSite",
    "addressCodeSite",
    "phoneSite",
    "emailSite",
    "financingAids",
]

const initialState = {
    serviceProvider: "",
    serviceType: "",
    productTypes: [],
    clientFirstName: "",
    clientLastName: "",
    addressClient: "",
    addressCodeClient: "",
    addressCityClient: "",
    fixedPhoneClient: "",
    mobilePhoneClient: "",
    emailClient: "",
    isSiteInfoEqualToClientInfo: "",
    siteName: "",
    addressSite: "",
    addressCodeSite: "",
    phoneSite: "",
    emailSite: "",
    financingAids: [],
}

class CreateMandatSynergys extends Component {
    constructor(props) {
        super(props)
        this.MandatSynergysId = this.props.navigation.getParam('MandatSynergysId', '')

        this.state = {
        }
    }

    render() {
        return (
            <StepsForm
                titleText="Créer un mandat Synergys"
                navigation={this.props.navigation}
                stateProperties={properties}
                initialState={initialState}
                idPattern={"GS-MSYN-"}
                DocId={this.MandatSynergysId}
                collection={"MandatsSynergys"}
                //welcomeMessage={this.welcomeMessage}
                steps={["PRESTATION", "", "CLIENT", "", "CHANTIER"]}
                pages={mandatSynergysModel}
                generatePdf={(formInputs) => generatePdfForm(formInputs, "MandatsSynergys")}
                genButtonTitle="Générer un Mandat Synergys"
                fileName="Mandat Synergys"
            />
        )
    }
}

export default CreateMandatSynergys
