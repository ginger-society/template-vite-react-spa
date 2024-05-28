import SliderDialog from "@/components/organisms/Aside";
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
  label?: string; // Add a label to the connection
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

  const headerRowHeight = 80; // Assuming header row height is 80px
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
  const [isSliderOpen, setIsSliderOpen] = useState(false);

  const openSlider = () => {
    setIsSliderOpen(true);
  };

  const closeSlider = () => {
    setIsSliderOpen(false);
  };

  const [blocks, setBlocks] = useState<{ [key: number]: Block }>({});
  const [connections, setConnections] = useState<Connection[]>([
    {
      block1Id: 1,
      fromRow: 0,
      block2Id: 2,
      toRow: 0,
      marker: "circle",
      label: "User (tenant_id) -> Tenant  ",
    },
    {
      block1Id: 2,
      fromRow: 1,
      block2Id: 3,
      toRow: 0,
      marker: "triangle",
      label: "B to C",
    },
    {
      block1Id: 3,
      fromRow: 1,
      block2Id: 1,
      toRow: 2,
      marker: "square",
      label: "C to A",
    },
    // Add more connections as needed
  ]);
  const svgRef = React.createRef<SVGSVGElement>();
  const [paths, setPaths] = useState<
    { path: string; midX: number; midY: number }[]
  >([]);

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
        const { d, midX, midY } = calculatePath(
          rect1,
          rect2,
          fromRow,
          toRow,
          blocks[block1Id]?.rows || 4,
          blocks[block2Id]?.rows || 4,
        );
        return { path: d, midX, midY };
      },
    );

    setPaths(newPaths);
  }, [blocks, connections]);

  useEffect(() => {
    handleDrag();
  }, [connections, handleDrag]);

  return (
    <>
      <header className="header">
        <h1>Ginger Society</h1>
        {/* Add more header content as needed */}
      </header>
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
                <div onClick={openSlider} key={index} className="row-content">
                  Row {index + 1}
                </div>
              ))}
            </div>
          </Draggable>
        ))}
        {/* Render connections */}
        <svg ref={svgRef} className="svg-container">
          {paths.map(({ path, midX, midY }, index) => (
            <g key={index}>
              <path d={path} stroke="black" fill="transparent" />
              {connections[index].marker && (
                <g transform={`translate(${midX}, ${midY})`}>
                  {(() => {
                    switch (connections[index].marker) {
                      case "triangle":
                        return <polygon points="-6,-6 6,0 -6,6" fill="black" />;
                      case "square":
                        return (
                          <rect
                            x="-6"
                            y="-6"
                            width="12"
                            height="12"
                            fill="black"
                          />
                        );
                      case "circle":
                        return <circle cx="0" cy="0" r="6" fill="black" />;
                      case "hexagon":
                        return (
                          <polygon
                            points="-6,-3 0,-6 6,-3 6,3 0,6 -6,3"
                            fill="black"
                          />
                        );
                      default:
                        return null;
                    }
                  })()}
                  {connections[index].label && (
                    <text
                      x="0"
                      y="-10"
                      fontSize="15"
                      textAnchor="middle"
                      fill="black"
                    >
                      {connections[index].label}
                    </text>
                  )}
                </g>
              )}
            </g>
          ))}
        </svg>
      </div>
      <SliderDialog isOpen={isSliderOpen} onClose={closeSlider} />
    </>
  );
};

export default Home;
