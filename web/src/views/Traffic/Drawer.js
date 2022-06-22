import React, { useEffect, useContext } from "react";
import useState from "react-usestateref";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import { UtilContext } from "context/UtilContext";
import Select from "components/CustomInput/Select";
import Range from "components/CustomInput/Range";
import MultiSelect from "components/CustomInput/MultiSelect";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import AddIcon from "@material-ui/icons/Add";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import { v4 as uuidv4 } from "uuid";

import {
  Stage,
  Layer,
  Rect,
  Text,
  Circle,
  Line,
} from "react-konva/lib/ReactKonvaCore";

import "konva/lib/shapes/Rect";
import "konva/lib/shapes/Text";
import "konva/lib/shapes/Circle";
import "konva/lib/shapes/Line";
import { Fab, IconButton, Tooltip } from "@material-ui/core";
import WebRTCPlayer from "./WebRTCPlayer";

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0",
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF",
    },
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1",
    },
  },
};
const useStyles = makeStyles(styles);

const fullscreen = (elem) => {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  }
};

const degsToRads = (deg) => (deg * Math.PI) / 180.0;
const radsToDegs = (rad) => (rad * 180) / Math.PI;

const rotate = (origin, point, angle) => {
  const angleInRadian = degsToRads(angle);
  const ox = origin.x,
    oy = origin.y;
  const px = point.x,
    py = point.y;

  const qx =
    ox +
    Math.cos(angleInRadian) * (px - ox) -
    Math.sin(angleInRadian) * (py - oy);
  const qy =
    oy +
    Math.sin(angleInRadian) * (px - ox) +
    Math.cos(angleInRadian) * (py - oy);
  return { x: qx, y: qy };
};

const angleBetween = (p1, p2, p3) =>
  radsToDegs(
    Math.atan2(p3.y - p1.y, p3.x - p1.x) - Math.atan2(p2.y - p1.y, p2.x - p1.x)
  );

const distance = (p1, p2) => {
  var a = p1.x - p2.x,
    b = p1.y - p2.y;
  return Math.sqrt(a * a + b * b);
};

const moveToDistance = (origin, target, distance) => {
  const vector = { x: target.x - origin.x, y: target.y - origin.y };
  const length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
  const normalized = { x: vector.x / length, y: vector.y / length };
  const result = {
    x: origin.x + normalized.x * distance,
    y: origin.y + normalized.y * distance,
  };
  return result;
};

const STROKE_WIDTH = 3;

const DetectionLineWithDirection = (props) => {
  const { pts, setPts, name, onClick } = props;
  var [p1, p2, p3] = pts;
  const center = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
  if (!p3) p3 = moveToDistance(center, rotate(center, p1, 90), 25);
  const length = distance(center, p3);
  const p4 = moveToDistance(center, p3, -length);

  return (
    <>
      <Line
        x={p3.x}
        y={p3.y}
        points={[0, 0, p4.x - p3.x, p4.y - p3.y]}
        tension={0.5}
        closed
        stroke="yellow"
        strokeWidth={STROKE_WIDTH}
        onClick={onClick}
      />
      <Circle
        x={p3.x}
        y={p3.y}
        radius={5}
        fill="blue"
        onDragMove={(e) => {
          const target = { x: e.target.attrs.x, y: e.target.attrs.y };
          const length = distance(center, target);
          const p4 = moveToDistance(center, target, -length);
          setPts([
            ...pts.slice(0, 2),
            { x: target.x, y: target.y },
            { x: p4.x, y: p4.y },
          ]);
        }}
        draggable
      />
      <Circle x={p4.x} y={p4.y} radius={5} fill="red" />
      <Line
        x={p1.x}
        y={p1.y}
        points={[0, 0, p2.x - p1.x, p2.y - p1.y]}
        tension={0.5}
        closed
        stroke="yellow"
        strokeWidth={STROKE_WIDTH}
        onDragMove={(e) =>
          setPts([
            { x: e.target.attrs.x, y: e.target.attrs.y },
            {
              x: e.target.attrs.x + p2.x - p1.x,
              y: e.target.attrs.y + p2.y - p1.y,
            },
            {
              x: e.target.attrs.x + p3.x - p1.x,
              y: e.target.attrs.y + p3.y - p1.y,
            },
            {
              x: e.target.attrs.x + p4.x - p1.x,
              y: e.target.attrs.y + p4.y - p1.y,
            },
          ])
        }
        draggable
        onClick={onClick}
      />
      <Circle
        x={p1.x}
        y={p1.y}
        radius={5}
        fill="red"
        onDragMove={(e) => {
          const current = { x: e.target.attrs.x, y: e.target.attrs.y };
          const currentCenter = {
            x: (current.x + p2.x) / 2,
            y: (current.y + p2.y) / 2,
          };
          const angle = angleBetween(center, p1, p3);
          const tp = rotate(currentCenter, current, angle);
          const np3 = moveToDistance(currentCenter, tp, length);
          const np4 = moveToDistance(currentCenter, tp, -length);
          setPts([current, pts[1], np3, np4]);
        }}
        draggable
      />
      <Circle
        x={p2.x}
        y={p2.y}
        radius={5}
        fill="red"
        onDragMove={(e) => {
          const current = { x: e.target.attrs.x, y: e.target.attrs.y };
          const currentCenter = {
            x: (current.x + p1.x) / 2,
            y: (current.y + p1.y) / 2,
          };
          const angle = angleBetween(center, p1, p3);
          const tp = rotate(currentCenter, p1, angle);
          const np3 = moveToDistance(currentCenter, tp, length);
          const np4 = moveToDistance(currentCenter, tp, -length);
          setPts([pts[0], current, np3, np4]);
        }}
        draggable
      />
      <Text
        text={name}
        fontSize={15}
        x={center.x + 10}
        y={center.y + 10}
        fill="white"
        listening={false}
      />
    </>
  );
};

