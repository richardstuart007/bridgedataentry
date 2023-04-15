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
//  Questions Table
//
const { SQL_ROWS } = require('../../services/constants.js')
const AxTable = 'questions'
//
//  Table Heading
//
const headCells = [
  { id: 'qqid', label: 'ID' },
  { id: 'qowner', label: 'Owner' },
  { id: 'qgroup', label: 'Owner Group' },
  { id: 'qseq', label: 'Seq' },
  { id: 'qdetail', label: 'Question' },
  { id: 'actions', label: 'Actions', disableSorting: true }
]
const searchTypeOptions = [
  { id: 'qqid', title: 'ID' },
  { id: 'qowner', title: 'Owner' },
  { id: 'qgroup', title: 'Owner Group' },
  { id: 'qdetail', title: 'Question' }
]
//
// Debug Settings
//
const debugModule = 'QuestionList'
//...................................................................................
//.  Main Line
//...................................................................................
export default function QuestionList({ handlePage }) {
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
  //  Selection
  //
  const s_owner = JSON.parse(sessionStorage.getItem('Selection_Owner'))
  const s_group = JSON.parse(sessionStorage.getItem('Selection_OwnerGroup'))
  let subTitle = 'Selection:'
  s_owner ? (subTitle = subTitle + ` Owner(${s_owner})`) : (subTitle = subTitle + ` Owner(ALL)`)
  s_group ? (subTitle = subTitle + ` Group(${s_group})`) : (subTitle = subTitle + ` Group(ALL)`)
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
    //
    //  SQL String
    //
    let AxString = `* from ${AxTable}`
    if (s_owner || s_group) {
      AxString = AxString + ` where`
      if (s_owner) AxString = AxString + ` qowner = '${s_owner}'`
      if (s_owner && s_group) AxString = AxString + ` and`
      if (s_group) AxString = AxString + ` qgroup = '${s_group}'`
    }
    AxString = AxString + ` order by qowner, qgroup, qseq FETCH FIRST ${SQL_ROWS} ROWS ONLY`
    //
    //  Process promise
    //
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
  function deleteRowData(qqid) {
    //
    //  Process promise
    //
    const rowCrudparams = {
      AxMethod: 'delete',
      AxCaller: debugModule,
      AxTable: AxTable,
      AxAction: 'DELETE',
      AxWhere: `qqid = ${qqid}`
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
  function insertRowData(data) {
    //
    //  Strip out KEY as it will be populated by Insert
    //
    let { qqid, ...nokeyData } = data
    //
    //  Process promise
    //
    const rowCrudparams = {
      AxMethod: 'post',
      AxCaller: debugModule,
      AxTable: AxTable,
      AxAction: 'INSERT',
      AxKeyName: ['qowner', 'qgroup', 'qseq'],
      AxRow: nokeyData
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
  //.  UPDATE
  //.............................................................................
  function updateRowData(data) {
    //
    //  Strip out KEY as it is not updated
    //
    let { qqid, qowner, qgroup, qseq, ...nokeyData } = data
    //
    //  Process promise
    //
    const rowCrudparams = {
      AxMethod: 'post',
      AxCaller: debugModule,
      AxTable: AxTable,
      AxAction: 'UPDATE',
      AxWhere: `qqid = ${qqid}`,
      AxRow: nokeyData
    }
    const myPromiseUpdate = rowCrud(rowCrudparams)
    //
    //  Resolve Status
    //
    myPromiseUpdate.then(function (rtnObj) {
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
    return myPromiseUpdate
  }
  //.............................................................................
  //  Search/Filter
  //.............................................................................
  function handleSearch() {
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
          case 'qqid':
            itemsFilter = items.filter(x => x.qqid === parseInt(searchValue))
            break
          case 'qowner':
            itemsFilter = items.filter(x =>
              x.qowner.toLowerCase().includes(searchValue.toLowerCase())
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
    row.qqid === 0 ? insertRowData(row) : updateRowData(row)

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
    setServerMessage('')
    setRecordForEdit(row)
    setOpenPopup(true)
  }
  //.............................................................................
  //  Delete Row
  //.............................................................................
  const onDelete = qqid => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    })
    deleteRowData(qqid)
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
              <TableRow key={row.qqid}>
                <TableCell>{row.qqid}</TableCell>
                <TableCell>{row.qowner}</TableCell>
                <TableCell>{row.qgroup}</TableCell>
                <TableCell>{row.qseq}</TableCell>
                <TableCell>{row.qdetail}</TableCell>

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
                          onDelete(row.qqid)
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
      <Popup title='Question Form' openPopup={openPopup} setOpenPopup={setOpenPopup}>
        <QuestionEntry
          recordForEdit={recordForEdit}
          addOrEdit={addOrEdit}
          serverMessage={serverMessage}
          s_owner={s_owner}
          s_group={s_group}
        />
      </Popup>
      <Notification notify={notify} setNotify={setNotify} />
      <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
    </>
  )
}
