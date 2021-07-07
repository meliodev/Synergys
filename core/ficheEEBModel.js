import { faBuilding, faCheck, faHouse, faTimes, faUser } from "@fortawesome/pro-light-svg-icons";
import * as theme from './theme'

export const ficheEEBModel = [
    //*********************** STEP1 *************************
    {//0
        id: "fullName",
        title: "NOM ET PRENOM",
        fields: [
            {
                id: "nameSir",
                type: "textInput",
                label: "Monsieur",
                errorId: "nameSirError",
            },
            {
                id: "nameMiss",
                type: "textInput",
                label: "Madame",
                errorId: "nameMissError",
            },
        ]
    },
    {//1
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
                condition: { with: "nameSir" }
            },
            {
                id: "ageSir",
                type: "textInput",
                isNumeric: true,
                label: "Age Mr",
                errorId: "ageSirError",
                mendatory: true,
                isConditional: true,
                condition: { with: "nameSir" }
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
                condition: { with: "nameMiss" }
            },
            {
                id: "ageMiss",
                type: "textInput",
                isNumeric: true,
                label: "Age Mme",
                errorId: "ageMissError",
                mendatory: true,
                isConditional: true,
                condition: { with: "nameMiss" }
            },
        ]
    },
    { //2
        id: "familySituation",
        title: "SITUATION",
        fields: [
            {
                id: "familySituation",
                label: "Situation de famille",
                type: "options",
                items: [
                    { label: 'Célibataire', value: 'Célibataire', icon: faUser },
                    { label: 'Marié', value: 'Marié', icon: faUser },
                    { label: 'Pacsé', value: 'Pacsé', icon: faUser },
                    { label: 'Concubinage', value: 'Concubinage', icon: faUser },
                    { label: 'Divorcé', value: 'Divorcé', icon: faUser },
                    { label: 'Veuve', value: 'Veuve', icon: faUser }
                ],
            }
        ]
    },
    { //3
        id: "houseOwnership",
        title: "SITUATION",
        fields: [
            {
                id: "houseOwnership",
                label: "Propriétaire ou locataire",
                type: "options",
                items: [
                    { label: 'Propriétaire', value: 'Propriétaire', icon: faUser },
                    { label: 'Locataire', value: 'Locataire', icon: faUser },
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
            }
        ]
    },
    { //5
        id: "taxIncome",
        title: "SITUATION",
        fields: [
            {
                id: "taxIncome",
                type: "textInput",
                isNumeric: true,
                label: "Revenu fiscal de référence en €",
                errorId: "taxIncomeError",
                mendatory: true
            },
        ]
    },
    { //6
        id: "demographicSituation",
        title: "SITUATION",
        fields: [
            {
                id: "familyMembersCount",
                type: "textInput",
                isNumeric: true,
                label: "Nombre d'occupants dans le foyer",
                errorId: "familyMembersCountError",
                mendatory: true
            },
            {
                id: "childrenCount",
                type: "textInput",
                isNumeric: true,
                label: "Nombre d'enfants à charge (-18 ans)",
                errorId: "childrenCountError",
                mendatory: true
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
                    { label: 'Non', value: 'Non', icon: faTimes, iconColor: theme.colors.error },
                    { label: 'Oui', value: 'Oui', icon: faCheck, iconColor: "green" },
                ],
                errorId: "aidAndSubError",
                mendatory: true
            }
        ],
        isLast: true,
    },
    //********************  STEP 2 *********************************************
    { //8
        id: "housingType",
        title: "HABITATION",
        fields: [
            {
                id: "housingType",
                label: "Type d'habitation",
                type: "options",
                items: [
                    { label: 'Maison individuelle', value: 'Maison individuelle', icon: faHouse },
                    { label: 'Appartement', value: 'Appartement', icon: faBuilding },
                ],
                errorId: "housingTypeError",
                mendatory: true
            }
        ],
        isFirst: true,
    },
    { //9
        id: "surfaces",
        title: "HABITATION",
        fields: [
            {
                id: "landSurface",
                type: "textInput",
                isNumeric: true,
                label: "Surface du terrain en m²",
                errorId: "landSurfaceError",
                mendatory: true
            },
            {
                id: "livingSurface",
                type: "textInput",
                isNumeric: true,
                label: "Surface habitable en m²",
                errorId: "livingSurfaceError",
                mendatory: true
            },
            {
                id: "heatedSurface",
                type: "textInput",
                isNumeric: true,
                label: "Surface à chauffer en m²",
                errorId: "heatedSurfaceError",
                mendatory: true
            },
        ]
    },
    { //10
        id: "yearHomeConstruction",
        title: "HABITATION",
        fields: [
            {
                id: "yearHomeConstruction",
                label: "Année de construction de l'habitation",
                type: "number",
                errorId: "yearHomeConstructionError",
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
                    { label: 'Toit-terasse', value: 'Toit-terasse', icon: faUser },
                    { label: 'Combles aménagés', value: 'Combles aménagés', icon: faUser },
                    { label: 'Combles perdus', value: 'Combles perdus', icon: faUser },
                    { label: 'Terasses+Combles', value: 'Terasses+Combles', icon: faUser },
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
                    { label: '1', value: '1', icon: faUser },
                    { label: '2', value: '2', icon: faUser },
                    { label: '3', value: '3', icon: faUser },
                    { label: '4', value: '4', icon: faUser },
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
                mendatory: true
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
                mendatory: true
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
                    { label: 'Est', value: 'Est', icon: faUser },
                    { label: 'Sud-Est/Sud-Ouest', value: 'Sud-Est/Sud-Ouest', icon: faUser },
                    { label: 'Sud', value: 'Sud', icon: faUser },
                    { label: 'Ouest', value: 'Ouest', icon: faUser },
                ],
                errorId: "slopeOrientationError",
                mendatory: true
            }
        ]
    },
    { //16
        id: "slopeSupport",
        title: "HABITATION",
        fields: [
            {
                id: "slopeSupport",
                label: "Support de la pente",
                type: "options",
                items: [
                    { label: 'Terrain', value: 'Terrain', icon: faUser },
                    { label: 'Garrage', value: 'Garrage', icon: faUser },
                    { label: 'Toitutre', value: 'Toitutre', icon: faUser },
                    { label: 'Autre', value: 'Autre', icon: faUser },
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
                    { label: 'Cave', value: 'Cave', icon: faUser },
                    { label: 'Terre-plein', value: 'Terre-plein', icon: faUser },
                    { label: 'Vide sanitaire', value: 'Vide sanitaire', icon: faUser },
                    { label: 'Aucun', value: 'Aucun', icon: faUser },
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
                    { label: 'Pierre', value: 'Pierre', icon: faUser },
                    { label: 'Béton', value: 'Béton', icon: faUser },
                    { label: 'Béton celullaire', value: 'Béton celullaire', icon: faUser },
                    { label: 'Brique', value: 'Brique', icon: faUser },
                    { label: 'Bois', value: 'Bois', icon: faUser },
                    { label: 'Autre', value: 'Autre', icon: faUser },
                ],
                errorId: "wallMaterialError",
                mendatory: true
            }
        ],
        isFirst: true,
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
                    { label: 'Non', value: 'Non', icon: faTimes, iconColor: theme.colors.error },
                    { label: 'Oui', value: 'Oui', icon: faCheck, iconColor: "green" },
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
                    { label: 'Non', value: 'Non', icon: faTimes, iconColor: theme.colors.error },
                    { label: 'Oui', value: 'Oui', icon: faCheck, iconColor: "green" },
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
                    { label: 'Non', value: 'Non', icon: faTimes, iconColor: theme.colors.error },
                    { label: 'Oui', value: 'Oui', icon: faCheck, iconColor: "green" },
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
                    { label: 'Non', value: 'Non', icon: faTimes, iconColor: theme.colors.error },
                    { label: 'Oui', value: 'Oui', icon: faCheck, iconColor: "green" },
                ],
                errorId: "lostAticsIsolationError",
                mendatory: true
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
                    { label: 'PVC', value: 'PVC', icon: faUser },
                    { label: 'Bois', value: 'Bois', icon: faUser },
                    { label: 'Alu', value: 'Alu', icon: faUser },
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
                    { label: 'Simple', value: 'Simple', icon: faUser },
                    { label: 'Double', value: 'Double', icon: faUser },
                    { label: 'Triple', value: 'Triple', icon: faUser },
                ],
                errorId: "glazingTypeError",
                mendatory: true
            }
        ],
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
                    { label: 'Chaudière', value: 'Chaudière', icon: faUser },
                    { label: 'Cumulus électrique', value: 'Cumulus électrique', icon: faUser },
                    { label: 'Chauffe-eau solaire', value: 'Chauffe-eau solaire', icon: faUser },
                    { label: 'Pompe à chaleur', value: 'Pompe à chaleur', icon: faUser },
                    { label: 'Thermodynamique', value: 'Thermodynamique', icon: faUser },
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
            }
        ]
    },
    {//27
        id: "heaters",
        title: "CHAUFFAGE",
        fields: [
            {
                id: "heaters",
                type: "picker",
                items: [
                    { label: "Selectionner un organe", value: "" },
                    { label: "Electrique", value: "Electrique" },
                    { label: "Gaz", value: "Gaz" },
                    { label: "Fioul", value: "Fioul" },
                    { label: "Pompe & Chaleur", value: "Pompe & Chaleur" },
                    { label: "Chaudière", value: "Chaudière" },
                    { label: "Poéle", value: "Poéle" },
                    { label: "Bois", value: "Bois" },
                    { label: "Autre", value: "Autre" },
                ],
                label: "Organes de chauffage",
                mendatory: true,
                errorId: "heatersError",
                style: { marginBottom: 32 }
            },
            {
                id: "transmittersTypes",
                label: "Types d'émetteurs",
                type: "options",
                isMultiOptions: true,
                items: [
                    { label: 'Radiateurs électriques', value: 'Radiateurs électriques', icon: faUser, isConditional: true, condition: { with: "heaters", values: ["Electrique", "Poéle", "Bois", "Autre"] } },
                    { label: 'Clim réversible', value: 'Clim réversible', icon: faUser, isConditional: true, condition: { with: "heaters", values: ["Electrique", "Poéle", "Bois", "Autre"] } },
                    { label: 'Radiateur fonte', value: 'Radiateur fonte', icon: faUser, isConditional: true, condition: { with: "heaters", values: ["Gaz", "Fioul", "Pompe & Chaleur", "Chaudière"] } },
                    { label: 'Radiateur alu', value: 'Radiateur alu', icon: faUser, isConditional: true, condition: { with: "heaters", values: ["Gaz", "Fioul", "Pompe & Chaleur", "Chaudière"] } },
                    { label: 'Radiateur acier', value: 'Radiateur acier', icon: faUser, isConditional: true, condition: { with: "heaters", values: ["Gaz", "Fioul", "Pompe & Chaleur", "Chaudière"] } },
                    { label: 'Chauffage au sol', value: 'Chauffage au sol', icon: faUser, isConditional: true, condition: { with: "heaters", values: ["Gaz", "Fioul", "Pompe & Chaleur", "Chaudière"] } },
                    { label: 'Convecteur', value: 'Convecteur', icon: faUser, isConditional: true, condition: { with: "heaters", values: ["Poéle", "Bois", "Autre"] } },
                    { label: 'Autre', value: 'Autre', icon: faUser, isConditional: true, condition: { with: "heaters", values: ["Poéle", "Bois", "Autre"] } },
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
                    { label: 'Non', value: 'Non', icon: faTimes, iconColor: theme.colors.error },
                    { label: 'Oui', value: 'Oui', icon: faCheck, iconColor: "green" },
                ],
                errorId: "isMaintenanceContractError",
                mendatory: true
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
                    { label: 'Non', value: 'Non', icon: faTimes, iconColor: theme.colors.error },
                    { label: 'Oui', value: 'Oui', icon: faCheck, iconColor: "green" },
                ],
                errorId: "isElectricityProductionError",
                mendatory: true
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
                    { label: 'Photovoltaïque', value: 'Photovoltaïque', icon: faUser },
                    { label: 'Eolienne', value: 'Eolienne', icon: faUser },
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
                style: { marginTop: 50 }
            }
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
                mendatory: true
            },
        ],
        mendatory: true
    },
    { //34
        id: "roof",
        title: "TOITURE",
        fields: [
            {
                id: "roofLength",
                label: "Longeur Utile",
                type: "number",
                placeholder: "Exemple: 10m"
            },
            {
                id: "roofWidth",
                label: "Largeur Utile",
                type: "number",
                placeholder: "Exemple: 5m",
                style: { marginTop: 50 }
            },
            {
                id: "roofTilt",
                label: "Inclinaison",
                type: "number",
                placeholder: "Exemple: 10°C",
                style: { marginTop: 50 }
            },
        ]
    },
      {//35
        id: "generalData",
        title: "RENSEIGNEMENTS GENERAUX",
        fields: [
            {
                id: "address",
                label: "Adresse",
                type: "address",
                mendatory: true,
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
                isNumeric: true,
                label: "Téléphone",
                errorId: "phoneError",
                mendatory: true,
            },
            {
                id: "disablePhoneContact",
                label: "J'accepte d'être rappelé à ce numéro",
                type: "checkbox",
            },
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
            },
        ]
    },

]