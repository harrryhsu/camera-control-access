import React from "react";
import { TextField } from "@material-ui/core";
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
    min,
    max,
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
        inputProps={{ style: { minWidth: "200px" }, min, max }}
        disabled={disabled}
        {...rest}
      />
    </InputStyle>
  );
}
