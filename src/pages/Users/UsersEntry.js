//
//  Libraries
//
import { useEffect } from 'react'
import { Grid, Box, Typography } from '@mui/material'
//
//  Debug Settings
//
import debugSettings from '../../debug/debugSettings'
//
//  Controls
//
import MyButton from '../../components/controls/MyButton'
import MyInput from '../../components/controls/MyInput'
import MyCheckbox from '../../components/controls/MyCheckbox'
import MySelect from '../../components/controls/MySelect'
import { useMyForm, MyForm } from '../../components/useMyForm'
import SelectCountry from './SelectCountry'
//
//  Form Initial Values
//
const initialFValues = {
  u_email: '',
  u_name: '',
  u_admin: false,
  u_showprogress: true,
  u_showscore: true,
  u_sortquestions: true,
  u_skipcorrect: true,
  u_dftmaxquestions: 5,
  u_dftowner: '',
  u_fedcountry: '',
  u_fedid: ''
}
//
//  Global Variable
//
let actionUpdate = true
//
// Debug Settings
//
const debugLog = debugSettings()
const debugFunStart = false
const debugModule = 'UsersEntry'
//...................................................................................
//.  Main Line
//...................................................................................
export default function UsersEntry(props) {
  if (debugFunStart) console.log(debugModule)
  //
  //  Deconstruct props
  //
  const { addOrEdit, recordForEdit, serverMessage } = props
  if (debugLog) console.log('props ', props)
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
  //  Button Text
  //
  let submitButtonText = 'Update'
  //
  //  Get Store
  //
  const OptionsOwner = JSON.parse(sessionStorage.getItem('Data_Options_Owner'))
  //
  //  UseMyForm
  //
  initialFValues.u_fedcountry = recordForEdit.u_fedcountry
  const { values, setValues, errors, setErrors, handleInputChange, resetForm } = useMyForm(
    initialFValues,
    true,
    validate
  )
  if (debugLog) console.log('values ', values)
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
    if ('u_email' in fieldValues)
      errorsUpd.u_email = fieldValues.u_email === '' ? 'This field is required.' : ''
    if ('u_name' in fieldValues)
      errorsUpd.u_name = fieldValues.u_name === '' ? 'This field is required.' : ''
    //
    //  MaxQuestions
    //
    if ('u_dftmaxquestions' in fieldValues)
      errorsUpd.u_dftmaxquestions =
        parseInt(fieldValues.u_dftmaxquestions) > 0 && parseInt(fieldValues.u_dftmaxquestions) <= 50
          ? ''
          : `You must select between 1 and 50.`
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
  function handleSubmit(e) {
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
  //.  Debug
  //...................................................................................
  function handleSelectCountry(CountryCode) {
    if (debugLog) console.log('handleSelectCountry')
    if (debugLog) console.log('CountryCode ', CountryCode)
    //
    //  Populate Country Object & change country code
    //
    const updValues = { ...values }
    updValues.u_fedcountry = CountryCode
    if (debugLog) console.log('updValues ', updValues)
    //
    //  Update values
    //
    setValues(updValues)
  }
  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <>
      <MyForm onSubmit={handleSubmit}>
        <Grid container>
          {/*------------------------------------------------------------------------------ */}
          <Grid item xs={6}>
            <MyInput
              name='u_id'
              label='ID'
              value={values.u_id}
              onChange={handleInputChange}
              error={errors.u_id}
              disabled={actionUpdate}
            />
          </Grid>
          <Grid item xs={6}>
            <MyInput
              name='u_user'
              label='User'
              value={values.u_user}
              onChange={handleInputChange}
              error={errors.u_user}
              disabled={actionUpdate}
            />
          </Grid>
          {/*------------------------------------------------------------------------------ */}
          <Grid item xs={6}>
            <MyInput
              name='u_name'
              label='Name'
              value={values.u_name}
              onChange={handleInputChange}
              error={errors.u_name}
            />
          </Grid>
          <Grid item xs={6}>
            <MyInput
              name='u_email'
              label='Email'
              value={values.u_email}
              onChange={handleInputChange}
              error={errors.u_email}
            />
          </Grid>
          {/*------------------------------------------------------------------------------ */}
          <Grid item xs={6}>
            <SelectCountry
              label='Bridge Federation Country1'
              onChange={handleSelectCountry}
              countryCode={values.u_fedcountry}
            />
          </Grid>

          <Grid item xs={6}>
            <Box sx={{ mt: 2, maxWidth: 200 }}>
              <MyInput
                name='u_fedid'
                label='Bridge Federation ID'
                value={values.u_fedid}
                onChange={handleInputChange}
                error={errors.u_fedid}
              />
            </Box>
          </Grid>
          {/*------------------------------------------------------------------------------ */}

          <Grid item xs={6}>
            <MyCheckbox
              name='u_admin'
              label='Administrator'
              value={values.u_admin}
              onChange={handleInputChange}
              error={errors.u_admin}
            />
          </Grid>
          <Grid item xs={6}></Grid>
          {/*------------------------------------------------------------------------------ */}
          <Grid item xs={6}>
            <MyCheckbox
              name='u_showprogress'
              label='Show Linear Progress'
              value={values.u_showprogress}
              onChange={handleInputChange}
              error={errors.u_showprogress}
            />
          </Grid>

          <Grid item xs={6}>
            <MyCheckbox
              name='u_showscore'
              label='Show Linear Score'
              value={values.u_showscore}
              onChange={handleInputChange}
              error={errors.u_showscore}
            />
          </Grid>
          {/*------------------------------------------------------------------------------ */}
          <Grid item xs={6}>
            <MyCheckbox
              name='u_sortquestions'
              label='Sort Questions'
              value={values.u_sortquestions}
              onChange={handleInputChange}
              error={errors.u_sortquestions}
            />
          </Grid>

          <Grid item xs={6}>
            <MyCheckbox
              name='u_skipcorrect'
              label='Skip Correct Answers'
              value={values.u_skipcorrect}
              onChange={handleInputChange}
              error={errors.u_skipcorrect}
            />
          </Grid>

          {/*------------------------------------------------------------------------------ */}
          <Grid item xs={3}>
            <Box sx={{ mt: 2, maxWidth: 200 }}>
              <MyInput
                name='u_dftmaxquestions'
                label='Default Maximum Questions'
                value={values.u_dftmaxquestions}
                onChange={handleInputChange}
                error={errors.u_dftmaxquestions}
              />
            </Box>
          </Grid>
          <Grid item xs={9}></Grid>
          {/*------------------------------------------------------------------------------ */}
          <Grid item xs={3}>
            <Box sx={{ mt: 2, maxWidth: 200 }}>
              <MySelect
                key={OptionsOwner.id}
                name='u_dftowner'
                label='Default Owner'
                value={values.u_dftowner}
                onChange={handleInputChange}
                error={errors.u_dftowner}
                options={OptionsOwner}
              />
            </Box>
          </Grid>
          <Grid item xs={9}></Grid>
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
