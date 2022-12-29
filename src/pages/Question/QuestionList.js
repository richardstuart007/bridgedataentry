//
//  Libraries
//
import { useState, useEffect } from 'react'
import PeopleOutlineTwoToneIcon from '@mui/icons-material/PeopleOutlineTwoTone'
import { Paper, TableBody, TableRow, TableCell, Toolbar, InputAdornment, Box } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import CloseIcon from '@mui/icons-material/Close'
import RefreshIcon from '@mui/icons-material/Refresh'
import FilterListIcon from '@mui/icons-material/FilterList'
//
//  Pages
//
import QuestionEntry from './QuestionEntry'
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
//  Questions Table
//
const { SQL_ROWS } = require('../../services/constants.js')
const sqlTable = 'questions'
//
//  Table Heading
//
const headCells = [
  { id: 'qid', label: 'ID' },
  { id: 'qowner', label: 'Owner' },
  { id: 'qkey', label: 'Key' },
  { id: 'qdetail', label: 'Question' },
  { id: 'qgroup', label: 'Owner Group' },
  { id: 'qgroup2', label: 'Group 2' },
  { id: 'qgroup3', label: 'Group 3' },
  { id: 'actions', label: 'Actions', disableSorting: true }
]
const searchTypeOptions = [
  { id: 'qid', title: 'ID' },
  { id: 'qowner', title: 'Owner' },
  { id: 'qkey', title: 'Key' },
  { id: 'qdetail', title: 'Question' },
  { id: 'qgroup', title: 'Owner Group' },
  { id: 'qgroup2', title: 'Group 2' },
  { id: 'qgroup3', title: 'Group 3' }
]
//
// Debug Settings
//
const debugLog = debugSettings()
const debugFunStart = false
const debugModule = 'QuestionList'
//...................................................................................
//.  Main Line
//...................................................................................
export default function QuestionList() {
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
  const [searchType, setSearchType] = useState('qdetail')
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
  function getRowAllData() {
    if (debugFunStart) console.log('getRowAllData')
    //
    //  Process promise
    //
    let sqlString = `* from ${sqlTable} order by qid FETCH FIRST ${SQL_ROWS} ROWS ONLY`
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
  function deleteRowData(qid) {
    if (debugFunStart) console.log('deleteRowData')
    //
    //  Process promise
    //
    const rowCrudparams = {
      axiosMethod: 'delete',
      sqlCaller: debugModule,
      sqlTable: sqlTable,
      sqlAction: 'DELETE',
      sqlWhere: `qid = ${qid}`
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
  function insertRowData(data) {
    if (debugFunStart) console.log('insertRowData')
    if (debugLog) console.log('insertRowData data ', data)
    //
    //  Strip out KEY as it will be populated by Insert
    //
    let { qid, ...nokeyData } = data
    if (debugLog) console.log('Upsert Database nokeyData ', nokeyData)
    //
    //  Process promise
    //
    const rowCrudparams = {
      axiosMethod: 'post',
      sqlCaller: debugModule,
      sqlTable: sqlTable,
      sqlAction: 'INSERT',
      sqlKeyName: ['qowner', 'qkey'],
      sqlRow: nokeyData
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
  //.  UPDATE
  //.............................................................................
  function updateRowData(data) {
    if (debugFunStart) console.log('updateRowData')
    if (debugLog) console.log('Upsert Database data ', data)
    //
    //  Strip out KEY as it is not updated
    //
    let { qid, ...nokeyData } = data
    if (debugLog) console.log('Upsert Database nokeyData ', nokeyData)
    //
    //  Process promise
    //
    const rowCrudparams = {
      axiosMethod: 'post',
      sqlCaller: debugModule,
      sqlTable: sqlTable,
      sqlAction: 'UPDATE',
      sqlWhere: `qid = ${qid}`,
      sqlRow: nokeyData
    }
    const myPromiseUpdate = rowCrud(rowCrudparams)
    //
    //  Resolve Status
    //
    myPromiseUpdate.then(function (rtnObj) {
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
    return myPromiseUpdate
  }
  //.............................................................................
  //  Search/Filter
  //.............................................................................
  function handleSearch() {
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
          case 'qid':
            itemsFilter = items.filter(x => x.qid === parseInt(searchValue))
            break
          case 'qowner':
            itemsFilter = items.filter(x =>
              x.qowner.toLowerCase().includes(searchValue.toLowerCase())
            )
            break
          case 'qkey':
            itemsFilter = items.filter(x =>
              x.qkey.toLowerCase().includes(searchValue.toLowerCase())
            )
            break
          case 'qdetail':
            itemsFilter = items.filter(x =>
              x.qdetail.toLowerCase().includes(searchValue.toLowerCase())
            )
            break
          case 'qgroup':
            itemsFilter = items.filter(x =>
              x.qgroup.toLowerCase().includes(searchValue.toLowerCase())
            )
            break
          case 'qgroup2':
            itemsFilter = items.filter(x =>
              x.qgroup2.toLowerCase().includes(searchValue.toLowerCase())
            )
            break
          case 'qgroup3':
            itemsFilter = items.filter(x =>
              x.qgroup3.toLowerCase().includes(searchValue.toLowerCase())
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
  //.............................................................................
  function addOrEdit(row, resetForm) {
    if (debugFunStart) console.log('addOrEdit')
    row.qid === 0 ? insertRowData(row) : updateRowData(row)

    setNotify({
      isOpen: true,
      message: 'Submitted Successfully',
      severity: 'success'
    })
  }
  //.............................................................................
  //  Data Entry Popup
  //.............................................................................
  const openInPopup = row => {
    if (debugFunStart) console.log('openInPopup')
    setServerMessage('')
    setRecordForEdit(row)
    setOpenPopup(true)
  }
  //.............................................................................
  //  Delete Row
  //.............................................................................
  const onDelete = qid => {
    if (debugFunStart) console.log('onDelete')
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    })
    deleteRowData(qid)
    setNotify({
      isOpen: true,
      message: 'Deleted Successfully',
      severity: 'error'
    })
  }
  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <>
      <PageHeader
        title='Questions'
        subTitle='Data Entry and Maintenance'
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

          <MyButton
            text='Add New'
            variant='outlined'
            startIcon={<AddIcon />}
            className={classes.newButton}
            onClick={() => {
              setServerMessage('')
              setOpenPopup(true)
              setRecordForEdit(null)
            }}
          />
        </Toolbar>
        <TblContainer>
          <TblHead />
          <TableBody>
            {recordsAfterPagingAndSorting().map(row => (
              <TableRow key={row.qid}>
                <TableCell>{row.qid}</TableCell>
                <TableCell>{row.qowner}</TableCell>
                <TableCell>{row.qkey}</TableCell>
                <TableCell>{row.qdetail}</TableCell>
                <TableCell>{row.qgroup}</TableCell>
                <TableCell>{row.qgroup2}</TableCell>
                <TableCell>{row.qgroup3}</TableCell>
                <TableCell>
                  <MyActionButton
                    startIcon={<EditOutlinedIcon fontSize='small' />}
                    color='primary'
                    onClick={() => {
                      openInPopup(row)
                    }}
                  ></MyActionButton>
                  <MyActionButton
                    startIcon={<CloseIcon fontSize='small' />}
                    color='secondary'
                    onClick={() => {
                      setConfirmDialog({
                        isOpen: true,
                        title: 'Are you sure to delete this record?',
                        subTitle: "You can't undo this operation",
                        onConfirm: () => {
                          onDelete(row.qid)
                        }
                      })
                    }}
                  ></MyActionButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TblContainer>
        <TblPagination />
      </Paper>
      <Popup title='Question Form' openPopup={openPopup} setOpenPopup={setOpenPopup}>
        <QuestionEntry
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
