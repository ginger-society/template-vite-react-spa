import SliderDialog from "@/components/organisms/Aside";
import { calculatePath } from "@/shared/canvas.utils";
import { mockBlocks, mockConnections } from "@/shared/mocks";
import { Block, Connection } from "@/shared/types";
import React, { useState, useEffect, useCallback } from "react";
import Draggable from "react-draggable";

const Home = () => {
  const [isSliderOpen, setIsSliderOpen] = useState(false);

  const toggleSlider = () => {
    setIsSliderOpen((isOpen) => !isOpen);
  };

  const closeSlider = () => {
    setIsSliderOpen(false);
  };

  const [blocks, setBlocks] = useState<{ [key: number]: Block }>({});
  const [connections, setConnections] = useState<Connection[]>(mockConnections);
  const svgRef = React.createRef<SVGSVGElement>();
  const [paths, setPaths] = useState<
    { path: string; midX: number; midY: number }[]
  >([]);

  useEffect(() => {
    setBlocks(mockBlocks);
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
      <div className="container">
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
              <div className="block-header handle">
                <span>Block {block.id} Header</span>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSlider();
                  }}
                  className="handle"
                >
                  <svg
                    className="editIcon"
                    fill="#000000"
                    version="1.1"
                    id="Capa_1"
                    width="800px"
                    height="800px"
                    viewBox="0 0 528.899 528.899"
                  >
                    <g>
                      <path
                        d="M328.883,89.125l107.59,107.589l-272.34,272.34L56.604,361.465L328.883,89.125z M518.113,63.177l-47.981-47.981
		c-18.543-18.543-48.653-18.543-67.259,0l-45.961,45.961l107.59,107.59l53.611-53.611
		C532.495,100.753,532.495,77.559,518.113,63.177z M0.3,512.69c-1.958,8.812,5.998,16.708,14.811,14.565l119.891-29.069
		L27.473,390.597L0.3,512.69z"
                      />
                    </g>
                  </svg>
                </span>
              </div>
              {/* Render dynamic number of rows */}
              {[...Array(block.rows)].map((_, index) => (
                <div onClick={toggleSlider} key={index} className="row-content">
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
                        return <polygon points="-6,-6 6,0 -6,6" fill="red" />;
                      case "square":
                        return (
                          <rect
                            x="-6"
                            y="-6"
                            width="12"
                            height="12"
                            fill="blue"
                          />
                        );
                      case "circle":
                        return <circle cx="0" cy="0" r="6" fill="green" />;
                      case "hexagon":
                        return (
                          <polygon
                            points="-6,-3 0,-6 6,-3 6,3 0,6 -6,3"
                            fill="orange"
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
      <SliderDialog isOpen={isSliderOpen} onClose={closeSlider}>
        <h2>Slider Window Content</h2>
        <p>This is the content of your slider window.</p>
      </SliderDialog>
    </>
  );
};

export default Home;
