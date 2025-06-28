import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { CandlestickChartIcon } from "lucide-react";
import Auth from "@/components/Auth";

export const Route = createRootRoute({
  component: () => (
    <div className="dark min-h-screen w-full bg-background text-foreground">
      <nav className="border-b flex items-center pl-10 justify-between w-full px-6">
        <Link to="/">
          <div className="flex items-center justify-cente py-5">
            <CandlestickChartIcon className="w-6 h-6 mr-3" />
            <p className="text-2xl font-bold text-center">FYNC exchange</p>
          </div>
        </Link>
        <Auth />
      </nav>
      <Outlet />
      <Toaster />
    </div>
  ),
});
