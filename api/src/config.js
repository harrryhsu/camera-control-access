const DEFAULT_FIELDS = {
  name: {
    type: "text",
    label: "Name",
  },
};

const OPERATE_CLASS_ID_FIELD = {
  operate_class_id: {
    type: "multi-select",
    label: "車種偵測",
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
    label: "方向",
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
    name: "偵測線",
    type: "line_directed",
    unique: false,
    fields: {
      ...DEFAULT_FIELDS,
      ...OPERATE_CLASS_ID_FIELD,
      mode: {
        label: "偵測線模式",
        type: "select",
        options: {
          loose: "Loose",
          balanced: "Balanced",
          strict: "Strict",
        },
      },
      ...DIRECTION_FIELD,
    },
  },
  lane: {
    name: "車道",
    type: "pentagon",
    unique: false,
    fields: {
      ...DEFAULT_FIELDS,
      ...OPERATE_CLASS_ID_FIELD,
      ...DIRECTION_FIELD,
    },
  },
  vehicle_queue: {
    name: "排隊車輛",
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
    name: "斑馬線",
    type: "pentagon",
    unique: true,
    fields: {
      ...DEFAULT_FIELDS,
    },
  },
  traffic_light: {
    name: "紅綠燈",
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
    name: "雙白線",
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
  traffic_light: [{ x: 150, y: 30 }, 200, 200],
};

const SCREEN_SIZE = [
  [1280, 720],
  [1600, 900],
];

const TARGET_CONFIG = {
  max: 5,
  streamApi: "http://localhost:1002/api/stream",
  systemApi: "http://localhost:1002/api/system",
  addForm: {
    // ! Important
    name: {
      type: "text",
      label: "名稱",
    },
    rtsp: {
      type: "text",
      label: "RTSP串流",
      group: "",
    },
    api: {
      type: "text",
      label: "IP",
    },
    // ! Important
  },
  systemForm: {
    name: {
      type: "text",
      label: "名稱",
    },
    rtsp: {
      type: "text",
      label: "RTSP串流",
      group: "",
    },
    api: {
      type: "text",
      label: "IP",
    },
  },
};

const SETTING_FORM = {
  testGroup: {
    type: "group",
    label: "Test Group",
    fields: {
      name: {
        type: "text",
        label: "名稱",
      },
      rtsp: {
        type: "text",
        label: "RTSP串流",
        group: "",
      },
    },
  },
  name: {
    type: "text",
    label: "名稱",
  },
  rtsp: {
    type: "text",
    label: "RTSP串流",
    group: "",
  },
  api: {
    type: "text",
    label: "IP",
  },
  locationIndex: {
    type: "number",
    label: "點位編號",
  },
  cameraIndex: {
    type: "number",
    label: "攝影機編號",
  },
};

const TRANSLATION = {
  Add: "新增",
  Submit: "提交",
  Delete: "刪除",
  Update: "更新",
  Success: "成功",
  System: "系統",
};

const PAGE = [
  {
    type: "traffic",
    title: "Traffic",
    props: {
      options: OPTIONS,
      screenSize: SCREEN_SIZE,
      defaultValue: DEFAULT,
    },
  },
  {
    type: "setting",
    title: "Setting",
    props: {
      config: SETTING_FORM,
    },
  },
  {
    type: "record",
    title: "Record",
    props: {},
  },
];

const API_PATH = {
  drawer: "api/drawer",
  setting: "api/setting",
  record: "api/record",
  image: "api/image",
  system: "api/system",
};

module.exports = {
  PAGE,
  TARGET_CONFIG,
  TRANSLATION,
  API_PATH,
};
