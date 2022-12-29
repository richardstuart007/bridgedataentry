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
//  Debug Settings
//
import debugSettings from '../../debug/debugSettings'
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
//
// Debug Settings
//
const debugLog = debugSettings()

//===================================================================================
export default function Navigation({ handlePage }) {
  const classes = useStyles()
  //
  //  Define the Store
  //
  const CurrentPage = JSON.parse(sessionStorage.getItem('Nav_Page_Current'))
  if (debugLog) console.log('CurrentPage', CurrentPage)
  //...................................................................................
  //.  Render the component
  //...................................................................................
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
        {CurrentPage !== 'QuestionList' ? (
          <MyActionButton
            startIcon={<QuizIcon fontSize='medium' />}
            variant='contained'
            color='warning'
            text='Questions'
            onClick={() => {
              handlePage('QuestionList')
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
        {CurrentPage !== 'Group2List' ? (
          <MyActionButton
            startIcon={<GroupIcon fontSize='medium' />}
            variant='contained'
            color='warning'
            text='Group2'
            onClick={() => {
              handlePage('Group2List')
            }}
          ></MyActionButton>
        ) : null}
        {/* .......................................................................................... */}
        {CurrentPage !== 'Group3List' ? (
          <MyActionButton
            startIcon={<GroupIcon fontSize='medium' />}
            variant='contained'
            color='warning'
            text='Group3'
            onClick={() => {
              handlePage('Group3List')
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
              handlePage('LibraryList')
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
      </Grid>
    </div>
  )
}
