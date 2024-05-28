import { LegendConfigs } from "@/components/atoms/Legend/types";
import ColumnEditor from "@/components/organisms/ColumnEditor";
import TableEditor from "@/components/organisms/TableEditor";
import UMLEditor from "@/components/organisms/UMLEditor";
import {
  UMLEditorProvider,
  useUMLEditor,
} from "@/components/organisms/UMLEditor/context";
import {
  Block,
  Connection,
  BlockData,
  MarkerType,
  EditorData,
} from "@/components/organisms/UMLEditor/types";
import React, { useEffect, useState } from "react";

const legendConfigs: LegendConfigs = {
  [MarkerType.Circle]: {
    label: "One To Many",
    color: "#FF204E",
  },
  [MarkerType.Rectangle]: {
    label: "Many To Many",
    color: "#4793AF",
  },
  [MarkerType.Hexagon]: {
    label: "Foreign Key",
    color: "#5E1675",
  },
  [MarkerType.Triangle]: {
    label: "One to One",
    color: "#799351",
  },
};

const Home = () => {
  const [blocks, setBlocks] = useState<{ [key: string]: Block }>({});
  const [connections, setConnections] = useState<Connection[]>([]);
  const [editorData, setEditorData] = useState<EditorData>();

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
    }
  }, []);

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
    <UMLEditorProvider
      value={{
        blocks,
        setBlocks,
        connections,
        setConnections,
        editorData,
        setEditorData,
      }}
    >
      <>
        <header className="header">
          <button onClick={handleSave}>Save</button>
        </header>
        <UMLEditorWrapper />
      </>
    </UMLEditorProvider>
  );
};

const UMLEditorWrapper = () => {
  const { blocks, setBlocks, connections, setConnections, setEditorData } =
    useUMLEditor();

  return (
    <UMLEditor
      setBlocks={setBlocks}
      setConnections={setConnections}
      blocks={blocks}
      RowRenderer={({ rowData }) => <strong>{rowData.id + " : Row"}</strong>}
      connections={connections}
      legendConfigs={legendConfigs}
      RowEditor={ColumnEditor}
      BlockEditor={TableEditor}
      setEditorData={setEditorData}
    />
  );
};

export default Home;
