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
import { useMyForm, MyForm } from '../../components/controls/useMyForm'
//
//  Form Initial Values
//
const initialFValues = {
  uouid: '',
  uouser: '',
  uoowner: ''
}
//=====================================================================================
export default function UsersownerEntry(props) {
  //...................................................................................
  //.  Main Line
  //...................................................................................
  const { addOrEdit, recordForEdit, serverMessage } = props
  //
  //  Get Store
  //
  const OptionsOwner = JSON.parse(sessionStorage.getItem('Data_Options_Owner'))
  //
  //  On change of record, set State
  //
  useEffect(() => {
    //
    //  Update form values
    //
    const s_id = recordForEdit.uouid
    const s_user = recordForEdit.uouser
    let s_owner = recordForEdit.uoowner
    if (!s_owner) s_owner = OptionsOwner[0].title
    setValues({
      ...values,
      uouid: s_id,
      uouser: s_user,
      uoowner: s_owner
    })
    // eslint-disable-next-line
  }, [recordForEdit])
  //
  //  Button Text
  //
  const submitButtonText = 'Add'
  //
  //  UseMyForm
  //
  const { values, setValues, errors, setErrors, handleInputChange, resetForm } = useMyForm(
    initialFValues,
    true,
    validate
  )
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
    if ('uouid' in fieldValues)
      errorsUpd.uouid = fieldValues.uouid === '' ? 'This field is required.' : ''
    if ('uouser' in fieldValues)
      errorsUpd.uouser = fieldValues.uouser === '' ? 'This field is required.' : ''
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
            <MyInput
              name='uouid'
              label='Id'
              value={values.uouid}
              onChange={handleInputChange}
              error={errors.uouid}
              disabled={true}
            />
          </Grid>
          {/*------------------------------------------------------------------------------ */}
          <Grid item xs={12}>
            <MyInput
              name='uouser'
              label='User'
              value={values.uouser}
              onChange={handleInputChange}
              error={errors.uouser}
              disabled={true}
            />
          </Grid>
          {/*------------------------------------------------------------------------------ */}
          <Grid item xs={12}>
            <MySelect
              key={OptionsOwner.id}
              name='uoowner'
              label='Owner'
              value={values.uoowner}
              onChange={handleInputChange}
              error={errors.uoowner}
              options={OptionsOwner}
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
