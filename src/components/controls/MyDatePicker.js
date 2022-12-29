//
//  Libraries
//
import { LocalizationProvider, DatePicker } from '@mui/lab'
import DateFnsUtils from '@date-io/date-fns'
import { TextField } from '@mui/material'
//=====================================================================================
export default function MyDatePicker(props) {
  const { name, label, value, onChange, ...other } = props
  //
  //  Convert the parameters to name, value parameters needed for onChange function
  //
  const convertToDefEventPara = (name, value) => ({
    target: {
      name,
      value
    }
  })

  return (
    <LocalizationProvider utils={DateFnsUtils}>
      <DatePicker
        disableToolbar
        variant='inline'
        inputVariant='outlined'
        label={label}
        format='MMM/dd/yyyy'
        name={name}
        value={value}
        {...other}
        onChange={date => onChange(convertToDefEventPara(name, date))}
        renderInput={params => <TextField {...params} />}
      />
    </LocalizationProvider>
  )
}
