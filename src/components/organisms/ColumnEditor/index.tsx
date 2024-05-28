import { useUMLEditor } from "../UMLEditor/context";

const ColumnEditor = () => {
  const { blocks, setBlocks, connections, setConnections } = useUMLEditor();

  return (
    <>
      <h2>Slider Window Content {Object.keys(blocks).length}</h2>
      <p>This is the content of your slider window.</p>
    </>
  );
};

export default ColumnEditor;
