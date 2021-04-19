
import { DefaultTheme } from 'react-native-paper'
import { constants } from './constants'

const colors = {
  statusbar: "#013220",
  background: '#ffffff', //new
  primary: "#25D366", //new
  secondary: "#1B2331",
  surface: '#F5F5F5',
  appBar: '#F8F8F9',
  appBarIcon: "#1B2331",
  //tertiary: "#4CAF50",
  //tertiary: "#7ab600",
  surface: DefaultTheme.colors.surface,
  error: '#EC133A',
  disabled: DefaultTheme.colors.disabled,
  //Statuses (5)
  inProgress: '#9cf8ff',
  blocked: '#ff9cad',
  pending: '#fffc9c',
  valid: "#25D366", //primary
  canceled: '#f5f5f5',

  //Priorities
  high_priority: '#fd577d',
  moderate_priority: '#ff7311',
  low_priority: '#f3a700',

  project: ["#25D366", "#cbd4db", "#0064fa", "#ffd101", "#ff7512", "#ff4ba6", "#6357f9", "#fb5779", "#47dafc", "#5a7795", "#abe60e", "#ffa800", "#ff78ff", "#a046e4", "#ff92af", "#00d4c8"],

  high_priority_light: '#ffe0e7',
  moderate_priority_light: '#ffdfc9',
  low_priority_light: '#e8e1d3',

  placeholder: '#606467',
  offline: '#0A1172',
  icon: '#757575',
  success: "#00B386",
  accent: "#F3534A",
  black: "#323643",
  white: "#FFFFFF", //new
  inputBorderBottom: '#d9d9d9',
  gray_extraLight: "#F1F1F1", //new
  gray_light: "#EBEBEB", //new
  gray_medium: "#BCBCBC", //new
  inpuIcon: "#B4B4B4", //new
  gray_dark: "#8D8D8D", //new
  gray_googleAgenda: '#616266',
  gray: "#BDBDBD",
  graySilver: '#C0C0C0',
  // gray_light: '#eaeaec',
  gray50: '#ECEFF1',
  gray100: '#CFD8DC',
  gray2: "#B0BEC5",
  gray400: '#78909C',
  grey_300: "#e0e0e0",
  badgeTint: "rgba(41,216,143,0.20)",
  transparent: "rgba(255,255,255,0)",
  white_transparent_6: "rgba(255,255,255,0.6)",
  gallery_background: "#EEE",
  chatBackground: '#fff',
  agenda: '#555CC4',
  agendaLight: '#829BF8',

  //menu icons
  miHome: "#25D366",
  miInbox: '#EF6C00',
  miProjects: '#3F51B5',
  miPlanning: '#000',
  miUsers: '#3b5998',
  miClients: '#632568',
  miRequests: '#AD1457',
  miOrders: '#000',
  miDocuments: '#6D4C41',
  miNews: '#000',
  miLogout: '#000',
}

const sizes = {

  // global sizes
  base: 16,
  font: 14,
  radius: 6,
  padding: 25,

  // font sizes
  h1: 26,
  h2: 20,
  h3: 18,
  title: 18,
  header: 16,
  body: 14,
  caption: 12,
};

const fonts = {
  h1: {
    fontSize: sizes.h1,
    fontWeight: 'bold',
    //fontFamily: 'Montserrat-Medium',
  },
  h2: {
    fontSize: sizes.h2,
    fontWeight: 'bold',
    //fontFamily: 'Montserrat-Medium',
  },
  h3: {
    fontSize: sizes.h3,
    fontWeight: 'bold',
    //fontFamily: 'Montserrat-Medium',
  },
  header: {
    fontSize: sizes.header,
    fontWeight: 'bold',
    //fontFamily: 'Montserrat-Bold',
  },
  title: {
    fontSize: sizes.title,
    fontWeight: 'bold',
    //fontFamily: 'Montserrat-Medium',
  },
  body: {
    fontSize: sizes.body,
    fontWeight: 'bold',
    //fontFamily: 'Montserrat-Medium',
  },
  caption: {
    fontSize: sizes.caption,
    fontWeight: 'bold',
  },
}

const padding = constants.ScreenWidth * 0.04

//MontSerrat
const customFontMSbold = {
  h1: {
    fontSize: sizes.h1,
    fontFamily: 'Montserrat-Bold',
  },
  h2: {
    fontSize: sizes.h2,
    fontFamily: 'Montserrat-Bold',
  },
  h3: {
    fontSize: sizes.h3,
    fontFamily: 'Montserrat-Bold',
  },
  header: {
    fontSize: sizes.header,
    fontFamily: 'Montserrat-Bold',
  },
  title: {
    fontSize: sizes.title,
    fontFamily: 'Montserrat-Bold',
  },
  body: {
    fontSize: sizes.body,
    fontFamily: 'Montserrat-Bold',
  },
  caption: {
    fontSize: sizes.caption,
    fontFamily: 'Montserrat-Bold',
  },
}

