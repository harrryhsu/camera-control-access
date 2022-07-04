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

const okay = (res, data) => {
  res.contentType("application/json").status(200).send({
    status: true,
    data: data,
  });
};

const error = (res) => (msg) => {
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

app.get("/api/drawer", async (req, res) => {
  const { id } = req.query;
  const streams = (await storage.getItem("STREAM")) ?? [];
  axios
    .get(streams[id].api)
    .then(({ data }) => okay(res, data.data))
    .catch(error);
});

app.post("/api/drawer", async (req, res) => {
  const { id, data } = req.body;
  const streams = (await storage.getItem("STREAM")) ?? [];
  axios
    .post(streams[id].api, { data: streams[id], shapes: data })
    .then(() => okay(res))
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
