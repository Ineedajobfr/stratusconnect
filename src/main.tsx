import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import "./index.css";

import AppShell from "./components/AppShell";
import { BrokerNav } from "./components/BrokerNav";
import BrokerTerminalPage from "./pages/broker/BrokerTerminalPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AppShell nav={<BrokerNav />}>
        <BrokerTerminalPage />
      </AppShell>
    ),
  },
  {
    path: "/terminal/broker",
    element: (
      <AppShell nav={<BrokerNav />}>
        <BrokerTerminalPage />
      </AppShell>
    ),
  },
  { path: "*", element: <Navigate to="/terminal/broker" replace /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);