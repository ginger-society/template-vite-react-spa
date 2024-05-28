import ColumnEditor from "@/components/organisms/ColumnEditor";
import TableEditor from "@/components/organisms/TableEditor";
import UMLEditor from "@/components/organisms/UMLEditor";
import {
  Block,
  Connection,
  BlockData,
  MarkerType,
} from "@/components/organisms/UMLEditor/types";
import React from "react";
import { useEffect, useState } from "react";

const Home = () => {
  const [blocks, setBlocks] = useState<{ [key: string]: Block }>({});
  const [connections, setConnections] = useState<Connection[]>([]);

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
          [block.id]: {
            ...block,
            rows: block.rows || [],
            ref: React.createRef(),
            data: block.data || {},
          },
        };
      }, {});
      setBlocks(blockData);
    }

    if (savedConnections) {
      setConnections(JSON.parse(savedConnections));
      // setConnections(mockConnections);
    }
  }, [setBlocks, setConnections]);

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

  return (
    <>
      <header className="header">
        <button onClick={handleSave}>Save</button>
      </header>
      <UMLEditor
        setBlocks={setBlocks}
        setConnections={setConnections}
        blocks={blocks}
        connections={connections}
        legendItems={[
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
        ]}
        RowEditor={({ editorData }) => {
          return (
            <>
              {editorData && (
                <ColumnEditor editorData={editorData} blocks={blocks} />
              )}
            </>
          );
        }}
        BlockEditor={({ editorData }) => (
          <>
            {editorData && (
              <TableEditor editorData={editorData} blocks={blocks} />
            )}
          </>
        )}
      />
    </>
  );
};

export default Home;
