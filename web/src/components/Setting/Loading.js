import React, {
  useContext,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import useState from "react-usestateref";
import { UtilContext } from "context/UtilContext";
import {
  LinearProgress,
  Box,
  Typography,
  CircularProgress,
  Snackbar,
} from "@material-ui/core";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import WarningIcon from "@material-ui/icons/Warning";

const Loading = forwardRef((props, ref) => {
  const { status, children, mount } = props;
  const [_status, setStatus, statusRef] = useState(status);

  useImperativeHandle(ref, () => ({
    loading: () => setStatus(0),
    loaded: () => setStatus(1),
    error: () => setStatus(2),
    status: () => statusRef.current,
  }));

  return (
    <>
      <GridContainer
        style={{
          display: _status !== 1 ? "block" : "none",
          height: "100%",
          minHeight: "200px",
        }}
      >
        <GridItem xs={12} sm={12} md={12} style={{ height: " 100%" }}>
          {_status === 0 ? (
            <CircularProgress style={{ margin: "auto" }} />
          ) : null}
          {_status === 2 ? (
            <WarningIcon
              style={{ margin: "auto", width: "2em", height: "2em" }}
            />
          ) : null}
        </GridItem>
      </GridContainer>
      <div style={{ display: _status === 1 ? "block" : "none" }}>
        {children}
      </div>
    </>
  );
});
Loading.displayName = "Loading";

export default Loading;
