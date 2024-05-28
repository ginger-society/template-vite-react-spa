import SliderDialog from "@/components/organisms/Aside";
import { calculatePath } from "@/shared/canvas.utils";
import { mockBlocks, mockConnections } from "@/shared/mocks";
import { Block, BlockData, Connection, MarkerType } from "@/shared/types";
import React, { useState, useEffect, useCallback } from "react";
import Draggable from "react-draggable";
import {
  hexagonIcon,
  triangleIcon,
  rectangleIcon,
  pencilIcon,
  circleIcon,
} from "@/shared/svgIcons";
import ColumnEditor from "@/components/organisms/ColumnEditor";
import Legend from "@/components/atoms/Legend";

const Home = () => {
  const [isSliderOpen, setIsSliderOpen] = useState(false);

  const toggleSlider = () => {
    setIsSliderOpen((isOpen) => !isOpen);
  };

  const closeSlider = () => {
    setIsSliderOpen(false);
  };

  const [blocks, setBlocks] = useState<{ [key: string]: Block }>({});
  const [connections, setConnections] = useState<Connection[]>([]);
  const svgRef = React.createRef<SVGSVGElement>();
  const [paths, setPaths] = useState<
    { path: string; midX: number; midY: number }[]
  >([]);

  useEffect(() => {
    const savedData = localStorage.getItem("data");
    const savedConnections = localStorage.getItem("connections");

    if (savedData) {
      const mockBlocks2 = JSON.parse(savedData) as BlockData[];
      const blockData: { [key: number]: Block } = Object.values(
        mockBlocks2,
      ).reduce((accum, block) => {
        return {
          ...accum,
          [block.id]: { ...block, ref: React.createRef() },
        };
      }, {});
      setBlocks(blockData);
    }

    if (savedConnections) {
      setConnections(JSON.parse(savedConnections));
    }
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

  const handleSave = () => {
    const blocksStr = Object.values(blocks).map((block) => {
      return { id: block.id, position: block.position, rows: block.rows };
    });

    localStorage.setItem("data", JSON.stringify(blocksStr));

    localStorage.setItem("connections", JSON.stringify(connections));
  };

  const handleBlockDrag = (id: number, e: any, data: any) => {
    setBlocks((prevBlocks) => ({
      ...prevBlocks,
      [id]: {
        ...prevBlocks[id],
        position: { top: data.y, left: data.x },
      },
    }));
    handleDrag(); // Update paths after dragging
  };

  return (
    <>
      <header className="header">
        <button onClick={handleSave}>Save</button>
      </header>
      <div className="canvas-container">
        {Object.values(blocks).map((block) => (
          <Draggable
            key={block.id}
            onDrag={(e, data) => handleBlockDrag(block.id, e, data)}
            handle=".handle"
            position={{ x: block.position.left, y: block.position.top }}
          >
            <div className="card block-card" ref={block.ref}>
              {/* Header row */}
              <div className="block-header handle">
                <span>Block {block.id} Header</span>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSlider();
                  }}
                >
                  {pencilIcon}
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
                <g transform={`translate(${midX - 13}, ${midY})`}>
                  {(() => {
                    switch (connections[index].marker) {
                      case MarkerType.Triangle:
                        return triangleIcon;
                      case MarkerType.Rectangle:
                        return rectangleIcon;
                      case MarkerType.Circle:
                        return circleIcon;
                      case MarkerType.Hexagon:
                        return hexagonIcon;
                      default:
                        return null;
                    }
                  })()}
                  {connections[index].label && (
                    <text
                      x="10"
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
        <ColumnEditor />
      </SliderDialog>
      <Legend
        items={[
          {
            type: "ForeignKey",
            color: "blue",
            markerType: MarkerType.Triangle,
          },
          {
            type: "ManyToMany",
            color: "green",
            markerType: MarkerType.Rectangle,
          },
          { type: "OneToOne", color: "red", markerType: MarkerType.Circle },
          // { type: "Hexagon", color: "orange", markerType: MarkerType.Hexagon },
        ]}
      />
    </>
  );
};

export default Home;
