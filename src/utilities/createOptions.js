//
//  Utilities
//
import rowCrud from './rowCrud'
//
//  Debug Settings
//
import debugSettings from '../debug/debugSettings'
import consoleLogTime from '../debug/consoleLogTime'
const debugLog = debugSettings()
const debugModule = 'createOptions'
//...................................................................................
//.  Main Line
//...................................................................................
export default function createOptions(props) {
  if (debugLog) console.log(consoleLogTime(debugModule, 'Start'))
  const {
    cop_sqlTable,
    cop_sqlWhere = null,
    cop_owner,
    cop_id,
    cop_title,
    cop_store,
    cop_received
  } = props
  //
  //  Received flag
  //
  sessionStorage.setItem(cop_received, false)
  //
  //  Process promise
  //
  let sqlString = `* from ${cop_sqlTable} `
  if (cop_sqlWhere) sqlString = sqlString + cop_sqlWhere
  const rowCrudparams = {
    axiosMethod: 'post',
    sqlCaller: debugModule,
    sqlTable: cop_sqlTable,
    sqlAction: 'SELECTSQL',
    sqlString: sqlString
  }
  const myPromiseGet = rowCrud(rowCrudparams)
  //
  //  Resolve Status
  //
  myPromiseGet.then(function (rtnObj) {
    //
    //  No data returned
    //
    if (!rtnObj.rtnValue) return
    //
    //  Load Options from Data
    //
    const data = rtnObj.rtnRows
    LoadOptions(data, cop_owner, cop_id, cop_title, cop_store, cop_received)
    return
  })
  //
  //  Return Promise
  //
  return myPromiseGet
  //...................................................................................
  //.  Load Options
  //...................................................................................
  function LoadOptions(data, cop_owner, cop_id, cop_title, cop_store, cop_received) {
    //
    //  Options
    //
    let Options = []
    //
    //  No Owner
    //
    if (!cop_owner) {
      data.forEach(item => {
        const itemObj = {
          id: item[cop_id],
          title: item[cop_title]
        }
        Options.push(itemObj)
      })
    }
    //
    //  Owner
    //
    else {
      data.forEach(item => {
        const itemObj = {
          owner: item[cop_owner],
          id: item[cop_id],
          title: item[cop_title]
        }
        Options.push(itemObj)
      })
    }
    //
    //  Store
    //
    sessionStorage.setItem(cop_store, JSON.stringify(Options))
    //
    //  Received flag
    //
    sessionStorage.setItem(cop_received, true)
  }
  //...................................................................................
}
