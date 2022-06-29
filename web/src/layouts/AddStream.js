import React, { useEffect, useContext } from "react";
import useState from "react-usestateref";

// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import Text from "components/CustomInput/Text";

export default function AddStream(props) {
  const { existingForm, onSubmit, onUpdate, onDelete } = props;
  const [form, setForm, formRef] = useState(
    existingForm != null ? existingForm : {}
  );

  return (
    <GridContainer
      style={{ padding: "20px 80px 40px", flexDirection: "column" }}
    >
      <Text
        id="name"
        value={form.name ?? ""}
        onChange={(v) => setForm({ ...formRef.current, name: v })}
        label="Name"
      />
      <Text
        id="rtsp"
        value={form.rtsp ?? ""}
        onChange={(v) => setForm({ ...formRef.current, rtsp: v })}
        label="RTSP Url"
      />
      <Text
        id="api"
        value={form.api ?? ""}
        onChange={(v) => setForm({ ...formRef.current, api: v })}
        label="NX Api"
      />
      <Text
        id="location-index"
        value={form.locationIndex ?? ""}
        onChange={(v) => setForm({ ...formRef.current, locationIndex: v })}
        label="Location Index"
      />
      <Text
        id="camera-index"
        value={form.cameraIndex ?? ""}
        onChange={(v) => setForm({ ...formRef.current, cameraIndex: v })}
        label="Camera Index"
      />
      {!onSubmit ? null : (
        <GridItem xs={12} sm={12} md={12}>
          <Button
            onClick={() => onSubmit(formRef.current)}
            style={{ margin: "20px 0 0 0" }}
            fullWidth
          >
            Add
          </Button>
        </GridItem>
      )}
      {!onUpdate ? null : (
        <GridItem xs={12} sm={12} md={12}>
          <Button
            onClick={() => onUpdate(formRef.current)}
            style={{ margin: "20px 0 0 0" }}
            fullWidth
          >
            Update
          </Button>
        </GridItem>
      )}
      {!onDelete ? null : (
        <GridItem xs={12} sm={12} md={12}>
          <Button
            onClick={() => onDelete()}
            style={{ margin: "20px 0 0 0" }}
            fullWidth
          >
            Delete
          </Button>
        </GridItem>
      )}
    </GridContainer>
  );
}
