import React, { useEffect, useContext } from "react";
import useState from "react-usestateref";

// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import Select from "components/CustomInput/Select";
import Range from "components/CustomInput/Range";
import MultiSelect from "components/CustomInput/MultiSelect";
import Text from "components/CustomInput/Text";
import { UtilContext } from "context/UtilContext";

const mapFieldDefault = (fieldDef) => {
  var defaultVal = "";
  if (fieldDef.type == "range") defaultVal = fieldDef.min;
  if (fieldDef.type == "select") defaultVal = "";
  if (fieldDef.type == "number") defaultVal = 0;
  if (fieldDef.type == "multi-select") defaultVal = [];
  return defaultVal;
};

export default function Form(props) {
  const {
    onSubmit,
    onDelete,
    onUpdate,
    existingForm = {},
    config = {},
  } = props;
  const [form, setForm, formRef] = useState(existingForm);
  const [anchor, setAnchor, anchorRef] = useState(null);
  const { t } = useContext(UtilContext);

  const defaultForm = () =>
    Object.keys(config)
      .map((key) => ({ key, config: config[key] }))
      .toObject(
        (x) => x.key,
        (x) => mapFieldDefault(x.config)
      );

  useEffect(() => {
    setAnchor(document.getElementById("global-dialog"));
  }, []);

  console.log(defaultForm(), form);

  return (
    <form
      onSubmit={(...args) => {
        if (onSubmit) onSubmit({ ...defaultForm(), ...formRef.current });
        if (onUpdate) onUpdate({ ...defaultForm(), ...formRef.current });
      }}
    >
      <GridContainer
        style={{ padding: "20px 80px 40px", flexDirection: "column" }}
      >
        {Object.keys(config).map((key, i) => {
          const field = config[key];
          const label = t(field.label);
          if (field.type == "text")
            return (
              <GridItem xs={12} sm={12} md={12} key={i}>
                <Text
                  id={key}
                  required={config.required}
                  value={form[key] ?? field.default ?? ""}
                  onChange={(v) => setForm({ ...formRef.current, [key]: v })}
                  label={label}
                  anchor={anchor}
                />
              </GridItem>
            );
          if (field.type == "number")
            return (
              <GridItem xs={12} sm={12} md={12} key={i}>
                <Text
                  numeric
                  id={key}
                  required={config.required}
                  value={form[key] ?? field.default ?? 0}
                  onChange={(v) => setForm({ ...formRef.current, [key]: v })}
                  label={label}
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
                  value={form[key] ?? field.default ?? field.min}
                  onChange={(v) => setForm({ ...formRef.current, [key]: v })}
                  label={label}
                  anchor={anchor}
                />
              </GridItem>
            );
          if (field.type == "select")
            return (
              <GridItem xs={12} sm={12} md={12} key={i}>
                <Select
                  id={key}
                  value={form[key] ?? field.default ?? ""}
                  required={config.required}
                  onChange={(v) => setForm({ ...formRef.current, [key]: v })}
                  label={label}
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
                  value={form[key] ?? field.default ?? []}
                  required={config.required}
                  onChange={(v) => setForm({ ...formRef.current, [key]: v })}
                  label={label}
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
              onClick={() => onDelete({ ...defaultForm(), ...formRef.current })}
              style={{ margin: "20px 0 0 0" }}
              fullWidth
            >
              {t("Delete")}
            </Button>
          </GridItem>
        ) : null}
        {onUpdate ? (
          <GridItem xs={12} sm={12} md={12}>
            <Button style={{ margin: "20px 0 0 0" }} fullWidth type="submit">
              {t("Update")}
            </Button>
          </GridItem>
        ) : null}
        {onSubmit ? (
          <GridItem xs={12} sm={12} md={12}>
            <Button style={{ margin: "20px 0 0 0" }} fullWidth type="submit">
              {t("Add")}
            </Button>
          </GridItem>
        ) : null}
      </GridContainer>
    </form>
  );
}
