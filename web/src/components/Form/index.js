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
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardHeader from "@material-ui/core/CardHeader";

const mapFieldDefault = (fieldDef) => {
  var defaultVal = "";
  if (fieldDef.type == "range") defaultVal = fieldDef.min;
  if (fieldDef.type == "select") defaultVal = "";
  if (fieldDef.type == "number") defaultVal = 0;
  if (fieldDef.type == "multi-select") defaultVal = [];
  return defaultVal;
};

const FormField = (props) => {
  const { form, setForm, fieldKey, config, anchor } = props;
  const { t } = useContext(UtilContext);
  const field = config[fieldKey];
  const label = t(field.label);
  const fieldProps = {
    id: fieldKey,
    required: field.required,
    onChange: (v) => setForm((form) => ({ ...form, [fieldKey]: v })),
    label,
    anchor,
  };
  if (field.type == "group")
    return (
      <GridItem xs={12} sm={12} md={12}>
        <Card style={{ margin: "auto" }}>
          <CardHeader title={label} style={{ paddingBottom: 0 }} />
          <CardContent style={{ paddinTop: 0 }}>
            {Object.keys(field.fields).map((key, i) => (
              <FormField
                {...props}
                config={field.fields}
                fieldKey={key}
                key={i}
                form={form[fieldKey] ?? {}}
                setForm={(value) => {
                  if (typeof value === "function")
                    setForm((form) => ({
                      ...form,
                      [fieldKey]: value(form[fieldKey]),
                    }));
                  else setForm((form) => ({ ...form, [fieldKey]: value }));
                }}
              />
            ))}
          </CardContent>
        </Card>
      </GridItem>
    );
  if (field.type == "text")
    return (
      <GridItem xs={12} sm={12} md={12}>
        <Text {...fieldProps} value={form[fieldKey] ?? field.default ?? ""} />
      </GridItem>
    );
  if (field.type == "number")
    return (
      <GridItem xs={12} sm={12} md={12}>
        <Text
          {...fieldProps}
          numeric
          min={field.min}
          max={field.max}
          value={form[fieldKey] ?? field.default ?? field.min}
          onChange={(v) =>
            setForm((form) => ({ ...form, [fieldKey]: parseInt(v) }))
          }
        />
      </GridItem>
    );
  if (field.type == "float")
    return (
      <GridItem xs={12} sm={12} md={12}>
        <Text
          {...fieldProps}
          numeric
          min={field.min}
          max={field.max}
          value={form[fieldKey] ?? field.default ?? field.min}
          onChange={(v) =>
            setForm((form) => ({ ...form, [fieldKey]: parseFloat(v) }))
          }
        />
      </GridItem>
    );
  if (field.type == "range")
    return (
      <GridItem xs={12} sm={12} md={12}>
        <Range
          {...fieldProps}
          min={field.min}
          max={field.max}
          value={form[fieldKey] ?? field.default ?? field.min}
        />
      </GridItem>
    );
  if (field.type == "select")
    return (
      <GridItem xs={12} sm={12} md={12}>
        <Select
          {...fieldProps}
          value={form[fieldKey] ?? field.default ?? ""}
          options={field.options}
        />
      </GridItem>
    );
  if (field.type == "multi-select")
    return (
      <GridItem xs={12} sm={12} md={12}>
        <MultiSelect
          {...fieldProps}
          value={form[fieldKey] ?? field.default ?? []}
          options={field.options ?? {}}
        />
      </GridItem>
    );
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

  console.log(form);

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

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (onSubmit) onSubmit({ ...defaultForm(), ...formRef.current });
        else if (onUpdate) onUpdate({ ...defaultForm(), ...formRef.current });
      }}
    >
      <GridContainer
        style={{ padding: "20px 80px 40px", flexDirection: "column" }}
      >
        {Object.keys(config).map((key, i) => (
          <FormField
            anchor={anchor}
            form={form}
            setForm={setForm}
            fieldKey={key}
            key={i}
            config={config}
          />
        ))}
        <GridItem xs={12} sm={12} md={12} />
        {onDelete ? (
          <GridItem xs={12} sm={12} md={12}>
            <Button
              onClick={() => onDelete({ ...defaultForm(), ...formRef.current })}
              style={{ margin: "20px auto 0", maxWidth: 200 }}
              fullWidth
            >
              {t("Delete")}
            </Button>
          </GridItem>
        ) : null}
        {onUpdate ? (
          <GridItem xs={12} sm={12} md={12}>
            <Button
              style={{ margin: "20px auto 0", maxWidth: 200 }}
              fullWidth
              type="submit"
            >
              {t("Update")}
            </Button>
          </GridItem>
        ) : null}
        {onSubmit ? (
          <GridItem xs={12} sm={12} md={12}>
            <Button
              style={{ margin: "20px auto 0", maxWidth: 200 }}
              fullWidth
              type="submit"
            >
              {t("Add")}
            </Button>
          </GridItem>
        ) : null}
      </GridContainer>
    </form>
  );
}
