import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import MTab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    width: "100%",
  },
}));

export default function Tab(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const { options, color = "primary", onChange = () => {}, ...rest } = props;
  const [loaded, setLoaded] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    onChange();
    if (!loaded.includes(value)) setLoaded([...loaded, value]);
  };

  return (
    <div className={classes.root} {...rest}>
      <AppBar
        position="static"
        color={color}
        style={{ color: "black", backgroundColor: "white" }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor={color}
          variant="scrollable"
        >
          {Object.keys(options).map((key, i) => (
            <MTab label={key} key={i} />
          ))}
        </Tabs>
      </AppBar>

      {Object.keys(options).map((key, index) => (
        <div hidden={value !== index} id={`tabpanel-${index}`} key={index}>
          {value === index || loaded.includes(index) ? (
            <Box p={3}>
              {typeof options[key] == "function"
                ? options[key]()
                : options[key]}
            </Box>
          ) : null}
        </div>
      ))}
    </div>
  );
}
