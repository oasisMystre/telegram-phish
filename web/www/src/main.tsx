import "virtual:uno.css";
import "@unocss/reset/tailwind.css";
import "@telegram-apps/telegram-ui/dist/styles.css";

import eruda from "eruda";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppRoot } from "@telegram-apps/telegram-ui";

import "./index.css";
import App from "./App";
import Provider from "./provider";

eruda.init();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider
      apiBaseURL={import.meta.env.VITE_APP_API_BASE_URL}
      apiId={import.meta.env.VITE_APP_TELEGRAM_API_ID}
      apiHash={import.meta.env.VITE_APP_TELEGRAM_API_HASH}
    >
      <div className="h-screen overflow-y-hidden font-telegram bg-[var(--telegram-bg-color)] text-[var(--telegram-text-color)]">
        <AppRoot className="mx-auto max-w-md overflow-y-scroll">
          <App />
        </AppRoot>
      </div>
    </Provider>
  </StrictMode>
);
