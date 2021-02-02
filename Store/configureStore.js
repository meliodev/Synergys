// Store/configureStore.js

import { createStore, combineReducers } from 'redux';
import { persistCombineReducers } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage';

import rolesReducer from './Reducers/rolesReducer'
import fcmtokenReducer from './Reducers/fcmtokenReducer'
import userReducer from './Reducers/userReducer'
import networkReducer from './Reducers/networkReducer'
import documentsReducer from './Reducers/documentsReducer'

const rootPersistConfig = {
    key: 'root',
    storage: AsyncStorage
}

const rootReducer = persistCombineReducers(rootPersistConfig, { roles: rolesReducer, fcmtoken: fcmtokenReducer, user: userReducer, network: networkReducer, documents: documentsReducer })
//const rootReducer = combineReducers({ roles: rolesReducer, fcmtoken: fcmtokenReducer, user: userReducer, network: networkReducer, documents: documentsReducer })

export default createStore(rootReducer)