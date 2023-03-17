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
//  Pages
//
import Control from '../pages/Control'
//
//  Common Components
//
import Layout from '../components/Layout/Layout'
//
//  Debug Settings
//
import debugSettings from '../debug/debugSettings'
import consoleLogTime from '../debug/consoleLogTime'
const debugLog = debugSettings()
const debugModule = 'App'
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

//
// Global
//
let g_firstTimeFlag = true
let w_server_database
let w_node_env
let w_Database = 'Error'
let w_Server = 'Error'
let w_URL = 'Error'
const PageStart = 'Splash'
//----------------------------------------------------------------------------
//- Main Line
//----------------------------------------------------------------------------
export default function App() {
  if (debugLog) console.log(consoleLogTime(debugModule, 'Start Module'))
  const [pageCurrent, setPageCurrent] = useState(PageStart)
  //
  //  Screen Width
  //
  const ScreenMedium = useMediaQuery(theme.breakpoints.up('sm'))
  const ScreenSmall = !ScreenMedium
  sessionStorage.setItem('App_ScreenSmall', ScreenSmall)
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
    //
    //  Environment variables
    //
    w_server_database = process.env.REACT_APP_SERVER_DATABASE
    w_server_database = w_server_database.trim()
    w_node_env = process.env.NODE_ENV
    //
    //  Server & Database
    //
    update_serverdatabase()
    //
    //  Store Server, Database, URL
    //
    sessionStorage.setItem('App_Server_Database', JSON.stringify(w_server_database))
    sessionStorage.setItem('App_Node_Env', JSON.stringify(w_node_env))
    sessionStorage.setItem('App_Server', JSON.stringify(w_Server))
    sessionStorage.setItem('App_Database', JSON.stringify(w_Database))
    sessionStorage.setItem('App_URL', JSON.stringify(w_URL))
    //
    //  DevMode if local client
    //
    let App_DevMode
    w_node_env === 'development' ? (App_DevMode = true) : (App_DevMode = false)
    sessionStorage.setItem('App_DevMode', App_DevMode)
    //
    //  Navigation
    //
    sessionStorage.setItem('Nav_PageStart', JSON.stringify(PageStart))
    sessionStorage.setItem('Nav_Current', JSON.stringify(PageStart))
    sessionStorage.setItem('Nav_Previous', JSON.stringify(''))
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
    const Promise_Reftype = createOptions({
      cop_sqlTable: 'reftype',
      cop_id: 'rttype',
      cop_title: 'rttitle',
      cop_store: 'Data_Options_Reftype',
      cop_received: 'Data_Options_Reftype_Received'
    })
    //
    //   Wait for all promises
    //
    Promise.all([
      Promise_Owner,
      Promise_OwnerGroup,
      Promise_Library,
      Promise_Who,
      Promise_Reftype
    ]).then(values => {
      sessionStorage.setItem('Data_Options_ALL_Received', true)
    })
  }
  //.............................................................................
  //.  Local Port Overridden - Update Constants
  //.............................................................................
  function update_serverdatabase() {
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
    //
    //  Remote Client --> Remote Server 3 --> Remote Database 3
    //
    const { SERVER03 } = require('../services/constants.js')
    const { DATABASE03 } = require('../services/constants.js')
    const { SERVERURL03 } = require('../services/constants.js')
    //
    //  Remote Client --> Remote Server 4 --> Remote Database 4
    //
    const { SERVER04 } = require('../services/constants.js')
    const { DATABASE04 } = require('../services/constants.js')
    const { SERVERURL04 } = require('../services/constants.js')
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
    //  Local Client --> Local Server 3 --> Remote Database 3
    //
    const { SERVER13 } = require('../services/constants.js')
    const { SERVERURL13 } = require('../services/constants.js')
    //
    //  Local Client --> Local Server 4 --> Remote Database 4
    //
    const { SERVER14 } = require('../services/constants.js')
    const { SERVERURL14 } = require('../services/constants.js')
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
      //  Client(Local/Remote) --> Remote Server 3 --> Remote Database 3
      //------------------------------------------------------
      case '03':
        w_Server = SERVER03
        w_Database = DATABASE03
        w_URL = SERVERURL03
        break
      //------------------------------------------------------
      //  Client(Local/Remote) --> Remote Server 2 --> Remote Database 2
      //------------------------------------------------------
      case '04':
        w_Server = SERVER04
        w_Database = DATABASE04
        w_URL = SERVERURL04
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
      //  Local Client --> Local Server 2 --> Remote Database 2
      //------------------------------------------------------
      case '13':
        w_Server = SERVER13
        w_Database = DATABASE03
        w_URL = SERVERURL13
        break
      //------------------------------------------------------
      //  Local Client --> Local Server 2 --> Remote Database 2
      //------------------------------------------------------
      case '14':
        w_Server = SERVER14
        w_Database = DATABASE04
        w_URL = SERVERURL14
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
    //  Retrieve the state
    //
    const PageCurrent = JSON.parse(sessionStorage.getItem('Nav_Current'))
    const PagePrevious = JSON.parse(sessionStorage.getItem('Nav_Previous'))
    //
    //  If no change of Page, return
    //
    if (nextPage === PageCurrent) return
    //
    //  Back/Start ?
    //
    const PageNext =
      nextPage === 'PAGEBACK' ? PagePrevious : nextPage === 'PAGESTART' ? PageStart : nextPage
    //
    //  Update Previous Page
    //
    sessionStorage.setItem('Nav_Previous', JSON.stringify(PageCurrent))
    //
    //  Update NEW Page
    //
    sessionStorage.setItem('Nav_Current', JSON.stringify(PageNext))
    //
    //  Update State
    //
    setPageCurrent(PageNext)
  }
  //.............................................................................
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Layout handlePage={handlePage} pageCurrent={pageCurrent}>
          <Control handlePage={handlePage} pageCurrent={pageCurrent} />
        </Layout>
        <CssBaseline />
      </ThemeProvider>
    </StyledEngineProvider>
  )
}
