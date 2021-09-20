
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

export const ficheTechModel = () => {

    const model = [
        {//2
            id: "subPower",
            title: "",
            fields: [{
                id: "subPower",
                type: "textInput",
                isNumeric: true,
                label: "Puissance de l'abonnement souscrit",
                errorId: "subPowerError",
                mendatory: true,
                pdfConfig: { dx: -260, dy: - 187, pageIndex: 0 }
            }]
        },
        {//3
            id: "phaseType",
            title: "",
            fields: [{
                id: "phaseType",
                label: "Type de phase",
                type: "options",
                items: [
                    { label: 'Monophasé', value: 'Monophasé', icon: faQuestionCircle, pdfConfig: { dx: -520, dy: - 270, squareSize: 10, pageIndex: 0 } },
                    { label: 'Triphasé', value: 'Triphasé', icon: faQuestionCircle, pdfConfig: { dx: -520, dy: - 300, squareSize: 10, pageIndex: 0 } },
                ],
                mendatory: true,
            }]
        },
        {//6
            id: "eletricPanelSize",
            title: "",
            fields: [{
                id: "eletricPanelSize",
                type: "textInput",
                isNumeric: true,
                label: "Taille du tableau électrique à installer",
                instruction: { priority: "low", message: "Renseigner le nombre de modules" },
                errorId: "eletricPanelSizeError",
                mendatory: true,
                pdfConfig: { dx: -240, dy: - 339, pageIndex: 0 }
            }]
        },
        //5 Checklist produits (autoGen)
        //7 Montant accompte (autoGen)
        { //1
            id: "electricMeterPicture",
            title: "",
            fields: [
                {
                    id: "electricMeterPicture",
                    label: "Photo du compteur électrique",
                    type: "image",
                    errorId: "electricMeterPictureError",
                    mendatory: true,
                    pdfConfig: { dx: -10, dy: - 10, pageIndex: 0 }
                },
            ]
        },
        { //4
            id: "electricPanelPicture",
            title: "",
            fields: [
                {
                    id: "electricPanelPicture",
                    label: "Photo du tableau électrique existant",
                    type: "image",
                    errorId: "electricPanelPictureError",
                    mendatory: true,
                    pdfConfig: { dx: -10, dy: - 10, pageIndex: 0 }
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