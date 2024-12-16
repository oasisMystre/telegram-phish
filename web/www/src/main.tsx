import "virtual:uno.css";
import eruda from "eruda";
import "@unocss/reset/tailwind.css";
import "@telegram-apps/telegram-ui/dist/styles.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppRoot } from "@telegram-apps/telegram-ui";
import {
  init,
  backButton,
  mainButton,
  setMainButtonParams,
} from "@telegram-apps/sdk-react";
import { BrowserRouter, Route, Routes } from "react-router";

import "./index.css";
import HomePage from "./pages";
import AuthPage from "./pages/auth";
import Provider from "./provider";

init();
eruda.init();
backButton.mount();
mainButton.mount();

setMainButtonParams({
  text: "@safeguard",
});

const App = () => {

  return (
    <div className="fixed inset-0 !font-sans bg-[var(--telegram-bg-color)] text-[var(--telegram-text-color)]">
      <BrowserRouter >
        <AppRoot className="mx-auto max-w-md">
          <Routes>
            <Route
              path="/"
              element={<HomePage />}
            />
            <Route
              path="/auth"
              element={<AuthPage />}
            />
          </Routes>
        </AppRoot>
      </BrowserRouter>
    </div>
  );
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider
      apiBaseURL={import.meta.env.VITE_APP_API_BASE_URL}
      apiId={import.meta.env.VITE_APP_TELEGRAM_API_ID}
      apiHash={import.meta.env.VITE_APP_TELEGRAM_API_HASH}
    >
      <App />
    </Provider>
  </StrictMode>
);
