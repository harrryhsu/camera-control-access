const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const okay = (res, data) => {
  res.contentType("application/json").status(200).send({
    status: true,
    data: data,
  });
};

const error = (res) => (msg) => {
  console.log(msg);
  res.contentType("application/json").status(500).send({
    status: false,
    message: msg.toString(),
    code: "ER_UNKNOWN",
  });
};

app.use(bodyParser.json({ limit: "200mb" }));
app.use(bodyParser.urlencoded({ limit: "200mb", extended: true }));

var config = {};

var apis = [
  {
    id: "1",
    name: "Test 1",
    rtsp: "rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mp4",
    api: "localhost:1002",
  },
  {
    id: "2",
    name: "Test 2",
    rtsp: "rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mp4",
    api: "localhost:1002",
  },
  {
    id: "3",
    name: "Test 3",
    rtsp: "rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mp4",
    api: "localhost:1002",
  },
];

app.get("/api/stream", (req, res) => {
  okay(res, apis);
});

app.post("/api/stream", (req, res) => {
  const { id, stream } = req.body;
  apis
    .filter((x) => x.id == id)
    .forEach((x) => {
      x.name = stream.name;
      x.rtsp = stream.rtsp;
      x.api = stream.api;
    });
  okay(res);
});

app.put("/api/stream", (req, res) => {
  apis.push(req.body);
  okay(res, apis);
});

app.delete("/api/stream", (req, res) => {
  const { id } = req.body;
  apis = apis.filter((x) => x.id != id);
  okay(res, apis);
});

app.get("/api/drawer", (req, res) => {
  const { id } = req.query;
  okay(res, config[id]?.drawer ?? []);
});

app.post("/api/drawer", (req, res) => {
  const { data, id } = req.body;
  config[id] = { ...(config[id] ?? {}), drawer: data };
  okay(res);
});

app.get("/api/setting", (req, res) => {
  const { id } = req.query;
  okay(res, config[id]?.setting ?? {});
});

app.post("/api/setting", (req, res) => {
  const { data, id } = req.body;
  config[id] = { ...(config[id] ?? {}), setting: data };
  okay(res);
});

var systemData = {};

app.get("/api/system", (req, res) => {
  okay(res, systemData);
});

app.post("/api/system", (req, res) => {
  systemData = req.body;
  console.log(systemData);
  okay(res);
});

app.post("/api/record", (req, res) => {
  const { mid, timeStart, timeEnd, rego } = req.body;
  console.log(mid, timeStart, timeEnd, rego);
  okay(res, {
    records: [
      {
        id: 1,
        rego: "ABC-123",
        created: new Date(),
      },
      {
        id: 2,
        rego: "ABC-123",
        created: new Date(),
      },
    ],
    total: 1,
  });
});

const siPath = path.join(process.cwd(), "test/small.jpg");
const liPath = path.join(process.cwd(), "test/large.jpg");

app.get("/api/image", (req, res) => {
  const { id, mid, type } = req.query;
  res.status(200).sendFile(type === "l" ? liPath : siPath);
});

app.use((err, req, res, next) => {
  error(res)(err);
});

app.listen(1002, () => console.log(`Test NX server listening on ${1002}`));
