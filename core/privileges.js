
import firebase from '@react-native-firebase/app'
const db = firebase.firestore()


export const configureQuery = (collection, queryFilters, params) => {

    let query = db.collection(collection)

    if (queryFilters) { // (if undefined -> user has full read access)

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

    if (params.role) console.log(`Query filters of role "${params.role}" for collection "${collection}"`)
    else console.log(`Query filters for collection: ${collection}`)
    queryFilters.forEach((item) => {
        console.log(item)
    })

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
