import { useState } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
//
//  Debug Settings
//
import debugSettings from '../../debug/debugSettings'
//
// Debug Settings
//
const debugLog = debugSettings()
//...................................................................................
//.  Main Line
//...................................................................................
export default function SelectCountry(props) {
  //
  //  Deconstruct
  //
  const { label, onChange, countryCode } = props
  if (debugLog) console.log('props ', props)
  //
  //  Countries
  //
  const { COUNTRIES } = require('../../services/countries.js')
  let countryObj = COUNTRIES.find(country => country.code === countryCode)
  if (!countryObj) {
    countryObj = { code: 'ZZ', label: 'World', phone: '999' }
  }
  if (debugLog) console.log('countryObj ', countryObj)
  //
  //  State
  //
  const [selected, setSelected] = useState(countryObj)
  const [inputValue, setInputValue] = useState(countryObj.label)
  if (debugLog) console.log('selected ', selected)
  if (debugLog) console.log('inputValue ', inputValue)
  //...................................................................................
  //  Render
  //...................................................................................
  return (
    <Autocomplete
      value={selected}
      onChange={(event, newSelected) => {
        setSelected(newSelected)
        if (newSelected) {
          if (debugLog) console.log('newSelected ', newSelected)
          onChange(newSelected.code)
        }
      }}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue)
        if (debugLog) console.log('newInputValue ', newInputValue)
      }}
      id='country-select'
      sx={{ width: 300 }}
      options={COUNTRIES}
      autoHighlight
      getOptionLabel={option => option.label}
      isOptionEqualToValue={(option, value) => option.label === value.label}
      noOptionsText={'No match'}
      renderOption={(props, option) => (
        <Box component='li' sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
          <img
            loading='lazy'
            width='20'
            src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
            srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
            alt=''
          />
          {option.label} ({option.code}) +{option.phone}
        </Box>
      )}
      renderInput={params => (
        <TextField
          {...params}
          label={label}
          inputProps={{
            ...params.inputProps,
            autoComplete: 'new-password' // disable autocomplete and autofill
          }}
        />
      )}
    />
  )
}
