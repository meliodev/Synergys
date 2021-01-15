import { Dimensions } from 'react-native'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

export const constants = {
    ScreenWidth: width,
    ScreenHeight: height
}

export const rolesRedux = [
    { id: 'admin', value: 'admin', bool: 'isAdmin' },
    { id: 'dircom', value: 'directeur commercial', bool: 'isDirCom' },
    { id: 'com', value: 'commercial', bool: 'isCom' },
    { id: 'tech', value: 'responsable technique', bool: 'isTech' },
    { id: 'poseur', value: 'poseur', bool: 'isPoseur' }
]

export const adminId = "GS-US-xQ6s"
