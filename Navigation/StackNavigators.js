import React, { Component } from 'react'
import firebase from '@react-native-firebase/app'
import { View, Text, Alert } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as theme from "../core/theme";

import { createAppContainer, createSwitchNavigator, NavigationEvents } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

//Auth screens
import { HomeScreen, LoginScreen, ForgotPasswordScreen, AuthLoadingScreen, Dashboard } from "../screens/Authentication";

//1. ADMIN SCREENS
//Users & Teams Management
import UsersManagement from '../screens/Users/UsersManagement'
import CreateUser from '../screens/Users/CreateUser';
import CreateTeam from '../screens/Users/CreateTeam';
import AddMembers from '../screens/Users/AddMembers';
import ViewTeam from '../screens/Users/ViewTeam';

//Clients management
import ClientsManagement from '../screens/Clients/ClientsManagement';
import ListClients from '../screens/Clients/ListClients';
import CreateClient from '../screens/Clients/CreateClient';

//Requests Management
import RequestsManagement from '../screens/Requests/RequestsManagement';
import CreateProjectReq from '../screens/Requests/CreateProject';
import CreateTicketReq from '../screens/Requests/CreateTicket';

//Inbox
import Inbox from '../screens/Inbox/Inbox'
import ListMessages from '../screens/Inbox/ListMessages';
import ViewMessage from '../screens/Inbox/ViewMessage';
import NewMessage from '../screens/Inbox/NewMessage';
import ListNotifications from '../screens/Inbox/ListNotifications';

//Agenda
import Agenda from '../screens/Agenda/Agenda'
import CreateTask from '../screens/Agenda/CreateTask'
import ListEmployees from '../screens/Agenda/ListEmployees'
import DatePicker from '../screens/DatePicker/DatePicker'

//Projects
import ListProjects from '../screens/Projects/ListProjects'
import CreateProject from '../screens/Projects/CreateProject'

//Documents
import ListDocuments from '../screens/Documents/ListDocuments'
import UploadDocument from '../screens/Documents/UploadDocument'
import Signature from '../screens/Documents/Signature'
import PdfGeneration from '../screens/Documents/PdfGeneration'

//Orders
import ListOrders from '../screens/Orders/ListOrders'
import AddItem from '../screens/Orders/AddItem'
import CreateProduct from '../screens/Orders/CreateProduct'
import CreateOrder from '../screens/Orders/CreateOrder'

//News
import ListNews from '../screens/News/ListNews'
import ViewNews from '../screens/News/ViewNews'

//Others
import Chat from '../screens/Requests/Chat'
import Profile from '../screens/Profile/Profile'
import EditEmail from '../screens/Profile/EditEmail'
import EditRole from '../screens/Profile/EditRole'
import Address from '../screens/Profile/Address'
import VideoPlayer from '../screens/Helpers/VideoPlayer'

import { constants } from '../core/constants'
import { Menu, MenuOptions, MenuOption, MenuTrigger, } from 'react-native-popup-menu'

//Icons: No Icon
const hideHeader = () => ({
    headerShown: false
})

//2. All modules STACKS
const ProfileStack = createStackNavigator({
    Profile: {
        screen: Profile,
        path: 'profile',
        navigationOptions: hideHeader
        // navigationOptions: navOptionsBackCheck
    },
    CreateProject: {
        screen: CreateProject,
        path: 'project/:ProjectId',
        navigationOptions: hideHeader
    },
    EditEmail: {
        screen: EditEmail,
        navigationOptions: hideHeader
        // navigationOptions: navOptionsBackCheck
    },
    EditRole: {
        screen: EditRole,
        navigationOptions: hideHeader
        // navigationOptions: navOptionsBackCheck
    },
    Address: {
        screen: Address,
        navigationOptions: hideHeader
    },
})

const UsersManagementStack = createStackNavigator({
    UsersManagement: {
        screen: UsersManagement,
        navigationOptions: hideHeader
    },
    CreateUser: {
        screen: CreateUser,
        navigationOptions: hideHeader
    },
    CreateTeam: {
        screen: CreateTeam,
        navigationOptions: hideHeader
    },
    AddMembers: {
        screen: AddMembers,
        navigationOptions: hideHeader
    },
    ViewTeam: {
        screen: ViewTeam,
        navigationOptions: hideHeader
    },
    Profile: {
        screen: Profile,
        path: 'profile',
        navigationOptions: hideHeader
        // navigationOptions: navOptionsBackCheck
    },
})

