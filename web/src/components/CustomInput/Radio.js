import React from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import { Radio as MRadio } from "@material-ui/core";

export default function Radio(props) {
  const { onChange, label, options, margin = 2, value, ...rest } = props;
  return (
    <FormControl style={{ minWidth: 200, margin: `${8 * margin}px auto` }}>
      <FormLabel component="legend">{label}</FormLabel>
      <RadioGroup
        onChange={(e) => onChange(parseInt(e.target.value))}
        value={value.toString()}
        name={props.id}
        {...rest}
      >
        {Object.keys(options).map((key, i) => (
          <FormControlLabel
            value={key}
            control={<MRadio color="primary" />}
            label={options[key]}
            key={i}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
