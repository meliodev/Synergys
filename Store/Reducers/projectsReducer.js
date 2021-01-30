const types = {
    PROJECTS: {
        SYNC: 'PROJECTS.SYNC',
        NEW: {
            CHANGE: 'PROJECTS.NEW.CHANGE',
            SEND: 'PROJECTS.NEW.SEND',
            SUCCESS: 'PROJECTS.NEW.SUCCESS',
            FAIL: 'PROJECTS.NEW.FAIL',
        }
    }
}

const initialState = {
    list: [],
    new: '',
    response: '',
    error: '',
}

export default function projectReducer(state = initialState, action = {}) {
    switch (action.type) {
        case types.PROJECTS.SYNC:
            return {
                ...state,
                list: action.projects
            }

        case types.PROJECTS.NEW.CHANGE:
            return {
                ...state,
                new: action.project
            }

        case types.PROJECTS.NEW.SUCCESS:
            return {
                ...state,
                response: 'success',
            }

        case types.PROJECTS.NEW.FAIL:
            return {
                ...state,
                error: action.error,
            }

        default:
            return state
    }
}