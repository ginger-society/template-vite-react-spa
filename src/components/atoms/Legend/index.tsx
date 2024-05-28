import React from "react";

import { LegendItemProps, LegendProps } from "@/shared/types";

const LegendItem: React.FC<LegendItemProps> = ({ item }) => {
  const getMarker = () => {
    switch (item.markerType) {
      case "triangle":
        return <polygon points="0,0 12,0 6,10" fill={item.color} />;
      case "rectangle":
        return <rect x="0" y="0" width="12" height="12" fill={item.color} />;
      case "circle":
        return <circle cx="6" cy="6" r="6" fill={item.color} />;
      case "hexagon":
        return (
          <polygon points="0,6 3,0 9,0 12,6 9,12 3,12" fill={item.color} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="legend-item">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 12 12"
        fill="none"
      >
        {getMarker()}
      </svg>
      <span>{item.type}</span>
    </div>
  );
};

const Legend: React.FC<LegendProps> = ({ items }) => {
  return (
    <div className="legend">
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            <LegendItem item={item} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Legend;