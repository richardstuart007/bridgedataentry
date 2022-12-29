//
//  Libraries
//
import { Button } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
//
//  Styles
//
const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0.5),
    textTransform: 'none'
  }
}))
//=====================================================================================
export default function MyButton(props) {
  const { text, size, color, variant, onClick, ...other } = props
  const classes = useStyles()

  return (
    <Button
      variant={variant || 'contained'}
      size={size || 'small'}
      color={color || 'primary'}
      onClick={onClick}
      {...other}
      classes={{ root: classes.root }}
    >
      {text}
    </Button>
  )
}
