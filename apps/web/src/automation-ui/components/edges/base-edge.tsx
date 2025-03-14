import React from "react";
import { BaseEdge as _BaseEdge, getBezierPath, type EdgeProps } from "@xyflow/react";

// Function to enhance color (makes it darker)
const enhanceColor = (color: string, factor: number = 0.8) => {
  if (!color.startsWith("#")) return color; // Return if not a hex color
  let r = parseInt(color.slice(1, 3), 16);
  let g = parseInt(color.slice(3, 5), 16);
  let b = parseInt(color.slice(5, 7), 16);
  r = Math.max(0, Math.min(255, Math.floor(r * factor)));
  g = Math.max(0, Math.min(255, Math.floor(g * factor)));
  b = Math.max(0, Math.min(255, Math.floor(b * factor)));
  return `rgb(${r}, ${g}, ${b})`;
};

export default function BaseEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, markerEnd, selected }: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const strokeColor = selected ? enhanceColor(style.stroke || "#000", 2) : style.stroke || "#000";

  return (
    <_BaseEdge
      id={id}
      path={edgePath}
      markerEnd={markerEnd}
      style={{
        ...style,
        stroke: strokeColor,
        transition: "stroke 0.2s",
      }}
    />
  );
}
