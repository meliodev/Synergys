
const initialState = {
    projects: { canCreate: false, canRead: false, canUpdate: false, canDelete: false },
    documents: { canCreate: false, canRead: false, canUpdate: false, canDelete: false },
    orders: { canCreate: false, canRead: false, canUpdate: false, canDelete: false },
    users: { canCreate: false, canRead: false, canUpdate: false, canDelete: false },
    teams: { canCreate: false, canRead: false, canUpdate: false, canDelete: false },
    messages: { canCreate: false, canRead: false, canUpdate: false, canDelete: false },
    requests: { canCreate: false, canRead: false, canUpdate: false, canDelete: false },
    profile: { canCreate: false, canRead: false, canUpdate: false, canDelete: false },
}

function setPermissions(state = initialState, action) {
    let nextState
    switch (action.type) {
        case 'SET_PERMISSIONS':
            nextState = {
                ...state,
                projects: {
                    ...state.projects,
                    canCreate: action.value.projects.canCreate,
                    canRead: action.value.projects.canRead,
                    canUpdate: action.value.projects.canUpdate,
                    canDelete: action.value.projects.canDelete,
                },
                documents: {
                    ...state.documents,
                    canCreate: action.value.documents.canCreate,
                    canRead: action.value.documents.canRead,
                    canUpdate: action.value.documents.canUpdate,
                    canDelete: action.value.documents.canDelete,
                },
                orders: {
                    ...state.orders,
                    canCreate: action.value.orders.canCreate,
                    canRead: action.value.orders.canRead,
                    canUpdate: action.value.orders.canUpdate,
                    canDelete: action.value.orders.canDelete,
                },
                users: {
                    ...state.users,
                    canCreate: action.value.users.canCreate,
                    canRead: action.value.users.canRead,
                    canUpdate: action.value.users.canUpdate,
                    canDelete: action.value.users.canDelete,
                },
                teams: {
                    ...state.teams,
                    canCreate: action.value.teams.canCreate,
                    canRead: action.value.teams.canRead,
                    canUpdate: action.value.teams.canUpdate,
                    canDelete: action.value.teams.canDelete,
                },
                messages: {
                    ...state.messages,
                    canCreate: action.value.messages.canCreate,
                    canRead: action.value.messages.canRead,
                    canUpdate: action.value.messages.canUpdate,
                    canDelete: action.value.messages.canDelete,
                },
                requests: {
                    ...state.requests,
                    canCreate: action.value.requests.canCreate,
                    canRead: action.value.requests.canRead,
                    canUpdate: action.value.requests.canUpdate,
                    canDelete: action.value.requests.canDelete,
                },
                profile: {
                    ...state.profile,
                    canCreate: action.value.profile.canCreate,
                    canRead: action.value.profile.canRead,
                    canUpdate: action.value.profile.canUpdate,
                    canDelete: action.value.profile.canDelete,
                },
            }

            return nextState || state

        default:
            return state
    }
}

export default setPermissions