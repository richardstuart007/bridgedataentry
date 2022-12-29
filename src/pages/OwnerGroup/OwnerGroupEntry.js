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
import MySelect from '../../components/controls/MySelect'
import { useMyForm, MyForm } from '../../components/useMyForm'
//
//  Form Initial Values
//
const initialFValues = {
  ogowner: '',
  oggroup: '',
  ogtitle: ''
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
const debugModule = 'OwnerGroupEntry'
//...................................................................................
//.  Main Line
//...................................................................................
export default function OwnerGroupEntry(props) {
  if (debugFunStart) console.log(debugModule)
  if (debugFunStart) console.log(debugModule)
  if (debugLog) console.log('props ', props)

  const { addOrEdit, recordForEdit, serverMessage } = props
  //
  //  UseMyForm
  //
  const { values, setValues, errors, setErrors, handleInputChange, resetForm } = useMyForm(
    initialFValues,
    true,
    validate
  )
  //
  //  Define the Store
  //
  const Data_Options_Owner = JSON.parse(sessionStorage.getItem('Data_Options_Owner'))
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
  // Validate the fields
  //...................................................................................
  function validate(fieldValues = values) {
    if (debugFunStart) console.log('validate')
    if (debugLog) console.log(fieldValues)
    //
    //  Load previous errors
    //
    let errorsUpd = { ...errors }
    //
    //  Validate current field
    //
    if ('ogowner' in fieldValues)
      errorsUpd.ogowner = fieldValues.ogowner === '' ? 'This field is required.' : ''
    if ('oggroup' in fieldValues)
      errorsUpd.oggroup = fieldValues.oggroup === '' ? 'This field is required.' : ''
    if ('ogtitle' in fieldValues)
      errorsUpd.ogtitle = fieldValues.ogtitle === '' ? 'This field is required.' : ''
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
  //.  Render the form
  //...................................................................................
  return (
    <>
      <MyForm onSubmit={handleSubmit}>
        <Grid container>
          {/*------------------------------------------------------------------------------ */}
          <Grid item xs={12}>
            <MySelect
              key={Data_Options_Owner.id}
              name='ogowner'
              label='Owner'
              value={values.ogowner}
              onChange={handleInputChange}
              error={errors.ogowner}
              disabled={actionUpdate}
              options={Data_Options_Owner}
            />
          </Grid>
          {/*------------------------------------------------------------------------------ */}
          <Grid item xs={12}>
            <MyInput
              name='oggroup'
              label='Group'
              value={values.oggroup}
              onChange={handleInputChange}
              error={errors.oggroup}
              disabled={actionUpdate}
            />
          </Grid>
          {/*------------------------------------------------------------------------------ */}
          <Grid item xs={12}>
            <MyInput
              name='ogtitle'
              label='Title'
              value={values.ogtitle}
              onChange={handleInputChange}
              error={errors.ogtitle}
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
