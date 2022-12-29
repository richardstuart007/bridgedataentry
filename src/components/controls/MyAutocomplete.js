import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import makeStyles from '@mui/styles/makeStyles'
//
//  Debug Settings
//
import debugSettings from '../../debug/debugSettings'
//
// Debug Settings
//
const debugLog = debugSettings()
//
//  Styles
//
const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: 'azure'
  }
}))
//...................................................................................
//.  Main Line
//...................................................................................
export default function MyAutocomplete(props) {
  //
  //  Deconstruct
  //
  const { searchLable, onChange, fieldname, optionId, options, required, fullWidth, className } =
    props
  if (debugLog) console.log(props)
  //
  //  Styles
  //
  const classes = useStyles()
  //
  //  Classes
  //
  let classNames = classes.root
  if (className) classNames = classNames + ` ${className}`
  //
  //  Add empty element
  //
  let w_options = { ...options }
  if (!required) {
    const NoSelect = [{ id: '', title: '' }]
    w_options = NoSelect.concat(options)
  }
  if (debugLog) console.log('w_options ', w_options)
  //
  //  Object
  //
  let Obj = { id: '', title: '' }
  if (optionId) {
    Obj = w_options.find(obj => obj.id === optionId)
  }
  if (debugLog) console.log('Obj ', Obj)
  //
  //  State
  //
  const [selectedObj, setSelectedObj] = useState(Obj)
  const [inputValue, setInputValue] = useState(Obj.title)
  //
  //  On change of record, set State
  //
  useEffect(() => {
    setSelectedObj(Obj)
    setInputValue(Obj.title)
    // eslint-disable-next-line
  }, [optionId])
  if (debugLog) console.log('selectedObj ', selectedObj)
  if (debugLog) console.log('inputValue ', inputValue)
  //...................................................................................
  //  Render
  //...................................................................................
  return (
    <Autocomplete
      value={selectedObj}
      onChange={(event, newSelected) => {
        setSelectedObj(newSelected)
        if (newSelected) {
          if (debugLog) console.log('newSelected ', newSelected)
          onChange(newSelected.id, fieldname)
        }
      }}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue)
        if (debugLog) console.log('newInputValue ', newInputValue)
      }}
      id='myAutocomplete'
      // sx={{ width: 300 }}
      options={w_options}
      autoHighlight
      fullWidth={fullWidth}
      getOptionLabel={option => option.title}
      isOptionEqualToValue={(option, value) => option.title === value.title}
      noOptionsText={'No match'}
      renderOption={(props, option) => (
        <Box component='li' {...props}>
          {option.title} ({option.id})
        </Box>
      )}
      renderInput={params => (
        <TextField
          className={classNames}
          {...params}
          label={searchLable}
          inputProps={{
            ...params.inputProps,
            autoComplete: 'new-password' // disable autocomplete and autofill
          }}
        />
      )}
    />
  )
}
