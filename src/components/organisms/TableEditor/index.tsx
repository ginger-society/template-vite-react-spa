import { useUMLEditor } from "../UMLEditor/context";

const TableEditor = () => {
  const {
    blocks,
    setBlocks,
    connections,
    setConnections,
    editorData = { blockId: "" },
  } = useUMLEditor();

  const handleNameChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    if (!editorData?.blockId) {
      return;
    }
    setBlocks((v) => {
      return {
        ...v,
        [editorData?.blockId]: {
          ...v[editorData?.blockId],
          data: { name: value },
        },
      };
    });
  };

  return (
    <>
      Table editor here
      <h2>Slider Window Content {Object.keys(blocks).length}</h2>
      {JSON.stringify(blocks[editorData?.blockId].data)}
      <input
        style={{ border: "solid 1px" }}
        value={blocks[editorData?.blockId].data.name}
        onChange={handleNameChange}
      />
    </>
  );
};

export default TableEditor;
