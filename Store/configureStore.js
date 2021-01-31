// Store/configureStore.js

import { createStore, combineReducers } from 'redux';
import rolesReducer from './Reducers/rolesReducer'
import fcmtokenReducer from './Reducers/fcmtokenReducer'
import userReducer from './Reducers/userReducer'
import networkReducer from './Reducers/networkReducer'
import documentsReducer from './Reducers/documentsReducer'

const rootReducer = combineReducers({ roles: rolesReducer, fcmtoken: fcmtokenReducer, user: userReducer, network: networkReducer, documents: documentsReducer })

export default createStore(rootReducer)