import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Switch as MSwitch, TextField } from "@material-ui/core";
import InputStyle from "./InputStyle";

export default function Text(props) {
  var {
    onChange,
    label,
    id,
    value,
    margin = 2,
    disabled,
    numeric,
    ...rest
  } = props;

  if (value == null) value = numeric ? 0 : "";

  return (
    <InputStyle {...props}>
      <TextField
        id={id}
        label={label}
        type={numeric ? "number" : "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        inputProps={{ style: { minWidth: "200px" } }}
        disabled={disabled}
        {...rest}
      />
    </InputStyle>
  );
}
