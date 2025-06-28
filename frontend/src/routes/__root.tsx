import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TrendingUp } from "lucide-react";
import { Toaster } from "sonner";

export const apiURL = import.meta.env.VITE_BACKEND_URL;
export const wsURL = import.meta.env.VITE_WS_URL;

export const Route = createRootRoute({
  component: () => (
    <div className="dark min-h-screen w-full bg-background text-foreground">
      <div className="h-18 w-full" />
      <Outlet />
      <footer className="px-6 py-12 bg-gray-900 text-white static bottom-0 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">TradeX</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2024 TradeX. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
      <Toaster />
    </div>
  ),
});
