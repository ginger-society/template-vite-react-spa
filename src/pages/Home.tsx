import { useEffect } from "react";

const Home = () => {
  const fetchStatus = async () => {};
  useEffect(() => {
    fetchStatus();
  }, []);

  return <>Home page</>;
};

export default Home;
