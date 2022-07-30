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
import { capitalizeFirstLetter, filterUser, pageDetail } from "./Utils/utils";

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

  // Search Users
  const debounceSearchTerm = useDebounce(searchString, 500);
  const filterByDebounceTerm = useCallback(() => {
    setFilterUserData(filterUser(usersData, debounceSearchTerm));
    setSelectedPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceSearchTerm]);

  // filter data with debounceTerm
  useEffect(() => {
    filterByDebounceTerm();
  }, [filterByDebounceTerm]);

  // change the pageInfo
  const changePage = useCallback(() => {
    setPageInfo(pageDetail(selectedPage, filterUserData));
    // setSelectedPage(Math.ceil(pageInfo.end / 10));
  }, [filterUserData, selectedPage]);

  useEffect(() => {
    if (filterUserData) {
      changePage();
    }
  }, [totalPages, changePage, filterUserData]);

  /*  Methods */
  // tracking page change based on the current selected page
  const onPageChange = (event, value) => {
    setSelectedPage(value);
  };

  // deleting a single user
  const deleteItem = (id) => {
    setFilterUserData((prev) => prev.filter((user) => user.id !== id));
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
      setSelectedPages((prev) => prev.filter((page) => page !== selectedPage));
      setSelectedItem([
        ...selectedItem.slice(0, index),
        ...selectedItem.slice(index + 1),
      ]);
    }
  };

  //resetting selecting
  const resetSelect = () => {
    setSelectedItem([]);
    setSelectedPages([]);
  };

  // tracking the page curser
  const trackSelectedPage = () => {
    if (
      selectedPages.includes(selectedPage) &&
      selectedPage === totalPages &&
      totalPages > 1
    ) {
      setSelectedPage(selectedPage - 1);
    } else {
      setSelectedItem(1);
    }
  };

  // for deselecting
  const deleteSelected = () => {
    setFilterUserData((prev) =>
      prev.filter((user) => !selectedItem.includes(parseInt(user.id)))
    );
    trackSelectedPage();
    resetSelect();
  };

  // for selecting all on current page
  const selectAllCurrentPage = (checked) => {
    if (checked) {
      for (let i = pageInfo.start; i < pageInfo.end; i++) {
        setSelectedItem((prev) => [...prev, parseInt(filterUserData[i].id)]);
      }
      setSelectedPages([...selectedPages, selectedPage]);
    } else {
      setSelectedPages((prev) => prev.filter((page) => page !== selectedPage));
      let newList = [...selectedItem];
      for (let i = pageInfo.start + 1; i <= pageInfo.end; i++) {
        let index = newList.indexOf(parseInt(i));
        newList.splice(index, 1);
      }
      setSelectedItem(newList);
    }
  };

  // TODO destructure the table component
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
                <Table aria-label="simple table" className="UserTable">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Checkbox
                          checked={selectedPages.includes(pageInfo.end / 10)}
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
                color="primary"
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
