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
//
// Debug Settings
//
const debugLog = debugSettings(true)
//
//  Global
//
let g_Page
//===================================================================================
function Control({ handlePage }) {
  if (debugLog) console.log('Start Control')
  //.............................................................................
  //  Main Line
  //.............................................................................
  //
  //  Store
  //
  g_Page = JSON.parse(sessionStorage.getItem('Nav_Page_Current'))
  if (debugLog) console.log('g_Page ', g_Page)
  //
  //  Present the selected component
  //
  switch (g_Page) {
    case 'OwnerList':
      return <OwnerList handlePage={handlePage} />
    case 'OwnerGroupList':
      return <OwnerGroupList handlePage={handlePage} />
    case 'LibraryList':
      return <LibraryList handlePage={handlePage} />
    case 'QuestionList':
      return <QuestionList />
    case 'WhoList':
      return <WhoList />
    case 'UsersList':
      return <UsersList />
    default:
      return <OwnerList handlePage={handlePage} />
  }
}

export default Control
