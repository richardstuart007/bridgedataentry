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
import GroupIcon from '@mui/icons-material/Group'
//
//  Pages
//
import OwnerEntry from './OwnerEntry'
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
//  Owners Table
//
const { SQL_ROWS } = require('../../services/constants.js')
const AxTable = 'owner'
//
//  Table Heading
//
const headCells = [
  { id: 'oowner', label: 'Owner' },
  { id: 'otitle', label: 'Title' },
  { id: 'actions', label: 'Actions', disableSorting: true }
]
const searchTypeOptions = [
  { id: 'oowner', title: 'Owner' },
  { id: 'otitle', title: 'Title' }
]
//
// Debug Settings
//
const debugModule = 'OwnerList'
//=====================================================================================
export default function OwnerList({ handlePage }) {
  //.............................................................................
  //.  GET ALL
  //.............................................................................
  const getRowAllData = () => {
    //
    //  Process promise
    //
    let AxString = `* from ${AxTable} order by oowner FETCH FIRST ${SQL_ROWS} ROWS ONLY`
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
  const deleteRowData = oowner => {
    //
    //  Process promise
    //
    const rowCrudparams = {
      AxMethod: 'delete',
      AxCaller: debugModule,
      AxTable: AxTable,
      AxAction: 'DELETE',
      AxWhere: `oowner = '${oowner}'`
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
      AxKeyName: ['oowner'],
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
    //  Strip out KEY as it is not updated
    //
    let { oowner, ...nokeyData } = data
    //
    //  Process promise
    //
    const rowCrudparams = {
      AxMethod: 'post',
      AxCaller: debugModule,
      AxTable: AxTable,
      AxAction: 'UPDATE',
      AxWhere: `oowner = '${oowner}'`,
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
  //  Update the  Options
  //.............................................................................
  function updateOptions() {
    //
    //  Create options
    //
    createOptions({
      cop_AxTable: 'owner',
      cop_id: 'oowner',
      cop_title: 'otitle',
      cop_store: 'Data_Options_Owner',
      cop_received: 'Data_Options_Owner_Received'
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
  const [searchType, setSearchType] = useState('oowner')
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
          case 'oowner':
            itemsFilter = items.filter(x => x.oowner === parseInt(searchValue))
            break
          case 'otitle':
            itemsFilter = items.filter(x =>
              x.otitle.toLowerCase().includes(searchValue.toLowerCase())
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
  //  Owner/Group
  //
  const handleOwnerGroupList = owner => {
    sessionStorage.setItem('Selection_Owner', JSON.stringify(owner))
    handlePage('OwnerGroupList')
  }
  //.............................................................................
  //
  //  Delete Row
  //
  const onDelete = oowner => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    })
    deleteRowData(oowner)
    setNotify({
      isOpen: true,
      message: 'Deleted Successfully',
      severity: 'error'
    })
  }

  //...................................................................................
  //.  Main Line
  //...................................................................................
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
        title='Owners'
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
              <TableRow key={row.oowner}>
                <TableCell>{row.oowner}</TableCell>
                <TableCell>{row.otitle}</TableCell>

                <TableCell>
                  <MyActionButton
                    startIcon={<GroupIcon fontSize='medium' />}
                    variant='contained'
                    color='warning'
                    text='OwnerGroup'
                    onClick={() => {
                      handleOwnerGroupList(row.oowner)
                    }}
                  ></MyActionButton>
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
                          onDelete(row.oowner)
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
      <Popup title='Owner Form' openPopup={openPopup} setOpenPopup={setOpenPopup}>
        <OwnerEntry
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
