import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import MTab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div hidden={value !== index} id={`simple-tabpanel-${index}`} {...other}>
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

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
  const {
    options,
    color = "primary",
    innerStyle = {},
    onChange = () => {},
    ...rest
  } = props;

  const handleChange = (event, newValue) => {
    setValue(newValue);
    onChange();
  };

  return (
    <div className={classes.root} {...rest}>
      <AppBar position="static" color={color}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor={color == "primary" ? "secondary" : "primary"}
          variant="scrollable"
        >
          {Object.keys(options).map((key, i) => (
            <MTab label={key} key={i} />
          ))}
        </Tabs>
      </AppBar>
      {Object.keys(options).map((key, i) => (
        <TabPanel value={value} index={i} key={i} style={innerStyle}>
          {options[key]}
        </TabPanel>
      ))}
    </div>
  );
}
