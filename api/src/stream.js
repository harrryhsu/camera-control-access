const child_process = require("child_process");
const Events = require("events");

class Stream extends Events {
  constructor(options) {
    super();
    this.options = options;
    this.path = options.path;
    this.ws = options.ws;
    this.start();
  }

  start() {
    const { url, ws, ffmpegPath = "ffmpeg", path, log = false } = this.options;
    this.stop();

    this.lastFrame = new Date();
    this.validator = setInterval(() => {
      var limit = new Date();
      limit.setSeconds(limit.getSeconds() - 10);
      if (this.lastFrame < limit) {
        console.log("Last frame is more than 10 secs ago, restarting...");
        this.start();
      }
    }, 10000);

    this.spawnOptions = [
      "-y",
      "-rtsp_transport",
      "tcp",
      "-i",
      url,
      "-r",
      "10",
      "-probesize",
      "32",
      "-analyzeduration",
      "0",
      "-coder",
      "0",
      "-bf",
      "0",
      "-b:v",
      "1M",
      "-vf",
      "scale=600:400",
      "-x264-params",
      "keyint=10:scenecut=0",
      "-profile:v",
      "baseline",
      "-preset",
      "ultrafast",
      "-tune",
      "zerolatency",
      "-c:v",
      "libx264",
      "-f",
      "h264",
      "-",
    ];
    this.stream = child_process.spawn(ffmpegPath, this.spawnOptions, {
      detached: false,
    });
    this.stream.stdout.on("data", (data) => {
      this.lastFrame = new Date();
      ws.broadcast(data, path);
    });
    this.stream.stderr.on("data", (data) => {
      if (log) console.log(data.toString());
      return this.emit("ffmpegData", data);
    });
    this.stream.on("exit", (code, signal) => {
      if (code) console.error("RTSP stream exited with error: " + code);
      return this.emit("exit");
    });
  }

  stop() {
    if (this.stream) this.stream.kill();
    if (this.validator) clearInterval(this.validator);
  }
}

module.exports = Stream;
