import React, { useState } from "react";
import MuiAlert from "@material-ui/lab/Alert";
import { Snackbar } from "@material-ui/core";

export const Alert = (props) => {
  const { open = true, duration, onClose = () => {}, ...rest } = props;

  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      onClose={onClose}
    >
      {open ? <MuiAlert elevation={6} variant="filled" {...rest} /> : null}
    </Snackbar>
  );
};
