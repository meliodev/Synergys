

const initialState = {
    loading: false
}

export default function loadingReducer(state = initialState, action = {}) {
    console.log('action', action)
    switch (action.type) {

        case 'LOADING':
            return {
                ...state,
                loading: action.value
            }

        default:
            return state
    }
}