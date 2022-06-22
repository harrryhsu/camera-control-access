const Stream = require("./node-rtsp-stream");
const ws = require("ws");
const http = require("http");
const ffmpegPath = process.env.OS === "WINDOWS_NT" ? "./ffmpeg.exe" : "ffmpeg";
const httpServer = http.createServer();
const wsServer = new ws.Server({
  server: httpServer,
  perMessageDeflate: false,
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

const { RTSP_URL } = process.env;

if (!RTSP_URL) throw "Missing url";
const stream = new Stream({
  name: "MAIN",
  streamUrl: RTSP_URL,
  path: "/live",
  ffmpegPath,
  wsServer,
});
stream.on("exit", () => process.exit(1));

httpServer.listen(1001, () => console.log(`WS server listening on ${1001}`));