const customFontMSsemibold = {
  h1: {
    fontSize: sizes.h1,
    fontFamily: 'Montserrat-SemiBold',
  },
  h2: {
    fontSize: sizes.h2,
    fontFamily: 'Montserrat-SemiBold',
  },
  h3: {
    fontSize: sizes.h3,
    fontFamily: 'Montserrat-SemiBold',
  },
  header: {
    fontSize: sizes.header,
    fontFamily: 'Montserrat-SemiBold',
  },
  title: {
    fontSize: sizes.title,
    fontFamily: 'Montserrat-SemiBold',
  },
  body: {
    fontSize: sizes.body,
    fontFamily: 'Montserrat-SemiBold',
  },
  caption: {
    fontSize: sizes.caption,
    fontFamily: 'Montserrat-SemiBold',
  },
}

const customFontMSmedium = {
  h1: {
    fontSize: sizes.h1,
    fontFamily: 'Montserrat-Medium',
  },
  h2: {
    fontSize: sizes.h2,
    fontFamily: 'Montserrat-Medium',
  },
  h3: {
    fontSize: sizes.h3,
    fontFamily: 'Montserrat-Medium',
  },
  header: {
    fontSize: sizes.header,
    fontFamily: 'Montserrat-Medium',
  },
  title: {
    fontSize: sizes.title,
    fontFamily: 'Montserrat-Medium',
  },
  body: {
    fontSize: sizes.body,
    fontFamily: 'Montserrat-Medium',
  },
  caption: {
    fontSize: sizes.caption,
    fontFamily: 'Montserrat-Medium',
  },
  small: {
    fontSize: 10,
    fontFamily: 'Montserrat-Medium',
  },
  extraSmall: {
    fontSize: 8,
    fontFamily: 'Montserrat-Medium',
  },
}

const customFontMSregular = {
  h1: {
    fontSize: sizes.h1,
    fontFamily: 'Montserrat-Regular',
  },
  h2: {
    fontSize: sizes.h2,
    fontFamily: 'Montserrat-Regular',
  },
  h3: {
    fontSize: sizes.h3,
    fontFamily: 'Montserrat-Regular',
  },
  header: {
    fontSize: sizes.header,
    fontFamily: 'Montserrat-Regular',
  },
  title: {
    fontSize: sizes.title,
    fontFamily: 'Montserrat-Regular',
  },
  body: {
    fontSize: sizes.body,
    fontFamily: 'Montserrat-Regular',
  },
  caption: {
    fontSize: sizes.caption,
    fontFamily: 'Montserrat-Regular',
  },
  small: {
    fontSize: 10,
    fontFamily: 'Montserrat-Regular',
  },
  extraSmall: {
    fontSize: 8,
    fontFamily: 'Montserrat-Regular',
  },
}

export { colors, sizes, padding, fonts, customFontMSregular, customFontMSmedium, customFontMSsemibold, customFontMSbold }






















//https://learnui.design/blog/android-material-design-font-size-guidelines.html


// <Text style={{ fontFamily: 'Montserrat-Black' }}>List of records</Text>
// <Text style={{ fontFamily: 'Montserrat-ExtraBold' }}>List of records</Text>
// <Text style={{ fontFamily: 'Montserrat-SemiBold' }}>List of records</Text>
// <Text style={{ fontFamily: 'Montserrat-Medium' }}>List of records</Text>
// <Text style={{ fontFamily: 'Montserrat-Regular' }}>List of records</Text>
// <Text style={{ fontFamily: 'Montserrat-Light' }}>List of records</Text>

// <Text style={{ fontFamily: 'Montserrat-ExtraLight' }}>List of records</Text>

// <Text style={{ fontFamily: 'Montserrat-Thin' }}>List of records</Text>

//https://learnui.design/blog/android-material-design-font-size-guidelines.html


// <Text style={{ fontFamily: 'Montserrat-Black' }}>List of records</Text>
// <Text style={{ fontFamily: 'Montserrat-ExtraBold' }}>List of records</Text>
// <Text style={{ fontFamily: 'Montserrat-SemiBold' }}>List of records</Text>
// <Text style={{ fontFamily: 'Montserrat-Medium' }}>List of records</Text>
// <Text style={{ fontFamily: 'Montserrat-Regular' }}>List of records</Text>
// <Text style={{ fontFamily: 'Montserrat-Light' }}>List of records</Text>

// <Text style={{ fontFamily: 'Montserrat-ExtraLight' }}>List of records</Text>

// <Text style={{ fontFamily: 'Montserrat-Thin' }}>List of records</Text>