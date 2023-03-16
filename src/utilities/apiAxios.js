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
//
//  Returned values
//
const rtnObj = {
  rtnValue: false,
  rtnMessage: '',
  rtnSqlFunction: '',
  rtnCatchFunction: debugModule,
  rtnCatch: true,
  rtnCatchMsg: '',
  rtnRows: []
}
if (debugLog) console.log(consoleLogTime(debugModule, 'Start Global'))
//===================================================================================
//
// methods - post(get), post(update), delete(delete), post(upsert)
//
export default async function apiAxios(method, url, data, timeout = 2000, info = 'SqlDatabase') {
  //
  //  Try
  //
  try {
    if (debugLog) console.log(consoleLogTime(debugModule, 'Start Module'))
    //
    //  Reset rtnObj
    //
    rtnObj.rtnValue = false
    rtnObj.rtnMessage = ''
    rtnObj.rtnSqlFunction = debugModule
    rtnObj.rtnCatchFunction = ''
    rtnObj.rtnCatch = false
    rtnObj.rtnCatchMsg = ''
    rtnObj.rtnRows = []
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

    if (debugLog) console.log(consoleLogTime(debugModule, 'Request--->'), data)
    const response = await axios({
      method: method,
      url: url,
      data: data,
      timeout: timeout
    })
    if (debugLog) console.log(consoleLogTime(debugModule, 'Response-->'), response)
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
    //  Return rows
    //
    return response.data
    //
    //  Catch Error
    //
  } catch (error) {
    rtnObj.rtnCatchFunction = debugModule
    rtnObj.rtnValue = false
    rtnObj.rtnCatch = true
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
    console.log(consoleLogTime(debugModule, 'Catch - rtnObj'), rtnObj)
    console.log(consoleLogTime(debugModule, `<--Timing-> ${error.durationInMs} ${info} ERROR`))
    return rtnObj
  }
}