const ClientsManagementStack = createStackNavigator({
    ClientsManagement: {
        screen: ClientsManagement,
        navigationOptions: hideHeader
    },
    CreateClient: {
        screen: CreateClient,
        navigationOptions: hideHeader
    },
    Profile: {
        screen: Profile,
        path: 'profile',
        navigationOptions: hideHeader
        // navigationOptions: navOptionsBackCheck
    },
})

const RequestsManagementStack = createStackNavigator({
    RequestsManagement: {
        screen: RequestsManagement,
        navigationOptions: hideHeader
    },
    CreateProjectReq: {
        screen: CreateProjectReq,
        navigationOptions: hideHeader
    },
    CreateTicketReq: {
        screen: CreateTicketReq,
        navigationOptions: hideHeader
    },
    ListClients: {
        screen: ListClients,
        navigationOptions: hideHeader
    },
    Chat: {
        screen: Chat,
        navigationOptions: hideHeader
        // navigationOptions: navOptionsBackCheck
    },
    VideoPlayer: {
        screen: VideoPlayer,
        navigationOptions: hideHeader
        // navigationOptions: navOptionsBackCheck
    },
})

const InboxStack = createStackNavigator({
    Inbox: {
        screen: Inbox,
        navigationOptions: hideHeader
    },
    ListMessages: {
        screen: ListMessages,
        navigationOptions: hideHeader
    },
    ViewMessage: {
        screen: ViewMessage,
        navigationOptions: hideHeader
    },
    NewMessage: {
        screen: NewMessage,
        navigationOptions: hideHeader
    },
    ListNotifications: {
        screen: ListNotifications,
        navigationOptions: hideHeader
    },
    //Screens to navigate through navigation
    CreateProject: {
        screen: CreateProject,
        path: 'project/:ProjectId',
        navigationOptions: hideHeader
    },
    CreateUser: {
        screen: CreateUser,
        navigationOptions: hideHeader
    },
    CreateTeam: {
        screen: CreateTeam,
        navigationOptions: hideHeader
    },
    CreateClient: {
        screen: CreateClient,
        navigationOptions: hideHeader
    },
    CreateProjectReq: {
        screen: CreateProjectReq,
        navigationOptions: hideHeader
    },
    CreateTicketReq: {
        screen: CreateTicketReq,
        navigationOptions: hideHeader
    },
    CreateTask: {
        screen: CreateTask,
        navigationOptions: hideHeader
    },
    CreateOrder: {
        screen: CreateOrder,
        navigationOptions: hideHeader
    },
})

const AgendaStack = createStackNavigator({
    Agenda: {
        screen: Agenda,
        navigationOptions: hideHeader
    },
    CreateTask: {
        screen: CreateTask,
        navigationOptions: hideHeader
    },
    ListEmployees: {
        screen: ListEmployees,
        navigationOptions: hideHeader
    },
    ListProjects: {
        screen: ListProjects,
        navigationOptions: hideHeader
    },
    DatePicker: {
        screen: DatePicker,
        navigationOptions: hideHeader
    },
})

const ProjectsStack = createStackNavigator({
    ListProjects: {
        screen: ListProjects,
        navigationOptions: hideHeader
    },
    CreateProject: {
        screen: CreateProject,
        path: 'project/:ProjectId',
        navigationOptions: hideHeader
    },
    ListClients: {
        screen: ListClients,
        navigationOptions: hideHeader
    },
    CreateUser: {
        screen: CreateUser,
        navigationOptions: hideHeader
    },
    UploadDocument: { //access documents
        screen: UploadDocument,
        navigationOptions: hideHeader
    },
    Signature: {
        screen: Signature,
        navigationOptions: hideHeader
    },
    PdfGeneration: {
        screen: PdfGeneration,
        navigationOptions: hideHeader
    },
    ListProjects: {
        screen: ListProjects,
        navigationOptions: hideHeader
    },
    ListOrders: {
        screen: ListOrders,
        navigationOptions: hideHeader
    },
    CreateOrder: {
        screen: CreateOrder,
        navigationOptions: hideHeader
    },
    AddItem: {
        screen: AddItem,
        navigationOptions: hideHeader
    },
    PdfGeneration: {
        screen: PdfGeneration,
        navigationOptions: hideHeader
    },
    CreateTask: { //access tasks
        screen: CreateTask,
        navigationOptions: hideHeader
    },
    ListEmployees: {
        screen: ListEmployees,
        navigationOptions: hideHeader
    },
    DatePicker: {
        screen: DatePicker,
        navigationOptions: hideHeader
    },
    Profile: {
        screen: Profile,
        path: 'profile',
        navigationOptions: hideHeader
        // navigationOptions: navOptionsBackCheck
    },
})

