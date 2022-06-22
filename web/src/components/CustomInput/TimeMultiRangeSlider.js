import React, { useEffect, useImperativeHandle, forwardRef } from "react";
import useState from "react-usestateref";
import { makeStyles } from "@material-ui/core/styles";

import Slider from "@material-ui/core/Slider";
import {
  Stage,
  Layer,
  Rect,
  Text,
  Circle,
  Line,
} from "react-konva/lib/ReactKonvaCore";

import "konva/lib/shapes/Rect";
import "konva/lib/shapes/Text";
import "konva/lib/shapes/Circle";
import "konva/lib/shapes/Line";
import Select from "components/CustomInput/Select";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";

const useStyles = makeStyles({
  thumb: {
    display: "none",
  },
});

const MARKS = [
  {
    value: 0,
    label: "12",
  },
  ...[...Array(23)].map((_, i) => ({
    value: i + 1,
    label: `${i + 1}`,
  })),
  {
    value: 24,
    label: "12",
  },
];

const timelineToGroup = (timeline, options) => {
  const newData = Object.keys(options).reduce(
    (acc, key) => ({ ...acc, [key]: [] }),
    {}
  );

  var last = -1;
  var lastMode = -1;
  timeline.forEach((key, i) => {
    if (last === -1) {
      if (key !== -1) {
        last = i;
        lastMode = key;
      }
    } else {
      if (key === lastMode) {
        if (last !== -1 && i === timeline.length - 1) {
          newData[lastMode].push([last / 2, i / 2]);
        }
        return;
      } else if (key === -1) {
        newData[lastMode].push([last / 2, i / 2]);
        last = -1;
        lastMode = -1;
      } else {
        if (i === timeline.length - 1) {
          newData[lastMode].push([i / 2, (i + 1) / 2]);
        }
        newData[lastMode].push([last / 2, i / 2]);
        last = i;
        lastMode = key;
      }
    }
  });
  return newData;
};

const defaultData = () => [...Array(50)].map((_) => "default");

const TimeMultiRangeSlider = (props, ref) => {
  const { camMode, pallet = [], options = {} } = props;
  const classes = useStyles();
  const [datas, setData, dataRef] = useState(defaultData);
  const [editing, setEditing, editingRef] = useState(false);
  const [draw, setDraw, drawRef] = useState(null);

  const reset = () => setData(defaultData());

  useImperativeHandle(ref, () => ({
    value: () => dataRef.current,
    setValue: (v) => setData(v),
    reset,
  }));

  useEffect(() => {
    const onEditFinish = () => {
      if (editingRef.current) {
        var _draw = drawRef.current;
        var _datas = dataRef.current;
        for (let i = _draw[0] * 2; i <= _draw[1] * 2; i++)
          _datas[i] = camMode.current;
        setData(_datas);
        setDraw(null);
        setEditing(false);
      }
    };

    window.addEventListener("mouseup", onEditFinish);
    return () => window.removeEventListener("mouseup", onEditFinish);
  }, []);

  var colourSegment = timelineToGroup(datas, options);
  if (draw) {
    colourSegment[camMode.current].push(draw);
  }

  return (
    <GridContainer className="time-multi-range-slider">
      <GridItem xs={12} sm={12} md={12}>
        <div style={{ position: "relative", width: "100%", height: "28px" }}>
          <Slider
            classes={classes}
            value={-1}
            onChange={(e, v) => {
              if (e.type == "mousedown") {
                setDraw([v, v]);
                setEditing(true);
              } else if (e.type == "mousemove") {
                setDraw([draw[0], v]);
              }
            }}
            valueLabelDisplay="auto"
            marks={MARKS}
            min={0}
            max={24}
            step={0.5}
            style={{ zIndex: 1 }}
          />
          <Stage
            id="range-slider"
            width={720}
            height={10}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "100%",
              height: "28px",
            }}
          >
            <Layer>
              {Object.keys(colourSegment)
                .map((key, i) =>
                  colourSegment[key].map((data, j) => {
                    const color = pallet[i];
                    const left = Math.min(...data) * 30;
                    const right = Math.max(...data) * 30;
                    return (
                      <Rect
                        key={`${i}-${j}`}
                        x={left}
                        y={0}
                        width={right - left}
                        height={10}
                        fill={color}
                        opacity={0.9}
                        shadowEnabled={false}
                      />
                    );
                  })
                )
                .flat()}
            </Layer>
          </Stage>
        </div>
      </GridItem>
    </GridContainer>
  );
};

export default forwardRef(TimeMultiRangeSlider);
