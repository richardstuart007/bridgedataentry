//
//  Libraries
//
import { TextField } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
//
//  Styles
//
const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: 'azure'
  }
}))
//=====================================================================================
export default function MyInput(props) {
  //
  //  Deconstruct
  //
  const { name, label, value, className, error = null, onChange, ...other } = props
  //
  //  Styles
  //
  const classes = useStyles()
  //
  //  Classes
  //
  let classNames = classes.root
  if (className) classNames = classNames + ` ${className}`

  return (
    <TextField
      className={classNames}
      variant='outlined'
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      {...other}
      {...(error && { error: true, helperText: error })}
    />
  )
}
