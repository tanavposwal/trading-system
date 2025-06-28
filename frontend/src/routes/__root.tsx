import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { TrendingUp } from "lucide-react";
import Auth from "@/components/Auth";

export const apiURL = import.meta.env.VITE_BACKEND_URL;
export const wsURL = import.meta.env.VITE_WS_URL;

export const Route = createRootRoute({
  component: () => (
    <div className="dark min-h-screen w-full bg-background text-foreground">
      <nav className="border-b flex items-center pl-10 justify-between w-full px-6 h-16 fixed top-0 left-0 right-0 backdrop-blur-sm z-10">
        <Link to="/">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TradeX
            </span>
          </div>
        </Link>
        <Auth />
      </nav>
      <div className="h-18 w-full" />
      <Outlet />
      <Toaster />
    </div>
  ),
});
