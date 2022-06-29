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
  res.contentType("application/json").status(500).send({
    status: false,
    message: msg.toString(),
    code: "ER_UNKNOWN",
  });
};

app.use(bodyParser.json({ limit: "200mb" }));
app.use(bodyParser.urlencoded({ limit: "200mb", extended: true }));

var drawer = {};

app.get("/api/drawer/:id", (req, res) => {
  const id = req.params.id;
  okay(res, drawer[id] ?? []);
});

app.post("/api/drawer/:id", (req, res) => {
  const id = req.params.id;
  const { data, shapes } = req.body;
  drawer[id] = shapes;
  console.log(data);
  okay(res);
});

app.use((err, req, res, next) => {
  error(res)(err);
});

app.listen(1002, () => console.log(`Test NX server listening on ${1002}`));
