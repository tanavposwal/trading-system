import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Toaster } from "sonner";
import Quote from "../components/Quote";

export const Route = createRootRoute({
  component: () => (
    <main className="min-h-screen mx-auto max-w-screen-xl">
      <p className="text-3xl font-black text-center pt-5">FYNC exchange</p>
      <Quote />

      <Outlet />

      <Toaster />
      <TanStackRouterDevtools />
    </main>
  ),
});
