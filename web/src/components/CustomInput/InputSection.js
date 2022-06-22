import React from "react";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import { Typography } from "@material-ui/core";

export default function InputSection(props) {
  const { title, children } = props;
  return (
    <GridItem xs={12} sm={12} md={12} style={{ margin: "30px 30px" }} block>
      <Typography
        variant="h4"
        style={{ paddingLeft: "16px", marginBottom: "20px" }}
      >
        {title}
      </Typography>
      <GridContainer>{children}</GridContainer>
    </GridItem>
  );
}