const DetectionLine = (props) => {
  const { pts, setPts, name, onClick } = props;
  const [p1, p2] = pts;
  const center = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
  const diff = { x: p2.x - p1.x, y: p2.y - p1.y };

  return (
    <>
      <Line
        x={p1.x}
        y={p1.y}
        points={[0, 0, diff.x, diff.y]}
        tension={0.5}
        closed
        stroke="yellow"
        strokeWidth={STROKE_WIDTH}
        onDragMove={(e) =>
          setPts([
            { x: e.target.attrs.x, y: e.target.attrs.y },
            {
              x: e.target.attrs.x + p2.x - p1.x,
              y: e.target.attrs.y + p2.y - p1.y,
            },
          ])
        }
        draggable
        onClick={onClick}
      />
      <Circle
        x={p1.x}
        y={p1.y}
        radius={5}
        fill="red"
        onDragMove={(e) => {
          setPts([{ x: e.target.attrs.x, y: e.target.attrs.y }, p2]);
        }}
        draggable
      />
      <Circle
        x={p2.x}
        y={p2.y}
        radius={5}
        fill="red"
        onDragMove={(e) => {
          setPts([p1, { x: e.target.attrs.x, y: e.target.attrs.y }]);
        }}
        draggable
      />
      <Text
        text={name}
        fontSize={15}
        x={center.x + 5}
        y={center.y - 5}
        fill="white"
        listening={false}
      />
    </>
  );
};

const DetectionShape = (props) => {
  const { pts, setPts, name, onClick } = props;

  if (!pts.length) return <div />;

  const points = pts.map((pt) => [pt.x - pts[0].x, pt.y - pts[0].y]).flat();

  var textPoint = { x: 0, y: 0 };
  pts.forEach((p) => {
    if (p.y >= textPoint.y) textPoint = p;
  });

  return (
    <>
      <Text
        text={name}
        fontSize={15}
        x={textPoint.x + 5}
        y={textPoint.y + 5}
        fill="white"
        listening={false}
      />
      <Line
        x={pts[0].x}
        y={pts[0].y}
        points={points}
        tension={0}
        closed
        stroke="yellow"
        strokeWidth={STROKE_WIDTH}
        onDragMove={(e) => {
          const newX = e.target.attrs.x;
          const newY = e.target.attrs.y;
          const newPoints = pts.map((pt) => ({
            x: newX + pt.x - pts[0].x,
            y: newY + pt.y - pts[0].y,
          }));

          setPts(newPoints);
        }}
        draggable
        onClick={onClick}
      />
      {pts.map((pt, i) => (
        <Circle
          key={i}
          x={pt.x}
          y={pt.y}
          radius={5}
          fill="red"
          onDragMove={(e) => {
            const newPts = [...pts];
            newPts[i] = { x: e.target.attrs.x, y: e.target.attrs.y };
            setPts(newPts);
          }}
          draggable
        />
      ))}
    </>
  );
};

