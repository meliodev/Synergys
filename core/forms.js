import { faBuilding, faCheck, faHouse, faTimes, faQuestionCircle, faMars, faVenus } from "@fortawesome/pro-light-svg-icons";
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
                pdfConfig: { dx: -520, dy: - 155, pageIndex: 3 }
            },
            {
                id: "nameMiss",
                type: "textInput",
                label: "Madame",
                errorId: "nameMissError",
                pdfConfig: { dx: -235, dy: - 155, pageIndex: 3 }
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
                    { label: "Situation professionnelle Mr", value: "" },
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
                pdfConfig: { dx: -450, dy: - 305, pageIndex: 3 }
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
                pdfConfig: { dx: -510, dy: - 330, pageIndex: 3 }
            },
            {
                id: "proSituationMiss",
                type: "picker",
                items: [
                    { label: "Situation professionnelle Mme", value: "" },
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
                pdfConfig: { dx: -150, dy: - 305, pageIndex: 3 }
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
                pdfConfig: { dx: -225, dy: - 330, pageIndex: 3 }
            },
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
                    { label: 'Propriétaire', value: 'Propriétaire', icon: faQuestionCircle, pdfConfig: { dx: -445, dy: - 387, pageIndex: 3 } },
                    { label: 'Locataire', value: 'Locataire', icon: faQuestionCircle, pdfConfig: { dx: -523, dy: - 387, pageIndex: 3 } },
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
                label: "Année dans le logement",
                type: "number",
                errorId: "yearsHousingError",
                pdfConfig: { dx: -220, dy: - 386, pageIndex: 3 }
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
                label: "Revenu fiscal de référence en €",
                errorId: "taxIncomeError",
                mendatory: true,
                pdfConfig: { dx: -447, dy: - 405, pageIndex: 3 }
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
                pdfConfig: { dx: -425, dy: - 443, pageIndex: 3 }
            },
            {
                id: "childrenCount",
                type: "textInput",
                isNumeric: true,
                label: "Nombre d'enfants à charge (-18 ans)",
                errorId: "childrenCountError",
                mendatory: true,
                pdfConfig: { dx: -150, dy: - 443, pageIndex: 3 }

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
                    { label: 'Non', value: 'Non', icon: faTimes, iconColor: theme.colors.error, pdfConfig: { dx: -190, dy: - 484, pageIndex: 3 }, rollBack: { fields: [{ id: "aidAndSubWorksType", type: "string" }, { id: "aidAndSubWorksCost", type: "string" }] } },
                    { label: 'Oui', value: 'Oui', icon: faCheck, iconColor: "green", pdfConfig: { dx: -247, dy: - 484, pageIndex: 3 } },
                ],
                errorId: "aidAndSubError",
                mendatory: true
            },
            {
                id: "aidAndSubWorksType",
                type: "picker",
                items: [
                    { label: "Nature des travaux", value: "" },
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
                pdfConfig: { dx: -490, dy: - 502, pageIndex: 3 }
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
                pdfConfig: { dx: -130, dy: - 502, pageIndex: 3 }
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
                    { label: 'Maison individuelle', value: 'Maison individuelle', icon: faHouse, pdfConfig: { dx: -466, dy: - 597, pageIndex: 3 } },
                    { label: 'Appartement', value: 'Appartement', icon: faBuilding, pdfConfig: { dx: -325, dy: - 597, pageIndex: 3 } },
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
            {
                id: "landSurface",
                type: "textInput",
                isNumeric: true,
                label: "Surface du terrain en m²",
                errorId: "landSurfaceError",
                mendatory: true,
                pdfConfig: { dx: -490, dy: - 615, pageIndex: 3 }
            },
            {
                id: "livingSurface",
                type: "textInput",
                isNumeric: true,
                label: "Surface habitable en m²",
                errorId: "livingSurfaceError",
                mendatory: true,
                pdfConfig: { dx: -332, dy: - 615, pageIndex: 3 }
            },
            {
                id: "heatedSurface",
                type: "textInput",
                isNumeric: true,
                label: "Surface à chauffer en m²",
                errorId: "heatedSurfaceError",
                mendatory: true,
                pdfConfig: { dx: -330, dy: - 633, pageIndex: 3 }
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
                pdfConfig: { dx: -70, dy: - 615, pageIndex: 3 }
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
                    { label: 'Toit-terasse', value: 'Toit-terasse', icon: faQuestionCircle, pdfConfig: { dx: -509, dy: - 671, pageIndex: 3 } },
                    { label: 'Combles aménagés', value: 'Combles aménagés', icon: faQuestionCircle, pdfConfig: { dx: -417, dy: - 671, pageIndex: 3 } },
                    { label: 'Combles perdus', value: 'Combles perdus', icon: faQuestionCircle, pdfConfig: { dx: -296, dy: - 671, pageIndex: 3 } },
                    { label: 'Terasses+Combles', value: 'Terasses+Combles', icon: faQuestionCircle, pdfConfig: { dx: -190, dy: - 671, pageIndex: 3 } },
                ],
                errorId: "roofTypeError",
                mendatory: true
            }
        ]
    },
    {//12
        id: "cadastralRef",
        title: "HABITATION",
        fields: [
            {
                id: "cadastralRef",
                type: "textInput",
                label: "Référence cadastrale",
                errorId: "cadastralRefError",
                pdfConfig: { dx: -475, dy: - 700, pageIndex: 3 }
            },
        ]
    },
    { //13
        id: "livingLevelsCount",
        title: "HABITATION",
        fields: [
            {
                id: "livingLevelsCount",
                label: "Nombres de niveaux habitables",
                type: "options",
                items: [
                    { label: '1', value: '1', icon: faQuestionCircle, pdfConfig: { dx: -409, dy: - 720, pageIndex: 3 } },
                    { label: '2', value: '2', icon: faQuestionCircle, pdfConfig: { dx: -374, dy: - 720, pageIndex: 3 } },
                    { label: '3', value: '3', icon: faQuestionCircle, pdfConfig: { dx: -339, dy: - 720, pageIndex: 3 } },
                    { label: '4', value: '4', icon: faQuestionCircle, pdfConfig: { dx: -303, dy: - 720, pageIndex: 3 } },
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
                label: "Nombre de pièces",
                type: "number",
                errorId: "roomsCountError",
                mendatory: true,
                pdfConfig: { dx: -120, dy: - 720, pageIndex: 3 }
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
                pdfConfig: { dx: -475, dy: - 737, pageIndex: 3 }
            },
        ]
    },
    { //16
        id: "slopeOrientation",
        title: "HABITATION",
        fields: [
            {
                id: "slopeOrientation",
                label: "Orientation de la pente la mieux exposée",
                type: "options",
                items: [
                    { label: 'Est', value: 'Est', icon: faQuestionCircle, pdfConfig: { dx: -381, dy: - 757, pageIndex: 3 } },
                    { label: 'Sud-Est/Sud-Ouest', value: 'Sud-Est/Sud-Ouest', icon: faQuestionCircle, pdfConfig: { dx: -303, dy: - 757, pageIndex: 3 } },
                    { label: 'Sud', value: 'Sud', icon: faQuestionCircle, pdfConfig: { dx: -169, dy: - 757, pageIndex: 3 } },
                    { label: 'Ouest', value: 'Ouest', icon: faQuestionCircle, pdfConfig: { dx: -119, dy: - 757, pageIndex: 3 } },
                ],
                errorId: "slopeOrientationError",
                mendatory: true,
            }
        ]
    },
    { //16 DONE
        id: "slopeSupport",
        title: "HABITATION",
        fields: [
            {
                id: "slopeSupport",
                label: "Support de la pente",
                type: "options",
                items: [
                    { label: 'Terrain', value: 'Terrain', icon: faQuestionCircle, pdfConfig: { dx: -452, dy: - 776, pageIndex: 3 } },
                    { label: 'Garrage', value: 'Garrage', icon: faQuestionCircle, pdfConfig: { dx: -381, dy: - 776, pageIndex: 3 } },
                    { label: 'Toitutre', value: 'Toitutre', icon: faQuestionCircle, pdfConfig: { dx: -303, dy: - 776, pageIndex: 3 } },
                    { label: 'Autre', value: 'Autre', icon: faQuestionCircle, pdfConfig: { dx: -225, dy: - 776, pageIndex: 3 } },
                ],
                errorId: "slopeSupportError",
                mendatory: true
            }
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
                    { label: 'Cave', value: 'Cave', icon: faQuestionCircle, pdfConfig: { dx: -452, dy: - 795, pageIndex: 3 } },
                    { label: 'Terre-plein', value: 'Terre-plein', icon: faQuestionCircle, pdfConfig: { dx: -381, dy: - 795, pageIndex: 3 } },
                    { label: 'Vide sanitaire', value: 'Vide sanitaire', icon: faQuestionCircle, pdfConfig: { dx: -303, dy: - 795, pageIndex: 3 } },
                    { label: 'Aucun', value: 'Aucun', icon: faQuestionCircle, pdfConfig: { dx: -225, dy: - 795, pageIndex: 3 } },
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
                label: "Epaisseur des murs",
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
                label: "Année d'installation",
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
                items: [
                    { label: "Selectionner un type", value: "" },
                    { label: "Electrique", value: "Electrique", pdfConfig: { dx: -453, dy: - 499, pageIndex: 0 } },
                    { label: "Gaz", value: "Gaz", pdfConfig: { dx: -375, dy: - 499, pageIndex: 0 } },
                    { label: "Fioul", value: "Fioul", pdfConfig: { dx: -311, dy: - 499, pageIndex: 0 } },
                    { label: "Pompe & Chaleur", value: "Pompe & Chaleur", pdfConfig: { dx: -240, dy: - 499, pageIndex: 0 } },
                    // { label: "Chaudière", value: "Chaudière", pdfConfig: { dx: -453, dy: - 517, pageIndex: 0 } },
                    { label: "Poéle", value: "Poéle", pdfConfig: { dx: -375, dy: - 517, pageIndex: 0 } },
                    { label: "Bois", value: "Bois", pdfConfig: { dx: -311, dy: - 517, pageIndex: 0 } },
                    { label: "Autre", value: "Autre", pdfConfig: { dx: -240, dy: - 517, pageIndex: 0 } },
                ],
                label: "Type de chauffage",
                mendatory: true,
                errorId: "heatersError",
                style: { marginBottom: 32 },
                rollBack: { fields: [{ id: "transmittersTypes", type: "array" }] }
            },
            {
                id: "transmittersTypes",
                label: "Types d'émetteurs",
                type: "options",
                isMultiOptions: true,
                items: [
                    { label: 'Radiateurs électriques', value: 'Radiateurs électriques', icon: faQuestionCircle, isConditional: true, condition: { with: "heaters", values: ["Electrique", "Poéle", "Bois", "Autre"] }, pdfConfig: { dx: -453, dy: - 536, pageIndex: 0 } },
                    { label: 'Clim réversible', value: 'Clim réversible', icon: faQuestionCircle, isConditional: true, condition: { with: "heaters", values: ["Electrique", "Poéle", "Bois", "Autre"] }, pdfConfig: { dx: -311, dy: - 554, pageIndex: 0 } },
                    { label: 'Radiateur fonte', value: 'Radiateur fonte', icon: faQuestionCircle, isConditional: true, condition: { with: "heaters", values: ["Gaz", "Fioul", "Pompe & Chaleur", "Chaudière"] }, pdfConfig: { dx: -265, dy: - 536, pageIndex: 0 } },
                    { label: 'Radiateur alu', value: 'Radiateur alu', icon: faQuestionCircle, isConditional: true, condition: { with: "heaters", values: ["Gaz", "Fioul", "Pompe & Chaleur", "Chaudière"] }, pdfConfig: { dx: -230, dy: - 536, pageIndex: 0 } },
                    { label: 'Radiateur acier', value: 'Radiateur acier', icon: faQuestionCircle, isConditional: true, condition: { with: "heaters", values: ["Gaz", "Fioul", "Pompe & Chaleur", "Chaudière"] }, pdfConfig: { dx: -205, dy: - 536, pageIndex: 0 } },
                    { label: 'Chauffage au sol', value: 'Chauffage au sol', icon: faQuestionCircle, isConditional: true, condition: { with: "heaters", values: ["Gaz", "Fioul", "Pompe & Chaleur", "Chaudière"] }, pdfConfig: { dx: -155, dy: - 536, pageIndex: 0 } },
                    { label: 'Convecteur', value: 'Convecteur', icon: faQuestionCircle, isConditional: true, condition: { with: "heaters", values: ["Poéle", "Bois", "Autre"] }, pdfConfig: { dx: -453, dy: - 554, pageIndex: 0 } },
                    { label: 'Autre', value: 'Autre', icon: faQuestionCircle, isConditional: true, condition: { with: "heaters", values: ["Poéle", "Bois", "Autre"] }, pdfConfig: { dx: -155, dy: - 554, pageIndex: 0 } },
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
                label: "Année d'installation",
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
                label: "Produisez-vous de l'éléctricité ?",
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
                label: "Année d'installation",
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
                label: "Dépense anuelle d'éléctricité",
                isNumeric: true,
                errorId: "yearlyElecCostError",
                mendatory: true,
                pdfConfig: { dx: -53, dy: - 661, pageIndex: 0 }
            },
        ],
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
                style: { marginTop: 50 },
                pdfConfig: { dx: -515, dy: - 794, pageIndex: 0 }
            },
            {
                id: "roofTilt",
                label: "Inclinaison",
                type: "number",
                placeholder: "Exemple: 10°C",
                style: { marginTop: 50 },
                pdfConfig: { dx: -150, dy: - 794, pageIndex: 0 }
            },
        ]
    },
    {//35
        id: "generalData",
        title: "ADRESSE",
        fields: [
            {
                id: "addressNum",
                type: "textInput",
                label: "Numéro",
                isNumeric: true,
                errorId: "addressNumError",
                mendatory: true,
                pdfConfig: { dx: -556, dy: - 194, pageIndex: 3 }
            },
            {
                id: "addressStreet",
                type: "textInput",
                label: "Rue",
                errorId: "addressStreetError",
                mendatory: true,
                pdfConfig: { dx: -468, dy: - 194, pageIndex: 3 }
            },
            {
                id: "addressCode",
                type: "textInput",
                mask: "[0][0][0][0][0]",
                label: "Code Postal",
                isNumeric: true,
                errorId: "addressCodeError",
                mendatory: true,
                pdfConfig: { dx: -518, dy: - 218, pageIndex: 3, spaces: { afterEach: 1, str: '      ' } }
            },
            {
                id: "addressCity",
                type: "textInput",
                label: "Ville",
                errorId: "addressCityError",
                mendatory: true,
                pdfConfig: { dx: -349, dy: - 218, pageIndex: 3 }
            },
        ]
    },
    {//36
        id: "generalData",
        title: "RENSEIGNEMENTS GENERAUX",
        fields: [
            {
                id: "phone",
                type: "textInput",
                mask: "[00][00][00][00][00]",
                isNumeric: true,
                label: "Téléphone",
                errorId: "phoneError",
                mendatory: true,
                pdfConfig: { dx: -521, dy: - 243, pageIndex: 3, spaces: { afterEach: 2, str: '          ' } }
            },
            // {
            //     id: "disablePhoneContact",
            //     label: "J'accepte d'être rappelé à ce numéro",
            //     type: "checkbox",
            // },
        ]
    },
    {//37
        id: "generalData",
        title: "RENSEIGNEMENTS GENERAUX",
        fields: [
            {
                id: "email",
                type: "textInput",
                isEmail: true,
                label: "Adresse email",
                errorId: "emailError",
                mendatory: true,
                pdfConfig: { dx: -380, dy: - 267, pageIndex: 3 }
            },
        ],
        isLast: true
    },
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
                    { label: 'Monsieur', value: 'Monsieur', icon: faMars, pdfConfig: { dx: -473, dy: - 350, pageIndex: 0 } },
                    { label: 'Madame', value: 'Madame', icon: faVenus, pdfConfig: { dx: -395, dy: - 350, pageIndex: 0 } },
                ],
                mendatory: true,
            }
        ]
    },
    {//2 DONE
        id: "identity",
        title: "IDENTITÉ DU MANDANT",
        fields: [
            {
                id: "applicantFirstName",
                type: "textInput",
                label: "Prénom",
                errorId: "applicantFirstNameError",
                pdfConfig: { dx: -520, dy: - 155, pageIndex: 0 },
                mendatory: true
            },
            {
                id: "applicantLastName",
                type: "textInput",
                label: "Nom",
                errorId: "applicantLastNameError", //add max lenght
                pdfConfig: { dx: -520, dy: - 155, pageIndex: 0 }, //add spaces
                mendatory: true
            },
        ]
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
                pdfConfig: { dx: -556, dy: - 194, pageIndex: 0 },
                mendatory: true,
            },
        ]
    },
    {
        id: "property",
        title: "PROPRIÉTÉ DU MANDANT",
        fields: [
            {
                id: "addressCode",
                type: "textInput",
                mask: "[0][0][0][0][0]",
                label: "Code Postal",
                isNumeric: true,
                errorId: "addressCodeError",
                mendatory: true,
                pdfConfig: { dx: -518, dy: - 218, pageIndex: 0, spaces: { afterEach: 1, str: '      ' } }
            },
        ]
    },
    // {
    //     id: "property",
    //     title: "PROPRIÉTÉ DU MANDANT",
    //     fields: [
    //         {
    //             id: "commune",
    //             type: "textInput",
    //             label: "Commune",
    //             errorId: "communeError",
    //             pdfConfig: { dx: -556, dy: - 194, pageIndex: 3 },
    //             mendatory: true,
    //         },
    //     ]
    // },
    // {
    //     id: "property",
    //     title: "COORDONNÉES DU MANDANT",
    //     fields: [
    //         {
    //             id: "email",
    //             type: "textInput",
    //             isEmail: true,
    //             label: "Adresse email",
    //             errorId: "emailError",
    //             mendatory: true,
    //             pdfConfig: { dx: -380, dy: - 267, pageIndex: 3 }
    //         },
    //     ]
    // },
    // {
    //     id: "property",
    //     title: "COORDONNÉES DU MANDANT",
    //     fields: [
    //         {
    //             id: "phone",
    //             type: "textInput",
    //             mask: "[00][00][00][00][00]",
    //             isNumeric: true,
    //             label: "Téléphone",
    //             errorId: "phoneError",
    //             mendatory: true,
    //             pdfConfig: { dx: -521, dy: - 243, pageIndex: 3, spaces: { afterEach: 2, str: '          ' } }
    //         },
    //     ]
    // },
    // {//8
    //     id: "journal",
    //     title: "",
    //     fields: [
    //         {
    //             id: "createdIn",
    //             type: "textInput",
    //             label: "Mandat Maprimerénov fait à:",
    //             errorId: "createdInError",
    //             pdfConfig: { dx: -520, dy: - 155, pageIndex: 3 },
    //             mendatory: true,
    //         },
    //     ],
    // },
    {
        id: "submit",
        fields: []
    }
]

