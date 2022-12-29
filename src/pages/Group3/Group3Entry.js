//
//  Libraries
//
import { useEffect } from 'react'
import { Grid, Typography } from '@mui/material'
//
//  Debug Settings
//
import debugSettings from '../../debug/debugSettings'
//
//  Controls
//
import MyButton from '../../components/controls/MyButton'
import MyInput from '../../components/controls/MyInput'
import { useMyForm, MyForm } from '../../components/useMyForm'
//
//  Form Initial Values
//
const initialFValues = {
  g3id: '',
  g3title: ''
}
//
//  Global Variable
//
let actionUpdate
//
// Debug Settings
//
const debugLog = debugSettings()
const debugFunStart = false
const debugModule = 'Group3Entry'
//=====================================================================================
export default function Group3Entry(props) {
  const { addOrEdit, recordForEdit, serverMessage } = props
  if (debugFunStart) console.log(debugModule)
  if (debugLog) console.log('props ', props)
  //...................................................................................
  //
  // Validate the fields
  //
  const validate = (fieldValues = values) => {
    if (debugFunStart) console.log('validate')
    if (debugLog) console.log(fieldValues)
    //
    //  Load previous errors
    //
    let errorsUpd = { ...errors }
    //
    //  Validate current field
    //
    if ('g3id' in fieldValues)
      errorsUpd.g3id = fieldValues.g3id === '' ? 'This field is required.' : ''
    if ('g3title' in fieldValues)
      errorsUpd.g3title = fieldValues.g3title === '' ? 'This field is required.' : ''
    //
    //  Set the errors
    //
    setErrors({
      ...errorsUpd
    })
    //
    //  Check if every element within the errorsUpd object is blank, then return true (valid), but only on submit when the fieldValues=values
    //
    if (fieldValues === values) {
      return Object.values(errorsUpd).every(x => x === '')
    }
  }
  //...................................................................................
  //
  //  UseMyForm
  //
  const { values, setValues, errors, setErrors, handleInputChange, resetForm } = useMyForm(
    initialFValues,
    true,
    validate
  )
  //...................................................................................
  //.  Submit form
  //...................................................................................
  const handleSubmit = e => {
    if (debugFunStart) console.log('handleSubmit')
    e.preventDefault()
    //
    //  Validate & Update
    //
    if (validate()) {
      if (debugLog) console.log('values ', values)
      const { ...UpdateValues } = { ...values }
      if (debugLog) console.log('UpdateValues ', UpdateValues)
      //
      //  Update database
      //
      if (debugLog) console.log('UpdateValues ', UpdateValues)
      addOrEdit(UpdateValues, resetForm)
    }
  }
  //...................................................................................
  //.  Main Line
  //...................................................................................

  if (debugFunStart) console.log(debugModule)
  //
  //  On change of record, set State
  //
  useEffect(() => {
    if (debugLog) console.log('useEffect')
    if (debugLog) console.log('recordForEdit ', recordForEdit)
    //
    //  Update form values
    //
    if (recordForEdit) {
      setValues({
        ...recordForEdit
      })
    }
    // eslint-disable-next-line
  }, [recordForEdit])
  //
  //  Disable/Allow entry
  //
  recordForEdit === null ? (actionUpdate = false) : (actionUpdate = true)
  if (debugLog) console.log('actionUpdate', actionUpdate)
  //
  //  Button Text
  //
  let submitButtonText
  actionUpdate ? (submitButtonText = 'Update') : (submitButtonText = 'Add')
  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <>
      <MyForm onSubmit={handleSubmit}>
        <Grid container>
          {/*------------------------------------------------------------------------------ */}

          <Grid item xs={12}>
            <MyInput
              name='g3id'
              label='Group3'
              value={values.g3id}
              onChange={handleInputChange}
              error={errors.g3id}
              disabled={actionUpdate}
            />
          </Grid>

          {/*------------------------------------------------------------------------------ */}
          <Grid item xs={12}>
            <MyInput
              name='g3title'
              label='Title'
              value={values.g3title}
              onChange={handleInputChange}
              error={errors.g3title}
            />
          </Grid>
          {/*.................................................................................................*/}
          <Grid item xs={12}>
            <Typography style={{ color: 'red' }}>{serverMessage}</Typography>
          </Grid>
          {/*------------------------------------------------------------------------------ */}
          <Grid item xs={2}>
            <MyButton type='submit' text={submitButtonText} />
          </Grid>
          {/*------------------------------------------------------------------------------ */}
        </Grid>
      </MyForm>
    </>
  )
}
