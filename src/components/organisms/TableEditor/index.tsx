import { TableEditorProps } from "@/shared/types";

const TableEditor = ({ blocks }: TableEditorProps) => {
  return (
    <>
      Table editor here
      <h2>Slider Window Content {Object.keys(blocks).length}</h2>
    </>
  );
};

export default TableEditor;
