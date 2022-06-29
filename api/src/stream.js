const Stream = require("./node-rtsp-stream");
const ws = require("ws");
const ffmpegPath = process.env.OS === "WINDOWS_NT" ? "./ffmpeg.exe" : "ffmpeg";
const storage = require("./storage");
const sockets = [];
var streams = [];

const wsServer = new ws.Server({
  noServer: true,
  perMessageDeflate: false,
});

const rebuildStream = async () => {
  const apis = (await storage.getItem("STREAM")) ?? [];
  console.log(`Rebuild Streams: ${apis.length} streams`);
  streams.forEach((s) => s.stop());
  sockets.forEach((s) => s.close());
  wsServer.removeAllListeners("connection");

  streams = apis.map(
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

  wsServer.on("connection", (socket, request) => {
    if (!streams.some((s) => request.url.startsWith(s.path)))
      return socket.close();

    sockets.push(socket);
    socket.reqUrl = request.url;

    console.log(`New WebSocket Connection (` + sockets.length + " total)");

    streams
      .filter((s) => request.url.startsWith(s.path))
      .forEach((stream) => stream.start());

    socket.on("close", () => {
      console.log(`Disconnected WebSocket (` + sockets.length + " total)");
      const index = sockets.indexOf(socket);
      if (index !== -1) sockets.splice(index, 1);
      streams
        .filter(
          (stream) => !sockets.some((s) => s.reqUrl.startsWith(stream.path))
        )
        .forEach((stream) => stream.stop());
    });
  });
};

module.exports = (express) => {
  express.on("upgrade", (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, (websocket) => {
      wsServer.emit("connection", websocket, request);
    });
  });

  wsServer.broadcast = function (data, path, opts) {
    sockets
      .filter((s) => s.readyState === 1 && s.reqUrl?.startsWith(path))
      .forEach((x) => x.send(data, opts));
  };

  rebuildStream();
  storage.updateEvent.on("STREAM", rebuildStream);
};
