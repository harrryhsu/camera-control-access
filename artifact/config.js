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

const DEFAULT_FIELDS = {
  name: {
    type: "text",
    label: "Name",
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
      ...DEFAULT_FIELDS,
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
      ...DEFAULT_FIELDS,
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
      lane_number: {
        label: "Lane number",
        type: "text",
      },
    },
  },
  vehicle_queue: {
    name: "Vehicle Queue",
    type: "pentagon",
    unique: false,
    fields: {
      ...DEFAULT_FIELDS,
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
      ...DEFAULT_FIELDS,
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

const APIS = [
  {
    name: "TEST1",
    api: "http://host.docker.internal:1002/api/drawer/1",
    rtsp: "rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mp4",
  },
  {
    name: "TEST2",
    api: "http://host.docker.internal:1002/api/drawer/2",
    rtsp: "rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mp4",
  },
];

module.exports = {
  SCREEN_SIZE,
  DEFAULT,
  OPTIONS,
  // APIS,
};
