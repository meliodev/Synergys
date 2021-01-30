// Store/configureStore.js

import { createStore, combineReducers, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
import createSagaMiddleware from 'redux-saga'

import rolesReducer from './Reducers/rolesReducer'
import fcmtokenReducer from './Reducers/fcmtokenReducer'
import userReducer from './Reducers/userReducer'
import networkReducer from './Reducers/networkReducer'
import counterReducer from './Reducers/counterReducer'
import projectsReducer from './Reducers/projectsReducer'
import loadingReducer from './Reducers/loadingReducer'

// Imports: Redux Root Saga
import { rootSaga } from './Sagas/index'

// Middleware: Redux Saga
const sagaMiddleware = createSagaMiddleware()

const rootReducer = combineReducers({
    roles: rolesReducer,
    fcmtoken: fcmtokenReducer,
    user: userReducer,
    network: networkReducer,
    counter: counterReducer, //saga
    projects: projectsReducer, //saga + firebase (firestore)
    loading: loadingReducer,
})

// Redux: Store
const store = createStore(
    rootReducer,
    applyMiddleware(
        sagaMiddleware,
        createLogger(),
    )
)

// Middleware: Redux Saga
sagaMiddleware.run(rootSaga)

export default store
