import { Snackbar } from "@mui/material";
import { useEffect, useState } from "react";

const SnackbarMessage = ({
  message = "Error occured",
}: {
  message: string;
}) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (message?.length) {
      setOpen(true);
    }
  }, []);
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      message={message}
    />
  );
};

export default SnackbarMessage;
