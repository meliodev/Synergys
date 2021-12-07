
import { faBuilding, faCheck, faHouse, faTimes, faQuestionCircle, faMars, faVenus } from "@fortawesome/pro-light-svg-icons";
import { rgb } from 'pdf-lib'

import moment from "moment";
import * as theme from './theme'

export const ficheEEBModel = [
    //*********************** STEP1 *************************
    {//0 DONE
        id: "fullName",
        title: "NOM ET PRENOM",
        fields: [
            {
                id: "nameSir",
                type: "textInput",
                label: "Monsieur",
                errorId: "nameSirError",
                pdfConfig: { dx: -520, dy: - 155, pageIndex: 1 }
            },
            {
                id: "nameMiss",
                type: "textInput",
                label: "Madame",
                errorId: "nameMissError",
                pdfConfig: { dx: -235, dy: - 155, pageIndex: 1 }
            },
        ],
        exclusiveMendatory: true,
        stepIndex: 0,
    },
    {//1 DONE
        id: "proSituation",
        title: "SITUATION",
        fields: [
            {
                id: "proSituationSir",
                type: "picker",
                items: [
                    { label: "Choisir", value: "", pdfConfig: { skip: true } },
                    { label: "Salarié privé", value: "Salarié privé" },
                    { label: "Salarié public", value: "Salarié public" },
                    { label: "Retraité", value: "Retraité" },
                    { label: "Sans emploi", value: "Sans emploi" },
                    { label: "Invalidité", value: "Invalidité" },
                    { label: "Profession libérale", value: "Profession libérale" },
                    { label: "Chef d'entreprise", value: "Chef d'entreprise" },
                    { label: "Autre", value: "Autre" },
                ],
                label: "Situation professionnelle Mr",
                mendatory: true,
                errorId: "proSituationSirError",
                isConditional: true,
                condition: { with: "nameSir" },
                pdfConfig: { dx: -450, dy: - 305, pageIndex: 1 }
            },
            {
                id: "ageSir",
                type: "textInput",
                isNumeric: true,
                label: "Age Mr",
                errorId: "ageSirError",
                mendatory: true,
                isConditional: true,
                condition: { with: "nameSir" },
                pdfConfig: { dx: -510, dy: - 330, pageIndex: 1 }
            },
            {
                id: "proSituationMiss",
                type: "picker",
                items: [
                    { label: "Choisir", value: "", pdfConfig: { skip: true } },
                    { label: "Salarié privé", value: "Salarié privé" },
                    { label: "Salarié public", value: "Salarié public" },
                    { label: "Retraité", value: "Retraité" },
                    { label: "Sans emploi", value: "Sans emploi" },
                    { label: "Invalidité", value: "Invalidité" },
                    { label: "Profession libérale", value: "Profession libérale" },
                    { label: "Chef d'entreprise", value: "Chef d'entreprise" },
                    { label: "Autre", value: "Autre" },
                ],
                label: "Situation professionnelle Mme",
                errorId: "proSituationMissError",
                mendatory: true,
                isConditional: true,
                condition: { with: "nameMiss" },
                pdfConfig: { dx: -150, dy: - 305, pageIndex: 1 }
            },
            {
                id: "ageMiss",
                type: "textInput",
                isNumeric: true,
                label: "Age Mme",
                errorId: "ageMissError",
                mendatory: true,
                isConditional: true,
                condition: { with: "nameMiss" },
                pdfConfig: { dx: -225, dy: - 330, pageIndex: 1 }
            },
        ]
    },
    { //2 DONE
        id: "familySituation",
        title: "SITUATION",
        fields: [
            {
                id: "familySituation",
                label: "Situation de famille",
                type: "options",
                items: [
                    { label: 'Célibataire', value: 'Célibataire', icon: faQuestionCircle, pdfConfig: { dx: -473, dy: - 350, pageIndex: 1 } },
                    { label: 'Marié', value: 'Marié', icon: faQuestionCircle, pdfConfig: { dx: -395, dy: - 350, pageIndex: 1 } },
                    { label: 'Pacsé', value: 'Pacsé', icon: faQuestionCircle, pdfConfig: { dx: -339, dy: - 350, pageIndex: 1 } },
                    { label: 'Concubinage', value: 'Concubinage', icon: faQuestionCircle, pdfConfig: { dx: -282, dy: - 350, pageIndex: 1 } },
                    { label: 'Divorcé', value: 'Divorcé', icon: faQuestionCircle, pdfConfig: { dx: -204, dy: - 350, pageIndex: 1 } },
                    { label: 'Veuve', value: 'Veuve', icon: faQuestionCircle, pdfConfig: { dx: -140, dy: - 350, pageIndex: 1 } }
                ],
            }
        ]
    },
    { //3 DONE
        id: "houseOwnership",
        title: "SITUATION",
        fields: [
            {
                id: "houseOwnership",
                label: "Propriétaire ou locataire",
                type: "options",
                items: [
                    { label: 'Propriétaire', value: 'Propriétaire', icon: faQuestionCircle, pdfConfig: { dx: -445, dy: - 387, pageIndex: 1 } },
                    { label: 'Locataire', value: 'Locataire', icon: faQuestionCircle, pdfConfig: { dx: -523, dy: - 387, pageIndex: 1 } },
                ],
                errorId: "houseOwnershipError",
                mendatory: true,
            }
        ]
    },
    { //4
        id: "yearsHousing",
        title: "SITUATION",
        fields: [
            {
                id: "yearsHousing",
                label: "Depuis combien de temps habitez-vous ici ?",
                type: "number",
                errorId: "yearsHousingError",
                pdfConfig: { dx: -220, dy: - 386, pageIndex: 1 }
            }
        ]
    },
    { //5 DONE
        id: "taxIncome",
        title: "SITUATION",
        fields: [
            {
                id: "taxIncome",
                type: "textInput",
                isNumeric: true,
                label: "Revenu fiscal de référence en € du foyer",
                errorId: "taxIncomeError",
                mendatory: true,
                pdfConfig: { dx: -447, dy: - 405, pageIndex: 1 },
                instruction: { priority: "high", message: "Cumulez les revenus fiscaux de tous les occupants du foyer" }
            },
        ]
    },
    { //6 DONE
        id: "demographicSituation",
        title: "SITUATION",
        fields: [
            {
                id: "familyMembersCount",
                type: "textInput",
                isNumeric: true,
                label: "Nombre d'occupants dans le foyer",
                errorId: "familyMembersCountError",
                mendatory: true,
                pdfConfig: { dx: -425, dy: - 443, pageIndex: 1 }
            },
            {
                id: "childrenCount",
                type: "textInput",
                isNumeric: true,
                label: "Nombre d'enfants à charge (-18 ans)",
                errorId: "childrenCountError",
                mendatory: true,
                pdfConfig: { dx: -150, dy: - 443, pageIndex: 1 }

            },
        ]
    },
    { //7
        id: "aidAndSub",
        title: "AIDES ET SUVENTIONS",
        fields: [
            {
                id: "aidAndSub",
                label: "Avez-vous bénéficié d'aides ou subventions dans les 5 dernières années ?",
                type: "options",
                items: [
                    { label: 'Non', value: 'Non', icon: faTimes, iconColor: theme.colors.error, pdfConfig: { dx: -190, dy: - 484, pageIndex: 1 }, rollBack: { fields: [{ id: "aidAndSubWorksType", type: "string" }, { id: "aidAndSubWorksCost", type: "string" }] } },
                    { label: 'Oui', value: 'Oui', icon: faCheck, iconColor: "green", pdfConfig: { dx: -247, dy: - 484, pageIndex: 1 } },
                ],
                errorId: "aidAndSubError",
                mendatory: true
            },
            {
                id: "aidAndSubWorksType",
                type: "picker",
                items: [
                    { label: "Choisir", value: "", pdfConfig: { skip: true } },
                    { label: "Chauffage", value: "Chauffage" },
                    { label: "Eau chaude", value: "Eau chaude" },
                    { label: "Isolation", value: "Isolation" },
                    { label: "Autre", value: "Autre" },
                ],
                label: "Nature des travaux",
                errorId: "aidAndSubWorksTypeError",
                style: { marginTop: 32 },
                isConditional: true,
                condition: { with: "aidAndSub", values: ["Oui"] },
                pdfConfig: { dx: -490, dy: - 502, pageIndex: 1 }
            },
            {
                id: "aidAndSubWorksCost",
                type: "textInput",
                isNumeric: true,
                label: "Montant total des travaux",
                errorId: "aidAndSubWorksCostError",
                style: { marginTop: 32 },
                mendatory: true,
                isConditional: true,
                condition: { with: "aidAndSub", values: ["Oui"] },
                pdfConfig: { dx: -130, dy: - 502, pageIndex: 1 }
            },
        ],
        isLast: true,
    },
    //********************  STEP 2 *********************************************
    { //8 DONE
        id: "housingType",
        title: "HABITATION",
        fields: [
            {
                id: "housingType",
                label: "Type d'habitation",
                type: "options",
                items: [
                    { label: 'Maison individuelle', value: 'Maison individuelle', icon: faHouse, pdfConfig: { dx: -466, dy: - 597, pageIndex: 1 } },
                    { label: 'Appartement', value: 'Appartement', icon: faBuilding, pdfConfig: { dx: -325, dy: - 597, pageIndex: 1 } },
                ],
                errorId: "housingTypeError",
                mendatory: true
            }
        ],
        isFirst: true,
        stepIndex: 1,
    },
    { //9 DONE
        id: "surfaces",
        title: "HABITATION",
        fields: [
            // {
            //     id: "landSurface",
            //     type: "textInput",
            //     isNumeric: true,
            //     label: "Surface du terrain en m²",
            //     errorId: "landSurfaceError",
            //     mendatory: true,
            //     pdfConfig: { dx: -490, dy: - 615, pageIndex: 1 }
            // },
            {
                id: "livingSurface",
                type: "textInput",
                isNumeric: true,
                label: "Surface habitable en m²",
                errorId: "livingSurfaceError",
                mendatory: true,
                pdfConfig: { dx: -332, dy: - 615, pageIndex: 1 }
            },
            {
                id: "heatedSurface",
                type: "textInput",
                isNumeric: true,
                label: "Surface à chauffer en m²",
                errorId: "heatedSurfaceError",
                mendatory: true,
                pdfConfig: { dx: -330, dy: - 633, pageIndex: 1 }
            },
        ]
    },
    { //10 DONE
        id: "yearHomeConstruction",
        title: "HABITATION",
        fields: [
            {
                id: "yearHomeConstruction",
                label: "Année de construction de l'habitation",
                type: "number",
                errorId: "yearHomeConstructionError",
                pdfConfig: { dx: -70, dy: - 615, pageIndex: 1 }
            }
        ]
    },
    { //11
        id: "roofType",
        title: "HABITATION",
        fields: [
            {
                id: "roofType",
                label: "Type de toit",
                type: "options",
                items: [
                    { label: 'Toit-terasse', value: 'Toit-terasse', icon: faQuestionCircle, pdfConfig: { dx: -509, dy: - 671, pageIndex: 1 } },
                    { label: 'Combles aménagés', value: 'Combles aménagés', icon: faQuestionCircle, pdfConfig: { dx: -417, dy: - 671, pageIndex: 1 } },
                    { label: 'Combles perdus', value: 'Combles perdus', icon: faQuestionCircle, pdfConfig: { dx: -296, dy: - 671, pageIndex: 1 } },
                    { label: 'Terasses+Combles', value: 'Terasses+Combles', icon: faQuestionCircle, pdfConfig: { dx: -190, dy: - 671, pageIndex: 1 } },
                ],
                errorId: "roofTypeError",
                mendatory: true
            }
        ]
    },
    // {//12
    //     id: "cadastralRef",
    //     title: "HABITATION",
    //     fields: [
    //         {
    //             id: "cadastralRef",
    //             type: "textInput",
    //             label: "Référence cadastrale",
    //             errorId: "cadastralRefError",
    //             pdfConfig: { dx: -475, dy: - 700, pageIndex: 1 }
    //         },
    //     ]
    // },
    { //13
        id: "livingLevelsCount",
        title: "HABITATION",
        fields: [
            {
                id: "livingLevelsCount",
                label: "Nombre de niveaux habitables",
                type: "options",
                items: [
                    { label: 'RDC', value: 'RDC', icon: faQuestionCircle, pdfConfig: { dx: -409, dy: - 720, pageIndex: 1 } },
                    { label: 'R+1', value: 'R+1', icon: faQuestionCircle, pdfConfig: { dx: -374, dy: - 720, pageIndex: 1 } },
                    { label: 'R+2', value: 'R+2', icon: faQuestionCircle, pdfConfig: { dx: -339, dy: - 720, pageIndex: 1 } },
                    { label: 'R+3', value: 'R+3', icon: faQuestionCircle, pdfConfig: { dx: -303, dy: - 720, pageIndex: 1 } },
                ],
                errorId: "livingLevelsCountError",
                mendatory: true
            }
        ]
    },
    { //14
        id: "roomsCount",
        title: "HABITATION",
        fields: [
            {
                id: "roomsCount",
                label: "Nombres de pièces à vivre",
                type: "number",
                errorId: "roomsCountError",
                mendatory: true,
                pdfConfig: { dx: -120, dy: - 720, pageIndex: 1 }
            }
        ]
    },
    { //15
        id: "ceilingHeight",
        title: "HABITATION",
        fields: [
            {
                id: "ceilingHeight",
                type: "textInput",
                isNumeric: true,
                label: "Hauteur sous-plafond en cm",
                errorId: "ceilingHeightError",
                mendatory: true,
                pdfConfig: { dx: -475, dy: - 737, pageIndex: 1 }
            },
        ]
    },
    { //17
        id: "basementType",
        title: "HABITATION",
        fields: [
            {
                id: "basementType",
                label: "Type de sous-sol",
                type: "options",
                items: [
                    { label: 'Cave', value: 'Cave', icon: faQuestionCircle, pdfConfig: { dx: -452, dy: - 795, pageIndex: 1 } },
                    { label: 'Terre-plein', value: 'Terre-plein', icon: faQuestionCircle, pdfConfig: { dx: -381, dy: - 795, pageIndex: 1 } },
                    { label: 'Vide sanitaire', value: 'Vide sanitaire', icon: faQuestionCircle, pdfConfig: { dx: -303, dy: - 795, pageIndex: 1 } },
                    { label: 'Aucun', value: 'Aucun', icon: faQuestionCircle, pdfConfig: { dx: -225, dy: - 795, pageIndex: 1 } },
                ],
                errorId: "basementTypeError",
                mendatory: true
            }
        ],
        isLast: true,
    },
    //***************************** STEP 3 ************************
    { //18
        id: "wallMaterial",
        title: "VOTRE BILAN ENERGETIQUE",
        fields: [
            {
                id: "wallMaterial",
                label: "Matériaux de construction des murs",
                type: "options",
                items: [
                    { label: 'Pierre', value: 'Pierre', icon: faQuestionCircle, pdfConfig: { dx: -396, dy: - 104, pageIndex: 0 } },
                    { label: 'Béton', value: 'Béton', icon: faQuestionCircle, pdfConfig: { dx: -319, dy: - 104, pageIndex: 0 } },
                    { label: 'Béton celullaire', value: 'Béton celullaire', icon: faQuestionCircle, pdfConfig: { dx: -240, dy: - 104, pageIndex: 0 } },
                    { label: 'Brique', value: 'Brique', icon: faQuestionCircle, pdfConfig: { dx: -396, dy: - 117, pageIndex: 0 } },
                    { label: 'Bois', value: 'Bois', icon: faQuestionCircle, pdfConfig: { dx: -319, dy: - 117, pageIndex: 0 } },
                    { label: 'Autre', value: 'Autre', icon: faQuestionCircle, pdfConfig: { dx: -240, dy: - 117, pageIndex: 0 } },
                ],
                errorId: "wallMaterialError",
                mendatory: true
            }
        ],
        isFirst: true,
        stepIndex: 2,
    },
    { //19
        id: "wallThickness",
        title: "VOTRE BILAN ENERGETIQUE",
        fields: [
            {
                id: "wallThickness",
                type: "textInput",
                isNumeric: true,
                label: "Epaisseur des murs en cm",
                errorId: "wallThicknessError",
                pdfConfig: { dx: -485, dy: - 135, pageIndex: 0 }
            },
        ]
    },
    { //20
        id: "internalWallsIsolation",
        title: "VOTRE BILAN ENERGETIQUE",
        fields: [
            {
                id: "internalWallsIsolation",
                label: "Isolation des murs interieurs",
                type: "options",
                items: [
                    { label: 'Non', value: 'Non', icon: faTimes, iconColor: theme.colors.error, pdfConfig: { dx: -318, dy: - 154, pageIndex: 0 } },
                    { label: 'Oui', value: 'Oui', icon: faCheck, iconColor: "green", pdfConfig: { dx: -396, dy: - 154, pageIndex: 0 } },
                ],
                errorId: "internalWallsIsolationError",
                mendatory: true
            }
        ],
    },
    { //21
        id: "externalWallsIsolation",
        title: "VOTRE BILAN ENERGETIQUE",
        fields: [
            {
                id: "externalWallsIsolation",
                label: "Isolation des murs exterieurs",
                type: "options",
                items: [
                    { label: 'Non', value: 'Non', icon: faTimes, iconColor: theme.colors.error, pdfConfig: { dx: -318, dy: - 172, pageIndex: 0 } },
                    { label: 'Oui', value: 'Oui', icon: faCheck, iconColor: "green", pdfConfig: { dx: -396, dy: - 172, pageIndex: 0 } },
                ],
                errorId: "externalWallsIsolationError",
                mendatory: true
            }
        ],
    },
    { //22
        id: "floorIsolation",
        title: "VOTRE BILAN ENERGETIQUE",
        fields: [
            {
                id: "floorIsolation",
                label: "Isolation du sol",
                type: "options",
                items: [
                    { label: 'Non', value: 'Non', icon: faTimes, iconColor: theme.colors.error, pdfConfig: { dx: -318, dy: - 191, pageIndex: 0 } },
                    { label: 'Oui', value: 'Oui', icon: faCheck, iconColor: "green", pdfConfig: { dx: -396, dy: - 191, pageIndex: 0 } },
                ],
                errorId: "floorIsolationError",
                mendatory: true
            }
        ],
    },
    { //22
        id: "lostAticsIsolation",
        title: "VOTRE BILAN ENERGETIQUE",
        fields: [
            {
                id: "lostAticsIsolation",
                label: "Isolation des combles perdus",
                type: "options",
                items: [
                    {
                        label: 'Non', value: 'Non', icon: faTimes, iconColor: theme.colors.error, pdfConfig: { dx: -318, dy: - 209, pageIndex: 0 },
                        rollBack: {
                            fields: [
                                { id: "lostAticsIsolationMaterial", type: "array" },
                                { id: "lostAticsIsolationAge", type: "string" },
                                { id: "lostAticsIsolationThickness", type: "string" },
                                { id: "lostAticsSurface", type: "string" }
                            ]
                        }
                    },
                    { label: 'Oui', value: 'Oui', icon: faCheck, iconColor: "green", pdfConfig: { dx: -396, dy: - 209, pageIndex: 0 } },
                ],
                errorId: "lostAticsIsolationError",
                mendatory: true
            },
            {
                id: "lostAticsIsolationMaterial",
                label: "Matériaux des combles perdus",
                type: "options",
                isMultiOptions: true,
                items: [
                    { label: 'Laine de verre', value: 'Laine de verre', icon: faQuestionCircle, pdfConfig: { dx: -507, dy: - 228, pageIndex: 0 } },
                    { label: 'Laine de roche', value: 'Laine de roche', icon: faQuestionCircle, pdfConfig: { dx: -396, dy: - 228, pageIndex: 0 } },
                    { label: 'Autre', value: 'Autre', icon: faQuestionCircle, pdfConfig: { dx: -278, dy: - 228, pageIndex: 0 } }, //#task scroll to error offset_y
                ],
                style: { marginTop: 100 },
                isConditional: true,
                condition: { with: "lostAticsIsolation", values: ["Oui"] }
            },
            {
                id: "lostAticsIsolationAge",
                label: "Age de l'isolation",
                type: "number",
                errorId: "lostAticsIsolationAgeError",
                mendatory: true,
                isConditional: true,
                condition: { with: "lostAticsIsolation", values: ["Oui"] },
                pdfConfig: { dx: -495, dy: - 263, pageIndex: 0 }
            },
            {
                id: "lostAticsIsolationThickness",
                label: "Epaisseur",
                type: "number",
                isConditional: true,
                condition: { with: "lostAticsIsolation", values: ["Oui"] },
                pdfConfig: { dx: -523, dy: - 247, pageIndex: 0 }
            },
            {
                id: "lostAticsSurface",
                label: "Surface des combles",
                type: "number",
                mendatory: true,
                errorId: "lostAticsSurfaceError",
                isConditional: true,
                condition: { with: "lostAticsIsolation", values: ["Oui"] },
                pdfConfig: { dx: -240, dy: - 263, pageIndex: 0 }
            }
        ],
    },
    { //23
        id: "windowType",
        title: "MENUISERIE",
        fields: [
            {
                id: "windowType",
                label: "Type de fenêtre",
                type: "options",
                items: [
                    { label: 'PVC', value: 'PVC', icon: faQuestionCircle, pdfConfig: { dx: -396, dy: - 328, pageIndex: 0 } },
                    { label: 'Bois', value: 'Bois', icon: faQuestionCircle, pdfConfig: { dx: -318, dy: - 328, pageIndex: 0 } },
                    { label: 'Alu', value: 'Alu', icon: faQuestionCircle, pdfConfig: { dx: -240, dy: - 328, pageIndex: 0 } },
                ],
                errorId: "windowTypeError",
                mendatory: true
            }
        ],
    },
    { //24
        id: "glazingType",
        title: "MENUISERIE",
        fields: [
            {
                id: "glazingType",
                label: "Type de vitrage",
                type: "options",
                items: [
                    { label: 'Simple', value: 'Simple', icon: faQuestionCircle, pdfConfig: { dx: -396, dy: - 347, pageIndex: 0 } },
                    { label: 'Double', value: 'Double', icon: faQuestionCircle, pdfConfig: { dx: -318, dy: - 347, pageIndex: 0 } },
                    { label: 'Triple', value: 'Triple', icon: faQuestionCircle, pdfConfig: { dx: -240, dy: - 347, pageIndex: 0 } },
                ],
                errorId: "glazingTypeError",
                mendatory: true
            }
        ]
    },
    { //25
        id: "hotWaterProduction",
        title: "EAU CHAUDE SANITAIRE",
        fields: [
            {
                id: "hotWaterProduction",
                label: "Production d'eau chaude sanitaire",
                type: "options",
                isMultiOptions: true,
                items: [
                    { label: 'Chaudière', value: 'Chaudière', icon: faQuestionCircle, pdfConfig: { dx: -396, dy: - 416, pageIndex: 0 } },
                    { label: 'Cumulus électrique', value: 'Cumulus électrique', icon: faQuestionCircle, pdfConfig: { dx: -304, dy: - 416, pageIndex: 0 } },
                    { label: 'Chauffe-eau solaire', value: 'Chauffe-eau solaire', icon: faQuestionCircle, pdfConfig: { dx: -190, dy: - 416, pageIndex: 0 } },
                    { label: 'Pompe à chaleur', value: 'Pompe à chaleur', icon: faQuestionCircle, pdfConfig: { dx: -396, dy: - 435, pageIndex: 0 } },
                    { label: 'Thermodynamique', value: 'Thermodynamique', icon: faQuestionCircle, pdfConfig: { dx: -304, dy: - 435, pageIndex: 0 } },
                ],
            }
        ],
    },
    { //26
        id: "yearInstallationHotWater",
        title: "EAU CHAUDE SANITAIRE",
        fields: [
            {
                id: "yearInstallationHotWater",
                label: "Année d'installation du dernier équipement",
                type: "number",
                pdfConfig: { dx: -90, dy: - 434, pageIndex: 0 }
            }
        ]
    },
    {//27 TODO
        id: "heaters",
        title: "CHAUFFAGE",
        fields: [
            {
                id: "heaters",
                type: "picker",
                items: [ //Radiateur, Chaudière, Poèle, Insert/cheminée, Pompe à chaleur
                    { label: "Selectionner un type", value: "", pdfConfig: { skip: true } },
                    { label: "Radiateur", value: "Radiateur", pdfConfig: { dx: -453, dy: - 499, pageIndex: 0 } },
                    { label: "Chaudière", value: "Chaudière", pdfConfig: { dx: -375, dy: - 499, pageIndex: 0 } },
                    { label: "Insert/cheminée", value: "Insert/cheminée", pdfConfig: { dx: -311, dy: - 499, pageIndex: 0 } },
                    { label: "Pompe à chaleur", value: "Pompe à chaleur", pdfConfig: { dx: -240, dy: - 499, pageIndex: 0 } },
                    { label: "Poèle", value: "Poèle", pdfConfig: { dx: -375, dy: - 517, pageIndex: 0 } },
                ],
                label: "Types de chauffage",
                mendatory: true,
                errorId: "heatersError",
                style: { marginBottom: 32 },
                rollBack: { fields: [{ id: "transmittersTypes", type: "array" }] }
            },
            {
                id: "energySource",
                type: "picker",
                items: [
                    { label: "Selectionner un type", value: "", pdfConfig: { skip: true } },
                    { label: "Electrique", value: "Electrique", pdfConfig: { dx: -453, dy: - 499, pageIndex: 0 } },
                    { label: "Gaz", value: "Gaz", pdfConfig: { dx: -375, dy: - 499, pageIndex: 0 } },
                    { label: "Fioul", value: "Fioul", pdfConfig: { dx: -311, dy: - 499, pageIndex: 0 } },
                    { label: "Bois", value: "Bois", pdfConfig: { dx: -311, dy: - 517, pageIndex: 0 } },
                    { label: "Autre", value: "Autre", pdfConfig: { dx: -240, dy: - 517, pageIndex: 0 } },
                ],
                label: "Source d'énergie",
                mendatory: true,
                errorId: "energySourceError",
                style: { marginBottom: 32 },
                rollBack: { fields: [{ id: "transmittersTypes", type: "array" }] }
            },
            {
                id: "transmittersTypes",
                label: "Types d'émetteurs",
                type: "options",
                isMultiOptions: true,
                items: [
                    { label: 'Radiateurs électriques', value: 'Radiateurs électriques', icon: faQuestionCircle, isConditional: true, condition: { with: "energySource", values: ["Electrique", "Poèle", "Autre"] }, pdfConfig: { dx: -453, dy: - 536, pageIndex: 0 } },
                    { label: 'Clim réversible', value: 'Clim réversible', icon: faQuestionCircle, isConditional: true, condition: { with: "energySource", values: ["Electrique", "Poèle", "Autre"] }, pdfConfig: { dx: -311, dy: - 554, pageIndex: 0 } },
                    { label: 'Radiateur inertie', value: 'Radiateur inertie', icon: faQuestionCircle, isConditional: true, condition: { with: "energySource", values: ["Electrique"] }, pdfConfig: { dx: -265, dy: - 536, pageIndex: 0 } },
                    { label: 'Radiateur fonte', value: 'Radiateur fonte', icon: faQuestionCircle, isConditional: true, condition: { with: "energySource", values: ["Gaz", "Fioul", "Bois", "Pompe à chaleur", "Chaudière"] }, pdfConfig: { dx: -265, dy: - 536, pageIndex: 0 } },
                    { label: 'Radiateur alu', value: 'Radiateur alu', icon: faQuestionCircle, isConditional: true, condition: { with: "energySource", values: ["Gaz", "Fioul", "Bois", "Pompe à chaleur", "Chaudière"] }, pdfConfig: { dx: -230, dy: - 536, pageIndex: 0 } },
                    { label: 'Radiateur acier', value: 'Radiateur acier', icon: faQuestionCircle, isConditional: true, condition: { with: "energySource", values: ["Gaz", "Fioul", "Bois", "Pompe à chaleur", "Chaudière"] }, pdfConfig: { dx: -205, dy: - 536, pageIndex: 0 } },
                    { label: 'Chauffage au sol', value: 'Chauffage au sol', icon: faQuestionCircle, isConditional: true, condition: { with: "energySource", values: ["Gaz", "Fioul", "Bois", "Pompe à chaleur", "Chaudière"] }, pdfConfig: { dx: -155, dy: - 536, pageIndex: 0 } },
                    { label: 'Convecteur', value: 'Convecteur', icon: faQuestionCircle, isConditional: true, condition: { with: "energySource", values: ["Poèle", "Autre"] }, pdfConfig: { dx: -453, dy: - 554, pageIndex: 0 } },
                    { label: 'Autre', value: 'Autre', icon: faQuestionCircle, isConditional: true, condition: { with: "energySource", values: ["Poèle", "Gaz", "Fioul", "Bois", "Autre"] }, pdfConfig: { dx: -155, dy: - 554, pageIndex: 0 } },
                ],
            }
        ]
    },
    { //28
        id: "yearInstallationHeaters",
        title: "CHAUFFAGE",
        fields: [
            {
                id: "yearInstallationHeaters",
                label: "Année d'installation du dernier équipement",
                type: "number",
                pdfConfig: { dx: -485, dy: - 573, pageIndex: 0 }
            }
        ]
    },
    { //29
        id: "idealTemperature",
        title: "CHAUFFAGE",
        fields: [
            {
                id: "idealTemperature",
                label: "Quelle est votre température idéale de confort ?",
                type: "number",
                pdfConfig: { dx: -227, dy: - 573, pageIndex: 0 }
            }
        ]
    },
    { //30
        id: "isMaintenanceContract",
        title: "CHAUFFAGE",
        fields: [
            {
                id: "isMaintenanceContract",
                label: "Contrat de maintenance",
                type: "options",
                items: [
                    { label: 'Non', value: 'Non', icon: faTimes, iconColor: theme.colors.error, pdfConfig: { dx: -403, dy: - 592, pageIndex: 0 } },
                    { label: 'Oui', value: 'Oui', icon: faCheck, iconColor: "green", pdfConfig: { dx: -453, dy: - 592, pageIndex: 0 } },
                ],
                errorId: "isMaintenanceContractError",
                mendatory: true,
            }
        ],
    },
    { //31
        id: "isElectricityProduction",
        title: "PRODUCTION D'ENERGIE",
        fields: [
            {
                id: "isElectricityProduction",
                label: "Produisez-vous déjà de l'électricité par une source d'énergie renouvelable ?",
                type: "options",
                items: [
                    {
                        label: 'Non',
                        value: 'Non',
                        icon: faTimes,
                        iconColor: theme.colors.error,
                        pdfConfig: { skip: true },
                        rollBack: {
                            fields: [
                                { id: "elecProdType", type: "string" },
                                { id: "elecProdInstallYear", type: "string" },
                                { id: "energyUsage", type: "string" }
                            ]
                        }
                    },
                    {
                        label: 'Oui',
                        value: 'Oui',
                        icon: faCheck,
                        iconColor: "green",
                        pdfConfig: { skip: true }
                    },
                ],
                errorId: "isElectricityProductionError",
                mendatory: true,
            },
        ],
    },
    { //32
        id: "elecProdDetails",
        title: "PRODUCTION D'ENERGIE",
        fields: [
            {
                id: "elecProdType",
                label: "Type de production",
                type: "options",
                items: [
                    { label: 'Photovoltaïque', value: 'Photovoltaïque', icon: faQuestionCircle, pdfConfig: { dx: -453, dy: - 661, pageIndex: 0 } },
                    { label: 'Eolienne', value: 'Eolienne', icon: faQuestionCircle, pdfConfig: { dx: -325, dy: - 661, pageIndex: 0 } },
                ],
                mendatory: true,
                errorId: "elecProdTypeError",
                isConditional: true,
                condition: { with: "isElectricityProduction", values: ["Oui"] }
            },
            {
                id: "elecProdInstallYear",
                label: "Année d'installation du dernier équipement",
                type: "number",
                mendatory: true,
                errorId: "elecProdInstallYearError",
                isConditional: true,
                condition: { with: "isElectricityProduction", values: ["Oui"] },
                style: { marginTop: 50 },
                pdfConfig: { dx: -53, dy: - 661, pageIndex: 0 }
            }
        ],
    },
    { //31
        id: "elecProdDetails",
        title: "PRODUCTION D'ENERGIE",
        fields: [
            {
                id: "energyUsage",
                label: "Revente ou autoconsommation ?",
                type: "options",
                items: [
                    { label: 'Revente', value: 'Revente', icon: faQuestionCircle, pdfConfig: { dx: -325, dy: - 680, pageIndex: 0 } },
                    { label: 'Autoconsommation', value: 'Autoconsommation', icon: faQuestionCircle, pdfConfig: { dx: -259, dy: - 680, pageIndex: 0 } },
                ],
                errorId: "energyUsageError",
                mendatory: true,
                isConditional: true,
                condition: { with: "elecProdType", values: ["Photovoltaïque"] }
            },
        ],
    },
    {//33
        id: "yearlyElecCost",
        title: "PRODUCTION D'ENERGIE",
        fields: [
            {
                id: "yearlyElecCost",
                type: "textInput",
                label: "Dépense annuelle en électricité en €",
                isNumeric: true,
                errorId: "yearlyElecCostError",
                mendatory: true,
                pdfConfig: { skip: true }
                // pdfConfig: { dx: -53, dy: - 650, pageIndex: 0 }
            },
        ],
    },
    { //34
        id: "roof",
        title: "TOITURE",
        fields: [
            {
                id: "slopeOrientation",
                label: "Orientation de la toiture",
                type: "options",
                items: [
                    { label: 'Est', value: 'Est', icon: faQuestionCircle, pdfConfig: { dx: -381, dy: - 757, pageIndex: 1 } },
                    { label: 'Sud-Est/Sud-Ouest', value: 'Sud-Est/Sud-Ouest', icon: faQuestionCircle, pdfConfig: { dx: -303, dy: - 757, pageIndex: 1 } },
                    { label: 'Sud', value: 'Sud', icon: faQuestionCircle, pdfConfig: { dx: -169, dy: - 757, pageIndex: 1 } },
                    { label: 'Ouest', value: 'Ouest', icon: faQuestionCircle, pdfConfig: { dx: -119, dy: - 757, pageIndex: 1 } },
                ],
                errorId: "slopeOrientationError",
                mendatory: true,
            },
        ]
    },
    { //34
        id: "roof",
        title: "TOITURE",
        fields: [
            {
                id: "slopeSupport",
                label: "Support de la pente",
                type: "options",
                items: [
                    { label: 'Terrain', value: 'Terrain', icon: faQuestionCircle, pdfConfig: { dx: -452, dy: - 776, pageIndex: 1 } },
                    { label: 'Garrage', value: 'Garrage', icon: faQuestionCircle, pdfConfig: { dx: -381, dy: - 776, pageIndex: 1 } },
                    { label: 'Toitutre', value: 'Toitutre', icon: faQuestionCircle, pdfConfig: { dx: -303, dy: - 776, pageIndex: 1 } },
                    { label: 'Autre', value: 'Autre', icon: faQuestionCircle, pdfConfig: { dx: -225, dy: - 776, pageIndex: 1 } },
                ],
                errorId: "slopeSupportError",
                mendatory: true
            },
        ]
    },
    { //34
        id: "roof",
        title: "TOITURE",
        fields: [
            {
                id: "roofLength",
                label: "Longeur Utile",
                type: "number",
                placeholder: "Exemple: 10m",
                pdfConfig: { dx: -305, dy: - 794, pageIndex: 0 }
            },
            {
                id: "roofWidth",
                label: "Largeur Utile",
                type: "number",
                placeholder: "Exemple: 5m",
                style: { marginTop: 20 },
                pdfConfig: { dx: -515, dy: - 794, pageIndex: 0 }
            },
            {
                id: "roofTilt",
                label: "Inclinaison",
                type: "number",
                placeholder: "Exemple: 10°C",
                style: { marginTop: 20 },
                pdfConfig: { dx: -150, dy: - 794, pageIndex: 0 }
            },
        ],
        isLast: true
    },
    // {//35
    //     id: "generalData",
    //     title: "ADRESSE",
    //     fields: [
    //         {
    //             id: "addressNum",
    //             type: "textInput",
    //             label: "Numéro",
    //             isNumeric: true,
    //             errorId: "addressNumError",
    //             mendatory: true,
    //             pdfConfig: { dx: -556, dy: - 194, pageIndex: 1 }
    //         },
    //         {
    //             id: "addressStreet",
    //             type: "textInput",
    //             label: "Rue",
    //             errorId: "addressStreetError",
    //             mendatory: true,
    //             pdfConfig: { dx: -468, dy: - 194, pageIndex: 1 }
    //         },
    //         {
    //             id: "addressCode",
    //             type: "textInput",
    //             mask: "[0][0][0][0][0]",
    //             label: "Code Postal",
    //             isNumeric: true,
    //             errorId: "addressCodeError",
    //             mendatory: true,
    //             pdfConfig: { dx: -518, dy: - 218, pageIndex: 1, spaces: { afterEach: 1, str: '      ' } }
    //         },
    //         {
    //             id: "addressCity",
    //             type: "textInput",
    //             label: "Ville",
    //             errorId: "addressCityError",
    //             mendatory: true,
    //             pdfConfig: { dx: -349, dy: - 218, pageIndex: 1 }
    //         },
    //     ]
    // },
    // {//36
    //     id: "generalData",
    //     title: "RENSEIGNEMENTS GENERAUX",
    //     fields: [
    //         {
    //             id: "phone",
    //             type: "textInput",
    //             mask: "[00][00][00][00][00]",
    //             isNumeric: true,
    //             label: "Téléphone",
    //             errorId: "phoneError",
    //             mendatory: true,
    //             pdfConfig: { dx: -521, dy: - 243, pageIndex: 1, spaces: { afterEach: 2, str: '          ' } }
    //         },
    //         // {
    //         //     id: "disablePhoneContact",
    //         //     label: "J'accepte d'être rappelé à ce numéro",
    //         //     type: "checkbox",
    //         // },
    //     ]
    // },
    // {//37
    //     id: "generalData",
    //     title: "RENSEIGNEMENTS GENERAUX",
    //     fields: [
    //         {
    //             id: "email",
    //             type: "textInput",
    //             isEmail: true,
    //             label: "Adresse email",
    //             errorId: "emailError",
    //             mendatory: true,
    //             pdfConfig: { dx: -380, dy: - 267, pageIndex: 1, splitArobase: true }
    //         },
    //     ],
    //     isLast: true
    // },
    {
        id: "submit",
        fields: []
    }
]

