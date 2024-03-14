import { TextField } from "@mui/material";
import React from "react";

const InputField = ({
  value,
  name,
  label,
  handleChange,
}: {
  name: string;
  value: string;
  label: string;
  handleChange: (e: any) => void;
}) => {
  return (
    <TextField
      fullWidth
      id={name}
      name={name}
      label={label}
      value={value}
      variant="outlined"
      margin="normal"
      autoComplete="off"
      onChange={handleChange}
    />
  );
};

export default InputField;
