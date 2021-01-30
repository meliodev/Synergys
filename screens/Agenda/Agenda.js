import React, {Component} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Dimensions,
} from 'react-native';
import {Agenda, Calendar, LocaleConfig} from 'react-native-calendars';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import _ from 'lodash';
import firebase from 'react-native-firebase';
import TabView from '../../components/TabView';

import moment from 'moment';
import 'moment/locale/fr';
moment.locale('fr');

import PickerBar from '../../components/PickerBar';
import Appbar from '../../components/Appbar';
import TasksTab from '../../components/TasksTab';
import Filter from '../../components/Filter';
import MyFAB from '../../components/MyFAB';
import EmptyList from '../../components/EmptyList';

import {
  load,
  myAlert,
  toggleFilter,
  setFilter,
  handleFilterAgenda as applyFilterAgenda,
  handleFilterTasks as applyFilterTasks,
} from '../../core/utils';
import * as theme from '../../core/theme';
import {constants} from '../../core/constants';
// const testIDs = require('../testIDs');
import {withNavigation} from 'react-navigation';
import {connect} from 'react-redux';
import SearchBar from '../../components/SearchBar';
import CustomIcons from '../../components/CustomIcons';

LocaleConfig.locales['fr'] = {
  monthNames: [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
  ],
  monthNamesShort: [
    'Janv.',
    'Févr.',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juil.',
    'Août',
    'Sept.',
    'Oct.',
    'Nov.',
    'Déc.',
  ],
  dayNames: [
    'Dimanche',
    'Lundi',
    'Mardi',
    'Mercredi',
    'Jeudi',
    'Vendredi',
    'Samedi',
  ],
  dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
  today: "Aujourd'hui",
};
LocaleConfig.defaultLocale = 'fr';

const db = firebase.firestore();
const KEYS_TO_FILTERS = [
  'type',
  'status',
  'priority',
  'project.id',
  'assignedTo.id',
];

const types = [
  {label: 'Tous', value: ''},
  {label: 'Normale', value: 'Normale'},
  {label: 'Rendez-vous', value: 'Rendez-vous'},
  {label: 'Visite technique', value: 'Visite technique'},
  {label: 'Installation', value: 'Installation'},
  {label: 'Rattrapage', value: 'Rattrapage'},
  {label: 'Panne', value: 'Panne'},
  {label: 'Entretien', value: 'Entretien'},
];

const priorities = [
  {label: 'Toutes', value: ''},
  {label: 'Urgente', value: 'urgente'},
  {label: 'Moyenne', value: 'moyenne'},
  {label: 'Faible', value: 'faible'},
];

const statuses = [
  {label: 'Tous', value: ''},
  {label: 'En attente', value: 'En attente'},
  {label: 'En cours', value: 'En cours'},
  {label: 'Terminé', value: 'Terminé'},
  {label: 'Annulé', value: 'Annulé'},
];

