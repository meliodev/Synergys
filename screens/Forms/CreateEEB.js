
import React, { Component } from 'react';
import { View, Text, StyleSheet, } from 'react-native'
import { faVials } from '@fortawesome/pro-duotone-svg-icons';

import StepsForm from '../../containers/StepsForm'
import { CustomIcon, Button } from '../../components/index'

import { ficheEEBModel } from '../../core/forms'
import { generateFicheEEB } from '../../core/utils'
import { constants } from '../../core/constants'
import * as theme from '../../core/theme'

const properties = [
    "estimation",
    "colorCat",
    "products",
    "nameSir",
    "nameMiss",
    "proSituationSir",
    "ageSir",
    "proSituationMiss",
    "ageMiss",
    "familySituation",
    "houseOwnership",
    "yearsHousing",
    "taxIncome",
    "familyMembersCount",
    "childrenCount",
    "aidAndSub",
    "aidAndSubWorksType",
    "aidAndSubWorksCost",
    "housingType",
    "landSurface",
    "livingSurface",
    "heatedSurface",
    "yearHomeConstruction",
    "roofType",
    "cadastralRef",
    "livingLevelsCount",
    "roomsCount",
    "ceilingHeight",
    "slopeOrientation",
    "slopeSupport",
    "basementType",
    "wallMaterial",
    "wallThickness",
    "internalWallsIsolation",
    "externalWallsIsolation",
    "floorIsolation",
    "lostAticsIsolation",
    "lostAticsIsolationMaterial",
    "lostAticsIsolationAge",
    "lostAticsIsolationThickness",
    "lostAticsSurface",
    "windowType",
    "glazingType",
    "hotWaterProduction",
    "yearInstallationHotWater",
    "heaters",
    "transmittersTypes",
    "yearInstallationHeaters",
    "idealTemperature",
    "isMaintenanceContract",
    "isElectricityProduction",
    "elecProdType",
    "elecProdInstallYear",
    "energyUsage",
    "yearlyElecCost",
    "roofLength",
    "roofWidth",
    "roofTilt",
    "addressNum",
    "addressStreet",
    "addressCode",
    "addressCity",
    "phone",
    "disablePhoneContact",
    "email",
]

const initialState = {
    //results
    products: [],
    colorCat: "",
    estimation: "",

    //Fields
    nameSir: "",
    nameMiss: "",
    proSituationSir: "",
    ageSir: "",
    proSituationMiss: "",
    ageMiss: "",
    familySituation: "",
    houseOwnership: "",
    yearsHousing: "",
    taxIncome: "",
    familyMembersCount: "",
    childrenCount: "",
    aidAndSub: "",
    aidAndSubWorksType: "",
    aidAndSubWorksCost: "",
    housingType: "",
    landSurface: "",
    livingSurface: "",
    heatedSurface: "",
    yearHomeConstruction: "",
    roofType: "",
    cadastralRef: "",
    livingLevelsCount: "",
    roomsCount: "",
    ceilingHeight: "",
    slopeOrientation: "",
    slopeSupport: "",
    basementType: "",
    wallMaterial: "",
    wallThickness: "",
    internalWallsIsolation: "",
    externalWallsIsolation: "",
    floorIsolation: "",
    lostAticsIsolation: "",
    lostAticsIsolationMaterial: [],
    lostAticsIsolationAge: "",
    lostAticsIsolationThickness: "",
    lostAticsSurface: "",
    windowType: "",
    glazingType: "",
    hotWaterProduction: [],
    yearInstallationHotWater: "",
    heaters: "",
    transmittersTypes: [],
    yearInstallationHeaters: "",
    idealTemperature: "",
    isMaintenanceContract: "",
    isElectricityProduction: "",
    elecProdType: "",
    elecProdInstallYear: "",
    energyUsage: "",
    yearlyElecCost: "",
    roofLength: "",
    roofWidth: "",
    roofTilt: "",
    addressNum: "",
    addressStreet: "",
    addressCode: "",
    addressCity: "",
    phone: "",
    disablePhoneContact: true,
    email: "",
}

class CreateEEB extends Component {
    constructor(props) {
        super(props)
        this.SimulationId = this.props.navigation.getParam('SimulationId', '')

        this.state = {

        }
    }

