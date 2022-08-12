import React from "react";
import useState from "react-usestateref";
import InputStyle from "./InputStyle";
import DateTime from "./DateTime";
import moment from "moment";

const DateTimeRangePicker = (props) => {
  const {
    onChange,
    style,
    type = "datetime",
    value = [null, null],
    placeHolderFrom = "From",
    placeHolderTo = "To",
    ...rest
  } = props;
  const [time, _setTime, timeRef] = useState([value[0], value[1]]);
  const setTime = (v) => _setTime(v) || onChange(timeRef.current);

  return (
    <InputStyle {...props} wrapperStyle={{ display: "inline", ...style }}>
      <div style={{ display: "inline" }}>
        <DateTime
          type={type}
          style={{
            marginBottom: 10,
            verticalAlign: "middle",
          }}
          value={time[0]}
          onChange={(v) => setTime([v, timeRef.current[1]])}
          margin={"none"}
          placeholder={placeHolderFrom}
          {...rest}
        />
        <DateTime
          type={type}
          style={{ verticalAlign: "middle" }}
          value={time[1]}
          onChange={(v) => setTime([timeRef.current[0], v])}
          margin={"none"}
          placeholder={placeHolderTo}
          {...rest}
        />
      </div>
    </InputStyle>
  );
};

export default DateTimeRangePicker;
