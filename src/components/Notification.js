//
//  Libraries
//
import { Snackbar } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import { Alert } from '@mui/material'
//
//  Styles
//
const useStyles = makeStyles(theme => ({
  root: {
    top: theme.spacing(9)
  }
}))
//=====================================================================================
export default function Notification(props) {
  const { notify, setNotify } = props
  //
  //  Styles
  //
  const classes = useStyles()
  //
  //  Close
  //
  const handleClose = (event, reason) => {
    //
    //  If clickaway from notification, do not close the notification (therefore return)
    //
    if (reason === 'clickaway') {
      return
    }
    //
    //  Close notification
    //
    setNotify({
      ...notify,
      isOpen: false
    })
  }
  //
  //  Snackbar determines the location, duration, whether to show
  //  Alert sets the message displayed
  //
  return (
    <Snackbar
      className={classes.root}
      open={notify.isOpen}
      autoHideDuration={3000}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      onClose={handleClose}
    >
      <Alert severity={notify.severity} onClose={handleClose}>
        {notify.message}
      </Alert>
    </Snackbar>
  )
}
