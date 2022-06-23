import React, { useEffect, useContext } from "react";
import useState from "react-usestateref";

// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import { UtilContext } from "context/UtilContext";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import AddIcon from "@material-ui/icons/Add";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import { v4 as uuidv4 } from "uuid";
import { Fab, IconButton, Tooltip } from "@material-ui/core";
import WebRTCPlayer from "./WebRTCPlayer";
import { OPTIONS, DEFAULT, SCREEN_SIZE } from "./Config";
import {
  DetectionLine,
  DetectionLineWithDirection,
  DetectionRect,
  DetectionShape,
} from "./Shape";

import { Stage, Layer } from "react-konva/lib/ReactKonvaCore";
import AddShapeDialog from "./AddShapeDialog";

const fullscreen = (elem) => {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  }
};

var req;

const scale = (value, factor, toPixel) =>
  toPixel ? value * factor : value / factor;

export default function Drawer({ id }) {
  const { setError, setSuccess, api, setDialogSrc } = useContext(UtilContext);

  const [shapeData, setShapeData, shapeDataRef] = useState([]);
  const [videoSize, setVideoSize, videoSizeRef] = useState(0);

  const currentSize = SCREEN_SIZE[videoSize];

  const scaleShape = (shape, toPixel, newSize) => {
    newSize = newSize || SCREEN_SIZE[videoSizeRef.current];
    if (shape.type === "rect") {
      return {
        ...shape,
        data: [
          {
            x: scale(shape.data[0].x, newSize[0], toPixel),
            y: scale(shape.data[0].y, newSize[1], toPixel),
          },
          scale(shape.data[1], newSize[0], toPixel),
          scale(shape.data[2], newSize[1], toPixel),
        ],
      };
    } else {
      return {
        ...shape,
        data: shape.data.map((pt) => ({
          x: scale(pt.x, newSize[0], toPixel),
          y: scale(pt.y, newSize[1], toPixel),
        })),
      };
    }
  };

  const setDataAux = (i) => (entry) => {
    setShapeData([
      ...shapeData.slice(0, i),
      {
        ...shapeData[i],
        data: entry,
      },
      ...shapeData.slice(i + 1),
    ]);
  };

  const updateVideoSize = (size) => {
    const dataInPerc = shapeDataRef.current.map((shape) =>
      scaleShape(shape, false)
    );
    setVideoSize(size);
    setShapeData(
      dataInPerc.map((shape) => scaleShape(shape, true, SCREEN_SIZE[size]))
    );
  };

  useEffect(() => {
    const newSize = SCREEN_SIZE[videoSizeRef.current];
    const fullscreenElement =
      document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement;

    if (newSize[0] > 1280) {
      fullscreen(document.getElementById("traffic-container"));
    } else if (fullscreenElement !== null) {
      document.exitFullscreen();
    }
  }, [videoSize]);

  useEffect(() => {
    const fullscreenCallback = () => {
      const fullscreenElement =
        document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement;
      if (!fullscreenElement) updateVideoSize(0);
    };
    document.addEventListener("fullscreenchange", fullscreenCallback, false);

    return () =>
      document.removeEventListener("fullscreenchange", fullscreenCallback);
  }, []);

  useEffect(() => {
    req = api
      .GetDrawerConfig(id)
      .then((res) => {
        if (res.length) {
          const shapes = res.map((x) =>
            scaleShape(x, true, SCREEN_SIZE[videoSizeRef.current])
          );
          setShapeData(shapes);
        } else {
          setShapeData([
            ...Object.keys(OPTIONS)
              .filter((key) => OPTIONS[key].required)
              .map((key) => ({
                key: key,
                type: OPTIONS[key].type,
                data: DEFAULT[OPTIONS[key].type],
                addition: { name: key + "-default" },
                id: uuidv4(),
              })),
          ]);
        }
      })
      .catch(setError);
    return () => req && req.abort();
  }, []);

  return (
    <div key={id}>
      <GridContainer style={{ minHeight: "500px" }}>
        <GridItem xs={12} sm={12} md={12} id="traffic-container">
          <div style={{ position: "relative", margin: "50px auto 20px auto" }}>
            <WebRTCPlayer
              id="drawer"
              url={api.WebRTCUrl(id)}
              style={{
                width: `${currentSize[0]}px`,
                height: `${currentSize[1]}px`,
              }}
            />
            <Stage
              id="test"
              width={currentSize[0]}
              height={currentSize[1]}
              style={{
                position: "absolute",
                margin: "auto",
                top: 0,
              }}
            >
              <Layer>
                {shapeDataRef.current.map((entry, i) => {
                  var Shape;
                  switch (entry.type) {
                    case "line":
                      Shape = DetectionLine;
                      break;
                    case "rect":
                      Shape = DetectionRect;
                      break;
                    case "pentagon":
                      Shape = DetectionShape;
                      break;
                    case "line_directed":
                      Shape = DetectionLineWithDirection;
                      break;
                    default:
                      console.error("Unkown type: " + entry.type);
                  }

                  return (
                    <Shape
                      key={i}
                      pts={entry.data}
                      setPts={setDataAux(i)}
                      name={entry.addition.name}
                      addition={entry.addition}
                      onClick={() =>
                        setDialogSrc(
                          () => (
                            <AddShapeDialog
                              currentShapeKey={entry.key}
                              existingForm={entry.addition}
                              onUpdate={(data) =>
                                setShapeData([
                                  ...shapeDataRef.current.filter(
                                    (x) => x.id != entry.id
                                  ),
                                  { ...entry, addition: data },
                                ]) ||
                                setDialogSrc(
                                  null,
                                  document.getElementById("traffic-container")
                                )
                              }
                              onDelete={(data) =>
                                setShapeData([
                                  ...shapeDataRef.current.filter(
                                    (x) => x.id != entry.id
                                  ),
                                ]) ||
                                setDialogSrc(
                                  null,
                                  document.getElementById("traffic-container")
                                )
                              }
                            />
                          ),
                          document.getElementById("traffic-container")
                        )
                      }
                    />
                  );
                })}
              </Layer>
            </Stage>
            <Fab
              color="primary"
              style={{
                position: "absolute",
                bottom: "20px",
                right: "100px",
              }}
              onClick={() => {
                setDialogSrc(
                  () => (
                    <AddShapeDialog
                      onSubmit={(fieldData) => {
                        var shapeKey = fieldData.key;
                        setDialogSrc(
                          null,
                          document.getElementById("traffic-container")
                        );
                        setShapeData([
                          ...shapeData,
                          {
                            id: uuidv4(),
                            key: shapeKey,
                            type: OPTIONS[shapeKey].type,
                            data: DEFAULT[OPTIONS[shapeKey].type],
                            addition: fieldData,
                            shapeKey,
                          },
                        ]);
                      }}
                      shapeData={shapeDataRef.current}
                    />
                  ),
                  document.getElementById("traffic-container")
                );
              }}
            >
              <Tooltip title="Add">
                <AddIcon />
              </Tooltip>
            </Fab>
            <Fab
              color="primary"
              style={{
                position: "absolute",
                bottom: "20px",
                right: "20px",
              }}
              onClick={() => {
                var finalShape = shapeDataRef.current.map((x) =>
                  scaleShape(x, false, SCREEN_SIZE[videoSizeRef.current])
                );
                req = api
                  .SetDrawerConfig({ id, data: finalShape })
                  .then(() => setSuccess("Success"))
                  .catch(setError);
              }}
            >
              <Tooltip title="Submit">
                <ArrowUpwardIcon />
              </Tooltip>
            </Fab>
            <IconButton
              style={{
                position: "absolute",
                top: "5px",
                right: "5px",
              }}
              onClick={() => updateVideoSize(videoSizeRef.current == 1 ? 0 : 1)}
            >
              <FullscreenIcon />
            </IconButton>
          </div>
        </GridItem>
      </GridContainer>
    </div>
  );
}
