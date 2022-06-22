import React, { useContext, useEffect, useRef } from "react";
import useState from "react-usestateref";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Select from "components/CustomInput/Select";
import MultiSelect from "components/CustomInput/MultiSelect";
import Switch from "components/CustomInput/Switch";
import Range from "components/CustomInput/Range";
import Text from "components/CustomInput/Text";
import { UtilContext } from "context/UtilContext";
import Button from "components/CustomButtons/Button.js";
import DateTime from "components/CustomInput/DateTime";
import MaterialTable from "material-table";
import CircularProgress from "@material-ui/core/CircularProgress";
import Loading from "./Loading";

const Input = (def, form, update) => {
  const constraint = def.constraint;

  const props = {
    id: def.name,
    label: def.label,
    value: form[def.name],
    onChange: (v) => update(def.name, v),
    disabled: def.constraint.readOnly,
  };

  if (def.type.startsWith("List")) {
    if (def.type === "List::Enum") {
      return (
        <MultiSelect
          {...props}
          options={constraint.enums}
          onChange={(v) =>
            update(
              def.name,
              v.map((x) => parseInt(x))
            )
          }
        />
      );
    } else if (def.type === "List::String") {
      return <MultiSelect {...props} options={constraint.fields} />;
    }
  } else if (def.type === "Int32") {
    if (constraint.min !== undefined) {
      return (
        <Range
          {...props}
          min={constraint.min}
          max={constraint.max}
          step={constraint.step}
        />
      );
    } else {
      return <Text {...props} type="number" numeric />;
    }
  } else if (def.type === "Enum") {
    return <Select {...props} options={constraint.enums} />;
  } else if (def.type === "String") {
    if (constraint.fields) {
      return <Select {...props} options={constraint.fields} />;
    } else {
      return <Text {...props} />;
    }
  } else if (def.type === "Boolean") {
    return <Switch {...props} />;
  } else if (def.type === "DateTime") {
    return (
      <DateTime
        {...props}
        value={new Date(form[def.name])}
        onChange={(date) => update(def.name, date.toISOString())}
      />
    );
  }
  throw "Unsupported Type: " + def.type;
};

export default function SettingBuilder(props) {
  const {
    target,
    reset,
    autoSubmit,
    render_BeforeSubmit,
    onReset: _onReset,
    onSubmit: _onSubmit,
    onGet: _onGet,
  } = props;
  const { api, setError, setSuccess } = useContext(UtilContext);
  const [form, setForm, formRef] = useState({});
  const [definition, setDefinition, definitionRef] = useState([]);
  const [timeoutHandler, setTimeoutHandler, timeoutHandlerRef] = useState(null);
  const req = useRef();
  const loadingRef = useRef();

  const update = (k, v) => {
    setForm({ ...formRef.current, [k]: v });
    if (!autoSubmit) return;
    if (timeoutHandlerRef.current) clearTimeout(timeoutHandlerRef.current);
    setTimeoutHandler(
      setTimeout(() => {
        onSubmit();
      }, 2000)
    );
  };

  const onSubmit = () => {
    req.current = (_onSubmit
      ? _onSubmit(formRef.current)
      : api.PostSetting(target, formRef.current)
    )
      .then(() => setSuccess("Saved") || onGet())
      .catch(setError);
  };

  const onReset = () => {
    req.current = (_onReset ? _onReset() : api.ResetSetting(target))
      .then(() => onGet().then(() => setSuccess("Reset")))
      .catch(setError);
  };

  const onGet = () => {
    var get = (_onGet ? _onGet() : api.GetSetting(target))
      .then((definition) => {
        setForm(
          definition.reduce((acc, v) => ({ ...acc, [v.name]: v.value }), {})
        );
        setDefinition(definition);
      })
      .catch(setError);
    req.current = get;
    return get;
  };

  useEffect(() => {
    onGet().then(loadingRef.current.loaded).catch(loadingRef.current.error);

    return () =>
      (timeoutHandlerRef.current && clearTimeout(timeoutHandlerRef.current)) ||
      (req.current && req.current.abort());
  }, []);

  return (
    <Loading ref={loadingRef} status={0}>
      <GridContainer style={{ maxWidth: "200px", margin: "auto" }}>
        {definition.map((def, i) => {
          var renderKey = "render_" + def.name;
          var comp;
          if (props[renderKey])
            comp = props[renderKey](
              def,
              definition,
              formRef.current,
              update,
              () => Input(def, formRef.current, update)
            );
          else comp = Input(def, formRef.current, update);

          return (
            <GridItem xs={12} sm={12} md={12} key={i}>
              {comp}
            </GridItem>
          );
        })}
        {render_BeforeSubmit ? render_BeforeSubmit() : null}
        {!autoSubmit ? (
          <GridItem xs={12} sm={12} md={12}>
            <Button fullWidth onClick={onSubmit}>
              Submit
            </Button>
          </GridItem>
        ) : null}
        {reset ? (
          <GridItem xs={12} sm={12} md={12}>
            <Button fullWidth onClick={onReset}>
              Reset
            </Button>
          </GridItem>
        ) : null}
      </GridContainer>
    </Loading>
  );
}
