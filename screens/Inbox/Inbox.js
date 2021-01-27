//Conditionnal rendering depending on USER ROLE

import React from "react"
import { View } from 'react-native'

import TabView from '../../components/TabView'
import SearchBar from '../../components/SearchBar'
import Appbar from '../../components/Appbar'

import Notifications from './Notifications'
import ListMessages from './ListMessages'
import firebase from "react-native-firebase"
const db = firebase.firestore()

class Inbox extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            showInput: false,
            searchInput: '',
            index: 0,
            showInput: false,
            searchInput: ''
        }
    }

    render() {

        const routes = [
            { key: 'first', title: 'MESSAGES' },
            { key: 'second', title: 'NOTIFICATIONS' },
        ]

        let { index } = this.state
        let {showInput, searchInput} = this.state

        return (
            <View style={{ flex: 1 }}>

                {/* <Appbar menu title titleText= 'Boîte de réception'/> */}
                <SearchBar
            main={this}
            title={!showInput}
            titleText="Home"
            placeholder="Boîte de réception"
            showBar={showInput}
            handleSearch={() =>
              this.setState({searchInput: '', showInput: !showInput})
            }
            searchInput={searchInput}
            searchUpdated={(searchInput) => this.setState({searchInput})}
          />

                <TabView
                    navigationState={{ index, routes }}
                    onIndexChange={(index) => this.setState({ index, searchInput: '', showInput: false })}

                    Tab1={<ListMessages />}
                    Tab2={<Notifications />} />
            </View>
        )
    }
}

export default Inbox