class Agenda2 extends Component {
  constructor(props) {
    super(props);
    this.isAgenda = this.props.navigation.getParam('isAgenda', true); //#task: set it to true
    this.loadItems = this.loadItems.bind(this);
    this.refreshItems = this.refreshItems.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.toggleTasksTab = this.toggleTasksTab.bind(this);
    this.projectFilter = this.props.navigation.getParam('projectFilter', {
      id: '',
      name: '',
    });

    this.state = {
      //Settings
      isAgenda: this.isAgenda,
      isCalendar: false,
      selectedDate : '',

      showInput: false,
      searchInput: '',
      index: 0,
      //Calendar mode
      items: {},
      filteredItems: {},

      //List mode
      taskItems: [],
      filteredTaskItems: [],

      //filter fields
      type: '',
      status: '',
      priority: '',
      assignedTo: {id: '', fullName: ''},
      project: this.projectFilter,
      filterOpened: false,
    };
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  refreshItems(refresh) {
    if (refresh) {
      this.setState({items: {}, filteredItems: {}});
      this.loadItems();
    }
  }

  setTasksQuery(agendaRef) {
    console.log(' role is ', this.props.role.id);
    const roleId = this.props.role.id;
    const {isAgenda} = this.state;
    const {currentUser} = firebase.auth();
    let query = null;

    if (isAgenda) {
      query = agendaRef
        .collection('Tasks')
        .where('assignedTo.id', '==', currentUser.id);
      return query;
    }

    if (roleId === 'admin') {
      console.log(' b ');
      query = agendaRef.collection('Tasks');
    } else if (roleId === 'dircom') {
      console.log(' c ');
      query = agendaRef
        .collection('Tasks')
        .where('assignedTo.role', '==', 'Directeur commercial');
    } else if (roleId === 'tech') {
      console.log(' d ');
      query = agendaRef
        .collection('Tasks')
        .where('assignedTo.role', '==', 'Responsable technique');
    }
    return query;
  }

  componentDidMount() {
    this.loadItems();
  }

  loadItems(day) {
    setTimeout(async () => {
      this.unsubscribe = db.collection('Agenda').onSnapshot((querysnapshot) => {
        querysnapshot.forEach(async (dateDoc) => {
          const date = dateDoc.id; //exp: 2021-01-07
          const query = this.setTasksQuery(dateDoc.ref);
          db.collection('Agenda')
            .doc(date)
            .collection('Tasks')
            .onSnapshot((tasksSnapshot) => {
              //#todo: unsubscribe all listeners
              this.state.items[date] = [];

              tasksSnapshot.forEach((taskDoc) => {
                const task = taskDoc.data();
                const dueDate = moment(task.dueDate).format('YYYY-MM-DD');
                const startDate = moment(task.startDate).format('YYYY-MM-DD');
                const isPeriod = moment(startDate).isBefore(dueDate, 'day');
                const duration = moment(dueDate).diff(startDate, 'day') + 1;
                let timeLine = 1;
                let dayProgress = `${timeLine}/${duration}`;

                this.state.items[date].push({
                  id: taskDoc.id,
                  date: date,
                  name: task.name,
                  type: task.type,
                  status: task.status,
                  priority: task.priority.toLowerCase(),
                  project: task.project,
                  assignedTo: task.assignedTo,
                  dayProgress: dayProgress,
                });
                //Tasks lasting for 2days or more...
                if (isPeriod) {
                  timeLine = 2;
                  var dateIterator = moment(startDate)
                    .add(1, 'day')
                    .format('YYYY-MM-DD');
                  let predicate =
                    moment(dateIterator).isBefore(dueDate, 'day') ||
                    moment(dateIterator).isSame(dueDate, 'day');

                  while (predicate) {
                    dayProgress = `${timeLine}/${duration}`;
                    this.state.items[dateIterator] = [];
                    this.state.items[dateIterator].push({
                      id: taskDoc.id,
                      date: dateIterator,
                      name: task.name,
                      type: task.type,
                      status: task.status,
                      priority: task.priority.toLowerCase(),
                      project: task.project,
                      assignedTo: task.assignedTo,
                      dayProgress: dayProgress,
                      // labels: [task.priority.toLowerCase()],
                    });
                    timeLine += 1;
                    dateIterator = moment(dateIterator)
                      .add(1, 'day')
                      .format('YYYY-MM-DD');
                    predicate =
                      moment(dateIterator).isBefore(dueDate, 'day') ||
                      moment(dateIterator).isSame(dueDate, 'day');
                  }
                }
                const newItems = {};
                Object.keys(this.state.items).forEach((key) => {
                  newItems[key] = this.state.items[key];
                });
                this.setState({items: newItems}, () => {
                  const taskItems = this.setTaskItems();
                  this.setState({taskItems}, () => this.handleFilter(false));
                });
              });
            });
        });
      });
    }, 1000);
  }

  renderTaskStatusController(date, taskId, status) {
    switch (status) {
      case 'En cours':
        return (
          <MaterialCommunityIcons
            name="check-circle-outline"
            size={30}
            color="#BDBDBD"
            onPress={() =>
              db
                .collection('Agenda')
                .doc(date)
                .collection('Tasks')
                .doc(taskId)
                .update({status: 'Terminé'})
            }
          />
        );

      case 'Terminé':
        return (
          <MaterialCommunityIcons
            name="check-circle"
            size={30}
            color={theme.colors.primary}
            onPress={() =>
              db
                .collection('Agenda')
                .doc(date)
                .collection('Tasks')
                .doc(taskId)
                .update({status: 'En cours'})
            }
          />
        );

      case 'Annulé':
        return (
          <MaterialCommunityIcons
            name="close-circle-outline"
            size={30}
            color={theme.colors.error}
          />
        );

      case 'En attente':
        return (
          <MaterialCommunityIcons
            name="dots-horizontal-circle-outline"
            size={30}
            color={theme.colors.placeholder}
          />
        );

      default:
        return null;
    }
  }

  renderItem(item) {
   
    // console.log('item list ', this.state.items);
    // console.log('this.state.filteredItems', this.state.filteredItems);

    const priority = item.priority;
    const dt = moment(item.date, "YYYY-MM-DD HH:mm:ss")
    
    const dayName = dt.format('dddd').substring(0,3)
    const uppercaseDayName = dayName.charAt(0).toUpperCase() + dayName.slice(1)

    console.log("day name ", uppercaseDayName)
    const label = (
      <View
        style={{
          padding: 5,
          marginBottom: '4%',
          width: (Dimensions.get('screen').width/100) * 15,
          marginRight: '10%',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor:
          priority === 'urgente'
          ? '#F5276D'
          : priority === 'faible'
          ? '#f2d004' 
          : priority === 'moyenne'
          ? '#555CC4'
          : theme.colors.agenda,
          borderRadius: 3,
        }}>
        <Text style={{color: 'white', fontSize: 11}}>{priority}</Text>
      </View>
    );

    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('CreateTask', {
            onGoBack: this.refreshItems,
            isEdit: true,
            title: 'Modifier la tâche',
            DateId: item.date,
            TaskId: item.id,
          })
        }
        style={[styles.item, {backgroundColor: priority === 'urgente'
        ? '#FFEFF4'
        : priority === 'faible'
        ? '#f2d004'
        : theme.colors.agenda,}]}>
          <View style={{
            width: '25%',
            height: '86%',
            backgroundColor: '#FFFFFF',
            borderBottomRightRadius: 10,
            borderBottomLeftRadius:10,
           
          }}>
            <Text style={{
              fontSize: 37,
              fontFamily: 'Roboto',
              alignSelf: 'center',
              marginTop: '2%',
              color: priority === 'urgente'
              ? '#F5276D'
              : priority === 'faible'
              ? '#f2d004' 
              : priority === 'moyenne'
              ? '#555CC4'
              : theme.colors.agenda,
            }}>
              {item.date.substring(8)}
            </Text>
            <Text
            style={{
              fontSize: 12,
              fontFamily: 'Roboto',
              alignSelf: 'center',
              // marginTop: '1%',
              color : '#8D8D8D'
            }}>
              {uppercaseDayName}
            </Text>

          </View>
        <View
          style={{
            flex: 0.8,
            marginLeft: '6%',
            marginTop: '3%',
            // justifyContent: 'space-around',
            height: constants.ScreenHeight * 0.1,
            // marginVertical: 10,
          }}>
          <Text
            numberOfLines={1}
            style={{
              color:
              priority === 'urgente'
              ? '#F5276D'
              : priority === 'faible'
              ? '#f2d004' 
              : priority === 'moyenne'
              ? '#555CC4'
              : theme.colors.agenda,
              fontSize: 20,
            }}>
            {item.name}
          </Text>
          <Text
            style={[
              theme.customFontMSsemibold.caption,
              {color: '#1B2331', marginTop: 5},
            ]}>
            {item.type}
            {item.dayProgress !== '1/1' && (
              <Text
                style={[
                  theme.customFontMSregular.caption,
                  {fontWeight: 'normal'},
                ]}>
                (jour {item.dayProgress})
              </Text>
            )}
          </Text>
        </View>
        <View
          style={{
            flex: 0.2,
            marginTop: '1%',
            marginRight: '5%',
            alignItems: 'center',
            paddingVertical: 5,
          }}>
          {label}
          {this.renderTaskStatusController(item.date, item.id, item.status)}
        </View>
      </TouchableOpacity>
    );
  }

  // Calendar data
  renderEmptyData() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#FFFFFF',
        }}>
        <ImageBackground
          source={require('../../assets/Path19.png')}
          style={{
            width: (Dimensions.get('screen').width / 100) * 31,
            position: 'absolute',
            bottom: 5,
            height: (Dimensions.get('screen').height / 100) * 23,
          }}></ImageBackground>

        <ImageBackground
          source={require('../../assets/group120.png')}
          style={{
            width: (Dimensions.get('screen').width / 100) * 27,
            position: 'absolute',
            bottom: 15,
            right: 5,
            height: (Dimensions.get('screen').height / 100) * 20,
          }}></ImageBackground>
        <EmptyList
          iconName="format-list-bulleted"
          header="Liste des tâches"
          description="Aucune tâche planifiée pour ce jour-ci."
        />
      </View>
    );
  }

  renderEmptyDate() {
    return (
      <View style={styles.emptyDate}>
        <Text
          style={[
            theme.customFontMSregular.body,
            {color: theme.colors.placeholder},
          ]}>
          Aucune tâche
        </Text>
      </View>
    );
  }

  handleFilter(toggle) {
    if (toggle) toggleFilter(this);

    const {
      isCalendar,
      items,
      taskItems,
      type,
      status,
      priority,
      assignedTo,
      project,
      filterOpened,
    } = this.state;
    const fields = [
      {label: 'type', value: type},
      {label: 'status', value: status},
      {label: 'priority', value: priority},
      {label: 'project.id', value: project.id},
      {label: 'assignedTo.id', value: assignedTo.id},
    ];

    if (isCalendar) {
      //Calendar mode
      let filteredItems = {};
      filteredItems = applyFilterAgenda(
        items,
        filteredItems,
        fields,
        KEYS_TO_FILTERS,
      );
      this.setState({filteredItems});
    } else {
      //List mode
      let filteredTaskItems = [];
      filteredTaskItems = applyFilterTasks(taskItems, fields, KEYS_TO_FILTERS);
      this.setState({filteredTaskItems});
    }
  }

  renderAppBarPicker() {
    const {isAgenda} = this.state;
    const roleId = this.props.role.id;
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={[
            theme.customFontMSmedium.title,
            {color: '#fff', marginHorizontal: 10},
          ]}>
          {isAgenda ? 'Mon agenda' : 'Planning'}
        </Text>
        <MaterialIcons name="arrow-drop-down" color="#fff" size={33} />
      </View>
    );
  }

  setCalendarType(isAgenda) {
    this.setState({isAgenda}, () => this.refreshItems(true));
  }

  //Tab functions
  setTaskItems() {
    const {items} = this.state;
    let tasksList = [];

    for (let key in items) {
      //key is "date"
      let tasks = items[key];

      if (tasks.length > 0) {
        let elements = [];
        tasks.forEach((task) => elements.push(task)); //other elements: tasks in that date
        tasksList.push(elements); // array of arrays
      }
    }

    return tasksList;
  }

  renderTaskItems() {
    console.log('renderTaskItems called');
    const {filteredTaskItems} = this.state;
    
    return filteredTaskItems.map((item, key) => {
      return (
        <View style={{padding: 15}}>
          {console.log('day ', item[0].date.substring(8))}
          <View
            style={{
              flexDirection: 'row',
            }}>
            <Text style={
              // theme.customFontMSbold.header
            {
              color: '#8D8D8D'
            }}
              >{item[0].date}</Text>
            <View
              style={{
                borderBottomColor: '#8D8D8D',
                borderBottomWidth: 1,
                width: '77%',
                height: '2%',
                alignSelf: 'flex-end',
                marginLeft: '3%',
              }}
            />
          </View>

          {item.map((taskItem) => {
            return this.renderItem(taskItem);
          })}
        </View>
      );
    });
  }

  toggleTasksTab(bool) {
    this.setState({isCalendar: bool}, () => this.handleFilter(false));
  }

  render() {
    const routes = [
      {key: 'first', title: 'Mon Agenda'},
      {key: 'second', title: 'Planning'},
    ];
    const roleId = this.props.role.id;
    let {
      isCalendar,
      displayType,
      items,
      filteredItems,
      type,
      status,
      priority,
      assignedTo,
      project,
      filterOpened,
    } = this.state; //items and filter fields
    const filterActivated = !_.isEqual(items, filteredItems);
    let {showInput, searchInput, index} = this.state;
    return (
      <ScrollView style={{flex: 1}}>
        {roleId === 'admin' || roleId === 'dircom' || roleId === 'tech' ? (
          <PickerBar
            options={[
              {id: 0, title: 'Mon agenda'},
              {id: 1, title: 'Planning'},
            ]}
            functions={[
              () => this.setCalendarType(true),
              () => this.setCalendarType(false),
            ]}
            menuTrigger={this.renderAppBarPicker()}
            main={this}
            filterOpened={filterOpened}
            type={type}
            status={status}
            priority={priority}
            project={project}
            assignedTo={assignedTo}
          />
        ) : (
          <SearchBar
            main={this}
            title={!showInput}
            titleText="Home"
            placeholder="Rechercher un document"
            showBar={showInput}
            handleSearch={() =>
              this.setState({searchInput: '', showInput: !showInput})
            }
            searchInput={searchInput}
            searchUpdated={(searchInput) => this.setState({searchInput})}
          />
        )}

        <TabView
          navigationState={{index, routes}}
          onIndexChange={(index) =>
            this.setState({index, searchInput: '', showInput: false})
          }
          Tab1={
            <this.TaskList
              searchInput={searchInput}
              items={this.state.items}
             
            />
          }
          Tab2={<this.renderEmptyData searchInput={searchInput} />}
        />

        {/* <TasksTab
          isCalendar={isCalendar}
          onPress1={() => this.toggleTasksTab(false)}
          onPress2={() => this.toggleTasksTab(true)}
        />
     */}
        {/* {filterActivated && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 5,
              backgroundColor: theme.colors.secondary,
            }}>
            <Text style={[theme.customFontMSsemibold.caption, {color: '#fff'}]}>
              Filtre activé
            </Text>
          </View>
        )} */}

        {/* <View style={{flex: 1}}>
          
          {isCalendar ? (
            <Calendar
            // disabledDaysIndexes={[0, 6]}
            onDayPress={(day) => {console.log('selected day', day)}}
            theme={{
                // arrowColor: 'white',
                selectedDayBackgroundColor: theme.colors.primary,
                'stylesheet.calendar.header': {
                  week: {
                    marginTop: 5,
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                  }
                }
              }}
            />
            <Agenda
              LocaleConfig
              renderEmptyData={this.renderEmptyData.bind(this)}
              items={this.state.filteredItems}
              loadItemsForMonth={this.loadItems}
              selected={moment().format('YYYY-MM-DD')}
              renderItem={this.renderItem.bind(this)}
              renderEmptyDate={this.renderEmptyDate.bind(this)}
              rowHasChanged={(r1, r2) => {
                return true;
              }}
              theme={{
                dotColor: theme.colors.agendaLight,
                todayTextColor: theme.colors.primary,
                selectedDayBackgroundColor: theme.colors.primary,
                agendaDayTextColor: theme.colors.agendaLight,
                agendaDayNumColor: theme.colors.agendaLight,
                agendaTodayColor: theme.colors.primary,
                backgroundColor: '#F1F1F8',
              }}
            />
          ) : (
            // (

            
            // )
            <ScrollView
              contentContainerStyle={{
                paddingBottom: constants.ScreenHeight * 0.1,
              }}>
              {this.renderTaskItems()}
            </ScrollView>
          )}
        </View> */}
        <MyFAB onPress={() => this.props.navigation.navigate('CreateTask')} />
      </ScrollView>
    );
  }

  TaskList = () => {
    return (
      <View style={{backgroundColor: '#FFFFFF', flex: 1}}>
        <ImageBackground
          source={require('../../assets/Path19.png')}
          style={{
            width: (Dimensions.get('screen').width / 100) * 31,
            position: 'absolute',
            bottom: 5,
            height: (Dimensions.get('screen').height / 100) * 23,
          }}></ImageBackground>

        <ImageBackground
          source={require('../../assets/group120.png')}
          style={{
            width: (Dimensions.get('screen').width / 100) * 27,
            position: 'absolute',
            bottom: 15,
            right: 5,
            height: (Dimensions.get('screen').height / 100) * 20,
          }}></ImageBackground>
        <Calendar
          style={{
            margin: '3%',
          }}
          markingType='custom'
          onDayPress={(day) => {
            console.log('selected day', day);
            this.setState({
              ...this.state,
              selectedDate: day.day
            })
          }}
          markedDates={{
            [this.state.selectedDate]: { customStyles: {
              container: {
                backgroundColor: 'white',
                elevation: 2
              },
              text: {
                color: 'blue'
              }
            }}
            }}
          theme={{
            // arrowColor: 'white',

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

        <View
          style={{
            width: '95%',
            height: (Dimensions.get('screen').height/100) * 5,
            margin: '3%',
            borderRadius: 8,
            backgroundColor: '#F5F5F5',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <CustomIcons name="task" size={25} color={theme.colors.primary} style={{marginLeft: '3%', marginRight: '3%'}} />
          <Text
            style={{
              color: theme.colors.primary,
              fontFamily: 'Roboto',
              fontSize: 15
            }}>
            Task's
          </Text>
        </View>

        {/* <ScrollView
          contentContainerStyle={{
            paddingBottom: constants.ScreenHeight * 0.1,
          }}> */}
          {this.renderTaskItems()}
        {/* </ScrollView> */}
      </View>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    role: state.roles.role,
  };
};

export default connect(mapStateToProps)(Agenda2);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    borderRadius: 20,
    paddingRight: 5,
    paddingLeft: 15,
    marginRight: 10,
    marginTop: '3%',
  },
  emptyDate: {
    justifyContent: 'center',
    marginLeft: 19,
    height: 15,
    flex: 1,
    paddingTop: 30,
  },
});
