import React, { useContext } from "react";
import Card from "components/Card/Card.js";
import Tab from "components/CustomTabs/Tab";
import Traffic from "./Traffic/Traffic";
import { UtilContext } from "context/UtilContext";
import Setting from "./Setting";
import Record from "./Record";

const TabBuilder = (props) => {
  const { pages, id } = props;
  const { t } = useContext(UtilContext);

  const options = {};
  for (const page of pages) {
    var Component;
    switch (page.type) {
      case "traffic":
        Component = Traffic;
        break;
      case "setting":
        Component = Setting;
        break;
      case "record":
        Component = Record;
        break;
    }

    if (Component)
      options[t(page.title)] = <Component id={id} {...page.props} />;
  }

  return (
    <>
      <Card>
        <Tab options={options} />
      </Card>
    </>
  );
};

export default TabBuilder;
