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

  useEffect(() => {
    setAnchor(document.getElementById("global-dialog"));
  }, []);

  return (
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
                value={form[key] ?? ""}
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
                value={form[key] ?? ""}
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
                value={form[key] ?? field.min}
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
                value={form[key] ?? ""}
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
                value={form[key] ?? []}
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
            onClick={() => onDelete(formRef.current)}
            style={{ margin: "20px 0 0 0" }}
            fullWidth
          >
            {t("Delete")}
          </Button>
        </GridItem>
      ) : null}
      {onUpdate ? (
        <GridItem xs={12} sm={12} md={12}>
          <Button
            onClick={() => onUpdate(formRef.current)}
            style={{ margin: "20px 0 0 0" }}
            fullWidth
          >
            {t("Update")}
          </Button>
        </GridItem>
      ) : null}
      {onSubmit ? (
        <GridItem xs={12} sm={12} md={12}>
          <Button
            onClick={() => onSubmit({ ...formRef.current })}
            style={{ margin: "20px 0 0 0" }}
            fullWidth
          >
            {t("Add")}
          </Button>
        </GridItem>
      ) : null}
    </GridContainer>
  );
}
