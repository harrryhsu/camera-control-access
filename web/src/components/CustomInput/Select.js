import React, { useRef } from "react";
import { withStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import { Select as MSelect, Typography } from "@material-ui/core";
import InputStyle from "./InputStyle";

const styled = withStyles((theme) => ({
  selectMenu: {
    backgroundColor: "white",
    "&:focus": {
      backgroundColor: "white",
    },
  },
}));

const Select = (props) => {
  const {
    label,
    options,
    helperText,
    onChange,
    margin = 2,
    wrapperProps = {},
    anchor = null,
    disabled,
    fullWidth = false,
    style,
    inline,
    ...rest
  } = props;

  const { style: wrapperStyle, ...restWrapper } = wrapperProps;

  return (
    <InputStyle {...props}>
      <FormControl
        style={wrapperStyle}
        id={props.id + "-wrapper"}
        {...restWrapper}
      >
        <InputLabel id={props.id + "-label"} style={{ zIndex: 1 }}>
          <Typography>{label} </Typography>
        </InputLabel>
        <MSelect
          labelId={props.id + "-label"}
          onChange={(e, v) => onChange(e.target.value)}
          MenuProps={{
            container: anchor,
          }}
          disabled={disabled}
          fullWidth={fullWidth}
          style={{ ...style, minWidth: 200 }}
          {...rest}
        >
          {Object.keys(options).map((key, i) => (
            <MenuItem value={key} key={i}>
              {options[key]}
            </MenuItem>
          ))}
        </MSelect>
        <FormHelperText>{helperText}</FormHelperText>
      </FormControl>
    </InputStyle>
  );
};

export default styled(Select);
