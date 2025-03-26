import { createRoot } from "react-dom/client";
import "./index.css";
import { StrictMode } from "react";
import Router from "./routes/Router";
import { BrowserRouter } from "react-router-dom";
import { AuthGuardProvider } from "./contexts/AuthGuardContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="bg-slate-500 min-h-screen">
      <AuthGuardProvider>
        <BrowserRouter>
          <Router />
          <ToastContainer position="top-right" autoClose={3000} />
        </BrowserRouter>
      </AuthGuardProvider>
    </div>
  </StrictMode>
);
