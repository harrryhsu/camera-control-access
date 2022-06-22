import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// nodejs library to set properties for components
import PropTypes from "prop-types";

// material-ui components
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

import styles from "assets/jss/material-dashboard-react/components/buttonStyle.js";

const useStyles = makeStyles(styles);

export default function RegularButton(props) {
  const classes = useStyles();
  const {
    color = "primary",
    fullWidth,
    round,
    children,
    disabled,
    simple,
    size,
    block,
    link,
    justIcon,
    className,
    muiClasses,
    ...rest
  } = props;
  const btnClasses = classNames({
    [classes.button]: true,
    [classes[size]]: size,
    [classes[color]]: color,
    [classes.round]: round,
    [classes.disabled]: disabled,
    [classes.simple]: simple,
    [classes.block]: block,
    [classes.link]: link,
    [classes.justIcon]: justIcon,
    [className]: className,
  });

  var style = {
    margin: "20px auto 0",
    ...(props.style || {}),
    width: fullWidth ? "100%" : undefined,
  };
  if (color === "primary") {
    style = {
      background: disabled ? "#717171" : "#000",
      opacity: "0.7",
      ...style,
    };
  }

  return (
    <Button {...rest} classes={muiClasses} className={btnClasses} style={style}>
      {children}
    </Button>
  );
}
