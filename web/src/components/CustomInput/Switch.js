import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Switch as MSwitch } from "@material-ui/core";
import InputStyle from "./InputStyle";

export default function Switch(props) {
  const { onChange, label, value, margin = 2, disabled, ...rest } = props;
  var parsedValue = !!value;
  if (value === "0") parsedValue = false;

  return (
    <InputStyle {...props}>
      <FormControl>
        <FormControlLabel
          labelPlacement="start"
          control={
            <MSwitch
              onChange={(e) => onChange(e.target.checked)}
              color="primary"
              checked={parsedValue}
              {...rest}
              disabled={disabled}
            />
          }
          label={label}
          style={{ marginLeft: 0 }}
        />
      </FormControl>
    </InputStyle>
  );
}
