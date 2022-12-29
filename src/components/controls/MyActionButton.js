//
//  Libraries
//
import makeStyles from '@mui/styles/makeStyles'
//
//  Sub Components
//
import MyButton from './MyButton'
//
//  Styles
//
const useStyles = makeStyles(theme => ({
  root: {
    minWidth: 0,
    margin: theme.spacing(0.5)
  },
  secondary: {
    backgroundColor: theme.palette.secondary.dark,
    '& .MuiButton-label': {
      color: theme.palette.secondary.main
    }
  },
  primary: {
    backgroundColor: theme.palette.primary.dark,
    '& .MuiButton-label': {
      color: theme.palette.primary.main
    }
  },
  warning: {
    backgroundColor: theme.palette.warning.dark,
    color: theme.palette.secondary.dark,
    '& .MuiButton-label': {
      color: theme.palette.warning.main
    }
  }
}))
//=====================================================================================
export default function MyActionButton(props) {
  const { color, children, onClick, ...other } = props
  const classes = useStyles()
  return (
    <MyButton
      className={`${classes.root} ${classes[color]}`}
      sx={{
        ':hover': {
          bgcolor: 'yellow'
        }
      }}
      onClick={onClick}
      {...other}
    >
      {children}
    </MyButton>
  )
}
