//
// Libraries
//
import { createTheme, ThemeProvider, StyledEngineProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { useState } from 'react'
import useMediaQuery from '@mui/material/useMediaQuery'
//
//  Options
//
import createOptions from '../utilities/createOptions'
//
//  Debug Settings
//
import debugSettings from '../debug/debugSettings'
//
//  Pages
//
import Control from '../pages/Control'
//
//  Common Components
//
import Layout from '../components/Layout/Layout'
//
//  Global Themes used by the Theme Provider
//
const theme = createTheme({
  palette: {
    primary: {
      main: '#333996',
      light: '#3c44b126'
    },
    secondary: {
      main: '#f83245',
      light: '#f8324526'
    },
    background: {
      default: '#f4f5fd'
    }
  },
  overrides: {
    MuiAppBar: {
      root: {
        transform: 'translateZ(0)'
      }
    }
  },
  props: {
    MuiIconButton: {
      disableRipple: true
    }
  }
})
//------------------------------------------------------------------------
//  Remote - Production
//------------------------------------------------------------------------
//
//  Remote Client --> Remote Server 1 --> Remote Database 1
//
const { SERVER01 } = require('../services/constants.js')
const { DATABASE01 } = require('../services/constants.js')
const { SERVERURL01 } = require('../services/constants.js')
//
//  Remote Client --> Remote Server 2 --> Remote Database 2
//
const { SERVER02 } = require('../services/constants.js')
const { DATABASE02 } = require('../services/constants.js')
const { SERVERURL02 } = require('../services/constants.js')
//------------------------------------------------------------------------
//  Local
//------------------------------------------------------------------------
//
//  Local Client --> Local Server --> Local Database 6
//
const { SERVER16 } = require('../services/constants.js')
const { DATABASE6 } = require('../services/constants.js')
const { SERVERURL16 } = require('../services/constants.js')
//
//  Local Client --> Local Server --> Local Database 7
//
const { SERVER17 } = require('../services/constants.js')
const { DATABASE7 } = require('../services/constants.js')
const { SERVERURL17 } = require('../services/constants.js')
//
//  Local Client --> Local Server 1 --> Remote Database 1
//
const { SERVER11 } = require('../services/constants.js')
const { SERVERURL11 } = require('../services/constants.js')
//
//  Local Client --> Local Server 2 --> Remote Database 2
//
const { SERVER12 } = require('../services/constants.js')
const { SERVERURL12 } = require('../services/constants.js')
//
// Debug Settings
//
const debugLog = debugSettings()
//
// Global
//
let g_firstTimeFlag = true
let w_server_database
let w_node_env
let w_Database
let w_Server
let w_URL
//----------------------------------------------------------------------------
//- Main Line
//----------------------------------------------------------------------------
export default function App() {
  if (debugLog) console.log(`Start APP`)
  //
  //  Start page
  //
  const [currentPage, setCurrentPage] = useState('')
  //
  //  Screen Width
  //
  const ScreenMedium = useMediaQuery(theme.breakpoints.up('sm'))
  const ScreenSmall = !ScreenMedium
  sessionStorage.setItem('App_Settings_ScreenSmall', ScreenSmall)
  //
  //  First Time Setup
  //
  if (g_firstTimeFlag) {
    g_firstTimeFlag = false
    firstTime()
  }
  //.............................................................................
  //  First Time Setup
  //.............................................................................
  function firstTime() {
    if (debugLog) console.log(`First Time APP Reset`)
    //
    //  Environment variables
    //
    w_server_database = process.env.REACT_APP_SERVER_DATABASE
    w_server_database = w_server_database.trim()
    if (debugLog) console.log('w_server_database ', w_server_database)
    w_node_env = process.env.NODE_ENV
    if (debugLog) console.log('w_node_env ', w_node_env)
    //
    //  Server & Database
    //
    update_serverdatabase()
    //
    //  Store Server, Database, URL
    //
    sessionStorage.setItem('App_Settings_Server_Database', JSON.stringify(w_server_database))
    sessionStorage.setItem('App_Settings_Node_Env', JSON.stringify(w_node_env))
    sessionStorage.setItem('App_Settings_Server', JSON.stringify(w_Server))
    sessionStorage.setItem('App_Settings_Database', JSON.stringify(w_Database))
    sessionStorage.setItem('App_Settings_URL', JSON.stringify(w_URL))
    if (debugLog)
      console.log(`QuizClient: SERVER(${w_Server}) DATABASE(${w_Database}) URL(${w_URL})`)
    //
    //  DevMode if local client
    //
    let App_Settings_DevMode
    w_node_env === 'development' ? (App_Settings_DevMode = true) : (App_Settings_DevMode = false)
    sessionStorage.setItem('App_Settings_DevMode', App_Settings_DevMode)
    //
    //  Navigation
    //
    sessionStorage.setItem('Nav_Page_Current', JSON.stringify('OwnerList'))
    sessionStorage.setItem('Nav_Page_Previous', JSON.stringify(''))
    //
    //  Selection
    //
    sessionStorage.setItem('Selection_Owner', false)
    sessionStorage.setItem('Selection_OwnerGroup', false)
    //
    //  Initial Data Load
    //
    sessionStorage.setItem('Data_Options_ALL_Received', false)
    const Promise_Owner = createOptions({
      cop_sqlTable: 'owner',
      cop_id: 'oowner',
      cop_title: 'otitle',
      cop_store: 'Data_Options_Owner',
      cop_received: 'Data_Options_Owner_Received'
    })
    const Promise_OwnerGroup = createOptions({
      cop_sqlTable: 'ownergroup',
      cop_owner: 'ogowner',
      cop_id: 'oggroup',
      cop_title: 'ogtitle',
      cop_store: 'Data_Options_OwnerGroup',
      cop_received: 'Data_Options_OwnerGroup_Received'
    })
    const Promise_Library = createOptions({
      cop_sqlTable: 'library',
      cop_id: 'lrref',
      cop_title: 'lrdesc',
      cop_store: 'Data_Options_Library',
      cop_received: 'Data_Options_Library_Received'
    })
    const Promise_Who = createOptions({
      cop_sqlTable: 'who',
      cop_id: 'wwho',
      cop_title: 'wtitle',
      cop_store: 'Data_Options_Who',
      cop_received: 'Data_Options_Who_Received'
    })
    //
    //   Wait for all promises
    //
    Promise.all([Promise_Owner, Promise_OwnerGroup, Promise_Library, Promise_Who]).then(values => {
      if (debugLog) console.log(`Promise values ALL`, values)
      sessionStorage.setItem('Data_Options_ALL_Received', true)
    })
  }
  //.............................................................................
  //.  Local Port Overridden - Update Constants
  //.............................................................................
  function update_serverdatabase() {
    switch (w_server_database) {
      //------------------------------------------------------
      //  Client(Local/Remote) --> Remote Server 1 --> Remote Database 1
      //------------------------------------------------------
      case '01':
        w_Server = SERVER01
        w_Database = DATABASE01
        w_URL = SERVERURL01
        break
      //------------------------------------------------------
      //  Client(Local/Remote) --> Remote Server 2 --> Remote Database 2
      //------------------------------------------------------
      case '02':
        w_Server = SERVER02
        w_Database = DATABASE02
        w_URL = SERVERURL02
        break
      //------------------------------------------------------
      //  Local Client --> Local Server 1 --> Remote Database 1
      //------------------------------------------------------
      case '11':
        w_Server = SERVER11
        w_Database = DATABASE01
        w_URL = SERVERURL11
        break
      //------------------------------------------------------
      //  Local Client --> Local Server 2 --> Remote Database 2
      //------------------------------------------------------
      case '12':
        w_Server = SERVER12
        w_Database = DATABASE02
        w_URL = SERVERURL12
        break
      //------------------------------------------------------
      //  Local Client --> Local Server --> Local Database 6
      //------------------------------------------------------
      case '16':
        w_Server = SERVER16
        w_Database = DATABASE6
        w_URL = SERVERURL16
        break
      //------------------------------------------------------
      //  Local Client --> Local Server --> Local Database 7
      //------------------------------------------------------
      case '17':
        w_Server = SERVER17
        w_Database = DATABASE7
        w_URL = SERVERURL17
        break
      //------------------------------------------------------
      //  Error
      //------------------------------------------------------
      default:
        w_Database = 'Error'
        w_Server = 'Error'
        w_URL = 'Error'
        break
    }
  }
  //.............................................................................
  //.  Handle Page Change
  //.............................................................................
  function handlePage(nextPage) {
    //
    //  If no change of Page, return
    //
    console.log('NextPage ', nextPage)
    console.log('currentPage ', currentPage)
    if (nextPage === currentPage) return
    //
    //  Change of Page
    //
    const CurrentPage = currentPage
    if (debugLog) console.log(`Current Page ${CurrentPage} ==> New Page ${nextPage}`)
    //
    //  Update Previous Page
    //
    sessionStorage.setItem('Nav_Page_Previous', JSON.stringify(CurrentPage))
    if (debugLog)
      console.log(
        `UPDATED PREVIOUS_Page ${JSON.parse(sessionStorage.getItem('Nav_Page_Previous'))}`
      )
    //
    //  Update NEW Page
    //
    sessionStorage.setItem('Nav_Page_Current', JSON.stringify(nextPage))
    if (debugLog)
      console.log(`UPDATED CURRENT_PAGE ${JSON.parse(sessionStorage.getItem('Nav_Page_Current'))}`)
    //
    //  Update State
    //
    setCurrentPage(nextPage)
  }
  //.............................................................................
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Layout handlePage={handlePage}>
          <Control handlePage={handlePage} />
        </Layout>
        <CssBaseline />
      </ThemeProvider>
    </StyledEngineProvider>
  )
}
