import React from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../pages/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/home",
    element: <App />,
  },
]);
export default router;
