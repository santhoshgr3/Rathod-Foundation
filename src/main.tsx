import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { CMSProvider } from "./contexts/CMSContext.tsx";
import { LanguageProvider } from "./lib/i18n.tsx";
import ErrorBoundary from "./components/ErrorBoundary.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <CMSProvider>
          <LanguageProvider>
            <App />
          </LanguageProvider>
        </CMSProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
