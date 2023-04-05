//
//  Libraries
//
import axios from 'axios'
//
//  Debug Settings
//
import debugSettings from '../debug/debugSettings'
import consoleLogTime from '../debug/consoleLogTime'
const debugLog = debugSettings()
const debugModule = 'apiAxios'

if (debugLog) console.log(consoleLogTime(debugModule, 'Start Global'))
//
//  Constants
//
const { DFT_TIMEOUT } = require('../services/constants.js')
const { DFT_TIMEOUT_EXTRA } = require('../services/constants.js')
const { DFT_TIMEOUT_RETRY } = require('../services/constants.js')
//
//  Global
//
let g_AxId = 0
let g_Sess = 0
//===================================================================================
//
// methods - post(get), post(update), delete(delete), post(upsert)
//
export default async function apiAxios(
  method,
  url,
  data,
  timeout = DFT_TIMEOUT,
  info = 'SqlDatabase',
  retry = DFT_TIMEOUT_RETRY
) {
  if (debugLog) console.log(consoleLogTime(debugModule, 'Start Module'))
  //
  //  retry on Fail
  //
  let rtnObjtry
  rtnObjtry = await apiRetry(TryReq, retry)
  //
  //  Return values to caller
  //
  if (debugLog) console.log(consoleLogTime(debugModule, 'RETURN rtnObjtry'), { ...rtnObjtry })
  return rtnObjtry
  //--------------------------------------------------------------------------------------------
  // apiRetry
  //--------------------------------------------------------------------------------------------
  async function apiRetry(asyncFunction, n) {
    let last_apiRetryRtn
    for (let index = 1; index < n + 1; index++) {
      try {
        const timeoutAlt = timeout + (index - 1) * DFT_TIMEOUT_EXTRA
        const apiRetryRtn = await asyncFunction(index, timeoutAlt)
        if (debugLog)
          console.log(consoleLogTime(debugModule, 'RETURN apiRetryRtn'), { ...apiRetryRtn })
        //
        //  Return value
        //
        if (apiRetryRtn.rtnValue) return apiRetryRtn
        //
        //  No catch then return
        //
        if (!apiRetryRtn.rtnCatch) return apiRetryRtn
        //
        //  Update last return value
        //
        last_apiRetryRtn = apiRetryRtn
      } catch (error) {
        console.log(consoleLogTime(debugModule, 'CATCH Error'), { ...error })
      }
    }
    //
    //  Return last error
    //
    return last_apiRetryRtn
  }
  //--------------------------------------------------------------------------------------------
  // Try request
  //--------------------------------------------------------------------------------------------
  async function TryReq(AxTry = 0, timeoutAlt) {
    //
    //  Try
    //
    try {
      if (debugLog) console.log(consoleLogTime(debugModule, 'TryReq AxTry'), AxTry)
      //
      //  Sess
      //
      const AppSessionJSON = sessionStorage.getItem('App_Session')
      if (AppSessionJSON) {
        const AppSession = JSON.parse(AppSessionJSON)
        g_Sess = AppSession.v_vid
      }
      if (debugLog) console.log(consoleLogTime(debugModule, 'g_Sess'), g_Sess)
      //
      //  Inceptor - req start time
      //
      axios.interceptors.request.use(req => {
        req.meta = req.meta || {}
        req.meta.requestStartedAt = new Date().getTime()
        return req
      })
      //
      //  Inceptor - res duration (response - start time)
      //
      axios.interceptors.response.use(
        res => {
          res.durationInMs = new Date().getTime() - res.config.meta.requestStartedAt
          return res
        },
        res => {
          res.durationInMs = new Date().getTime() - res.config.meta.requestStartedAt
          throw res
        }
      )
      //
      //  Store axios values - Request
      //
      StoreReq(AxTry, timeoutAlt)
      //
      //  Add id to body parms
      //
      const dataApiAxios = data
      dataApiAxios.Sess = g_Sess
      dataApiAxios.AxId = g_AxId
      dataApiAxios.AxTry = AxTry
      dataApiAxios.AxTimeout = timeoutAlt
      //
      //  Invoke Axios fetch
      //
      if (debugLog) console.log(consoleLogTime(debugModule, 'Request--->'), { ...dataApiAxios })

      const response = await axios({
        method: method,
        url: url,
        data: dataApiAxios,
        timeout: timeoutAlt
      })
      //
      //  Sucessful response
      //
      if (debugLog) console.log(consoleLogTime(debugModule, 'Response-->'), { ...response })
      if (debugLog)
        console.log(
          consoleLogTime(debugModule, `<--Timing-> ${response.durationInMs} ${info} SUCCESS`)
        )
      //
      //  Errors
      //
      if (response.status < 200 || response.status >= 300)
        throw Error('Did not receive expected data')
      //
      //  Update store - Return
      //
      StoreRes(response.data)
      //
      //  Return Object
      //
      return response.data
      //
      //  Catch Error
      //
    } catch (error) {
      //
      //  Returned values
      //
      const rtnObj = {
        rtnBodyParms: '',
        rtnValue: false,
        rtnMessage: error.message,
        rtnSqlFunction: '',
        rtnCatchFunction: debugModule,
        rtnCatch: true,
        rtnCatchMsg: '',
        rtnRows: []
      }
      //
      //  Update body parms
      //
      rtnObj.rtnBodyParms = JSON.parse(error.config.data)
      //
      //  No response
      //
      if (!error.response) {
        error.request
          ? (rtnObj.rtnCatchMsg = 'No response from Server')
          : (rtnObj.rtnCatchMsg = 'Request setup error')
      }
      //
      //  Error logging - All
      //
      if (debugLog) console.log(consoleLogTime(debugModule, 'Catch - Message'), error.message)
      if (debugLog) console.log(consoleLogTime(debugModule, 'Catch - error'), error)
      if (debugLog) console.log(consoleLogTime(debugModule, 'Catch - rtnObj'), rtnObj)
      console.log(consoleLogTime(debugModule, `<--Timing-> ${error.durationInMs} ${info} ERROR`))
      //
      //  Update store
      //
      StoreRes(rtnObj)
      return rtnObj
    }
  }
  //--------------------------------------------------------------------------------------------
  // Store the request values
  //--------------------------------------------------------------------------------------------
  function StoreReq(AxTry, timeoutAlt) {
    //
    //  Allocate Id
    //
    updateId()
    //
    //  Get the store
    //
    let arrReq = []
    const tempJSON = sessionStorage.getItem('App_apiAxios_Req')
    if (tempJSON) arrReq = JSON.parse(tempJSON)
    if (debugLog) console.log(consoleLogTime(debugModule, 'arrReq'), [...arrReq])
    //
    //  Populate the store object
    //
    const objReq = {
      Sess: g_Sess,
      AxId: g_AxId,
      AxTry: AxTry,
      AxTimeout: timeoutAlt,
      sqlTable: data.sqlTable,
      sqlClient: data.sqlClient,
      info: info,
      data: data,
      url: url,
      method: method
    }
    if (debugLog) console.log(consoleLogTime(debugModule, 'objReq'), { ...objReq })
    //
    //  Save to array
    //
    arrReq.push(objReq)
    if (debugLog) console.log(consoleLogTime(debugModule, 'arrReq'), [...arrReq])
    //
    //  update the store
    //
    sessionStorage.setItem('App_apiAxios_Req', JSON.stringify(arrReq))
  }
  //--------------------------------------------------------------------------------------------
  // Store the Return values
  //--------------------------------------------------------------------------------------------
  function StoreRes(rtnObj) {
    if (debugLog) console.log(consoleLogTime(debugModule, 'rtnObj'), { ...rtnObj })
    //
    //  Get the store
    //
    let arrRes = []
    const tempJSON = sessionStorage.getItem('App_apiAxios_Res')
    if (tempJSON) arrRes = JSON.parse(tempJSON)
    if (debugLog) console.log(consoleLogTime(debugModule, 'arrRes'), [...arrRes])
    //
    //  Populate the store object
    //
    const objRes = {
      Sess: rtnObj.rtnBodyParms.Sess,
      AxId: rtnObj.rtnBodyParms.AxId,
      AxTry: rtnObj.rtnBodyParms.AxTry,
      rtnValue: rtnObj.rtnValue,
      AxTimeout: rtnObj.rtnBodyParms.AxTimeout,
      sqlTable: rtnObj.rtnBodyParms.sqlTable,
      sqlClient: rtnObj.rtnBodyParms.sqlClient,
      rtnMessage: rtnObj.rtnMessage,
      rtnObj: rtnObj
    }
    if (debugLog) console.log(consoleLogTime(debugModule, 'objRes'), { ...objRes })
    //
    //  Save to array
    //
    arrRes.push(objRes)
    if (debugLog) console.log(consoleLogTime(debugModule, 'arrRes'), [...arrRes])
    //
    //  update the store
    //
    sessionStorage.setItem('App_apiAxios_Res', JSON.stringify(arrRes))
  }
  //--------------------------------------------------------------------------------------------
  // Update the transaction ID
  //--------------------------------------------------------------------------------------------
  function updateId() {
    //
    //  Get the store
    //
    const tempJSON = sessionStorage.getItem('App_apiAxios_Id')
    tempJSON ? (g_AxId = JSON.parse(tempJSON)) : (g_AxId = 0)
    g_AxId++
    //
    //  update the store
    //
    if (debugLog) console.log(consoleLogTime(debugModule, 'g_AxId'), g_AxId)
    sessionStorage.setItem('App_apiAxios_Id', JSON.stringify(g_AxId))
  }
}
