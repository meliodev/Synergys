
import React, { Component } from 'react';
import { View, Text, StyleSheet, } from 'react-native'
import { faVials } from '@fortawesome/pro-duotone-svg-icons';

import moment from 'moment';
import 'moment/locale/fr'
moment.locale('fr')

import StepsForm from '../../../containers/StepsForm'
import { CustomIcon, Button } from '../../../components/index'

import { ficheTechModel, pvReceptionModel } from '../../../core/forms'
import { pvReceptionBase64, ficheEEBBase64 } from '../../../core/files'
import { generatePdfForm, generatePvReception } from '../../../core/utils'
import { constants } from '../../../core/constants'
import * as theme from '../../../core/theme'

const properties = [
    "electricMeterPicture", //remove
    "subPower",
    "phaseType",
    "electricPanelPicture", //remove
    "eletricPanelSize",
]

let initialState = {
    electricMeterPicture: null,
    subPower: "",
    phaseType: "",
    electricPanelPicture: null,
    eletricPanelSize: "",
}

class CreateFicheTech extends Component {
    constructor(props) {
        super(props)

        this.FicheTechId = this.props.navigation.getParam('FicheTechId', '')
        this.project = this.props.navigation.getParam('project', null)

        this.state = {
        }
    }

    render() {

        const { model } = ficheTechModel()

        return (
            <StepsForm
                titleText="Fiche technique"
                navigation={this.props.navigation}
                stateProperties={properties}
                initialState={initialState}
                idPattern={"GS-FT-"}
                DocId={this.FicheTechId}
                collection={"FichesTech"}
                pdfType={"FichesTech"}
                steps={[]}
                pages={model}
                generatePdf={(formInputs) => generatePdfForm(formInputs, "FichesTech")}
                genButtonTitle="Générer une Fiche Technique"
                fileName="Fiche Technique"
            />
        )
    }
}

export default CreateFicheTech

