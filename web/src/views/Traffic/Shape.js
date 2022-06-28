import React from "react";

import { Rect, Text, Circle, Line } from "react-konva/lib/ReactKonvaCore";

import "konva/lib/shapes/Rect";
import "konva/lib/shapes/Text";
import "konva/lib/shapes/Circle";
import "konva/lib/shapes/Line";

const degsToRads = (deg) => (deg * Math.PI) / 180.0;
const radsToDegs = (rad) => (rad * 180) / Math.PI;

const rotate = (origin, point, angle) => {
  const angleInRadian = degsToRads(angle);
  const ox = origin.x,
    oy = origin.y;
  const px = point.x,
    py = point.y;

  const qx =
    ox +
    Math.cos(angleInRadian) * (px - ox) -
    Math.sin(angleInRadian) * (py - oy);
  const qy =
    oy +
    Math.sin(angleInRadian) * (px - ox) +
    Math.cos(angleInRadian) * (py - oy);
  return { x: qx, y: qy };
};

const angleBetween = (p1, p2, p3) =>
  radsToDegs(
    Math.atan2(p3.y - p1.y, p3.x - p1.x) - Math.atan2(p2.y - p1.y, p2.x - p1.x)
  );

const distance = (p1, p2) => {
  var a = p1.x - p2.x,
    b = p1.y - p2.y;
  return Math.sqrt(a * a + b * b);
};

const moveToDistance = (origin, target, distance) => {
  const vector = { x: target.x - origin.x, y: target.y - origin.y };
  const length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
  const normalized = { x: vector.x / length, y: vector.y / length };
  const result = {
    x: origin.x + normalized.x * distance,
    y: origin.y + normalized.y * distance,
  };
  return result;
};

const STROKE_WIDTH = 3;

export const DetectionLineWithDirection1 = (props) => {
  const { pts, setPts, name, onClick } = props;
  var [p1, p2, p3, p4] = pts;
  const center = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
  if (!p3) p3 = moveToDistance(center, rotate(center, p1, 90), 25);
  const length = distance(center, p3);
  p4 = moveToDistance(center, p3, -length);

  return (
    <>
      <Line
        x={p3.x}
        y={p3.y}
        points={[0, 0, p4.x - p3.x, p4.y - p3.y]}
        tension={0.5}
        closed
        stroke="yellow"
        strokeWidth={STROKE_WIDTH}
        onClick={onClick}
      />
      <Circle
        x={p3.x}
        y={p3.y}
        radius={5}
        fill="blue"
        onDragMove={(e) => {
          const target = { x: e.target.attrs.x, y: e.target.attrs.y };
          const length = distance(center, target);
          const p4 = moveToDistance(center, target, -length);
          setPts([
            ...pts.slice(0, 2),
            { x: target.x, y: target.y },
            { x: p4.x, y: p4.y },
          ]);
        }}
        draggable
      />
      <Circle x={p4.x} y={p4.y} radius={5} fill="red" />
      <Line
        x={p1.x}
        y={p1.y}
        points={[0, 0, p2.x - p1.x, p2.y - p1.y]}
        tension={0.5}
        closed
        stroke="yellow"
        strokeWidth={STROKE_WIDTH}
        onDragMove={(e) =>
          setPts([
            { x: e.target.attrs.x, y: e.target.attrs.y },
            {
              x: e.target.attrs.x + p2.x - p1.x,
              y: e.target.attrs.y + p2.y - p1.y,
            },
            {
              x: e.target.attrs.x + p3.x - p1.x,
              y: e.target.attrs.y + p3.y - p1.y,
            },
            {
              x: e.target.attrs.x + p4.x - p1.x,
              y: e.target.attrs.y + p4.y - p1.y,
            },
          ])
        }
        draggable
        onClick={onClick}
      />
      <Circle
        x={p1.x}
        y={p1.y}
        radius={5}
        fill="red"
        onDragMove={(e) => {
          const current = { x: e.target.attrs.x, y: e.target.attrs.y };
          const currentCenter = {
            x: (current.x + p2.x) / 2,
            y: (current.y + p2.y) / 2,
          };
          const angle = angleBetween(center, p1, p3);
          const tp = rotate(currentCenter, current, angle);
          const np3 = moveToDistance(currentCenter, tp, length);
          const np4 = moveToDistance(currentCenter, tp, -length);
          setPts([current, pts[1], np3, np4]);
        }}
        draggable
      />
      <Circle
        x={p2.x}
        y={p2.y}
        radius={5}
        fill="red"
        onDragMove={(e) => {
          const current = { x: e.target.attrs.x, y: e.target.attrs.y };
          const currentCenter = {
            x: (current.x + p1.x) / 2,
            y: (current.y + p1.y) / 2,
          };
          const angle = angleBetween(center, p1, p3);
          const tp = rotate(currentCenter, p1, angle);
          const np3 = moveToDistance(currentCenter, tp, length);
          const np4 = moveToDistance(currentCenter, tp, -length);
          setPts([pts[0], current, np3, np4]);
        }}
        draggable
      />
      <Text
        text={name}
        fontSize={15}
        x={center.x + 10}
        y={center.y + 10}
        fill="white"
        listening={false}
      />
    </>
  );
};

