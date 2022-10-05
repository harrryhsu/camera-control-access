const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const axios = require("axios");
const config = require("./config");
const { v4: uuidv4 } = require("uuid");

const app = express();

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

var apis = [];
var apiMaps = {};

const refreshStream = async () => {
  const {
    data: { data },
  } = await axios.get(config.TARGET_CONFIG.streamApi);
  apis = data;
  apiMaps = data.reduce((acc, v) => ({ ...acc, [v.id]: v }), {});
  server.emit("stream-update", apis);
};

app.get("/api/metadata", async (req, res) => {
  refreshStream();
  okay(res, { ...config, STREAM: apis });
});

app.put("/api/stream", (req, res) => {
  const stream = req.body;
  axios
    .put(config.TARGET_CONFIG.streamApi, { ...stream, id: uuidv4() })
    .then(() => {
      okay(res);
      refreshStream().catch(console.log);
    })
    .catch(error);
});

app.post("/api/stream", (req, res) => {
  axios
    .post(config.TARGET_CONFIG.streamApi, req.body)
    .then(() => {
      okay(res);
      refreshStream().catch(console.log);
    })
    .catch(error);
});

app.delete("/api/stream", (req, res) => {
  const { id } = req.body;
  axios
    .delete(config.TARGET_CONFIG.api, { data: { id } })
    .then(() => {
      okay(res);
      refreshStream().catch(console.log);
    })
    .catch(error);
});

app.get("/api/system", (req, res) => {
  axios
    .get(config.TARGET_CONFIG.systemApi)
    .then(({ data }) => okay(res, data.data))
    .catch(error);
});

app.post("/api/system", (req, res) => {
  console.log(req.body);
  axios
    .post(config.TARGET_CONFIG.systemApi, req.body)
    .then(() => okay(res))
    .catch(error);
});

const proxyGet = (path) => async (req, res) => {
  const { id } = req.query;
  const stream = apiMaps[id];
  if (!stream) return error(res)("Stream id not found");
  axios
    .get(`http://${stream.api}/${path}?id=${id}`)
    .then(({ data }) => okay(res, data.data))
    .catch(error);
};

const proxyPost = (path) => async (req, res) => {
  const { id } = req.body;
  const stream = apiMaps[id];
  if (!stream) return error(res)("Stream id not found");
  axios
    .post(`http://${stream.api}/${path}`, req.body)
    .then(({ data }) => okay(res, data.data))
    .catch(error);
};

app.get("/api/drawer", proxyGet(API_PATH.drawer));
app.post("/api/drawer", proxyPost(API_PATH.drawer));

app.get("/api/setting", proxyGet(API_PATH.setting));
app.post("/api/setting", proxyPost(API_PATH.setting));

app.get("/api/system", proxyGet(API_PATH.system));
app.post("/api/system", proxyPost(API_PATH.system));

app.post("/api/record", proxyPost(API_PATH.record));

app.get("/api/image", async (req, res) => {
  const { id, mid, type } = req.query;
  const stream = apiMaps[id];
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

setTimeout(() => {
  refreshStream().catch(console.log);
}, 500);

const server = app.listen(1000, () =>
  console.log(`API/WS server listening on ${1000}`)
);

module.exports = server;
