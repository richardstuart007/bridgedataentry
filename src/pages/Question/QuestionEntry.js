//
//  Libraries
//
import { useEffect, useState } from 'react'
import { Grid, Typography } from '@mui/material'
//
//  Debug Settings
//
import debugSettings from '../../debug/debugSettings'
//
//  Pages
//
import HandEntry from './HandEntry'
import BiddingEntry from './BiddingEntry'
//
//  Controls
//
import MyButton from '../../components/controls/MyButton'
import MyInput from '../../components/controls/MyInput'
import MySelect from '../../components/controls/MySelect'
import { useMyForm, MyForm } from '../../components/useMyForm'
//
//  Components
//
import Popup from '../../components/Popup'
//
//  Form Initial Values
//
const initialFValues = {
  qid: 0,
  qowner: '',
  qkey: '',
  qdetail: '',
  qans1: '',
  qans2: '',
  qans3: '',
  qans4: '',
  qpoints1: 10,
  qpoints2: 0,
  qpoints3: 0,
  qpoints4: 0,
  qgroup: '',
  qgroup2: '',
  qgroup3: ''
}
let Data_Options_OwnerGroup_Subset = []
let ownerPrevious
//
// Debug Settings
//
const debugLog = debugSettings()
const debugFunStart = false
const debugModule = 'QuestionEntry'
//...................................................................................
//.  Main Line
//...................................................................................
export default function QuestionEntry(props) {
  const { addOrEdit, recordForEdit, serverMessage } = props
  if (debugFunStart) console.log(debugModule)
  if (debugLog) console.log('props ', props)
  //
  //  UseMyForm
  //
  const { values, setValues, errors, setErrors, handleInputChange, resetForm } = useMyForm(
    initialFValues,
    true,
    validate
  )
  //
  //  State
  //
  const [openPopupHand, setOpenPopupHand] = useState(false)
  const [openPopupBidding, setOpenPopupBidding] = useState(false)
  //
  //  Define the Store
  //
  const Data_Options_Owner = JSON.parse(sessionStorage.getItem('Data_Options_Owner'))
  const Data_Options_OwnerGroup = JSON.parse(sessionStorage.getItem('Data_Options_OwnerGroup'))
  const Data_Options_Group2 = JSON.parse(sessionStorage.getItem('Data_Options_Group2'))
  const Data_Options_Group3 = JSON.parse(sessionStorage.getItem('Data_Options_Group3'))
  //
  //  On change of record, set State
  //
  useEffect(() => {
    if (debugLog) console.log('useEffect')
    if (debugLog) console.log('recordForEdit ', recordForEdit)
    //
    //  Split arrays into fields
    //
    if (recordForEdit) recordForEdit_unpack()
    // eslint-disable-next-line
  }, [recordForEdit])
  if (debugLog) console.log('recordForEdit ', recordForEdit)
  //
  //  Disable entry of Owner/Key on update, allow for Entry
  //
  let actionUpdate = false
  if (values && values.qid !== 0) actionUpdate = true
  if (debugLog) console.log('values ', values)
  if (debugLog) console.log('actionUpdate input ', actionUpdate)
  //
  //  Button Text
  //
  let submitButtonText
  actionUpdate ? (submitButtonText = 'Update') : (submitButtonText = 'Add')
  //
  //  Set Group Options
  //
  if (actionUpdate) {
    if (ownerPrevious !== recordForEdit.qowner) {
      ownerPrevious = recordForEdit.qowner
      if (debugLog) console.log('Data_Options_OwnerGroup_Subset ', Data_Options_OwnerGroup_Subset)
      Data_Options_OwnerGroup_Subset = loadOwnerGroupSubset(
        true,
        recordForEdit.qowner,
        recordForEdit.qgroup
      )
    }
  }
  //.............................................................................
  //.  Unpack record for edit values
  //.............................................................................
  function recordForEdit_unpack() {
    let { qans, qpoints, ...inValues } = recordForEdit
    if (debugLog) console.log(qans, qpoints, inValues)
    //
    //  array: qans/qpoints
    //
    inValues.qans1 = qans[0]
    inValues.qpoints1 = qpoints[0]
    inValues.qans2 = qans[1]
    inValues.qpoints2 = qpoints[1]
    inValues.qans3 = ''
    inValues.qpoints3 = 0
    inValues.qans4 = ''
    inValues.qpoints4 = 0
    if (qans[2]) {
      inValues.qans3 = qans[2]
      inValues.qpoints3 = qpoints[2]
    }
    if (qans[3]) {
      inValues.qans4 = qans[3]
      inValues.qpoints4 = qpoints[3]
    }
    //
    //  Update form values
    //
    if (debugLog) console.log('inValues ', inValues)
    setValues({
      ...inValues
    })
  }
  //.............................................................................
  //.  Load Owner/Group Options
  //.............................................................................
  function loadOwnerGroupSubset(InitialLoad, owner, group) {
    if (debugFunStart) console.log('loadOwnerGroupSubset')
    if (debugLog) console.log('owner ', owner)
    if (debugLog) console.log('group ', group)
    if (debugLog) console.log('Data_Options_OwnerGroup ', Data_Options_OwnerGroup)
    //
    //  Select out Owner
    //
    let options = []
    Data_Options_OwnerGroup.forEach(item => {
      if (item.owner === owner) {
        const itemObj = {
          id: item.id,
          title: item.title
        }
        options.push(itemObj)
      }
    })
    //
    //  If current Group is not in valid value, force first
    //
    const valid = options.some(option => option['id'] === group)
    if (debugLog) console.log(`valid `, valid)
    if (!valid) {
      const firstOption = options[0]
      if (!InitialLoad) {
        setValues({
          ...values,
          qowner: owner,
          qgroup: firstOption.id
        })
        if (debugLog) console.log(`qgroup default to ${firstOption.id}`)
      }
    }
    //
    //  Save and return
    //
    sessionStorage.setItem('Data_Options_OwnerGroup_Subset', JSON.stringify(options))
    if (debugLog) console.log('Data_Options_OwnerGroup_Subset ', options)
    return options
  }
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
    if ('qowner' in fieldValues) {
      errorsUpd.qowner = fieldValues.qowner ? '' : 'This field is required.'
      if (debugLog) console.log('execute Data_Options_OwnerGroup_Subset ')
      Data_Options_OwnerGroup_Subset = loadOwnerGroupSubset(
        false,
        fieldValues.qowner,
        values.qgroup
      )
    }

    if ('qkey' in fieldValues) errorsUpd.qkey = fieldValues.qkey ? '' : 'This field is required.'

    if ('qdetail' in fieldValues)
      errorsUpd.qdetail = fieldValues.qdetail ? '' : 'This field is required.'

    if ('qans1' in fieldValues) errorsUpd.qans1 = fieldValues.qans1 ? '' : 'This field is required.'
    if ('qans2' in fieldValues) errorsUpd.qans2 = fieldValues.qans2 ? '' : 'This field is required.'

    if ('qgroup' in fieldValues)
      errorsUpd.qgroup = fieldValues.qgroup ? '' : 'This field is required.'
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
      const {
        qans1,
        qans2,
        qans3,
        qans4,
        qpoints1,
        qpoints2,
        qpoints3,
        qpoints4,
        ...UpdateValues
      } = { ...values }
      //
      //  Populate arrays: qans/qpoints
      //
      let qans = []
      let qpoints = []
      qans[0] = qans1
      qpoints[0] = qpoints1
      qans[1] = qans2
      qpoints[1] = qpoints2
      if (qans3 !== '') {
        qans[2] = qans3
        qpoints[2] = qpoints3
      }
      if (qans4 !== '') {
        qans[3] = qans4
        qpoints[3] = qpoints4
      }
      UpdateValues.qans = qans
      UpdateValues.qpoints = qpoints
      //
      //  Update database
      //
      addOrEdit(UpdateValues, resetForm)
    }
  }
  //...................................................................................
  //.  Copy Row
  //...................................................................................
  function handleCopy(e) {
    if (debugFunStart) console.log('handleCopy')
    e.preventDefault()
    //
    //  Reset the form in Add mode
    //
    let valuesUpd = { ...values }
    valuesUpd.qid = 0
    setValues({
      ...valuesUpd
    })
  }
  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <>
      <MyForm onSubmit={handleSubmit}>
        <Grid container>
          <Grid item xs={6}>
            <MySelect
              key={Data_Options_Owner.id}
              name='qowner'
              label='Owner'
              value={values.qowner}
              onChange={handleInputChange}
              error={errors.qowner}
              disabled={actionUpdate}
              options={Data_Options_Owner}
            />
          </Grid>
          <Grid item xs={6}>
            <MySelect
              key={Data_Options_OwnerGroup.id}
              name='qgroup'
              label='Owner Group'
              value={values.qgroup}
              onChange={handleInputChange}
              error={errors.qgroup}
              options={Data_Options_OwnerGroup_Subset}
            />
          </Grid>
          {/*------------------------------------------------------------------------------ */}
          <Grid item xs={6}>
            <MyInput
              name='qkey'
              label='Key'
              value={values.qkey}
              onChange={handleInputChange}
              error={errors.qkey}
              disabled={actionUpdate}
            />
          </Grid>

          {actionUpdate ? (
            <Grid item xs={2}>
              <MyInput name='qid' label='ID' value={values.qid} disabled={true} />
            </Grid>
          ) : null}
          <Grid item xs={4}></Grid>
          {/*------------------------------------------------------------------------------ */}
          <Grid item xs={10}>
            <MyInput
              name='qdetail'
              label='Question'
              value={values.qdetail}
              onChange={handleInputChange}
              error={errors.qdetail}
            />
          </Grid>
          <Grid item xs={2}></Grid>
          {/*------------------------------------------------------------------------------ */}
          <Grid item xs={10}>
            <MyInput
              name='qans1'
              label='Top Answer'
              value={values.qans1}
              onChange={handleInputChange}
              error={errors.qans1}
            />
          </Grid>

          <Grid item xs={2}>
            <MyInput
              name='qpoints1'
              label='Points'
              value={values.qpoints1}
              onChange={handleInputChange}
              error={errors.qpoints1}
            />
          </Grid>
          {/*------------------------------------------------------------------------------ */}
          <Grid item xs={10}>
            <MyInput
              name='qans2'
              label='Answer 2'
              value={values.qans2}
              onChange={handleInputChange}
              error={errors.qans2}
            />
          </Grid>

          <Grid item xs={2}>
            <MyInput
              name='qpoints2'
              label='Points'
              value={values.qpoints2}
              onChange={handleInputChange}
              error={errors.qpoints2}
            />
          </Grid>
          {/*------------------------------------------------------------------------------ */}
          <Grid item xs={10}>
            <MyInput
              name='qans3'
              label='Answer 3'
              value={values.qans3}
              onChange={handleInputChange}
              error={errors.qans3}
            />
          </Grid>

          <Grid item xs={2}>
            <MyInput
              name='qpoints3'
              label='Points'
              value={values.qpoints3}
              onChange={handleInputChange}
              error={errors.qpoints3}
            />
          </Grid>
          {/*------------------------------------------------------------------------------ */}
          <Grid item xs={10}>
            <MyInput
              name='qans4'
              label='Answer 4'
              value={values.qans4}
              onChange={handleInputChange}
              error={errors.qans4}
            />
          </Grid>

          <Grid item xs={2}>
            <MyInput
              name='qpoints4'
              label='Points'
              value={values.qpoints4}
              onChange={handleInputChange}
              error={errors.qpoints4}
            />
          </Grid>
          {/*------------------------------------------------------------------------------ */}

          <Grid item xs={6}>
            <MySelect
              key={Data_Options_Group2.id}
              name='qgroup2'
              label='Group 2'
              value={values.qgroup2}
              onChange={handleInputChange}
              error={errors.qgroup2}
              options={Data_Options_Group2}
            />
          </Grid>

          <Grid item xs={6}>
            <MySelect
              key={Data_Options_Group3.id}
              name='qgroup3'
              label='Group 3'
              value={values.qgroup3}
              onChange={handleInputChange}
              error={errors.qgroup3}
              options={Data_Options_Group3}
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
          {actionUpdate ? (
            <Grid item xs={2}>
              <MyButton text='Copy' onClick={handleCopy} />
            </Grid>
          ) : null}
          {/*------------------------------------------------------------------------------ */}
          {actionUpdate ? (
            <Grid item xs={2}>
              <MyButton
                text='Hands'
                onClick={() => {
                  setOpenPopupHand(true)
                }}
              />
            </Grid>
          ) : null}
          {/*------------------------------------------------------------------------------ */}
          {actionUpdate ? (
            <Grid item xs={2}>
              <MyButton
                text='Bidding'
                onClick={() => {
                  setOpenPopupBidding(true)
                }}
              />
            </Grid>
          ) : null}
          {/*------------------------------------------------------------------------------ */}
        </Grid>
      </MyForm>
      {/*------------------------------------------------------------------------------ */}
      <Popup title='Hands Form' openPopup={openPopupHand} setOpenPopup={setOpenPopupHand}>
        <HandEntry hid={values.qid} />
      </Popup>
      {/*------------------------------------------------------------------------------ */}
      <Popup title='Bidding Form' openPopup={openPopupBidding} setOpenPopup={setOpenPopupBidding}>
        <BiddingEntry bid={values.qid} />
      </Popup>
      {/*------------------------------------------------------------------------------ */}
    </>
  )
}
