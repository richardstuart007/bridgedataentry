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
import PageHeader from '../../components/controls/PageHeader'
import useMyTable from '../../components/controls/useMyTable'
//
//  Services
//
import rowCrud from '../../utilities/rowCrud'
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
const AxTable = 'usersowner'
//
//  Table Heading
//
const headCells = [
  { id: 'uouid', label: 'Id' },
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
const debugModule = 'UsersownerList'
//...................................................................................
//.  Main Line
//...................................................................................
export default function UsersownerList({ handlePage }) {
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
    //
    //  Process promise
    //
    let AxString = `* from ${AxTable}`
    if (s_id) AxString = AxString + ` where uouid = '${s_id}' `
    AxString = AxString + ` order by uouid, uoowner FETCH FIRST ${SQL_ROWS} ROWS ONLY`
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
    const uouid = row.uouid
    const uoowner = row.uoowner
    //
    //  Process promise
    //
    const rowCrudparams = {
      AxMethod: 'delete',
      AxCaller: debugModule,
      AxTable: AxTable,
      AxAction: 'DELETE',
      AxWhere: `uouid = '${uouid}' and uoowner = '${uoowner}'`
    }
    const myPromiseDelete = rowCrud(rowCrudparams)
    //
    //  Resolve Status
    //
    myPromiseDelete.then(function (rtnObj) {
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
    //
    //  Process promise
    //
    const rowCrudparams = {
      AxMethod: 'post',
      AxCaller: debugModule,
      AxTable: AxTable,
      AxAction: 'INSERT',
      AxKeyName: ['uouid', 'uoowner'],
      AxRow: data
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
      setRecordForEdit(rtnData[0])
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

        return itemsFilter
      }
    })
  }
  //.............................................................................
  //  Update Database
  //
  const addOrEdit = (row, resetForm) => {
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
    setServerMessage('')
    setRecordForEdit(row)
    setOpenPopup(true)
  }
  //.............................................................................
  //
  //  Data Entry Popup
  //
  const addRow = () => {
    setServerMessage('')
    const row = {
      uouid: s_id,
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
              <TableRow key={row.uouid + row.uoowner}>
                <TableCell>{row.uouid}</TableCell>
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
                    onClick={() => editRow(row)}
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
      <MyButton
        type='submit'
        text='Re-Start'
        color='warning'
        variant='contained'
        onClick={() => handlePage('PAGESTART')}
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
