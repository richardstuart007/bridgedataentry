//
//  Libraries
//
import axios from 'axios'
//
//  Debug Settings
//
import debugSettings from '../debug/debugSettings'
//.............................................................................
//.  Initialisation
//.............................................................................
//
// Debug Settings
//
const debugLog = debugSettings()
//
//  Returned values
//
const rtnObj = {
  rtnValue: false,
  rtnMessage: '',
  rtnSqlFunction: '',
  rtnCatchFunction: 'apiAxios',
  rtnCatch: true,
  rtnCatchMsg: '',
  rtnRows: []
}
//===================================================================================
//
// methods - post(get), post(update), delete(delete), post(upsert)
//
export default async function apiAxios(method, url, data) {
  try {
    if (debugLog) console.log(`url(${url}) method(${method})`)
    const response = await axios({
      method: method,
      url: url,
      data: data
    })
    if (debugLog) console.log(response)
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
    rtnObj.rtnCatchFunction = 'apiAxios'
    rtnObj.rtnValue = false
    rtnObj.rtnCatch = true
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log('Error.message.data ', error.response.data)
      console.log('Error.message.status ', error.response.status)
      console.log('Error.message.headers ', error.response.headers)
      rtnObj.rtnCatchMsg = 'Error returned by server'
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log('Error.request ', error.request)
      rtnObj.rtnCatchMsg = 'No response from Server'
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error.message ', error.message)
      rtnObj.rtnCatchMsg = 'Request setup error'
    }
    console.log('Error.config ', error.config)

    return rtnObj
  }
}
