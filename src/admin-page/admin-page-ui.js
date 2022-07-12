import { useCallback, useEffect, useState } from "react";
// MUI
import {
  Alert,
  Backdrop,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
// Importing icons
// Importing CSS Files
import "../App.css";
import EditModal from "./Component/edit-modal";
import SearchBar from "./Component/search-bar";
import UserInfo from "./Component/user-info";
import useAxios from "./Services/use-axios";
import useDebounce from "./Services/use-debounce";
import { capitalizeFirstLetter, filterUser } from "./Utils/utils";

export default function Admin() {
  /* States */
  // all user data
  const [usersData, setUsersData] = useState();
  // filter data copy
  const [filterUserData, setFilterUserData] = useState([]);

  const [columns, setColumns] = useState([]);
  // all pages
  const [totalPages, setTotalPages] = useState(0);
  // current pages from _ to _
  const [pageInfo, setPageInfo] = useState({ start: 0, end: 10 });
  // track the selected user
  const [selectedItem, setSelectedItem] = useState([]);
  // selectAll is clicked
  const [selectAll, setSelectAll] = useState(false);
  // selected page
  const [selectedPage, setSelectedPage] = useState(1);
  // list of selected pages
  const [selectedPages, setSelectedPages] = useState([]);
  // search term
  const [searchString, setSearchString] = useState();

  // edit user modal popup
  const [open, setOpen] = useState(false);
  // data of user to be edited
  const [userToEdit, setUserToEdit] = useState({});

  // API Call
  const { response, loading, error } = useAxios({
    method: "get",
    url: "/adminui-problem/members.json",
  });

  /*  Hooks */
  // api call on load of the component
  useEffect(() => {
    if (response) {
      setUsersData(response);
      setFilterUserData(response);
      setColumns(Object.keys(response[0]));
    }
  }, [response]);

  // track current total page count based on remaining user after delete
  useEffect(() => {
    if (filterUserData) {
      setTotalPages(Math.ceil(filterUserData.length / 10));
    }
  }, [filterUserData]);

  const debounceSearchTerm = useDebounce(searchString, 500);
  const filterByDebounceTerm = useCallback(() => {
    setFilterUserData(filterUser(usersData, debounceSearchTerm));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceSearchTerm]);

  // filter data with debounceTerm
  useEffect(() => {
    filterByDebounceTerm();
  }, [filterByDebounceTerm]);

  /*  Methods */
  // tracking page change based on the current selected page
  const onPageChange = (event, value) => {
    setSelectedPage(value);
    if (value > filterUserData.length / 10) {
      setPageInfo({
        start: (value - 1) * 10,
        end: filterUserData.length,
      });
    } else {
      setPageInfo({ start: (value - 1) * 10, end: value * 10 });
    }
  };

  // deleting a single user
  const deleteItem = (id) => {
    let newArray = usersData.filter((user) => {
      return user.id !== id;
    });
    setFilterUserData(newArray);
  };

  // editing user
  const editUser = (user) => {
    setFilterUserData(
      usersData.map((item) => {
        return item.id === user.id ? user : item;
      })
    );
    setOpen(false);
  };

  // for closing modal
  const handleClose = () => {
    setOpen(false);
  };

  // for modal open and setting pre fill data
  const openAndEdit = (user) => {
    setOpen(true);
    dataToBeEdited(user);
  };

  // for setting data to be edited
  const dataToBeEdited = (user) => {
    setUserToEdit(user);
  };

  // Searching data based on name / email / role
  const handleSearch = (e) => {
    let string = e.target.value.toLowerCase();
    setSearchString(string);
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
  // TODO on deleting remaining list disappear
  const deleteSelected = () => {
    let newArray = filterUserData.filter((user) => {
      return !selectedItem.includes(parseInt(user.id));
    });
    setFilterUserData(newArray);
    setSelectAll(false);
    setSelectedItem([]);
    console.log({ selectedPage });
    if (selectedPage >= filterUserData.length / 10) {
      console.log("jere");
      setSelectedPage(selectedPage - 1);
      setPageInfo({ start: (selectedPage - 2) * 10, end: selectedPage * 10 });
    }
  };

  // for selecting all on current page
  // TODO Change logic for select all its working for only first page
  const selectAllCurrentPage = (checked) => {
    if (checked) {
      let start = pageInfo.start;
      let end = pageInfo.end;
      for (let i = start; i < end; i++) {
        setSelectedItem((prev) => [...prev, parseInt(filterUserData[i].id)]);
      }
      setSelectAll(true);
      setSelectedPages([...selectedPages, pageInfo.end / 10]);
    } else {
      setSelectAll(false);
      setSelectedItem([]);
    }
  };

  // TODO No data message on search, Loading on api, api fail message, try creating hook if possible for api and implement debounce with hook

  return (
    <>
      <Box className="Container">
        {/* search bar */}
        <SearchBar handleSearch={handleSearch} />
        <Box>
          {/* user table */}
          {loading ? (
            <Backdrop
              sx={{ color: "#000", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          ) : (
            <TableContainer component={Paper}>
              {filterUserData?.length > 0 ? (
                <Table
                  /* sx={{ minWidth: 650 }} */ aria-label="simple table"
                  className="UserTable"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Checkbox
                          checked={
                            selectAll &&
                            selectedPages.includes(pageInfo.end / 10)
                          }
                          onChange={(e) => {
                            selectAllCurrentPage(e.target.checked);
                          }}
                          inputProps={{ "aria-label": "Checkbox demo" }}
                        />
                      </TableCell>
                      {columns &&
                        columns.slice(1, columns.length).map((column, c) => {
                          return (
                            <TableCell align="left" key={c}>
                              {capitalizeFirstLetter(column)}
                            </TableCell>
                          );
                        })}
                      <TableCell align="left">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filterUserData
                      ?.slice(pageInfo.start, pageInfo.end)
                      .map((user) => (
                        <UserInfo
                          key={user.name}
                          user={user}
                          selectedItem={selectedItem}
                          deleteItem={deleteItem}
                          openAndEdit={openAndEdit}
                          handleSelectedItem={handleSelectedItem}
                        />
                      ))}
                  </TableBody>
                </Table>
              ) : (
                <Alert severity="info">No match found!</Alert>
              )}
            </TableContainer>
          )}

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
                page={selectedPage}
                variant="outlined"
                shape="rounded"
                onChange={onPageChange}
              />
            </Stack>
          </Box>
        </Box>

        {error && <Alert severity="error">Failed to fetch data</Alert>}
      </Box>
      {/* edit user modal */}
      <EditModal
        open={open}
        handleClose={handleClose}
        user={userToEdit}
        editUser={editUser}
      />
    </>
  );
}

/* 
1. Nice way of writing single line comments before the start Areas of Improvement: All the logic is in one big method/file which makes the code hard to read and maintain. The UI code could have been modular. Lower level components could have been identified and implemented. This helps in having an extensible, readable and maintainable solution. 1. No test cases are written for the project. 2. Error handling is not implemented. For instance if the api fails to respond and gives an error status code then no error message is shown to the user. Also the api responds but with empty results then also no message is displayed. For example 'No data found' or 'Can't fetch the data at the moment'. 3. Edited data doesn't persist while using the search feature to search user by name, email or role. 4. Search functionality has edge case issues. Search can be performed well only on the first page. if on some other page other than the first page then the search logic fails to get the result. */
