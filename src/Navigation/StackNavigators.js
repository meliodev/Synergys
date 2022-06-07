import * as React from 'react';

import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import * as theme from '../core/theme'
import { Text } from 'react-native'
import { faArrowToRight, faInfo, faNewspaper, faVials } from '@fortawesome/pro-light-svg-icons'

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
import Process from '../screens/Process/Process'
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
import GuestContactSuccess from '../screens/Forms/Simulations/GuestContactSuccess';
//PV réception
import CreatePvReception from '../screens/Forms/PvReception/CreatePvReception'
import ListPvReceptions from '../screens/Forms/PvReception/ListPvReceptions'
//Mandat MPR
import CreateMandatMPR from '../screens/Forms/MandatMaPrimeRenov/CreateMandatMPR'
import ListMandatsMPR from '../screens/Forms/MandatMaPrimeRenov/ListMandatsMPR'
//Mandat Synergys
import CreateMandatSynergys from '../screens/Forms/MandatSynergys/CreateMandatSynergys'
import ListMandatsSynergys from '../screens/Forms/MandatSynergys/ListMandatsSynergys'
//Visite technique
import CreateFicheTech from '../screens/Forms/FicheTechnique/CreateFicheTech'

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

import { constants, isTablet } from '../core/constants'
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { CustomIcon } from '../components';
import AboutUs from '../screens/Settings/AboutUs';
import Settings from '../screens/Settings/Settings';
import SalesTermsAndConditions from '../screens/Settings/SalesTermsAndConditions';
import PrivacyPolicy from '../screens/Settings/PrivacyPolicy';
import Support from '../screens/Settings/Support';

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
    Process: {
        screen: Process,
        path: 'process/:ProjectId',
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
    GuestContactSuccess: {
        screen: GuestContactSuccess,
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
    CreateFicheTech: {
        screen: CreateFicheTech,
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
    Settings: {
        screen: Settings,
        navigationOptions: hideHeader
    },
    AboutUs: {
        screen: AboutUs,
        navigationOptions: hideHeader
    },
    SalesTermsAndConditions: {
        screen: SalesTermsAndConditions,
        navigationOptions: hideHeader
    },
    PrivacyPolicy: {
        screen: PrivacyPolicy,
        navigationOptions: hideHeader
    },
    Support: {
        screen: Support,
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
const SettingsStack = createStackNavigator(appScreens, { initialRouteName: "Settings" })
const AuthStack = createStackNavigator(authScreens, { initialRouteName: "LoginScreen" })


//GUEST APP
const SimulatorStackGuest = createStackNavigator(
    {
        CreateSimulation: {
            screen: CreateSimulation,
            navigationOptions: hideHeader
        },
        GuestContactSuccess: {
            screen: GuestContactSuccess,
            navigationOptions: hideHeader
        },
        PrivacyPolicy: {
            screen: PrivacyPolicy,
            navigationOptions: hideHeader
        },
        
    },
    { initialRouteName: "CreateSimulation" }
)

const NewsStackGuest = createStackNavigator(
    {
        ListNews: {
            screen: ListNews,
            navigationOptions: hideHeader
        },
        ViewNews: {
            screen: ViewNews,
            navigationOptions: hideHeader
        },
    },
    { initialRouteName: "ListNews" }
)

const guestScreens = {
    Simulation: {
        screen: SimulatorStackGuest,
        navigationOptions: {
            title: "Simulation",
            unmountOnBlur: true,
        }
    },
    News: {
        screen: NewsStackGuest,
        navigationOptions: {
            title: "Actualité",
            unmountOnBlur: true,
        }
    },
    AboutUs: {
        screen: AboutUs,
        navigationOptions: {
            title: "A propos"
        }
    },
    Auth: {
        screen: AuthStack,
        navigationOptions: {
            title: "Se connecter"
        }
    },
}

//All stacks
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
    SettingsStack: {
        screen: SettingsStack,
        navigationOptions: hideHeader
    },
}

//export const AuthStack = createStackNavigator(authScreens, { initialRouteName: "LoginScreen" })
export const GuestTab = createBottomTabNavigator(
    guestScreens,
    {
        defaultNavigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused, horizontal, tintColor }) => {
                const { routeName } = navigation.state;
                let IconComponent = CustomIcon;
                let icon;
                if (routeName === 'Auth') {
                    icon = faArrowToRight
                }
                else if (routeName === 'Simulation') {
                    icon = faVials
                }
                else if (routeName === 'AboutUs') {
                    icon = faInfo
                }
                else if (routeName === 'News') {
                    icon = faNewspaper
                }

                return <IconComponent icon={icon} size={25} color={tintColor} />;
            },
        }),
        resetOnBlur: true,
        tabBarOptions: {
            activeTintColor: theme.colors.primary,
            inactiveTintColor: theme.colors.gray_dark,
            safeAreaInset: {
                bottom: 0,
            },
            labelStyle: {
                fontSize: isTablet ? 22 : undefined,
            },
        },
        initialRouteName: "Auth",
    }
)



//const AuthStack = createBottomTabNavigator(authScreens)
export const AppStack = createSwitchNavigator(stacks)






