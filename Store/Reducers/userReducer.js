
const initialState = { user: { displayName: '', connected: false } }

function setDisplayName(state = initialState, action) {
    let nextState
    switch (action.type) {
        case 'DISPLAYNAME':
            nextState = {
                ...state,
                user: {
                    ...state.user,
                    displayName: action.value.displayName,
                    connected: action.value.connected
                }
            }

            return nextState || state

        default:
            return state
    }
}

export default setDisplayName