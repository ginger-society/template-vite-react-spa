import { createHashRouter } from "react-router-dom";
import { withAuthHOC } from "./WithAuthHOC";
import { App } from "@/app";

const AuthenticatedPortion = withAuthHOC(App);

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/home",
    element: <AuthenticatedPortion />,
  },
]);

export default router;
