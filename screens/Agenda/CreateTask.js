import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import CustomIcon from '../../components/CutomIcon'
import {Card, Title, FAB} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firebase from 'react-native-firebase';
import MyFAB from '../../components/MyFAB';
import moment from 'moment';
import 'moment/locale/fr';
moment.locale('fr');
import SvgUri from 'react-native-svg-uri';
import SearchBar from '../../components/SearchBar';
import Appbar from '../../components/Appbar';
import MyInput from '../../components/TextInput';
import Picker from '../../components/Picker';
import Loading from '../../components/Loading';

//Task state
import TaskState from '../../components/RequestState';

import * as theme from '../../core/theme';
import {constants} from '../../core/constants';
import {
  generatetId,
  load,
  myAlert,
  updateField,
  nameValidator,
} from '../../core/utils';

import {fetchDocs} from '../../api/firestore-api';

import {connect} from 'react-redux';

const db = firebase.firestore();

const types = [
  {label: 'Normale', value: 'Normale'},
  {label: 'Rendez-vous', value: 'Rendez-vous'},
  {label: 'Visite technique', value: 'Visite technique'},
  {label: 'Installation', value: 'Installation'},
  {label: 'Rattrapage', value: 'Rattrapage'},
  {label: 'Panne', value: 'Panne'},
  {label: 'Entretien', value: 'Entretien'},
];

const priorities = [
  {label: 'Urgente', value: 'Urgente'},
  {label: 'Moyenne', value: 'Moyenne'},
  {label: 'Faible', value: 'Faible'},
];

const statuses = [
  {label: 'En attente', value: 'En attente'},
  {label: 'En cours', value: 'En cours'},
  {label: 'Terminé', value: 'Terminé'},
  {label: 'Annulé', value: 'Annulé'},
];

class CreateTask extends Component {
  constructor(props) {
    super(props);
    this.refreshDate = this.refreshDate.bind(this);
    this.refreshAddress = this.refreshAddress.bind(this);
    this.refreshAssignedTo = this.refreshAssignedTo.bind(this);
    this.refreshProject = this.refreshProject.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.myAlert = myAlert.bind(this);
    this.alertDeleteTask = this.alertDeleteTask.bind(this);

    this.initialState = {};
    this.isInit = true;
    this.currentUser = firebase.auth().currentUser;

    this.DateId = this.props.navigation.getParam('DateId', '');
    this.TaskId = this.props.navigation.getParam('TaskId', '');
    this.isEdit = this.props.navigation.getParam('isEdit', false);
    this.title = this.props.navigation.getParam('title', 'Créer une tâche');

    this.state = {
      //AUTO-GENERATED
      TaskId: '', //Not editable

      //TEXTINPUTS
      name: {value: 'Task 1', error: ''},
      description: {value: '', error: ''},

      //PICKERS
      type: 'Rendez-vous',
      priority: 'Moyenne',
      status: 'En cours',
      showInput: false,
      searchInput: '',

      //Screens
      assignedTo: {id: 'GS-US-xQ6s', fullName: 'Salim Salim', error: ''},
      project: {id: 'GS-PR-m5Ip', name: 'Projet A', error: ''},
      address: {
        description: '40 Quai Vallière, 11100 Narbonne, France',
        place_id: 'qehsfgnhousfgnf',
        error: '',
      },
      startDate: moment().format(),
      dueDate: moment().add(1, 'h').format(),

      createdAt: '',
      createdBy: {userId: '', userName: ''},
      editedAt: '',
      editedBy: {userId: '', userName: ''},

      error: '',
      loading: false,
    };
  }

  async componentDidMount() {
    if (this.isEdit) {
      await this.fetchTask();
    } else {
      const TaskId = generatetId('GS-TC-');
      this.setState({TaskId}, () => (this.initialState = this.state));
    }
  }

  componentWillUnmount() {
    if (this.isEdit) this.unsubscribe();
  }

  fetchTask() {
    this.unsubscribe = db
      .collection('Agenda')
      .doc(this.DateId)
      .collection('Tasks')
      .doc(this.TaskId)
      .onSnapshot((doc) => {
        let {
          TaskId,
          name,
          assignedTo,
          description,
          project,
          type,
          priority,
          status,
          address,
          startDate,
          dueDate,
        } = this.state;
        let {createdAt, createdBy, editedAt, editedBy} = this.state;
        const task = doc.data();

        if (!task) return;

        // //General info
        TaskId = this.TaskId;
        name.value = task.name;
        assignedTo = task.assignedTo;
        description.value = task.description;
        project = task.project;
        priority = task.priority;
        status = task.status;
        type = task.type;
        address = task.address;
        startDate = task.startDate;
        dueDate = task.dueDate;

        //َActivity
        createdAt = task.createdAt;
        createdBy = task.createdBy;
        editedAt = task.editedAt;
        editedBy = task.editedBy;

        this.setState({createdAt, createdBy, editedAt, editedBy});
        this.setState(
          {
            TaskId,
            name,
            assignedTo,
            description,
            project,
            type,
            priority,
            status,
            address,
            startDate,
            dueDate,
          },
          () => {
            if (this.isInit) this.initialState = this.state;

            this.isInit = false;
          },
        );
      });
  }

