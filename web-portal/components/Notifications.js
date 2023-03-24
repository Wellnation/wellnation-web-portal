import React from "react";
import { Alert, IconButton, Snackbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const Notifications = ({ open, message, handleClose }) => {
	const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

	return (
		<Snackbar
			anchorOrigin={{
				vertical: "top",
				horizontal: "center",
			}}
			open={open}
			onClose={handleClose}
			autoHideDuration={4000}
			action={action}
		>
			<Alert variant="filled" severity="error" onClose={handleClose}>
        {message}
      </Alert>
		</Snackbar>
	);
};

export default Notifications;