    //##Welcome 
    welcomeMessage(callBack) {
        const title = "SIMULATION EN LIGNE"
        const message = "Bienvenue sur l’outil de simulation en ligne et de dépôt de dossier d’aide. Les informations que vous renseignez seront utilisées uniquement pour calculer vos montants d’aides et les équipements préconisés. En fin de formulaire, vous aurez la possibilité de transformer votre simulation en dépôt de dossier en ligne. À tout moment vous pouvez être rappelé par un conseiller pour être accompagné dans votre démarche."
        const instructions = [
            "Renseigner vos informations et découvrez votre montant d’aides et les produits que nous vous recommandons",
            "Déposer votre dossier d’aide directement en ligne !",
            "Suivez l’avancement de vos demandes"
        ]
        return (
            <View style={styles.welcomeContainer}>

                <View style={styles.welcomeHeader}>
                    <CustomIcon
                        icon={faVials}
                        style={{ alignSelf: "center" }}
                        size={65}
                        color={theme.colors.white}
                        secondaryColor={theme.colors.primary}
                    />
                    <Text style={[theme.customFontMSmedium.h3, styles.welcomeTitle]}>
                        {title}
                    </Text>
                </View>

                <View style={styles.welcomeInstructionsContainer}>
                    <Text style={[theme.customFontMSregular.body, { opacity: 0.8 }]}>
                        {message}
                    </Text>
                    <View style={styles.welcomeSeparator} />
                    {
                        instructions.map((instruction, index) => {
                            const count = index + 1
                            return (
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ color: theme.colors.primary }}>{count}. </Text>
                                    <Text style={[theme.customFontMSregular.caption, { marginBottom: 12 }]}>
                                        {instruction}
                                    </Text>
                                </View>
                            )
                        })
                    }
                </View>

                <Button
                    mode="contained"
                    style={styles.bottomCenterButton}
                    onPress={callBack}>
                    Commencer
                </Button>

            </View>
        )
    }

    //##Overview
    renderOverview() {
        const form = this.unformatDocument()
        const { readOnly } = this.state
        const { pages } = this.props
        const { colorCat, estimation } = form
        const products = form.products.join(', ')

        const summary = [
            { title: "Couleur", value: colorCat, isColor: true },
            { title: "Produits recommandés", value: products },
            { title: "Estimation", value: `${estimation} €` },
        ]
        const showSummary = colorCat !== "" && products !== [] && estimation > 0

        return (
            <View style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.overviewContainer}>

                    {showSummary &&
                        <View style={{ marginBottom: theme.padding / 2, backgroundColor: theme.colors.white }}>
                            {summary.map((item) => {
                                return (
                                    <View style={styles.overviewRow}>
                                        <Text style={[theme.customFontMSsemibold.caption, styles.overviewText, { opacity: 0.8 }]}>{item.title}</Text>
                                        {item.isColor ?
                                            <View style={styles.overviewText}>
                                                <View style={{ height: 16, width: 16, borderRadius: 8, backgroundColor: item.value }} />
                                            </View>
                                            :
                                            <Text style={[theme.customFontMSbold.caption, styles.overviewText]}>{item.value}</Text>
                                        }
                                    </View>
                                )
                            })}
                        </View>
                    }

                    <View style={{ marginBottom: 16, backgroundColor: 'white' }}>

                        {pages.map((page, index) => {

                            return page.fields.map((field) => {

                                if (typeof (form[field.id]) !== 'undefined' && form[field.id] !== null) {

                                    //String fields
                                    if (typeof (form[field.id]) === "string") {
                                        if (form[field.id] !== "") {
                                            var values = form[field.id]
                                        }
                                    }

                                    //Boolean fields
                                    else if (typeof (form[field.id]) === 'boolean') {
                                        var values = form[field.id] === false ? "Oui" : "Non"
                                    }

                                    //Array fields
                                    else if (form[field.id] !== []) {
                                        var values = ""
                                        var values = form[field.id].join(', ')
                                    }
                                }

                                if (values)
                                    return (
                                        <TouchableOpacity
                                            onPress={() => this.setState({ pageIndex: index, readOnly: false })}
                                            style={styles.overviewRow}>
                                            <Text style={[theme.customFontMSregular.caption, styles.overviewText, { color: theme.colors.gray_dark }]}>{field.label}</Text>
                                            <Text style={[theme.customFontMSregular.caption, styles.overviewText, { color: theme.colors.gray_googleAgenda }]}>{values}</Text>
                                        </TouchableOpacity>
                                    )

                                //Empty fields
                                else return null
                            })

                        })
                        }
                    </View>
                </ScrollView>

                {this.isEdit && readOnly && this.renderBottomCenterButton("Générer une fiche EEB", this.toggleModal)}

            </View>
        )
    }


    render() {
        return (
            <StepsForm
                titleText="Etude et Evaluation des besoins"
                navigation={this.props.navigation}
                stateProperties={properties}
                initialState={initialState}
                idPattern={"GS-EEB-"}
                DocId={this.SimulationId}
                collection={"Eeb"}
                welcomeMessage={this.welcomeMessage}
                steps={["Votre Foyer", "", "Votre Habitation", "", "Votre Bilan"]}
                pages={ficheEEBModel}
                generatePdf={generateFicheEEB}
                renderOverview = {this.props.renderOverview}
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

export default CreateEEB
