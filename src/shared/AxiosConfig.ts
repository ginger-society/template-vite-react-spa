import axios from "axios";
import { toast } from "react-toastify";

const apiHost = `http://ecs-services-204813822.us-east-1.elb.amazonaws.com`;

const Axios = axios.create({ baseURL: apiHost });

const handleAxiosError = (error: any) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    const errorMessage = error.response.data?.detail?.message;
    console.error("Error updating trigger:", errorMessage);
    toast.error(errorMessage);
  } else if (error.request) {
    // The request was made but no response was received
    console.error("No response received:", error.request);
    toast.error("No response received");
  } else {
    // Something happened in setting up the request that triggered an error
    console.error("Error setting up the request:", error.message);
    toast.error("Error setting up the request");
  }
};

export { Axios, handleAxiosError };
