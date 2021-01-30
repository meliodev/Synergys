import React, {Component} from 'react';
import DatePicker from 'react-native-date-picker';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {ThemeColors} from 'react-navigation';
import * as theme from '../../core/theme';
import {Title} from 'react-native-paper';
import {Calendar} from 'react-native-calendars'
import moment from 'moment';
import 'moment/locale/fr';
moment.locale('fr');

import Appbar from '../../components/Appbar';
import SearchBar from '../../components/SearchBar';
import CustomIcons from '../../components/CustomIcons';

export default class MyDatePicker extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.label = this.props.navigation.getParam('label', '');
    this.userId = this.props.navigation.getParam('userId', '');

    this.state = {
      startDate: new Date(),
      startHour: new Date(),
      showInput: false,
      searchInput: '',
      hours : 0,
      minutes: 0
    };
  }

  handleSubmit() {
    const date = moment(this.state.startDate).format('YYYY-MM-DD');
    const time = moment(this.state.startHour).format('HH:mm');
    let fullDate = moment(date + ' ' + time);

    if (this.label === 'de début')
      this.props.navigation.state.params.onGoBack('start', fullDate);
    else this.props.navigation.state.params.onGoBack('due', fullDate);

    this.props.navigation.goBack();
  }

  render() {
    let {startDate, startHour, showInput, searchInput} = this.state;

    return (
      <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
        {/* <Appbar back close title titleText={`Date ${this.label}`} check handleSubmit={this.handleSubmit} /> */}
        <SearchBar
          main={this}
          title={!showInput}
          titleText="Créer une tâchea"
          placeholder="Rechercher un document"
          showBar={showInput}
          handleSearch={() =>
            this.setState({searchInput: '', showInput: !showInput})
          }
          searchInput={searchInput}
          searchUpdated={(searchInput) => this.setState({searchInput})}
        />
        <View style={{flex: 1, 
            // alignItems: 'center'
            }}>
          <View
            style={{
              flex: 0.5,
            //   alignItems: 'center',
            //   justifyContent: 'center',
              borderBottomColor: theme.colors.gray,
              borderBottomWidth: StyleSheet.hairlineWidth * 2,
            }}>
            {/* <Title style={{marginBottom: 15}}>Date {this.label}</Title> */}

            {/* <DatePicker
              date={startDate}
              onDateChange={(startDate) => this.setState({startDate})}
              mode="date"
              locale="fr"
              androidVariant="nativeAndroid"
              fadeToColor={theme.colors.primary}
            /> */}
            <Calendar
          style={{
            margin: '3%',
          }}
          markingType='custom'
          onDayPress={(day) => {
            console.log('selected day', day);
            // this.setState({
            //   ...this.state,
            //   selectedDate: day.day
            // })
          }}
        //   markedDates={{
        //     [this.state.selectedDate]: { customStyles: {
        //       container: {
        //         backgroundColor: 'white',
        //         elevation: 2
        //       },
        //       text: {
        //         color: 'blue'
        //       }
        //     }}
        //     }}
          theme={{
            selectedDayBackgroundColor: 'black',
            'stylesheet.calendar.header': {
              week: {
                marginTop: 5,
                flexDirection: 'row',
                justifyContent: 'space-between',
              },
            },
          }}
        />

        <View style={{
            width: '95%',
            height: (Dimensions.get('screen').height/100) * 5,
            margin: '3%',
            borderRadius: 8,
            backgroundColor: '#F5F5F5',
            flexDirection: 'row',
            alignItems: 'center',
            // justifyContent: 'center'
          }}>
<CustomIcons
style={{
    marginLeft: '4%',
    marginRight: '4%'
}}
name="clock" color={theme.colors.primary} size={25} />
<Title 
// style={{marginBottom: 15}}
style={{
    fontFamily: 'Roboto',
    fontSize: 12,
    color: theme.colors.primary
}}
>Heure {this.label}</Title>

        </View>
          </View>

          <View
            style={{flex: 0.5, alignItems: 'center', justifyContent: 'center'}}>
            
            {/* <DatePicker
              date={startHour}
              onDateChange={(startHour) => this.setState({startHour})}
              mode="time"
              androidVariant="nativeAndroid"
            /> */}
            <View style={{
                flexDirection: 'row'
            }}>
                <View>
                    {
                        // increment icon
                    }
                    <Text style={{fontSize: 20}}>{this.state.hours}</Text>
                    {
                        // decrement icon
                    }
                </View>
                <View>
                    <Text style={{fontSize: 20}}> : </Text>
                </View>
                <View>
                {
                        // increment icon
                    }
                    <Text style={{fontSize: 20}}>{this.state.minutes}</Text>
                    {
                        // decrement icon
                    }
                </View>

            </View>

          </View>

        </View>
      </View>
    );
  }
}