export const mandatMPRModel = [
    { //1 DONE
        id: "identity",
        title: "IDENTITÉ DU MANDANT",
        fields: [
            {
                id: "sexe",
                label: "Je soussigné (vous le mandant):",
                type: "options",
                items: [
                    { label: 'Monsieur', value: 'Monsieur', icon: faMars, pdfConfig: { dx: -511, dy: - 401, pageIndex: 0 } },
                    { label: 'Madame', value: 'Madame', icon: faVenus, pdfConfig: { dx: -473, dy: - 401, pageIndex: 0 } },
                ],
                //mendatory: true,
            }
        ],
        isFirst: true,
        stepIndex: 1,
    },
    {//2 DONE
        id: "identity",
        title: "IDENTITÉ DU MANDANT",
        fields: [
            {
                id: "applicantFirstName",
                type: "textInput",
                maxLength: 15,
                label: "Prénom",
                errorId: "applicantFirstNameError",
                pdfConfig: { dx: -223, dy: - 415, pageIndex: 0, spaces: { afterEach: 1, str: '  ' } }, //add spaces
                mendatory: true
            },
            {
                id: "applicantLastName",
                type: "textInput",
                maxLength: 24,
                label: "Nom",
                errorId: "applicantLastNameError", //add max lenght
                pdfConfig: { dx: -501, dy: - 415, pageIndex: 0, spaces: { afterEach: 1, str: '  ' } }, //add spaces
                mendatory: true
            },
        ],
    },
    {
        id: "property",
        title: "PROPRIÉTÉ DU MANDANT",
        fields: [
            {
                id: "address",
                type: "textInput",
                label: "Adresse détaillée complète",
                errorId: "addressError",
                maxLength: 100,
                pdfConfig: { dx: -520, dy: - 440, pageIndex: 0 }, //add spaces
                mendatory: true,
            },
        ],
        isLast: true,
    },
    // {
    //     id: "property",
    //     title: "PROPRIÉTÉ DU MANDANT",
    //     fields: [
    //         {
    //             id: "addressCode",
    //             type: "textInput",
    //             mask: "[0][0][0][0][0]",
    //             label: "Code Postal",
    //             isNumeric: true,
    //             errorId: "addressCodeError",
    //             mendatory: true,
    //             pdfConfig: { dx: -478, dy: - 456, pageIndex: 0, spaces: { afterEach: 1, str: '  ' } }, //add spaces
    //         },
    //     ]
    // },
    // {
    //     id: "property",
    //     title: "PROPRIÉTÉ DU MANDANT",
    //     fields: [
    //         {
    //             id: "commune",
    //             type: "textInput",
    //             maxLength: 31,
    //             label: "Commune",
    //             errorId: "communeError",
    //             pdfConfig: { dx: -386, dy: - 456, pageIndex: 0, spaces: { afterEach: 1, str: '  ' } }, //add spaces
    //             mendatory: true,
    //         },
    //     ],
    // },
    {
        id: "property",
        title: "COORDONNÉES DU MANDANT",
        fields: [
            {
                id: "email",
                type: "textInput",
                isEmail: true,
                label: "Adresse email",
                errorId: "emailError",
                mendatory: true,
                pdfConfig: { dx: -478, dy: - 471, pageIndex: 0 }
            },
        ],
        isFirst: true,
        stepIndex: 2,
    },
    {
        id: "property",
        title: "COORDONNÉES DU MANDANT",
        fields: [
            {
                id: "phone",
                type: "textInput",
                mask: "[00][00][00][00][00]",
                isNumeric: true,
                label: "Téléphone",
                errorId: "phoneError",
                mendatory: true,
                pdfConfig: { dx: -171, dy: - 471, pageIndex: 0, spaces: { afterEach: 1, str: '  ' } }
            },
        ]
    },
    //autogen
    {
        id: '',
        title: '',
        fields: [
            //AUTO-GEN
            {
                id: "dayNow",
                type: "autogen",
                value: moment().format('DD'),
                pdfConfig: {
                    dx: -423, dy: - 692, pageIndex: 1, spaces: { afterEach: 1, str: '  ' },
                    mendatory: true,
                }
            },
            {
                id: "monthNow",
                type: "autogen",
                value: moment().format('MM'),
                pdfConfig: {
                    dx: -398, dy: - 692, pageIndex: 1, spaces: { afterEach: 1, str: '  ' },
                    mendatory: true,
                }
            },
            {
                id: "yearNow",
                type: "autogen",
                value: moment().format('YYYY'),
                pdfConfig: {
                    dx: -372, dy: - 692, pageIndex: 1, spaces: { afterEach: 1, str: '  ' },
                    mendatory: true,
                }
            },
        ]
    },
    {//8
        id: "journal",
        title: "",
        fields: [
            {
                id: "createdIn",
                type: "textInput",
                maxLength: 18,
                label: "Mandat Maprimerénov fait à:",
                errorId: "createdInError",
                pdfConfig: { dx: -515, dy: - 693, pageIndex: 1 },
                mendatory: true,
                autoDate: { pdfConfig: { dx: -422, dy: - 693, pageIndex: 1 } }
            },
        ],
        isLast: true,
    },
]

