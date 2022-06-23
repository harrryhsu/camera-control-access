const Stream = require("./node-rtsp-stream");
const ws = require("ws");
const ffmpegPath = process.env.OS === "WINDOWS_NT" ? "./ffmpeg.exe" : "ffmpeg";

const targets = Object.keys(process.env)
  .filter((x) => x.startsWith("NX_URL_"))
  .reduce(
    (acc, v) => ({
      ...acc,
      [parseInt(v.replace("NX_URL_", ""))]: {
        name: process.env[v.replace("NX_URL_", "NAME_")],
        api: process.env[v],
        rtsp: process.env[v.replace("NX_URL_", "RTSP_URL_")],
      },
    }),
    {}
  );

module.exports = (express) => {
  const wsServer = new ws.Server({
    noServer: true,
    perMessageDeflate: false,
  });

  express.on("upgrade", (request, socket, head) => {
    console.log("---------------------------------------------");
    wsServer.handleUpgrade(request, socket, head, (websocket) => {
      wsServer.emit("connection", websocket, request);
    });
  });

  wsServer.broadcast = function (data, path, opts) {
    var results;
    results = [];
    for (let client of this.clients) {
      if (client.readyState === 1) {
        if (client._socket.url?.startsWith(path))
          results.push(client.send(data, opts));
      } else {
        results.push(
          console.log(
            "Error: Client from remoteAddress " +
              client.remoteAddress +
              " not connected."
          )
        );
      }
    }
    return results;
  };

  Object.keys(targets).forEach((id) => {
    const stream = new Stream({
      name: targets[id].name,
      streamUrl: targets[id].rtsp,
      path: `/live/${id}`,
      ffmpegPath,
      wsServer,
    });
    stream.on("exit", () => process.exit(1));
  });
};
