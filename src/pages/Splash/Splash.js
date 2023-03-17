//
//  Libraries
//
import { useState, useEffect } from 'react'
import { Paper, Grid, Typography } from '@mui/material'
//
//  Utilities
//
import apiAxios from '../../utilities/apiAxios'
//
//  Controls
//
import MyButton from '../../components/controls/MyButton'
//
//  Debug Settings
//
import debugSettings from '../../debug/debugSettings'
import consoleLogTime from '../../debug/consoleLogTime'
const debugLog = debugSettings()
const debugModule = 'Splash'
//
// Constants
//
const { URL_HELLO } = require('../../services/constants.js')
//
//  Object returned by this handler - as per server
//
let rtnObj = {
  rtnValue: false,
  rtnMessage: '',
  rtnSqlFunction: debugModule,
  rtnCatchFunction: '',
  rtnCatch: false,
  rtnCatchMsg: '',
  rtnRows: []
}
//===================================================================================
export default function Splash({ handlePage }) {
  if (debugLog) console.log(consoleLogTime(debugModule, 'Start'))
  //
  // State
  //
  const [form_message, setForm_message] = useState('')
  const [showContinue, setshowContinue] = useState(false)
  const [showConnect, setshowConnect] = useState(false)
  //
  //  Say Hello to server
  //
  useEffect(() => {
    sayHello(false)
    // eslint-disable-next-line
  }, [])
  //...................................................................................
  //.  Check Server is responding
  //...................................................................................
  function sayHello(maint) {
    if (debugLog) console.log(consoleLogTime(debugModule, 'sayHello'))
    //
    //  Check if errors
    //
    const App_Server = JSON.parse(sessionStorage.getItem('App_Server'))
    if (App_Server === 'Error') {
      setForm_message('Invalid Setup parameters')
      return
    }
    //
    //  Hide buttons
    //
    setshowContinue(false)
    setshowConnect(false)
    //-----------------
    //  Check SERVER
    //-----------------
    const myPromiseHelloServer = Hello('SERVER')
    myPromiseHelloServer.then(function (rtnObj) {
      if (debugLog) console.log(consoleLogTime(debugModule, 'rtnObj'), rtnObj)
      //
      //  Error
      //
      const rtnValue = rtnObj.rtnValue
      if (!rtnValue) {
        let message
        rtnObj.rtnCatch ? (message = rtnObj.rtnCatchMsg) : (message = rtnObj.rtnMessage)
        if (debugLog) console.log(consoleLogTime(debugModule, 'Error Message'), message)
        setForm_message(message)
        setshowConnect(true)
        return
      }
      //-----------------
      //  Check DATABASE
      //-----------------
      const myPromiseHelloDatabase = Hello('DATABASE')
      myPromiseHelloDatabase.then(function (rtnObj) {
        if (debugLog) console.log(consoleLogTime(debugModule, 'rtnObj'), rtnObj)
        //
        //  Error
        //
        const rtnValue = rtnObj.rtnValue
        if (!rtnValue) {
          let message
          rtnObj.rtnCatch ? (message = rtnObj.rtnCatchMsg) : (message = rtnObj.rtnMessage)
          if (debugLog) console.log(consoleLogTime(debugModule, 'Error Message'), message)
          setForm_message(message)
          setshowConnect(true)
          return
        }
        //-----------------
        //  OK
        //-----------------
        if (maint) handlePage('OwnerList')
        else {
          setForm_message('')
          setshowContinue(true)
        }
      })
    })
  }
  //--------------------------------------------------------------------
  //-  Check The Server/Database
  //--------------------------------------------------------------------
  async function Hello(helloType) {
    //
    //  Initialise Values
    //
    rtnObj.rtnValue = false
    rtnObj.rtnMessage = ''
    rtnObj.rtnSqlFunction = debugModule
    rtnObj.rtnCatchFunction = ''
    rtnObj.rtnCatch = false
    rtnObj.rtnCatchMsg = ''
    rtnObj.rtnRows = []
    //
    //  Get the URL
    //
    const App_URL = JSON.parse(sessionStorage.getItem('App_URL'))
    if (debugLog) console.log(consoleLogTime(debugModule, 'App_URL'), App_URL)
    //
    // Fetch the data
    //
    try {
      //
      //  Setup actions
      //
      const method = 'post'
      let body = {
        sqlClient: debugModule,
        helloType: helloType
      }
      const URL = App_URL + URL_HELLO
      if (debugLog) console.log(consoleLogTime(debugModule, 'URL'), URL)
      //
      //  Timeout
      //
      let timeout
      helloType === 'SERVER' ? (timeout = 2000) : (timeout = 1200)
      //
      //  Info
      //
      const info = `Client(${debugModule}) Action(${helloType})`
      //
      //  SQL database
      //
      rtnObj = await apiAxios(method, URL, body, timeout, info)
      return rtnObj
      //
      // Errors
      //
    } catch (err) {
      if (debugLog) console.log(consoleLogTime(debugModule, 'Catch err'), err)
      return rtnObj
    }
  }
  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <>
      <Paper
        sx={{
          margin: 3,
          padding: 1,
          maxWidth: 350,
          backgroundColor: 'whitesmoke',
          elevation: 12
        }}
      >
        <Grid
          container
          spacing={1}
          justify='center'
          alignItems='center'
          direction='column'
          style={{ minheight: '100vh' }}
        >
          {/*.................................................................................................*/}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography variant='h6' style={{ color: 'blue' }}>
              Splash Information
            </Typography>
          </Grid>
          {/*.................................................................................................*/}
          <Grid item xs={12}>
            <Typography style={{ color: 'red' }}>{form_message}</Typography>
          </Grid>
          {/*.................................................................................................*/}
          {showConnect ? (
            <Grid item xs={12}>
              <MyButton
                type='submit'
                text='Retry Connection'
                value='Submit'
                onClick={() => sayHello(true)}
              />
            </Grid>
          ) : null}
          {/*.................................................................................................*/}
          {showContinue ? (
            <Grid item xs={12}>
              <MyButton
                type='submit'
                text='OwnerList'
                value='Submit'
                onClick={() => handlePage('OwnerList')}
              />
            </Grid>
          ) : null}
          {/*.................................................................................................*/}
        </Grid>
      </Paper>
    </>
  )
}
