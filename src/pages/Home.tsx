import React, { useRef, useState, useEffect } from "react";
import Draggable from "react-draggable";

function calculatePath(rect1: DOMRect, rect2: DOMRect, svgRect: DOMRect) {
  const rowHeight1 = rect1.height / 4;
  const rowHeight2 = rect2.height / 4;

  const distanceRightLeft = Math.abs(rect1.right - rect2.left);
  const distanceLeftRight = Math.abs(rect1.left - rect2.right);

  let x1, y1, x2, y2;

  if (distanceRightLeft < distanceLeftRight) {
    x1 = rect1.right;
    y1 = rect1.top + rowHeight1 * 2.5 + window.pageYOffset;
    x2 = rect2.left;
    y2 = rect2.top + rowHeight2 / 2 + window.pageYOffset;
  } else {
    x1 = rect1.left;
    y1 = rect1.top + rowHeight1 * 2.5 + window.pageYOffset;
    x2 = rect2.right;
    y2 = rect2.top + rowHeight2 / 2 + window.pageYOffset;
  }

  const d = `M ${x1} ${y1} H ${(x1 + x2) / 2} V ${y2} H ${x2}`;

  const newWidth = Math.max(svgRect.width, Math.max(rect1.right, rect2.right));
  const newHeight = Math.max(
    svgRect.height,
    Math.max(rect1.bottom, rect2.bottom),
  );

  return { d, newWidth, newHeight };
}

const Home = () => {
  const [blockRefs, setBlockRefs] = useState<Array<HTMLDivElement | null>>([
    null,
    null,
  ]);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [path, setPath] = useState("");
  const [svgSize, setSvgSize] = useState({ width: "100%", height: "100%" });

  const handleDrag = () => {
    const [block1Ref, block2Ref] = blockRefs;
    if (
      block1Ref &&
      block1Ref !== null &&
      block2Ref &&
      block2Ref !== null &&
      svgRef.current
    ) {
      const rect1 = block1Ref.getBoundingClientRect();
      const rect2 = block2Ref.getBoundingClientRect();
      const svgRect = svgRef.current.getBoundingClientRect();
      const { d, newHeight, newWidth } = calculatePath(rect1, rect2, svgRect);

      setPath(d);
      setSvgSize({ width: `${newWidth}px`, height: `${newHeight}px` });
    }
  };

  useEffect(() => {
    setBlockRefs([
      blockRefs[0] || document.createElement("div"),
      blockRefs[1] || document.createElement("div"),
    ]);
  }, []);

  useEffect(() => {
    handleDrag();
  }, [blockRefs]); // Update path when blocks are dragged

  return (
    <>
      <h1>Home</h1>
      <div style={{ position: "relative", minHeight: "200vh" }}>
        {blockRefs.map((blockRef, index) => (
          <Draggable key={index} onDrag={handleDrag}>
            <div
              ref={(el) => (blockRefs[index] = el)}
              style={{
                border: "solid 1px",
                width: "fit-content",
                cursor: "pointer",
                padding: "20px",
                position: "absolute",
                top: index === 1 ? "200px" : undefined,
                left: index === 1 ? "200px" : undefined,
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
        ))}
        <svg
          ref={svgRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
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
