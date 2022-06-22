import React from "react";

export default function InputStyle(props) {
  const { margin = 2, inline, children } = props;

  const style = {
    minWidth: 200,
    margin: `${8 * margin}px auto 0 auto`,
    display: inline ? "inline" : "block",
  };

  return <div style={style}>{children}</div>;
}