const DetectionRect = (props) => {
  const { pts, setPts, name, onClick } = props;
  const [point, width, height] = pts;
  const points = [
    point,
    { x: point.x + width, y: point.y },
    { x: point.x, y: point.y + height },
    { x: point.x + width, y: point.y + height },
  ];

  var textPoint = { x: 0, y: 0 };
  points.forEach((p) => {
    if (p.y >= textPoint.y && p.x >= textPoint.x) textPoint = p;
  });

  return (
    <>
      <Text
        text={name}
        fontSize={15}
        x={textPoint.x + 10}
        y={textPoint.y + 10}
        fill="white"
      />
      <Rect
        x={points[0].x}
        y={points[0].y}
        width={width}
        height={height}
        strokeWidth={STROKE_WIDTH}
        stroke="yellow"
        draggable
        onDragMove={(e) => {
          const np = { x: e.target.attrs.x, y: e.target.attrs.y };
          setPts([np, width, height]);
        }}
        onClick={onClick}
      />
      <Circle
        x={points[0].x}
        y={points[0].y}
        radius={5}
        fill="red"
        onDragMove={(e) => {
          const np = { x: e.target.attrs.x, y: e.target.attrs.y };
          const dy = point.y - np.y,
            dx = point.x - np.x;
          setPts([np, width + dx, height + dy]);
        }}
        draggable
      />
      <Circle
        x={points[1].x}
        y={points[1].y}
        radius={5}
        fill="red"
        onDragMove={(e) => {
          const np = { x: e.target.attrs.x, y: e.target.attrs.y };
          const dy = point.y - np.y,
            dx = point.x + width - np.x;
          setPts([{ x: point.x, y: point.y - dy }, width - dx, height + dy]);
        }}
        draggable
      />
      <Circle
        x={points[2].x}
        y={points[2].y}
        radius={5}
        fill="red"
        onDragMove={(e) => {
          const np = { x: e.target.attrs.x, y: e.target.attrs.y };
          const dy = point.y + height - np.y,
            dx = point.x - np.x;
          setPts([{ x: point.x - dx, y: point.y }, width + dx, height - dy]);
        }}
        draggable
      />
      <Circle
        x={points[3].x}
        y={points[3].y}
        radius={5}
        fill="red"
        onDragMove={(e) => {
          const np = { x: e.target.attrs.x, y: e.target.attrs.y };
          const dy = point.y + height - np.y,
            dx = point.x + width - np.x;
          setPts([point, width - dx, height - dy]);
        }}
        draggable
      />
    </>
  );
};

const OPERATE_CLASS_ID_OPTIONS = {
  0: "Car",
  1: "Motor",
  2: "Truck",
  3: "Pedestrian",
  4: "Bus",
};

const LINE_MODE = {
  loose: "Loose",
  balanced: "Balanced",
  strict: "Strict",
};

const OPTIONS = {
  checkpoint: {
    name: "Checkpoint",
    type: "line_directed",
    unique: true,
    required: true,
    fields: {
      operate_class_id: {
        type: "multi-select",
        label: "Class IDs",
        options: OPERATE_CLASS_ID_OPTIONS,
      },
    },
  },
  turn: {
    name: "Turn",
    type: "line_directed",
    unique: false,
    fields: {
      operate_class_id: {
        type: "multi-select",
        label: "Class IDs",
        options: OPERATE_CLASS_ID_OPTIONS,
      },
      mode: {
        label: "Line Mode",
        type: "select",
        options: LINE_MODE,
      },
      direction: {
        label: "Direction",
        type: "select",
        options: {
          left: "Left",
          right: "Right",
          turn_around: "Turn Around",
          straight: "Straight",
          prohibited: "Prohibited",
        },
      },
    },
  },
  lane: {
    name: "Lane",
    type: "pentagon",
    unique: false,
    fields: {
      operate_class_id: {
        label: "Class IDs",
        type: "multi-select",
        options: OPERATE_CLASS_ID_OPTIONS,
      },
      direction: {
        label: "Direction",
        type: "select",
        options: {
          straight: "Straight",
          left: "Left",
          right: "Right",
          straight_left: "Straight/Left",
          straight_right: "Straight/Right",
          straight_right_left: "Straight/Right/Left",
        },
      },
    },
  },
  vehicle_queue: {
    name: "Vehicle Queue",
    type: "pentagon",
    unique: false,
    fields: {
      operate_class_id: {
        label: "Class IDs",
        type: "multi-select",
        options: OPERATE_CLASS_ID_OPTIONS,
      },
    },
  },
  checkpoint_lpd: {
    name: "Checkpoint License Plate",
    type: "pentagon",
    unique: true,
    required: true,
    fields: {
      operate_class_id: {
        label: "Class IDs",
        type: "multi-select",
        options: OPERATE_CLASS_ID_OPTIONS,
      },
    },
  },
  zebra_crossing: {
    name: "Crosswalk",
    type: "pentagon",
    unique: true,
  },
  traffic_light: {
    name: "Traffic Light",
    type: "rect",
    unique: true,
    fields: {
      num: {
        label: "Numbers of light",
        type: "range",
        min: 3,
        max: 6,
      },
    },
  },
  double_white: {
    name: "Double White",
    type: "line",
    unique: false,
  },
};

