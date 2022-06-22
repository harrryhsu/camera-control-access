import React from "react";
import { DateTimePicker } from "@material-ui/pickers";
import InputStyle from "./InputStyle";

export default function DateTime(props) {
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
      <DateTimePicker
        id={id}
        label={label}
        value={value}
        onChange={(v) => onChange(v)}
        disabled={disabled}
        {...rest}
      />
    </InputStyle>
  );
}
