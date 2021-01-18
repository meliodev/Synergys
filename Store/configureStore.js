// Store/configureStore.js

import { createStore, combineReducers } from 'redux';
import rolesReducer from './Reducers/rolesReducer'
import fcmtokenReducer from './Reducers/fcmtokenReducer'
import userReducer from './Reducers/userReducer'

const rootReducer = combineReducers({ roles: rolesReducer, fcmtoken: fcmtokenReducer, user: userReducer })

export default createStore(rootReducer)