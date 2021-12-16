import { Alert } from 'react-native'
import firebase, { db } from '../firebase'
import { techSteps, highRolesValues } from './constants'

export const configureQuery = (collection, queryFilters, params) => {

    let query = db.collection(collection)

    // (if undefined -> user has full read access)
    if (queryFilters) { 

        //Add missing values
        queryFilters = configureQueryParams(queryFilters, params)

        //Sort query
        queryFilters.sort((a, b) => (a.filterOrder > b.filterOrder) ? 1 : -1)

        //Set query
        queryFilters.forEach((queryFilter) => {
            const { clause, filter, operation, value, field, sort } = queryFilter

            if (queryFilter.clause === 'where') {
                query = query.where(filter, operation, value)
            }

            else if (queryFilter.clause === 'orderBy') {
                query = query.orderBy(field, sort)
            }
        })
    }

    return query
}


const configureQueryParams = (queryFilters, params) => { //Task: Send the right params according to query filter values needed

    for (let queryFilter of queryFilters) {

        //Configure empty values
        if (queryFilter.valueSource) {
            if (queryFilter.valueSource === 'currentUser') {

                let currentUser
                const { uid, email, displayName } = firebase.auth().currentUser

                if (typeof (queryFilter.value) === 'object') //User object (exp: Projects)
                    currentUser = {
                        id: uid,
                        email,
                        fullName: displayName,
                        role: params.role,
                    }

                else if (typeof (queryFilter.value) === 'string') //User id only (exp: Messages)
                    currentUser = uid

                queryFilter.value = currentUser
            }

            else queryFilter.value = params[queryFilter.valueSource] //exp where('type', '==', params['type'])
        }

    }

    return queryFilters
}

export const blockRoleUpdateOnPhase = (role, phase) => {
    const comPhases = ['Prospect', 'Visite technique préalable', 'Présentation étude']
    const techPhases = ['Visite technique', 'Installation', 'Maintenance']
    const isComPhase = comPhases.includes(phase)
    const isTechPhase = techPhases.includes(phase)
    const isBlockedUpdates = role === 'com' && isTechPhase || role === 'poseur' && isComPhase
    return isBlockedUpdates
}

export const enableProcessAction = (responsable, currentUserId, currentUserRole, currentPhase) => {

    const isHighRole = highRolesValues.includes(currentUserRole)
    const isCurrentRoleResponsable = responsable === currentUserRole

    let enabledAction = false
    if (isHighRole || isCurrentRoleResponsable)
        enabledAction = true

    return enabledAction
}

export const checkTechContact = (step, subscribers) => {
    const isStepTech = techSteps.includes()

    if (!isStepTech) return true
    else {
        const techContact = subscribers.filter((sub) => sub.role === 'Commercial')
        if (techContact.length > 0)
            return true

        else return false
    }
}


// const rootConfigureQueryParams = (collection, queryFilters, params) => {

//     switch (collection) {
//         case 'Projects': configureQueryParams_Projects(queryFilters, params)
//             break;

//         case 'Documents': configureQueryParams_Documents(queryFilters, params)
//             break;

//         case 'Agenda': configureQueryParams_Agenda(queryFilters, params)
//             break;

//         case 'Requests': configureQueryParams_Requests(queryFilters, params)
//             break;

//         case 'Messages': configureQueryParams_Messages(queryFilters, params)
//             break;

//         case 'Orders': configureQueryParams_Orders(queryFilters, params)
//             break;

//         case 'Teams': configureQueryParams_Teams(queryFilters, params)
//             break;

//         case 'Users': configureQueryParams_Users(queryFilters, params)
//             break;

//         case 'Clients': configureQueryParams_Clients(queryFilters, params)
//             break;

//         default return []
//             break;
//     }

//     return queryFilters
// }