export const DetectionLineWithDirection = (props) => {
  const { pts, setPts, name, onClick } = props;
  var [p1, p2, p3, p4] = pts;
  const center = { x: (p3.x + p4.x) / 2, y: (p3.y + p4.y) / 2 };
  if (!p2) p2 = moveToDistance(center, rotate(center, p3, 90), 25);
  const length = distance(center, p2);
  p1 = moveToDistance(center, p2, -length);

  return (
    <>
      <Line
        x={p2.x}
        y={p2.y}
        points={[0, 0, p1.x - p2.x, p1.y - p2.y]}
        tension={0.5}
        closed
        stroke="yellow"
        strokeWidth={STROKE_WIDTH}
        onClick={onClick}
      />
      <Circle
        x={p2.x}
        y={p2.y}
        radius={5}
        fill="blue"
        onDragMove={(e) => {
          const target = { x: e.target.attrs.x, y: e.target.attrs.y };
          const length = distance(center, target);
          const p1 = moveToDistance(center, target, -length);
          setPts([
            ...pts.slice(0, 2),
            { x: target.x, y: target.y },
            { x: p1.x, y: p1.y },
          ]);
        }}
        draggable
      />
      <Circle x={p1.x} y={p1.y} radius={5} fill="red" />
      <Line
        x={p3.x}
        y={p3.y}
        points={[0, 0, p4.x - p3.x, p4.y - p3.y]}
        tension={0.5}
        closed
        stroke="yellow"
        strokeWidth={STROKE_WIDTH}
        onDragMove={(e) =>
          setPts([
            { x: e.target.attrs.x, y: e.target.attrs.y },
            {
              x: e.target.attrs.x + p4.x - p3.x,
              y: e.target.attrs.y + p4.y - p3.y,
            },
            {
              x: e.target.attrs.x + p2.x - p3.x,
              y: e.target.attrs.y + p2.y - p3.y,
            },
            {
              x: e.target.attrs.x + p1.x - p3.x,
              y: e.target.attrs.y + p1.y - p3.y,
            },
          ])
        }
        draggable
        onClick={onClick}
      />
      <Circle
        x={p3.x}
        y={p3.y}
        radius={5}
        fill="red"
        onDragMove={(e) => {
          const current = { x: e.target.attrs.x, y: e.target.attrs.y };
          const currentCenter = {
            x: (current.x + p4.x) / 2,
            y: (current.y + p4.y) / 2,
          };
          const angle = angleBetween(center, p3, p2);
          const tp = rotate(currentCenter, current, angle);
          const np2 = moveToDistance(currentCenter, tp, length);
          const np1 = moveToDistance(currentCenter, tp, -length);
          setPts([current, pts[1], np2, np1]);
        }}
        draggable
      />
      <Circle
        x={p4.x}
        y={p4.y}
        radius={5}
        fill="red"
        onDragMove={(e) => {
          const current = { x: e.target.attrs.x, y: e.target.attrs.y };
          const currentCenter = {
            x: (current.x + p3.x) / 2,
            y: (current.y + p3.y) / 2,
          };
          const angle = angleBetween(center, p3, p2);
          const tp = rotate(currentCenter, p3, angle);
          const np2 = moveToDistance(currentCenter, tp, length);
          const np1 = moveToDistance(currentCenter, tp, -length);
          setPts([pts[0], current, np2, np1]);
        }}
        draggable
      />
      <Text
        text={name}
        fontSize={15}
        x={center.x + 10}
        y={center.y + 10}
        fill="white"
        listening={false}
      />
    </>
  );
};

export const DetectionLine = (props) => {
  const { pts, setPts, name, onClick } = props;
  const [p1, p2] = pts;
  const center = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
  const diff = { x: p2.x - p1.x, y: p2.y - p1.y };

  return (
    <>
      <Line
        x={p1.x}
        y={p1.y}
        points={[0, 0, diff.x, diff.y]}
        tension={0.5}
        closed
        stroke="yellow"
        strokeWidth={STROKE_WIDTH}
        onDragMove={(e) =>
          setPts([
            { x: e.target.attrs.x, y: e.target.attrs.y },
            {
              x: e.target.attrs.x + p2.x - p1.x,
              y: e.target.attrs.y + p2.y - p1.y,
            },
          ])
        }
        draggable
        onClick={onClick}
      />
      <Circle
        x={p1.x}
        y={p1.y}
        radius={5}
        fill="red"
        onDragMove={(e) => {
          setPts([{ x: e.target.attrs.x, y: e.target.attrs.y }, p2]);
        }}
        draggable
      />
      <Circle
        x={p2.x}
        y={p2.y}
        radius={5}
        fill="red"
        onDragMove={(e) => {
          setPts([p1, { x: e.target.attrs.x, y: e.target.attrs.y }]);
        }}
        draggable
      />
      <Text
        text={name}
        fontSize={15}
        x={center.x + 5}
        y={center.y - 5}
        fill="white"
        listening={false}
      />
    </>
  );
};

