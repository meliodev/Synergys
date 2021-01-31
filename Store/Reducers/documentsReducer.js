
const initialState = { newAttachments: [] }

function setNetworkStatus(state = initialState, action) {
    let nextState
    switch (action.type) {
        case 'UPLOAD_PROGRESS_CHANGED':
            var newAttachmentIndex = state.newAttachments.findIndex(item => item.name === action.value.name) //name is unique (generated from instant date)
            if (newAttachmentIndex !== -1) {
                // attachment already on array: edit progress
                nextState = {
                    ...state,
                    newAttachments: state.newAttachments.map(item => item.id === action.value.id ? { ...item, progress: action.value.progress } : item)
                }
            }
            else {
                // attachment is not on array (just started uploading): add it to array
                nextState = {
                    ...state,
                    newAttachments: [...state.newAttachments, action.value]
                }
            }

            return nextState || state

        case 'UPLOAD_PROGRESS_FINISHED':
            var newAttachmentIndex = state.newAttachments.findIndex(item => item.name === action.value.name)
            // Delete the new attachment from array
            nextState = {
                ...state,
                newAttachments: state.newAttachments.filter((item, index) => index !== newAttachmentIndex)
            }

            return nextState || state

        default:
            return state
    }
}

export default setNetworkStatus