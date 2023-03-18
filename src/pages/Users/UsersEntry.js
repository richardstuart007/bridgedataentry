//
//  Libraries
//
import { useEffect } from 'react'
import { Grid, Box, Typography } from '@mui/material'
//
//  Controls
//
import MyButton from '../../components/controls/MyButton'
import MyInput from '../../components/controls/MyInput'
import MyCheckbox from '../../components/controls/MyCheckbox'
import { useMyForm, MyForm } from '../../components/controls/useMyForm'
import SelectCountry from './SelectCountry'
//
//  Form Initial Values
//
const initialFValues = {
  u_email: '',
  u_name: '',
  u_admin: false,
  u_dev: false,
  u_showprogress: true,
  u_showscore: true,
  u_sortquestions: true,
  u_skipcorrect: true,
  u_dftmaxquestions: 5,
  u_fedcountry: '',
  u_fedid: ''
}
//...................................................................................
//.  Main Line
//...................................................................................
export default function UsersEntry(props) {
  //
  //  Deconstruct props
  //
  const { addOrEdit, recordForEdit, serverMessage } = props
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
  //  Button Text
  //
  let submitButtonText = 'Update'
  //
  //  UseMyForm
  //
  initialFValues.u_fedcountry = recordForEdit.u_fedcountry
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
  //.  Select Country
  //...................................................................................
  function handleSelectCountry(CountryCode) {
    //
    //  Populate Country Object & change country code
    //
    const updValues = { ...values }
    updValues.u_fedcountry = CountryCode
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
          <Grid item xs={6}>
            <Box sx={{ mr: 2 }}>
              <MyInput
                name='u_name'
                label='Name'
                value={values.u_name}
                onChange={handleInputChange}
                error={errors.u_name}
              />
            </Box>
          </Grid>
          <Grid item xs={6}></Grid>
          {/*------------------------------------------------------------------------------ */}
          <Grid item xs={6}>
            <Box sx={{ mr: 2 }}>
              <MyInput
                name='u_email'
                label='Email'
                value={values.u_email}
                onChange={handleInputChange}
                error={errors.u_email}
              />
            </Box>
          </Grid>
          <Grid item xs={6}></Grid>
          {/*------------------------------------------------------------------------------ */}
          <Grid item xs={6}>
            <Box sx={{ mr: 2 }}>
              <SelectCountry
                label='Bridge Federation Country'
                onChange={handleSelectCountry}
                countryCode={values.u_fedcountry}
              />
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Box sx={{ maxWidth: 200 }}>
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
          <Grid item xs={6}>
            <MyCheckbox
              name='u_dev'
              label='Developer'
              value={values.u_dev}
              onChange={handleInputChange}
              error={errors.u_dev}
            />
          </Grid>
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
