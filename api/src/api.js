const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const axios = require("axios");
const config = require("./config");

const app = express();

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

app.get("/api/metadata", (req, res) => {
  okay(res, { ...config });
});

app.get("/api/drawer", (req, res) => {
  const { id } = req.query;
  axios
    .get(config.APIS[id].api)
    .then(({ data }) => okay(res, data.data))
    .catch(error);
});

app.post("/api/drawer", (req, res) => {
  const { id, data } = req.body;
  axios
    .post(config.APIS[id].api, data)
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
