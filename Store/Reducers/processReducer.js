
const initialState = { processModel: undefined }

function setProcessModel(state = initialState, action) {
    let nextState
    switch (action.type) {
        case 'SET_PROCESS_MODEL':
            nextState = {
                ...state,
                processModel: action.value
            }

            return nextState || state

        default:
            return state
    }
}

export default setProcessModel