const DocumentsStack = createStackNavigator({
    ListDocuments: {
        screen: ListDocuments,
        navigationOptions: hideHeader
    },
    UploadDocument: {
        screen: UploadDocument,
        navigationOptions: hideHeader
    },
    Signature: {
        screen: Signature,
        navigationOptions: hideHeader
    },
    PdfGeneration: {
        screen: PdfGeneration,
        navigationOptions: hideHeader
    },
    ListProjects: {
        screen: ListProjects,
        navigationOptions: hideHeader
    },
    ListOrders: {
        screen: ListOrders,
        navigationOptions: hideHeader
    },
    CreateOrder: {
        screen: CreateOrder,
        navigationOptions: hideHeader
    },
    AddItem: {
        screen: AddItem,
        navigationOptions: hideHeader
    },
    PdfGeneration: {
        screen: PdfGeneration,
        navigationOptions: hideHeader
    },
})

const OrdersStack = createStackNavigator({
    ListOrders: {
        screen: ListOrders,
        navigationOptions: hideHeader
    },
    AddItem: {
        screen: AddItem,
        navigationOptions: hideHeader
    },
    CreateProduct: {
        screen: CreateProduct,
        navigationOptions: hideHeader
    },
    CreateOrder: {
        screen: CreateOrder,
        navigationOptions: hideHeader
    },
    ListProjects: {
        screen: ListProjects,
        navigationOptions: hideHeader
    },
    ListClients: {
        screen: ListClients,
        navigationOptions: hideHeader
    },
})

const NewsStack = createStackNavigator({
    ListNews: {
        screen: ListNews,
        navigationOptions: hideHeader
    },
    ViewNews: {
        screen: ViewNews,
        navigationOptions: hideHeader
    },
})

//3. USER MAIN STACKS (APP & AUTH)
//Authentification navigation
export const AuthStack = createStackNavigator({
    LoginScreen: {
        screen: LoginScreen,
        navigationOptions: hideHeader
    },
    ForgotPasswordScreen: {
        screen: ForgotPasswordScreen,
        navigationOptions: hideHeader
    },
    AuthLoadingScreen: {
        screen: AuthLoadingScreen,
        navigationOptions: hideHeader
    },
},
    {
        initialRouteName: 'AuthLoadingScreen',
    })

//App modules
export const AppStack = createSwitchNavigator({
    // Dashboard: {
    //     screen: Dashboard,
    //     navigationOptions: hideHeader
    // },
    ProjectsStack: {
        screen: ProjectsStack,
        path: 'projects',
        navigationOptions: hideHeader
    },
    ProfileStack: {
        screen: ProfileStack,
        path: 'profile',
        navigationOptions: hideHeader
    },
    UsersManagementStack: {
        screen: UsersManagementStack,
        navigationOptions: hideHeader
    },
    ClientsManagementStack: {
        screen: ClientsManagementStack,
        navigationOptions: hideHeader
    },
    RequestsManagementStack: {
        screen: RequestsManagementStack,
        navigationOptions: hideHeader
    },
    InboxStack: {
        screen: InboxStack,
        navigationOptions: hideHeader
    },
    AgendaStack: {
        screen: AgendaStack,
        navigationOptions: hideHeader
    },
    DocumentsStack: {
        screen: DocumentsStack,
        navigationOptions: hideHeader
    },
    OrdersStack: {
        screen: OrdersStack,
        navigationOptions: hideHeader
    },
    NewsStack: {
        screen: NewsStack,
        navigationOptions: hideHeader
    },
})