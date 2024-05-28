import { TableEditorProps } from "@/shared/types";

const TableEditor = ({ blocks, editorData }: TableEditorProps) => {
  return (
    <>
      Table editor here
      <h2>Slider Window Content {Object.keys(blocks).length}</h2>
      {JSON.stringify(editorData)}
    </>
  );
};

export default TableEditor;
