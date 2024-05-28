import { useUMLEditor } from "../UMLEditor/context";

const TableEditor = () => {
  const { blocks, setBlocks, connections, setConnections } = useUMLEditor();

  const handleNameChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setBlocks((v) => {
      console.log(v["no-id"]);
      return {
        ...v,
        ["no-id"]: {
          ...v["no-id"],
          data: { name: value },
        },
      };
    });
  };

  return (
    <>
      Table editor here
      <h2>Slider Window Content {Object.keys(blocks).length}</h2>
      {JSON.stringify(blocks["no-id"].data)}
      <input
        style={{ border: "solid 1px" }}
        value={blocks["no-id"].data.name}
        onChange={handleNameChange}
      />
    </>
  );
};

export default TableEditor;
