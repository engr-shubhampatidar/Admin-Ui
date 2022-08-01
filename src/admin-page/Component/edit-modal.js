import React, { useState, useEffect } from "react";
// MUI
import {
  Box,
  Button,
  Divider,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
// prop-validation library import
import PropTypes from "prop-types";

function EditModal({ open, user, handleClose, editUser }) {
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

  // data of user to be edited
  const [userToEdit, setUserToEdit] = useState();

  useEffect(() => {
    setUserToEdit(user);
    return () => {
      console.log("here");
    };
  }, [user]);

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

  return (
    <>
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
                value={userToEdit?.name}
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
                value={userToEdit?.email}
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
                value={userToEdit?.role}
                onChange={(e) => {
                  changeRole(e.target.value);
                }}
              />
            </Box>
            <Box className="ButtonGroup">
              <Button variant="contained" color="error" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  editUser(userToEdit);
                }}
              >
                Edit
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

EditModal.propTypes = {
  open: PropTypes.bool.isRequired,
  user: PropTypes.object,
  handleClose: PropTypes.func,
  editUser: PropTypes.func,
};

export default EditModal;
