import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

//Import screens
//Auth
import { LoginScreen, ForgotPasswordScreen } from "../screens/Authentication";

//Dashboard
import Dashboard from '../screens/Dashboard/Dashboard'
import AddGoal from '../screens/Dashboard/AddGoal'

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
import DatePicker from '../screens/Helpers/DatePicker'

//Projects
import ListProjects from '../screens/Projects/ListProjects'
import CreateProject from '../screens/Projects/CreateProject'
import Progression from '../screens/src/screen/Progression'

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

//Forms
//Simulation
import CreateSimulation from '../screens/Forms/Simulations/CreateSimulation'
import ListSimulations from '../screens/Forms/Simulations/ListSimulations'
//PV réception
import CreatePvReception from '../screens/Forms/PvReception/CreatePvReception'
import ListPvReceptions from '../screens/Forms/PvReception/ListPvReceptions'
//Mandat MPR
import CreateMandatMPR from '../screens/Forms/MandatMaPrimeRenov/CreateMandatMPR'
import ListMandatsMPR from '../screens/Forms/MandatMaPrimeRenov/ListMandatsMPR'
//Mandat Synergys
import CreateMandatSynergys from '../screens/Forms/MandatSynergys/CreateMandatSynergys'
import ListMandatsSynergys from '../screens/Forms/MandatSynergys/ListMandatsSynergys'

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

const appScreens = {
    //DASHBOARD
    Dashboard: {
        screen: Dashboard,
        navigationOptions: hideHeader
    },
    AddGoal: {
        screen: AddGoal,
        navigationOptions: hideHeader
    },

    //USERS
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

    //CLIENTS
    ClientsManagement: {
        screen: ClientsManagement,
        navigationOptions: hideHeader
    },
    ListClients: {
        screen: ListClients,
        navigationOptions: hideHeader
    },
    CreateClient: {
        screen: CreateClient,
        navigationOptions: hideHeader
    },

    //REQUESTS
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

    //INBOX
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

    //AGENDA
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
    DatePicker: {
        screen: DatePicker,
        navigationOptions: hideHeader
    },

    //PROJECTS
    ListProjects: {
        screen: ListProjects,
        path: 'projects',
        navigationOptions: hideHeader
    },
    CreateProject: {
        screen: CreateProject,
        path: 'project/:ProjectId',
        navigationOptions: hideHeader
    },
    Progression: {
        screen: Progression,
        navigationOptions: hideHeader
    },

    //DOCUMENTS
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

    //ORDERS
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

    //FORMS
    CreateSimulation: {
        screen: CreateSimulation,
        navigationOptions: hideHeader
    },
    ListSimulations: {
        screen: ListSimulations,
        navigationOptions: hideHeader
    },
    CreatePvReception: {
        screen: CreatePvReception,
        navigationOptions: hideHeader
    },
    ListPvReceptions: {
        screen: ListPvReceptions,
        navigationOptions: hideHeader
    },
    CreateMandatMPR: {
        screen: CreateMandatMPR,
        navigationOptions: hideHeader
    },
    ListMandatsMPR: {
        screen: ListMandatsMPR,
        navigationOptions: hideHeader
    },
    CreateMandatSynergys: {
        screen: CreateMandatSynergys,
        navigationOptions: hideHeader
    },
    ListMandatsSynergys: {
        screen: ListMandatsSynergys,
        navigationOptions: hideHeader
    },

    //NEWS
    ListNews: {
        screen: ListNews,
        navigationOptions: hideHeader
    },
    ViewNews: {
        screen: ViewNews,
        navigationOptions: hideHeader
    },

    //OTHERS
    Chat: {
        screen: Chat,
        navigationOptions: hideHeader
    },
    Profile: {
        screen: Profile,
        path: 'profile',
        navigationOptions: hideHeader
    },
    EditEmail: {
        screen: EditEmail,
        navigationOptions: hideHeader
    },
    EditRole: {
        screen: EditRole,
        navigationOptions: hideHeader
    },
    Address: {
        screen: Address,
        navigationOptions: hideHeader
    },
    VideoPlayer: {
        screen: VideoPlayer,
        navigationOptions: hideHeader
    },
}

const authScreens = {
    LoginScreen: {
        screen: LoginScreen,
        navigationOptions: hideHeader
    },
    ForgotPasswordScreen: {
        screen: ForgotPasswordScreen,
        navigationOptions: hideHeader
    },
}

const DashboardStack = createStackNavigator(appScreens, { initialRouteName: "Dashboard" })
const ProfileStack = createStackNavigator(appScreens, { initialRouteName: "Profile" })
const UsersManagementStack = createStackNavigator(appScreens, { initialRouteName: "UsersManagement" })
const ClientsManagementStack = createStackNavigator(appScreens, { initialRouteName: "ClientsManagement" })
const RequestsManagementStack = createStackNavigator(appScreens, { initialRouteName: "RequestsManagement" })
const InboxStack = createStackNavigator(appScreens, { initialRouteName: "Inbox" })
const AgendaStack = createStackNavigator(appScreens, { initialRouteName: "Agenda" })
const ProjectsStack = createStackNavigator(appScreens, { initialRouteName: "ListProjects" })
const DocumentsStack = createStackNavigator(appScreens, { initialRouteName: "ListDocuments" })
const OrdersStack = createStackNavigator(appScreens, { initialRouteName: "ListOrders" })
const SimulatorStack = createStackNavigator(appScreens, { initialRouteName: "ListSimulations" })
const MandatMPRStack = createStackNavigator(appScreens, { initialRouteName: "ListMandatsMPR" })
const MandatSynergysStack = createStackNavigator(appScreens, { initialRouteName: "ListMandatsSynergys" })
const NewsStack = createStackNavigator(appScreens, { initialRouteName: "ListNews" })

const stacks = {
    DashboardStack: {
        screen: DashboardStack,
        navigationOptions: hideHeader
    },
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
    SimulatorStack: {
        screen: SimulatorStack,
        navigationOptions: hideHeader
    },
    MandatMPRStack: {
        screen: MandatMPRStack,
        navigationOptions: hideHeader
    },
    MandatSynergysStack: {
        screen: MandatSynergysStack,
        navigationOptions: hideHeader
    },
    NewsStack: {
        screen: NewsStack,
        navigationOptions: hideHeader
    },
}

export const AuthStack = createStackNavigator(authScreens, { initialRouteName: "LoginScreen" })
export const AppStack = createSwitchNavigator(stacks)






