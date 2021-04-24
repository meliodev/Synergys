import { Dimensions } from 'react-native'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

export const constants = {
    ScreenWidth: width,
    ScreenHeight: height
}

export const roles = [
    { id: 'admin', value: 'Admin', bool: 'isAdmin', level: 3 },
    { id: 'backoffice', value: 'Back office', bool: 'isBackOffice', level: 3 },
    { id: 'dircom', value: 'Directeur commercial', bool: 'isDirCom', level: 2 },
    { id: 'com', value: 'Commercial', bool: 'isCom', level: 1 },
    { id: 'tech', value: 'Responsable technique', bool: 'isTech', level: 1 },
    { id: 'poseur', value: 'Poseur', bool: 'isPoseur', level: 0 }
]

export const highRoles = ['admin', 'backoffice', 'dircom', 'tech']

