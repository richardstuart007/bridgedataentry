//
//  Libraries
//
import { useEffect } from 'react'
import { Grid, Typography } from '@mui/material'
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
  rttype: '',
  rttitle: ''
}
//
//  Global Variable
//
let actionUpdate = false
//=====================================================================================
export default function ReftypeEntry(props) {
  const { addOrEdit, recordForEdit, serverMessage } = props
  //...................................................................................
  //
  // Validate the fields
  //
  const validate = (fieldValues = values) => {
    //
    //  Load previous errors
    //
    let errorsUpd = { ...errors }
    //
    //  Validate current field
    //
    if ('rttype' in fieldValues)
      errorsUpd.rttype = fieldValues.rttype === '' ? 'This field is required.' : ''
    if ('rttitle' in fieldValues)
      errorsUpd.rttitle = fieldValues.rttitle === '' ? 'This field is required.' : ''
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
    e.preventDefault()
    //
    //  Validate & Update
    //
    if (validate()) {
      const { ...UpdateValues } = { ...values }
      //
      //  Update database
      //
      addOrEdit(UpdateValues, resetForm)
    }
  }
  //...................................................................................
  //.  Main Line
  //...................................................................................
  //
  //  On change of record, set State
  //
  useEffect(() => {
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
              name='rttype'
              label='Type'
              value={values.rttype}
              onChange={handleInputChange}
              error={errors.rttype}
              disabled={actionUpdate}
            />
          </Grid>

          {/*------------------------------------------------------------------------------ */}
          <Grid item xs={12}>
            <MyInput
              name='rttitle'
              label='Title'
              value={values.rttitle}
              onChange={handleInputChange}
              error={errors.rttitle}
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
