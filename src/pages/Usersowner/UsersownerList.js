//
//  Libraries
//
import { useState, useEffect } from 'react'
import PeopleOutlineTwoToneIcon from '@mui/icons-material/PeopleOutlineTwoTone'
import { Paper, TableBody, TableRow, TableCell, Toolbar, InputAdornment, Box } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import RefreshIcon from '@mui/icons-material/Refresh'
import FilterListIcon from '@mui/icons-material/FilterList'
//
//  Pages
//
import UsersownerEntry from './UsersownerEntry'
//
//  Controls
//
import MyActionButton from '../../components/controls/MyActionButton'
import MyButton from '../../components/controls/MyButton'
import MyInput from '../../components/controls/MyInput'
import MySelect from '../../components/controls/MySelect'
//
//  Components
//
import Notification from '../../components/Notification'
import ConfirmDialog from '../../components/ConfirmDialog'
import Popup from '../../components/Popup'
import PageHeader from '../../components/PageHeader'
import useMyTable from '../../components/useMyTable'
//
//  Services
//
import rowCrud from '../../utilities/rowCrud'
//
//  Debug Settings
//
import debugSettings from '../../debug/debugSettings'
//
//  Styles
//
const useStyles = makeStyles(theme => ({
  pageContent: {
    margin: theme.spacing(1),
    padding: theme.spacing(1)
  },
  searchInput: {
    minWidth: '300px',
    width: '30%'
  },
  searchInputTypeBox: {
    minWidth: '150px',
    width: '10%',
    margin: `0 0 0 ${theme.spacing(2)}`
  },
  myButton: {
    margin: `0 0 0 ${theme.spacing(4)}`
  },
  newButton: {
    position: 'absolute',
    right: '10px'
  }
}))
//
//  Table
//
const { SQL_ROWS } = require('../../services/constants.js')
const sqlTable = 'usersowner'
//
//  Table Heading
//
const headCells = [
  { id: 'uoid', label: 'Id' },
  { id: 'uouser', label: 'User' },
  { id: 'uoowner', label: 'Owner' },
  { id: 'actions', label: 'Actions', disableSorting: true }
]
const searchTypeOptions = [
  { id: 'uouser', title: 'User' },
  { id: 'uoowner', title: 'Owner' }
]
//
// Debug Settings
//
const debugLog = debugSettings()
const debugFunStart = false
const debugModule = 'UsersownerList'
//...................................................................................
//.  Main Line
//...................................................................................
export default function UsersownerList({ handlePage }) {
  if (debugFunStart) console.log(debugModule)
  //
  //  Styles
  //
  const classes = useStyles()
  //
  //  State
  //
  const [recordForEdit, setRecordForEdit] = useState(null)
  const [records, setRecords] = useState([])
  const [filterFn, setFilterFn] = useState({
    fn: items => {
      return items
    }
  })
  const [openPopup, setOpenPopup] = useState(false)
  const [searchType, setSearchType] = useState('uouser')
  const [searchValue, setSearchValue] = useState('')
  const [serverMessage, setServerMessage] = useState('')
  //
  //  Notification
  //
  const [notify, setNotify] = useState({
    isOpen: false,
    message: '',
    severity: 'info'
  })
  //
  //  Confirm Delete dialog box
  //
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    subTitle: ''
  })
  //
  //  Selection
  //
  const s_id = JSON.parse(sessionStorage.getItem('Selection_UserId'))
  const s_user = JSON.parse(sessionStorage.getItem('Selection_User'))
  let subTitle
  if (s_id) subTitle = `Selection: Id(${s_id}) User(${s_user})`
  //
  //  No User - disable add button
  //
  let hasId = false
  if (s_id) hasId = true
  //
  //  Initial Data Load
  //
  useEffect(() => {
    getRowAllData()
    // eslint-disable-next-line
  }, [])
  //
  //  Populate the Table
  //
  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } = useMyTable(
    records,
    headCells,
    filterFn
  )
  //.............................................................................
  //.  GET ALL
  //.............................................................................
  const getRowAllData = () => {
    if (debugFunStart) console.log('getRowAllData')
    //
    //  Process promise
    //
    let sqlString = `* from ${sqlTable}`
    if (s_id) sqlString = sqlString + ` where uoid = '${s_id}' `
    sqlString = sqlString + ` order by uoid, uoowner FETCH FIRST ${SQL_ROWS} ROWS ONLY`
    if (debugLog) console.log('sqlString ', sqlString)
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
      //  Update Table
      //
      setRecords(rtnObj.rtnRows)
      //
      //  Filter
      //
      handleSearch()
      return
    })
    //
    //  Return Promise
    //
    return myPromiseGet
  }
  //.............................................................................
  //.  DELETE
  //.............................................................................
  const deleteRowData = row => {
    if (debugFunStart) console.log('deleteRowData')
    const uoid = row.uoid
    const uoowner = row.uoowner
    //
    //  Process promise
    //
    const rowCrudparams = {
      axiosMethod: 'delete',
      sqlCaller: debugModule,
      sqlTable: sqlTable,
      sqlAction: 'DELETE',
      sqlWhere: `uoid = '${uoid}' and uoowner = '${uoowner}'`
    }
    const myPromiseDelete = rowCrud(rowCrudparams)
    //
    //  Resolve Status
    //
    myPromiseDelete.then(function (rtnObj) {
      if (debugLog) console.log('myPromiseDelete rtnObj ', rtnObj)
      //
      //  Update State - refetch data
      //
      getRowAllData()
      return
    })
    //
    //  Return Promise
    //
    return myPromiseDelete
  }
  //.............................................................................
  //.  INSERT
  //.............................................................................
  const insertRowData = data => {
    if (debugFunStart) console.log('insertRowData')
    //
    //  Data Received
    //
    if (debugLog) console.log('insertRowData data ', data)
    //
    //  Process promise
    //
    const rowCrudparams = {
      axiosMethod: 'post',
      sqlCaller: debugModule,
      sqlTable: sqlTable,
      sqlAction: 'INSERT',
      sqlKeyName: ['uoid', 'uoowner'],
      sqlRow: data
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
      setRecordForEdit(rtnData[0])
      if (debugLog) console.log(`recordForEdit `, recordForEdit)
      //
      //  Update State - refetch data
      //
      getRowAllData()
      return
    })
    //
    //  Return Promise
    //
    return myPromiseInsert
  }
  //.............................................................................
  //  Search/Filter
  //.............................................................................
  const handleSearch = () => {
    if (debugFunStart) console.log('handleSearch')
    setFilterFn({
      fn: items => {
        //
        //  Nothing to search, return rows
        //
        if (searchValue === '') {
          return items
        }
        //
        //  Filter
        //
        let itemsFilter = items
        switch (searchType) {
          case 'uouser':
            itemsFilter = items.filter(x =>
              x.uouser.toLowerCase().includes(searchValue.toLowerCase())
            )
            break
          case 'uoowner':
            itemsFilter = items.filter(x =>
              x.uoowner.toLowerCase().includes(searchValue.toLowerCase())
            )
            break
          default:
        }
        if (debugLog) console.log('itemsFilter ', itemsFilter)

        return itemsFilter
      }
    })
  }
  //.............................................................................
  //  Update Database
  //
  const addOrEdit = (row, resetForm) => {
    if (debugFunStart) console.log('addOrEdit')
    insertRowData(row)

    setNotify({
      isOpen: true,
      message: 'Submitted Successfully',
      severity: 'success'
    })
  }
  //.............................................................................
  //
  //  Delete Row
  //
  const onDelete = row => {
    if (debugFunStart) console.log('onDelete')
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    })
    deleteRowData(row)
    setNotify({
      isOpen: true,
      message: 'Deleted Successfully',
      severity: 'error'
    })
  }
  //.............................................................................
  //
  //  Data Entry Popup
  //
  const editRow = row => {
    if (debugFunStart) console.log('editRow')
    setServerMessage('')
    setRecordForEdit(row)
    setOpenPopup(true)
  }
  //.............................................................................
  //
  //  Data Entry Popup
  //
  const addRow = () => {
    if (debugFunStart) console.log('addRow')
    setServerMessage('')
    const row = {
      uoid: s_id,
      uouser: s_user,
      uoowner: null
    }
    setRecordForEdit(row)
    setOpenPopup(true)
  }
  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <>
      <PageHeader
        title='User Owners'
        subTitle={subTitle}
        icon={<PeopleOutlineTwoToneIcon fontSize='large' />}
      />
      <Paper className={classes.pageContent}>
        <Toolbar>
          <MyInput
            label='Search'
            name='Search'
            value={searchValue}
            className={classes.searchInput}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon />
                </InputAdornment>
              )
            }}
            onChange={e => setSearchValue(e.target.value)}
          />
          <Box className={classes.searchInputTypeBox}>
            <MySelect
              fullWidth={true}
              name='SearchType'
              label='Column Heading'
              value={searchType}
              onChange={e => setSearchType(e.target.value)}
              options={searchTypeOptions}
            />
          </Box>
          <MyButton
            text='Filter'
            variant='outlined'
            startIcon={<FilterListIcon />}
            onClick={handleSearch}
            className={classes.myButton}
          />
          <MyButton
            text='Refresh'
            variant='outlined'
            startIcon={<RefreshIcon />}
            onClick={getRowAllData}
            className={classes.myButton}
          />
          {hasId ? (
            <MyButton
              text='Add New'
              variant='outlined'
              startIcon={<AddIcon />}
              onClick={() => {
                addRow()
              }}
              className={classes.newButton}
            />
          ) : null}
        </Toolbar>
        <TblContainer>
          <TblHead />
          <TableBody>
            {recordsAfterPagingAndSorting().map(row => (
              <TableRow key={row.uoid + row.uoowner}>
                <TableCell>{row.uoid}</TableCell>
                <TableCell>{row.uouser}</TableCell>
                <TableCell>{row.uoowner}</TableCell>

                <TableCell>
                  <MyActionButton
                    startIcon={<CloseIcon fontSize='small' />}
                    color='secondary'
                    onClick={() => {
                      setConfirmDialog({
                        isOpen: true,
                        title: 'Are you sure to delete this record?',
                        subTitle: "You can't undo this operation",
                        onConfirm: () => {
                          onDelete(row)
                        }
                      })
                    }}
                  ></MyActionButton>
                  <MyActionButton
                    startIcon={<AddIcon fontSize='small' />}
                    color='primary'
                    onClick={() => {
                      editRow(row)
                    }}
                  ></MyActionButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TblContainer>
        <TblPagination />
      </Paper>
      {/* .......................................................................................... */}
      <MyButton
        type='submit'
        text='Back'
        color='warning'
        variant='contained'
        onClick={() => {
          handlePage('PAGEBACK')
        }}
      />
      {/* .......................................................................................... */}
      <Popup title='Usersowner Form' openPopup={openPopup} setOpenPopup={setOpenPopup}>
        <UsersownerEntry
          recordForEdit={recordForEdit}
          addOrEdit={addOrEdit}
          serverMessage={serverMessage}
        />
      </Popup>
      <Notification notify={notify} setNotify={setNotify} />
      <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
    </>
  )
}
