import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Toaster } from "sonner";

export const apiURL = import.meta.env.VITE_BACKEND_URL;
export const wsURL = import.meta.env.VITE_WS_URL;

export const Route = createRootRoute({
  component: () => (
    <div className="dark min-h-screen w-full bg-background text-foreground">
      <div className="h-18 w-full" />
      <Outlet />
      <Toaster />
    </div>
  ),
});
