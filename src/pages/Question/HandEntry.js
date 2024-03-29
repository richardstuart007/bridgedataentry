//
//  Libraries
//
import { useState, useEffect } from 'react'
import { Grid, Typography } from '@mui/material'
//
//  Controls
//
import MyButton from '../../components/controls/MyButton'
import MyInput from '../../components/controls/MyInput'
import { useMyForm, MyForm } from '../../components/controls/useMyForm'
//
//  Services
//
import rowCrud from '../../utilities/rowCrud'
const AxTable = 'hands'
//
//  Form Initial Values
//
const initialFValues = {
  hqid: 0,
  hNS: '',
  hNH: '',
  hND: '',
  hNC: '',
  hES: '',
  hEH: '',
  hED: '',
  hEC: '',
  hSS: '',
  hSH: '',
  hSD: '',
  hSC: '',
  hWS: '',
  hWH: '',
  hWD: '',
  hWC: ''
}
//
//  Values in Form Format
//
let g_formValues = {
  hqid: 0,
  hNS: '',
  hNH: '',
  hND: '',
  hNC: '',
  hES: '',
  hEH: '',
  hED: '',
  hEC: '',
  hSS: '',
  hSH: '',
  hSD: '',
  hSC: '',
  hWS: '',
  hWH: '',
  hWD: '',
  hWC: ''
}
//
//  Values in DB format
//
const dbValues = {
  hqid: 0,
  hnorth: [],
  heast: [],
  hsouth: [],
  hwest: []
}
//
//  Validation work fields
//
let g_valAvailCard
let g_valSuit
let g_valHand
let g_errorsUpd
//
//  Hands Table
//
const { VALIDATE_ON_CHANGE } = require('../../services/constants.js')
const VALIDCARDS = 'AKQJT98765432'
//
// Debug Settings
//
const debugModule = 'HandEntry'
//=====================================================================================
export default function HandEntry(props) {
  //.............................................................................
  //.  db un Pack hand
  //.............................................................................
  const dbUnPackHand = hand => {
    //
    //  Convert 'n' to empty string
    //
    let handreturn = []
    hand.forEach(suit => {
      suit === 'n' ? handreturn.push('') : handreturn.push(suit)
    })

    return handreturn
  }
  //.............................................................................
  //.  dbRow Un-pack
  //.............................................................................
  const dbRowUnPack = row => {
    //
    //  Initialise dbValues
    //
    dbValues.hqid = hqid
    dbValues.hnorth = []
    dbValues.heast = []
    dbValues.hsouth = []
    dbValues.hwest = []
    let hand
    //
    g_formValues.hqid = hqid
    //
    //  North
    //
    hand = row.hnorth
    if (hand) {
      dbValues.hnorth = hand
      const unpackValue = dbUnPackHand(hand)
      g_formValues.hNS = unpackValue[0]
      g_formValues.hNH = unpackValue[1]
      g_formValues.hND = unpackValue[2]
      g_formValues.hNC = unpackValue[3]
    }
    //
    //  East
    //
    hand = row.heast
    if (hand) {
      dbValues.heast = hand
      const unpackValue = dbUnPackHand(hand)
      g_formValues.hES = unpackValue[0]
      g_formValues.hEH = unpackValue[1]
      g_formValues.hED = unpackValue[2]
      g_formValues.hEC = unpackValue[3]
    }
    //
    //  South
    //
    hand = row.hsouth
    if (hand) {
      dbValues.hsouth = hand
      const unpackValue = dbUnPackHand(hand)
      g_formValues.hSS = unpackValue[0]
      g_formValues.hSH = unpackValue[1]
      g_formValues.hSD = unpackValue[2]
      g_formValues.hSC = unpackValue[3]
    }
    //
    //  West
    //
    hand = row.hwest
    if (hand) {
      dbValues.hwest = hand
      const unpackValue = dbUnPackHand(hand)
      g_formValues.hWS = unpackValue[0]
      g_formValues.hWH = unpackValue[1]
      g_formValues.hWD = unpackValue[2]
      g_formValues.hWC = unpackValue[3]
    }
    //
    //  Set form values from database
    //
    setValues({
      ...g_formValues
    })
  }
  //.............................................................................
  //.  db Pack Hand
  //.............................................................................
  const dbPackHand = hand => {
    //
    //  Return null if allvalues are empty
    //
    const allnull = hand.every(suit => suit === '')
    if (allnull) return null
    //
    //  Convert empty values to 'n'
    //
    let handreturn = []
    hand.forEach(suit => {
      suit === '' ? handreturn.push('n') : handreturn.push(suit)
    })

    return handreturn
  }
  //.............................................................................
  //.  Sort Suit
  //.............................................................................
  const fieldStripSort = suit => {
    //
    //  Set Order of cards
    //
    const suitOrder = VALIDCARDS
    //
    //  Match Each card in order
    //
    let suitReturn = ''
    for (let i = 0; i < suitOrder.length; i++) {
      //
      //  Get card
      //
      const card = suitOrder.substring(i, i + 1)
      //
      //  Find card in suit
      //
      const position = suit.search(card)
      //
      //  Card found in suit, add to return string
      //
      if (position !== -1) {
        suitReturn = suitReturn + card
      }
    }
    //
    //  Sorted Suit
    //

    return suitReturn
  }

  //.............................................................................
  //.  dbRow Pack
  //.............................................................................
  const dbRowPack = () => {
    //
    //  Initialise dbValues
    //
    dbValues.hqid = hqid
    dbValues.hnorth = []
    dbValues.heast = []
    dbValues.hsouth = []
    dbValues.hwest = []
    //
    //  Work variables
    //
    let workArr = []
    //
    //  North
    //
    workArr = []
    workArr[0] = values.hNS
    workArr[1] = values.hNH
    workArr[2] = values.hND
    workArr[3] = values.hNC
    workArr = dbPackHand(workArr)
    dbValues.hnorth = workArr
    //
    //  East
    //
    workArr = []
    workArr[0] = values.hES
    workArr[1] = values.hEH
    workArr[2] = values.hED
    workArr[3] = values.hEC
    workArr = dbPackHand(workArr)
    dbValues.heast = workArr
    //
    //  South
    //
    workArr = []
    workArr[0] = values.hSS
    workArr[1] = values.hSH
    workArr[2] = values.hSD
    workArr[3] = values.hSC
    workArr = dbPackHand(workArr)
    dbValues.hsouth = workArr
    //
    //  West
    //
    workArr = []
    workArr[0] = values.hWS
    workArr[1] = values.hWH
    workArr[2] = values.hWD
    workArr[3] = values.hWC
    workArr = dbPackHand(workArr)
    dbValues.hwest = workArr
  }
  //.............................................................................
  //.  Tidy Field
  //.............................................................................
  const tidyField = field => {
    let fieldRtn = field
    if (fieldRtn) {
      fieldRtn = fieldRtn.trim()
      fieldRtn = fieldRtn.toUpperCase()
      fieldRtn = fieldStripSort(fieldRtn)
    }

    return fieldRtn
  }
  //.............................................................................
  //.  Tidy All Fields
  //.............................................................................
  const tidyFieldAll = workHands => {
    //
    //  Loop through each form value and tidy the suit
    //
    Object.entries(workHands).forEach(([key, value]) => {
      if (key !== 'hqid') {
        const returnedValue = tidyField(value)
        workHands[key] = returnedValue
      }
    })
    //
    //  Update the values
    //
    g_formValues = { ...workHands }
    setValues({ ...workHands })
  }
  //.............................................................................
  //.  GET Data by ID
  //.............................................................................
  const getRowById = () => {
    //
    //  Process promise
    //
    let AxString = `* from ${AxTable} where hqid = ${hqid}`
    const rowCrudparams = {
      AxMethod: 'post',
      AxCaller: debugModule,
      AxTable: AxTable,
      AxAction: 'SELECTSQL',
      AxString: AxString
    }
    const myPromiseGet = rowCrud(rowCrudparams)
    //
    //  Resolve Status
    //
    myPromiseGet.then(function (rtnObj) {
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
    //
    //  Pack values to dbValues
    //
    dbRowPack()
    //
    //  Process promise
    //
    const rowCrudparams = {
      AxMethod: 'post',
      AxCaller: debugModule,
      AxTable: AxTable,
      AxAction: 'UPSERT',
      AxKeyName: ['hqid'],
      AxRow: dbValues
    }
    const myPromiseInsert = rowCrud(rowCrudparams)
    //
    //  Resolve Status
    //
    myPromiseInsert.then(function (rtnObj) {
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
    //
    //  Process promise
    //
    const rowCrudparams = {
      AxMethod: 'delete',
      AxCaller: debugModule,
      AxTable: AxTable,
      AxAction: 'DELETE',
      AxWhere: `hqid = ${hqid}`
    }
    const myPromiseDelete = rowCrud(rowCrudparams)
    //
    //  Resolve Status
    //
    myPromiseDelete.then(function (rtnObj) {
      //
      //  Set values to Initial Values
      //
      initialFValues.hqid = hqid
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
  // Remove Suit Cards - Invalid or Duplicate
  //
  const fieldCardRemove = field => {
    //
    //  Error Message
    //
    let errMessage = ''
    if (!field) {
      return errMessage
    }
    //
    //  Trim blanks
    //
    let value = field.trim()
    //
    //  convert to upper case
    //
    value = value.toUpperCase()
    //
    //  Remove cards from the suit if matches
    //
    for (let i = 0; i < value.length; i++) {
      //
      //  Get card
      //
      const card = value.substring(i, i + 1)
      //
      //  Find card in available cards
      //
      const position = g_valAvailCard.search(card)
      //
      //  Card not found in available
      //
      if (position === -1) {
        errMessage = `Duplicate ${card}`
        break
      }
      //
      //  Remove card found from Available cards
      //
      let start = ''
      let end = ''
      if (position > 0) start = g_valAvailCard.substring(0, position)
      if (position < g_valAvailCard.length)
        end = g_valAvailCard.substring(position + 1, g_valAvailCard.length)
      g_valAvailCard = start + end
    }
    //
    //  Return Error message
    //

    return errMessage
  }

  //...................................................................................
  //
  // Validate a field
  //
  const validateField = field => {
    //
    //  Error Message
    //
    let errMessage = ''
    //
    //  Available cards
    //
    g_valAvailCard = VALIDCARDS
    //
    //  Remove OTHER suit values first
    //
    if (g_valSuit === 'spades') {
      if (g_valHand !== 'north') errMessage = fieldCardRemove(g_formValues.hNS)
      if (g_valHand !== 'east') errMessage = fieldCardRemove(g_formValues.hES)
      if (g_valHand !== 'south') errMessage = fieldCardRemove(g_formValues.hSS)
      if (g_valHand !== 'west') errMessage = fieldCardRemove(g_formValues.hWS)
    }
    if (g_valSuit === 'hearts') {
      if (g_valHand !== 'north') errMessage = fieldCardRemove(g_formValues.hNH)
      if (g_valHand !== 'east') errMessage = fieldCardRemove(g_formValues.hEH)
      if (g_valHand !== 'south') errMessage = fieldCardRemove(g_formValues.hSH)
      if (g_valHand !== 'west') errMessage = fieldCardRemove(g_formValues.hWH)
    }
    if (g_valSuit === 'diamonds') {
      if (g_valHand !== 'north') errMessage = fieldCardRemove(g_formValues.hND)
      if (g_valHand !== 'east') errMessage = fieldCardRemove(g_formValues.hED)
      if (g_valHand !== 'south') errMessage = fieldCardRemove(g_formValues.hSD)
      if (g_valHand !== 'west') errMessage = fieldCardRemove(g_formValues.hWD)
    }
    if (g_valSuit === 'clubs') {
      if (g_valHand !== 'north') errMessage = fieldCardRemove(g_formValues.hNC)
      if (g_valHand !== 'east') errMessage = fieldCardRemove(g_formValues.hEC)
      if (g_valHand !== 'south') errMessage = fieldCardRemove(g_formValues.hSC)
      if (g_valHand !== 'west') errMessage = fieldCardRemove(g_formValues.hWC)
    }
    //
    //  Validate THIS field
    //
    errMessage = fieldCardRemove(field)

    return errMessage
  }

  //...................................................................................
  //
  // Validate Spades
  //
  const valSpades = workSuit => {
    g_valSuit = 'spades'
    if ('hNS' in workSuit) {
      g_valHand = 'north'
      const errMessage = validateField(workSuit.hNS)
      g_errorsUpd.hNS = errMessage
    }
    if ('hES' in workSuit) {
      g_valHand = 'east'
      const errMessage = validateField(workSuit.hES)
      g_errorsUpd.hES = errMessage
    }
    if ('hSS' in workSuit) {
      g_valHand = 'south'
      const errMessage = validateField(workSuit.hSS)
      g_errorsUpd.hSS = errMessage
    }
    if ('hWS' in workSuit) {
      g_valHand = 'west'
      const errMessage = validateField(workSuit.hWS)
      g_errorsUpd.hWS = errMessage
    }
  }
  //...................................................................................
  //
  // Validate Hearts
  //
  const valHearts = workSuit => {
    g_valSuit = 'hearts'
    if ('hNH' in workSuit) {
      g_valHand = 'north'
      const errMessage = validateField(workSuit.hNH)
      g_errorsUpd.hNH = errMessage
    }
    if ('hEH' in workSuit) {
      g_valHand = 'east'
      const errMessage = validateField(workSuit.hEH)
      g_errorsUpd.hEH = errMessage
    }
    if ('hSH' in workSuit) {
      g_valHand = 'south'
      const errMessage = validateField(workSuit.hSH)
      g_errorsUpd.hSH = errMessage
    }
    if ('hWH' in workSuit) {
      g_valHand = 'west'
      const errMessage = validateField(workSuit.hWH)
      g_errorsUpd.hWH = errMessage
    }
  }
  //...................................................................................
  //
  // Validate Diamonds
  //
  const valDiamonds = workSuit => {
    g_valSuit = 'diamonds'
    if ('hND' in workSuit) {
      g_valHand = 'north'
      const errMessage = validateField(workSuit.hND)
      g_errorsUpd.hND = errMessage
    }
    if ('hED' in workSuit) {
      g_valHand = 'east'
      const errMessage = validateField(workSuit.hED)
      g_errorsUpd.hED = errMessage
    }
    if ('hSD' in workSuit) {
      g_valHand = 'south'
      const errMessage = validateField(workSuit.hSD)
      g_errorsUpd.hSD = errMessage
    }
    if ('hWD' in workSuit) {
      g_valHand = 'west'
      const errMessage = validateField(workSuit.hWD)
      g_errorsUpd.hWD = errMessage
    }
  }
  //...................................................................................
  //
  // Validate Clubs
  //
  const valClubs = workSuit => {
    g_valSuit = 'clubs'
    if ('hNC' in workSuit) {
      g_valHand = 'north'
      const errMessage = validateField(workSuit.hNC)
      g_errorsUpd.hNC = errMessage
    }
    if ('hEC' in workSuit) {
      g_valHand = 'east'
      const errMessage = validateField(workSuit.hEC)
      g_errorsUpd.hEC = errMessage
    }
    if ('hSC' in workSuit) {
      g_valHand = 'south'
      const errMessage = validateField(workSuit.hSC)
      g_errorsUpd.hSC = errMessage
    }
    if ('hWC' in workSuit) {
      g_valHand = 'west'
      const errMessage = validateField(workSuit.hWC)
      g_errorsUpd.hWC = errMessage
    }
  }
  //...................................................................................
  //
  // Validate Hand Card Count
  //
  const valHandCount = () => {
    let lengthTotal = 0
    //
    //  North
    //
    lengthTotal = 0
    if (g_formValues.hNS) lengthTotal = lengthTotal + g_formValues.hNS.length
    if (g_formValues.hNH) lengthTotal = lengthTotal + g_formValues.hNH.length
    if (g_formValues.hND) lengthTotal = lengthTotal + g_formValues.hND.length
    if (g_formValues.hNC) lengthTotal = lengthTotal + g_formValues.hNC.length
    //
    //  Error
    //
    if (lengthTotal > 13) g_errorsUpd.hNC = `Hand has ${lengthTotal} cards`
    //
    //  East
    //
    lengthTotal = 0
    if (g_formValues.hES) lengthTotal = lengthTotal + g_formValues.hES.length
    if (g_formValues.hEH) lengthTotal = lengthTotal + g_formValues.hEH.length
    if (g_formValues.hED) lengthTotal = lengthTotal + g_formValues.hED.length
    if (g_formValues.hEC) lengthTotal = lengthTotal + g_formValues.hEC.length
    //
    //  Error
    //
    if (lengthTotal > 13) g_errorsUpd.hEC = `Hand has ${lengthTotal} cards`
    //
    //  South
    //
    lengthTotal = 0
    if (g_formValues.hSS) lengthTotal = lengthTotal + g_formValues.hSS.length
    if (g_formValues.hSH) lengthTotal = lengthTotal + g_formValues.hSH.length
    if (g_formValues.hSD) lengthTotal = lengthTotal + g_formValues.hSD.length
    if (g_formValues.hSC) lengthTotal = lengthTotal + g_formValues.hSC.length
    //
    //  Error
    //
    if (lengthTotal > 13) g_errorsUpd.hSC = `Hand has ${lengthTotal} cards`
    //
    //  West
    //
    lengthTotal = 0
    if (g_formValues.hWS) lengthTotal = lengthTotal + g_formValues.hWS.length
    if (g_formValues.hWH) lengthTotal = lengthTotal + g_formValues.hWH.length
    if (g_formValues.hWD) lengthTotal = lengthTotal + g_formValues.hWD.length
    if (g_formValues.hWC) lengthTotal = lengthTotal + g_formValues.hWC.length
    //
    //  Error
    //
    if (lengthTotal > 13) g_errorsUpd.hWC = `Hand has ${lengthTotal} cards`
  }
  //...................................................................................
  //
  // Validate the fields, if no fieldsValues then validate ALL
  //
  const validate = (fieldValues = values) => {
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
    valSpades(fieldValues)
    valHearts(fieldValues)
    valDiamonds(fieldValues)
    valClubs(fieldValues)
    //
    //  Validate Hands
    //
    valHandCount()
    //
    //  Set the errors
    //
    setErrors({
      ...g_errorsUpd
    })
    //
    //  Check if every element within the g_errorsUpd object is blank, then return true (valid), but only on submit when the fieldValues=values
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
  //
  //  Deconstruct props
  //
  const { hqid } = props
  initialFValues.hqid = hqid
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
        {/*------------------------------------------------------------------------------ */}
        <Grid item xs={2}>
          <MyInput name='hqid' label='ID' value={hqid} disabled={true} />
        </Grid>
        <Grid item xs={10}></Grid>
        {/*------------------------------------------------------------------------------ */}
        {/* North */}
        {/*------------------------------------------------------------------------------ */}
        <Grid item xs={3}>
          <MyInput
            name='hNS'
            label='North Spades'
            value={values.hNS}
            onChange={handleInputChange}
            error={errors.hNS}
          />
        </Grid>
        {/*------------------------------------------------------------------------------ */}
        <Grid item xs={3}>
          <MyInput
            name='hNH'
            label='North Hearts'
            value={values.hNH}
            onChange={handleInputChange}
            error={errors.hNH}
          />
        </Grid>
        {/*------------------------------------------------------------------------------ */}
        <Grid item xs={3}>
          <MyInput
            name='hND'
            label='North Diamonds'
            value={values.hND}
            onChange={handleInputChange}
            error={errors.hND}
          />
        </Grid>
        {/*------------------------------------------------------------------------------ */}
        <Grid item xs={3}>
          <MyInput
            name='hNC'
            label='North Clubs'
            value={values.hNC}
            onChange={handleInputChange}
            error={errors.hNC}
          />
        </Grid>
        {/*------------------------------------------------------------------------------ */}
        {/* East */}
        {/*------------------------------------------------------------------------------ */}
        <Grid item xs={3}>
          <MyInput
            name='hES'
            label='East Spades'
            value={values.hES}
            onChange={handleInputChange}
            error={errors.hES}
          />
        </Grid>
        {/*------------------------------------------------------------------------------ */}
        <Grid item xs={3}>
          <MyInput
            name='hEH'
            label='East Hearts'
            value={values.hEH}
            onChange={handleInputChange}
            error={errors.hEH}
          />
        </Grid>
        {/*------------------------------------------------------------------------------ */}
        <Grid item xs={3}>
          <MyInput
            name='hED'
            label='East Diamonds'
            value={values.hED}
            onChange={handleInputChange}
            error={errors.hED}
          />
        </Grid>
        {/*------------------------------------------------------------------------------ */}
        <Grid item xs={3}>
          <MyInput
            name='hEC'
            label='East Clubs'
            value={values.hEC}
            onChange={handleInputChange}
            error={errors.hEC}
          />
        </Grid>
        {/*------------------------------------------------------------------------------ */}
        {/* South */}
        {/*------------------------------------------------------------------------------ */}

        <Grid item xs={3}>
          <MyInput
            name='hSS'
            label='South Spades'
            value={values.hSS}
            onChange={handleInputChange}
            error={errors.hSS}
          />
        </Grid>
        {/*------------------------------------------------------------------------------ */}
        <Grid item xs={3}>
          <MyInput
            name='hSH'
            label='South Hearts'
            value={values.hSH}
            onChange={handleInputChange}
            error={errors.hSH}
          />
        </Grid>
        {/*------------------------------------------------------------------------------ */}
        <Grid item xs={3}>
          <MyInput
            name='hSD'
            label='South Diamonds'
            value={values.hSD}
            onChange={handleInputChange}
            error={errors.hSD}
          />
        </Grid>
        {/*------------------------------------------------------------------------------ */}
        <Grid item xs={3}>
          <MyInput
            name='hSC'
            label='South Clubs'
            value={values.hSC}
            onChange={handleInputChange}
            error={errors.hSC}
          />
        </Grid>
        {/*------------------------------------------------------------------------------ */}
        {/* West */}
        {/*------------------------------------------------------------------------------ */}
        <Grid item xs={3}>
          <MyInput
            name='hWS'
            label='West Spades'
            value={values.hWS}
            onChange={handleInputChange}
            error={errors.hWS}
          />
        </Grid>
        {/*------------------------------------------------------------------------------ */}
        <Grid item xs={3}>
          <MyInput
            name='hWH'
            label='West Hearts'
            value={values.hWH}
            onChange={handleInputChange}
            error={errors.hWH}
          />
        </Grid>
        {/*------------------------------------------------------------------------------ */}
        <Grid item xs={3}>
          <MyInput
            name='hWD'
            label='West Diamonds'
            value={values.hWD}
            onChange={handleInputChange}
            error={errors.hWD}
          />
        </Grid>
        {/*------------------------------------------------------------------------------ */}
        <Grid item xs={3}>
          <MyInput
            name='hWC'
            label='West Clubs'
            value={values.hWC}
            onChange={handleInputChange}
            error={errors.hWC}
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
