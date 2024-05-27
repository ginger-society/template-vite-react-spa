import React, { useRef, useState, useEffect } from "react";
import Draggable from "react-draggable";

function calculatePath(rect1: DOMRect, rect2: DOMRect, svgRect: DOMRect) {
  const rowHeight1 = rect1.height / 4;
  const rowHeight2 = rect2.height / 4;

  const distanceRightLeft = Math.abs(rect1.right - rect2.left);
  const distanceLeftRight = Math.abs(rect1.left - rect2.right);

  let x1, y1, x2, y2;

  if (distanceRightLeft < distanceLeftRight) {
    // Start from the right edge of Block 1 to the left edge of Block 2
    x1 = rect1.right;
    y1 = rect1.top + rowHeight1 * 2.5 + window.pageYOffset; // Account for scroll
    x2 = rect2.left;
    y2 = rect2.top + rowHeight2 / 2 + window.pageYOffset; // Account for scroll
  } else {
    // Start from the left edge of Block 1 to the right edge of Block 2
    x1 = rect1.left;
    y1 = rect1.top + rowHeight1 * 2.5 + window.pageYOffset; // Account for scroll
    x2 = rect2.right;
    y2 = rect2.top + rowHeight2 / 2 + window.pageYOffset; // Account for scroll
  }

  // Calculate path with 90-degree lines
  const d = `M ${x1} ${y1} H ${(x1 + x2) / 2} V ${y2} H ${x2}`;

  // Update SVG size
  const newWidth = Math.max(svgRect.width, Math.max(rect1.right, rect2.right));
  const newHeight = Math.max(
    svgRect.height,
    Math.max(rect1.bottom, rect2.bottom),
  );

  return { d, newWidth, newHeight };
}

const Home = () => {
  const block1Ref = useRef<HTMLDivElement>(null);
  const block2Ref = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [path, setPath] = useState("");
  const [svgSize, setSvgSize] = useState({ width: "100%", height: "100%" });

  const handleDrag = () => {
    if (block1Ref.current && block2Ref.current && svgRef.current) {
      const rect1 = block1Ref.current.getBoundingClientRect();
      const rect2 = block2Ref.current.getBoundingClientRect();
      const svgRect = svgRef.current.getBoundingClientRect();
      const { d, newHeight, newWidth } = calculatePath(rect1, rect2, svgRect);

      setPath(d);
      setSvgSize({ width: `${newWidth}px`, height: `${newHeight}px` });
    }
  };

  useEffect(() => {
    handleDrag();
    window.addEventListener("scroll", handleDrag);

    return () => {
      window.removeEventListener("scroll", handleDrag);
    };
  }, []);

  return (
    <>
      <h1>Home</h1>
      <div style={{ position: "relative", minHeight: "200vh" }}>
        <Draggable onDrag={handleDrag}>
          <div
            ref={block1Ref}
            style={{
              border: "solid 1px",
              width: "fit-content",
              cursor: "pointer",
              padding: "20px",
              position: "absolute",
              background: "white",
              zIndex: 1,
            }}
          >
            <div>Row 1</div>
            <div>Row 2</div>
            <div>Row 3</div>
            <div>Row 4</div>
          </div>
        </Draggable>
        <Draggable onDrag={handleDrag}>
          <div
            ref={block2Ref}
            style={{
              border: "solid 1px",
              width: "fit-content",
              cursor: "pointer",
              padding: "20px",
              position: "absolute",
              top: "200px",
              left: "200px",
              background: "white",
              zIndex: 1,
            }}
          >
            <div>Row 1</div>
            <div>Row 2</div>
            <div>Row 3</div>
            <div>Row 4</div>
          </div>
        </Draggable>
        <svg
          ref={svgRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: "none",
          }}
          width={svgSize.width}
          height={svgSize.height}
        >
          <path d={path} stroke="black" fill="transparent" />
        </svg>
      </div>
    </>
  );
};

export default Home;
