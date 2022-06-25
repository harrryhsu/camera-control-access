const Stream = require("./node-rtsp-stream");
const ws = require("ws");
const ffmpegPath = process.env.OS === "WINDOWS_NT" ? "./ffmpeg.exe" : "ffmpeg";
const config = require("./config");
var streams = {};
const sockets = [];

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
    for (let client of sockets) {
      if (client.readyState === 1) {
        if (client.reqUrl?.startsWith(path))
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

  wsServer.on("connection", (socket, request) => {
    if (!streams.some((s) => request.url.startsWith(s.path)))
      return socket.close();

    sockets.push(socket);
    socket.reqUrl = request.url;

    console.log(`New WebSocket Connection (` + sockets.length + " total)");

    streams.forEach((stream) => {
      if (request.url.startsWith(stream.path)) stream.start();
    });

    socket.on("close", (code, message) => {
      console.log(`Disconnected WebSocket (` + sockets.length + " total)");
      const index = sockets.indexOf(socket);
      sockets.splice(index, 1);
      streams.forEach((stream) => {
        if (!sockets.some((s) => s.reqUrl.startsWith(stream.path)))
          stream.stop();
      });
    });
  });

  const { APIS } = config;

  streams = APIS.map(
    (api, i) =>
      new Stream({
        name: api.name,
        streamUrl: api.rtsp,
        path: `/live/${i}`,
        ffmpegPath,
        wsServer,
        stdio: false,
      })
  );
};
