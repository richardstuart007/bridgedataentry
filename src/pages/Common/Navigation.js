//
//  Libraries
//
import { Grid } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
//
//  Icons
//
import PersonIcon from '@mui/icons-material/Person'
import QuizIcon from '@mui/icons-material/Quiz'
import GroupIcon from '@mui/icons-material/Group'
//
//  Components
//
import MyActionButton from '../../components/controls/MyActionButton'
//
//  Style overrides
//
const useStyles = makeStyles(theme => {
  return {
    root: {
      display: 'flex'
    }
  }
})
//===================================================================================
export default function Navigation({ handlePage }) {
  const classes = useStyles()
  //
  //  Define the Store
  //
  const CurrentPage = JSON.parse(sessionStorage.getItem('Nav_Current'))
  //...................................................................................
  //.  Render the component
  //...................................................................................
  if (CurrentPage === 'Splash') return null
  return (
    <div className={classes.root}>
      <Grid container alignItems='center'>
        {/* .......................................................................................... */}
        {CurrentPage !== 'OwnerList' ? (
          <MyActionButton
            startIcon={<PersonIcon fontSize='medium' />}
            variant='contained'
            color='warning'
            text='Owners'
            onClick={() => {
              handlePage('OwnerList')
            }}
          ></MyActionButton>
        ) : null}

        {/* .......................................................................................... */}

        {CurrentPage !== 'OwnerGroupList' ? (
          <MyActionButton
            startIcon={<GroupIcon fontSize='medium' />}
            variant='contained'
            color='warning'
            text='OwnerGroup'
            onClick={() => {
              handlePage('OwnerGroupList')
            }}
          ></MyActionButton>
        ) : null}
        {/* .......................................................................................... */}
        {CurrentPage !== 'LibraryList' ? (
          <MyActionButton
            startIcon={<QuizIcon fontSize='medium' />}
            variant='contained'
            color='warning'
            text='Library'
            onClick={() => {
              sessionStorage.setItem('Selection_Owner', null)
              sessionStorage.setItem('Selection_OwnerGroup', null)
              handlePage('LibraryList')
            }}
          ></MyActionButton>
        ) : null}
        {/* .......................................................................................... */}
        {CurrentPage !== 'QuestionList' ? (
          <MyActionButton
            startIcon={<QuizIcon fontSize='medium' />}
            variant='contained'
            color='warning'
            text='Questions'
            onClick={() => {
              sessionStorage.setItem('Selection_Owner', null)
              sessionStorage.setItem('Selection_OwnerGroup', null)
              handlePage('QuestionList')
            }}
          ></MyActionButton>
        ) : null}
        {/* .......................................................................................... */}
        {CurrentPage !== 'WhoList' ? (
          <MyActionButton
            startIcon={<PersonIcon fontSize='medium' />}
            variant='contained'
            text='Who'
            color='warning'
            onClick={() => {
              handlePage('WhoList')
            }}
          ></MyActionButton>
        ) : null}
        {/* .......................................................................................... */}
        {CurrentPage !== 'ReftypeList' ? (
          <MyActionButton
            startIcon={<PersonIcon fontSize='medium' />}
            variant='contained'
            text='Reftype'
            color='warning'
            onClick={() => {
              handlePage('ReftypeList')
            }}
          ></MyActionButton>
        ) : null}
        {/* .......................................................................................... */}
        {CurrentPage !== 'UsersList' ? (
          <MyActionButton
            startIcon={<PersonIcon fontSize='medium' />}
            variant='contained'
            text='Users'
            color='warning'
            onClick={() => {
              handlePage('UsersList')
            }}
          ></MyActionButton>
        ) : null}
        {/* .......................................................................................... */}
        {CurrentPage !== 'UsersownerList' ? (
          <MyActionButton
            startIcon={<PersonIcon fontSize='medium' />}
            variant='contained'
            text='Usersowner'
            color='warning'
            onClick={() => {
              sessionStorage.setItem('Selection_UserId', null)
              sessionStorage.setItem('Selection_User', null)
              handlePage('UsersownerList')
            }}
          ></MyActionButton>
        ) : null}
        {/* .......................................................................................... */}
      </Grid>
    </div>
  )
}
