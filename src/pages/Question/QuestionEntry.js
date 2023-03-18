//
//  Libraries
//
import { useEffect, useState } from 'react'
import { Grid, Typography } from '@mui/material'
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
import { useMyForm, MyForm } from '../../components/controls/useMyForm'
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
  qseq: 0,
  qdetail: '',
  qans1: '',
  qans2: '',
  qans3: '',
  qans4: '',
  qpoints1: 10,
  qpoints2: 0,
  qpoints3: 0,
  qpoints4: 0,
  qgroup: ''
}
//
//  Global Variable
//
let actionUpdate = false
let disableOwner
let disableGroup
let Data_Options_OwnerGroup_Subset = []
let ownerPrevious
//...................................................................................
//.  Main Line
//...................................................................................
export default function QuestionEntry(props) {
  const { addOrEdit, recordForEdit, serverMessage, s_owner, s_group } = props
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
  //
  //  On change of record, set State
  //
  useEffect(() => {
    //
    //  Split arrays into fields
    //
    if (recordForEdit) {
      recordForEdit_unpack()
    } else if (s_owner || s_group) {
      setValues({
        ...values,
        qowner: s_owner,
        qgroup: s_group
      })
    }

    // eslint-disable-next-line
  }, [recordForEdit])
  //
  //  Disable/Allow entry
  //
  actionUpdate = false
  if (values && values.qid !== 0) actionUpdate = true
  disableOwner = actionUpdate
  if (s_owner) disableOwner = true
  disableGroup = actionUpdate
  if (s_group) disableGroup = true
  //
  //  Button Text
  //
  let submitButtonText
  actionUpdate ? (submitButtonText = 'Update') : (submitButtonText = 'Add')
  //
  //  Set Group Options
  //
  if (s_owner) {
    if (ownerPrevious !== s_owner) {
      ownerPrevious = s_owner
      Data_Options_OwnerGroup_Subset = loadOwnerGroupSubset(true, s_owner, s_group)
    }
  }
  //.............................................................................
  //.  Unpack record for edit values
  //.............................................................................
  function recordForEdit_unpack() {
    let { qans, qpoints, ...inValues } = recordForEdit
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
    setValues({
      ...inValues
    })
  }
  //.............................................................................
  //.  Load Owner/Group Options
  //.............................................................................
  function loadOwnerGroupSubset(InitialLoad, owner, group) {
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
    if (!valid) {
      const firstOption = options[0]
      if (!InitialLoad) {
        setValues({
          ...values,
          qowner: owner,
          qgroup: firstOption.id
        })
      }
    }
    //
    //  Save and return
    //
    sessionStorage.setItem('Data_Options_OwnerGroup_Subset', JSON.stringify(options))
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
      Data_Options_OwnerGroup_Subset = loadOwnerGroupSubset(
        false,
        fieldValues.qowner,
        values.qgroup
      )
    }

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
    e.preventDefault()
    //
    //  Validate & Update
    //
    if (validate()) {
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
              disabled={disableOwner}
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
              disabled={disableGroup}
            />
          </Grid>
          {/*------------------------------------------------------------------------------ */}
          <Grid item xs={6}>
            <MyInput
              name='qseq'
              label='Seq'
              value={values.qseq}
              onChange={handleInputChange}
              error={errors.qseq}
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
