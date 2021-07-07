import React from "react";
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { faUser, faAddressCard, fal, faFileInvoice, faVial, faVials } from '@fortawesome/pro-light-svg-icons'

import TwoTabs from '../../components/TwoTabs'
import SearchBar from '../../components/SearchBar'
import TabView from '../../components/TabView'
import EmptyList from "../../components/EmptyList";

import ListUsers from '../Users/ListUsers'

import { db } from '../../firebase'
import * as theme from "../../core/theme";
import { constants } from "../../core/constants";
import ListFormsContainer from "../../containers/ListFormsContainer";

class ListForms extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            index: 0,
            showInput: false,
            searchInput: '',
            titleText: "Etudes et Evaluation des besoins"
        }
    }


    render() {

        const { index, searchInput, showInput, titleText } = this.state
        const { isConnected } = this.props.network

        return (
            <View style={{ flex: 1 }}>
                <SearchBar
                    main={this}
                    title={!showInput}
                    titleText={titleText}
                    showBar={showInput}
                    placeholder='Rechercher un élément'
                    handleSearch={() => this.setState({ searchInput: '', showInput: !showInput })}
                    searchInput={searchInput}
                    searchUpdated={(searchInput) => this.setState({ searchInput })}
                />
                <ListFormsContainer
                    collection='Eeb'
                    creationScreen="CreateEEB"
                    navigation={this.props.navigation}
                    emptyList={
                        <EmptyList
                            icon={faVials}
                            header='Aucune simulation'
                            description='Appuyez sur le boutton "+" pour faire une simulation.'
                            offLine={!isConnected}
                        />
                    }
                />
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        role: state.roles.role,
        permissions: state.permissions,
        network: state.network,
        //fcmToken: state.fcmtoken
    }
}

export default connect(mapStateToProps)(ListForms)










