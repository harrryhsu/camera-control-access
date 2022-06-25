var Mpeg1Muxer, child_process, events, util;

child_process = require("child_process");

util = require("util");

events = require("events");

Mpeg1Muxer = function (options) {
  var key;
  this.url = options.url;
  this.ffmpegOptions = options.ffmpegOptions;
  this.exitCode = undefined;
  this.additionalFlags = [];
  if (this.ffmpegOptions) {
    for (key in this.ffmpegOptions) {
      this.additionalFlags.push(key);
      if (String(this.ffmpegOptions[key]) !== "") {
        this.additionalFlags.push(String(this.ffmpegOptions[key]));
      }
    }
  }
  this.spawnOptions = [
    "-re",
    "-rtsp_transport",
    "tcp",
    "-i",
    this.url,
    "-f",
    "mpegts",
    "-codec:v",
    "mpeg1video",
    "-r",
    "24",
    "-probesize",
    "32",
    "-analyzeduration",
    "32",
    "-muxpreload",
    "0",
    "-muxdelay",
    "0",
    "-b:v",
    "500k",
    // additional ffmpeg options go here
    ...this.additionalFlags,
    "-",
  ];
  this.stream = child_process.spawn(options.ffmpegPath, this.spawnOptions, {
    detached: false,
  });
  this.inputStreamStarted = true;
  this.stream.stdout.on("data", (data) => {
    return this.emit("mpeg1data", data);
  });
  this.stream.stderr.on("data", (data) => {
    return this.emit("ffmpegStderr", data);
  });
  this.stream.on("exit", (code, signal) => {
    // console.error("RTSP stream exited with error: " + code);
    return this.emit("exit");
  });
  return this;
};

util.inherits(Mpeg1Muxer, events.EventEmitter);

module.exports = Mpeg1Muxer;
