import React from "react";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import Drawer from "./Drawer";

const Traffic = (props) => {
  const pathSeg = window.location.pathname.split("/");
  const id = parseInt(pathSeg[pathSeg.length - 1]);

  return (
    <>
      <GridContainer key={id}>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardBody style={{ padding: "0 40px" }}>
              <GridContainer style={{ marginTop: "-20px" }}>
                <Drawer id={id} />
              </GridContainer>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </>
  );
};

export default Traffic;
