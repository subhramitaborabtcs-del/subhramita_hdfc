import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ObservabilityHeaderProvider } from "./context/ObservabilityHeaderContext";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ObservabilityHeaderProvider>
        <App />
      </ObservabilityHeaderProvider>
    </BrowserRouter>
  </StrictMode>
);