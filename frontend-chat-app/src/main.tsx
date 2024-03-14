import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import Router from "./routing/routes.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
    <Router />
  // </React.StrictMode>
);
