import React from "react";
import { Box, TextField } from "@mui/material";
import PropTypes from "prop-types";

// TODO On searching from last page its not working properly
function SearchBar({ handleSearch }) {
  return (
    <>
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
    </>
  );
}

SearchBar.propTypes = {
  handleSearch: PropTypes.func.isRequired,
};

export default SearchBar;
