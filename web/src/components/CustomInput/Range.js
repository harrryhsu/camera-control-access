import React, {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import useState from "react-usestateref";

import { makeStyles } from "@material-ui/core/styles";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import {
  TextField,
  Box,
  Typography,
  Grid,
  Slider,
  Input,
} from "@material-ui/core";

import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import InputStyle from "./InputStyle";

const Range = forwardRef((props, ref) => {
  const {
    max,
    min,
    step = 1,
    onChange,
    value,
    margin = 2,
    label,
    disabled,
    ...rest
  } = props;

  const [sourceValue, setSourceValue, sourceValueRef] = useState(value);

  const limitUpdate = (value) => {
    if (min !== null) value = Math.max(min, value);
    if (max !== null) value = Math.min(max, value);
    return value;
  };

  const [localValue, setLocalValue, localValueRef] = useState(
    limitUpdate(value)
  );

  if (sourceValue != value) {
    setSourceValue(limitUpdate(value));
    setLocalValue(value);
  }

  var valueRef = localValue,
    setValueRef = setLocalValue;

  useImperativeHandle(ref, () => ({
    onChange: () => {
      setLocalValue(limitUpdate(sourceValueRef.current));
    },
  }));

  var style = { width: "100%" };
  if (disabled) style["color"] = "rgba(0, 0, 0, 0.54)";

  return (
    <InputStyle {...props}>
      <FormControl style={style} ref={null}>
        <Typography>{label}</Typography>
        <GridContainer style={{ height: 28 }}>
          <GridItem xs={8} sm={8} md={7}>
            <Slider
              value={limitUpdate(valueRef)}
              onChange={(e, v) => {
                setValueRef(limitUpdate(v));
              }}
              onChangeCommitted={() => {
                onChange(localValueRef.current);
              }}
              min={min}
              max={max}
              step={step}
              disabled={disabled}
            />
          </GridItem>
          <GridItem xs={1} sm={1} md={1}></GridItem>
          <GridItem xs={3} sm={3} md={4}>
            <Input
              value={valueRef}
              size="small"
              onBlur={(e) => {
                console.log("blur");
                const newValue = limitUpdate(valueRef);
                setValueRef(newValue);
                onChange(newValue);
              }}
              onChange={(e) => {
                setValueRef(e.target.value);
              }}
              disabled={disabled}
              inputProps={{
                type: "number",
              }}
            />
          </GridItem>
        </GridContainer>
      </FormControl>
    </InputStyle>
  );
});
Range.displayName = "Range";

export default Range;
