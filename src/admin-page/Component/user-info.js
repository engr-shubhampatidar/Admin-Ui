// MUI
import { Box, Checkbox, IconButton, TableCell, TableRow } from "@mui/material";
// Importing icons
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
//
import PropTypes from "prop-types";
// Library for API calls
import { capitalizeFirstLetter } from "../Utils/utils";

function UserInfo({
  user,
  selectedItem,
  deleteItem,
  openAndEdit,
  handleSelectedItem,
}) {
  return (
    <>
      <TableRow
        key={user.name}
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
        className={selectedItem.includes(parseInt(user.id)) ? "Selected" : ""}
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
        <TableCell align="left">{capitalizeFirstLetter(user.role)}</TableCell>
        <TableCell align="left">
          <Box className="ActionButton">
            <IconButton
              color="primary"
              onClick={() => {
                openAndEdit(user);
              }}
            >
              <EditIcon className="EditButton" />
            </IconButton>
            <IconButton
              color="error"
              onClick={() => {
                deleteItem(user.id);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </TableCell>
      </TableRow>
    </>
  );
}

UserInfo.propTypes = {
  user: PropTypes.object,
  selectedItem: PropTypes.array,
  deleteItem: PropTypes.func,
  openAndEdit: PropTypes.func,
  handleSelectedItem: PropTypes.func,
};

export default UserInfo;
