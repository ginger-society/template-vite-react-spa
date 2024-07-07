import { ServiceOne } from "@/services";
import { useEffect } from "react";

const Home = () => {
  const fetchStatus = async () => {
    const data = await ServiceOne.healthGetDataApiV1HealthGet();
    console.log(data.status);
  };
  useEffect(() => {
    fetchStatus();
  }, []);

  return <>Home page</>;
};

export default Home;
