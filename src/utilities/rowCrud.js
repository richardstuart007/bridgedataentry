//
//  Utilities
//
import apiAxios from './apiAxios'
//
//  Debug Settings
//
import debugSettings from '../debug/debugSettings'
import consoleLogTime from '../debug/consoleLogTime'
const debugLog = debugSettings()
const debugModule = 'rowCrud'
//
// Constants
//
const { URL_TABLES } = require('../services/constants.js')
const { DFT_TIMEOUT } = require('../services/constants.js')
//
//  Global Variables
//
let rtnObj = {}
//--------------------------------------------------------------------
//-  Main Line
//--------------------------------------------------------------------
export default async function rowCrud(props) {
  //
  //  Reset rtnObj
  //
  rtnObj.rtnBodyParms = ''
  rtnObj.rtnValue = false
  rtnObj.rtnMessage = ''
  rtnObj.rtnSqlFunction = debugModule
  rtnObj.rtnCatchFunction = ''
  rtnObj.rtnCatch = false
  rtnObj.rtnCatchMsg = ''
  rtnObj.rtnRows = []
  //
  //  Try
  //
  try {
    if (debugLog) console.log(consoleLogTime(debugModule, 'Start'))
    //
    //  Deconstruct
    //
    const {
      sqlCaller,
      axiosMethod = 'post',
      sqlAction = 'SELECT',
      sqlTable,
      sqlString,
      sqlWhere,
      sqlRow,
      sqlKeyName,
      sqlOrderBy,
      sqlOrderByRaw,
      timeout = DFT_TIMEOUT
    } = props
    if (debugLog) console.log(consoleLogTime(debugModule, 'Props'), { ...props })
    const sqlClient = `${debugModule}/${sqlCaller}`
    //
    //  Validate the parameters
    //
    const valid = validateProps(sqlAction, sqlString, sqlTable)
    //
    //  Invalid
    //
    if (!valid) {
      console.log(
        consoleLogTime(
          `sqlClient(${sqlClient}) Action(${sqlAction}) Table(${sqlTable}) Error(${rtnObj.rtnMessage})`
        )
      )
      if (debugLog) console.log(consoleLogTime(debugModule, 'rtnObj'), rtnObj)
      return rtnObj
    }
    //
    // Fetch the data
    //
    const rtnObjServer = sqlDatabase(
      sqlClient,
      sqlTable,
      sqlAction,
      sqlString,
      sqlWhere,
      sqlRow,
      sqlKeyName,
      sqlOrderBy,
      sqlOrderByRaw,
      axiosMethod,
      timeout
    )
    //
    //  Return value from Server
    //
    if (debugLog) console.log(consoleLogTime(debugModule, 'rtnObjServer'), { ...rtnObjServer })
    return rtnObjServer
    //
    //  Catch Errors
    //
  } catch (e) {
    if (debugLog) console.log(consoleLogTime(debugModule, 'Catch'))
    console.log(e)
    rtnObj.rtnCatch = true
    rtnObj.rtnCatchMsg = 'rowCrud catch error'
    if (debugLog) console.log(consoleLogTime(debugModule, 'rtnObj'), { ...rtnObj })
    return rtnObj
  }
  //--------------------------------------------------------------------
  //  Validate the parameters
  //--------------------------------------------------------------------
  function validateProps(sqlAction, sqlString, sqlTable) {
    //
    // Check values sent
    //
    if (!sqlAction) {
      rtnObj.rtnMessage = `SqlAction parameter not passed`
      return false
    }
    //
    //  Validate sqlAction type
    //
    if (
      sqlAction !== 'DELETE' &&
      sqlAction !== 'EXIST' &&
      sqlAction !== 'SELECTSQL' &&
      sqlAction !== 'SELECT' &&
      sqlAction !== 'INSERT' &&
      sqlAction !== 'UPDATE' &&
      sqlAction !== 'UPSERT'
    ) {
      rtnObj.rtnMessage = `SqlAction ${sqlAction}: SqlAction not valid`
      return false
    }
    //
    //  SELECTSQL needs sqlString
    //
    if (sqlAction === 'SELECTSQL' && !sqlString) {
      rtnObj.rtnMessage = `SqlAction ${sqlAction}: sqlString not passed`
      return false
    }
    //
    //  not SELECTSQL needs table
    //
    if (sqlAction !== 'SELECTSQL' && !sqlTable) {
      rtnObj.rtnMessage = `SqlAction ${sqlAction}: sqlTable not passed`
      return false
    }
    //
    //  Valid
    //
    return true
  }
  //--------------------------------------------------------------------
  //  Database SQL
  //--------------------------------------------------------------------
  async function sqlDatabase(
    sqlClient,
    sqlTable,
    sqlAction,
    sqlString,
    sqlWhere,
    sqlRow,
    sqlKeyName,
    sqlOrderBy,
    sqlOrderByRaw,
    axiosMethod,
    timeout
  ) {
    let body
    try {
      //
      //  Body
      //
      body = {
        sqlClient: sqlClient,
        sqlTable: sqlTable,
        sqlAction: sqlAction,
        sqlString: sqlString,
        sqlWhere: sqlWhere,
        sqlRow: sqlRow,
        sqlKeyName: sqlKeyName,
        sqlOrderBy: sqlOrderBy,
        sqlOrderByRaw: sqlOrderByRaw
      }
      //
      //  Base URL
      //
      const App_URL = JSON.parse(sessionStorage.getItem('App_URL'))
      //
      //  Full URL
      //
      const URL = App_URL + URL_TABLES
      if (debugLog) console.log(consoleLogTime(debugModule, 'URL'), URL)
      if (debugLog)
        console.log(
          consoleLogTime(
            debugModule,
            `sqlClient(${sqlClient}) Action(${sqlAction}) Table(${sqlTable})`
          )
        )
      //
      //  Info
      //
      const info = `sqlClient(${sqlClient}) Action(${sqlAction}) Table(${sqlTable})`
      //
      //  SQL database
      //
      const rtnObjServer = await apiAxios(axiosMethod, URL, body, timeout, info)
      if (debugLog) console.log(consoleLogTime(debugModule, 'rtnObjServer'), { ...rtnObjServer })
      return rtnObjServer
      //
      // Errors
      //
    } catch (e) {
      if (debugLog) console.log(consoleLogTime(debugModule, 'Catch'))
      console.log(e)
      const rtnObj = {
        rtnBodyParms: body,
        rtnValue: false,
        rtnMessage: '',
        rtnSqlFunction: debugModule,
        rtnCatchFunction: debugModule,
        rtnCatch: true,
        rtnCatchMsg: 'Catch calling apiAxios',
        rtnRows: []
      }
      return rtnObj
    }
  }
}
