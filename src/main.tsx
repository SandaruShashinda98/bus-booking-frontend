import { createRoot } from "react-dom/client";
import "./index.css";
import { StrictMode } from "react";
import Router from "./routes/Router";
import { BrowserRouter } from "react-router-dom";
import { AuthGuardProvider } from "./contexts/AuthGuardContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
  <div className="bg-slate-500 min-h-screen">
      <AuthGuardProvider>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </AuthGuardProvider>
    </div>
  </StrictMode>
);
