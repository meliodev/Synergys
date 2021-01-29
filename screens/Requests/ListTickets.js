import React, { Component } from 'react';
import ListRequests from './ListResquests'
import {withNavigation} from 'react-navigation'

class ListTickets extends Component {
    render() {
        return <ListRequests searchInput={this.props.searchInput} requestType='ticket' creationScreen= 'CreateTicketReq' offLine = {this.props.offLine}/>    
    }
}

export default withNavigation(ListTickets)