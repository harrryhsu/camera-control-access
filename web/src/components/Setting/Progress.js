import React, { useContext, useEffect } from "react";
import useState from "react-usestateref";
import { UtilContext } from "context/UtilContext";
import {
  LinearProgress,
  Box,
  Typography,
  CircularProgress,
  Snackbar,
} from "@material-ui/core";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";

function LinearProgressWithLabel(props) {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

function CircularProgressWithLabel(props) {
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress variant="determinate" {...props} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography
          variant="caption"
          component="div"
          color="textSecondary"
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

let ws, handle;

const Progress = (props) => {
  const { api, setError, setSuccess } = useContext(UtilContext);
  const [progress, setProgress, progressRef] = useState([]);

  const buildWs = () => {
    ws = api.GetProgress();

    ws.onopen = () => setProgress([]);

    ws.onmessage = ({ data }) => {
      setProgress(JSON.parse(data));
    };

    const onError = () => {
      handle = setTimeout(() => {
        buildWs();
        ws.onopen = () => setSuccess("Live feed reconnected");
      }, 3000);
    };

    ws.addEventListener("error", onError);

    return () =>
      clearTimeout(handle) ||
      ws.removeEventListener("error", onError) ||
      ws.close();
  };

  useEffect(() => {
    return buildWs();
  }, []);

  return (
    <Snackbar
      open={!!progress.length}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      onClose={() => {}}
    >
      {open ? (
        <Card
          style={{ boxShadow: "3px 3px 3px 3px rgb(0 0 0 / 14%)", margin: 0 }}
        >
          <CardBody style={{ padding: "10px 40px" }}>
            <GridContainer direction="column">
              {progress.map((p, i) => (
                <GridItem
                  xs={12}
                  sm={12}
                  md={12}
                  key={i}
                  style={{ margin: "5px auto" }}
                >
                  <Typography style={{ margin: "auto 10px auto 0" }}>
                    {p.Name}
                  </Typography>
                  {p.IsDetermined ? (
                    <CircularProgressWithLabel value={p.Progress} />
                  ) : (
                    <CircularProgress />
                  )}
                </GridItem>
              ))}
            </GridContainer>
          </CardBody>
        </Card>
      ) : null}
    </Snackbar>
  );
};

export default Progress;