export const DetectionShape = (props) => {
  const { pts, setPts, name, onClick } = props;

  if (!pts.length) return <div />;

  const points = pts.map((pt) => [pt.x - pts[0].x, pt.y - pts[0].y]).flat();

  var textPoint = { x: 0, y: 0 };
  pts.forEach((p) => {
    if (p.y >= textPoint.y) textPoint = p;
  });

  return (
    <>
      <Text
        text={name}
        fontSize={15}
        x={textPoint.x + 5}
        y={textPoint.y + 5}
        fill="white"
        listening={false}
      />
      <Line
        x={pts[0].x}
        y={pts[0].y}
        points={points}
        tension={0}
        closed
        stroke="yellow"
        strokeWidth={STROKE_WIDTH}
        onDragMove={(e) => {
          const newX = e.target.attrs.x;
          const newY = e.target.attrs.y;
          const newPoints = pts.map((pt) => ({
            x: newX + pt.x - pts[0].x,
            y: newY + pt.y - pts[0].y,
          }));

          setPts(newPoints);
        }}
        draggable
        onClick={onClick}
      />
      {pts.map((pt, i) => (
        <Circle
          key={i}
          x={pt.x}
          y={pt.y}
          radius={5}
          fill="red"
          onDragMove={(e) => {
            const newPts = [...pts];
            newPts[i] = { x: e.target.attrs.x, y: e.target.attrs.y };
            setPts(newPts);
          }}
          draggable
        />
      ))}
    </>
  );
};

export const DetectionRect = (props) => {
  const { pts, setPts, name, onClick } = props;
  const [point, width, height] = pts;
  const points = [
    point,
    { x: point.x + width, y: point.y },
    { x: point.x, y: point.y + height },
    { x: point.x + width, y: point.y + height },
  ];

  var textPoint = { x: 0, y: 0 };
  points.forEach((p) => {
    if (p.y >= textPoint.y && p.x >= textPoint.x) textPoint = p;
  });

  return (
    <>
      <Text
        text={name}
        fontSize={15}
        x={textPoint.x + 10}
        y={textPoint.y + 10}
        fill="white"
      />
      <Rect
        x={points[0].x}
        y={points[0].y}
        width={width}
        height={height}
        strokeWidth={STROKE_WIDTH}
        stroke="yellow"
        draggable
        onDragMove={(e) => {
          const np = { x: e.target.attrs.x, y: e.target.attrs.y };
          setPts([np, width, height]);
        }}
        onClick={onClick}
      />
      <Circle
        x={points[0].x}
        y={points[0].y}
        radius={5}
        fill="red"
        onDragMove={(e) => {
          const np = { x: e.target.attrs.x, y: e.target.attrs.y };
          const dy = point.y - np.y,
            dx = point.x - np.x;
          setPts([np, width + dx, height + dy]);
        }}
        draggable
      />
      <Circle
        x={points[1].x}
        y={points[1].y}
        radius={5}
        fill="red"
        onDragMove={(e) => {
          const np = { x: e.target.attrs.x, y: e.target.attrs.y };
          const dy = point.y - np.y,
            dx = point.x + width - np.x;
          setPts([{ x: point.x, y: point.y - dy }, width - dx, height + dy]);
        }}
        draggable
      />
      <Circle
        x={points[2].x}
        y={points[2].y}
        radius={5}
        fill="red"
        onDragMove={(e) => {
          const np = { x: e.target.attrs.x, y: e.target.attrs.y };
          const dy = point.y + height - np.y,
            dx = point.x - np.x;
          setPts([{ x: point.x - dx, y: point.y }, width + dx, height - dy]);
        }}
        draggable
      />
      <Circle
        x={points[3].x}
        y={points[3].y}
        radius={5}
        fill="red"
        onDragMove={(e) => {
          const np = { x: e.target.attrs.x, y: e.target.attrs.y };
          const dy = point.y + height - np.y,
            dx = point.x + width - np.x;
          setPts([point, width - dx, height - dy]);
        }}
        draggable
      />
    </>
  );
};
