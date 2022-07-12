import React from "react";
import GridContainer from "components/Grid/GridContainer.js";
import Drawer from "./Drawer";

const Traffic = (props) => {
  const { id, ...rest } = props;
  return (
    <GridContainer style={{ marginTop: "-40px" }}>
      <Drawer id={id} {...rest} />
    </GridContainer>
  );
};

export default Traffic;
