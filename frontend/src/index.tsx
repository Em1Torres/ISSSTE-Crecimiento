import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";


//Inicializa la aplicación React y renderiza App.
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

