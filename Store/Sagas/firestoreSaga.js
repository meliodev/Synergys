import rsf from '../rsf'
import { call, takeLatest, select, put } from 'redux-saga/effects'// Worker: Increase Counter Async (Delayed By 4 Seconds)

// Worker: Set Project Document
function* setProject(payload) {
    //const uid = yield select(state => state.user.user.uid)
    //const name = yield select(state => state.projects.new)

    //yield put({ type: 'PROJECTS.NEW.CHANGE', project })

    const { project } = payload
    const id = project.ProjectId

    try {
        yield call(
            rsf.firestore.setDocument,
            `Projects/${id}`,
            project
        )

        yield put({ type: 'PRODUCT_NEW_SUCCESS' })
    }

    catch (error) {
        yield put({ type: 'PRODUCT_NEW_FAIL', error })
    }

    finally {
        yield put({ type: 'LOADING', value: false })
    }
}

// Watcher: Increase Counter Async
export function* watchSetProject() {
    // Take Last Action Only
    yield takeLatest('SET_PROJECT', setProject)
}