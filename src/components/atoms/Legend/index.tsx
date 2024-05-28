import React from "react";
import {
  hexagonIcon,
  triangleIcon,
  rectangleIcon,
  circleIcon,
} from "@/shared/svgIcons";

const Legend = () => {
  return (
    <div className="legend">
      <ul>
        <li>
          {triangleIcon}
          <span>Triangle</span>
        </li>
        <li>
          {rectangleIcon}
          <span>Rectangle</span>
        </li>
        <li>
          {circleIcon}
          <span>Circle</span>
        </li>
        <li>
          {hexagonIcon}
          <span>Hexagon</span>
        </li>
      </ul>
    </div>
  );
};

export default Legend;
