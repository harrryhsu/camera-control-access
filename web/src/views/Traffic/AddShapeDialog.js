import React, { useEffect, useContext } from "react";
import useState from "react-usestateref";

// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import { UtilContext } from "context/UtilContext";
import Select from "components/CustomInput/Select";
import Range from "components/CustomInput/Range";
import MultiSelect from "components/CustomInput/MultiSelect";
import Text from "components/CustomInput/Text";
import Form from "components/Form";

export default function AddShapeDialog(props) {
  const {
    onSubmit,
    onDelete,
    onUpdate,
    existingForm,
    shapeData,
    currentShapeKey,
    options,
  } = props;
  const [anchor, setAnchor, anchorRef] = useState(null);
  const [shapeKey, setShapeKey, shapeKeyRef] = useState(
    currentShapeKey ?? "placeholder"
  );
  const { t } = useContext(UtilContext);
  const shape = options[shapeKey];

  useEffect(() => {
    setAnchor(document.getElementById("global-dialog"));
  }, []);

  return (
    <>
      <GridContainer
        style={{
          padding: "20px 80px 0",
          marginBottom: -20,
          flexDirection: "column",
        }}
      >
        {!existingForm ? (
          <GridItem xs={12} sm={12} md={12}>
            <Select
              id="shape"
              label={t("Shape to add")}
              value={shapeKey}
              onChange={setShapeKey}
              anchor={anchor}
              options={{
                placeholder: t("Select Shape"),
                ...Object.keys(options)
                  .filter(
                    (key) =>
                      !(
                        options[key].unique &&
                        shapeData.some((d) => d.key == key)
                      )
                  )
                  .reduce(
                    (acc, key) => ({ ...acc, [key]: options[key].name }),
                    {}
                  ),
              }}
            />
          </GridItem>
        ) : null}
      </GridContainer>
      <Form
        onSubmit={
          onSubmit
            ? (form) => onSubmit({ ...form, key: shapeKeyRef.current })
            : null
        }
        onDelete={onDelete}
        onUpdate={onUpdate}
        existingForm={existingForm}
        config={shape?.fields}
      />
    </>
  );
}