export const mandatSynergysModel = () => {

    const globalConfig = {
        rectangles: [
            {
                pageIndex: 0,
                form: {
                    x: 50,
                    y: 380,
                    width: 85,
                    height: 20,
                    color: rgb(1, 1, 1),
                    opacity: 1,
                }
            },
            {
                pageIndex: 0,
                form: {
                    x: 295,
                    y: 380,
                    width: 85,
                    height: 20,
                    color: rgb(1, 1, 1),
                    opacity: 1,
                }
            },
            {
                pageIndex: 0,
                form: {
                    x: 50,
                    y: 140,
                    width: 85,
                    height: 20,
                    color: rgb(1, 1, 1),
                    opacity: 1,
                }
            },
        ],
        signaturePositions: [
            { pageIndex: 0, dx: 300, dy: 300 }
        ]
    }

    const model = [
        { //1 
            id: "service",
            title: "PRESTATION",
            fields: [
                {
                    id: "serviceProvider",
                    label: "Synergys ou Sous-Traitance",
                    type: "options",
                    items: [
                        { label: 'Synergys', value: 'Synergys', icon: faQuestionCircle, pdfConfig: { dx: -471, dy: - 174, squareSize: 12, pageIndex: 0 } },
                        { label: 'Sous-Traitance', value: 'Sous-Traitance', icon: faQuestionCircle, pdfConfig: { dx: -278, dy: - 174, squareSize: 12, pageIndex: 0 } },
                    ],
                    errorId: "serviceProviderError",
                    mendatory: true,
                }
            ],
            isFirst: true,
            stepIndex: 0,
        },
        { //2
            id: "service",
            title: "PRESTATION",
            fields: [
                {
                    id: "serviceType",
                    label: "Type de prestation",
                    type: "options",
                    items: [
                        {
                            label: 'Installation',
                            value: 'Installation (Synergys)',
                            icon: faQuestionCircle,
                            pdfConfig: { dx: -444, dy: - 197, squareSize: 8, pageIndex: 0 },
                            isConditional: true,
                            condition: { with: "serviceProvider", values: ["Synergys"] },
                        },
                        {
                            label: 'SAV',
                            value: 'SAV (Synergys)',
                            icon: faQuestionCircle,
                            pdfConfig: { dx: -362, dy: - 197, squareSize: 8, pageIndex: 0 },
                            isConditional: true,
                            condition: { with: "serviceProvider", values: ["Synergys"] },
                        },
                        {
                            label: 'Installation',
                            value: 'Installation (Sous-Traitance)',
                            icon: faQuestionCircle,
                            pdfConfig: { dx: -252, dy: - 197, squareSize: 8, pageIndex: 0 },
                            isConditional: true,
                            condition: { with: "serviceProvider", values: ["Sous-Traitance"] },
                        },
                        {
                            label: 'SAV',
                            value: 'SAV (Sous-Traitance)',
                            icon: faQuestionCircle,
                            pdfConfig: { dx: -169, dy: - 197, squareSize: 8, pageIndex: 0 },
                            isConditional: true,
                            condition: { with: "serviceProvider", values: ["Sous-Traitance"] },
                        },
                    ],
                    errorId: "serviceTypeError",
                    mendatory: true,
                }
            ],
            isConditional: true,
            condition: { with: "serviceProvider", values: ["Synergys"] },
        },
        { //3
            id: "service",
            title: "PRESTATION",
            fields: [
                {
                    id: "productTypes",
                    label: "Type de produits",
                    type: "options",
                    isMultiOptions: true,
                    items: [
                        { label: 'PAC AIR/EAU', value: 'PAC AIR/EAU', icon: faQuestionCircle, pdfConfig: { dx: -533, dy: - 253, squareSize: 8, pageIndex: 0 } },
                        { label: 'PAC AIR/AIR', value: 'PAC AIR/AIR', icon: faQuestionCircle, pdfConfig: { dx: -430, dy: - 253, squareSize: 8, pageIndex: 0 } },
                        { label: 'PHOTOVOLTAÏQUE', value: 'PHOTOVOLTAÏQUE', icon: faQuestionCircle, pdfConfig: { dx: -320, dy: - 253, squareSize: 8, pageIndex: 0 } },
                        { label: 'ISOLATION', value: 'ISOLATION', icon: faQuestionCircle, pdfConfig: { dx: -183, dy: - 252, squareSize: 8, pageIndex: 0 } },
                        { label: 'CHAUFFE-EAU THERMODYNAMIQUE', value: 'CHAUFFE-EAU THERMODYNAMIQUE', icon: faQuestionCircle, pdfConfig: { dx: -533, dy: - 271, squareSize: 8, pageIndex: 0 } },
                        { label: 'VMC', value: 'VMC', icon: faQuestionCircle, pdfConfig: { dx: -320, dy: - 271, squareSize: 8, pageIndex: 0 } },
                    ],
                    errorId: "productTypesError",
                    mendatory: true,
                }
            ],
            isLast: true
        },
        {//2 DONE
            id: "client",
            title: "COORDONNÉES CLIENT",
            fields: [
                {
                    id: "clientFirstName",
                    type: "textInput",
                    maxLength: 15,
                    label: "Prénom",
                    errorId: "clientFirstNameError",
                    pdfConfig: { dx: -490, dy: - 339, pageIndex: 0 }, //add spaces
                    mendatory: true
                },
                {
                    id: "clientLastName",
                    type: "textInput",
                    maxLength: 24,
                    label: "Nom",
                    errorId: "clientLastNameError", //add max lenght
                    pdfConfig: { dx: -235, dy: - 339, pageIndex: 0 }, //add spaces
                    mendatory: true
                },
            ],
            isFirst: true,
            stepIndex: 1,
        },
        {//2 DONE
            id: "client",
            title: "ADRESSE",
            fields: [
                {
                    id: "addressClient",
                    type: "textInput",
                    label: "Adresse",
                    errorId: "addressClientError",
                    maxLength: 100,
                    pdfConfig: { dx: -475, dy: - 374, pageIndex: 0 }, //add spaces
                    mendatory: true,
                },
            ],
        },
        // {//2 DONE
        //     id: "client",
        //     title: "COORDONNÉES CLIENT",
        //     fields: [
        //         {
        //             id: "addressCodeClient",
        //             type: "textInput",
        //             mask: "[0][0][0][0][0]",
        //             label: "Code Postal",
        //             isNumeric: true,
        //             errorId: "addressCodeClientError",
        //             mendatory: true,
        //             pdfConfig: { dx: -453, dy: - 445, pageIndex: 0 }
        //         },
        //     ]
        // },
        // {//2 DONE
        //     id: "client",
        //     title: "COORDONNÉES CLIENT",
        //     fields: [
        //         {
        //             id: "addressCityClient",
        //             type: "textInput",
        //             label: "Ville",
        //             errorId: "addressCityClientError",
        //             mendatory: true,
        //             pdfConfig: { dx: -257, dy: - 445, pageIndex: 0 }
        //         },
        //     ]
        // },
        {//2 DONE
            id: "client",
            title: "COORDONNÉES CLIENT",
            fields: [
                {
                    id: "fixedPhoneClient",
                    type: "textInput",
                    mask: "[00][00][00][00][00]",
                    isNumeric: true,
                    label: "Téléphone fixe",
                    errorId: "fixedPhoneClientError",
                    pdfConfig: { dx: -500, dy: - 487, pageIndex: 0 }
                },
                {
                    id: "mobilePhoneClient",
                    type: "textInput",
                    mask: "[00][00][00][00][00]",
                    isNumeric: true,
                    label: "Téléphone mobile",
                    errorId: "mobilePhoneClientError",
                    mendatory: true,
                    pdfConfig: { dx: -260, dy: - 487, pageIndex: 0 }
                },
            ]
        },
        {//37
            id: "client",
            title: "COORDONNÉES CLIENT",
            fields: [
                {
                    id: "emailClient",
                    type: "textInput",
                    isEmail: true,
                    label: "Adresse email",
                    errorId: "emailClientError",
                    mendatory: true,
                    pdfConfig: { dx: -500, dy: - 530, pageIndex: 0, splitArobase: true }
                },
            ],
            isLast: true
        },
        {//37
            id: "client",
            title: "COORDONNÉES CLIENT",
            fields: [
                {
                    id: "isSiteInfoEqualToClientInfo",
                    label: "Est-ce que les coordonnées du chantier et du client sont identiques ?",
                    type: "options",
                    items: [
                        {
                            label: 'Oui',
                            value: 'Oui',
                            icon: faCheck,
                            iconColor: "green",
                            pdfConfig: { skip: true },
                            autoCopy: [
                                { id: "siteName", copyFrom: "clientLastName" },
                                { id: "addressSite", copyFrom: "addressClient" },
                                { id: "addressCodeSite", copyFrom: "addressCodeClient" },
                                { id: "phoneSite", copyFrom: "mobilePhoneClient" },
                                { id: "emailSite", copyFrom: "emailClient" },
                            ]
                        },
                        {
                            label: 'Non',
                            value: 'Non',
                            icon: faTimes,
                            iconColor: theme.colors.error,
                            pdfConfig: { skip: true }
                        },
                    ],
                    errorId: "isSiteInfoEqualToClientInfoError",
                    mendatory: true
                },
            ]
        },
        {//37
            id: "site",
            title: "COORDONNÉES CHANTIER",
            fields: [
                {
                    id: "siteName",
                    type: "textInput",
                    maxLength: 15,
                    label: "Nom",
                    errorId: "siteNameError",
                    pdfConfig: { dx: -492, dy: - 587, pageIndex: 0 }, //add spaces
                    mendatory: true,
                    isConditional: true,
                    condition: { with: "isSiteInfoEqualToClientInfo", values: ["Non"] },
                }
            ]
        },
        {//37
            id: "site",
            title: "COORDONNÉES CHANTIER",
            fields: [
                {
                    id: "addressSite",
                    type: "textInput",
                    label: "Adresse",
                    errorId: "addressSiteError",
                    maxLength: 40,
                    pdfConfig: { dx: -480, dy: - 622, pageIndex: 0 }, //add spaces
                    mendatory: true,
                    isConditional: true,
                    condition: { with: "isSiteInfoEqualToClientInfo", values: ["Non"] },
                }
            ]
        },
        // {//2 DONE
        //     id: "site",
        //     title: "COORDONNÉES CHANTIER",
        //     fields: [
        //         {
        //             id: "addressCodeSite",
        //             type: "textInput",
        //             mask: "[0][0][0][0][0]",
        //             label: "Code Postal",
        //             isNumeric: true,
        //             errorId: "addressCodeSiteError",
        //             mendatory: true,
        //             isConditional: true,
        //             condition: { with: "isSiteInfoEqualToClientInfo", values: ["Non"] },
        //             pdfConfig: { dx: -455, dy: - 693, pageIndex: 0 }
        //         }
        //     ]
        // },
        {//2 DONE
            id: "site",
            title: "COORDONNÉES CHANTIER",
            fields: [
                {
                    id: "phoneSite",
                    type: "textInput",
                    mask: "[00][00][00][00][00]",
                    isNumeric: true,
                    label: "Téléphone mobile",
                    errorId: "phoneSiteError",
                    mendatory: true,
                    isConditional: true,
                    condition: { with: "isSiteInfoEqualToClientInfo", values: ["Non"] },
                    pdfConfig: { dx: -500, dy: - 737, pageIndex: 0 }
                },
            ]
        },
        {//2 DONE
            id: "site",
            title: "COORDONNÉES CHANTIER",
            fields: [
                {
                    id: "emailSite",
                    type: "textInput",
                    isEmail: true,
                    label: "Adresse email",
                    errorId: "emailSiteError",
                    mendatory: true,
                    isConditional: true,
                    condition: { with: "isSiteInfoEqualToClientInfo", values: ["Non"] },
                    pdfConfig: { dx: -502, dy: - 779, pageIndex: 0 }
                },
            ]
        },
        {
            id: "site",
            title: "FINANCEMENT",
            fields: [
                {
                    id: "financingAids",
                    label: "A sélectionner si présent",
                    type: "options",
                    isMultiOptions: true,
                    items: [
                        { label: 'ACTION LOGEMENT', value: 'ACTION LOGEMENT', icon: faQuestionCircle, pdfConfig: { dx: -267, dy: - 615, pageIndex: 0 } },
                        { label: 'CHEQUE REGION', value: 'CHEQUE REGION', icon: faQuestionCircle, pdfConfig: { dx: -267, dy: - 648, pageIndex: 0 } },
                        { label: 'MA PRIME RENOV', value: 'MA PRIME RENOV', icon: faQuestionCircle, pdfConfig: { dx: -267, dy: - 684, pageIndex: 0 } }, //#task scroll to error offset_y
                        { label: 'CEE', value: 'CEE', icon: faQuestionCircle, pdfConfig: { dx: -267, dy: - 719, pageIndex: 0 } }, //#task scroll to error offset_y
                        { label: 'FINANCEMENT', value: 'FINANCEMENT', icon: faQuestionCircle, pdfConfig: { dx: -267, dy: - 754, pageIndex: 0 } }, //#task scroll to error offset_y
                    ],
                    style: { marginTop: 100 },
                    // isConditional: true,
                    // condition: { with: "isSiteInfoEqualToClientInfo", values: ["Oui"] },
                },
            ],
            isLast: true
        },
    ]

    return { model, globalConfig }
}

