import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Toaster } from "sonner";
import { CandlestickChartIcon } from "lucide-react";
import Quote from "@/components/Quote";

export const Route = createRootRoute({
  component: () => (
    <body className="dark min-h-screen w-full">
      <nav className="border-b flex items-center pl-10 justify-between w-full px-6">
        <div className="flex items-center justify-cente py-5">
          <CandlestickChartIcon className="w-6 h-6 mr-3" />
          <p className="text-2xl font-bold text-center">FYNC exchange</p>
        </div>
        <Quote />
      </nav>
      <Outlet />
      <Toaster />
    </body>
  ),
});
