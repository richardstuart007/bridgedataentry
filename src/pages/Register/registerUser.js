//
//  Utilities
//
import apiAxios from '../../utilities/apiAxios'
//
//  Debug Settings
//
import debugSettings from '../../debug/debugSettings'
import consoleLogTime from '../../debug/consoleLogTime'
const debugLog = debugSettings()
const debugModule = 'registerUser'
//
// Constants
//
const { URL_REGISTER } = require('../../services/constants.js')
//--------------------------------------------------------------------
//-  Main Line
//--------------------------------------------------------------------
export default async function registerUser(props) {
  if (debugLog) console.log(consoleLogTime(debugModule, 'Start'))
  //
  //
  //  Deconstruct props
  //
  const {
    sqlCaller,
    user,
    email,
    password,
    name,
    fedid,
    fedcountry,
    dftmaxquestions,
    dftowner,
    showprogress,
    showscore,
    sortquestions,
    skipcorrect,
    admin,
    dev
  } = props
  let sqlClient = `${debugModule}/${sqlCaller}`
  //
  //  Get the URL
  //
  const App_URL = JSON.parse(sessionStorage.getItem('App_URL'))
  //
  // Fetch the data
  //
  let rtnObj = fetchItems()
  return rtnObj
  //--------------------------------------------------------------------
  //.  fetch data
  //--------------------------------------------------------------------
  async function fetchItems() {
    try {
      //
      //  Setup actions
      //
      const method = 'post'
      let body = {
        sqlClient: sqlClient,
        user: user,
        email: email,
        password: password,
        name: name,
        fedid: fedid,
        fedcountry: fedcountry,
        dftmaxquestions: dftmaxquestions,
        dftowner: dftowner,
        showprogress: showprogress,
        showscore: showscore,
        sortquestions: sortquestions,
        skipcorrect: skipcorrect,
        admin: admin,
        dev: dev
      }
      const URL = App_URL + URL_REGISTER
      //
      //  Timeout
      //
      let timeout = 2000
      //
      //  Info
      //
      const info = `Client(${sqlClient}) Action(Register)`
      //
      //  SQL database
      //
      rtnObj = await apiAxios(method, URL, body, timeout, info)
      return rtnObj
      //
      // Errors
      //
    } catch (err) {
      console.log(err)
      return []
    }
  }
  //--------------------------------------------------------------------
}
