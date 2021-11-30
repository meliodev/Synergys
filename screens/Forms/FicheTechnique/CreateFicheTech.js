
import React, { Component } from 'react';
import { View, Text, StyleSheet, } from 'react-native'
import { faVials } from '@fortawesome/pro-duotone-svg-icons';

import moment from 'moment';
import 'moment/locale/fr'
moment.locale('fr')

import StepsForm from '../../../containers/StepsForm'
import { CustomIcon, Button } from '../../../components/index'

import { visiteTechModel, pvReceptionModel, checklistPAEModel, checklistPAAModel, checklistBTModel, checklistBSModel, checklistPVModel } from '../../../core/forms'
import { visiteTechBase64 } from '../../../assets/files/visiteTechBase64'
import { checklistPAABase64 } from '../../../assets/files/checklist/checklistPAABase64'
import { checklistPAEBase64 } from '../../../assets/files/checklist/checklistPAEBase64'
import { checklistBSBase64 } from '../../../assets/files/checklist/checklistBSBase64'
import { checklistBTBase64 } from '../../../assets/files/checklist/checklistBTBase64'
import { checklistPVBase64 } from '../../../assets/files/checklist/checklistPVBase64'

import { generatePdfForm, generatePvReception } from '../../../core/utils'
import { constants } from '../../../core/constants'
import * as theme from '../../../core/theme'

const properties = [
    "electricMeterPicture", //remove
    "subPower",
    "phaseType",
    "electricPanelPicture", //remove
    "eletricPanelSize",
    "test"
]

let initialState = {
    electricMeterPicture: null,
    subPower: "",
    phaseType: "",
    electricPanelPicture: null,
    eletricPanelSize: "",
    test: ""
}

class CreateFicheTech extends Component {
    constructor(props) {
        super(props)

        this.VisiteTechId = this.props.navigation.getParam('VisiteTechId', '')
        this.project = this.props.navigation.getParam('project', null)

        //Travaux du projet
        this.workTypes = this.project ? this.project.workTypes : []
        initialState.workTypes = this.workTypes

        this.state = {
            model: []
        }
    }

    componentDidMount() {
        const { model, checklistBase64 } = this.mergeChecklists()
        this.setState({ model, checklistBase64 })
    }

    //Merge checklists models & documents (depending on the given workTypes)
    mergeChecklists() {
        let { model } = visiteTechModel()
        let checklistBase64 = [visiteTechBase64]
        const isInclude = (workType) => { return this.workTypes.includes(workType) }
        let lastPageIndex = 0 //#task =3 when adding 2 pictures

        if (isInclude("PAC AIR/EAU")) {
            //lastPageIndex is used to set up pdfConfig
            lastPageIndex += 1
            model = model.concat(checklistPAEModel(lastPageIndex).model)
            checklistBase64.push(checklistPAEBase64)
        }
        if (isInclude("PAC AIR/AIR (climatisation)")) {
            lastPageIndex += 1
            model = model.concat(checklistPAAModel(lastPageIndex).model)
            checklistBase64.push(checklistPAABase64)
        }
        if (isInclude("BALLON THERMODYNAMIQUE")) {
            lastPageIndex += 1
            model = model.concat(checklistBTModel(lastPageIndex).model)
            checklistBase64.push(checklistBTBase64)
        }
        if (isInclude("BALLON SOLAIRE THERMIQUE")) {
            lastPageIndex += 1
            model = model.concat(checklistBSModel(lastPageIndex).model)
            checklistBase64.push(checklistBSBase64)
        }
        if (isInclude("PHOTOVOLTAÏQUE")) {
            lastPageIndex += 1
            model = model.concat(checklistPVModel(lastPageIndex).model)
            checklistBase64.push(checklistPVBase64)
        }

        return { model, checklistBase64 }
    }

    render() {

        const { model, checklistBase64 } = this.state

        return (
            <StepsForm
                titleText="Visite technique"
                navigation={this.props.navigation}
                stateProperties={properties}
                initialState={initialState}
                idPattern={"GS-VT-"}
                DocId={this.VisiteTechId}
                collection={"VisitesTech"}
                pdfType={"VisitesTech"}
                steps={["INFO GÉNÉRALES", "", "IMAGES", "", "CHECKLIST"]}
                pages={model}
                generatePdf={(formInputs) => generatePdfForm(formInputs, "VisitesTech", { model, checklistBase64 })} //send checklistBase64 as param directly
                genButtonTitle="Générer une Visite technique"
                fileName="Visite technique"
            />
        )
    }
}

export default CreateFicheTech

