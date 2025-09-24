import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider } from
"react-router-dom";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css';
import { HomePage } from '@/pages/HomePage';
import { GameArenaPage } from "@/pages/GameArenaPage";
import { GameSelectionPage } from '@/pages/GameSelectionPage';
import { AdminPage } from '@/pages/AdminPage';
const router = createBrowserRouter([
{
  path: "/",
  element: <HomePage />,
  errorElement: <RouteErrorBoundary />
},
{
  path: "/games/:gameType",
  element: <GameSelectionPage />,
  errorElement: <RouteErrorBoundary />
},
{
  path: "/game/:gameId",
  element: <GameArenaPage />,
  errorElement: <RouteErrorBoundary />
},
{
  path: "/admin",
  element: <AdminPage />,
  errorElement: <RouteErrorBoundary />
}]
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </StrictMode>
);