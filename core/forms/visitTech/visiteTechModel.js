
import { faCheck, faTimes, faQuestionCircle } from "@fortawesome/pro-light-svg-icons";
import * as theme from '../../theme'

export const visiteTechModel = () => {

    const model = [
        
        {//1
            id: "subPower",
            title: "Informations générales",
            fields: [{
                id: "subPower",
                type: "textInput",
                isNumeric: true,
                label: "Puissance de l'abonnement souscrit",
                errorId: "subPowerError",
                mendatory: true,
                pdfConfig: { dx: -260, dy: - 187, pageIndex: 0 }
            }],
        },
        {//2
            id: "phaseType",
            title: "Informations générales",
            fields: [{
                id: "phaseType",
                label: "Type de phase",
                type: "options",
                items: [
                    { label: 'Monophasé', value: 'Monophasé', icon: faQuestionCircle, pdfConfig: { dx: -520, dy: - 301, squareSize: 10, pageIndex: 0 } },
                    { label: 'Triphasé', value: 'Triphasé', icon: faQuestionCircle, pdfConfig: { dx: -520, dy: - 332, squareSize: 10, pageIndex: 0 } },
                ],
                mendatory: true,
            }]
        },
        {//3
            id: "eletricPanelSize",
            title: "Informations générales",
            fields: [{
                id: "eletricPanelSize",
                type: "textInput",
                isNumeric: true,
                label: "Taille du tableau électrique à installer",
                instruction: { priority: "low", message: "Renseigner le nombre de modules" },
                errorId: "eletricPanelSizeError",
                mendatory: true,
                pdfConfig: { dx: -240, dy: - 402, pageIndex: 0 }
            }],
            isLast: true
        },
        //7 #task: Montant accompte (autoGen)
    ]

    return { model }
}