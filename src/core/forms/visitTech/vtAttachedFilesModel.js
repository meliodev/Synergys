
import { faCheck, faTimes, faQuestionCircle } from "@fortawesome/pro-light-svg-icons";
import * as theme from '../../theme'

export const vtAttachedFilesModel = () => {

    const model = [
        { //4
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
            ],
            isFirst: true,
        },
        { //5
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
            ],
            isLast: true,
        },
    ]
    return { model }
}