import React, { useEffect } from "react";
import Player from "lib/Player";

const BroadwayPlayer = React.memo(({ id, url, width, height, ...rest }) => {
  const canvasId = "video" + id;

  useEffect(() => {
    var player = new Player({
      useWorker: true,
      workerFile: "/lib/Decoder.js",
      webgl: true,
      wsUrl: url,
    });
    player.canvas.style.width = "100%";
    document.getElementById(canvasId).appendChild(player.canvas);
    player.canvas.style.width = width + "px";
    player.canvas.style.height = height + "px";
    return () => (player && player.destroy()) || player.canvas.remove();
  }, []);

  return <div id={canvasId} {...rest} />;
});
BroadwayPlayer.displayName = "BroadwayPlayer";

export default BroadwayPlayer;
