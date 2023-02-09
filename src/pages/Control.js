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
import ReftypeList from './Reftype/ReftypeList'
import UsersList from './Users/UsersList'
import UsersownerList from './Usersowner/UsersownerList'
import LibraryList from './Library/LibraryList'
import OwnerGroupList from './OwnerGroup/OwnerGroupList'
//
// Debug Settings
//
const debugLog = debugSettings()
//===================================================================================
function Control({ handlePage, pageCurrent }) {
  if (debugLog) console.log('Start Control')
  //.............................................................................
  //  Main Line
  //.............................................................................
  //
  //  Store
  //
  const PageCurrent = JSON.parse(sessionStorage.getItem('Nav_Page_Current'))
  if (debugLog) console.log('PageCurrent ', PageCurrent)
  if (debugLog) console.log('pageCurrent ', pageCurrent)
  //
  //  Present the selected component
  //
  switch (PageCurrent) {
    case 'OwnerList':
      return <OwnerList handlePage={handlePage} />
    case 'OwnerGroupList':
      return <OwnerGroupList handlePage={handlePage} />
    case 'LibraryList':
      return <LibraryList handlePage={handlePage} />
    case 'QuestionList':
      return <QuestionList handlePage={handlePage} />
    case 'WhoList':
      return <WhoList handlePage={handlePage} />
    case 'ReftypeList':
      return <ReftypeList handlePage={handlePage} />
    case 'UsersList':
      return <UsersList handlePage={handlePage} />
    case 'UsersownerList':
      return <UsersownerList handlePage={handlePage} />
    default:
      return <OwnerList handlePage={handlePage} />
  }
}

export default Control
