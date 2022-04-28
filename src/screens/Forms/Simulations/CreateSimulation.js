
import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, Linking, } from 'react-native'
import { faVials } from '@fortawesome/pro-duotone-svg-icons';
import { connect } from 'react-redux';

import StepsForm from '../../../containers/StepsForm'
import { CustomIcon, Button } from '../../../components/index'

import { ficheEEBBase64 } from '../../../assets/files/ficheEEBBase64'

import { ficheEEBModel } from '../../../core/forms/ficheEEB/ficheEEBModel'
import { constants } from '../../../core/constants'
import * as theme from '../../../core/theme'
import { Checkbox } from 'react-native-paper';
import { auth } from '../../../firebase';
import { setAppToast } from '../../../core/redux';

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
    "energySource",
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
    // "disablePhoneContact",
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
    energySource: "",
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
    // disablePhoneContact: true,
    email: "",
    version: 1
}

class CreateSimulation extends Component {
    constructor(props) {
        super(props)
        this.SimulationId = this.props.navigation.getParam('SimulationId', '')

        this.project = this.props.navigation.getParam('project', null)
        this.isGuest = !auth.currentUser

        const nameSir = this.project ? this.project.client.fullName : ""
        initialState.nameSir = nameSir //#task add sex to client collection -> To know if nameSir or nameMiss
        initialState.isProprio = "Oui" //Select by default

        this.welcomeMessage = this.welcomeMessage.bind(this)

        this.state = {
            privacyPolicyAccepted: !this.isGuest,
        }
    }

    //##Welcome 
    welcomeMessage(callBack) {
        const title = "SIMULATION EN LIGNE"
        const message = "Bienvenue sur l’outil de simulation en ligne et de dépôt de dossier d’aide. Les informations que vous renseignez seront utilisées uniquement pour calculer vos montants d’aides et les équipements préconisés. En fin de formulaire, vous aurez la possibilité de nous communiquer vos coordonnées. À tout moment vous pouvez être contacté par un conseiller pour être accompagné dans votre démarche."
        const instructions = [
            "Renseigner vos informations et découvrez votre montant d’aides et les produits/packs que nous vous recommandons",
            "Déposer votre dossier d’aide directement en ligne !",
            "Suivez l’avancement de vos demandes"
        ]
        const { privacyPolicyAccepted } = this.state

        return (
            <View style={styles.welcomeContainer}>

                <View style={styles.welcomeHeader}>
                    <CustomIcon
                        icon={faVials}
                        style={{ alignSelf: "center" }}
                        size={60}
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
                                <View key={index.toString()} style={{ flexDirection: 'row' }}>
                                    <Text style={{ color: theme.colors.primary }}>{count}. </Text>
                                    <Text style={[theme.customFontMSregular.body, { marginBottom: 12 }]}>
                                        {instruction}
                                    </Text>
                                </View>
                            )
                        })
                    }

                    <View style={styles.bottomContainer}>
                        <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginLeft: -10 }}>
                            <Checkbox.Android
                                status={privacyPolicyAccepted ? 'checked' : 'unchecked'}
                                onPress={() => this.setState({ privacyPolicyAccepted: !privacyPolicyAccepted })}
                                color={theme.colors.primary}
                                style={{ backgroundColor: "green", borderWidth: 3, borderColor: "green" }}
                            />
                            <Text style={[theme.customFontMSregular.body, { color: theme.colors.gray_dark, flex: 1, flexWrap: 'wrap' }]} onPress={() => this.setState({ privacyPolicyAccepted: !privacyPolicyAccepted })}>
                                Accepter la conditions de la <Text onPress={() => this.props.navigation.navigate("PrivacyPolicy")} style={[theme.customFontMSregular.body, { color: "blue", textDecorationLine: "underline" }]}>politique de confidentialité des données</Text>
                            </Text>
                        </View>

                        <Button
                            mode="contained"
                            style={{
                                width: constants.ScreenWidth - theme.padding * 2,
                            }}
                            backgroundColor={privacyPolicyAccepted ? theme.colors.primary : theme.colors.gray_medium}
                            onPress={() => {
                                if (!privacyPolicyAccepted) {
                                    const toast = { message: "Veuillez accepter les conditions de confidentialité", type: "error" }
                                    setAppToast(this, toast)
                                    return
                                }
                                callBack()
                            }}>
                            Commencer
                        </Button>
                    </View>

                </View>



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
                collection={"Simulations"}
                pdfType={"Simulations"}
                welcomeMessage={this.welcomeMessage}
                steps={["Votre Foyer", "", "Votre Habitation", "", "Votre Bilan"]}
                pages={ficheEEBModel}
                genButtonTitle="Générer une fiche EEB"
                fileName="Fiche EEB"
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
        paddingTop: theme.padding / 2,
        backgroundColor: "#003250",
        borderBottomWidth: 2,
        borderBottomColor: theme.colors.primary
    },
    welcomeTitle: {
        color: theme.colors.white,
        textAlign: "center",
        letterSpacing: 1,
        marginBottom: 28,
        marginTop: 16
    },
    welcomeInstructionsContainer: {
        flex: 1,
        paddingHorizontal: theme.padding,
        paddingVertical: theme.padding * 2,
    },
    welcomeSeparator: {
        borderColor: theme.colors.gray_light,
        borderWidth: StyleSheet.hairlineWidth,
        marginVertical: 24
    },
    bottomContainer: {
        position: "absolute",
        bottom: 0,
        alignSelf: "center",
        paddingHorizontal: theme.padding
    },
})

const mapStateToProps = (state) => {
    return {
        // role: state.roles.role,
        // network: state.network,
        currentUser: state.currentUser
        //fcmToken: state.fcmtoken
    }
}

export default connect(mapStateToProps)(CreateSimulation)
