//
//  Libraries
//
import { Typography, AppBar, Toolbar, Avatar, Grid } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
//
//  Styles
//
const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: 'green'
  },
  title: {
    marginLeft: theme.spacing(2)
  },
  avatar: {
    marginLeft: theme.spacing(2)
  }
}))
//=====================================================================================
export default function Header() {
  const classes = useStyles()

  return (
    <AppBar position='static' className={classes.root}>
      <Toolbar>
        <Grid container alignItems='center'>
          <Grid item>
            <Avatar className={classes.avatar} src='./cards.svg' />
          </Grid>
          <Grid item>
            <Typography className={classes.title}> MAINTENANCE</Typography>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  )
}
