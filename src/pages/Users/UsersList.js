//
//  Libraries
//
import { useState, useEffect } from 'react'
import PeopleOutlineTwoToneIcon from '@mui/icons-material/PeopleOutlineTwoTone'
import { Paper, TableBody, TableRow, TableCell, Toolbar, InputAdornment, Box } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import SearchIcon from '@mui/icons-material/Search'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import CloseIcon from '@mui/icons-material/Close'
import RefreshIcon from '@mui/icons-material/Refresh'
import FilterListIcon from '@mui/icons-material/FilterList'
import QuizIcon from '@mui/icons-material/Quiz'
import AddIcon from '@mui/icons-material/Add'
//
//  Pages
//
import UsersEntry from './UsersEntry'
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
const AxTable = 'users'
//
//  Table Heading
//
const headCells = [
  { id: 'u_uid', label: 'ID' },
  { id: 'u_user', label: 'User' },
  { id: 'u_name', label: 'Name' },
  { id: 'u_admin', label: 'Admin' },
  { id: 'u_dev', label: 'Dev' },
  { id: 'u_email', label: 'Email' },
  { id: 'u_fedid', label: 'Bridge ID' },
  { id: 'u_fedcountry', label: 'Country' },
  { id: 'u_dftmaxquestions', label: 'Max Questions' },
  { id: 'actions', label: 'Actions', disableSorting: true }
]
const searchTypeOptions = [
  { id: 'u_user', title: 'User' },
  { id: 'u_name', title: 'Name' },
  { id: 'u_email', title: 'Email' },
  { id: 'u_fedid', title: 'Bridge ID' }
]
//
// Debug Settings
//
const debugModule = 'UsersList'
//...................................................................................
//.  Main Line
//...................................................................................
export default function UsersList({ handlePage }) {
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
  const [searchType, setSearchType] = useState('u_name')
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
  //.............................................................................
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
    let AxString = `* from ${AxTable} order by u_uid FETCH FIRST ${SQL_ROWS} ROWS ONLY`
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
  const deleteRowData = u_uid => {
    //
    //  Delete users and related files
    //
    deleteUsers(u_uid)
    deleteUserspwd(u_uid)
    deleteUsershistory(u_uid)
    deleteUsersOwner(u_uid)
    //
    //  Refresh
    //
    getRowAllData()
  }
  //.............................................................................
  //.  DELETE - User
  //.............................................................................
  const deleteUsers = u_uid => {
    //
    //  Process promise
    //
    const rowCrudparams = {
      AxMethod: 'delete',
      AxCaller: debugModule,
      AxTable: AxTable,
      AxAction: 'DELETE',
      AxWhere: `u_uid = '${u_uid}'`
    }
    const myPromiseDelete = rowCrud(rowCrudparams)
    //
    //  Resolve Status
    //
    myPromiseDelete.then(function (rtnObj) {
      return
    })
    return myPromiseDelete
  }
  //.............................................................................
  //.  DELETE - Userpwd
  //.............................................................................
  const deleteUserspwd = u_uid => {
    //
    //  Process promise
    //
    const rowCrudparams = {
      AxMethod: 'delete',
      AxCaller: debugModule,
      AxTable: 'userspwd',
      AxAction: 'DELETE',
      AxWhere: `upuid = '${u_uid}'`
    }
    const myPromiseDelete = rowCrud(rowCrudparams)

    //
    //  Resolve Status
    //
    myPromiseDelete.then(function (rtnObj) {
      return
    })
    return myPromiseDelete
  }
  //.............................................................................
  //.  DELETE - UserHistory
  //.............................................................................
  const deleteUsershistory = u_uid => {
    //
    //  Process promise
    //
    const rowCrudparams = {
      AxMethod: 'delete',
      AxCaller: debugModule,
      AxTable: 'usershistory',
      AxAction: 'DELETE',
      AxWhere: `r_uid = '${u_uid}'`
    }
    const myPromiseDelete = rowCrud(rowCrudparams)
    //
    //  Resolve Status
    //
    myPromiseDelete.then(function (rtnObj) {
      return
    })
    return myPromiseDelete
  }
  //.............................................................................
  //.  DELETE - UsersOwner
  //.............................................................................
  const deleteUsersOwner = u_uid => {
    //
    //  Process promise
    //
    const rowCrudparams = {
      AxMethod: 'delete',
      AxCaller: debugModule,
      AxTable: 'usersowner',
      AxAction: 'DELETE',
      AxWhere: `uouid = '${u_uid}'`
    }
    const myPromiseDelete = rowCrud(rowCrudparams)
    //
    //  Resolve Status
    //
    myPromiseDelete.then(function (rtnObj) {
      return
    })
    return myPromiseDelete
  }
  //.............................................................................
  //.  UPDATE
  //.............................................................................
  const updateRowData = data => {
    //
    //  Strip out KEY as it is not updated
    //
    let { u_uid, u_user, ...nokeyData } = data
    //
    //  Process promise
    //
    const rowCrudparams = {
      AxMethod: 'post',
      AxCaller: debugModule,
      AxTable: AxTable,
      AxAction: 'UPDATE',
      AxWhere: `u_uid = '${u_uid}'`,
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
          case 'u_email':
            itemsFilter = items.filter(x =>
              x.u_email.toLowerCase().includes(searchValue.toLowerCase())
            )
            break
          case 'u_name':
            itemsFilter = items.filter(x =>
              x.u_name.toLowerCase().includes(searchValue.toLowerCase())
            )
            break
          case 'u_user':
            itemsFilter = items.filter(x =>
              x.u_user.toLowerCase().includes(searchValue.toLowerCase())
            )
            break
          case 'u_fedid':
            itemsFilter = items.filter(x =>
              x.u_fedid.toLowerCase().includes(searchValue.toLowerCase())
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
    updateRowData(row)

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
  const onDelete = u_uid => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    })
    deleteRowData(u_uid)
    setNotify({
      isOpen: true,
      message: 'Deleted Successfully',
      severity: 'error'
    })
  }
  //.............................................................................
  //
  //  Usersowners
  //
  const handleUsersownerList = row => {
    sessionStorage.setItem('Selection_UserId', JSON.stringify(row.u_uid))
    sessionStorage.setItem('Selection_User', JSON.stringify(row.u_user))
    handlePage('UsersownerList')
  }

  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <>
      <PageHeader
        title='Users'
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
            onClick={() => handlePage('Register')}
          />
        </Toolbar>
        <TblContainer>
          <TblHead />
          <TableBody>
            {recordsAfterPagingAndSorting().map(row => (
              <TableRow key={row.u_uid}>
                <TableCell>{row.u_uid}</TableCell>
                <TableCell>{row.u_user}</TableCell>
                <TableCell>{row.u_name}</TableCell>
                <TableCell>{row.u_admin ? 'Y' : 'N'}</TableCell>
                <TableCell>{row.u_dev ? 'Y' : 'N'}</TableCell>
                <TableCell>{row.u_email}</TableCell>
                <TableCell>{row.u_fedid}</TableCell>
                <TableCell>{row.u_fedcountry}</TableCell>
                <TableCell>{row.u_dftmaxquestions}</TableCell>
                <TableCell>
                  <MyActionButton
                    startIcon={<QuizIcon fontSize='medium' />}
                    variant='contained'
                    color='warning'
                    text='Usersowners'
                    onClick={() => {
                      handleUsersownerList(row)
                    }}
                  ></MyActionButton>
                  <MyActionButton
                    startIcon={<EditOutlinedIcon fontSize='small' />}
                    color='primary'
                    onClick={() => openInPopup(row)}
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
                          onDelete(row.u_uid)
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
      <Popup title='Users Form' openPopup={openPopup} setOpenPopup={setOpenPopup}>
        <UsersEntry
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
