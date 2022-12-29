//
//  Libraries
//
import { useState, useEffect } from 'react'
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
//  Services
//
import rowCrud from '../../utilities/rowCrud'
const sqlTable = 'bidding'
//
//  Form Initial Values
//
const initialFValues = {
  bid: 0,
  br1b1: '',
  br1b2: '',
  br1b3: '',
  br1b4: '',
  br2b1: '',
  br2b2: '',
  br2b3: '',
  br2b4: '',
  br3b1: '',
  br3b2: '',
  br3b3: '',
  br3b4: '',
  br4b1: '',
  br4b2: '',
  br4b3: '',
  br4b4: '',
  br5b1: '',
  br5b2: '',
  br5b3: '',
  br5b4: '',
  br6b1: '',
  br6b2: '',
  br6b3: '',
  br6b4: '',
  br7b1: '',
  br7b2: '',
  br7b3: '',
  br7b4: ''
}
let g_formValues = {
  bid: 0,
  br1b1: '',
  br1b2: '',
  br1b3: '',
  br1b4: '',
  br2b1: '',
  br2b2: '',
  br2b3: '',
  br2b4: '',
  br3b1: '',
  br3b2: '',
  br3b3: '',
  br3b4: '',
  br4b1: '',
  br4b2: '',
  br4b3: '',
  br4b4: '',
  br5b1: '',
  br5b2: '',
  br5b3: '',
  br5b4: '',
  br6b1: '',
  br6b2: '',
  br6b3: '',
  br6b4: '',
  br7b1: '',
  br7b2: '',
  br7b3: '',
  br7b4: ''
}
//
//  Values in DB format
//
const dbValues = {
  bid: 0,
  brounds: []
}
//
//  Validation work fields
//
let g_errorsUpd
//
//  Bidding Table
//
const { VALIDATE_ON_CHANGE } = require('../../services/constants.js')
const VALIDBIDS = [
  '1C',
  '1D',
  '1H',
  '1S',
  '1NT',
  '2C',
  '2D',
  '2H',
  '2S',
  '2NT',
  '3C',
  '3D',
  '3H',
  '3S',
  '3NT',
  '4C',
  '4D',
  '4H',
  '4S',
  '4NT',
  '5C',
  '5D',
  '5H',
  '5S',
  '5NT',
  '6C',
  '6D',
  '6H',
  '6S',
  '6NT',
  '7C',
  '7D',
  '7H',
  '7S',
  '7NT'
]
const SPECIALBIDS = ['PASS', 'X', 'XX', '?']

