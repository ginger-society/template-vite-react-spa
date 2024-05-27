import React, { useState, useEffect, useCallback } from "react";
import Draggable from "react-draggable";

interface Block {
  id: number;
  ref: React.RefObject<HTMLDivElement>;
  rows: number; // Number of rows for each block
}

interface Connection {
  block1Id: number;
  fromRow: number;
  block2Id: number;
  toRow: number;
}

function calculatePath(
  rect1: DOMRect | undefined,
  rect2: DOMRect | undefined,
  fromRow: number,
  toRow: number,
  rows1: number,
  rows2: number,
) {
  if (!rect1 || !rect2) return "";

  const headerRowHeight = 80; // Assuming header row height is 40px
  const rowHeight1 = (rect1.height - headerRowHeight) / rows1;
  const rowHeight2 = (rect2.height - headerRowHeight) / rows2;

  const distanceRightLeft = Math.abs(rect1.right - rect2.left);
  const distanceLeftRight = Math.abs(rect1.left - rect2.right);

  let x1, y1, x2, y2;

  if (distanceRightLeft < distanceLeftRight) {
    x1 = rect1.right;
    y1 = rect1.top + headerRowHeight + rowHeight1 * fromRow + window.scrollY;
    x2 = rect2.left;
    y2 = rect2.top + headerRowHeight + rowHeight2 * toRow + window.scrollY;
  } else {
    x1 = rect1.left;
    y1 = rect1.top + headerRowHeight + rowHeight1 * fromRow + window.scrollY;
    x2 = rect2.right;
    y2 = rect2.top + headerRowHeight + rowHeight2 * toRow + window.scrollY;
  }

  const d = `M ${x1} ${y1} H ${(x1 + x2) / 2} V ${y2} H ${x2}`;

  return d;
}

const Home = () => {
  const [blocks, setBlocks] = useState<{ [key: number]: Block }>({});
  const [connections, setConnections] = useState<Connection[]>([
    { block1Id: 1, fromRow: 0, block2Id: 2, toRow: 0 },
    { block1Id: 2, fromRow: 1, block2Id: 3, toRow: 0 },
    { block1Id: 3, fromRow: 1, block2Id: 1, toRow: 2 },
    // Add more connections as needed
  ]);
  const svgRef = React.createRef<SVGSVGElement>();
  const [paths, setPaths] = useState<string[]>([]);

  useEffect(() => {
    setBlocks({
      1: { id: 1, ref: React.createRef(), rows: 4 },
      2: { id: 2, ref: React.createRef(), rows: 3 },
      3: { id: 3, ref: React.createRef(), rows: 2 },
      // Add more blocks as needed
    });
  }, []);

  const handleDrag = useCallback(() => {
    const newPaths = connections.map(
      ({ block1Id, fromRow, block2Id, toRow }) => {
        const rect1 = blocks[block1Id]?.ref.current?.getBoundingClientRect();
        const rect2 = blocks[block2Id]?.ref.current?.getBoundingClientRect();
        return calculatePath(
          rect1,
          rect2,
          fromRow,
          toRow,
          blocks[block1Id]?.rows || 4,
          blocks[block2Id]?.rows || 4,
        );
      },
    );

    setPaths(newPaths);
  }, [blocks, connections]);

  useEffect(() => {
    handleDrag();
  }, [connections, handleDrag]);

  return (
    <>
      <div
        style={{
          position: "relative",
          minHeight: "200vh",
          backgroundSize: "40px 40px",
          backgroundImage:
            "radial-gradient(circle, #000000 1px, rgba(0, 0, 0, 0) 1px)",
        }}
      >
        {Object.values(blocks).map((block) => (
          <Draggable key={block.id} onDrag={handleDrag} handle=".handle">
            <div
              className="card"
              ref={block.ref}
              style={{
                // border: "solid 1px",
                width: "fit-content",
                cursor: "pointer",
                position: "absolute",
                top: block.id * 200 + "px",
                left: block.id * 200 + "px",
                background: "white",
                borderRadius: "15px",
                overflow: "hidden",
                zIndex: 1,
              }}
            >
              {/* Header row */}
              <div
                className="handle"
                style={{
                  backgroundColor: "#131314",
                  color: "white",
                  borderTop: "1px solid black",
                  borderBottom: "1px solid black",
                  padding: "10px 20px 10px 20px",
                  width: "200px",
                  fontWeight: "bold",
                }}
              >
                Block {block.id} Header
              </div>
              {/* Render dynamic number of rows */}
              {[...Array(block.rows)].map((_, index) => (
                <div
                  key={index}
                  style={{
                    borderTop: "1px solid #131314",
                    padding: "10px 20px 10px 20px",
                    width: "200px",
                  }}
                >
                  Row {index + 1}
                </div>
              ))}
            </div>
          </Draggable>
        ))}
        {/* Render connections */}
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
