import { Dimensions } from 'react-native'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

export const constants = {
    ScreenWidth: width,
    ScreenHeight: height
}

export const roles = [
    { id: 'admin', label: 'Admin', value: 'Admin', bool: 'isAdmin', level: 3 },
    { id: 'backoffice', label: 'Back office', value: 'Back office', bool: 'isBackOffice', level: 3 },
    { id: 'dircom', label: 'Directeur commercial', value: 'Directeur commercial', bool: 'isDirCom', level: 2 },
    { id: 'com', label: 'Commercial', value: 'Commercial', bool: 'isCom', level: 1 },
    { id: 'tech', label: 'Responsable technique', value: 'Responsable technique', bool: 'isTech', level: 1 },
    { id: 'poseur', label: 'Poseur', value: 'Poseur', bool: 'isPoseur', level: 0 }
]

export const highRoles = ['admin', 'backoffice', 'dircom', 'tech']
export const highRolesValues = ['Admin', 'Back office', 'Directeur commercial', 'Responsable technique']

export const comSteps = ['Initialisation', 'Rendez-vous 1', 'Rendez-vous N']
export const techSteps = ['Visite technique', 'Installation', 'Maintenance']

