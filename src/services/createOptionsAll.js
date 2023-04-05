//
//  Options
//
import createOptions from '../utilities/createOptions'
//
//  Debug Settings
//
import debugSettings from '../debug/debugSettings'
import consoleLogTime from '../debug/consoleLogTime'
const debugLog = debugSettings()
const debugModule = 'createOptionsAll'
//----------------------------------------------------------------------------
//- Main Line
//----------------------------------------------------------------------------
export default function createOptionsAll() {
  if (debugLog) console.log(consoleLogTime(debugModule, 'Start'))
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
