//
//  Debug Settings
//
import debugSettings from '../debug/debugSettings'
//
//  Sub Components
//
import QuestionList from './Question/QuestionList'
import OwnerList from './Owner/OwnerList'
import WhoList from './Who/WhoList'
import UsersList from './Users/UsersList'
import LibraryList from './Library/LibraryList'
import OwnerGroupList from './OwnerGroup/OwnerGroupList'
import Group2List from './Group2/Group2List'
import Group3List from './Group3/Group3List'
//
// Debug Settings
//
const debugLog = debugSettings()
//
//  Global
//
let g_Page
//===================================================================================
function Control() {
  if (debugLog) console.log('Start Control')
  //.............................................................................
  //  Main Line
  //.............................................................................
  //
  //  Store
  //
  g_Page = JSON.parse(sessionStorage.getItem('Nav_Page_Current'))
  //
  //  Present the selected component
  //
  switch (g_Page) {
    case 'QuestionList':
      return <QuestionList />
    case 'OwnerList':
      return <OwnerList />
    case 'LibraryList':
      return <LibraryList />
    case 'WhoList':
      return <WhoList />
    case 'UsersList':
      return <UsersList />
    case 'OwnerGroupList':
      return <OwnerGroupList />
    case 'Group2List':
      return <Group2List />
    case 'Group3List':
      return <Group3List />
    default:
      return <QuestionList />
  }
}

export default Control
