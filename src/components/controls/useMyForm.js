//
//  Libraries
//
import { useState } from 'react'
import makeStyles from '@mui/styles/makeStyles'
//=====================================================================================
//=  useMyForm
//=====================================================================================
export function useMyForm(initialFValues, validateOnChange = false, validate) {
  //
  //  State
  //
  const [values, setValues] = useState(initialFValues)
  const [errors, setErrors] = useState({})
  //...................................................................................
  //
  //  Handle change and Validate
  //
  const handleInputChange = e => {
    const { name, value } = e.target
    setValues({
      ...values,
      [name]: value
    })
    if (validateOnChange) validate({ [name]: value })
  }
  //...................................................................................
  //
  //  Reset the form to Initial Values
  //
  const resetForm = () => {
    setValues(initialFValues)
    setErrors({})
  }
  //...................................................................................
  //
  //  Return Values
  //
  return {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm
  }
}
//=====================================================================================
//=  MyForm
//=====================================================================================
//
//  Styles
//
const useStyles = makeStyles(theme => ({
  root: {
    '& .MuiFormControl-root': {
      width: '100%',
      margin: `${theme.spacing(2)} 0 0 ${theme.spacing(1)}`
    }
  }
}))
//
//  MyForm
//
export function MyForm(props) {
  const classes = useStyles()
  const { children, ...other } = props
  return (
    <form className={classes.root} autoComplete='off' {...other}>
      {props.children}
    </form>
  )
}
