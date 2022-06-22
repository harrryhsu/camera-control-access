import React, { useEffect } from "react";
import JSMpeg from "lib/jsmpeg.min";

const WebRTCPlayer = React.memo(({ id, delay = 500, url, ...rest }) => {
  const canvasId = "video" + id;

  useEffect(() => {
    var player;
    var timer = setTimeout(() => {
      player = new JSMpeg.Player(url, {
        canvas: document.getElementById(canvasId),
        autoplay: true,
        audio: false,
        decodeFirstFrame: true,
        disableWebAssembly: false,
        disableGl: false,
      });
    }, delay);

    return () => clearTimeout(timer) || (player && player.destroy());
  }, []);

  return <canvas id={canvasId} style={{ width: "100%" }} {...rest} />;
});
WebRTCPlayer.displayName = "WebRTCPlayer";

export default WebRTCPlayer;
