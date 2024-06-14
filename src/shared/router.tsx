import { createHashRouter } from "react-router-dom";
import { withAuthHOC } from "./WithAuthHOC";
import { App } from "@/app";
import Home from "@/pages/Home";

const AuthenticatedHome = withAuthHOC(Home);

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/home",
    element: <AuthenticatedHome />,
  },
]);

export default router;