  //Screen inputs
  refreshAddress(address) {
    address.error = '';
    this.setState({address});
  }

  refreshAssignedTo(isPro, id, prenom, nom, role) {
    const assignedTo = {id, fullName: `${prenom} ${nom}`, role, error: ''};
    this.setState({assignedTo});
  }

  refreshDate(label, date) {
    const formatedDate = moment(date).format();

    if (label === 'start') this.setState({startDate: formatedDate});
    else if (label === 'due') this.setState({dueDate: formatedDate});
  }

  refreshProject(project) {
    console.log(project);
    project.error = '';
    this.setState({project});
  }

  //Inputs validation
  validateInputs() {
    let {name, assignedTo, project, address, startDate, dueDate} = this.state;

    let nameError = nameValidator(name.value, '"Nom de la tâche"');
    let assignedToError = nameValidator(assignedTo.id, '"Attribué à"');
    let projectError = nameValidator(project.id, '"Projet"');
    let addressError = nameValidator(address.description, '"Adresse postale"');
    //#inputVerify dueDate > startDate

    if (nameError || assignedToError || projectError || addressError) {
      name.error = nameError;
      assignedTo.error = assignedToError;
      project.error = projectError;
      address.error = addressError;

      Keyboard.dismiss();
      this.setState({
        name,
        assignedTo,
        project,
        address,
        startDate,
        dueDate,
        loading: false,
      });
      return false;
    }

    return true;
  }

  //Submit
  async handleSubmit() {
    console.log('handle submit called');
    let {error, loading} = this.state;
    let {
      TaskId,
      name,
      assignedTo,
      description,
      project,
      type,
      priority,
      status,
      address,
      startDate,
      dueDate,
    } = this.state;

    if (loading || this.state === this.initialState) return;

    //1. Validate inputs
    const isValid = this.validateInputs();
    if (!isValid) return;

    load(this, true);

    // 2. ADDING task DOCUMENT
    let task = {
      name: name.value,
      assignedTo: {id: assignedTo.id, fullName: assignedTo.fullName},
      description: description.value,
      project: {id: project.id, name: project.name},
      type: type,
      priority: priority,
      status: status,
      address: {description: address.description, place_id: address.place_id},
      startDate: startDate,
      dueDate: dueDate,
      editedAt: moment().format('lll'),
      editedBy: {
        userId: this.currentUser.uid,
        userName: this.currentUser.displayName,
      },
    };

    if (!this.isEdit) {
      task.createdAt = moment().format('lll');
      task.createdBy = {
        userId: this.currentUser.uid,
        userName: this.currentUser.displayName,
      };
    }

    console.log('Ready to add task...');
    const agendaId = moment(startDate).format('YYYY-MM-DD');
    const agendaRef = db.collection('Agenda').doc(agendaId);

    try {
      await agendaRef.set({date: agendaId}, {merge: true});
      await agendaRef.collection('Tasks').doc(TaskId).set(task, {merge: true});
      if (this.isEdit) this.props.navigation.state.params.onGoBack(false); //Don't refresh tasks in agenda
      this.props.navigation.goBack();
    } catch (error) {
      this.setState({error});
    }

    load(this, false);
  }

  alertDeleteTask() {
    const title = 'Supprimer la tâche';
    const message = 'Êtes-vous sûr de vouloir supprimer cette tâche ?';
    const handleConfirm = () => this.handleDelete();
    this.myAlert(title, message, handleConfirm);
  }

  async handleDelete() {
    this.title = 'Suppression de la tâche...';
    load(this, true);
    await db
      .collection('Agenda')
      .doc(this.DateId)
      .collection('Tasks')
      .doc(this.TaskId)
      .delete();
    load(this, false);
    this.props.navigation.state.params.onGoBack(true); //Refresh manually tasks in agenda because onSnapshot doesn't listen to delete operations.
    this.props.navigation.goBack();
  }

