import React, { Component } from 'react'
import { Children } from 'react'
import { StyleSheet, View, Alert } from 'react-native'
import NetInfo from "@react-native-community/netinfo"
import { connect } from 'react-redux'
import _ from 'lodash'
import { processModel } from './core/processModel'

import moment from 'moment';
import 'moment/locale/fr'
moment.locale('fr')

import OfflineBar from './components/OffLineBar'

import { setNetwork, setProcessModel } from './core/redux'
import { stat } from 'react-native-fs'
import { db } from './firebase'

class Wrapper extends Component {
    constructor(props) {
        super(props)
        this.alertDisplayed = false
        this.networkListener = this.networkListener.bind(this)
    }

    componentDidMount() {
        this.networkListener()
        //this.persistProcessModel()
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


    persistProcessModel() {
        // const processModel = {
        //     'version': 2,
        //     'init': {
        //         title: 'Initialisation',
        //         instructions: 'Lorem ipsum dolor',
        //         phaseOrder: 1,
        //         followers: ['Admin', 'Directeur commercial', 'Commercial'],
        //         steps: { //One step
        //             'prospectCreation': {
        //                 title: 'Création prospect',
        //                 instructions: 'Lorem ipsum dolor',
        //                 stepOrder: 1,
        //                 actions: [
        //                     {
        //                         id: 'billAmount',
        //                         title: "Montant de la facture", //#task allow adv to view devis before validating (multi-choice: voir/valider)
        //                         instructions: "",
        //                         actionOrder: 3,
        //                         collection: 'Projects',
        //                         documentId: '',
        //                         properties: [],
        //                         screenName: '',
        //                         screenParams: null,
        //                         type: 'manual',
        //                         responsable: 'ADV',
        //                         status: 'pending',
        //                         comment: '',
        //                         formSettings: {
        //                             label: 'Montant de la facture',
        //                             description: 'Veuillez renseigner le montant total de la facture de ce projet.',
        //                             keyboardType: 'Numeric'
        //                         },
        //                         operation: { type: 'update', field: 'billAmount' },
        //                         verificationType: 'comment',
        //                     }
        //                 ]
        //             }
        //         }
        //     }
        // }

        const { version } = processModel
        let copyProcessModel = _.cloneDeep(processModel)
        delete copyProcessModel.version
        const createdAt = moment().format()
        const payload = { process: copyProcessModel, createdAt }

        db.collection('Process').doc(`version${version}`).set(payload).then(() => console.log('YEAH'))
    }

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

