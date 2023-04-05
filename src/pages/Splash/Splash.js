//
//  Libraries
//
import { useState, useEffect } from 'react'
import { Paper, Grid, Typography } from '@mui/material'
//
//  Utilities
//
import apiAxios from '../../utilities/apiAxios'
import writeSession from '../../services/writeSession'
import createOptionsAll from '../../services/createOptionsAll'
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
    setForm_message('Checking the server')
    const myPromiseHelloServer = Hello()
    myPromiseHelloServer.then(function (rtnObj) {
      if (debugLog) console.log(consoleLogTime(debugModule, 'rtnObj'), { ...rtnObj })
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
  }
  //--------------------------------------------------------------------
  //-  Check The Server/Database
  //--------------------------------------------------------------------
  async function Hello() {
    //
    //  Get the URL
    //
    const App_URL = JSON.parse(sessionStorage.getItem('App_URL'))
    if (debugLog) console.log(consoleLogTime(debugModule, 'App_URL'), App_URL)
    let body
    //
    // Fetch the data
    //
    try {
      //
      //  Setup actions
      //
      const method = 'post'
      body = {
        sqlClient: debugModule,
        sqlTable: 'dbstats'
      }
      const URL = App_URL + URL_HELLO
      if (debugLog) console.log(consoleLogTime(debugModule, 'URL'), URL)
      //
      //  Timeout
      //
      let timeout = 2000
      //
      //  Info
      //
      const info = `Client(${debugModule}) Action(Hello)`
      //
      //  SQL database
      //
      const rtnObj = await apiAxios(method, URL, body, timeout, info)
      return rtnObj
      //
      // Errors
      //
    } catch (err) {
      if (debugLog) console.log(consoleLogTime(debugModule, 'Catch err'), { ...err })
      const rtnObj = {
        rtnBodyParms: body,
        rtnValue: false,
        rtnMessage: '',
        rtnSqlFunction: debugModule,
        rtnCatchFunction: debugModule,
        rtnCatch: true,
        rtnCatchMsg: 'Catch calling apiAxios',
        rtnRows: []
      }
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
                onClick={() => {
                  writeSession()
                  createOptionsAll()
                  handlePage('OwnerList')
                }}
              />
            </Grid>
          ) : null}
          {/*.................................................................................................*/}
        </Grid>
      </Paper>
    </>
  )
}
