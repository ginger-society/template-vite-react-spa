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
  marker?: "triangle" | "square" | "circle" | "hexagon"; // Specify the marker types
}

function calculatePath(
  rect1: DOMRect | undefined,
  rect2: DOMRect | undefined,
  fromRow: number,
  toRow: number,
  rows1: number,
  rows2: number,
) {
  if (!rect1 || !rect2) return { d: "", midX: 0, midY: 0 };

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

  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  const d = `M ${x1} ${y1} H ${midX} V ${y2} H ${x2}`;

  return { d, midX, midY };
}

const Home = () => {
  const [blocks, setBlocks] = useState<{ [key: number]: Block }>({});
  const [connections, setConnections] = useState<Connection[]>([
    { block1Id: 1, fromRow: 0, block2Id: 2, toRow: 0, marker: "circle" },
    { block1Id: 2, fromRow: 1, block2Id: 3, toRow: 0, marker: "triangle" },
    { block1Id: 3, fromRow: 1, block2Id: 1, toRow: 2, marker: "square" },
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
        const { d } = calculatePath(
          rect1,
          rect2,
          fromRow,
          toRow,
          blocks[block1Id]?.rows || 4,
          blocks[block2Id]?.rows || 4,
        );
        return d;
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
              className="card block-card"
              ref={block.ref}
              style={{
                top: block.id * 200 + "px",
                left: block.id * 200 + "px",
              }}
            >
              {/* Header row */}
              <div className="handle block-header">Block {block.id} Header</div>
              {/* Render dynamic number of rows */}
              {[...Array(block.rows)].map((_, index) => (
                <div key={index} className="row-content">
                  Row {index + 1}
                </div>
              ))}
            </div>
          </Draggable>
        ))}
        {/* Render connections */}
        <svg ref={svgRef} className="svg-container">
          {paths.map((path, index) => (
            <g key={index}>
              <path d={path} stroke="black" fill="transparent" />
              {connections[index].marker && (
                <marker
                  id={`marker-${index}`}
                  markerWidth="12"
                  markerHeight="12"
                  refX="6"
                  refY="6"
                  orient="auto"
                  markerUnits="userSpaceOnUse"
                >
                  {(() => {
                    switch (connections[index].marker) {
                      case "triangle":
                        return (
                          <polygon points="0 0, 12 6, 0 12" fill="black" />
                        );
                      case "square":
                        return (
                          <rect
                            x="0"
                            y="0"
                            width="12"
                            height="12"
                            fill="black"
                          />
                        );
                      case "circle":
                        return <circle cx="6" cy="6" r="5" fill="black" />;
                      case "hexagon":
                        return (
                          <polygon
                            points="3 0, 9 0, 12 6, 9 12, 3 12, 0 6"
                            fill="black"
                          />
                        );
                      default:
                        return null;
                    }
                  })()}
                </marker>
              )}
              {connections[index].marker && (
                <path
                  d={path}
                  stroke="black"
                  fill="transparent"
                  markerEnd={`url(#marker-${index})`}
                />
              )}
            </g>
          ))}
        </svg>
      </div>
    </>
  );
};

export default Home;
