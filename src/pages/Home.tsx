import React, { useRef, useState, useEffect } from "react";
import Draggable from "react-draggable";

interface Block {
  id: number;
  ref: React.RefObject<HTMLDivElement>;
}

interface Connection {
  block1Id: number;
  block2Id: number;
}

function calculatePath(rect1: DOMRect, rect2: DOMRect) {
  const rowHeight1 = rect1.height / 4;
  const rowHeight2 = rect2.height / 4;

  const distanceRightLeft = Math.abs(rect1.right - rect2.left);
  const distanceLeftRight = Math.abs(rect1.left - rect2.right);

  let x1, y1, x2, y2;

  if (distanceRightLeft < distanceLeftRight) {
    x1 = rect1.right;
    y1 = rect1.top + rowHeight1 * 2.5 + window.scrollY;
    x2 = rect2.left;
    y2 = rect2.top + rowHeight2 / 2 + window.scrollY;
  } else {
    x1 = rect1.left;
    y1 = rect1.top + rowHeight1 * 2.5 + window.scrollY;
    x2 = rect2.right;
    y2 = rect2.top + rowHeight2 / 2 + window.scrollY;
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
    { block1Id: 1, block2Id: 2 },
  ]);
  const svgRef = useRef<SVGSVGElement>(null);
  const [paths, setPaths] = useState<string[]>([]);

  const handleDrag = () => {
    const newPaths = connections.map(({ block1Id, block2Id }) => {
      const rect1 = blocks
        .find((block) => block.id === block1Id)
        ?.ref.current?.getBoundingClientRect();
      const rect2 = blocks
        .find((block) => block.id === block2Id)
        ?.ref.current?.getBoundingClientRect();
      if (rect1 && rect2) {
        return calculatePath(rect1, rect2);
      }
      return "";
    });

    setPaths(newPaths);
  };

  useEffect(() => {
    handleDrag();
  }, [connections]);

  const handleDragStop = (blockId: number) => {
    setConnections((prevConnections) => {
      const index = prevConnections.findIndex(
        (connection) => connection.block1Id === blockId,
      );
      if (index !== -1) {
        const updatedConnections = [...prevConnections];
        updatedConnections[index].block2Id = 2; // Update block2Id to the ID of the second block
        return updatedConnections;
      }
      return prevConnections;
    });
  };

  return (
    <>
      <h1>Home</h1>
      <div style={{ position: "relative", minHeight: "200vh" }}>
        {blocks.map((block) => (
          <Draggable
            key={block.id}
            onDrag={handleDrag}
            onStop={() => handleDragStop(block.id)}
          >
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
