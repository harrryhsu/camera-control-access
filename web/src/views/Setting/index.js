import React, { useContext, useEffect, useState } from "react";
import Form from "components/Form";
import { UtilContext } from "context/UtilContext";

const Setting = (props) => {
  const { id, config } = props;
  const {
    api,
    setError,
    setSuccess,
    metadata: { STREAM },
  } = useContext(UtilContext);
  const [form, setForm] = useState(null);

  useEffect(() => {
    api.GetSetting(id).then(setForm).catch(setError);
  }, []);

  if (!form) return null;

  return (
    <Form
      config={config}
      id={id}
      existingForm={form}
      onUpdate={(data) =>
        api
          .PostSetting({ data })
          .then(() => setSuccess("Updated"))
          .catch(setError)
      }
    />
  );
};

export default Setting;
