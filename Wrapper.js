import React, { Component } from 'react'
import { Children } from 'react'
import { StyleSheet, View, Alert } from 'react-native'
import NetInfo from "@react-native-community/netinfo"
import { connect } from 'react-redux'

import OfflineBar from './components/OffLineBar'

import { setNetwork, setProcessModel } from './core/redux'
import { stat } from 'react-native-fs'
import firebase from '@react-native-firebase/app'

const db = firebase.firestore()

class Wrapper extends Component {
    constructor(props) {
        super(props)
        this.alertDisplayed = false
        this.networkListener = this.networkListener.bind(this)
    }

    componentDidMount() {
        this.networkListener()
       // this.fetchProcessModel()
    }

    networkListener() {
        this.unsubscribeNetwork = NetInfo.addEventListener(state => {
            const { type, isConnected } = state
            const network = { type, isConnected }
            if (!isConnected && !this.alertDisplayed) Alert.alert('Mode Hors-Ligne', "L'application risque de ne pas fonctionner de façon optimale en mode hors-ligne. Veuillez rétablir votre connection réseau.")
            this.alertDisplayed = true
            setNetwork(this, network)
        })
    }

    // async fetchProcessModel() {
    //     const processModel = await db.collection('Process').orderBy('createdAt', 'desc').limit(1).get().then((querySnapshot) => {
    //         if (querySnapshot.empty) {
    //             return undefined
    //         }

    //         const processModel = querySnapshot.docs[0].data().process
    //         return processModel
    //     })

    //     setProcessModel(this, processModel)
    // }

    componentWillUnmount() {
        this.unsubscribeNetwork && this.unsubscribeNetwork()
    }

    render() {
        const { isConnected } = this.props.network

        return (
            <View style={styles.container}>
                {!isConnected && <OfflineBar />}
                {this.props.children}
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        role: state.roles.role,
        network: state.network,
        processModel: state.process.processModel
        //fcmToken: state.fcmtoken
    }
}

export default connect(mapStateToProps)(Wrapper)

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})





// persistProcessModel() {
//     const { version } = processModel
//     let copyProcessModel = _.cloneDeep(processModel)
//     delete copyProcessModel.version
//     const createdAt = moment().format()
//     const payload = { process: copyProcessModel, createdAt }

//     db.collection('Process').doc(`version${version}`).set(payload).then(() => console.log('YEAH'))
// }