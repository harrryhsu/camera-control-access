import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

export default function GridItem(props) {
  const { children, block = false, ...rest } = props;
  return (
    <Grid
      item
      {...rest}
      style={{
        display: block ? "block" : "flex",
        flexWrap: "wrap",
        ...rest.style,
      }}
    >
      {children}
    </Grid>
  );
}

GridItem.propTypes = {
  children: PropTypes.node,
};