export const PvReceptionModel = [
    //---------------------------  Page 1
    {//0
        id: "projectOwner",
        title: "",
        fields: [
            {
                id: "projectOwner",
                type: "textInput",
                label: "Nom et prénom du maître d'ouvrage",
                errorId: "projectOwnerError",
                pdfConfig: { dx: -520, dy: - 155, pageIndex: 0 },
                mendatory: true,
            },
        ],
        stepIndex: 0,
    },
    // {//1
    //     id: "orderDate",
    //     title: "",
    //     fields: [
    //         {
    //             id: "orderDate",
    //             type: "datePicker",
    //             label: "Commande en date du :",
    //             errorId: "orderDateError",
    //             pdfConfig: { dx: -520, dy: - 155, pageIndex: 3 },
    //             mendatory: true,
    //         },
    //     ],
    // },
    // { //2
    //     id: "acceptReception",
    //     title: "",
    //     fields: [
    //         {
    //             id: "acceptReception",
    //             label: "Travaux avec ou sans réserves ?",
    //             type: "options",
    //             items: [
    //                 {
    //                     label: 'Accepter la réception des travaux sans réserves',
    //                     value: 'noReserves',
    //                     icon: faQuestionCircle,
    //                     pdfConfig: { dx: -473, dy: - 350, pageIndex: 3 },
    //                     rollBack: {
    //                         fields: [
    //                             { id: "acceptWorksReceptionDate", type: "date" },
    //                         ]
    //                     }
    //                 },
    //                 {
    //                     label: 'Accepter la réception assortie de réserves',
    //                     value: 'withReserves',
    //                     icon: faQuestionCircle,
    //                     pdfConfig: { dx: -395, dy: - 350, pageIndex: 3 },
    //                     rollBack: {
    //                         fields: [
    //                             { id: "acceptReservesReceptionDate", type: "date" },
    //                         ]
    //                     }
    //                 },
    //             ],
    //             errorId: "acceptReceptionError",
    //             mendatory: true,
    //         }
    //     ]
    // },
    // {//3
    //     id: "acceptWorksReceptionDate",
    //     title: "",
    //     fields: [
    //         {
    //             id: "acceptWorksReceptionDate",
    //             type: "datePicker",
    //             label: "Accepter la réception des travaux sans réserves à effet du:",
    //             errorId: "acceptWorksReceptionDateError",
    //             pdfConfig: { dx: -520, dy: - 155, pageIndex: 3 },
    //             isConditional: true,
    //             condition: { with: "acceptReception", values: ["noReserves"] },
    //             mendatory: true,
    //         },
    //     ],
    // },
    // {//4
    //     id: "acceptReservesReceptionDate",
    //     title: "",
    //     fields: [
    //         {
    //             id: "acceptReservesReceptionDate",
    //             type: "datePicker",
    //             label: "Accepter la réception assortie de réserves à effet du:",
    //             errorId: "acceptReservesReceptionDateError",
    //             pdfConfig: { dx: -520, dy: - 155, pageIndex: 3 },
    //             isConditional: true,
    //             condition: { with: "acceptReception", values: ["withReserves"] },
    //             mendatory: true,
    //         },
    //     ],
    // },
    // {//5
    //     id: "reservesNature",
    //     title: "",
    //     fields: [
    //         {
    //             id: "reservesNature",
    //             type: "textInput",
    //             label: "Nature des réserves",
    //             errorId: "reservesNatureError",
    //             pdfConfig: { dx: -520, dy: - 155, pageIndex: 3 },
    //             mendatory: true,
    //         },
    //     ],
    // },
    // {//6
    //     id: "worksToExecute",
    //     title: "",
    //     fields: [
    //         {
    //             id: "worksToExecute",
    //             type: "textInput",
    //             label: "Travaux à exécuter",
    //             errorId: "worksToExecuteError",
    //             pdfConfig: { dx: -520, dy: - 155, pageIndex: 3 },
    //             mendatory: true,
    //         },
    //     ],
    // },
    // {//7
    //     id: "timeLimitFromToday",
    //     title: "",
    //     fields: [
    //         {
    //             id: "timeLimitFromToday",
    //             type: "textInput",
    //             label: "Délai imparti à compter de ce jour",
    //             errorId: "timeLimitFromTodayError",
    //             pdfConfig: { dx: -520, dy: - 155, pageIndex: 3 },
    //             mendatory: true,
    //         },
    //     ],
    // },
    // {//8
    //     id: "madeIn",
    //     title: "",
    //     fields: [
    //         {
    //             id: "madeIn",
    //             type: "textInput",
    //             label: "Fait à:",
    //             errorId: "madeInError",
    //             pdfConfig: { dx: -520, dy: - 155, pageIndex: 3 },
    //             mendatory: true,
    //         },
    //     ],
    // },
    // {//9
    //     id: "doneOn",
    //     title: "",
    //     fields: [
    //         {
    //             id: "doneOn",
    //             type: "datePicker",
    //             label: "Fait le:",
    //             errorId: "doneOnError",
    //             pdfConfig: { dx: -520, dy: - 155, pageIndex: 3 },
    //             mendatory: true,
    //         },
    //     ],
    // },
    // //----------------------- PAGE2
    // {//1
    //     id: "clientName",
    //     title: "Coordonnées du chantier",
    //     fields: [
    //         {
    //             id: "clientName",
    //             type: "textInput",
    //             label: "Nom et prénom du client",
    //             errorId: "clientNameError",
    //             pdfConfig: { dx: -520, dy: - 155, pageIndex: 3 },
    //             mendatory: true,
    //         },
    //     ],
    // },
    // {//2
    //     id: "installationAddress",
    //     title: "Coordonnées du chantier",
    //     fields: [
    //         {
    //             id: "installationAddress",
    //             type: "address",
    //             label: "Adresse complète de l'installation",
    //             errorId: "installationAddressError",
    //             pdfConfig: { dx: -520, dy: - 155, pageIndex: 3 },
    //             mendatory: true,
    //         }
    //     ]
    // },
    // {//3
    //     id: "clientPhone",
    //     title: "Coordonnées du chantier",
    //     fields: [
    //         {
    //             id: "phone",
    //             type: "textInput",
    //             mask: "[00][00][00][00][00]",
    //             isNumeric: true,
    //             label: "Téléphone",
    //             errorId: "phoneError",
    //             mendatory: true,
    //             pdfConfig: { dx: -521, dy: - 243, pageIndex: 3, spaces: { afterEach: 2, str: '          ' } },
    //             mendatory: true,
    //         },
    //     ]
    // },
    // {//4
    //     id: "commissioningDate",
    //     title: "Coordonnées du chantier",
    //     fields: [
    //         {
    //             id: "commissioningDate",
    //             type: "datePicker",
    //             label: "Date de mise en service",
    //             errorId: "commissioningDateError",
    //             pdfConfig: { dx: -520, dy: - 155, pageIndex: 3, spaces: { afterEach: 2, str: '          ' } },
    //             mendatory: true,
    //         },
    //     ],
    // },
    // { //5
    //     id: "appreciation",
    //     title: "Appréciation de la prestation",
    //     fields: [
    //         {
    //             id: "appreciation",
    //             label: "Qualité globale de la prestation",
    //             type: "options",
    //             items: [
    //                 {
    //                     label: 'Très satisfaisante',
    //                     value: 'verySatisfaying',
    //                     icon: faQuestionCircle,
    //                     pdfConfig: { dx: -473, dy: - 350, pageIndex: 3 },
    //                 },
    //                 {
    //                     label: 'Satisfaisante',
    //                     value: 'satisfaying',
    //                     icon: faQuestionCircle,
    //                     pdfConfig: { dx: -473, dy: - 350, pageIndex: 3 },
    //                 },
    //                 {
    //                     label: 'Peu satisfaisante',
    //                     value: 'littleSatisfaying',
    //                     icon: faQuestionCircle,
    //                     pdfConfig: { dx: -473, dy: - 350, pageIndex: 3 },
    //                 },
    //                 {
    //                     label: 'Insatisfaisante',
    //                     value: 'unSatisfaying',
    //                     icon: faQuestionCircle,
    //                     pdfConfig: { dx: -473, dy: - 350, pageIndex: 3 },
    //                 },
    //             ],
    //             mendatory: true,
    //         },
    //     ]
    // },
    // {//6
    //     id: "appreciationDate",
    //     title: "Appréciation de la prestation",
    //     fields: [
    //         {
    //             id: "appreciationDate",
    //             type: "datePicker",
    //             label: "Date de l'appréciation",
    //             errorId: "appreciationDateError",
    //             pdfConfig: { dx: -520, dy: - 155, pageIndex: 3 },
    //             mendatory: true,
    //         },
    //         {
    //             id: "signatoryName",
    //             type: "textInput",
    //             label: "Nom du signataire",
    //             errorId: "signatoryNameError",
    //             pdfConfig: { dx: -520, dy: - 155, pageIndex: 3 },
    //             mendatory: true,
    //         },
    //     ],
    // },
    {
        id: "submit",
        fields: []
    }
]