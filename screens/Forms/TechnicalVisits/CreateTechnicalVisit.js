
import React, { Component } from 'react';
import { View, Text, StyleSheet, } from 'react-native'
import { faVials } from '@fortawesome/pro-duotone-svg-icons';

import StepsForm from '../../../containers/StepsForm'
import { CustomIcon, Button } from '../../../components/index'

import { technicalVisitModel } from '../../../core/forms'

import { generatePdfForm } from '../../../core/utils'
import { constants } from '../../../core/constants'
import * as theme from '../../../core/theme'

const properties = [
    
]

const initialState = {
    
}
 
class CreateSimulation extends Component {
    constructor(props) {
        super(props)
        this.TechnicalVisitId = this.props.navigation.getParam('TechnicalVisitId', '')

        this.state = {
        }
    }

    render() {
        return (
            <StepsForm
                titleText="Créer une fiche visite technique"
                navigation={this.props.navigation}
                stateProperties={properties}
                initialState={initialState}
                idPattern={"GS-VT-"}
                DocId={this.TechnicalVisitId}
                collection={"TechnicalVisits"}
                //welcomeMessage={this.welcomeMessage}
                steps={["1", "", "2", "", "3"]}
                pages={technicalVisitModel}
                generatePdf={(formInputs) => generatePdfForm(formInputs, "TechnicalVisits")}
                genButtonTitle="Générer une fiche visite technique"
                fileName = "Fiche Visite Technique"
            />
        )
    }
}

export default CreateSimulation
