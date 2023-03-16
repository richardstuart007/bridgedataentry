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
let disableOwner
//...................................................................................
//.  Main Line
//...................................................................................
export default function OwnerGroupEntry(props) {
  const { addOrEdit, recordForEdit, serverMessage, s_owner } = props
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
    //
    //  Update form values
    //
    if (recordForEdit) {
      setValues({
        ...recordForEdit
      })
    } else if (s_owner) {
      setValues({
        ...values,
        ogowner: s_owner
      })
    }
    // eslint-disable-next-line
  }, [recordForEdit])
  //
  //  Disable/Allow entry
  //
  recordForEdit === null ? (actionUpdate = false) : (actionUpdate = true)
  //
  //  Owner entry allowed ?
  //
  disableOwner = actionUpdate
  if (s_owner) disableOwner = true
  //
  //  Button Text
  //
  let submitButtonText
  actionUpdate ? (submitButtonText = 'Update') : (submitButtonText = 'Add')
  //...................................................................................
  // Validate the fields
  //...................................................................................
  function validate(fieldValues = values) {
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
              disabled={disableOwner}
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
