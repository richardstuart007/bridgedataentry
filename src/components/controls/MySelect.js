//
//  Libraries
//
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material'
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
export default function MySelect(props) {
  //
  //  Deconstruct
  //
  const { name, label, value, className, error = null, onChange, options, ...other } = props
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
    <FormControl variant='outlined' {...(error && { error: true })} {...other}>
      <InputLabel>{label}</InputLabel>
      <Select
        className={classNames}
        label={label}
        name={name}
        value={value}
        onChange={onChange}
        {...other}
      >
        {options.map(item => (
          <MenuItem key={item.id} value={item.id}>
            {item.title}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  )
}