export const pvReceptionModel = (params) => {

    const { clientFullName, billingDate } = params

    const globalConfig = {
        pageDuplication: {
            pageIndexSource: 0,
            pageIndexTarget: 1
        }
    }

    const model = [
        //---------------------------  Page 1
        { //2
            id: "acceptReception",
            title: "",
            fields: [
                {
                    id: "acceptReception",
                    label: "Travaux avec ou sans réserves ?",
                    type: "options",
                    items: [
                        {
                            label: 'Accepter la réception des travaux sans réserves',
                            value: 'Sans réserves',
                            icon: faQuestionCircle,
                            pdfConfig: { dx: -492, dy: - 226, pageIndex: 0 },
                            rollBack: {
                                fields: [
                                    { id: "acceptWorksReceptionDate", type: "date" },
                                ]
                            }
                        },
                        {
                            label: 'Accepter la réception assortie de réserves',
                            value: 'Avec réserves',
                            icon: faQuestionCircle,
                            pdfConfig: { dx: -492, dy: - 250, pageIndex: 0 },
                            rollBack: {
                                fields: [
                                    { id: "acceptReservesReceptionDate", type: "date" },
                                ]
                            }
                        },
                    ],
                    errorId: "acceptReceptionError",
                    mendatory: true,
                },
            ]
        },
        //AUTO-GEN
        {
            id: '',
            title: '',
            fields: [
                {
                    id: "projectOwner",
                    type: "autogen",
                    value: clientFullName,
                    pdfConfig: { dx: -423, dy: - 132, pageIndex: 0 }
                },
                {
                    id: "billingDate",
                    type: "autogen",
                    value: billingDate,
                    pdfConfig: { dx: -335, dy: - 172, pageIndex: 0 }
                },
                {
                    id: "reserveDate1",
                    type: "autogen",
                    value: moment().format('DD/MM/YYYY'),
                    pdfConfig: { dx: -174, dy: - 225, pageIndex: 0 },
                    isConditional: true,
                    condition: { with: "acceptReception", values: ["Sans réserves"] },
                },
                {
                    id: "reserveDate2",
                    type: "autogen",
                    value: moment().format('DD/MM/YYYY'),
                    pdfConfig: { dx: -200, dy: - 249, pageIndex: 0 },
                    isConditional: true,
                    condition: { with: "acceptReception", values: ["Avec réserves"] },
                },
                {
                    id: "todayDate1",
                    type: "autogen",
                    value: moment().format('DD/MM/YYYY'),
                    pdfConfig: { dx: -295, dy: - 547, pageIndex: 0 }
                },
                {
                    id: "appreciationDate",
                    type: "autogen",
                    value: moment().format('DD/MM/YYYY'),
                    pdfConfig: { dx: -500, dy: -747, pageIndex: 1 },
                },
                {
                    id: "dayNow",
                    type: "autogen",
                    value: moment().format('DD'),
                    pdfConfig: {
                        dx: -182, dy: - 313, pageIndex: 1, spaces: { afterEach: 1, str: '   ' },
                        mendatory: true,
                    }
                },
                {
                    id: "monthNow",
                    type: "autogen",
                    value: moment().format('MM'),
                    pdfConfig: {
                        dx: -148, dy: - 313, pageIndex: 1, spaces: { afterEach: 1, str: '   ' },
                        mendatory: true,
                    }
                },
                {
                    id: "yearNow",
                    type: "autogen",
                    value: moment().format('YYYY'),
                    pdfConfig: {
                        dx: -115, dy: - 313, pageIndex: 1, spaces: { afterEach: 1, str: '   ' },
                        mendatory: true,
                    }
                },
            ]
        },
        {//5
            id: "reservesNature",
            title: "",
            fields: [
                {
                    id: "reservesNature",
                    type: "textInput",
                    label: "Nature des réserves",
                    errorId: "reservesNatureError",
                    pdfConfig: {
                        dx: -335,
                        dy: - 267,
                        pageIndex: 0,
                        breakLines: {
                            linesWidths: [300, 410, 410, 410],
                            linesStarts: [
                                { dx: -335, dy: -267 },
                                { dx: -465, dy: -287 },
                                { dx: -465, dy: -307 },
                                { dx: -465, dy: -327 },
                            ]
                        }
                    },
                    mendatory: true,
                },
            ],
        },
        {//6
            id: "worksToExecute",
            title: "",
            fields: [
                {
                    id: "worksToExecute",
                    type: "textInput",
                    label: "Travaux à exécuter",
                    errorId: "worksToExecuteError",
                    pdfConfig: {
                        dx: -337,
                        dy: - 348,
                        pageIndex: 0,
                        breakLines: {
                            linesWidths: [300, 410, 410, 410],
                            linesStarts: [
                                { dx: -335, dy: -347 },
                                { dx: -465, dy: -367 },
                                { dx: -465, dy: -387 },
                                { dx: -465, dy: -407 },
                            ]
                        }
                    },
                    mendatory: true,
                },
            ],
        },
        {//7
            id: "timeLimitFromToday",
            title: "",
            fields: [
                {
                    id: "timeLimitFromToday",
                    type: "textInput",
                    label: "Délai imparti à compter de ce jour",
                    errorId: "timeLimitFromTodayError",
                    pdfConfig: { dx: -265, dy: - 428, pageIndex: 0 },
                    mendatory: true,
                },
            ],
        },
        {//8
            id: "madeIn",
            title: "",
            fields: [
                {
                    id: "madeIn",
                    type: "textInput",
                    label: "Fait à:",
                    errorId: "madeInError",
                    pdfConfig: { dx: -452, dy: - 547, pageIndex: 0 },
                    mendatory: true,
                },
            ],
        },
        //----------------------- PAGE2
        {//1
            id: "clientName",
            title: "Coordonnées du chantier",
            fields: [
                {
                    id: "clientName",
                    type: "textInput",
                    label: "Nom et prénom du client",
                    errorId: "clientNameError",
                    pdfConfig: { dx: -430, dy: - 239, pageIndex: 1 },
                    mendatory: true,
                },
            ],
        },
        {//2
            id: "installationAddress",
            title: "Coordonnées du chantier",
            fields: [
                {
                    id: "installationAddress",
                    type: "address",
                    label: "Adresse complète de l'installation",
                    errorId: "installationAddressError",
                    pdfConfig: { dx: -393, dy: - 262, pageIndex: 1 },
                    mendatory: true,
                }
            ]
        },
        {//3
            id: "clientPhone",
            title: "Coordonnées du chantier",
            fields: [
                {
                    id: "phone",
                    type: "textInput",
                    mask: "[00][00][00][00][00]",
                    isNumeric: true,
                    label: "Téléphone du client",
                    errorId: "phoneError",
                    mendatory: true,
                    pdfConfig: { dx: -453, dy: - 314, pageIndex: 1 }, //task: make spacing pattern to be more dynamic
                    mendatory: true,
                },
            ]
        },
        //********************************* INSTALLATIONS
        { //Inst1
            id: "installations",
            title: "Cochez la case de l'installation si mise en oeuvre et précisez la puissance ou la surface demandée",
            fields: [
                {
                    id: "installations",
                    label: "Installations",
                    type: "options",
                    isStepMultiOptions: true,
                    items: [
                        {
                            label: 'Chauffe‐eau solaire individuel',
                            value: 'Chauffe‐eau solaire individuel',
                            icon: faQuestionCircle,
                            pdfConfig: { dx: -544, dy: - 382, pageIndex: 1, squareSize: 8 },
                        },
                        {
                            label: 'Non installé, passer.',
                            value: '',
                            skip: true,
                            icon: faQuestionCircle,
                            pdfConfig: { skip: true },
                            rollBack: {
                                fields: [
                                    { id: "installations", type: "array", value: "Chauffe‐eau solaire individuel" },
                                    { id: "solarWaterHeaterSensorSurface", type: "string" }
                                ]
                            }
                        },
                    ],
                },
                {
                    id: "solarWaterHeaterSensorSurface",
                    type: "textInput",
                    isNumeric: true,
                    label: "Surface du capteur (en m²)",
                    errorId: "solarWaterHeaterSensorSurfaceError",
                    isConditional: true,
                    condition: { with: "installations", values: ["Chauffe‐eau solaire individuel"] },
                    pdfConfig: { dx: -160, dy: - 380, pageIndex: 1 },
                    mendatory: true,
                },
            ]
        },
        { //Inst2
            id: "installations",
            title: "Cochez la case de l'installation si mise en oeuvre et précisez la puissance ou la surface demandée",
            fields: [
                {
                    id: "installations",
                    label: "",
                    type: "options",
                    isStepMultiOptions: true,
                    items: [
                        {
                            label: 'Système solaire combiné',
                            value: 'Système solaire combiné',
                            icon: faQuestionCircle,
                            pdfConfig: { dx: -544, dy: - 405, pageIndex: 1, squareSize: 8 },
                        },
                        {
                            label: 'Non installé, passer.',
                            value: '',
                            skip: true,
                            icon: faQuestionCircle,
                            pdfConfig: { skip: true },
                            rollBack: {
                                fields: [
                                    { id: "installations", type: "array", value: "Système solaire combiné" },
                                    { id: "combinedSolarSystemSensorSurface", type: "string" }
                                ]
                            }
                        },
                    ],
                },
                {
                    id: "combinedSolarSystemSensorSurface",
                    type: "textInput",
                    isNumeric: true,
                    label: "Surface du capteur (en m²)",
                    errorId: "combinedSolarSystemSensorSurfaceError",
                    isConditional: true,
                    condition: { with: "installations", values: ["Système solaire combiné"] },
                    pdfConfig: { dx: -160, dy: - 403, pageIndex: 1 },
                    mendatory: true,
                },
            ]
        },
        { //Inst3
            id: "installations",
            title: "Cochez la case de l'installation si mise en oeuvre et précisez la puissance ou la surface demandée",
            fields: [
                {
                    id: "installations",
                    label: "",
                    type: "options",
                    isStepMultiOptions: true,
                    items: [
                        {
                            label: 'Solaire thermique collectif (ECS)',
                            value: 'Solaire thermique collectif (ECS)',
                            icon: faQuestionCircle,
                            pdfConfig: { dx: -544, dy: - 428, pageIndex: 1, squareSize: 8 },
                        },
                        {
                            label: 'Non installé, passer.',
                            value: '',
                            skip: true,
                            icon: faQuestionCircle,
                            pdfConfig: { skip: true },
                            rollBack: {
                                fields:
                                    [
                                        { id: "installations", type: "array", value: "Solaire thermique collectif (ECS)" },
                                        { id: "collectiveSolarThermalSensorSurface", type: "string" }
                                    ]
                            }
                        },
                    ],
                },
                {
                    id: "collectiveSolarThermalSensorSurface",
                    type: "textInput",
                    isNumeric: true,
                    label: "Surface du capteur (en m²)",
                    errorId: "collectiveSolarThermalSensorSurfaceError",
                    isConditional: true,
                    condition: { with: "installations", values: ["Solaire thermique collectif (ECS)"] },
                    pdfConfig: { dx: -160, dy: - 426, pageIndex: 1 },
                    mendatory: true,
                },
            ]
        },
        { //Inst4
            id: "installations",
            title: "Cochez la case de l'installation si mise en oeuvre et précisez la puissance ou la surface demandée",
            fields: [
                {
                    id: "installations",
                    label: "",
                    type: "options",
                    isStepMultiOptions: true,
                    items: [
                        {
                            label: 'Chauffage au bois',
                            value: 'Chauffage au bois',
                            icon: faQuestionCircle,
                            pdfConfig: { dx: -544, dy: - 449, pageIndex: 1, squareSize: 8 },
                        },
                        {
                            label: 'Non installé, passer.',
                            value: '',
                            skip: true,
                            icon: faQuestionCircle,
                            pdfConfig: { skip: true },
                            rollBack: {
                                fields: [
                                    { id: "installations", type: "array", value: "Chauffage au bois" },
                                    { id: "woodHeatingPower", type: "string" },
                                    { id: "woodHeatingDeviceType", type: "string" }
                                ]
                            }
                        },
                    ],
                },
                {
                    id: "woodHeatingPower",
                    type: "textInput",
                    isNumeric: true,
                    label: "Puissance (en kW)",
                    errorId: "woodHeatingPowerError",
                    isConditional: true,
                    condition: { with: "installations", values: ["Chauffage au bois"] },
                    pdfConfig: { dx: -190, dy: - 447, pageIndex: 1 },
                    mendatory: true,
                },
                {
                    id: "woodHeatingDeviceType",
                    type: "picker",
                    items: [
                        { label: "Choisir", value: "", pdfConfig: { skip: true } },
                        { label: "Poêle hydraulique", value: "Poêle hydraulique", pdfConfig: { dx: -545, dy: - 475, pageIndex: 1 } },
                        { label: "Poêle indépendant", value: "Poêle indépendant", pdfConfig: { dx: -458, dy: - 475, pageIndex: 1 } },
                        { label: "Insert", value: "Insert", pdfConfig: { dx: -367, dy: - 475, pageIndex: 1 } },
                        { label: "Chaudière manuelle (bûche)", value: "Chaudière manuelle (bûche)", pdfConfig: { dx: -333, dy: - 475, pageIndex: 1 } },
                        { label: "Chaudière automatique (granulé, pellet)", value: "Chaudière automatique (granulé, pellet)", pdfConfig: { dx: -210, dy: - 475, pageIndex: 1 } },
                    ],
                    label: "Type d’appareil",
                    mendatory: true,
                    errorId: "woodHeatingDeviceTypeError",
                    isConditional: true,
                    condition: { with: "installations", values: ["Chauffage au bois"] },
                },
            ]
        },
        { //Inst5
            id: "installations",
            title: "Cochez la case de l'installation si mise en oeuvre et précisez la puissance ou la surface demandée",
            fields: [
                {
                    id: "installations",
                    label: "",
                    type: "options",
                    isStepMultiOptions: true,
                    items: [
                        {
                            label: 'Générateur photovoltaïque raccordé au réseau',
                            value: 'Générateur photovoltaïque raccordé au réseau',
                            icon: faQuestionCircle,
                            pdfConfig: { dx: -544, dy: - 495, pageIndex: 1, squareSize: 8 },
                        },
                        {
                            label: 'Non installé, passer.',
                            value: '',
                            skip: true,
                            icon: faQuestionCircle,
                            pdfConfig: { skip: true },
                            rollBack: {
                                fields: [
                                    { id: "installations", type: "array", value: "Générateur photovoltaïque raccordé au réseau" },
                                    { id: "photovoltaicPower", type: "string" },
                                    { id: "photovoltaicWorksType", type: "string" }
                                ]
                            }
                        },
                    ],
                },
                {
                    id: "photovoltaicPower",
                    type: "textInput",
                    isNumeric: true,
                    label: "Puissance (en kW)",
                    errorId: "photovoltaicPowerError",
                    isConditional: true,
                    condition: { with: "installations", values: ["Générateur photovoltaïque raccordé au réseau"] },
                    pdfConfig: { dx: -190, dy: - 493, pageIndex: 1 },
                    mendatory: true,
                },
                {
                    id: "photovoltaicWorksType",
                    type: "picker",
                    items: [
                        { label: "Choisir", value: "", pdfConfig: { skip: true } },
                        { label: "Travaux d’intégration au bâti", value: "Travaux d’intégration au bâti", pdfConfig: { dx: -517, dy: - 520, pageIndex: 1 } },
                        { label: "Travaux d’installation électrique", value: "Travaux d’installation électrique", pdfConfig: { dx: -370, dy: - 520, pageIndex: 1 } },
                    ],
                    label: "Nature des travaux réalisés par l’entreprise",
                    mendatory: true,
                    errorId: "photovoltaicWorksTypeError",
                    isConditional: true,
                    condition: { with: "installations", values: ["Générateur photovoltaïque raccordé au réseau"] },
                },
            ]
        },
        { //Inst6
            id: "installations",
            title: "Cochez la case de l'installation si mise en oeuvre et précisez la puissance ou la surface demandée",
            fields: [
                {
                    id: "installations",
                    label: "",
                    type: "options",
                    isStepMultiOptions: true,
                    items: [
                        {
                            label: 'Pompe à chaleur',
                            value: 'Pompe à chaleur',
                            icon: faQuestionCircle,
                            pdfConfig: { dx: -544, dy: - 541, pageIndex: 1, squareSize: 8 },
                        },
                        {
                            label: 'Non installé, passer.',
                            value: '',
                            skip: true,
                            icon: faQuestionCircle,
                            pdfConfig: { skip: true },
                            rollBack: {
                                fields: [
                                    { id: "installations", type: "array", value: "Pompe à chaleur" },
                                    { id: "heatPumpPower", type: "string" },
                                    { id: "heatPumpDeviceType", type: "string" }
                                ]
                            }
                        },
                    ],
                },
                {
                    id: "woodHeatingPower",
                    type: "textInput",
                    isNumeric: true,
                    label: "Puissance (en kW)",
                    errorId: "woodHeatingPowerError",
                    isConditional: true,
                    condition: { with: "installations", values: ["Pompe à chaleur"] },
                    pdfConfig: { dx: -190, dy: - 539, pageIndex: 1 },
                    mendatory: true,
                },
                {
                    id: "heatPumpDeviceType",
                    type: "picker",
                    items: [
                        { label: "Choisir", value: "", pdfConfig: { skip: true } },
                        { label: "Air/Air", value: "Air/Air", pdfConfig: { dx: -517, dy: - 567, pageIndex: 1 } },
                        { label: "Air/Eau", value: "Air/Eau", pdfConfig: { dx: -460, dy: - 567, pageIndex: 1 } },
                        { label: "Eau/Eau", value: "Eau/Eau", pdfConfig: { dx: -400, dy: - 567, pageIndex: 1 } },//400
                        { label: "Sol/Eau", value: "Sol/Eau", pdfConfig: { dx: -335, dy: - 567, pageIndex: 1 } },
                        { label: "Sol/Sol", value: "Sol/Sol", pdfConfig: { dx: -275, dy: - 567, pageIndex: 1 } },
                        { label: "Air/Air multisplit", value: "Air/Air multisplit", pdfConfig: { dx: -215, dy: - 567, pageIndex: 1 } },
                        { label: "CET", value: "CET", pdfConfig: { dx: -120, dy: - 567, pageIndex: 1 } },
                    ],
                    label: "Type d’appareil",
                    mendatory: true,
                    errorId: "heatPumpDeviceTypeError",
                    isConditional: true,
                    condition: { with: "installations", values: ["Pompe à chaleur"] },
                },
            ]
        },
        { //Inst7
            id: "installations",
            title: "Cochez la case de l'installation si mise en oeuvre et précisez la puissance ou la surface demandée",
            fields: [
                {
                    id: "installations",
                    label: "",
                    type: "options",
                    isStepMultiOptions: true,
                    items: [
                        {
                            label: 'Forage géothermique',
                            value: 'Forage géothermique',
                            icon: faQuestionCircle,
                            pdfConfig: { dx: -544, dy: - 588, pageIndex: 1, squareSize: 8 },
                        },
                        {
                            label: 'Non installé, passer.',
                            value: '',
                            skip: true,
                            icon: faQuestionCircle,
                            pdfConfig: { skip: true },
                            rollBack: {
                                fields: [
                                    { id: "installations", type: "array", value: "Forage géothermique" },
                                    { id: "geothermalDrillingDepth", type: "string" },
                                    { id: "drillingType", type: "string" }
                                ]
                            }
                        },
                    ],
                },
                {
                    id: "geothermalDrillingDepth",
                    type: "textInput",
                    isNumeric: true,
                    label: "Profondeur (en m)",
                    errorId: "geothermalDrillingDepthError",
                    isConditional: true,
                    condition: { with: "installations", values: ["Forage géothermique"] },
                    pdfConfig: { dx: -190, dy: - 586, pageIndex: 1 },
                    mendatory: true,
                },
                {
                    id: "drillingType",
                    type: "picker",
                    items: [
                        { label: "Choisir", value: "", pdfConfig: { skip: true } },
                        { label: "Forage sur Nappe", value: "Forage sur Nappe", pdfConfig: { dx: -517, dy: - 613, pageIndex: 1 } },//517
                        { label: "Forage sur Sonde", value: "Forage sur Sonde", pdfConfig: { dx: -415, dy: - 613, pageIndex: 1 } },
                    ],
                    label: "Type de forage",
                    mendatory: true,
                    errorId: "drillingTypeError",
                    isConditional: true,
                    condition: { with: "installations", values: ["Forage géothermique"] },
                },
            ]
        },
        { //Inst8
            id: "installations",
            title: "Cochez la case de l'installation si mise en oeuvre et précisez la puissance ou la surface demandée",
            fields: [
                {
                    id: "installations",
                    label: "",
                    type: "options",
                    isStepMultiOptions: true,
                    items: [
                        {
                            label: 'Chaudière à condensation',
                            value: 'Chaudière à condensation',
                            icon: faQuestionCircle,
                            pdfConfig: { dx: -544, dy: - 634, pageIndex: 1, squareSize: 8 },
                        },
                        {
                            label: 'Non installé, passer.',
                            value: '',
                            skip: true,
                            icon: faQuestionCircle,
                            pdfConfig: { skip: true },
                            rollBack: {
                                fields: [
                                    { id: "installations", type: "array", value: "Chaudière à condensation" },
                                    { id: "condensingBoilerPower", type: "string" },
                                    { id: "condensingBoilerDeviceType", type: "string" }
                                ]
                            }
                        },
                    ],
                },
                {
                    id: "condensingBoilerPower",
                    type: "textInput",
                    isNumeric: true,
                    label: "Puissance (en kW)",
                    errorId: "condensingBoilerPowerError",
                    isConditional: true,
                    condition: { with: "installations", values: ["Chaudière à condensation"] },
                    pdfConfig: { dx: -190, dy: - 634, pageIndex: 1 },
                    mendatory: true,
                },
                {
                    id: "condensingBoilerDeviceType",
                    type: "picker",
                    items: [
                        { label: "Choisir", value: "", pdfConfig: { skip: true } },
                        { label: "Gaz", value: "Gaz", pdfConfig: { dx: -545, dy: - 660, pageIndex: 1, squareSize: 12 } },
                        { label: "Fioul", value: "Fioul", pdfConfig: { dx: -516, dy: - 660, pageIndex: 1, squareSize: 12 } },
                    ],
                    label: "Type d'appareil",
                    mendatory: true,
                    errorId: "condensingBoilerDeviceTypeError",
                    isConditional: true,
                    condition: { with: "installations", values: ["Chaudière à condensation"] },
                },
            ]
        },
        { //5
            id: "appreciation",
            title: "Appréciation de la prestation",
            fields: [
                {
                    id: "appreciation",
                    label: "Qualité globale de la prestation",
                    type: "options",
                    items: [
                        {
                            label: 'Très satisfaisante',
                            value: 'Très satisfaisante',
                            icon: faQuestionCircle,
                            pdfConfig: { dx: -340, dy: - 723, pageIndex: 1, squareSize: 10 },
                        },
                        {
                            label: 'Satisfaisante',
                            value: 'Satisfaisante',
                            icon: faQuestionCircle,
                            pdfConfig: { dx: -257, dy: - 723, pageIndex: 1, squareSize: 12 },
                        },
                        {
                            label: 'Peu satisfaisante',
                            value: 'Peu satisfaisante',
                            icon: faQuestionCircle,
                            pdfConfig: { dx: -176, dy: - 723, pageIndex: 1, squareSize: 12 },
                        },
                        {
                            label: 'Insatisfaisante',
                            value: 'Insatisfaisante',
                            icon: faQuestionCircle,
                            pdfConfig: { dx: -94, dy: - 723, pageIndex: 1, squareSize: 12 },
                        },
                    ],
                    mendatory: true,
                },
            ],
            isLast: true
        },
    ]

    return { model, globalConfig }
}


