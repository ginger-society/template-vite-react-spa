import Draggable from "react-draggable";

import Legend from "@/components/atoms/Legend";
import { calculatePath } from "@/shared/canvas.utils";
import {
  pencilIcon,
  triangleIcon,
  rectangleIcon,
  circleIcon,
  hexagonIcon,
} from "@/shared/svgIcons";
import {
  EditorTypeEnum,
  Block,
  BlockData,
  MarkerType,
  UMLEditorProps,
} from "@/shared/types";
import React, { useState, useEffect, useCallback } from "react";
import ColumnEditor from "../ColumnEditor";
import TableEditor from "../TableEditor";
import Aside from "@/components/organisms/Aside";

const UMLEditor = ({
  setBlocks,
  setConnections,
  blocks,
  connections,
  legendItems,
}: UMLEditorProps) => {
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [editorType, setEditorType] = useState<EditorTypeEnum>();

  const toggleSlider = (type: EditorTypeEnum) => {
    setIsSliderOpen((isOpen) => !isOpen);
    setEditorType(type);
  };

  const closeSlider = () => {
    setIsSliderOpen(false);
  };

  const svgRef = React.createRef<SVGSVGElement>();
  const [paths, setPaths] = useState<
    { path: string; midX: number; midY: number }[]
  >([]);

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
          blocks[block1Id]?.rows.length || 0,
          blocks[block2Id]?.rows.length || 0,
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
      return {
        id: block.id,
        position: block.position,
        rows: block.rows,
        data: block.data,
      };
    });

    localStorage.setItem("data", JSON.stringify(blocksStr));

    localStorage.setItem("connections", JSON.stringify(connections));
  };

  const handleBlockDrag = (id: string, e: any, data: any) => {
    setBlocks((prevBlocks) => ({
      ...prevBlocks,
      [id]: {
        ...prevBlocks[id],
        position: { top: data.y, left: data.x },
      },
    }));
    handleDrag(); // Update paths after dragging
  };

  const handleAddTable = () => {
    setBlocks((v) => {
      return {
        ...v,
        ["no-id"]: {
          id: "no-id",
          rows: [],
          ref: React.createRef(),
          position: { top: 100, left: 100 },
          data: {},
        },
      };
    });
  };

  const addNewRow = (id: string) => {
    setBlocks((prevBlocks) => ({
      ...prevBlocks,
      [id]: {
        ...prevBlocks[id],
        rows: [...prevBlocks[id].rows, { id: "new-row", data: {} }],
      },
    }));
    handleDrag(); // Update paths after dragging
  };

  return (
    <>
      <header className="header">
        <button onClick={handleSave}>Save</button>
        <button onClick={handleAddTable}>Add table</button>
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
                    toggleSlider(EditorTypeEnum.BLOCK);
                  }}
                >
                  {pencilIcon}
                </span>
              </div>
              {/* Render dynamic number of rows */}
              {block.rows.map((row, index) => (
                <div
                  onClick={() => toggleSlider(EditorTypeEnum.ROW)}
                  key={index}
                  className="row-content"
                >
                  {row.id}
                </div>
              ))}
              <div
                onClick={() => {
                  addNewRow(block.id);
                }}
                className="row-content"
              >
                Add new row
              </div>
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
      <Aside isOpen={isSliderOpen} onClose={closeSlider}>
        {editorType === EditorTypeEnum.ROW && <ColumnEditor />}
        {editorType === EditorTypeEnum.BLOCK && <TableEditor />}
      </Aside>
      <Legend items={legendItems} />
    </>
  );
};

export default UMLEditor;