//
// Debug Settings
//
const debugLog = debugSettings()
const debugFunStart = false
const debugModule = 'BiddingEntry'
//=====================================================================================
export default function BiddingEntry(props) {
  //.............................................................................
  //.  dbRow Un-pack
  //.............................................................................
  const dbRowUnPack = row => {
    if (debugFunStart) console.log('dbRowUnPack')
    //
    //  Build Bidding Arrays
    //
    if (debugLog) console.log('row ', row)
    let Rounds = row.brounds
    if (debugLog) console.log('Rounds ', Rounds)
    //
    //  Unpack arrays into form fields
    //
    g_formValues.bid = bid
    let roundCnt = 0
    Rounds.forEach(round => {
      roundCnt++
      // if (debugLog) console.log(`round ${roundCnt}`, round)

      let bidCnt = 0
      round.forEach(bid => {
        bidCnt++
        // if (debugLog) console.log(`bid ${bidCnt}`, bid)
        //
        //  Convert N to empty string
        //
        if (bid === 'N') bid = ''

        if (roundCnt === 1) {
          if (bidCnt === 1) g_formValues.br1b1 = bid
          if (bidCnt === 2) g_formValues.br1b2 = bid
          if (bidCnt === 3) g_formValues.br1b3 = bid
          if (bidCnt === 4) g_formValues.br1b4 = bid
        }
        if (roundCnt === 2) {
          if (bidCnt === 1) g_formValues.br2b1 = bid
          if (bidCnt === 2) g_formValues.br2b2 = bid
          if (bidCnt === 3) g_formValues.br2b3 = bid
          if (bidCnt === 4) g_formValues.br2b4 = bid
        }
        if (roundCnt === 3) {
          if (bidCnt === 1) g_formValues.br3b1 = bid
          if (bidCnt === 2) g_formValues.br3b2 = bid
          if (bidCnt === 3) g_formValues.br3b3 = bid
          if (bidCnt === 4) g_formValues.br3b4 = bid
        }
        if (roundCnt === 4) {
          if (bidCnt === 1) g_formValues.br4b1 = bid
          if (bidCnt === 2) g_formValues.br4b2 = bid
          if (bidCnt === 3) g_formValues.br4b3 = bid
          if (bidCnt === 4) g_formValues.br4b4 = bid
        }
        if (roundCnt === 5) {
          if (bidCnt === 1) g_formValues.br5b1 = bid
          if (bidCnt === 2) g_formValues.br5b2 = bid
          if (bidCnt === 3) g_formValues.br5b3 = bid
          if (bidCnt === 4) g_formValues.br5b4 = bid
        }
      })
    })
    //
    //  Set form values from database
    //
    setValues({
      ...g_formValues
    })
  }
  //.............................................................................
  //.  dbRow Pack
  //.............................................................................
  const dbRowPack = () => {
    if (debugFunStart) console.log('dbRowPack')
    //
    //  Initialise dbValues
    //
    dbValues.bid = bid
    dbValues.brounds = []
    //
    //  Loop through each form value
    //
    let i = 0
    let roundArr = []
    let hasValues = false
    Object.entries(values).forEach(([key, value]) => {
      if (key !== 'bid') {
        //
        //  Populate array
        //
        if (value) {
          roundArr.push(value)
          hasValues = true
        } else {
          roundArr.push('N')
        }
        i++
        //
        //  Write to dbValues and initialise work array at 4
        //
        if (i >= 4) {
          //
          //  Write round if hasValues
          //
          if (hasValues) {
            dbValues.brounds.push(roundArr)
          }
          //
          //  Reset
          //
          i = 0
          roundArr = []
          hasValues = false
        }
      }
    })
  }
  //.............................................................................
  //.  Tidy Field
  //.............................................................................
  const tidyField = field => {
    if (debugFunStart) console.log('tidyField')
    let fieldRtn = field
    if (fieldRtn) {
      fieldRtn = fieldRtn.trim()
      fieldRtn = fieldRtn.toUpperCase()
    }
    return fieldRtn
  }
  //.............................................................................
  //.  Tidy All Fields
  //.............................................................................
  const tidyFieldAll = workValues => {
    if (debugFunStart) console.log('tidyFieldAll')
    //
    //  Get Last Bid
    //
    let lastBid = 0
    let i = 0
    Object.entries(workValues).forEach(([key, value]) => {
      if (key !== 'bid') {
        i++
        if (value !== '') lastBid = i
      }
    })
    //
    //  Loop through each form value and tidy the suit
    //
    i = 0
    Object.entries(workValues).forEach(([key, value]) => {
      if (key !== 'bid') {
        i++
        i < lastBid && value === ''
          ? (workValues[key] = 'PASS')
          : (workValues[key] = tidyField(value))
      }
    })
    //
    //  Update the values
    //
    g_formValues = { ...workValues }
    setValues({ ...workValues })
  }
  //.............................................................................
  //.  GET Data by ID
  //.............................................................................
  const getRowById = () => {
    if (debugFunStart) console.log('getRowById')
    //
    //  Process promise
    //
    let sqlString = `* from ${sqlTable} where bid = ${bid}`
    const rowCrudparams = {
      axiosMethod: 'post',
      sqlCaller: debugModule,
      sqlTable: sqlTable,
      sqlAction: 'SELECTSQL',
      sqlString: sqlString
    }
    const myPromiseGet = rowCrud(rowCrudparams)
    //
    //  Resolve Status
    //
    myPromiseGet.then(function (rtnObj) {
      if (debugLog) console.log('myPromiseGet rtnObj ', rtnObj)
      //
      //  No data returned
      //
      if (!rtnObj.rtnValue) return
      //
      //  Returned data
      //
      const row = rtnObj.rtnRows[0]
      //
      //  Unpack data from database & update form values
      //
      dbRowUnPack(row)
      return
    })
    //
    //  Return Promise
    //
    return myPromiseGet
  }
  //.............................................................................
  //.  INSERT
  //.............................................................................
  const upsertRowData = () => {
    if (debugFunStart) console.log('upsertRowData')
    //
    //  Pack values to dbValues
    //
    dbRowPack()
    //
    //  Process promise
    //
    const rowCrudparams = {
      axiosMethod: 'post',
      sqlCaller: debugModule,
      sqlTable: sqlTable,
      sqlAction: 'UPSERT',
      sqlKeyName: ['bid'],
      sqlRow: dbValues
    }
    const myPromiseInsert = rowCrud(rowCrudparams)
    //
    //  Resolve Status
    //
    myPromiseInsert.then(function (rtnObj) {
      if (debugLog) console.log('rtnObj ', rtnObj)
      //
      //  Completion message
      //
      setServerMessage(rtnObj.rtnMessage)
      //
      //  No data returned
      //
      if (!rtnObj.rtnValue) return
      //
      //  Update record for edit with returned data
      //
      const rtnData = rtnObj.rtnRows
      const row = rtnData[0]
      //
      //  Unpack data from database & update form values
      //
      dbRowUnPack(row)
      //
      //  Update State - refetch data
      //
      return
    })
    //
    //  Return Promise
    //
    return myPromiseInsert
  }
  //.............................................................................
  //.  DELETE
  //.............................................................................
  const deleteRowData = () => {
    if (debugFunStart) console.log('deleteRowData')
    //
    //  Process promise
    //
    const rowCrudparams = {
      axiosMethod: 'delete',
      sqlCaller: debugModule,
      sqlTable: sqlTable,
      sqlAction: 'DELETE',
      sqlWhere: `bid = ${bid}`
    }
    const myPromiseDelete = rowCrud(rowCrudparams)
    //
    //  Resolve Status
    //
    myPromiseDelete.then(function (rtnObj) {
      if (debugLog) console.log('myPromiseDelete rtnObj ', rtnObj)
      //
      //  Set values to Initial Values
      //
      initialFValues.bid = bid
      setValues(initialFValues)
      g_formValues = { ...initialFValues }
      return
    })
    //
    //  Return Promise
    //
    return myPromiseDelete
  }
  //...................................................................................
  //
  // Validate a field
  //
  const validateField = value => {
    if (debugFunStart) console.log('validateField')
    //
    //  Error Message
    //
    let errMessage = ''
    //
    //  Skip null
    //
    if (value !== '') {
      //
      //  Check if in VALIDBIDS
      //
      const foundVALIDBIDS = VALIDBIDS.includes(value)
      //
      //  Check if in SPECIALBIDS
      //
      const foundSPECIALBIDS = SPECIALBIDS.includes(value)
      //
      //  Not a valid bid
      //
      if (!foundVALIDBIDS && !foundSPECIALBIDS) errMessage = `Invalid Bid`
    }
    //
    //  Validate THIS field
    //
    return errMessage
  }
  //...................................................................................
  //
  // Validate Bids
  //
  const valBidValue = workValues => {
    if (debugFunStart) console.log('valBidValue')
    //
    //  Validate bid
    //
    let errors = false
    Object.entries(workValues).forEach(([key, value]) => {
      if (key !== 'bid') {
        const errMessage = validateField(value)
        g_errorsUpd[key] = errMessage
        if (errMessage !== '') errors = true
      }
    })
    //
    //  Return Errors flag
    //
    return errors
  }
  //...................................................................................
  //
  // Validate Order of bids
  //
  const valBidOrder = workValues => {
    if (debugFunStart) console.log('valBidOrder')
    //
    //  Initial Values
    //
    let errors = false
    let fromIdx = 0
    //
    //  Process all bids
    //
    Object.entries(workValues).forEach(([key, value]) => {
      const foundVALIDBIDS = VALIDBIDS.includes(value)
      //
      //  Exxclude Key, Check Normal Bid
      //
      if (key !== 'bid' && foundVALIDBIDS) {
        //
        //  Check bids are in order
        //
        let errMessage = ''
        const foundIdx = VALIDBIDS.indexOf(value, fromIdx)
        foundIdx < 0 ? (errMessage = 'Bid out of Order') : (fromIdx = foundIdx + 1)
        g_errorsUpd[key] = errMessage
        if (errMessage !== '') errors = true
      }
    })
    //
    //  Return Errors flag
    //
    return errors
  }
  //...................................................................................
  //
  // Validate Bids
  //
  const valBids = workValues => {
    if (debugFunStart) console.log('valBids')
    let errors
    //
    //  Validate bid Value
    //
    errors = valBidValue(workValues)
    //
    //  Validate bid Order
    //
    if (!errors) valBidOrder(workValues)
  }
  //...................................................................................
  //
  // Validate the fields
  //
  const validate = (fieldValues = values) => {
    if (debugFunStart) console.log('Validate')
    //
    //  Update g_formValues to values
    //
    g_formValues = { ...values }
    //
    //  Validate one field - Update g_formValues that are not updated in values
    //
    if (VALIDATE_ON_CHANGE) {
      Object.assign(g_formValues, fieldValues)
    }
    //
    //  Load previous errors
    //
    g_errorsUpd = { ...errors }
    //
    //   Tidy fields
    //
    tidyFieldAll(fieldValues)
    //
    //  Validate Field Changes (ALL)
    //
    valBids(fieldValues)
    //
    //  Set the errors
    //
    setErrors({
      ...g_errorsUpd
    })
    //
    //  Check if every element within the errorsUpd object is blank, then return true (valid), but only on submit when the fieldValues=values
    //
    if (fieldValues === values) {
      return Object.values(g_errorsUpd).every(x => x === '')
    }
  }
  //...................................................................................
  //
  //  UseMyForm
  //
  const { values, setValues, errors, setErrors, handleInputChange } = useMyForm(
    initialFValues,
    VALIDATE_ON_CHANGE,
    validate
  )
  //...................................................................................
  //.  Submit form
  //...................................................................................
  const handleSubmit = e => {
    if (debugFunStart) console.log(handleSubmit)
    e.preventDefault()
    //
    //  Validate & Update
    //
    if (validate()) {
      //
      //  Update database
      //
      upsertRowData()
    }
  }
  //...................................................................................
  //.  Main Line
  //...................................................................................

  if (debugFunStart) console.log(debugModule)
  //
  //  Deconstruct props
  //
  const { bid } = props
  initialFValues.bid = bid

  const [serverMessage, setServerMessage] = useState('')
  //
  //  On change of record, set State
  //
  useEffect(() => {
    g_formValues = { ...initialFValues }
    getRowById()
    // eslint-disable-next-line
  }, [])
  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <MyForm onSubmit={handleSubmit}>
      <Grid container>
        <Grid item xs={2}>
          <MyInput name='bid' label='ID' value={bid} disabled={true} />
        </Grid>
        <Grid item xs={10}></Grid>
        {/*------------------------------------------------------------------------------ */}
        {/*  round 1 */}
        {/*------------------------------------------------------------------------------ */}
        <Grid item xs={3}>
          <MyInput
            name='br1b1'
            label='North'
            value={values.br1b1}
            onChange={handleInputChange}
            error={errors.br1b1}
          />
        </Grid>
        {/*------------------------------------------------------------------------------ */}
        <Grid item xs={3}>
          <MyInput
            name='br1b2'
            label='East'
            value={values.br1b2}
            onChange={handleInputChange}
            error={errors.br1b2}
          />
        </Grid>
        {/*------------------------------------------------------------------------------ */}
        <Grid item xs={3}>
          <MyInput
            name='br1b3'
            label='South'
            value={values.br1b3}
            onChange={handleInputChange}
            error={errors.br1b3}
          />
        </Grid>
        {/*------------------------------------------------------------------------------ */}
        <Grid item xs={3}>
          <MyInput
            name='br1b4'
            label='West'
            value={values.br1b4}
            onChange={handleInputChange}
            error={errors.br1b4}
          />
        </Grid>
        {/*------------------------------------------------------------------------------ */}
        {/*  round 2 */}
        {/*------------------------------------------------------------------------------ */}
        <Grid item xs={3}>
          <MyInput
            name='br2b1'
            label='North'
            value={values.br2b1}
            onChange={handleInputChange}
            error={errors.br2b1}
          />
        </Grid>
        {/*------------------------------------------------------------------------------ */}
        <Grid item xs={3}>
          <MyInput
            name='br2b2'
            label='East'
            value={values.br2b2}
            onChange={handleInputChange}
            error={errors.br2b2}
          />
        </Grid>
        {/*------------------------------------------------------------------------------ */}
        <Grid item xs={3}>
          <MyInput
            name='br2b3'
            label='South'
            value={values.br2b3}
            onChange={handleInputChange}
            error={errors.br2b3}
          />
        </Grid>
        {/*------------------------------------------------------------------------------ */}
        <Grid item xs={3}>
          <MyInput
            name='br2b4'
            label='West'
            value={values.br2b4}
            onChange={handleInputChange}
            error={errors.br2b4}
          />
        </Grid>
        {/*------------------------------------------------------------------------------ */}

        {/*  round 3 */}
        {/*------------------------------------------------------------------------------ */}
        <Grid item xs={3}>
          <MyInput
            name='br3b1'
            label='North'
            value={values.br3b1}
            onChange={handleInputChange}
            error={errors.br3b1}
          />
        </Grid>
        {/*------------------------------------------------------------------------------ */}
        <Grid item xs={3}>
          <MyInput
            name='br3b2'
            label='East'
            value={values.br3b2}
            onChange={handleInputChange}
            error={errors.br3b2}
          />
        </Grid>
        {/*------------------------------------------------------------------------------ */}
        <Grid item xs={3}>
          <MyInput
            name='br3b3'
            label='South'
            value={values.br3b3}
            onChange={handleInputChange}
            error={errors.br3b3}
          />
        </Grid>
        {/*------------------------------------------------------------------------------ */}
        <Grid item xs={3}>
          <MyInput
            name='br3b4'
            label='West'
            value={values.br3b4}
            onChange={handleInputChange}
            error={errors.br3b4}
          />
        </Grid>
        {/*------------------------------------------------------------------------------ */}
        {/*------------------------------------------------------------------------------ */}
        {/*  round 4 */}
        {/*------------------------------------------------------------------------------ */}
        <Grid item xs={3}>
          <MyInput
            name='br4b1'
            label='North'
            value={values.br4b1}
            onChange={handleInputChange}
            error={errors.br4b1}
          />
        </Grid>
        {/*------------------------------------------------------------------------------ */}
        <Grid item xs={3}>
          <MyInput
            name='br4b2'
            label='East'
            value={values.br4b2}
            onChange={handleInputChange}
            error={errors.br4b2}
          />
        </Grid>
        {/*------------------------------------------------------------------------------ */}
        <Grid item xs={3}>
          <MyInput
            name='br4b3'
            label='South'
            value={values.br4b3}
            onChange={handleInputChange}
            error={errors.br4b3}
          />
        </Grid>
        {/*------------------------------------------------------------------------------ */}
        <Grid item xs={3}>
          <MyInput
            name='br4b4'
            label='West'
            value={values.br4b4}
            onChange={handleInputChange}
            error={errors.br4b4}
          />
        </Grid>
        {/*------------------------------------------------------------------------------ */}
        {/*------------------------------------------------------------------------------ */}
        {/*  round 5 */}
        {/*------------------------------------------------------------------------------ */}
        <Grid item xs={3}>
          <MyInput
            name='br5b1'
            label='North'
            value={values.br5b1}
            onChange={handleInputChange}
            error={errors.br5b1}
          />
        </Grid>
        {/*------------------------------------------------------------------------------ */}
        <Grid item xs={3}>
          <MyInput
            name='br5b2'
            label='East'
            value={values.br5b2}
            onChange={handleInputChange}
            error={errors.br5b2}
          />
        </Grid>
        {/*------------------------------------------------------------------------------ */}
        <Grid item xs={3}>
          <MyInput
            name='br5b3'
            label='South'
            value={values.br5b3}
            onChange={handleInputChange}
            error={errors.br5b3}
          />
        </Grid>
        {/*------------------------------------------------------------------------------ */}
        <Grid item xs={3}>
          <MyInput
            name='br5b4'
            label='West'
            value={values.br5b4}
            onChange={handleInputChange}
            error={errors.br5b4}
          />
        </Grid>
        {/*------------------------------------------------------------------------------ */}
        {/*  round 6 */}
        {/*------------------------------------------------------------------------------ */}
        <Grid item xs={3}>
          <MyInput
            name='br6b1'
            label='North'
            value={values.br6b1}
            onChange={handleInputChange}
            error={errors.br6b1}
          />
        </Grid>
        {/*------------------------------------------------------------------------------ */}
        <Grid item xs={3}>
          <MyInput
            name='br6b2'
            label='East'
            value={values.br6b2}
            onChange={handleInputChange}
            error={errors.br6b2}
          />
        </Grid>
        {/*------------------------------------------------------------------------------ */}
        <Grid item xs={3}>
          <MyInput
            name='br6b3'
            label='South'
            value={values.br6b3}
            onChange={handleInputChange}
            error={errors.br6b3}
          />
        </Grid>
        {/*------------------------------------------------------------------------------ */}
        <Grid item xs={3}>
          <MyInput
            name='br6b4'
            label='West'
            value={values.br6b4}
            onChange={handleInputChange}
            error={errors.br6b4}
          />
        </Grid>
        {/*------------------------------------------------------------------------------ */}
        {/*  round 7 */}
        {/*------------------------------------------------------------------------------ */}
        <Grid item xs={3}>
          <MyInput
            name='br7b1'
            label='North'
            value={values.br7b1}
            onChange={handleInputChange}
            error={errors.br7b1}
          />
        </Grid>
        {/*------------------------------------------------------------------------------ */}
        <Grid item xs={3}>
          <MyInput
            name='br7b2'
            label='East'
            value={values.br7b2}
            onChange={handleInputChange}
            error={errors.br7b2}
          />
        </Grid>
        {/*------------------------------------------------------------------------------ */}
        <Grid item xs={3}>
          <MyInput
            name='br7b3'
            label='South'
            value={values.br7b3}
            onChange={handleInputChange}
            error={errors.br7b3}
          />
        </Grid>
        {/*------------------------------------------------------------------------------ */}
        <Grid item xs={3}>
          <MyInput
            name='br7b4'
            label='West'
            value={values.br7b4}
            onChange={handleInputChange}
            error={errors.br7b4}
          />
        </Grid>
        {/*.................................................................................................*/}
        <Grid item xs={12}>
          <Typography style={{ color: 'red' }}>{serverMessage}</Typography>
        </Grid>
        {/*------------------------------------------------------------------------------ */}
        <Grid item xs={3}>
          <MyButton
            text='Validate'
            onClick={() => {
              validate()
            }}
          />
        </Grid>
        {/*------------------------------------------------------------------------------ */}
        <Grid item xs={3}>
          <MyButton type='submit' text='Update' />
        </Grid>
        {/*------------------------------------------------------------------------------ */}
        <Grid item xs={3}>
          <MyButton
            text='Delete'
            onClick={() => {
              deleteRowData()
            }}
          />
        </Grid>

        {/*------------------------------------------------------------------------------ */}
      </Grid>
    </MyForm>
  )
}
