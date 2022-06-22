import React, {
  useEffect,
  forwardRef,
  useImperativeHandle,
  useContext,
  useRef,
} from "react";
import useState from "react-usestateref";

import { UtilContext } from "context/UtilContext";
import { useCookies } from "react-cookie";
import WsClient from "lib/ws_client";
import WebGLPlayer from "lib/webgl";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import { CircularProgress } from "@material-ui/core";
import WarningIcon from "@material-ui/icons/Warning";
import Loading from "components/Setting/Loading";

export const JSMpegPlayer = React.memo(
  forwardRef((props, ref) => {
    const { id, url, delay = 1000, onPlay = () => {}, ...rest } = props;
    var player = { current: null };

    useImperativeHandle(ref, () => ({
      play: () => player.current.play(),
      pause: () => player.current.pause(),
      paused: () => player.current.paused,
      player: () => player.current,
    }));

    useEffect(() => {
      var timer = setTimeout(() => {
        player.current = new JSMpeg.Player(url, {
          canvas: document.getElementById(id),
          autoplay: true,
          audio: false,
          decodeFirstFrame: true,
          disableWebAssembly: false,
          disableGl: false,
          onPlay: onPlay,
          videoBufferSize: (512 * 1024) / 5,
          chunkSize: (1024 * 1024) / 5,
        });
        window.player = player;
      }, delay);
      return () =>
        clearTimeout(timer) || (player.current && player.current.destroy());
    }, []);

    return (
      <canvas
        id={id}
        {...rest}
        style={{ width: "100%", height: "100%", ...rest.style }}
      />
    );
  })
);
JSMpegPlayer.displayName = "JSMpegPlayer";

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const WASMPlayer = React.memo(
  forwardRef((props, ref) => {
    const {
      id = "WASMPlayer",
      streamId,
      delay = 1000,
      onPlay = () => {},
      onError = console.log,
      width,
      height,
      ...rest
    } = props;
    const playerRef = useRef();
    const { api, setError, metadata } = useContext(UtilContext);
    const loadingRef = useRef();
    const reqRef = useRef();
    const canvasRef = useRef();
    const recordingRef = useRef();

    const screenshot = async () => {
      var data = { length: 0 };
      while (data.length <= 23642) {
        // Hacky way to avoid screenshot PFrame
        data = canvasRef.current.toDataURL("image/jpg");
        await sleep(50);
      }
      const link = document.createElement("a");
      link.download = `screenshot-${new Date().getTime()}.jpg`;
      link.href = data;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    const startRecording = () => {
      var videoStream = canvasRef.current.captureStream(30);
      var mediaRecorder = new MediaRecorder(videoStream);
      var cancel = false;

      var chunks = [];
      mediaRecorder.ondataavailable = function (e) {
        chunks.push(e.data);
      };

      mediaRecorder.onstop = function (e) {
        if (cancel) return;
        var blob = new Blob(chunks, { type: "video/mp4" });
        chunks = [];
        var videoURL = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `screenshot-${new Date().getTime()}.mp4`;
        link.href = videoURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };

      mediaRecorder.ondataavailable = function (e) {
        chunks.push(e.data);
      };

      mediaRecorder.cancel = function () {
        cancel = true;
        mediaRecorder.stop();
        recordingRef.current = null;
      };

      mediaRecorder.start();

      recordingRef.current = mediaRecorder;
    };

    const stopRecording = () => {
      recordingRef.current.stop();
      recordingRef.current = null;
    };

    const buildPlayer = () => {
      reqRef.current?.abort();
      playerRef.current?.close();

      var port = metadata.ports.ws;
      reqRef.current = api
        .GetStreamConfig(port, streamId)
        .then((data) => {
          if (data && data.streams) {
            var stream = data.streams.filter((x) => x.id == streamId);
            if (stream.length > 0) {
              stream = stream[0];

              playerRef.current = new WsClient({
                onfirstframe: () => loadingRef.current.loaded() || onPlay(),
              });

              const canvas = document.getElementById(id);
              if (stream.video) {
                canvas.width = stream.video.codecpar.width;
                canvas.height = stream.video.codecpar.height;
              }

              if (!reqRef.current.request.abort) {
                const player = new WebGLPlayer(canvas);
                playerRef.current.open({
                  url: `ws://${api.Domain}:${port}/stream/${stream.id}`,
                  stream: stream,
                  player: player,
                });
              }
            } else {
              setError("Stream not found");
              loadingRef.current.error();
            }
          } else {
            setError("No stream data");
            loadingRef.current.error();
          }
        })
        .catch(setError);
    };

    useImperativeHandle(ref, () => ({
      play: () => playerRef.current.unpause(),
      pause: () => playerRef.current.pause() || recordingRef.current?.cancel(),
      paused: () => playerRef.current.paused,
      stop: () => playerRef.current.close(),
      start: () => buildPlayer(),
      screenshot,
      startRecording,
      stopRecording,
      recording: () => recordingRef.current != null,
    }));

    useEffect(() => {
      buildPlayer();

      return () =>
        (reqRef.current && reqRef.current.abort()) ||
        (playerRef.current && playerRef.current.close()) ||
        console.log("abort", reqRef.current);
    }, []);

    return (
      <div
        style={{
          width: width,
          height: height,
          borderRadius: "6px",
          ...rest.style,
          minWidth: "500px",
        }}
      >
        <Loading ref={loadingRef} status={0}>
          <canvas
            ref={canvasRef}
            id={id}
            style={{
              width: width,
              height: height,
              borderRadius: "6px",
              ...rest.style,
            }}
          />
        </Loading>
      </div>
    );
  })
);
WASMPlayer.displayName = "WASMPlayer";
