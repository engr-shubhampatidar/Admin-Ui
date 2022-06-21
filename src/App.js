import { useEffect, useState } from "react";
// MUI
import {
  Box,
  Button,
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Modal,
  Stack,
  Pagination,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
// Importing icons
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
// Library for API calls
import axios from "axios";
// Importing CSS Files
import "./App.css";

function App() {
  /* States */
  // all user data
  const [usersData, setUsersData] = useState([]);

  const [columns, setColumns] = useState([]);
  // all pages
  const [totalPages, setTotalPages] = useState(0);
  // curent pages from _ to _
  const [pageInfo, setPageInfo] = useState({ start: 0, end: 10 });
  // track the selected user
  const [selectedItem, setSelectedItem] = useState([]);
  // selectAll is clicked
  const [selectAll, setSelectAll] = useState(false);
  // edit user modal popup
  const [open, setOpen] = useState(false);
  // data of user to be edited
  const [userToEdit, setUserToEdit] = useState({});

  /*  Hooks */
  // api call on load of the component
  useEffect(() => {
    getUsersData();
  }, []);
  // track curent total page count based on remaining user after delete
  useEffect(() => {
    if (usersData) {
      setTotalPages(Math.round(usersData.length / 10));
    }
  }, [usersData]);

  // API Call
  const getUsersData = () => {
    axios
      .get(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      )
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          setUsersData(res.data);
          setColumns(Object.keys(res.data[0]));
        }
      });
  };

  /*  Methods */
  // tracking page change based on the current selected page
  const onPageChange = (event, value) => {
    setPageInfo({ start: (value - 1) * 10, end: value * 10 });
  };
  // deleting a single user
  const deleteItem = (id) => {
    let newArray = usersData.filter((user) => {
      return user.id !== id;
    });
    setUsersData(newArray);
  };

  // for making first letter capital
  const capitalizeFirstLetter = (str) => {
    return str[0].toUpperCase() + str.slice(1);
  };

  // Searching data besed on name / email / role
  const handleSearch = (e) => {
    let string = e.target.value.toLowerCase();
    if (string === "") {
      getUsersData();
    } else {
      let newUsers = usersData.filter((user) => {
        return (
          user.name.toLowerCase().includes(string) ||
          user.role.toLowerCase().includes(string) ||
          user.email.toLowerCase().includes(string)
        );
      });
      setUsersData(newUsers);
    }
  };

  // for selecting
  const handleSelectedItem = (checked, id) => {
    if (checked) {
      setSelectedItem((prev) => [...prev, parseInt(id)]);
    } else {
      let index = selectedItem.indexOf(parseInt(id));
      setSelectedItem([
        ...selectedItem.slice(0, index),
        ...selectedItem.slice(index + 1),
      ]);
    }
  };

  // for deselecting
  const deleteSelected = () => {
    let newArray = usersData.filter((user) => {
      return !selectedItem.includes(parseInt(user.id));
    });
    setUsersData(newArray);
    setSelectAll(false);
  };

  // for selecting all on current page
  const selectAllCurrentPage = (checked) => {
    if (checked) {
      let start = 0;
      let end = 10;
      for (let i = start; i < end; i++) {
        setSelectedItem((prev) => [...prev, parseInt(usersData[i].id)]);
      }
      setSelectAll(true);
    } else {
      setSelectAll(false);
      setSelectedItem([]);
    }
  };

  // for cloing modal
  const handleClose = () => {
    setOpen(false);
  };

  // for setting data to be edited
  const dataToBeEdited = (user) => {
    setUserToEdit(user);
  };

  // changing name
  const changeName = (name) => {
    setUserToEdit((prevState) => ({
      ...prevState,
      name: name,
    }));
  };

  // changing email
  const changeEmail = (email) => {
    setUserToEdit((prevState) => ({
      ...prevState,
      email: email,
    }));
  };

  // changing role
  const changeRole = (role) => {
    setUserToEdit((prevState) => ({
      ...prevState,
      role: role,
    }));
  };

  // editing user
  const editUser = (id) => {
    setUsersData(
      usersData.map((item) => {
        return item.id === userToEdit.id ? userToEdit : item;
      })
    );
    setOpen(false);
  };

  // Modal Styles
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "93%",
    maxWidth: "400px",
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: "10px",
    p: 3,
  };

  return (
    <>
      <Box className="Container">
        {/* search bar */}
        <Box className="FormGroup">
          <TextField
            fullWidth
            className="SearchBar"
            id="outlined-basic"
            label="Search by name, email or role"
            variant="outlined"
            onChange={(e) => {
              handleSearch(e);
            }}
          />
        </Box>
        <Box>
          {/* user table */}
          <TableContainer component={Paper}>
            <Table
              /* sx={{ minWidth: 650 }} */ aria-label="simple table"
              className="UserTable"
            >
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Checkbox
                      checked={selectAll}
                      onChange={(e) => {
                        selectAllCurrentPage(e.target.checked);
                      }}
                      inputProps={{ "aria-label": "Checkbox demo" }}
                    />
                  </TableCell>
                  {columns &&
                    columns.slice(1, columns.length).map((column) => {
                      return (
                        <TableCell align="left">
                          {capitalizeFirstLetter(column)}
                        </TableCell>
                      );
                    })}
                  <TableCell align="left">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usersData &&
                  usersData.slice(pageInfo.start, pageInfo.end).map((user) => (
                    <TableRow
                      key={user.name}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                      className={
                        selectedItem.includes(parseInt(user.id)) && "Selected"
                      }
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedItem.includes(parseInt(user.id))}
                          onChange={(e) => {
                            handleSelectedItem(e.target.checked, user.id);
                          }}
                          inputProps={{ "aria-label": "Checkbox demo" }}
                        />
                      </TableCell>
                      <TableCell align="left">{user.name}</TableCell>
                      <TableCell align="left">{user.email}</TableCell>
                      <TableCell align="left">
                        {capitalizeFirstLetter(user.role)}
                      </TableCell>
                      <TableCell align="left">
                        <Box className="ActionButton">
                          <IconButton color="primary">
                            <EditIcon
                              className="EditButton"
                              onClick={() => {
                                setOpen(true);
                                dataToBeEdited(user);
                              }}
                            />
                          </IconButton>
                          <IconButton color="error">
                            <DeleteIcon
                              onClick={() => {
                                deleteItem(user.id);
                              }}
                            />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box className="PagingBar">
            <Button
              className="DeleteAllButton"
              variant="contained"
              onClick={() => {
                deleteSelected();
              }}
            >
              Delete selectedItem
            </Button>
            <Stack spacing={2}>
              <Pagination
                count={totalPages}
                variant="outlined"
                shape="rounded"
                onChange={onPageChange}
              />
            </Stack>
          </Box>
        </Box>
        <Box>
          {/* edit user modal */}
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style} className="EditModal">
              <Box className="ModalTitle">
                <Typography variant="h6" component="h6">
                  Edit User
                </Typography>
                <Divider />
              </Box>
              <Box>
                <Box className="FormGroup">
                  <TextField
                    fullWidth
                    id="name"
                    label="Name"
                    value={userToEdit.name}
                    onChange={(e) => {
                      changeName(e.target.value);
                    }}
                  />
                </Box>
                <Box className="FormGroup">
                  <TextField
                    fullWidth
                    id="email"
                    label="Email"
                    value={userToEdit.email}
                    onChange={(e) => {
                      changeEmail(e.target.value);
                    }}
                  />
                </Box>
                <Box className="FormGroup">
                  <TextField
                    fullWidth
                    id="role"
                    label="Role"
                    value={userToEdit.role}
                    onChange={(e) => {
                      changeRole(e.target.value);
                    }}
                  />
                </Box>
                <Box className="ButtonGroup">
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                      editUser(userToEdit.id);
                    }}
                  >
                    Edit
                  </Button>
                </Box>
              </Box>
            </Box>
          </Modal>
        </Box>
      </Box>
    </>
  );
}

export default App;
