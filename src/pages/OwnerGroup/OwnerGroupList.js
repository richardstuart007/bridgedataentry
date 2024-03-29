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
import QuizIcon from '@mui/icons-material/Quiz'
//
//  Pages
//
import OwnerGroupEntry from './OwnerGroupEntry'
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
//  Options
//
import createOptions from '../../utilities/createOptions'
//
//  Debug Settings
//
import debugSettings from '../../debug/debugSettings'
import consoleLogTime from '../../debug/consoleLogTime'
const debugLog = debugSettings()
const debugModule = 'OwnerGroupList'
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
//  ownergroup Table
//
const { SQL_ROWS } = require('../../services/constants.js')
const AxTable = 'ownergroup'
//
//  Table Heading
//
const headCells = [
  { id: 'ogowner', label: 'Owner' },
  { id: 'oggroup', label: 'Group' },
  { id: 'ogtitle', label: 'Title' },
  { id: 'ogcntlibrary', label: 'Library' },
  { id: 'ogcntquestions', label: 'Questions' },
  { id: 'actions', label: 'Actions', disableSorting: true }
]
const searchTypeOptions = [
  { id: 'ogowner', title: 'Owner' },
  { id: 'oggroup', title: 'Group' },
  { id: 'ogtitle', title: 'Title' }
]
//...................................................................................
//.  Main Line
//...................................................................................
export default function OwnerGroupList({ handlePage }) {
  if (debugLog) console.log(consoleLogTime(debugModule, 'Start'))
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
  const [searchType, setSearchType] = useState('oggroup')
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
  //  Owner Selected ?
  //
  const s_owner = JSON.parse(sessionStorage.getItem('Selection_Owner'))
  let subTitle
  s_owner ? (subTitle = `Owner: ${s_owner}`) : (subTitle = `All owners`)
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
    let AxString = `*, concat(ogowner,oggroup) as ogkey from ${AxTable}`
    if (s_owner) AxString = AxString + ` where ogowner = '${s_owner}'`
    AxString = AxString + ` order by ogowner, oggroup FETCH FIRST ${SQL_ROWS} ROWS ONLY`
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
  function deleteRowData(ogowner, oggroup) {
    //
    //  Process promise
    //
    const rowCrudparams = {
      AxMethod: 'delete',
      AxCaller: debugModule,
      AxTable: AxTable,
      AxAction: 'DELETE',
      AxWhere: `ogowner = '${ogowner}' and oggroup = '${oggroup}'`
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
    //
    //  Process promise
    //
    const rowCrudparams = {
      AxMethod: 'post',
      AxCaller: debugModule,
      AxTable: AxTable,
      AxAction: 'INSERT',
      AxKeyName: ['ogowner', 'oggroup'],
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
    //
    //  Strip out KEY as it is not updated - remove concatenated field
    //
    let { ogowner, oggroup, ogkey, ...nokeyData } = data
    //
    //  Process promise
    //
    const rowCrudparams = {
      AxMethod: 'post',
      AxCaller: debugModule,
      AxTable: AxTable,
      AxAction: 'UPDATE',
      AxWhere: `ogowner = '${ogowner}' and oggroup = '${oggroup}'`,
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
      updateOptions()
      return
    })
    //
    //  Return Promise
    //
    return myPromiseUpdate
  }
  //.............................................................................
  //.  Update Counts
  //.............................................................................
  const updOwnerGroupCounts = () => {
    //
    //  Process promise
    //
    let AxString = `update ownergroup set`
    AxString =
      AxString +
      ` ogcntquestions = (select count(*) from questions where ogowner = qowner and oggroup = qgroup )`
    AxString =
      AxString +
      `, ogcntlibrary = (select count(*) from library where ogowner = lrowner and oggroup = lrgroup )`
    if (s_owner) AxString = AxString + ` where ogowner = '${s_owner}'`

    const rowCrudparams = {
      AxMethod: 'post',
      AxCaller: debugModule,
      AxTable: AxTable,
      AxAction: 'UPDATERAW',
      AxString: AxString
    }
    if (debugLog) console.log(consoleLogTime(debugModule, 'AxString'), AxString)
    const updOwnerGroupCounts = rowCrud(rowCrudparams)
    //
    //  Resolve Status
    //
    updOwnerGroupCounts.then(function (rtnObj) {
      //
      //  Completion message
      //
      setServerMessage(rtnObj.rtnMessage)
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
    return updOwnerGroupCounts
  }
  //.............................................................................
  //  Update the  Options
  //.............................................................................
  function updateOptions() {
    //
    //  Create options
    //
    createOptions({
      cop_AxTable: 'ownergroup',
      cop_owner: 'ogowner',
      cop_id: 'oggroup',
      cop_title: 'ogtitle',
      cop_store: 'Data_Options_OwnerGroup',
      cop_received: 'Data_Options_OwnerGroup_Received'
    })
  }
  //.............................................................................
  //
  //  Search/Filter
  //
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
          case 'ogowner':
            itemsFilter = items.filter(x =>
              x.ogowner.toLowerCase().includes(searchValue.toLowerCase())
            )
            break
          case 'oggroup':
            itemsFilter = items.filter(x =>
              x.oggroup.toLowerCase().includes(searchValue.toLowerCase())
            )
            break
          case 'ogtitle':
            itemsFilter = items.filter(x =>
              x.ogtitle.toLowerCase().includes(searchValue.toLowerCase())
            )
            break

          default:
        }
        return itemsFilter
      }
    })
  }
  //.............................................................................
  //
  //  Update Database
  //
  const addOrEdit = (row, resetForm) => {
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
    setServerMessage('')
    setRecordForEdit(row)
    setOpenPopup(true)
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
    deleteRowData(row.ogowner, row.oggroup)
    setNotify({
      isOpen: true,
      message: 'Deleted Successfully',
      severity: 'error'
    })
  }
  //.............................................................................
  //
  //  Library
  //
  const handleLibraryList = row => {
    sessionStorage.setItem('Selection_Owner', JSON.stringify(row.ogowner))
    sessionStorage.setItem('Selection_OwnerGroup', JSON.stringify(row.oggroup))
    handlePage('LibraryList')
  }
  //.............................................................................
  //
  //  questions
  //
  const handleQuestionList = row => {
    sessionStorage.setItem('Selection_Owner', JSON.stringify(row.ogowner))
    sessionStorage.setItem('Selection_OwnerGroup', JSON.stringify(row.oggroup))
    handlePage('QuestionList')
  }
  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <>
      <PageHeader
        title='OwnerGroup'
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
            text='Update Counts'
            variant='outlined'
            startIcon={<RefreshIcon />}
            onClick={() => {
              updOwnerGroupCounts()
            }}
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
              <TableRow key={row.ogkey}>
                <TableCell>{row.ogowner}</TableCell>
                <TableCell>{row.oggroup}</TableCell>
                <TableCell>{row.ogtitle}</TableCell>
                <TableCell>{row.ogcntlibrary}</TableCell>
                <TableCell>{row.ogcntquestions}</TableCell>

                <TableCell>
                  <MyActionButton
                    startIcon={<QuizIcon fontSize='medium' />}
                    variant='contained'
                    color='warning'
                    text='Library'
                    onClick={() => {
                      handleLibraryList(row)
                    }}
                  ></MyActionButton>
                  <MyActionButton
                    startIcon={<QuizIcon fontSize='medium' />}
                    variant='contained'
                    color='warning'
                    text='Questions'
                    onClick={() => {
                      handleQuestionList(row)
                    }}
                  ></MyActionButton>
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
                          onDelete(row)
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
      <Popup title='OwnerGroup Form' openPopup={openPopup} setOpenPopup={setOpenPopup}>
        <OwnerGroupEntry
          recordForEdit={recordForEdit}
          addOrEdit={addOrEdit}
          serverMessage={serverMessage}
          s_owner={s_owner}
        />
      </Popup>
      <Notification notify={notify} setNotify={setNotify} />
      <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
    </>
  )
}
