
import React, { Component } from 'react';
import { View, Text, StyleSheet, } from 'react-native'
import { faVials } from '@fortawesome/pro-duotone-svg-icons';

import moment from 'moment';
import 'moment/locale/fr'
moment.locale('fr')

import StepsForm from '../../../containers/StepsForm'
import { CustomIcon, Button } from '../../../components/index'

import { pvReceptionModel } from '../../../core/forms'
import { pvReceptionBase64, ficheEEBBase64 } from '../../../core/files'
import { generatePdfForm, generatePvReception } from '../../../core/utils'
import { constants } from '../../../core/constants'
import * as theme from '../../../core/theme'

const properties = [
    "acceptReception",
    "reservesNature",
    "worksToExecute",
    "timeLimitFromToday",
    "madeIn",
    "clientName",
    "installationAddress",
    "phone",

    "installations",
    "solarWaterHeaterSensorSurface",
    "combinedSolarSystemSensorSurface",
    "collectiveSolarThermalSensorSurface",
    "woodHeatingPower",
    "woodHeatingDeviceType",
    "photovoltaicPower",
    "photovoltaicWorksType",
    "woodHeatingPower",
    "heatPumpDeviceType",
    "geothermalDrillingDepth",
    "drillingType",
    "condensingBoilerPower",
    "condensingBoilerDeviceType",

    "appreciation",
    "signatoryName",
]

const initialState = {
    acceptReception: "",
    reservesNature: "",
    worksToExecute: "",
    timeLimitFromToday: "",
    madeIn: "",
    clientName: "",
    installationAddress: { description: '', place_id: '', marker: { latitude: '', longitude: '' } },
    phone: "",
    //Installations
    installations: [],
    solarWaterHeaterSensorSurface: "",
    combinedSolarSystemSensorSurface: "",
    collectiveSolarThermalSensorSurface: "",
    woodHeatingPower: "",
    woodHeatingDeviceType: "",
    photovoltaicPower: "",
    photovoltaicWorksType: "",
    woodHeatingPower: "",
    heatPumpDeviceType: "",
    geothermalDrillingDepth: "",
    drillingType: "",

    appreciation: "",
    signatoryName: "",
}

class CreatePvReception extends Component {
    constructor(props) {
        super(props)

        this.PvReceptionId = this.props.navigation.getParam('PvReceptionId', '')
        this.project = this.props.navigation.getParam('project', null)
        this.clientFullName = ""
        this.billingDate = ""
        if (this.project) {
            this.clientFullName = this.project.client.fullName
            this.billingDate = moment().format('DD/MM/YYYY') //Info not available: Billing date is registred only after filling Billing amount during the process
        }

        this.state = {
        }
    }

    renderOverview() {
        return (
            <Text>Hello World !</Text>
        )
    }

    render() {

        const { clientFullName, billingDate } = this
        const { model } = pvReceptionModel({ clientFullName, billingDate })

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
                steps={["RÉSERVES", "", "CHANTIER", "", "INSTALLATIONS"]}
                pages={model}
                generatePdf={(formInputs) => generatePdfForm(formInputs, "PvReception", { clientFullName, billingDate })}
                genButtonTitle="Générer un PV réception"
                fileName="PV Réception"
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

export default CreatePvReception
