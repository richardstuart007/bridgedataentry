//
//  Libraries
//
import { Dialog, DialogTitle, DialogContent, Typography } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import CloseIcon from '@mui/icons-material/Close'
//
//  Controls
//
import MyActionButton from './controls/MyActionButton'
//
//  Styles
//
const useStyles = makeStyles(theme => ({
  dialogWrapper: {
    padding: theme.spacing(2),
    position: 'absolute',
    top: theme.spacing(0)
  },
  dialogTitle: {
    paddingRight: '0px'
  }
}))
//=====================================================================================
export default function Popup(props) {
  const { title, children, openPopup, setOpenPopup } = props
  const classes = useStyles()

  return (
    <Dialog open={openPopup} maxWidth='md' classes={{ paper: classes.dialogWrapper }}>
      <DialogTitle className={classes.dialogTitle}>
        <div style={{ display: 'flex' }}>
          <Typography variant='h6' component='div' style={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <MyActionButton
            startIcon={<CloseIcon fontSize='small' />}
            color='secondary'
            onClick={() => {
              setOpenPopup(false)
            }}
          ></MyActionButton>
        </div>
      </DialogTitle>
      <DialogContent dividers>{children}</DialogContent>
    </Dialog>
  )
}
