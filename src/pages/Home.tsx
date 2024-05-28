import UMLEditor from "@/components/organisms/UMLEditor";
import { Block, Connection } from "@/shared/types";
import { useState } from "react";

const Home = () => {
  const [blocks, setBlocks] = useState<{ [key: string]: Block }>({});
  const [connections, setConnections] = useState<Connection[]>([]);

  return (
    <UMLEditor
      setBlocks={setBlocks}
      setConnections={setConnections}
      blocks={blocks}
      connections={connections}
    />
  );
};

export default Home;
