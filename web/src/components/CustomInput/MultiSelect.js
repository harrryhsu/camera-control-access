import React, { useRef } from "react";
import { withStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import { Select as MSelect, ListItemText, Checkbox } from "@material-ui/core";
import InputStyle from "./InputStyle";

const styled = withStyles((theme) => ({
  selectMenu: {
    backgroundColor: "white",
    "&:focus": {
      backgroundColor: "white",
    },
  },
}));

const MultiSelect = (props) => {
  const {
    label,
    options,
    helperText,
    onChange,
    margin = 2,
    wrapperProps = {},
    anchor = null,
    disabled,
    value,
    ...rest
  } = props;

  const { style, ...restWrapper } = wrapperProps;

  const strValues = value.map((x) => x.toString());

  return (
    <InputStyle {...props}>
      <FormControl
        style={{ width: "100%", ...style }}
        id={props.id + "-wrapper"}
        {...restWrapper}
      >
        <InputLabel id={props.id + "-label"} style={{ zIndex: 1 }}>
          {label}
        </InputLabel>
        <MSelect
          labelId={props.id + "-label"}
          onChange={(e, v) => onChange(e.target.value)}
          value={strValues}
          {...rest}
          multiple
          renderValue={(selected) => selected.map((x) => options[x]).join(", ")}
          MenuProps={{
            container: anchor,
          }}
          disabled={disabled}
        >
          {Object.keys(options).map((key, i) => (
            <MenuItem value={key} key={i}>
              <Checkbox checked={strValues.indexOf(key) > -1} />
              <ListItemText primary={options[key]} />
            </MenuItem>
          ))}
        </MSelect>
        <FormHelperText>{helperText}</FormHelperText>
      </FormControl>
    </InputStyle>
  );
};

export default styled(MultiSelect);
