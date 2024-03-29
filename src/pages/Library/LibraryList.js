////
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
import LibraryEntry from './LibraryEntry'
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
const AxTable = 'library'
//
//  Table Heading
//
const headCells = [
  { id: 'lrlid', label: 'ID' },
  { id: 'lrowner', label: 'Owner' },
  { id: 'lrgroup', label: 'Group' },
  { id: 'lrref', label: 'Reference' },
  { id: 'lrdesc', label: 'Description' },
  { id: 'lrlink', label: 'Link' },
  { id: 'lrwho', label: 'Who' },
  { id: 'lrtype', label: 'Type' },
  { id: 'actions', label: 'Actions', disableSorting: true }
]
const searchTypeOptions = [
  { id: 'lrlid', title: 'ID' },
  { id: 'lrowner', title: 'Owner' },
  { id: 'lrgroup', title: 'Group' },
  { id: 'lrref', title: 'Reference' },
  { id: 'lrdesc', title: 'Description' },
  { id: 'lrlink', title: 'Link' },
  { id: 'lrwho', title: 'Who' },
  { id: 'lrtype', title: 'Type' }
]
//
// Debug Settings
//
const debugModule = 'LibraryList'
//.............................................................................
//.  Main Line
//.............................................................................
export default function LibraryList({ handlePage }) {
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
  const [searchType, setSearchType] = useState('lrref')
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
  const getRowAllData = () => {
    //
    //  SQL String
    //
    let AxString = `* from ${AxTable}`
    if (s_owner || s_group) {
      AxString = AxString + ` where`
      if (s_owner) AxString = AxString + ` lrowner = '${s_owner}'`
      if (s_owner && s_group) AxString = AxString + ` and`
      if (s_group) AxString = AxString + ` lrgroup = '${s_group}'`
    }
    AxString = AxString + ` order by lrowner, lrgroup, lrref FETCH FIRST ${SQL_ROWS} ROWS ONLY`
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
  const deleteRowData = lrlid => {
    //
    //  Process promise
    //
    const rowCrudparams = {
      AxMethod: 'delete',
      AxCaller: debugModule,
      AxTable: AxTable,
      AxAction: 'DELETE',
      AxWhere: `lrlid = '${lrlid}'`
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
    //  Strip out KEY as it will be populated by Insert
    //
    let { lrlid, ...nokeyData } = data
    //
    //  Process promise
    //
    const rowCrudparams = {
      AxMethod: 'post',
      AxCaller: debugModule,
      AxTable: AxTable,
      AxAction: 'INSERT',
      AxKeyName: ['lrowner', 'lrgroup', 'lrref'],
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
    //  Strip out KEY as it is not updated
    //
    let { lrlid, lrowner, lrgroup, lrref, ...nokeyData } = data
    //
    //  Process promise
    //
    const rowCrudparams = {
      AxMethod: 'post',
      AxCaller: debugModule,
      AxTable: AxTable,
      AxAction: 'UPDATE',
      AxWhere: `lrlid = '${lrlid}'`,
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
  //  Update the Library Options
  //.............................................................................
  function updateOptions() {
    //
    //  Create options
    //
    createOptions({
      cop_AxTable: 'library',
      cop_id: 'lrref',
      cop_title: 'lrdesc',
      cop_store: 'Data_Options_Library',
      cop_received: 'Data_Options_Library_Received'
    })
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
          case 'lrlid':
            itemsFilter = items.filter(x => x.lrlid === parseInt(searchValue))
            break
          case 'lrowner':
            itemsFilter = items.filter(x =>
              x.lrowner.toLowerCase().includes(searchValue.toLowerCase())
            )
            break
          case 'lrgroup':
            itemsFilter = items.filter(x =>
              x.lrgroup.toLowerCase().includes(searchValue.toLowerCase())
            )
            break
          case 'lrref':
            itemsFilter = items.filter(x =>
              x.lrref.toLowerCase().includes(searchValue.toLowerCase())
            )
            break
          case 'lrdesc':
            itemsFilter = items.filter(x =>
              x.lrdesc.toLowerCase().includes(searchValue.toLowerCase())
            )
            break
          case 'lrlink':
            itemsFilter = items.filter(x =>
              x.lrlink.toLowerCase().includes(searchValue.toLowerCase())
            )
            break
          case 'lrwho':
            itemsFilter = items.filter(x =>
              x.lrwho.toLowerCase().includes(searchValue.toLowerCase())
            )
            break
          case 'lrtype':
            itemsFilter = items.filter(x =>
              x.lrtype.toLowerCase().includes(searchValue.toLowerCase())
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
  const addOrEdit = (row, resetForm) => {
    recordForEdit === null ? insertRowData(row) : updateRowData(row)

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
  const onDelete = lrlid => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    })
    deleteRowData(lrlid)
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
        title='Library'
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
              <TableRow key={row.lrlid}>
                <TableCell>{row.lrlid}</TableCell>
                <TableCell>{row.lrowner}</TableCell>
                <TableCell>{row.lrgroup}</TableCell>
                <TableCell>{row.lrref}</TableCell>
                <TableCell>{row.lrdesc}</TableCell>
                <TableCell>{row.lrlink}</TableCell>
                <TableCell>{row.lrwho}</TableCell>
                <TableCell>{row.lrtype}</TableCell>

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
                          onDelete(row.lrlid)
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
        onClick={() => handlePage('PAGEBACK')}
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
      <Popup title='Library Form' openPopup={openPopup} setOpenPopup={setOpenPopup}>
        <LibraryEntry
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
