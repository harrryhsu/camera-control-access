const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const axios = require("axios");
const config = require("./config");
const storage = require("./storage");

const app = express();

if (
  !config.TARGET_CONFIG.name ||
  !config.TARGET_CONFIG.rtsp ||
  !config.TARGET_CONFIG.api
)
  throw "Missing config (name|rtsp|api)";

const { API_PATH } = config;

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
app.use(express.static("public"));

app.use(function (req, res, next) {
  const origin = req.header("origin");
  if (origin) {
    res.header("Access-Control-Allow-Origin", origin);
  } else {
    res.header("Access-Control-Allow-Origin", "*");
  }
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, X-Auth"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, OPTION, DELETE");
  next();
});

app.get("/api/metadata", async (req, res) => {
  const stream = (await storage.getItem("STREAM")) ?? [];
  okay(res, { ...config, STREAM: stream });
});

app.put("/api/stream", async (req, res) => {
  const stream = req.body;
  const existing = (await storage.getItem("STREAM")) ?? [];
  await storage.setItem("STREAM", [...existing, stream]);
  okay(res);
});

app.post("/api/stream", async (req, res) => {
  const { stream, id } = req.body;
  const existing = (await storage.getItem("STREAM")) ?? [];
  existing[id] = stream;
  await storage.setItem("STREAM", existing);
  okay(res);
});

app.delete("/api/stream", async (req, res) => {
  const { id } = req.body;
  const existing = (await storage.getItem("STREAM")) ?? [];
  existing.splice(id, 1);
  await storage.setItem("STREAM", existing);
  okay(res);
});

const proxyGet = (path) => async (req, res) => {
  const { id } = req.query;
  const streams = await storage.getItem("STREAM");
  const stream = streams[id];
  if (!stream) return error(res)("Stream id not found");
  axios
    .get(`http://${stream.api}/${path}?id=${id}`)
    .then(({ data }) => okay(res, data.data))
    .catch(error);
};

const proxyPost = (path) => async (req, res) => {
  const { id, data } = req.body;
  const streams = await storage.getItem("STREAM");
  const stream = streams[id];
  if (!stream) return error(res)("Stream id not found");
  axios
    .post(`http://${stream.api}/${path}`, {
      id,
      data,
      stream,
    })
    .then(() => okay(res))
    .catch(error);
};

app.get("/api/drawer", proxyGet(API_PATH.drawer));
app.post("/api/drawer", proxyPost(API_PATH.drawer));

app.get("/api/setting", proxyGet(API_PATH.setting));
app.post("/api/setting", proxyPost(API_PATH.setting));

app.get("/api/record", proxyGet(API_PATH.record));
app.post("/api/record", proxyPost(API_PATH.record));

app.get("/api/image", async (req, res) => {
  const { id, mid, type } = req.query;
  const streams = await storage.getItem("STREAM");
  const stream = streams[id];
  if (!stream) return error(res)("Stream id not found");
  axios
    .get(
      `http://${stream.api}/${API_PATH.image}?id=${id}&mid=${mid}&type=${type}`,
      { responseType: "stream" }
    )
    .then((response) => {
      res.status(response.status).contentType("image/jpg");
      response.data.pipe(res);
    })
    .catch(error);
});

const indexFile = path.join(process.cwd(), "./public/index.html");

// Fallback for react router
app.get("*", function (req, res) {
  res.sendFile(indexFile);
});

app.use((err, req, res, next) => {
  error(res)(err);
});

module.exports = app.listen(1000, () =>
  console.log(`API/WS server listening on ${1000}`)
);
