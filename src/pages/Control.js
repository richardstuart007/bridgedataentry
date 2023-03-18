//
//  Sub Components
//
import Splash from './Splash/Splash'
import QuestionList from './Question/QuestionList'
import OwnerList from './Owner/OwnerList'
import WhoList from './Who/WhoList'
import ReftypeList from './Reftype/ReftypeList'
import UsersList from './Users/UsersList'
import UsersownerList from './Usersowner/UsersownerList'
import LibraryList from './Library/LibraryList'
import OwnerGroupList from './OwnerGroup/OwnerGroupList'
import Register from './Register/Register'
//===================================================================================
function Control({ handlePage, pageCurrent }) {
  //.............................................................................
  //  Main Line
  //.............................................................................
  //
  //  Store
  //
  const PageCurrent = JSON.parse(sessionStorage.getItem('Nav_Current'))
  //
  //  Present the selected component
  //
  switch (PageCurrent) {
    case 'Splash':
      return <Splash handlePage={handlePage} />
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
    case 'Register':
      return <Register handlePage={handlePage} />
    default:
      return <OwnerList handlePage={handlePage} />
  }
}

export default Control
