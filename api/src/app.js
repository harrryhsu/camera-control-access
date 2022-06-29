require("dotenv").config();

require("./storage")
  .init()
  .then(() => {
    const express = require("./api");
    require("./stream")(express);
  });
