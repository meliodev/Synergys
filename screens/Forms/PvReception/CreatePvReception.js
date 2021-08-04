
import React, { Component } from 'react';
import { View, Text, StyleSheet, } from 'react-native'
import { faVials } from '@fortawesome/pro-duotone-svg-icons';

import StepsForm from '../../../containers/StepsForm'
import { CustomIcon, Button } from '../../../components/index'

import { PvReceptionModel } from '../../../core/forms'
import { pvReceptionBase64, ficheEEBBase64 } from '../../../core/files'
import { generatePdfForm, generatePvReception } from '../../../core/utils'
import { constants } from '../../../core/constants'
import * as theme from '../../../core/theme'

const properties = [
    "projectOwner",
    "orderDate",
    "acceptWorksReceptionDate",
    "acceptReservesReceptionDate",
    "reservesNature",
    "worksToExecute",
    "timeLimitFromToday",
    "madeIn",
    "doneOn",
    "clientName",
    "installationAddress",
    "phone",
    "commissioningDate",
    "appreciation",
    "appreciationDate",
    "signatoryName",
]

const initialState = {
    projectOwner: "",
    orderDate: new Date(),
    acceptWorksReceptionDate: new Date(),
    acceptReservesReceptionDate: new Date(),
    reservesNature: "",
    worksToExecute: "",
    timeLimitFromToday: "",
    madeIn: "",
    doneOn: new Date(),
    clientName: "",
    installationAddress: { description: '', place_id: '', marker: { latitude: '', longitude: '' } },
    phone: "",
    commissioningDate: new Date(),
    appreciation: "",
    appreciationDate: new Date(),
    signatoryName: "",
}

class CreateSimulation extends Component {
    constructor(props) {
        super(props)

        this.PvReceptionId = this.props.navigation.getParam('PvReceptionId', '')

        this.state = {

        }
    }

    renderOverview() {
        return (
            <Text>Hello World !</Text>
        )
    }

    render() {
        return (
            <StepsForm
                titleText="Nouveau PV réception"
                navigation={this.props.navigation}
                stateProperties={properties}
                initialState={initialState}
                idPattern={"GS-PV-"}
                DocId={this.PvReceptionId}
                collection={"PvReception"}
                //welcomeMessage={this.welcomeMessage}
                steps={["1", "", "2", "", "3"]}
                pages={PvReceptionModel}
                originalPdfBase64={pvReceptionBase64}
                generatePdf={generatePdfForm}
                genButtonTitle="Générer un PV réception"
                renderOverview={this.renderOverview}
            />
        )
    }
}

const styles = StyleSheet.create({
    welcomeContainer: {
        flex: 1,
        backgroundColor: theme.colors.white,
        justifyContent: "center"
    },
    welcomeHeader: {
        justifyContent: "center",
        paddingTop: theme.padding * 3,
        backgroundColor: "#003250",
        borderBottomWidth: 2,
        borderBottomColor: theme.colors.primary
    },
    welcomeTitle: {
        color: theme.colors.white,
        textAlign: "center",
        letterSpacing: 1,
        marginBottom: 48,
        marginTop: 16
    },
    welcomeInstructionsContainer: {
        flex: 1,
        paddingHorizontal: theme.padding,
        paddingVertical: theme.padding * 3
    },
    welcomeSeparator: {
        borderColor: theme.colors.gray_light,
        borderWidth: StyleSheet.hairlineWidth,
        marginVertical: 24
    },
    bottomCenterButton: {
        position: "absolute",
        bottom: 0,
        alignSelf: "center",
        width: constants.ScreenWidth - theme.padding * 2,
        backgroundColor: theme.colors.primary
    },
})

export default CreateSimulation
