import { createHashRouter } from "react-router-dom";
import { withAuthHOC } from "./WithAuthHOC";
import Home from "@/pages/Home";
import IndexPage from "@/pages/Index";

const AuthenticatedHome = withAuthHOC(Home);

const router = createHashRouter([
  {
    path: "/",
    element: <IndexPage />,
  },
  {
    path: "/home",
    element: <AuthenticatedHome />,
  },
]);

export default router;
