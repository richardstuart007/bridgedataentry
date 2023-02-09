//
//  Libraries
//
import { Typography, AppBar, Toolbar, Avatar, Grid, CardMedia } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
//
//  Common Sub Components
//
import Navigation from '../../pages/Common/Navigation'
//
//  Debug Settings
//
import debugSettings from '../../debug/debugSettings'
//
//  Components
//
import cards from '../../assets/images/cards.svg'
import Ukraine from '../../assets/images/Ukraine.svg'
//
//  Style overrides
//
const useStyles = makeStyles(theme => {
  return {
    page: {
      background: 'whitesmoke',
      width: '100%',
      padding: theme.spacing(1)
    },
    root: {
      display: 'flex'
    },
    title: {
      marginLeft: theme.spacing(2)
    },
    clientserver: {
      marginLeft: theme.spacing(2)
    },
    appBar: {
      background: 'green',
      width: '100%'
    },
    toolbar: theme.mixins.toolbar,
    avatar: {
      marginLeft: theme.spacing(2)
    }
  }
})
//
// Debug Settings
//
const debugLog = debugSettings()
//===================================================================================
export default function Layout({ handlePage, pageCurrent, children }) {
  if (debugLog) console.log('Start Layout')
  //
  //  Style overrides
  //
  const classes = useStyles()
  //
  //  Screen Width
  //
  const ScreenSmall = JSON.parse(sessionStorage.getItem('App_Settings_ScreenSmall'))
  //
  //  Title
  //
  let title
  if (debugLog) console.log('pageCurrent ', pageCurrent)
  switch (pageCurrent) {
    case 'QuestionList':
      title = 'Questions'
      break
    case 'OwnerList':
      title = 'Owner'
      break
    default:
      title = pageCurrent
      break
  }
  //
  //  Add clientserver
  //
  const App_Settings_Server = JSON.parse(sessionStorage.getItem('App_Settings_Server'))
  const App_Settings_Database = JSON.parse(sessionStorage.getItem('App_Settings_Database'))
  const clientserver = `Server(${App_Settings_Server}) Database(${App_Settings_Database})`
  //...................................................................................
  //.  Render the component
  //...................................................................................
  return (
    <div className={classes.root}>
      {/* .......................................................................................... */}
      {/* app bar                                         */}
      {/* .......................................................................................... */}
      <AppBar position='fixed' className={classes.appBar} elevation={0} color='primary'>
        <Toolbar>
          <Grid container alignItems='center'>
            {/* .......................................................................................... */}
            <Grid item>
              <Avatar className={classes.avatar} src={cards} />
            </Grid>
            {/* .......................................................................................... */}
            <Grid item>
              <Typography className={classes.title}>{title}</Typography>
            </Grid>
            {/* .......................................................................................... */}
            <Grid item>
              <Typography
                className={classes.clientserver}
                sx={{ display: { xs: 'none', sm: 'inline' } }}
              >
                {clientserver}
              </Typography>
            </Grid>
            {/* .......................................................................................... */}
            <Grid item xs></Grid>
            {/* .......................................................................................... */}
            <Grid>
              <CardMedia component='img' sx={{ width: 30, height: 30 }} image={Ukraine} alt='' />
            </Grid>
            {/* .......................................................................................... */}
            {!ScreenSmall && <Navigation handlePage={handlePage} />}
            {/* .......................................................................................... */}
          </Grid>
        </Toolbar>
      </AppBar>
      {/* .......................................................................................... */}
      {/* main content                          */}
      {/* .......................................................................................... */}
      <div className={classes.page}>
        <div className={classes.toolbar}></div>
        {ScreenSmall && <Navigation handlePage={handlePage} />}
        {children}
      </div>
    </div>
  )
}
