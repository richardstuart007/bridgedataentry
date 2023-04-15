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
  lrlid: 0,
  lrowner: '',
  lrgroup: '',
  lrref: '',
  lrdesc: '',
  lrlink: '',
  lrwho: '',
  lrtype: ''
}
//
//  Global Variable
//
let actionUpdate = false
let disableOwner
let disableGroup
//...................................................................................
//.  Main Line
//...................................................................................
export default function LibraryEntry(props) {
  const { addOrEdit, recordForEdit, serverMessage, s_owner, s_group } = props
  //
  //  Define the Store
  //
  const OptionsWho = JSON.parse(sessionStorage.getItem('Data_Options_Who'))
  const OptionsReftype = JSON.parse(sessionStorage.getItem('Data_Options_Reftype'))
  const OptionsOwner = JSON.parse(sessionStorage.getItem('Data_Options_Owner'))
  const OptionsOwnerGroup = JSON.parse(sessionStorage.getItem('Data_Options_OwnerGroup'))
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
    } else if (s_owner || s_group) {
      setValues({
        ...values,
        lrowner: s_owner,
        lrgroup: s_group
      })
    }
    // eslint-disable-next-line
  }, [recordForEdit])
  //
  //  Disable/Allow entry
  //
  recordForEdit === null ? (actionUpdate = false) : (actionUpdate = true)
  disableOwner = actionUpdate
  if (s_owner) disableOwner = true
  disableGroup = actionUpdate
  if (s_group) disableGroup = true
  //
  //  Button Text
  //
  let submitButtonText
  actionUpdate ? (submitButtonText = 'Update') : (submitButtonText = 'Add')
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
    if ('lrref' in fieldValues)
      errorsUpd.lrref = fieldValues.lrref === '' ? 'This field is required.' : ''
    if ('lrowner' in fieldValues)
      errorsUpd.lrowner = fieldValues.lrowner === '' ? 'This field is required.' : ''
    if ('lrgroup' in fieldValues)
      errorsUpd.lrgroup = fieldValues.lrgroup === '' ? 'This field is required.' : ''
    if ('lrdesc' in fieldValues)
      errorsUpd.lrdesc = fieldValues.lrdesc === '' ? 'This field is required.' : ''
    if ('lrlink' in fieldValues)
      errorsUpd.lrlink = fieldValues.lrlink === '' ? 'This field is required.' : ''
    if ('lrtype' in fieldValues)
      errorsUpd.lrtype = fieldValues.lrtype === '' ? 'This field is required.' : ''
    if ('lrwho' in fieldValues)
      errorsUpd.lrwho = fieldValues.lrwho === '' ? 'This field is required.' : ''
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
  //.  Render the form
  //...................................................................................
  return (
    <>
      <MyForm onSubmit={handleSubmit}>
        <Grid container>
          {/*------------------------------------------------------------------------------ */}

          <Grid item xs={6}>
            <MySelect
              key={OptionsOwner.id}
              name='lrowner'
              label='Owner'
              value={values.lrowner}
              onChange={handleInputChange}
              error={errors.lrowner}
              options={OptionsOwner}
              disabled={disableOwner}
            />
          </Grid>

          <Grid item xs={6}>
            <MySelect
              key={OptionsOwnerGroup.id}
              name='lrgroup'
              label='Group'
              value={values.lrgroup}
              onChange={handleInputChange}
              error={errors.lrgroup}
              options={OptionsOwnerGroup}
              disabled={disableGroup}
            />
          </Grid>

          {/*------------------------------------------------------------------------------ */}
          <Grid item xs={6}>
            <MyInput
              name='lrref'
              label='Reference'
              value={values.lrref}
              onChange={handleInputChange}
              error={errors.lrref}
              disabled={actionUpdate}
            />
          </Grid>

          {actionUpdate ? (
            <Grid item xs={4}>
              <MyInput name='lrlid' label='ID' value={values.lrlid} disabled={true} />
            </Grid>
          ) : null}
          <Grid item xs={2}></Grid>
          {/*------------------------------------------------------------------------------ */}
          <Grid item xs={12}>
            <MyInput
              name='lrdesc'
              label='Description'
              value={values.lrdesc}
              onChange={handleInputChange}
              error={errors.lrdesc}
            />
          </Grid>
          {/*------------------------------------------------------------------------------ */}
          <Grid item xs={12}>
            <MyInput
              name='lrlink'
              label='Link'
              value={values.lrlink}
              onChange={handleInputChange}
              error={errors.lrlink}
            />
          </Grid>
          {/*------------------------------------------------------------------------------ */}
          <Grid item xs={6}>
            <MySelect
              key={OptionsWho.id}
              name='lrwho'
              label='Who'
              value={values.lrwho}
              onChange={handleInputChange}
              error={errors.lrwho}
              options={OptionsWho}
            />
          </Grid>

          <Grid item xs={4}>
            <MySelect
              key={OptionsReftype.id}
              name='lrtype'
              label='Type'
              value={values.lrtype}
              onChange={handleInputChange}
              error={errors.lrtype}
              options={OptionsReftype}
            />
          </Grid>
          <Grid item xs={2}></Grid>
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
