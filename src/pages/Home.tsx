import React, { useRef, useState, useEffect } from "react";
import Draggable from "react-draggable";

interface Block {
  id: number;
  ref: React.RefObject<HTMLDivElement>;
}

interface Connection {
  block1Id: number;
  fromRow: number;
  block2Id: number;
  toRow: number;
}

function calculatePath(
  rect1: DOMRect,
  rect2: DOMRect,
  fromRow: number,
  toRow: number,
) {
  const rowHeight1 = rect1.height / 4; // Assuming each block has 4 rows
  const rowHeight2 = rect2.height / 4;

  const distanceRightLeft = Math.abs(rect1.right - rect2.left);
  const distanceLeftRight = Math.abs(rect1.left - rect2.right);

  let x1, y1, x2, y2;

  if (distanceRightLeft < distanceLeftRight) {
    x1 = rect1.right;
    y1 = rect1.top + rowHeight1 * fromRow + window.scrollY;
    x2 = rect2.left;
    y2 = rect2.top + rowHeight2 * toRow + window.scrollY;
  } else {
    x1 = rect1.left;
    y1 = rect1.top + rowHeight1 * fromRow + window.scrollY;
    x2 = rect2.right;
    y2 = rect2.top + rowHeight2 * toRow + window.scrollY;
  }

  const d = `M ${x1} ${y1} H ${(x1 + x2) / 2} V ${y2} H ${x2}`;

  return d;
}

const Home = () => {
  const blocks: Block[] = [
    { id: 1, ref: useRef<HTMLDivElement>(null) },
    { id: 2, ref: useRef<HTMLDivElement>(null) },
    { id: 3, ref: useRef<HTMLDivElement>(null) },
    // Add more blocks as needed
  ];
  const [connections, setConnections] = useState<Connection[]>([
    { block1Id: 1, fromRow: 1, block2Id: 2, toRow: 0 },
    // Add more connections as needed
  ]);
  const svgRef = useRef<SVGSVGElement>(null);
  const [paths, setPaths] = useState<string[]>([]);

  const handleDrag = () => {
    const newPaths = connections.map(
      ({ block1Id, fromRow, block2Id, toRow }) => {
        const rect1 = blocks
          .find((block) => block.id === block1Id)
          ?.ref.current?.getBoundingClientRect();
        const rect2 = blocks
          .find((block) => block.id === block2Id)
          ?.ref.current?.getBoundingClientRect();
        if (rect1 && rect2) {
          return calculatePath(rect1, rect2, fromRow, toRow);
        }
        return "";
      },
    );

    setPaths(newPaths);
  };

  useEffect(() => {
    handleDrag();
  }, [connections]);

  return (
    <>
      <h1>Home</h1>
      <div style={{ position: "relative", minHeight: "200vh" }}>
        {blocks.map((block) => (
          <Draggable key={block.id} onDrag={handleDrag}>
            <div
              ref={block.ref}
              style={{
                border: "solid 1px",
                width: "fit-content",
                cursor: "pointer",
                padding: "20px",
                position: "absolute",
                top: block.id * 200 + "px",
                left: block.id * 200 + "px",
                background: "white",
                zIndex: 1,
              }}
            >
              {/* Four rows */}
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
        >
          {paths.map((path, index) => (
            <path key={index} d={path} stroke="black" fill="transparent" />
          ))}
        </svg>
      </div>
    </>
  );
};

export default Home;
