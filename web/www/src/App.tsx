import {
  backButton,
  init,
  isMiniAppMounted,
  mainButton,
} from "@telegram-apps/sdk-react";

import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router";

import HomePage from "./pages";
import AuthPage from "./pages/auth";

export default function App () {
  const miniAppMounted = isMiniAppMounted();

  useEffect(() => {
    if (miniAppMounted) {
      init();
      mainButton.mount();
      backButton.mount();

      mainButton.setParams({
        text: "@Safeguardbot",
        isVisible: true,
        isEnabled: true,
      });
    }
  }, [miniAppMounted]);

  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}
