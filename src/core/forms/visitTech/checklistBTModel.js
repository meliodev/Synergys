
import { faCheck, faTimes, faQuestionCircle } from "@fortawesome/pro-light-svg-icons";
import * as theme from '../../theme'

import moment from 'moment';
import 'moment/locale/fr'
moment.locale('fr')

export const checklistBTModel = (params) => {

    const { pageIndex, clientName } = params

    const model = [
        {//0
            id: "metaDataPAA",
            title: "",
            fields: [
                {
                    id: "clientName",
                    type: "autogen",
                    value: clientName,
                    pdfConfig: { dx: -300, dy: - 25, pageIndex }
                },
                {
                    id: "vtDate",
                    type: "autogen",
                    value: moment().format('DD/MM/YYYY'),
                    pdfConfig: { dx: -287, dy: - 47, pageIndex },
                },
            ]
        },
        {//1
            id: "blocTypeBT",
            title: "CHAUFFE-EAU THERMODYNAMIQUE - Partie Electrique",
            fields: [
                {
                    id: "blocTypeBT",
                    label: "Type de bloc",
                    type: "options",
                    items: [
                        { label: 'Monobloc', value: 'Monobloc', icon: faQuestionCircle, pdfConfig: { dx: -374, dy: - 107, pageIndex } },
                        { label: 'Bi-Bloc', value: 'Bi-Bloc', icon: faQuestionCircle, pdfConfig: { dx: -260, dy: - 107, pageIndex } },
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
                        { label: "Acier", value: "Acier", icon: faQuestionCircle, pdfConfig: { dx: -391, dy: -239, pageIndex } },
                        { label: "Cuivre", value: "Cuivre", icon: faQuestionCircle, pdfConfig: { dx: -247, dy: - 239, pageIndex } },
                        { label: "Plastique", value: "Plastique", icon: faQuestionCircle, pdfConfig: { dx: -126, dy: - 239, pageIndex } },
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
                        { label: "Au sol", value: "Au sol", icon: faQuestionCircle, pdfConfig: { dx: -384, dy: -418, pageIndex } },
                        { label: "Support classique", value: "Support classique", icon: faQuestionCircle, pdfConfig: { dx: -274, dy: - 418, pageIndex } },
                        { label: "Support Mupro", value: "Support Mupro", icon: faQuestionCircle, pdfConfig: { dx: -156, dy: - 418, pageIndex } },
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
                        { label: "À faire", value: "À faire", icon: faQuestionCircle, pdfConfig: { dx: -295, dy: - 466, pageIndex } },
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