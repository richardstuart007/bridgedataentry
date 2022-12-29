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
import Group2Entry from './Group2Entry'
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
//  Options
//
import createOptions from '../../utilities/createOptions'
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
//  Group2 Table
//
const { SQL_ROWS } = require('../../services/constants.js')
const sqlTable = 'group2'
//
//  Table Heading
//
const headCells = [
  { id: 'g2id', label: 'Group2' },
  { id: 'g2title', label: 'Title' },
  { id: 'actions', label: 'Actions', disableSorting: true }
]
const searchTypeOptions = [
  { id: 'g2id', title: 'Group2' },
  { id: 'g2title', title: 'Title' }
]
//
// Debug Settings
//
const debugLog = debugSettings()
const debugFunStart = false
const debugModule = 'Group2List'
//=====================================================================================
export default function Group2List() {
  //.............................................................................
  //.  GET ALL
  //.............................................................................
  const getRowAllData = () => {
    if (debugFunStart) console.log('getRowAllData')
    //
    //  Process promise
    //
    let sqlString = `* from ${sqlTable} order by g2id FETCH FIRST ${SQL_ROWS} ROWS ONLY`
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
  const deleteRowData = g2id => {
    if (debugFunStart) console.log('deleteRowData')
    //
    //  Process promise
    //
    const rowCrudparams = {
      axiosMethod: 'delete',
      sqlCaller: debugModule,
      sqlTable: sqlTable,
      sqlAction: 'DELETE',
      sqlWhere: `g2id = '${g2id}'`
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
      updateOptions()
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
      sqlKeyName: ['g2id'],
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
      updateOptions()
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
  const updateRowData = data => {
    if (debugFunStart) console.log('updateRowData')
    //
    //  Data Received
    //
    if (debugLog) console.log('updateRowData Row ', data)
    //
    //  Strip out KEY as it is not updated
    //
    let { g2id, ...nokeyData } = data
    //
    //  Process promise
    //
    const rowCrudparams = {
      axiosMethod: 'post',
      sqlCaller: debugModule,
      sqlTable: sqlTable,
      sqlAction: 'UPDATE',
      sqlWhere: `g2id = '${g2id}'`,
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
      updateOptions()
      return
    })
    //
    //  Return Promise
    //
    return myPromiseUpdate
  }
  //.............................................................................
  //  Update the Options
  //.............................................................................
  function updateOptions() {
    //
    //  Create options
    //
    createOptions({
      cop_sqlTable: 'group2',
      cop_id: 'g2id',
      cop_title: 'g2title',
      cop_store: 'Data_Options_Group2',
      cop_received: 'Data_Options_Group2_Received'
    })
  }
  //.............................................................................
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
  const [searchType, setSearchType] = useState('g2id')
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
  //.............................................................................
  //
  //  Search/Filter
  //
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
          case 'g2id':
            itemsFilter = items.filter(x =>
              x.g2id.toLowerCase().includes(searchValue.toLowerCase())
            )
            break
          case 'g2title':
            itemsFilter = items.filter(x =>
              x.g2title.toLowerCase().includes(searchValue.toLowerCase())
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
  //
  //  Update Database
  //
  const addOrEdit = (row, resetForm) => {
    if (debugFunStart) console.log('addOrEdit')
    recordForEdit === null ? insertRowData(row) : updateRowData(row)

    setNotify({
      isOpen: true,
      message: 'Submitted Successfully',
      severity: 'success'
    })
  }
  //.............................................................................
  //
  //  Data Entry Popup
  //
  const openInPopup = row => {
    if (debugFunStart) console.log('openInPopup')
    setServerMessage('')
    setRecordForEdit(row)
    setOpenPopup(true)
  }
  //.............................................................................
  //
  //  Delete Row
  //
  const onDelete = g2id => {
    if (debugFunStart) console.log('onDelete')
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    })
    deleteRowData(g2id)
    setNotify({
      isOpen: true,
      message: 'Deleted Successfully',
      severity: 'error'
    })
  }
  //...................................................................................
  //.  Main Line
  //...................................................................................

  if (debugFunStart) console.log(debugModule)
  //
  //  Initial Data Load
  //
  useEffect(() => {
    getRowAllData()
    // eslint-disable-next-line
  }, [])
  //.............................................................................
  //
  //  Populate the Table
  //
  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } = useMyTable(
    records,
    headCells,
    filterFn
  )
  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <>
      <PageHeader
        title='Group2'
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
              <TableRow key={row.g2id}>
                <TableCell>{row.g2id}</TableCell>
                <TableCell>{row.g2title}</TableCell>

                <TableCell>
                  <MyActionButton
                    startIcon={<EditOutlinedIcon />}
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
                          onDelete(row.g2id)
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
      <Popup title='Group2 Form' openPopup={openPopup} setOpenPopup={setOpenPopup}>
        <Group2Entry
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