const DEFAULT = {
  line: [
    { x: 50, y: 30 },
    { x: 50, y: 80 },
  ],
  line_directed: [
    { x: 50, y: 30 },
    { x: 50, y: 80 },
    { x: 25, y: 55 },
    { x: 75, y: 55 },
  ],
  pentagon: [
    { x: 150, y: 30 },
    { x: 200, y: 30 },
    { x: 250, y: 30 },
    { x: 250, y: 80 },
    { x: 150, y: 80 },
  ],
  rect: [{ x: 150, y: 30 }, 200, 200],
};

const SIZE = [
  [1280, 720],
  [1600, 900],
];

const mapFieldDefault = (fieldDef) => {
  var defaultVal = "";
  if (fieldDef.type == "range") defaultVal = fieldDef.min;
  if (fieldDef.type == "select") defaultVal = Object.keys(fieldDef.options)[0];
  if (fieldDef.type == "multi-select")
    defaultVal = [Object.keys(fieldDef.options)[0]];
  return defaultVal;
};

const AddShapeDialog = (props) => {
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
};

var req;

const scale = (value, factor, toPixel) =>
  toPixel ? value * factor : value / factor;

export default function Drawer() {
  const { setError, setSuccess, api, setDialogSrc } = useContext(UtilContext);

  const [loading, setLoading] = useState(false);
  const [shapeData, setShapeData, shapeDataRef] = useState([]);
  const [videoSize, setVideoSize, videoSizeRef] = useState(0);

  const currentSize = SIZE[videoSize];

  const scaleShape = (shape, toPixel, newSize) => {
    newSize = newSize || SIZE[videoSizeRef.current];
    if (shape.type === "rect") {
      return {
        ...shape,
        data: [
          {
            x: scale(shape.data[0].x, newSize[0], toPixel),
            y: scale(shape.data[0].y, newSize[1], toPixel),
          },
          scale(shape.data[1], newSize[0], toPixel),
          scale(shape.data[2], newSize[1], toPixel),
        ],
      };
    } else {
      return {
        ...shape,
        data: shape.data.map((pt) => ({
          x: scale(pt.x, newSize[0], toPixel),
          y: scale(pt.y, newSize[1], toPixel),
        })),
      };
    }
  };

  const setDataAux = (i) => (entry) => {
    setShapeData([
      ...shapeData.slice(0, i),
      {
        ...shapeData[i],
        data: entry,
      },
      ...shapeData.slice(i + 1),
    ]);
  };

  const updateVideoSize = (size) => {
    const dataInPerc = shapeDataRef.current.map((shape) =>
      scaleShape(shape, false)
    );
    setVideoSize(size);
    setShapeData(
      dataInPerc.map((shape) => scaleShape(shape, true, SIZE[size]))
    );
  };

  useEffect(() => {
    const newSize = SIZE[videoSizeRef.current];
    const fullscreenElement =
      document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement;

    if (newSize[0] > 1280) {
      fullscreen(document.getElementById("traffic-container"));
    } else if (fullscreenElement !== null) {
      document.exitFullscreen();
    }
  }, [videoSize]);

  useEffect(() => {
    const fullscreenCallback = () => {
      const fullscreenElement =
        document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement;
      if (!fullscreenElement) updateVideoSize(0);
    };
    document.addEventListener("fullscreenchange", fullscreenCallback, false);

    return () =>
      document.removeEventListener("fullscreenchange", fullscreenCallback);
  }, []);

  useEffect(() => {
    req = api
      .GetDrawerConfig()
      .then((res) => {
        if (res.length) {
          const shapes = res.map((x) =>
            scaleShape(x, true, SIZE[videoSizeRef.current])
          );
          setShapeData(shapes);
        } else {
          setShapeData([
            ...Object.keys(OPTIONS)
              .filter((key) => OPTIONS[key].required)
              .map((key) => ({
                key: key,
                type: OPTIONS[key].type,
                data: DEFAULT[OPTIONS[key].type],
                addition: {},
                id: uuidv4(),
              })),
          ]);
        }
      })
      .catch(setError);
    return () => req && req.abort();
  }, []);

  return (
    <div>
      <GridContainer style={{ minHeight: "500px" }}>
        <GridItem xs={12} sm={12} md={12} id="traffic-container">
          <div style={{ position: "relative", margin: "50px auto 20px auto" }}>
            <WebRTCPlayer
              id="drawer"
              url={api.WebRTCUrl}
              style={{
                width: `${currentSize[0]}px`,
                height: `${currentSize[1]}px`,
              }}
            />
            <Stage
              id="test"
              width={currentSize[0]}
              height={currentSize[1]}
              style={{
                position: "absolute",
                margin: "auto",
                top: 0,
              }}
            >
              <Layer>
                {!loading
                  ? shapeDataRef.current.map((entry, i) => {
                      var Shape;
                      switch (entry.type) {
                        case "line":
                          Shape = DetectionLine;
                          break;
                        case "rect":
                          Shape = DetectionRect;
                          break;
                        case "pentagon":
                          Shape = DetectionShape;
                          break;
                        case "line_directed":
                          Shape = DetectionLineWithDirection;
                          break;
                        default:
                          console.error("Unkown type: " + entry.type);
                      }

                      return (
                        <Shape
                          key={i}
                          pts={entry.data}
                          setPts={setDataAux(i)}
                          name={entry.key}
                          addition={entry.addition}
                          onClick={() =>
                            setDialogSrc(
                              () => (
                                <AddShapeDialog
                                  currentShapeKey={entry.key}
                                  existingForm={entry.addition}
                                  onUpdate={(data) =>
                                    setShapeData([
                                      ...shapeDataRef.current.filter(
                                        (x) => x.id != entry.id
                                      ),
                                      { ...entry, addition: data },
                                    ]) ||
                                    setDialogSrc(
                                      null,
                                      document.getElementById(
                                        "traffic-container"
                                      )
                                    )
                                  }
                                  onDelete={(data) =>
                                    setShapeData([
                                      ...shapeDataRef.current.filter(
                                        (x) => x.id != entry.id
                                      ),
                                    ]) ||
                                    setDialogSrc(
                                      null,
                                      document.getElementById(
                                        "traffic-container"
                                      )
                                    )
                                  }
                                />
                              ),
                              document.getElementById("traffic-container")
                            )
                          }
                        />
                      );
                    })
                  : null}
              </Layer>
            </Stage>
            {!loading ? (
              <>
                <Fab
                  color="primary"
                  style={{
                    position: "absolute",
                    bottom: "20px",
                    right: "100px",
                  }}
                  onClick={() => {
                    setDialogSrc(
                      () => (
                        <AddShapeDialog
                          onSubmit={(fieldData) => {
                            var shapeKey = fieldData.key;
                            setDialogSrc(
                              null,
                              document.getElementById("traffic-container")
                            );
                            setShapeData([
                              ...shapeData,
                              {
                                id: uuidv4(),
                                key: shapeKey,
                                type: OPTIONS[shapeKey].type,
                                data: DEFAULT[OPTIONS[shapeKey].type],
                                addition: fieldData,
                                shapeKey,
                              },
                            ]);
                          }}
                          shapeData={shapeDataRef.current}
                        />
                      ),
                      document.getElementById("traffic-container")
                    );
                  }}
                >
                  <Tooltip title="Add">
                    <AddIcon />
                  </Tooltip>
                </Fab>
                <Fab
                  color="primary"
                  style={{
                    position: "absolute",
                    bottom: "20px",
                    right: "20px",
                  }}
                  onClick={() => {
                    var finalShape = shapeDataRef.current.map((x) =>
                      scaleShape(x, false, SIZE[videoSizeRef.current])
                    );
                    req = api
                      .SetDrawerConfig(finalShape)
                      .then(() => setSuccess("Success"))
                      .catch(setError);
                  }}
                >
                  <Tooltip title="Submit">
                    <ArrowUpwardIcon />
                  </Tooltip>
                </Fab>
                <IconButton
                  style={{
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                  }}
                  onClick={() =>
                    updateVideoSize(videoSizeRef.current == 1 ? 0 : 1)
                  }
                >
                  <FullscreenIcon />
                </IconButton>
              </>
            ) : null}
          </div>
        </GridItem>
      </GridContainer>
    </div>
  );
}
