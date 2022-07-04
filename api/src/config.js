const LINE_MODE = {
  loose: "Loose",
  balanced: "Balanced",
  strict: "Strict",
};

const DEFAULT_FIELDS = {
  name: {
    type: "text",
    label: "Name",
  },
};

const OPERATE_CLASS_ID_FIELD = {
  operate_class_id: {
    type: "multi-select",
    label: "Class IDs",
    options: {
      0: "Car",
      1: "Motor",
      2: "Truck",
      3: "Pedestrian",
      4: "Bus",
    },
  },
};

const DIRECTION_FIELD = {
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
};

const OPTIONS = {
  checkpoint: {
    name: "Checkpoint",
    type: "line_directed",
    unique: true,
    required: true,
    fields: {
      ...DEFAULT_FIELDS,
      ...OPERATE_CLASS_ID_FIELD,
    },
  },
  turn: {
    name: "Turn",
    type: "line_directed",
    unique: false,
    fields: {
      ...DEFAULT_FIELDS,
      ...OPERATE_CLASS_ID_FIELD,
      mode: {
        label: "Line Mode",
        type: "select",
        options: LINE_MODE,
      },
      ...DIRECTION_FIELD,
    },
  },
  lane: {
    name: "Lane",
    type: "pentagon",
    unique: false,
    fields: {
      ...DEFAULT_FIELDS,
      ...OPERATE_CLASS_ID_FIELD,
      ...DIRECTION_FIELD,
    },
  },
  vehicle_queue: {
    name: "Vehicle Queue",
    type: "pentagon",
    unique: false,
    fields: {
      ...DEFAULT_FIELDS,
      ...OPERATE_CLASS_ID_FIELD,
    },
  },
  checkpoint_lpd: {
    name: "Checkpoint License Plate",
    type: "pentagon",
    unique: true,
    required: true,
    fields: {
      ...DEFAULT_FIELDS,
      ...OPERATE_CLASS_ID_FIELD,
    },
  },
  zebra_crossing: {
    name: "Crosswalk",
    type: "pentagon",
    unique: true,
    fields: {
      ...DEFAULT_FIELDS,
    },
  },
  traffic_light: {
    name: "Traffic Light",
    type: "rect",
    unique: true,
    fields: {
      ...DEFAULT_FIELDS,
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
    fields: {
      ...DEFAULT_FIELDS,
    },
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

const SCREEN_SIZE = [
  [1280, 720],
  [1600, 900],
];

const TARGET_CONFIG = {
  name: {
    type: "text",
    label: "Name",
  },
  rtsp: {
    type: "text",
    label: "RTSP",
  },
  api: {
    type: "text",
    label: "API",
  },
  locationIndex: {
    type: "number",
    label: "Location Index",
  },
  cameraIndex: {
    type: "number",
    label: "Camera Index",
  },
};

module.exports = {
  SCREEN_SIZE,
  DEFAULT,
  OPTIONS,
  TARGET_CONFIG,
};
