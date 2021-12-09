
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native'

import moment from 'moment';
import 'moment/locale/fr'
moment.locale('fr')

//Containers & Components
import StepsForm from '../../../containers/StepsForm'
import { CustomIcon, Button } from '../../../components/index'

//Forms Models
import { visiteTechModel } from '../../../core/forms/visitTech/visiteTechModel'
import { checklistPAEModel } from '../../../core/forms/visitTech/checklistPAEModel'
import { checklistPAAModel } from '../../../core/forms/visitTech/checklistPAAModel'
import { checklistBTModel } from '../../../core/forms/visitTech/checklistBTModel'
import { checklistBSModel } from '../../../core/forms/visitTech/checklistBSModel'
import { checklistPVModel } from '../../../core/forms/visitTech/checklistPVModel'
import { vtAttachedFilesModel } from '../../../core/forms/visitTech/vtAttachedFilesModel'

//PDFs
import { visiteTechBase64 } from '../../../assets/files/visiteTechBase64'
import { checklistPAABase64 } from '../../../assets/files/checklist/checklistPAABase64'
import { checklistPAEBase64 } from '../../../assets/files/checklist/checklistPAEBase64'
import { checklistBSBase64 } from '../../../assets/files/checklist/checklistBSBase64'
import { checklistBTBase64 } from '../../../assets/files/checklist/checklistBTBase64'
import { checklistPVBase64 } from '../../../assets/files/checklist/checklistPVBase64'

//Helpers
import { generatePdfForm, generatePvReception } from '../../../core/utils'
import { constants } from '../../../core/constants'
import * as theme from '../../../core/theme'
import { getPropsFromModel } from '../helpers'


class CreateFicheTech extends Component {
    constructor(props) {
        super(props)

        this.VisiteTechId = this.props.navigation.getParam('VisiteTechId', '')
        this.project = this.props.navigation.getParam('project', null)

        //Travaux du projet
        this.workTypes = this.project ? this.project.workTypes : []
        this.clientName = this.project ? this.project.client.fullName : ""

        //Init form model & pdf base64 
        const { model, checklistBase64 } = this.mergeChecklists()
        const { properties, initialState } = getPropsFromModel(model)

        this.model = model
        this.checklistBase64 = checklistBase64
        this.initialState = initialState
        this.initialState.workTypes = this.workTypes
        this.initialState.clientName = this.clientName
        this.initialState.vtDate = moment().format('DD/MM/YYYY')
        this.properties = properties

        this.state = {
            model,
            checklistBase64,
        }
    }

    //Merge checklists models & documents (depending on the given workTypes)
    mergeChecklists() {
        //Helper
        const isInclude = (workType) => { return this.workTypes.includes(workType) }

        let { model } = visiteTechModel()
        let checklistBase64 = [visiteTechBase64]
        let pageIndex = 0
        var params = { pageIndex, clientName: this.clientName }

        //CHECKLISTS
        if (isInclude("PAC AIR/EAU")) {
            params.pageIndex += 1
            model = model.concat(checklistPAEModel(params).model)
            checklistBase64.push(checklistPAEBase64)
        }
        if (isInclude("PAC AIR/AIR (climatisation)")) {
            params.pageIndex += 1
            model = model.concat(checklistPAAModel(params).model)
            checklistBase64.push(checklistPAABase64)
        }
        if (isInclude("BALLON THERMODYNAMIQUE")) {
            params.pageIndex += 1
            model = model.concat(checklistBTModel(params).model)
            checklistBase64.push(checklistBTBase64)
        }
        if (isInclude("BALLON SOLAIRE THERMIQUE")) {
            params.pageIndex += 1
            model = model.concat(checklistBSModel(params).model)
            checklistBase64.push(checklistBSBase64)
        }
        if (isInclude("PHOTOVOLTAÏQUE")) {
            console.log('44444444444')
            params.pageIndex += 1
            model = model.concat(checklistPVModel(params).model)
            checklistBase64.push(checklistPVBase64)
        }

        //ATTACHED FILES
        model = model.concat(vtAttachedFilesModel().model)

        return { model, checklistBase64 }
    }

    render() {

        const { model, checklistBase64 } = this.state

        return (
            <StepsForm
                titleText="Visite technique"
                navigation={this.props.navigation}
                stateProperties={this.properties}
                initialState={this.initialState}
                idPattern={"GS-VT-"}
                DocId={this.VisiteTechId}
                collection={"VisitesTech"}
                pdfType={"VisitesTech"}
                steps={["INFO GÉNÉRALES", "", "CHECKLIST", "", "PHOTOS"]}
                pages={model}
                generatePdf={(formInputs) => generatePdfForm(formInputs, "VisitesTech", { model, checklistBase64 })}
                genButtonTitle="Générer une Visite technique"
                fileName="Visite technique"
                showPagination={true}
            />
        )
    }
}

export default CreateFicheTech

