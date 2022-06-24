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

const mapFieldDefault = (fieldDef) => {
  var defaultVal = "";
  if (fieldDef.type == "range") defaultVal = fieldDef.min;
  if (fieldDef.type == "select") defaultVal = Object.keys(fieldDef.options)[0];
  if (fieldDef.type == "multi-select")
    defaultVal = [Object.keys(fieldDef.options)[0]];
  return defaultVal;
};

export default function AddShapeDialog(props) {
  const {
    onSubmit,
    onDelete,
    onUpdate,
    existingForm,
    shapeData,
    currentShapeKey,
  } = props;
  const [form, setForm, formRef] = useState({});
  const [anchor, setAnchor, anchorRef] = useState(null);
  const [shapeKey, setShapeKey, shapeKeyRef] = useState(
    currentShapeKey ?? "placeholder"
  );
  const {
    metadata: {
      config: { OPTIONS },
    },
  } = useContext(UtilContext);
  const shape = OPTIONS[shapeKey];

  useEffect(() => {
    setAnchor(document.getElementById("global-dialog"));
  }, []);

  useEffect(() => {
    if (shapeKeyRef.current == "placeholder") return;
    const shape = OPTIONS[shapeKeyRef.current];
    setForm(
      shape.fields
        ? Object.keys(shape.fields).reduce(
            (acc, key) => ({
              ...acc,
              [key]: existingForm
                ? existingForm[key]
                : mapFieldDefault(shape.fields[key]),
            }),
            { key: shapeKey }
          )
        : {}
    );
  }, [shapeKey]);

  return (
    <GridContainer
      style={{ padding: "20px 80px 40px", flexDirection: "column" }}
    >
      {!existingForm ? (
        <GridItem xs={12} sm={12} md={12}>
          <Select
            id="shape"
            label="Shape to add"
            value={shapeKey}
            onChange={setShapeKey}
            anchor={anchor}
            options={{
              placeholder: "Select Shape",
              ...Object.keys(OPTIONS)
                .filter(
                  (key) =>
                    !(
                      OPTIONS[key].unique && shapeData.some((d) => d.key == key)
                    )
                )
                .reduce(
                  (acc, key) => ({ ...acc, [key]: OPTIONS[key].name }),
                  {}
                ),
            }}
          />
        </GridItem>
      ) : null}
      {Object.keys(shape?.fields ?? {}).map((key, i) => {
        const field = shape.fields[key];
        if (field.type == "text")
          return (
            <GridItem xs={12} sm={12} md={12} key={i}>
              <Text
                id={key}
                value={form[key] ?? ""}
                onChange={(v) => setForm({ ...formRef.current, [key]: v })}
                label={field.label}
                anchor={anchor}
              />
            </GridItem>
          );
        if (field.type == "range")
          return (
            <GridItem xs={12} sm={12} md={12} key={i}>
              <Range
                id={key}
                min={field.min}
                max={field.max}
                value={form[key] ?? field.min}
                onChange={(v) => setForm({ ...formRef.current, [key]: v })}
                label={field.label}
                anchor={anchor}
              />
            </GridItem>
          );
        if (field.type == "select")
          return (
            <GridItem xs={12} sm={12} md={12} key={i}>
              <Select
                id={key}
                value={form[key] ?? ""}
                onChange={(v) => setForm({ ...formRef.current, [key]: v })}
                label={field.label}
                options={field.options}
                anchor={anchor}
              />
            </GridItem>
          );
        if (field.type == "multi-select")
          return (
            <GridItem xs={12} sm={12} md={12} key={i}>
              <MultiSelect
                id={key}
                value={form[key] ?? []}
                onChange={(v) => setForm({ ...formRef.current, [key]: v })}
                label={field.label}
                options={field.options ?? {}}
                anchor={anchor}
              />
            </GridItem>
          );
      })}
      <GridItem xs={12} sm={12} md={12} />
      {onDelete ? (
        <GridItem xs={12} sm={12} md={12}>
          <Button
            onClick={() => onDelete(formRef.current)}
            style={{ margin: "20px 0 0 0" }}
            fullWidth
          >
            Delete
          </Button>
        </GridItem>
      ) : null}
      {onUpdate && shape?.fields ? (
        <GridItem xs={12} sm={12} md={12}>
          <Button
            onClick={() => onUpdate(formRef.current)}
            style={{ margin: "20px 0 0 0" }}
            fullWidth
          >
            Update
          </Button>
        </GridItem>
      ) : null}
      {onSubmit ? (
        <GridItem xs={12} sm={12} md={12}>
          <Button
            onClick={() => onSubmit({ ...formRef.current, key: shapeKey })}
            style={{ margin: "20px 0 0 0" }}
            fullWidth
            disabled={shapeKey == "placeholder"}
          >
            Add
          </Button>
        </GridItem>
      ) : null}
    </GridContainer>
  );
}