//VISIT TECH + CHECKLISTS
export const visiteTechModel = () => {

    // const model = [
    //     {//1
    //         id: "clientName",
    //         title: "",
    //         fields: [
    //             {
    //                 id: "clientName",
    //                 type: "textInput",
    //                 maxLength: 15,
    //                 label: "Client",
    //                 errorId: "clientNameError",
    //                 pdfConfig: { dx: -490, dy: - 339, pageIndex: 0 }, //add spaces
    //                 mendatory: true
    //             },
    //         ]
    //     },
    //     {//2
    //         id: "subPower",
    //         title: "",
    //         fields: [{
    //             id: "subPower",
    //             type: "textInput",
    //             isNumeric: true,
    //             label: "Puissance de l'abonnement souscrit",
    //             errorId: "subPowerError",
    //             mendatory: true,
    //             pdfConfig: { dx: -260, dy: - 187, pageIndex: 0 }
    //         }]
    //     },
    //     {//3
    //         id: "phaseType",
    //         title: "",
    //         fields: [{
    //             id: "phaseType",
    //             label: "Type de phase",
    //             type: "options",
    //             items: [
    //                 { label: 'Monophasé', value: 'Monophasé', icon: faQuestionCircle, pdfConfig: { dx: -520, dy: - 270, squareSize: 10, pageIndex: 0 } },
    //                 { label: 'Triphasé', value: 'Triphasé', icon: faQuestionCircle, pdfConfig: { dx: -520, dy: - 300, squareSize: 10, pageIndex: 0 } },
    //             ],
    //             mendatory: true,
    //         }]
    //     },
    //     {//6
    //         id: "eletricPanelSize",
    //         title: "",
    //         fields: [{
    //             id: "eletricPanelSize",
    //             type: "textInput",
    //             isNumeric: true,
    //             label: "Taille du tableau électrique à installer",
    //             instruction: { priority: "low", message: "Renseigner le nombre de modules" },
    //             errorId: "eletricPanelSizeError",
    //             mendatory: true,
    //             pdfConfig: { dx: -240, dy: - 339, pageIndex: 0 }
    //         }]
    //     },
    //     // //5 Checklist produits (autoGen)
    //     // //7 Montant accompte (autoGen)
    //     // { //1
    //     //     id: "electricMeterPicture",
    //     //     title: "",
    //     //     fields: [
    //     //         {
    //     //             id: "electricMeterPicture",
    //     //             label: "Photo du compteur électrique",
    //     //             type: "image",
    //     //             errorId: "electricMeterPictureError",
    //     //             mendatory: true,
    //     //             pdfConfig: { dx: -10, dy: - 10, pageIndex: 0 }
    //     //         },
    //     //     ]
    //     // },
    //     // { //4
    //     //     id: "electricPanelPicture",
    //     //     title: "",
    //     //     fields: [
    //     //         {
    //     //             id: "electricPanelPicture",
    //     //             label: "Photo du tableau électrique existant",
    //     //             type: "image",
    //     //             errorId: "electricPanelPictureError",
    //     //             mendatory: true,
    //     //             pdfConfig: { dx: -10, dy: - 10, pageIndex: 0 }
    //     //         },
    //     //     ]
    //     // },
    // ]

    const model = []

    return { model }
}
export const checklistPAAModel = (pageIndex) => {
    const model = [
        {//1
            id: "counterPowerPAA",
            title: "Pac Air/Air - Partie Electrique",
            fields: [{
                id: "counterPowerPAA",
                label: "Puissance du compteur",
                type: "options",
                errorId: "counterPowerPAAError",
                items: [
                    { label: 'Monophasé', value: 'Monophasé', icon: faQuestionCircle, pdfConfig: { dx: -312, dy: - 96, pageIndex } },
                    { label: 'Triphasé', value: 'Triphasé', icon: faQuestionCircle, pdfConfig: { dx: -197, dy: - 96, pageIndex } },
                ],
                mendatory: true,
            }]
        },
        {//2
            id: "powerCablePAA1",
            title: "Pac Air/Air - Partie Electrique",
            fields: [
                {
                    id: "powerCableTypePAA",
                    type: "textInput",
                    label: "Type câble d'alimentation",
                    errorId: "powerCableTypePAAError",
                    mendatory: true,
                    pdfConfig: { dx: -400, dy: - 132, pageIndex }
                },
                {
                    id: "powerCableLengthPAA",
                    type: "textInput",
                    isNumeric: true,
                    label: "Longueur câble d'alimentation",
                    errorId: "powerCableLengthPAAError",
                    mendatory: true,
                    pdfConfig: { dx: -382, dy: - 155, pageIndex }
                },
            ]
        },
        {//3
            id: "powerCablePAA2",
            title: "Pac Air/Air - Partie Electrique",
            fields: [
                {
                    id: "powerCableSource",
                    label: "Câble d'alimentation",
                    type: "options",
                    errorId: "powerCableSourceError",
                    items: [
                        { label: 'Existant', value: 'Existant', pdfConfig: { dx: -392, dy: - 196, pageIndex } },
                        { label: 'A tirer', value: 'A tirer', pdfConfig: { dx: -306, dy: - 196, pageIndex } },
                    ],
                    mendatory: true,
                },
                {
                    id: "powerCableSection",
                    type: "textInput",
                    label: "Section",
                    errorId: "powerCableSectionError",
                    mendatory: true,
                    pdfConfig: { dx: -195, dy: - 196, pageIndex }
                },
            ]
        },
        {//4
            id: "splitLocationPAA",
            title: "Pac Air/Air - Partie Emplacement",
            fields: [
                {
                    id: "splitLocationPAA",
                    type: "textInput",
                    label: "Emplacement Split",
                    errorId: "splitLocationPAAError",
                    mendatory: true,
                    pdfConfig: { dx: -421, dy: - 277, pageIndex }
                },
            ]
        },
        {//5
            id: "isMultiSplit",
            title: "Pac Air/Air - Partie Emplacement",
            fields: [
                {
                    id: "multiSplitLocationPAA",
                    type: "textInput",
                    label: "Si Multi-Split, Emplacement Split",
                    errorId: "multiSplitLocationPAAError",
                    pdfConfig: { dx: -323, dy: - 339, pageIndex }
                },
                {
                    id: "multiSplitLinksTypePAA",
                    type: "textInput",
                    label: "Si Multi-Split, Type de liaisons",
                    errorId: "multiSplitLinksTypePAAError",
                    pdfConfig: { dx: -110, dy: - 339, pageIndex }
                },
            ]
        },
        {//6
            id: "sumpPumpsCount",
            title: "Pac Air/Air - Partie Emplacement",
            fields: [
                {
                    id: "sumpPumpsCount",
                    type: "textInput",
                    isNumeric: true,
                    label: "Nombre de pompes de relevage",
                    mendatory: true,
                    errorId: "sumpPumpsCountError",
                    pdfConfig: { dx: -420, dy: - 380, pageIndex }
                },
            ]
        },
        {//7
            id: "bracketTypePAA",
            title: "Pac Air/Air - Partie Groupe Ext.",
            fields: [
                {
                    id: "bracketTypePAA",
                    label: "Type de support",
                    type: "options",
                    items: [
                        { label: "Au sol", value: "Au sol", pdfConfig: { dx: -484, dy: -450, pageIndex } },
                        { label: "Support mural classique", value: "Support mural classique", pdfConfig: { dx: -370, dy: - 450, pageIndex } },
                        { label: "Support mural mupro", value: "Support mural mupro", pdfConfig: { dx: -200, dy: - 450, pageIndex } },
                    ],
                    mendatory: true,
                    errorId: "bracketTypePAAError",
                    pdfConfig: { dx: -450, dy: - 305, pageIndex }
                },
            ]
        },
        {//8
            id: "GELocationPAA",
            title: "Pac Air/Air - Partie Emplacement",
            fields: [
                {
                    id: "GELocationPAA",
                    type: "textInput",
                    label: "Emplacement GE",
                    mendatory: true,
                    errorId: "GELocationPAAError",
                    pdfConfig: { dx: -180, dy: - 512, pageIndex }
                },
            ]
        },
        {//8.1
            id: "capacitorDrainingPAA",
            title: "Pac Air/Air - Partie Groupe Ext.",
            fields: [
                {
                    id: "capacitorDrainingPAA",
                    type: "textInput",
                    label: "Evacuation condensateur",
                    mendatory: true,
                    errorId: "capacitorDrainingPAAError",
                    pdfConfig: { dx: -420, dy: - 553, pageIndex }
                },
            ]
        },
        {//9
            id: "linksPassagePAA",
            title: "Pac Air/Air - Partie Frigorifique",
            fields: [
                {
                    id: "linksPassagePAA",
                    type: "textInput",
                    label: "Passage des liaisons",
                    errorId: "linksPassagePAAError",
                    mendatory: true,
                    pdfConfig: { dx: -420, dy: - 600, pageIndex }
                },
            ]
        },
        {//10
            id: "linksLengthPAA",
            title: "Pac Air/Air - Partie Frigorifique",
            fields: [
                {
                    id: "linksLengthPAA",
                    type: "textInput",
                    label: "Passage des liaisons",
                    errorId: "linksLengthPAAError",
                    mendatory: true,
                    pdfConfig: { dx: -420, dy: - 639, pageIndex }
                },
            ]
        },
        {//11
            id: "chuteTypePAA",
            title: "Pac Air/Air - Partie Frigorifique",
            fields: [
                {
                    id: "chuteTypePAA",
                    type: "textInput",
                    label: "Type de goulotte",
                    errorId: "chuteTypePAAError",
                    mendatory: true,
                    pdfConfig: { dx: -420, dy: - 678, pageIndex }
                },
            ]
        },
        {//12
            id: "chuteLengthPAA",
            title: "Pac Air/Air - Partie Frigorifique",
            fields: [
                {
                    id: "chuteLengthPAA",
                    type: "textInput",
                    label: "Longueur de goulotte",
                    isNumeric: true,
                    errorId: "chuteLengthPAAError",
                    mendatory: true,
                    pdfConfig: { dx: -420, dy: - 714, pageIndex }
                },
            ]
        },
        {//13
            id: "noticePAA",
            title: "Pac Air/Air - Remarques",
            fields: [
                {
                    id: "noticePAA",
                    type: "textInput",
                    label: "Remarques",
                    errorId: "noticePAAError",
                    pdfConfig: { dx: -421, dy: - 775, pageIndex }
                },
            ]
        },
        {//14
            id: "materialPropositionPAA",
            title: "Pac Air/Air - Remarques",
            fields: [
                {
                    id: "materialPropositionPAA",
                    type: "textInput",
                    label: "Proposition matériel adéquat si refus VT",
                    errorId: "materialPropositionPAAError",
                    pdfConfig: { dx: -421, dy: - 812, pageIndex }
                },
            ]
        },
    ]

    return { model }
}
export const checklistPAEModel = (pageIndex) => {

    const model = [
    {//1
        id: "isInstalledPAE",
        title: "PAC AIR/EAU - Partie Electrique",
        fields: [
            {
                id: "isInstalledPAE",
                label: "Installation existante ?",
                type: "options",
                items: [
                    { label: 'Non', value: 'Non', icon: faTimes, iconColor: theme.colors.error, pdfConfig: { dx: -182, dy: - 81, pageIndex } },
                    { label: 'Oui', value: 'Oui', icon: faCheck, iconColor: "green", pdfConfig: { dx: -297, dy: - 81, pageIndex } },
                ],
                errorId: "isInstalledPAEError",
                mendatory: true
            },
        ]
    },
    {//2
        id: "phaseTypePAE",
        title: "PAC AIR/EAU - Partie Electrique",
        fields: [
            {
                id: "phaseTypePAE",
                label: "Type de phase",
                type: "options",
                items: [
                    { label: 'Monophasé', value: 'Monophasé', pdfConfig: { dx: -321, dy: - 101, pageIndex } },
                    { label: 'Triphasé', value: 'Triphasé', pdfConfig: { dx: -176, dy: - 101, pageIndex } },
                ],
                errorId: "phaseTypePAEError",
                mendatory: true
            },
        ]
    },
    {//3
        id: "counterSubPowerPAE",
        title: "PAC AIR/EAU - Partie Electrique",
        fields: [
            {
                id: "counterSubPowerPAE",
                type: "textInput",
                isNumeric: true,
                label: "Puissance abonnement compteur",
                errorId: "counterSubPowerPAEError",
                mendatory: true,
                pdfConfig: { dx: -200, dy: - 121, pageIndex }
            },
        ]
    },
    {//4
        id: "powerCablePAE1",
        title: "PAC AIR/EAU - Partie Electrique",
        fields: [
            {
                id: "powerCableSourcePAE",
                label: "Câble d'alimentation",
                type: "options",
                errorId: "powerCableSourcePAEError",
                items: [
                    { label: 'Existant', value: 'Existant', pdfConfig: { dx: -330, dy: - 140, pageIndex } },
                    { label: 'A tirer', value: 'A tirer', pdfConfig: { dx: -238, dy: - 140, pageIndex } },
                ],
                mendatory: true,
            },
            {
                id: "powerCableSectionPAE",
                type: "textInput",
                label: "Section",
                errorId: "powerCableSectionPAEError",
                mendatory: true,
                pdfConfig: { dx: -110, dy: - 140, pageIndex }
            },
        ]
    },
    {//5
        id: "powerCablePAE2",
        title: "PAC AIR/EAU - Partie Electrique",
        fields: [
            {
                id: "powerCableTypePAE",
                type: "textInput",
                label: "Type câble d'alimentation",
                errorId: "powerCableTypePAEError",
                mendatory: true,
                pdfConfig: { dx: -370, dy: - 160, pageIndex }
            },
            {
                id: "powerCableLengthPAE",
                type: "textInput",
                isNumeric: true,
                label: "Longueur câble d'alimentation",
                errorId: "powerCableLengthPAEError",
                mendatory: true,
                pdfConfig: { dx: -350, dy: - 180, pageIndex }
            },
        ]
    },
    {//6
        id: "thermostatTypePAE",
        title: "PAC AIR/EAU - Partie Electrique",
        fields: [
            {
                id: "thermostatTypePAE",
                label: "Type de thermostat",
                type: "options",
                errorId: "thermostatTypePAEError",
                items: [
                    { label: 'Filaire', value: 'Filaire', pdfConfig: { dx: -285, dy: - 198, pageIndex } },
                    { label: 'Radio', value: 'Radio', pdfConfig: { dx: -201, dy: - 198, pageIndex } },
                ],
                mendatory: true,
            },
        ]
    },
    {//7
        id: "cableToPullLengthPAE",
        title: "PAC AIR/EAU - Partie Electrique",
        fields: [
            {
                id: "cableToPullLengthPAE",
                type: "textInput",
                isNumeric: true,
                label: "Longueur de câble à tirer",
                errorId: "cableToPullLengthPAEError",
                mendatory: true,
                pdfConfig: { dx: -421, dy: - 218, pageIndex }
            },
        ]
    },
    {//8
        id: "protectionPAE",
        title: "PAC AIR/EAU - Partie Electrique",
        fields: [
            {
                id: "interdiffProtectionPAE",
                type: "textInput",
                label: "Protection de l'interdifférentiel",
                errorId: "interdiffProtectionPAEError",
                mendatory: true,
                pdfConfig: { dx: -257, dy: - 242, pageIndex }
            },
            {
                id: "disjoncteurProtectionPAE",
                type: "textInput",
                label: "Protection de(s) disjoncteur(s)",
                errorId: "disjoncteurProtectionPAEError",
                mendatory: true,
                pdfConfig: { dx: -120, dy: - 242, pageIndex }
            },
        ]
    },
    {//9
        id: "heatingPipeDiameterPAE",
        title: "PAC AIR/EAU - Partie Hydraulique",
        fields: [
            {
                id: "heatingPipeDiameterInputPAE",
                type: "textInput",
                label: "Diamètre des tuyaux chauffage (Entrée)",
                isNumeric: true,
                errorId: "heatingPipeDiameterPAEError",
                mendatory: true,
                pdfConfig: { dx: -311, dy: - 286, pageIndex }
            },
            {
                id: "heatingPipeDiameterOutputPAE",
                type: "textInput",
                label: "Diamètre des tuyaux chauffage (Sortie)",
                isNumeric: true,
                errorId: "heatingPipeDiameterOutputPAEError",
                mendatory: true,
                pdfConfig: { dx: -144, dy: - 286, pageIndex }
            },
        ]
    },
    {//10
        id: "pipeMaterialTypePAE",
        title: "PAC AIR/EAU - Partie Hydraulique",
        fields: [
            {
                id: "pipeMaterialTypePAE",
                label: "Types matériaux tuyaux",
                type: "options",
                items: [
                    { label: "Acier", value: "Acier", pdfConfig: { dx: -315, dy: -307, pageIndex } },
                    { label: "Cuivre", value: "Cuivre", pdfConfig: { dx: -237, dy: - 307, pageIndex } },
                    { label: "Fonte", value: "Fonte", pdfConfig: { dx: -170, dy: - 307, pageIndex } },
                ],
                mendatory: true,
                errorId: "pipeMaterialTypePAEError",
                pdfConfig: { dx: -450, dy: - 305, pageIndex }
            },
        ]
    },
    {//11
        id: "heatingZonesCountPAE",
        title: "PAC AIR/EAU - Partie Hydraulique",
        fields: [
            {
                id: "heatingZonesCountPAE",
                type: "textInput",
                isNumeric: true,
                label: "Nombre zones de chauffage",
                errorId: "heatingZonesCountPAEError",
                mendatory: true,
                pdfConfig: { dx: -421, dy: - 327, pageIndex }
            },
        ]
    },
    {//12
        id: "transmittersTypePAE",
        title: "PAC AIR/EAU - Partie Electrique",
        fields: [
            {
                id: "transmittersTypePAE",
                label: "Type d'émetteurs",
                type: "options",
                errorId: "transmittersTypePAEError",
                items: [
                    { label: 'Radiateur', value: 'Radiateur', pdfConfig: { dx: -325, dy: - 345, pageIndex } },
                    { label: 'Plancher chauffant', value: 'Plancher chauffant', pdfConfig: { dx: -173, dy: - 345, pageIndex } },
                ],
                mendatory: true,
            },
        ]
    },
    {//13
        id: "radiatorMaterialTypePAE",
        title: "PAC AIR/EAU - Partie Hydraulique",
        fields: [
            {
                id: "radiatorMaterialTypePAE",
                label: "Types matériaux radiateurs",
                type: "options",
                items: [
                    { label: "Acier", value: "Acier", pdfConfig: { dx: -359, dy: -364, pageIndex } },
                    { label: "Cuivre", value: "Cuivre", pdfConfig: { dx: -293, dy: - 364, pageIndex } },
                    { label: "Fonte", value: "Fonte", pdfConfig: { dx: -210, dy: - 364, pageIndex } },
                    { label: "Fonte Alu", value: "Fonte Alu", pdfConfig: { dx: -143, dy: - 364, pageIndex } },
                ],
                mendatory: true,
                errorId: "radiatorMaterialTypePAEError",
            },
        ]
    },
    {//14
        id: "radiatorCountPAE",
        title: "PAC AIR/EAU - Partie Hydraulique",
        fields: [
            {
                id: "radiatorCountPAE",
                type: "textInput",
                isNumeric: true,
                label: "Nombre de radiateurs",
                errorId: "radiatorCountPAEError",
                mendatory: true,
                pdfConfig: { dx: -421, dy: - 383, pageIndex }
            },
        ]
    },
    {//15
        id: "isBallAndCircMergeRequiredPAE",
        title: "PAC AIR/EAU - Partie Hydraulique",
        fields: [
            {
                id: "isBallAndCircMergeRequiredPAE",
                label: "Ballon mélange avec circulateur nécessaire",
                type: "options",
                items: [
                    { label: 'Non', value: 'Non', icon: faTimes, iconColor: theme.colors.error, pdfConfig: { dx: -139, dy: - 402, pageIndex }, rollBack: { fields: [{ id: "ballAndCircMergeVolumePAE", type: "string" }] } },
                    { label: 'Oui', value: 'Oui', icon: faCheck, iconColor: "green", pdfConfig: { dx: -340, dy: - 402, pageIndex } },
                ],
                errorId: "isBallAndCircMergeRequiredPAEError",
                mendatory: true
            },
            {
                id: "ballAndCircMergeVolumePAE",
                type: "textInput",
                isNumeric: true,
                label: "Combien en litre ?",
                errorId: "ballAndCircMergeVolumePAEError",
                mendatory: true,
                isConditional: true,
                condition: { with: "isBallAndCircMergeRequiredPAE", values: ["Oui"] },
                pdfConfig: { dx: -308, dy: - 402, pageIndex }
            },
        ]
    },
    {//16
        id: "isExpansionTankRequiredPAE",
        title: "PAC AIR/EAU - Partie Hydraulique",
        fields: [
            {
                id: "isExpansionTankRequiredPAE",
                label: "Ballon mélange avec circulateur nécessaire",
                type: "options",
                items: [
                    { label: 'Non', value: 'Non', icon: faTimes, iconColor: theme.colors.error, pdfConfig: { dx: -172, dy: - 116, pageIndex }, rollBack: { fields: [{ id: "expansionTankVolumePAE", type: "string" }] } },
                    { label: 'Oui', value: 'Oui', icon: faCheck, iconColor: "green", pdfConfig: { dx: -340, dy: - 420, pageIndex } },
                ],
                errorId: "isExpansionTankRequiredPAEError",
                mendatory: true
            },
            {
                id: "expansionTankVolumePAE",
                type: "textInput",
                isNumeric: true,
                label: "6% volume d'eau (en L)",
                errorId: "expansionTankVolumePAEError",
                mendatory: true,
                isConditional: true,
                condition: { with: "isExpansionTankRequiredPAE", values: ["Oui"] },
                pdfConfig: { dx: -229, dy: - 420, pageIndex }
            },
        ]
    },
    {//17
        id: "hydraulicModuleLocationPAE",
        title: "PAC AIR/EAU - Partie Hydraulique",
        fields: [
            {
                id: "hydraulicModuleLocationPAE",
                type: "textInput",
                label: "Emplacement module hydraulique INT (sauf monobloc)",
                errorId: "hydraulicModuleLocationPAEError",
                mendatory: true,
                pdfConfig: { dx: -360, dy: - 440, pageIndex }
            },
        ]
    },
    {//18
        id: "commentsElecPAE",
        title: "PAC AIR/EAU - Partie Hydraulique",
        fields: [
            {
                id: "commentElecPAE",
                type: "textInput",
                label: "Commentaires",
                errorId: "commentsElecPAEError",
                pdfConfig: { dx: -421, dy: - 463, pageIndex }
            },
        ]
    },
    {//19
        id: "tubeDiameterPAE",
        title: "PAC AIR/EAU - Partie EC Sanitaire",
        fields: [
            {
                id: "tubeDiameterEFPAE",
                type: "textInput",
                isNumeric: true,
                label: "Diamètre tube EF",
                errorId: "tubeDiameterEFPAEError",
                mendatory: true,
                pdfConfig: { dx: -275, dy: - 503, pageIndex }
            },
            {
                id: "tubeDiameterECSPAE",
                type: "textInput",
                isNumeric: true,
                label: "Diamètre tube ECS",
                errorId: "tubeDiameterECSPAEError",
                mendatory: true,
                pdfConfig: { dx: -140, dy: - 503, pageIndex }
            },
        ]
    },
    {//20
        id: "tubeMaterialsPAE",
        title: "PAC AIR/EAU - Partie EC Sanitaire",
        fields: [
            {
                id: "tubeMaterialsPAE",
                label: "Type matériaux tuyaux",
                type: "options",
                items: [
                    { label: "Acier", value: "Acier", pdfConfig: { dx: -323, dy: -522, pageIndex } },
                    { label: "Cuivre", value: "Cuivre", pdfConfig: { dx: -245, dy: - 522, pageIndex } },
                    { label: "Plastique", value: "Plastique", pdfConfig: { dx: -177, dy: - 522, pageIndex } },
                ],
                mendatory: true,
                errorId: "tubeMaterialsPAEError",
            },
        ]
    },
    {//21
        id: "PVCdrainingPAE",
        title: "PAC AIR/EAU - Partie EC Sanitaire",
        fields: [
            {
                id: "PVCdrainingPAE",
                label: "Type d'émetteurs",
                type: "options",
                errorId: "PVCdrainingPAEError",
                items: [
                    { label: 'Existante', value: 'Existante', pdfConfig: { dx: -321, dy: - 541, pageIndex } },
                    { label: 'Non existante', value: 'Non existante', pdfConfig: { dx: -199, dy: - 541, pageIndex } },
                ],
                mendatory: true,
            },
        ]
    },
    {//22
        id: "PVCdrainingDiameterPAE",
        title: "PAC AIR/EAU - Partie Hydraulique",
        fields: [
            {
                id: "PVCdrainingDiameterPAE",
                type: "textInput",
                isNumeric: true,
                label: "Si évacuation PVC existante : diamètre (en mm)",
                errorId: "PVCdrainingDiameterPAEError",
                pdfConfig: { dx: -253, dy: - 560, pageIndex }
            },
        ]
    },
    {//23
        id: "GELocationPAE",
        title: "PAC AIR/EAU - Partie Groupe Ext.",
        fields: [
            {
                id: "GELocationPAE",
                type: "textInput",
                label: "Emplacement GE (hauteur en cm)",
                isNumeric: true,
                mendatory: true,
                errorId: "GELocationPAEError",
                pdfConfig: { dx: -70, dy: - 596, pageIndex }
            },
        ]
    },
    {//24
        id: "bracketTypePAE",
        title: "Pac Air/Air - Partie Groupe Ext.",
        fields: [
            {
                id: "bracketTypePAE",
                label: "Type de support",
                type: "options",
                items: [
                    { label: "Au sol sur rubber foot", value: "Au sol sur rubber foo", pdfConfig: { dx: -401, dy: -615, pageIndex } },
                    { label: "Support mural classique", value: "Support mural classique", pdfConfig: { dx: -279, dy: - 615, pageIndex } },
                    { label: "Support mural mupro", value: "Support mural mupro", pdfConfig: { dx: -152, dy: - 615, pageIndex } },
                ],
                mendatory: true,
                errorId: "bracketTypePAEError",
            },
        ]
    },
    {//25
        id: "capacitorDrainingPAE",
        title: "PAC AIR/EAU - Partie Groupe Ext.",
        fields: [
            {
                id: "capacitorDrainingPAE",
                type: "textInput",
                label: "Evacuation condensateur",
                mendatory: true,
                errorId: "capacitorDrainingPAEError",
                pdfConfig: { dx: -421, dy: - 634, pageIndex }
            },
        ]
    },
    {//26
        id: "commentsExtGroupPAE",
        title: "PAC AIR/EAU - Partie Groupe Ext.",
        fields: [
            {
                id: "commentsExtGroupPAE",
                type: "textInput",
                label: "Commentaires",
                errorId: "commentsExtGroupPAEError",
                pdfConfig: { dx: -421, dy: - 658, pageIndex }
            },
        ]
    },
    {//27
        id: "linksDiameterPAE",
        title: "PAC AIR/EAU - Partie Frigorifique",
        fields: [
            {
                id: "linksDiameterPAE",
                type: "textInput",
                label: "Diamètre liaison",
                isNumeric: true,
                errorId: "linksDiameterPAEError",
                pdfConfig: { dx: -421, dy: - 700, pageIndex }
            },
        ]
    },
    {//28
        id: "linksLengthPAE",
        title: "PAC AIR/EAU - Partie Frigorifique",
        fields: [
            {
                id: "linksLengthPAE",
                type: "textInput",
                label: "Longueur des liaisons (en m)",
                isNumeric: true,
                errorId: "linksLengthPAEError",
                pdfConfig: { dx: -240, dy: - 719, pageIndex }
            },
        ]
    },
    {//29
        id: "linksPassagePAE",
        title: "PAC AIR/EAU - Partie Frigorifique",
        fields: [
            {
                id: "linksPassagePAE",
                type: "textInput",
                label: "Passage des liaisons",
                errorId: "linksPassagePAEError",
                pdfConfig: { dx: -421, dy: - 740, pageIndex }
            },
        ]
    },
    {//30
        id: "linksTypePAE",
        title: "PAC AIR/EAU - Partie Frigorifique",
        fields: [
            {
                id: "linksTypePAE",
                label: "Type de liaisons",
                type: "options",
                errorId: "linksTypePAEError",
                items: [
                    { label: '80Ø', value: '80Ø', pdfConfig: { dx: -309, dy: - 757, pageIndex } },
                    { label: '120Ø', value: '120Ø', pdfConfig: { dx: -176, dy: - 757, pageIndex } },
                ],
                mendatory: true,
            },
        ]
    },
    {//31
        id: "linksLengthPAE",
        title: "PAC AIR/EAU - Partie Frigorifique",
        fields: [
            {
                id: "linksLengthPAE",
                type: "textInput",
                label: "Longueur des liaisons",
                isNumeric: true,
                errorId: "linksLengthPAEError",
                pdfConfig: { dx: -421, dy: - 776, pageIndex }
            },
        ]
    },
        {//32
            id: "noticePAE",
            title: "PAC AIR/EAU - Remarques",
            fields: [
                {
                    id: "noticePAE",
                    type: "textInput",
                    label: "Remarques",
                    errorId: "noticePAEError",
                    pdfConfig: { dx: -421, dy: - 819, pageIndex }
                },
            ]
        },
    ]

    return { model }
}
export const checklistBTModel = (pageIndex) => {
    const model = [
        {//1
            id: "blocTypeBT",
            title: "CHAUFFE-EAU THERMODYNAMIQUE - Partie Electrique",
            fields: [
                {
                    id: "blocTypeBT",
                    label: "Type de bloc",
                    type: "options",
                    items: [
                        { label: 'Monobloc', value: 'Monobloc', pdfConfig: { dx: -374, dy: - 107, pageIndex } },
                        { label: 'Bi-Bloc', value: 'Bi-Bloc', pdfConfig: { dx: -260, dy: - 107, pageIndex } },
                    ],
                    errorId: "blocTypeBTError",
                    mendatory: true
                },
            ]
        },
        {//2
            id: "isPowerCableBT",
            title: "CHAUFFE-EAU THERMODYNAMIQUE - Partie Electrique",
            fields: [
                {
                    id: "isPowerCableBT",
                    label: "Câble d’alimentation présent ?",
                    type: "options",
                    items: [
                        { label: 'Non', value: 'Non', icon: faTimes, iconColor: theme.colors.error, pdfConfig: { dx: -201, dy: - 135, pageIndex } },
                        { label: 'Oui', value: 'Oui', icon: faCheck, iconColor: "green", pdfConfig: { dx: -298, dy: - 135, pageIndex } },
                    ],
                    errorId: "isPowerCableBTError",
                    mendatory: true
                },
            ]
        },
        {//3
            id: "tubeDiameterBT",
            title: "CHAUFFE-EAU THERMODYNAMIQUE - Partie Hydraulique",
            fields: [
                {
                    id: "tubeDiameterEFBT",
                    type: "textInput",
                    isNumeric: true,
                    label: "Diamètre tube EF",
                    errorId: "tubeDiameterEFBTError",
                    mendatory: true,
                    pdfConfig: { dx: -270, dy: - 211, pageIndex }
                },
                {
                    id: "tubeDiameterECSBT",
                    type: "textInput",
                    isNumeric: true,
                    label: "Diamètre tube ECS",
                    errorId: "tubeDiameterECSBTError",
                    mendatory: true,
                    pdfConfig: { dx: -170, dy: - 211, pageIndex }
                },
            ]
        },
        {//4
            id: "radiatorMaterialsBT",
            title: "CHAUFFE-EAU THERMODYNAMIQUE - Partie Hydraulique",
            fields: [
                {
                    id: "radiatorMaterialsBT",
                    label: "Type matériaux radiateur",
                    type: "options",
                    items: [
                        { label: "Acier", value: "Acier", pdfConfig: { dx: -391, dy: -239, pageIndex } },
                        { label: "Cuivre", value: "Cuivre", pdfConfig: { dx: -247, dy: - 239, pageIndex } },
                        { label: "Plastique", value: "Plastique", pdfConfig: { dx: -126, dy: - 239, pageIndex } },
                    ],
                    mendatory: true,
                    errorId: "radiatorMaterialsBTError",
                },
            ]
        },
        {//5
            id: "isSpaceEnoughBT",
            title: "CHAUFFE-EAU THERMODYNAMIQUE - Partie Frigorifique",
            fields: [
                {
                    id: "isSpaceEnoughBT",
                    type: "textInput",
                    label: "Vérifier espace suffisant pour emplacement ballon",
                    errorId: "isSpaceEnoughBTError",
                    mendatory: true,
                    pdfConfig: { dx: -420, dy: - 282, pageIndex }
                },
            ]
        },
        {//6
            id: "linksDiameterBT",
            title: "CHAUFFE-EAU THERMODYNAMIQUE - Partie Frigorifique",
            fields: [
                {
                    id: "linksDiameterBT",
                    type: "textInput",
                    label: "Diamètre liaison",
                    isNumeric: true,
                    errorId: "linksDiameterBTError",
                    pdfConfig: { dx: -421, dy: - 315, pageIndex }
                },
            ]
        },
        {//7
            id: "linksLengthBT",
            title: "CHAUFFE-EAU THERMODYNAMIQUE - Partie Frigorifique",
            fields: [
                {
                    id: "linksLengthBT",
                    type: "textInput",
                    label: "Longueur des liaisons (en mm)",
                    isNumeric: true,
                    errorId: "linksLengthBTError",
                    pdfConfig: { dx: -257, dy: - 343, pageIndex }
                },
            ]
        },
        {//8
            id: "linksPassageBT",
            title: "CHAUFFE-EAU THERMODYNAMIQUE - Partie Emplacement",
            fields: [
                {
                    id: "linksPassageBT",
                    type: "textInput",
                    label: "Passage des liaisons",
                    errorId: "linksPassageBTError",
                    mendatory: true,
                    pdfConfig: { dx: -420, dy: - 372, pageIndex }
                },
            ]
        },
        {//9
            id: "GELocationBT",
            title: "CHAUFFE-EAU THERMODYNAMIQUE - Partie Exterieure",
            fields: [
                {
                    id: "GELocationBT",
                    label: "Type de support",
                    type: "options",
                    items: [
                        { label: "Au sol", value: "Au sol", pdfConfig: { dx: -384, dy: -418, pageIndex } },
                        { label: "Support classique", value: "Support classique", pdfConfig: { dx: -274, dy: - 418, pageIndex } },
                        { label: "Support Mupro", value: "Support Mupro", pdfConfig: { dx: -156, dy: - 418, pageIndex } },
                    ],
                    mendatory: true,
                    errorId: "GELocationBTError",
                    pdfConfig: { dx: -450, dy: - 305, pageIndex }
                },
            ]
        },
        {//10
            id: "PVCdrainingBT",
            title: "CHAUFFE-EAU THERMODYNAMIQUE - Partie Intérieur",
            fields: [
                {
                    id: "PVCdrainingToDoBT",
                    type: "options",
                    items: [
                        { label: "À faire", value: "À faire", pdfConfig: { dx: -295, dy: - 466, pageIndex } },
                    ],
                    label: "Evacuation PVC existante",
                    errorId: "PVCdrainingToDoBTError",
                },
                {
                    id: "PVCdrainingDiameterBT",
                    type: "textInput",
                    label: "Diamètre PVC",
                    isNumeric: true,
                    errorId: "PVCdrainingDiameterBTError",
                    mendatory: true,
                    pdfConfig: { dx: -170, dy: - 466, pageIndex }
                },
                {
                    id: "PVCDoubleBT",
                    type: "textInput",
                    label: "En doublage",
                    errorId: "PVCDoubleBTError",
                    mendatory: true,
                    pdfConfig: { dx: -421, dy: - 494, pageIndex }
                },
            ]
        },
        {//11
            id: "ifMonoblocBT",
            title: "CHAUFFE-EAU THERMODYNAMIQUE - Partie Intérieur",
            fields: [
                {
                    id: "ifMonoblocBT",
                    type: "textInput",
                    label: "Si B.T monobloc",
                    errorId: "ifMonoblocBTError",
                    pdfConfig: { dx: -420, dy: - 541, pageIndex }
                },
            ]
        },
        {//12
            id: "repressionDrainTypeBT",
            title: "CHAUFFE-EAU THERMODYNAMIQUE - Partie Intérieur",
            fields: [
                {
                    id: "repressionDrainTypeBT",
                    type: "textInput",
                    label: "Type d'évacuation pour refoulement",
                    mendatory: true,
                    errorId: "repressionDrainTypeBTError",
                    pdfConfig: { dx: -420, dy: - 568, pageIndex }
                },
            ]
        },
        {//13
            id: "commentsInternPartBT",
            title: "CHAUFFE-EAU THERMODYNAMIQUE - Partie Intérieur",
            fields: [
                {
                    id: "commentsInternPartBT",
                    type: "textInput",
                    label: "Commentaires",
                    errorId: "commentsInternPartBTError",
                    pdfConfig: { dx: -420, dy: - 596, pageIndex }
                },
            ]
        },
        {//14
            id: "extBT1",
            title: "CHAUFFE-EAU THERMODYNAMIQUE - Partie Intérieur",
            fields: [
                {
                    id: "extLenghtCountBT",
                    type: "textInput",
                    isNumeric: true,
                    label: "Nombre de longueur",
                    errorId: "extLenghtCountBTError",
                    pdfConfig: { dx: -360, dy: - 623, pageIndex }
                },
                {
                    id: "extFittingSleeveCountBT",
                    type: "textInput",
                    isNumeric: true,
                    label: "Nombre manchon raccord",
                    errorId: "extFittingSleeveCountBTError",
                    pdfConfig: { dx: -343, dy: - 698, pageIndex }
                },
            ]
        },
        {//15
            id: "extBT2",
            title: "CHAUFFE-EAU THERMODYNAMIQUE - Partie Intérieur",
            fields: [
                {
                    id: "extNinetyElbowCountBT",
                    type: "textInput",
                    isNumeric: true,
                    label: "Nombre de coude 90°",
                    errorId: "extNinetyElbowCountBTError",
                    pdfConfig: { dx: -360, dy: - 648, pageIndex }
                },
                {
                    id: "extFourtyFiveElbowCountBT",
                    type: "textInput",
                    isNumeric: true,
                    label: "Nombre de coude 45°",
                    errorId: "extFourtyFiveElbowCountBTError",
                    pdfConfig: { dx: -360, dy: - 673, pageIndex }
                },
            ]
        },
        {//16
            id: "noticeBT",
            title: "CHAUFFE-EAU THERMODYNAMIQUE - Remarques",
            fields: [
                {
                    id: "noticeBT",
                    type: "textInput",
                    label: "Remarques",
                    errorId: "noticeBTError",
                    pdfConfig: { dx: -421, dy: - 752, pageIndex }
                },
            ]
        },
        {//17
            id: "materialPropositionBT",
            title: "CHAUFFE-EAU THERMODYNAMIQUE - Remarques",
            fields: [
                {
                    id: "materialPropositionBT",
                    type: "textInput",
                    label: "Proposition matériel adéquat si refus VT",
                    errorId: "materialPropositionBTError",
                    pdfConfig: { dx: -421, dy: - 791, pageIndex }
                },
            ]
        },
    ]

    return { model }
}
export const checklistBSModel = (pageIndex) => {
    const model = [
        {//1
            id: "isPowerCable",
            title: "BALLON SOLAIRE - Partie Electrique",
            fields: [
                {
                    id: "isPowerCable",
                    label: "Câble d’alimentation présent ?",
                    type: "options",
                    items: [
                        { label: 'Non', value: 'Non', icon: faTimes, iconColor: theme.colors.error, pdfConfig: { dx: -172, dy: - 116, pageIndex } },
                        { label: 'Oui', value: 'Oui', icon: faCheck, iconColor: "green", pdfConfig: { dx: -290, dy: - 116, pageIndex } },
                    ],
                    errorId: "isPowerCableError",
                    mendatory: true
                },
            ]
        },
        {//2
            id: "tubeDiameter",
            title: "BALLON SOLAIRE - Partie Hydraulique",
            fields: [
                {
                    id: "tubeDiameterEF",
                    type: "textInput",
                    isNumeric: true,
                    label: "Diamètre tube EF",
                    errorId: "tubeDiameterEFError",
                    mendatory: true,
                    pdfConfig: { dx: -260, dy: - 220, pageIndex }
                },
                {
                    id: "tubeDiameterECS",
                    type: "textInput",
                    isNumeric: true,
                    label: "Diamètre tube ECS",
                    errorId: "tubeDiameterECSError",
                    mendatory: true,
                    pdfConfig: { dx: -140, dy: - 220, pageIndex }
                },
            ]
        },
        {//3
            id: "tubeMaterials",
            title: "BALLON SOLAIRE - Partie Hydraulique",
            fields: [
                {
                    id: "tubeMaterials",
                    label: "Matériaux des tubes",
                    type: "options",
                    items: [
                        { label: "Acier", value: "Acier", pdfConfig: { dx: -419, dy: -261, pageIndex } },
                        { label: "Cuivre", value: "Cuivre", pdfConfig: { dx: -314, dy: - 261, pageIndex } },
                        { label: "Plastique", value: "Plastique", pdfConfig: { dx: -218, dy: - 261, pageIndex } },
                    ],
                    mendatory: true,
                    errorId: "tubeMaterialsError",
                    pdfConfig: { dx: -450, dy: - 305, pageIndex }
                },
            ]
        },
        {//4
            id: "PVCdraining",
            title: "BALLON SOLAIRE - Partie Hydraulique",
            fields: [
                {
                    id: "PVCdrainingToDo",
                    type: "options",
                    items: [
                        { label: "À faire", value: "À faire", pdfConfig: { dx: -309, dy: - 301, pageIndex } },
                    ],
                    label: "Evacuation PVC existante",
                    errorId: "PVCdrainingToDoError",
                },
                {
                    id: "PVCdrainingDiameter",
                    type: "textInput",
                    label: "Diamètre",
                    isNumeric: true,
                    errorId: "PVCdrainingDiameterError",
                    mendatory: true,
                    pdfConfig: { dx: -120, dy: - 301, pageIndex }
                },
            ]
        },
        {//5
            id: "isDoubleTube",
            title: "BALLON SOLAIRE - Partie Hydraulique",
            fields: [
                {
                    id: "isDoubleTube",
                    label: "Tube en doublage",
                    type: "options",
                    items: [
                        { label: 'Non', value: 'Non', icon: faTimes, iconColor: theme.colors.error, pdfConfig: { dx: -146, dy: - 342, pageIndex } },
                        { label: 'Oui', value: 'Oui', icon: faCheck, iconColor: "green", pdfConfig: { dx: -315, dy: - 342, pageIndex } },
                    ],
                    errorId: "isDoubleTubeError",
                    mendatory: true
                },
            ]
        },
        {//6
            id: "isSpaceEnough",
            title: "BALLON SOLAIRE - Partie Emplacement",
            fields: [
                {
                    id: "isSpaceEnough",
                    type: "textInput",
                    label: "Vérifier espace suffisant pour emplacement ballon",
                    errorId: "isSpaceEnoughError",
                    mendatory: true,
                    pdfConfig: { dx: -420, dy: - 399, pageIndex }
                },
            ]
        },
        {//7
            id: "linksPassageBS",
            title: "BALLON SOLAIRE - Partie Emplacement",
            fields: [
                {
                    id: "linksPassageBS",
                    type: "textInput",
                    label: "Passage des liaisons, longueur",
                    errorId: "linksPassageBSError",
                    mendatory: true,
                    pdfConfig: { dx: -420, dy: - 447, pageIndex }
                },
            ]
        },
        {//8
            id: "sensorsNumber",
            title: "BALLON SOLAIRE - Capteur(s) Solaire",
            fields: [
                {
                    id: "sensorsNumber",
                    type: "textInput",
                    label: "Nombre de capteur solaire",
                    isNumeric: true,
                    errorId: "sensorsNumberError",
                    mendatory: true,
                    pdfConfig: { dx: -420, dy: - 511, pageIndex }
                },
            ]
        },
        {//9
            id: "calpinageCS",
            title: "BALLON SOLAIRE - Capteur(s) Solaire",
            fields: [
                {
                    id: "calpinageCS",
                    type: "textInput",
                    label: "Calpinage",
                    errorId: "calpinageCSError",
                    mendatory: true,
                    pdfConfig: { dx: -420, dy: - 552, pageIndex }
                },
            ]
        },
        {//10
            id: "sensorLocation",
            title: "BALLON SOLAIRE - Capteur(s) Solaire",
            fields: [
                {
                    id: "sensorLocation",
                    type: "textInput",
                    label: "Emplacement capteur",
                    errorId: "sensorLocationError",
                    mendatory: true,
                    pdfConfig: { dx: -420, dy: - 592, pageIndex }
                },
            ]
        },
        {//11
            id: "orientationCS",
            title: "BALLON SOLAIRE - Capteur(s) Solaire",
            fields: [
                {
                    id: "orientationCS",
                    label: "Orientation",
                    type: "options",
                    items: [
                        { label: 'Portrait', value: 'Portrait', pdfConfig: { dx: -311, dy: - 631, pageIndex } },
                        { label: 'Paysage', value: 'Paysage', pdfConfig: { dx: -168, dy: - 631, pageIndex } },
                    ],
                    errorId: "orientationCSError",
                    mendatory: true
                },
            ]
        },
        {//12
            id: "solarMaskBS",
            title: "BALLON SOLAIRE - Capteur(s) Solaire",
            fields: [
                {
                    id: "solarMaskBS",
                    type: "textInput",
                    label: "Masque solaire",
                    mendatory: true,
                    errorId: "solarMaskBSError",
                    pdfConfig: { dx: -421, dy: - 672, pageIndex }
                },
            ]
        },
        {//13
            id: "noticeCS",
            title: "BALLON SOLAIRE - Capteur(s) Solaire",
            fields: [
                {
                    id: "noticeCS",
                    type: "textInput",
                    label: "Remarque",
                    errorId: "noticeCSError",
                    pdfConfig: { dx: -421, dy: - 760, pageIndex }
                },
            ]
        },
        {//14
            id: "materialPropositionBS",
            title: "BALLON SOLAIRE - Capteur(s) Solaire",
            fields: [
                {
                    id: "materialPropositionBS",
                    type: "textInput",
                    label: "Proposition matériel adéquat si refus VT",
                    errorId: "materialPropositionBSError",
                    pdfConfig: { dx: -421, dy: - 807, pageIndex }
                },
            ]
        },
    ]

    return { model }
}
export const checklistPVModel = (pageIndex) => {
    const model = [
        {//1
            id: "panelTotalPower",
            title: "PV - Partie Electrique",
            fields: [
                {
                    id: "panelTotalPower",
                    type: "textInput",
                    isNumeric: true,
                    label: "Puissance totale des panneaux",
                    errorId: "panelTotalPowerError",
                    mendatory: true,
                    pdfConfig: { dx: -420, dy: - 129, pageIndex }
                },
            ]
        },
        {//2
            id: "counterLocation",
            title: "PV - Partie Electrique",
            fields: [
                {
                    id: "counterLocation",
                    type: "textInput",
                    label: "Emplacement compteur",
                    errorId: "counterLocationError",
                    mendatory: true,
                    pdfConfig: { dx: -420, dy: - 166, pageIndex }
                },
            ]
        },
        {//3
            id: "phaseType",
            title: "PV - Partie Electrique",
            fields: [
                {
                    id: "phaseType",
                    label: "Type de phase",
                    type: "options",
                    items: [
                        { label: 'Monophasé', value: 'Monophasé', pdfConfig: { dx: -321, dy: - 205, pageIndex } },
                        { label: 'Triphasé', value: 'Triphasé', pdfConfig: { dx: -169, dy: - 205, pageIndex } },
                    ],
                    errorId: "phaseTypeError",
                    mendatory: true
                },
            ]
        },
        {//4
            id: "counterSubPower",
            title: "PV - Partie Electrique",
            fields: [
                {
                    id: "counterSubPower",
                    type: "textInput",
                    isNumeric: true,
                    label: "Puissance abonnement compteur",
                    errorId: "counterSubPowerError",
                    mendatory: true,
                    pdfConfig: { dx: -200, dy: - 243, pageIndex }
                },
            ]
        },
        {//5
            id: "groundResistance",
            title: "PV - Partie Electrique",
            fields: [
                {
                    id: "groundResistance",
                    type: "textInput",
                    isNumeric: true,
                    label: "Résistance à la terre",
                    errorId: "groundResistanceError",
                    mendatory: true,
                    pdfConfig: { dx: -205, dy: - 282, pageIndex }
                },
            ]
        },
        {//6
            id: "inverterTypes",
            title: "PV - Partie Technique",
            fields: [
                {
                    id: "inverterTypes",
                    label: "Types d'onduleurs",
                    type: "options",
                    isMultiOptions: true,
                    items: [
                        { label: 'Central', value: 'Central', pdfConfig: { dx: -334, dy: - 342, pageIndex } },
                        { label: 'Micro onduleur', value: 'Micro onduleur', pdfConfig: { dx: -264, dy: - 342, pageIndex } },
                        { label: 'Solaredge', value: 'Solaredge', pdfConfig: { dx: -163, dy: - 342, pageIndex } },
                    ],
                    errorId: "inverterTypesError",
                    mendatory: true
                },
            ]
        },
        {//7
            id: "inverterCount",
            title: "PV - Partie Technique",
            fields: [
                {
                    id: "inverterCount",
                    type: "textInput",
                    isNumeric: true,
                    label: "Nombre d'onduleurs",
                    errorId: "inverterCountError",
                    mendatory: true,
                    pdfConfig: { dx: -420, dy: - 381, pageIndex }
                },
            ]
        },
        {//8
            id: "inverterPower",
            title: "PV - Partie Technique",
            fields: [
                {
                    id: "inverterPower",
                    type: "textInput",
                    isNumeric: true,
                    label: "Puissance onduleur",
                    errorId: "inverterPowerError",
                    mendatory: true,
                    pdfConfig: { dx: -420, dy: - 420, pageIndex }
                },
            ]
        },
        {//9
            id: "orientationPV",
            title: "PV - Partie Emplacement",
            fields: [
                {
                    id: "orientationPV",
                    label: "Orientation du champ photovoltaîque",
                    type: "options",
                    items: [
                        { label: 'Portrait', value: 'Portrait', pdfConfig: { dx: -323, dy: - 479, pageIndex } },
                        { label: 'Paysage', value: 'Paysage', pdfConfig: { dx: -165, dy: - 479, pageIndex } },
                    ],
                    errorId: "orientationPVError",
                    mendatory: true
                },
            ]
        },
        {//10
            id: "columnsCountPV",
            title: "PV - Partie Emplacement",
            fields: [
                {
                    id: "columnsCountPV",
                    type: "textInput",
                    isNumeric: true,
                    label: "Nombre de colonnes",
                    errorId: "columnsCountPVPVError",
                    mendatory: true,
                    pdfConfig: { dx: -421, dy: - 520, pageIndex }
                },
            ]
        },
        {//11
            id: "linesCountPV",
            title: "PV - Partie Emplacement",
            fields: [
                {
                    id: "linesCountPV",
                    type: "textInput",
                    isNumeric: true,
                    label: "Nombre de lignes",
                    errorId: "linesCountPVError",
                    mendatory: true,
                    pdfConfig: { dx: -421, dy: - 557, pageIndex }
                },
            ]
        },
        {//12
            id: "solarMaskPV",
            title: "PV - Partie Emplacement",
            fields: [
                {
                    id: "solarMaskPV",
                    type: "textInput",
                    label: "Masque solaire",
                    mendatory: true,
                    errorId: "solarMaskPVError",
                    pdfConfig: { dx: -421, dy: - 598, pageIndex }
                },
            ]
        },
        {//13
            id: "calpinagePV",
            title: "PV - Partie Emplacement",
            fields: [
                {
                    id: "calpinagePV",
                    type: "textInput",
                    label: "Calpinage",
                    errorId: "calpinagePVError",
                    mendatory: true,
                    pdfConfig: { dx: -420, dy: - 633, pageIndex }
                },
            ]
        },
        {//14
            id: "panelsLocationPV",
            title: "PV - Partie Emplacement",
            fields: [
                {
                    id: "panelsLocationPV",
                    type: "textInput",
                    label: "Emplacemment panneaux",
                    errorId: "panelsLocationPVError",
                    mendatory: true,
                    pdfConfig: { dx: -420, dy: - 672, pageIndex }
                },
            ]
        },
        {//15
            id: "commentsPV",
            title: "PV - Partie Emplacement",
            fields: [
                {
                    id: "commentsPV",
                    type: "textInput",
                    label: "Commentaires",
                    errorId: "commentsPVError",
                    pdfConfig: { dx: -421, dy: - 740, pageIndex }
                },
            ]
        },
        {//16
            id: "noticePV",
            title: "PV - Partie Emplacement",
            fields: [
                {
                    id: "noticePV",
                    type: "textInput",
                    label: "Remarque",
                    errorId: "noticePVError",
                    pdfConfig: { dx: -421, dy: - 791, pageIndex }
                },
            ]
        },
    ]

    return { model }
}

//VERSIONNING:

// export const pvReceptionModels = {
//     { model: pvReceptionModel1(), version: 1 }  
// }

// ---> find where version is MAX