  render() {
    let {
      TaskId,
      name,
      description,
      assignedTo,
      project,
      startDate,
      startHour,
      dueDate,
      dueHour,
      type,
      priority,
      status,
      address,
    } = this.state;
    let {createdAt, createdBy, editedAt, editedBy, loading} = this.state;
    let {showInput, searchInput} = this.state;
    return (
      <View style={styles.container}>
        {/* <Appbar back={!loading} close title titleText={this.title} check handleSubmit={this.handleSubmit} del={this.isEdit && !loading} handleDelete={this.alertDeleteTask} /> */}
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
        {loading ? (
          <Loading size="large" />
        ) : (
          <ScrollView
            style={styles.container}
            contentContainerStyle={{
              backgroundColor: '#fff',
              padding: constants.ScreenWidth * 0.02,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                height: '7%',
                paddingLeft: '3%',
                paddingRight: '3%',
                backgroundColor: '#EBEBEB',
              }}>
              <Text style={{color: '#1B2331', fontWeight: '500', fontSize: 18}}>
                Informations Générales
              </Text>
              {/* <SvgUri source={require('../../assets/information.svg')} /> */}
              <CustomIcon name="information" size={27} color="#1B2331" />
            </View>
            <Card style={{marginBottom: 20}}>
              <Card.Content>
                <MyInput
                  label="Numéro de la tâche"
                  returnKeyType="done"
                  value={TaskId}
                  editable={false}
                  style={{marginBottom: 15}}
                  disabled
                />

                <TouchableOpacity style={styles.listButton}>
                  <SvgUri source={require('../../assets/numero21.svg')} />
                  <MyInput
                    label="Nom de la tâche"
                    returnKeyType="done"
                    value={name.value}
                    onChangeText={(text) => updateField(this, name, text)}
                    error={!!name.error}
                    errorText={name.error}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('ListEmployees', {
                      onGoBack: this.refreshAssignedTo,
                      prevScreen: 'CreateTask',
                      titleText: 'Utilisateurs',
                    })
                  }>
                  <MyInput
                    label="Attribuée à"
                    value={assignedTo.fullName}
                    error={!!assignedTo.error}
                    errorText={assignedTo.error}
                    editable={false}
                  />
                </TouchableOpacity>

                <MyInput
                  label="Description"
                  returnKeyType="done"
                  value={description.value}
                  onChangeText={(text) => updateField(this, description, text)}
                  error={!!description.error}
                  errorText={description.error}
                />

                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('ListProjects', {
                      onGoBack: this.refreshProject,
                      prevScreen: 'CreateTask',
                      isRoot: false,
                      title: 'Choix du projet',
                      showFAB: false,
                    })
                  }>
                  <MyInput
                    label="Choisir un projet"
                    value={project.name}
                    error={!!project.error}
                    errorText={project.error}
                    editable={false}
                  />
                </TouchableOpacity>

                <Picker
                  label="Type"
                  returnKeyType="next"
                  value={type}
                  error={!!type.error}
                  errorText={type.error}
                  selectedValue={type}
                  onValueChange={(type) => this.setState({type})}
                  title="Type"
                  elements={types}
                />

                <Picker
                  label="État"
                  returnKeyType="next"
                  value={status}
                  error={!!status.error}
                  errorText={status.error}
                  selectedValue={status}
                  onValueChange={(status) => this.setState({status})}
                  title="État"
                  elements={statuses}
                />

                <Picker
                  label="Priorité"
                  returnKeyType="next"
                  value={priority}
                  error={!!priority.error}
                  errorText={priority.error}
                  selectedValue={priority}
                  onValueChange={(priority) => this.setState({priority})}
                  title="Priorité"
                  elements={priorities}
                />

                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('Address', {
                      onGoBack: this.refreshAddress,
                    })
                  }>
                  <MyInput
                    label="Adresse postale"
                    value={address.description}
                    editable={false}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('DatePicker', {
                      onGoBack: this.refreshDate,
                      label: 'de début',
                    })
                  }>
                  <MyInput
                    label="Date de début"
                    value={moment(startDate).format('lll')}
                    editable={false}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('DatePicker', {
                      onGoBack: this.refreshDate,
                      label: "d'échéance",
                    })
                  }>
                  <MyInput
                    label="Date d'échéance"
                    value={moment(dueDate).format('lll')}
                    editable={false}
                  />
                </TouchableOpacity>
              </Card.Content>
            </Card>

            {this.isEdit && (
              <Card>
                <Card.Content>
                  <Title>Activité</Title>
                  <MyInput
                    label="Date de création"
                    returnKeyType="done"
                    value={createdAt}
                    editable={false}
                  />
                  <MyInput
                    label="Auteur"
                    returnKeyType="done"
                    value={createdBy.userName}
                    editable={false}
                  />
                  <MyInput
                    label="Dernière mise à jour"
                    returnKeyType="done"
                    value={editedAt}
                    editable={false}
                  />
                  <MyInput
                    label="Dernier intervenant"
                    returnKeyType="done"
                    value={editedBy.userName}
                    editable={false}
                  />
                </Card.Content>
              </Card>
            )}
            <MyFAB onPress={() => this.handleSubmit()} />
          </ScrollView>
        )}
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    role: state.roles.role,
    //fcmToken: state.fcmtoken
  };
};

export default connect(mapStateToProps)(CreateTask);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  fab: {
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginBottom: 10,
    width: 50,
    height: 50,
    borderRadius: 100,
  },
  listButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
