//
//  Utilities
//
import rowCrud from '../utilities/rowCrud'
//
//  Debug Settings
//
import debugSettings from '../debug/debugSettings'
import consoleLogTime from '../debug/consoleLogTime'
const debugLog = debugSettings()
const debugModule = 'writeSession'
//===================================================================================
export default function writeSession() {
  if (debugLog) console.log(consoleLogTime(debugModule, 'Start'))
  //
  //  Build row
  //
  const usdatetime = new Date().toJSON()
  const sqlRow = {
    v_datetime: usdatetime
  }
  if (debugLog) console.log(consoleLogTime(debugModule, 'sqlRow'), { ...sqlRow })
  //
  //  Build Props
  //
  const props = {
    sqlCaller: debugModule,
    axiosMethod: 'post',
    sqlAction: 'INSERT',
    sqlTable: 'sessions',
    sqlRow: sqlRow
  }
  //
  //  Process promise
  //
  const myPromiseInsert = rowCrud(props)
  //
  //  Resolve Status
  //
  myPromiseInsert.then(function (rtnObj) {
    if (debugLog) console.log(consoleLogTime(debugModule, 'rtnObj'), { ...rtnObj })
    //
    //  No data returned
    //
    if (!rtnObj.rtnValue) return
    //
    //  Data
    //
    const data = rtnObj.rtnRows
    const newRow = data[0]
    if (debugLog)
      console.log(consoleLogTime(debugModule, `Row (${newRow.v_vid}) INSERTED in Database`))
    //
    //  Update storage with new row
    //
    sessionStorage.setItem('App_Session', JSON.stringify(newRow))
    return
  })
  //
  //  Return Promise
  //
  return myPromiseInsert
}
