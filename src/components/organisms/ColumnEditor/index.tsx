import { ColumnEditorProps } from "@/shared/types";

const ColumnEditor = ({ blocks }: ColumnEditorProps) => {
  return (
    <>
      <h2>Slider Window Content {Object.keys(blocks).length}</h2>
      <p>This is the content of your slider window.</p>
    </>
  );
};

export default ColumnEditor;
