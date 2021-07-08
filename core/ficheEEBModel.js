import { faBuilding, faCheck, faHouse, faTimes, faUser } from "@fortawesome/pro-light-svg-icons";
import * as theme from './theme'

export const ficheEEBModel = [
    //*********************** STEP1 *************************
    // {//0 DONE
    //     id: "fullName",
    //     title: "NOM ET PRENOM",
    //     fields: [
    //         {
    //             id: "nameSir",
    //             type: "textInput",
    //             label: "Monsieur",
    //             errorId: "nameSirError",
    //             pdfConfig: { dx: -520, dy: - 155, pageIndex: 3 }
    //         },
    //         {
    //             id: "nameMiss",
    //             type: "textInput",
    //             label: "Madame",
    //             errorId: "nameMissError",
    //             pdfConfig: { dx: -235, dy: - 155, pageIndex: 3 }
    //         },
    //     ]
    // },
    // {//1 DONE
    //     id: "proSituation",
    //     title: "SITUATION",
    //     fields: [
    //         {
    //             id: "proSituationSir",
    //             type: "picker",
    //             items: [
    //                 { label: "Situation professionnelle Mr", value: "" },
    //                 { label: "Salarié privé", value: "Salarié privé" },
    //                 { label: "Salarié public", value: "Salarié public" },
    //                 { label: "Retraité", value: "Retraité" },
    //                 { label: "Sans emploi", value: "Sans emploi" },
    //                 { label: "Invalidité", value: "Invalidité" },
    //                 { label: "Profession libérale", value: "Profession libérale" },
    //                 { label: "Chef d'entreprise", value: "Chef d'entreprise" },
    //                 { label: "Autre", value: "Autre" },
    //             ],
    //             label: "Situation professionnelle Mr",
    //             mendatory: true,
    //             errorId: "proSituationSirError",
    //             isConditional: true,
    //             condition: { with: "nameSir" },
    //             pdfConfig: { dx: -450, dy: - 305, pageIndex: 3 }
    //         },
    //         {
    //             id: "ageSir",
    //             type: "textInput",
    //             isNumeric: true,
    //             label: "Age Mr",
    //             errorId: "ageSirError",
    //             mendatory: true,
    //             isConditional: true,
    //             condition: { with: "nameSir" },
    //             pdfConfig: { dx: -510, dy: - 330, pageIndex: 3 }
    //         },
    //         {
    //             id: "proSituationMiss",
    //             type: "picker",
    //             items: [
    //                 { label: "Situation professionnelle Mme", value: "" },
    //                 { label: "Salarié privé", value: "Salarié privé" },
    //                 { label: "Salarié public", value: "Salarié public" },
    //                 { label: "Retraité", value: "Retraité" },
    //                 { label: "Sans emploi", value: "Sans emploi" },
    //                 { label: "Invalidité", value: "Invalidité" },
    //                 { label: "Profession libérale", value: "Profession libérale" },
    //                 { label: "Chef d'entreprise", value: "Chef d'entreprise" },
    //                 { label: "Autre", value: "Autre" },
    //             ],
    //             label: "Situation professionnelle Mme",
    //             errorId: "proSituationMissError",
    //             mendatory: true,
    //             isConditional: true,
    //             condition: { with: "nameMiss" },
    //             pdfConfig: { dx: -150, dy: - 305, pageIndex: 3 }
    //         },
    //         {
    //             id: "ageMiss",
    //             type: "textInput",
    //             isNumeric: true,
    //             label: "Age Mme",
    //             errorId: "ageMissError",
    //             mendatory: true,
    //             isConditional: true,
    //             condition: { with: "nameMiss" },
    //             pdfConfig: { dx: -225, dy: - 330, pageIndex: 3 }
    //         },
    //     ]
    // },
    // { //2 DONE
    //     id: "familySituation",
    //     title: "SITUATION",
    //     fields: [
    //         {
    //             id: "familySituation",
    //             label: "Situation de famille",
    //             type: "options",
    //             items: [
    //                 { label: 'Célibataire', value: 'Célibataire', icon: faUser, pdfConfig: { dx: -473, dy: - 350, pageIndex: 3 } },
    //                 { label: 'Marié', value: 'Marié', icon: faUser, pdfConfig: { dx: -395, dy: - 350, pageIndex: 3 } },
    //                 { label: 'Pacsé', value: 'Pacsé', icon: faUser, pdfConfig: { dx: -339, dy: - 350, pageIndex: 3 } },
    //                 { label: 'Concubinage', value: 'Concubinage', icon: faUser, pdfConfig: { dx: -282, dy: - 350, pageIndex: 3 } },
    //                 { label: 'Divorcé', value: 'Divorcé', icon: faUser, pdfConfig: { dx: -204, dy: - 350, pageIndex: 3 } },
    //                 { label: 'Veuve', value: 'Veuve', icon: faUser, pdfConfig: { dx: -140, dy: - 350, pageIndex: 3 } }
    //             ],
    //         }
    //     ]
    // },
    // { //3 DONE
    //     id: "houseOwnership",
    //     title: "SITUATION",
    //     fields: [
    //         {
    //             id: "houseOwnership",
    //             label: "Propriétaire ou locataire",
    //             type: "options",
    //             items: [
    //                 { label: 'Propriétaire', value: 'Propriétaire', icon: faUser, pdfConfig: { dx: -445, dy: - 387, pageIndex: 3 } },
    //                 { label: 'Locataire', value: 'Locataire', icon: faUser, pdfConfig: { dx: -523, dy: - 387, pageIndex: 3 } },
    //             ],
    //             errorId: "houseOwnershipError",
    //             mendatory: true,
    //         }
    //     ]
    // },
    // { //4
    //     id: "yearsHousing",
    //     title: "SITUATION",
    //     fields: [
    //         {
    //             id: "yearsHousing",
    //             label: "Année dans le logement",
    //             type: "number",
    //             errorId: "yearsHousingError",
    //             pdfConfig: { dx: -220, dy: - 386, pageIndex: 3 }
    //         }
    //     ]
    // },
    // { //5 DONE
    //     id: "taxIncome",
    //     title: "SITUATION",
    //     fields: [
    //         {
    //             id: "taxIncome",
    //             type: "textInput",
    //             isNumeric: true,
    //             label: "Revenu fiscal de référence en €",
    //             errorId: "taxIncomeError",
    //             mendatory: true,
    //             pdfConfig: { dx: -447, dy: - 405, pageIndex: 3 }
    //         },
    //     ]
    // },
    // { //6 DONE
    //     id: "demographicSituation",
    //     title: "SITUATION",
    //     fields: [
    //         {
    //             id: "familyMembersCount",
    //             type: "textInput",
    //             isNumeric: true,
    //             label: "Nombre d'occupants dans le foyer",
    //             errorId: "familyMembersCountError",
    //             mendatory: true,
    //             pdfConfig: { dx: -425, dy: - 443, pageIndex: 3 }
    //         },
    //         {
    //             id: "childrenCount",
    //             type: "textInput",
    //             isNumeric: true,
    //             label: "Nombre d'enfants à charge (-18 ans)",
    //             errorId: "childrenCountError",
    //             mendatory: true,
    //             pdfConfig: { dx: -150, dy: - 443, pageIndex: 3 }

    //         },
    //     ]
    // },
    // { //7
    //     id: "aidAndSub",
    //     title: "AIDES ET SUVENTIONS",
    //     fields: [
    //         {
    //             id: "aidAndSub",
    //             label: "Avez-vous bénéficié d'aides ou subventions dans les 5 dernières années ?",
    //             type: "options",
    //             items: [
    //                 { label: 'Non', value: 'Non', icon: faTimes, iconColor: theme.colors.error, pdfConfig: { dx: -190, dy: - 484, pageIndex: 3 } },
    //                 { label: 'Oui', value: 'Oui', icon: faCheck, iconColor: "green", pdfConfig: { dx: -247, dy: - 484, pageIndex: 3 } },
    //             ],
    //             errorId: "aidAndSubError",
    //             mendatory: true
    //         }
    //     ],
    //     isLast: true,
    // },
    // //********************  STEP 2 *********************************************
    // { //8 DONE
    //     id: "housingType",
    //     title: "HABITATION",
    //     fields: [
    //         {
    //             id: "housingType",
    //             label: "Type d'habitation",
    //             type: "options",
    //             items: [
    //                 { label: 'Maison individuelle', value: 'Maison individuelle', icon: faHouse, pdfConfig: { dx: -466, dy: - 597, pageIndex: 3 } },
    //                 { label: 'Appartement', value: 'Appartement', icon: faBuilding, pdfConfig: { dx: -325, dy: - 597, pageIndex: 3 } },
    //             ],
    //             errorId: "housingTypeError",
    //             mendatory: true
    //         }
    //     ],
    //     isFirst: true,
    // },
    // { //9 DONE
    //     id: "surfaces",
    //     title: "HABITATION",
    //     fields: [
    //         {
    //             id: "landSurface",
    //             type: "textInput",
    //             isNumeric: true,
    //             label: "Surface du terrain en m²",
    //             errorId: "landSurfaceError",
    //             mendatory: true,
    //             pdfConfig: { dx: -490, dy: - 615, pageIndex: 3 }
    //         },
    //         {
    //             id: "livingSurface",
    //             type: "textInput",
    //             isNumeric: true,
    //             label: "Surface habitable en m²",
    //             errorId: "livingSurfaceError",
    //             mendatory: true,
    //             pdfConfig: { dx: -332, dy: - 615, pageIndex: 3 }
    //         },
    //         {
    //             id: "heatedSurface",
    //             type: "textInput",
    //             isNumeric: true,
    //             label: "Surface à chauffer en m²",
    //             errorId: "heatedSurfaceError",
    //             mendatory: true,
    //             pdfConfig: { dx: -330, dy: - 633, pageIndex: 3 }
    //         },
    //     ]
    // },
    // { //10 DONE
    //     id: "yearHomeConstruction",
    //     title: "HABITATION",
    //     fields: [
    //         {
    //             id: "yearHomeConstruction",
    //             label: "Année de construction de l'habitation",
    //             type: "number",
    //             errorId: "yearHomeConstructionError",
    //             pdfConfig: { dx: -70, dy: - 615, pageIndex: 3 }
    //         }
    //     ]
    // },
    // { //11
    //     id: "roofType",
    //     title: "HABITATION",
    //     fields: [
    //         {
    //             id: "roofType",
    //             label: "Type de toit",
    //             type: "options",
    //             items: [
    //                 { label: 'Toit-terasse', value: 'Toit-terasse', icon: faUser, pdfConfig: { dx: -509, dy: - 671, pageIndex: 3 } },
    //                 { label: 'Combles aménagés', value: 'Combles aménagés', icon: faUser, pdfConfig: { dx: -417, dy: - 671, pageIndex: 3 } },
    //                 { label: 'Combles perdus', value: 'Combles perdus', icon: faUser, pdfConfig: { dx: -296, dy: - 671, pageIndex: 3 } },
    //                 { label: 'Terasses+Combles', value: 'Terasses+Combles', icon: faUser, pdfConfig: { dx: -190, dy: - 671, pageIndex: 3 } },
    //             ],
    //             errorId: "roofTypeError",
    //             mendatory: true
    //         }
    //     ]
    // },
    // {//12
    //     id: "cadastralRef",
    //     title: "HABITATION",
    //     fields: [
    //         {
    //             id: "cadastralRef",
    //             type: "textInput",
    //             label: "Référence cadastrale",
    //             errorId: "cadastralRefError",
    //             pdfConfig: { dx: -475, dy: - 700, pageIndex: 3 }
    //         },
    //     ]
    // },
    // { //13
    //     id: "livingLevelsCount",
    //     title: "HABITATION",
    //     fields: [
    //         {
    //             id: "livingLevelsCount",
    //             label: "Nombres de niveaux habitables",
    //             type: "options",
    //             items: [
    //                 { label: '1', value: '1', icon: faUser, pdfConfig: { dx: -409, dy: - 720, pageIndex: 3 } },
    //                 { label: '2', value: '2', icon: faUser, pdfConfig: { dx: -374, dy: - 720, pageIndex: 3 } },
    //                 { label: '3', value: '3', icon: faUser, pdfConfig: { dx: -339, dy: - 720, pageIndex: 3 } },
    //                 { label: '4', value: '4', icon: faUser, pdfConfig: { dx: -303, dy: - 720, pageIndex: 3 } },
    //             ],
    //             errorId: "livingLevelsCountError",
    //             mendatory: true
    //         }
    //     ]
    // },
    // { //14
    //     id: "roomsCount",
    //     title: "HABITATION",
    //     fields: [
    //         {
    //             id: "roomsCount",
    //             label: "Nombre de pièces",
    //             type: "number",
    //             errorId: "roomsCountError",
    //             mendatory: true,
    //             pdfConfig: { dx: -120, dy: - 720, pageIndex: 3 }
    //         }
    //     ]
    // },
    // { //15
    //     id: "ceilingHeight",
    //     title: "HABITATION",
    //     fields: [
    //         {
    //             id: "ceilingHeight",
    //             type: "textInput",
    //             isNumeric: true,
    //             label: "Hauteur sous-plafond en cm",
    //             errorId: "ceilingHeightError",
    //             mendatory: true,
    //             pdfConfig: { dx: -475, dy: - 737, pageIndex: 3 }
    //         },
    //     ]
    // },
    // { //16
    //     id: "slopeOrientation",
    //     title: "HABITATION",
    //     fields: [
    //         {
    //             id: "slopeOrientation",
    //             label: "Orientation de la pente la mieux exposée",
    //             type: "options",
    //             items: [
    //                 { label: 'Est', value: 'Est', icon: faUser, pdfConfig: { dx: -381, dy: - 757, pageIndex: 3 } },
    //                 { label: 'Sud-Est/Sud-Ouest', value: 'Sud-Est/Sud-Ouest', icon: faUser, pdfConfig: { dx: -303, dy: - 757, pageIndex: 3 } },
    //                 { label: 'Sud', value: 'Sud', icon: faUser, pdfConfig: { dx: -169, dy: - 757, pageIndex: 3 } },
    //                 { label: 'Ouest', value: 'Ouest', icon: faUser, pdfConfig: { dx: -119, dy: - 757, pageIndex: 3 } },
    //             ],
    //             errorId: "slopeOrientationError",
    //             mendatory: true,
    //         }
    //     ]
    // },
    // { //16 DONE
    //     id: "slopeSupport",
    //     title: "HABITATION",
    //     fields: [
    //         {
    //             id: "slopeSupport",
    //             label: "Support de la pente",
    //             type: "options",
    //             items: [
    //                 { label: 'Terrain', value: 'Terrain', icon: faUser, pdfConfig: { dx: -452, dy: - 776, pageIndex: 3 } },
    //                 { label: 'Garrage', value: 'Garrage', icon: faUser, pdfConfig: { dx: -381, dy: - 776, pageIndex: 3 } },
    //                 { label: 'Toitutre', value: 'Toitutre', icon: faUser, pdfConfig: { dx: -303, dy: - 776, pageIndex: 3 } },
    //                 { label: 'Autre', value: 'Autre', icon: faUser, pdfConfig: { dx: -225, dy: - 776, pageIndex: 3 } },
    //             ],
    //             errorId: "slopeSupportError",
    //             mendatory: true
    //         }
    //     ]
    // },
    // { //17
    //     id: "basementType",
    //     title: "HABITATION",
    //     fields: [
    //         {
    //             id: "basementType",
    //             label: "Type de sous-sol",
    //             type: "options",
    //             items: [
    //                 { label: 'Cave', value: 'Cave', icon: faUser, pdfConfig: { dx: -452, dy: - 795, pageIndex: 3 } },
    //                 { label: 'Terre-plein', value: 'Terre-plein', icon: faUser, pdfConfig: { dx: -381, dy: - 795, pageIndex: 3 } },
    //                 { label: 'Vide sanitaire', value: 'Vide sanitaire', icon: faUser, pdfConfig: { dx: -303, dy: - 795, pageIndex: 3 } },
    //                 { label: 'Aucun', value: 'Aucun', icon: faUser, pdfConfig: { dx: -225, dy: - 795, pageIndex: 3 } },
    //             ],
    //             errorId: "basementTypeError",
    //             mendatory: true
    //         }
    //     ],
    //     isLast: true,
    // },
    // //***************************** STEP 3 ************************
    // { //18
    //     id: "wallMaterial",
    //     title: "VOTRE BILAN ENERGETIQUE",
    //     fields: [
    //         {
    //             id: "wallMaterial",
    //             label: "Matériaux de construction des murs",
    //             type: "options",
    //             items: [
    //                 { label: 'Pierre', value: 'Pierre', icon: faUser, pdfConfig: { dx: -396, dy: - 104, pageIndex: 0 } },
    //                 { label: 'Béton', value: 'Béton', icon: faUser, pdfConfig: { dx: -319, dy: - 104, pageIndex: 0 } },
    //                 { label: 'Béton celullaire', value: 'Béton celullaire', icon: faUser, pdfConfig: { dx: -240, dy: - 104, pageIndex: 0 } },
    //                 { label: 'Brique', value: 'Brique', icon: faUser, pdfConfig: { dx: -396, dy: - 117, pageIndex: 0 } },
    //                 { label: 'Bois', value: 'Bois', icon: faUser, pdfConfig: { dx: -319, dy: - 117, pageIndex: 0 } },
    //                 { label: 'Autre', value: 'Autre', icon: faUser, pdfConfig: { dx: -240, dy: - 117, pageIndex: 0 } },
    //             ],
    //             errorId: "wallMaterialError",
    //             mendatory: true
    //         }
    //     ],
    //     isFirst: true,
    // },
    // { //19
    //     id: "wallThickness",
    //     title: "VOTRE BILAN ENERGETIQUE",
    //     fields: [
    //         {
    //             id: "wallThickness",
    //             type: "textInput",
    //             isNumeric: true,
    //             label: "Epaisseur des murs",
    //             errorId: "wallThicknessError",
    //             pdfConfig: { dx: -485, dy: - 135, pageIndex: 0 }
    //         },
    //     ]
    // },
    // { //20
    //     id: "internalWallsIsolation",
    //     title: "VOTRE BILAN ENERGETIQUE",
    //     fields: [
    //         {
    //             id: "internalWallsIsolation",
    //             label: "Isolation des murs interieurs",
    //             type: "options",
    //             items: [
    //                 { label: 'Non', value: 'Non', icon: faTimes, iconColor: theme.colors.error, pdfConfig: { dx: -318, dy: - 154, pageIndex: 0 } },
    //                 { label: 'Oui', value: 'Oui', icon: faCheck, iconColor: "green", pdfConfig: { dx: -396, dy: - 154, pageIndex: 0 } },
    //             ],
    //             errorId: "internalWallsIsolationError",
    //             mendatory: true
    //         }
    //     ],
    // },
    // { //21
    //     id: "externalWallsIsolation",
    //     title: "VOTRE BILAN ENERGETIQUE",
    //     fields: [
    //         {
    //             id: "externalWallsIsolation",
    //             label: "Isolation des murs exterieurs",
    //             type: "options",
    //             items: [
    //                 { label: 'Non', value: 'Non', icon: faTimes, iconColor: theme.colors.error, pdfConfig: { dx: -318, dy: - 172, pageIndex: 0 } },
    //                 { label: 'Oui', value: 'Oui', icon: faCheck, iconColor: "green", pdfConfig: { dx: -396, dy: - 172, pageIndex: 0 } },
    //             ],
    //             errorId: "externalWallsIsolationError",
    //             mendatory: true
    //         }
    //     ],
    // },
    // { //22
    //     id: "floorIsolation",
    //     title: "VOTRE BILAN ENERGETIQUE",
    //     fields: [
    //         {
    //             id: "floorIsolation",
    //             label: "Isolation du sol",
    //             type: "options",
    //             items: [
    //                 { label: 'Non', value: 'Non', icon: faTimes, iconColor: theme.colors.error, pdfConfig: { dx: -318, dy: - 191, pageIndex: 0 } },
    //                 { label: 'Oui', value: 'Oui', icon: faCheck, iconColor: "green", pdfConfig: { dx: -396, dy: - 191, pageIndex: 0 } },
    //             ],
    //             errorId: "floorIsolationError",
    //             mendatory: true
    //         }
    //     ],
    // },
    // { //22
    //     id: "lostAticsIsolation",
    //     title: "VOTRE BILAN ENERGETIQUE",
    //     fields: [
    //         {
    //             id: "lostAticsIsolation",
    //             label: "Isolation des combles perdus",
    //             type: "options",
    //             items: [
    //                 { label: 'Non', value: 'Non', icon: faTimes, iconColor: theme.colors.error, pdfConfig: { dx: -318, dy: - 209, pageIndex: 0 } },
    //                 { label: 'Oui', value: 'Oui', icon: faCheck, iconColor: "green", pdfConfig: { dx: -396, dy: - 209, pageIndex: 0 } },
    //             ],
    //             errorId: "lostAticsIsolationError",
    //             mendatory: true
    //         }
    //     ],
    // },
    // { //23
    //     id: "windowType",
    //     title: "MENUISERIE",
    //     fields: [
    //         {
    //             id: "windowType",
    //             label: "Type de fenêtre",
    //             type: "options",
    //             items: [
    //                 { label: 'PVC', value: 'PVC', icon: faUser, pdfConfig: { dx: -396, dy: - 328, pageIndex: 0 } },
    //                 { label: 'Bois', value: 'Bois', icon: faUser, pdfConfig: { dx: -318, dy: - 328, pageIndex: 0 } },
    //                 { label: 'Alu', value: 'Alu', icon: faUser, pdfConfig: { dx: -240, dy: - 328, pageIndex: 0 } },
    //             ],
    //             errorId: "windowTypeError",
    //             mendatory: true
    //         }
    //     ],
    // },
    // { //24
    //     id: "glazingType",
    //     title: "MENUISERIE",
    //     fields: [
    //         {
    //             id: "glazingType",
    //             label: "Type de vitrage",
    //             type: "options",
    //             items: [
    //                 { label: 'Simple', value: 'Simple', icon: faUser, pdfConfig: { dx: -396, dy: - 347, pageIndex: 0 } },
    //                 { label: 'Double', value: 'Double', icon: faUser, pdfConfig: { dx: -318, dy: - 347, pageIndex: 0 } },
    //                 { label: 'Triple', value: 'Triple', icon: faUser, pdfConfig: { dx: -240, dy: - 347, pageIndex: 0 }  },
    //             ],
    //             errorId: "glazingTypeError",
    //             mendatory: true
    //         }
    //     ],
    // },
    // { //25
    //     id: "hotWaterProduction",
    //     title: "EAU CHAUDE SANITAIRE",
    //     fields: [
    //         {
    //             id: "hotWaterProduction",
    //             label: "Production d'eau chaude sanitaire",
    //             type: "options",
    //             isMultiOptions: true,
    //             items: [
    //                 { label: 'Chaudière', value: 'Chaudière', icon: faUser, pdfConfig: { dx: -396, dy: - 416, pageIndex: 0 } },
    //                 { label: 'Cumulus électrique', value: 'Cumulus électrique', icon: faUser, pdfConfig: { dx: -304, dy: - 416, pageIndex: 0 } },
    //                 { label: 'Chauffe-eau solaire', value: 'Chauffe-eau solaire', icon: faUser, pdfConfig: { dx: -190, dy: - 416, pageIndex: 0 } },
    //                 { label: 'Pompe à chaleur', value: 'Pompe à chaleur', icon: faUser, pdfConfig: { dx: -396, dy: - 435, pageIndex: 0 } },
    //                 { label: 'Thermodynamique', value: 'Thermodynamique', icon: faUser, pdfConfig: { dx: -304, dy: - 435, pageIndex: 0 } },
    //             ],
    //         }
    //     ],
    // },
    // { //26
    //     id: "yearInstallationHotWater",
    //     title: "EAU CHAUDE SANITAIRE",
    //     fields: [
    //         {
    //             id: "yearInstallationHotWater",
    //             label: "Année d'installation",
    //             type: "number",
    //             pdfConfig: { dx: -90, dy: - 434, pageIndex: 0 }
    //         }
    //     ]
    // },
    {//27 TODO
        id: "heaters",
        title: "CHAUFFAGE",
        fields: [
            {
                id: "heaters",
                type: "picker",
                items: [
                    { label: "Selectionner un organe", value: "" },
                    { label: "Electrique", value: "Electrique", pdfConfig: { dx: -453, dy: - 499, pageIndex: 0 } },
                    { label: "Gaz", value: "Gaz", pdfConfig: { dx: -375, dy: - 499, pageIndex: 0 } },
                    { label: "Fioul", value: "Fioul", pdfConfig: { dx: -311, dy: - 499, pageIndex: 0 } },
                    { label: "Pompe & Chaleur", value: "Pompe & Chaleur", pdfConfig: { dx: -240, dy: - 499, pageIndex: 0 } },
                    { label: "Chaudière", value: "Chaudière", pdfConfig: { dx: -453, dy: - 517, pageIndex: 0 } },
                    { label: "Poéle", value: "Poéle", pdfConfig: { dx: -375, dy: - 517, pageIndex: 0 } },
                    { label: "Bois", value: "Bois", pdfConfig: { dx: -311, dy: - 517, pageIndex: 0 } },
                    { label: "Autre", value: "Autre", pdfConfig: { dx: -240, dy: - 517, pageIndex: 0 } },
                ],
                label: "Organes de chauffage",
                mendatory: true,
                errorId: "heatersError",
                style: { marginBottom: 32 },
            },
            {
                id: "transmittersTypes",
                label: "Types d'émetteurs",
                type: "options",
                isMultiOptions: true,
                items: [
                    { label: 'Radiateurs électriques', value: 'Radiateurs électriques', icon: faUser, isConditional: true, condition: { with: "heaters", values: ["Electrique", "Poéle", "Bois", "Autre"] }, pdfConfig: { dx: -453, dy: - 536, pageIndex: 0 } },
                    { label: 'Clim réversible', value: 'Clim réversible', icon: faUser, isConditional: true, condition: { with: "heaters", values: ["Electrique", "Poéle", "Bois", "Autre"] }, pdfConfig: { dx: -311, dy: - 554, pageIndex: 0 } },
                    { label: 'Radiateur fonte', value: 'Radiateur fonte', icon: faUser, isConditional: true, condition: { with: "heaters", values: ["Gaz", "Fioul", "Pompe & Chaleur", "Chaudière"] }, pdfConfig: { dx: -265, dy: - 536, pageIndex: 0 } },
                    { label: 'Radiateur alu', value: 'Radiateur alu', icon: faUser, isConditional: true, condition: { with: "heaters", values: ["Gaz", "Fioul", "Pompe & Chaleur", "Chaudière"] }, pdfConfig: { dx: -230, dy: - 536, pageIndex: 0 } },
                    { label: 'Radiateur acier', value: 'Radiateur acier', icon: faUser, isConditional: true, condition: { with: "heaters", values: ["Gaz", "Fioul", "Pompe & Chaleur", "Chaudière"] }, pdfConfig: { dx: -205, dy: - 536, pageIndex: 0 } },
                    { label: 'Chauffage au sol', value: 'Chauffage au sol', icon: faUser, isConditional: true, condition: { with: "heaters", values: ["Gaz", "Fioul", "Pompe & Chaleur", "Chaudière"] }, pdfConfig: { dx: -155, dy: - 536, pageIndex: 0 } },
                    { label: 'Convecteur', value: 'Convecteur', icon: faUser, isConditional: true, condition: { with: "heaters", values: ["Poéle", "Bois", "Autre"] }, pdfConfig: { dx: -453, dy: - 554, pageIndex: 0 } },
                    { label: 'Autre', value: 'Autre', icon: faUser, isConditional: true, condition: { with: "heaters", values: ["Poéle", "Bois", "Autre"] }, pdfConfig: { dx: -155, dy: - 554, pageIndex: 0 } },
                ],
            }
        ]
    },
    // { //28
    //     id: "yearInstallationHeaters",
    //     title: "CHAUFFAGE",
    //     fields: [
    //         {
    //             id: "yearInstallationHeaters",
    //             label: "Année d'installation",
    //             type: "number",
    //             pdfConfig: { dx: -485, dy: - 573, pageIndex: 0 }
    //         }
    //     ]
    // },
    // { //29
    //     id: "idealTemperature",
    //     title: "CHAUFFAGE",
    //     fields: [
    //         {
    //             id: "idealTemperature",
    //             label: "Quelle est votre température idéale de confort ?",
    //             type: "number",
    //             pdfConfig: { dx: -227, dy: - 573, pageIndex: 0 }
    //         }
    //     ]
    // },
    // { //30
    //     id: "isMaintenanceContract",
    //     title: "CHAUFFAGE",
    //     fields: [
    //         {
    //             id: "isMaintenanceContract",
    //             label: "Contrat de maintenance",
    //             type: "options",
    //             items: [
    //                 { label: 'Non', value: 'Non', icon: faTimes, iconColor: theme.colors.error, pdfConfig: { dx: -403, dy: - 592, pageIndex: 0 } },
    //                 { label: 'Oui', value: 'Oui', icon: faCheck, iconColor: "green", pdfConfig: { dx: -453, dy: - 592, pageIndex: 0 } },
    //             ],
    //             errorId: "isMaintenanceContractError",
    //             mendatory: true,
    //         }
    //     ],
    // },
    // { //31
    //     id: "isElectricityProduction",
    //     title: "PRODUCTION D'ENERGIE",
    //     fields: [
    //         {
    //             id: "isElectricityProduction",
    //             label: "Produisez-vous de l'éléctricité ?",
    //             type: "options",
    //             items: [
    //                 { label: 'Non', value: 'Non', icon: faTimes, iconColor: theme.colors.error, pdfConfig: { skip: true } },
    //                 { label: 'Oui', value: 'Oui', icon: faCheck, iconColor: "green", pdfConfig: { skip: true } },
    //             ],
    //             errorId: "isElectricityProductionError",
    //             mendatory: true,
    //         },
    //     ],
    // },
    // { //32
    //     id: "elecProdDetails",
    //     title: "PRODUCTION D'ENERGIE",
    //     fields: [
    //         {
    //             id: "elecProdType",
    //             label: "Type de production",
    //             type: "options",
    //             items: [
    //                 { label: 'Photovoltaïque', value: 'Photovoltaïque', icon: faUser, pdfConfig: { dx: -453, dy: - 661, pageIndex: 0 } },
    //                 { label: 'Eolienne', value: 'Eolienne', icon: faUser, pdfConfig: { dx: -325, dy: - 661, pageIndex: 0 } },
    //             ],
    //             mendatory: true,
    //             errorId: "elecProdTypeError",
    //             isConditional: true,
    //             condition: { with: "isElectricityProduction", values: ["Oui"] }
    //         },
    //         {
    //             id: "elecProdInstallYear",
    //             label: "Année d'installation",
    //             type: "number",
    //             mendatory: true,
    //             errorId: "elecProdInstallYearError",
    //             isConditional: true,
    //             condition: { with: "isElectricityProduction", values: ["Oui"] },
    //             style: { marginTop: 50 },
    //             pdfConfig: { dx: -53, dy: - 661, pageIndex: 0 }
    //         }
    //     ],
    // },
    // { //31
    //     id: "elecProdDetails",
    //     title: "PRODUCTION D'ENERGIE",
    //     fields: [
    //         {
    //             id: "energyUsage",
    //             label: "Revente ou autoconsommation ?",
    //             type: "options",
    //             items: [
    //                 { label: 'Revente', value: 'Revente', icon: faUser, pdfConfig: { dx: -325, dy: - 680, pageIndex: 0 } },
    //                 { label: 'Autoconsommation', value: 'Autoconsommation', icon: faUser, pdfConfig: { dx: -259, dy: - 680, pageIndex: 0 } },
    //             ],
    //             errorId: "energyUsageError",
    //             mendatory: true,
    //             isConditional: true,
    //             condition: { with: "elecProdType", values: ["Photovoltaïque"] }
    //         },
    //     ],
    // },
    // {//33
    //     id: "yearlyElecCost",
    //     title: "PRODUCTION D'ENERGIE",
    //     fields: [
    //         {
    //             id: "yearlyElecCost",
    //             type: "textInput",
    //             label: "Dépense anuelle d'éléctricité",
    //             isNumeric: true,
    //             errorId: "yearlyElecCostError",
    //             mendatory: true,
    //             pdfConfig: { dx: -53, dy: - 661, pageIndex: 0 }
    //         },
    //     ],
    // },
    // { //34
    //     id: "roof",
    //     title: "TOITURE",
    //     fields: [
    //         {
    //             id: "roofLength",
    //             label: "Longeur Utile",
    //             type: "number",
    //             placeholder: "Exemple: 10m",
    //             pdfConfig: { dx: -305, dy: - 794, pageIndex: 0 }
    //         },
    //         {
    //             id: "roofWidth",
    //             label: "Largeur Utile",
    //             type: "number",
    //             placeholder: "Exemple: 5m",
    //             style: { marginTop: 50 },
    //             pdfConfig: { dx: -515, dy: - 794, pageIndex: 0 }
    //         },
    //         {
    //             id: "roofTilt",
    //             label: "Inclinaison",
    //             type: "number",
    //             placeholder: "Exemple: 10°C",
    //             style: { marginTop: 50 },
    //             pdfConfig: { dx: -150, dy: - 794, pageIndex: 0 }
    //         },
    //     ]
    // },
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
    //             pdfConfig: { dx: -556, dy: - 194, pageIndex: 3 }
    //         },
    //         {
    //             id: "addressStreet",
    //             type: "textInput",
    //             label: "Rue",
    //             errorId: "addressStreetError",
    //             mendatory: true,
    //             pdfConfig: { dx: -468, dy: - 194, pageIndex: 3 }
    //         },
    //         {
    //             id: "addressCode",
    //             type: "textInput",
    //             mask: "[0][0][0][0][0]",
    //             label: "Code Postal",
    //             isNumeric: true,
    //             errorId: "addressCodeError",
    //             mendatory: true,
    //             pdfConfig: { dx: -518, dy: - 218, pageIndex: 3, spaces: { afterEach: 1, str: '      ' } }
    //         },
    //         {
    //             id: "addressCity",
    //             type: "textInput",
    //             label: "Ville",
    //             errorId: "addressCityError",
    //             mendatory: true,
    //             pdfConfig: { dx: -349, dy: - 218, pageIndex: 3 }
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
    //             pdfConfig: { dx: -521, dy: - 243, pageIndex: 3, spaces: { afterEach: 2, str: '          ' } }
    //         },
    //         {
    //             id: "disablePhoneContact",
    //             label: "J'accepte d'être rappelé à ce numéro",
    //             type: "checkbox",
    //         },
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
    //             pdfConfig: { dx: -380, dy: - 267, pageIndex: 3 }
    //         },
    //     ],
    //     isLast: true
    // },
]