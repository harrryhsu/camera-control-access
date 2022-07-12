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
  res.contentType("application/json").status(500).send({
    status: false,
    message: msg.toString(),
    code: "ER_UNKNOWN",
  });
};

app.use(bodyParser.json({ limit: "200mb" }));
app.use(bodyParser.urlencoded({ limit: "200mb", extended: true }));

var config = {};

app.get("/api/drawer", (req, res) => {
  const id = parseInt(req.query.id);
  okay(res, config[id]?.drawer ?? []);
});

app.post("/api/drawer", (req, res) => {
  const { data, stream, id } = req.body;
  config[id] = { ...(config[id] ?? {}), drawer: data };
  console.log(stream);
  okay(res);
});

app.get("/api/setting", (req, res) => {
  const id = parseInt(req.query.id);
  okay(res, config[id]?.setting ?? {});
});

app.post("/api/setting", (req, res) => {
  const { data, id } = req.body;
  config[id] = { ...(config[id] ?? {}), setting: data };
  okay(res);
});

app.get("/api/record", (req, res) => {
  okay(res, {
    records: [
      {
        id: 1,
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
  console.log(id, mid, type);
  res.status(200).sendFile(type === "l" ? liPath : siPath);
});

app.use((err, req, res, next) => {
  console.log(err);
  error(res)(err);
});

app.listen(1002, () => console.log(`Test NX server listening on ${1002}`));
