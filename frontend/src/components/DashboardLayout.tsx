import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import viteLogo from "@/assets/react.svg";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-60 bg-sidebar border-r border-sidebar-border px-6 py-6 gap-8 shadow-lg">
        <div className="flex items-center gap-3 mb-8">
          <img src={viteLogo} alt="Logo" className="w-8 h-8 rounded" />
          <span className="text-xl font-bold tracking-tight text-sidebar-foreground">
            TradePro
          </span>
        </div>
        <nav className="flex flex-col gap-2">
          <Link
            to="/"
            className="text-sidebar-foreground hover:text-primary transition-colors font-medium py-2 px-3 rounded-md">
            Dashboard
          </Link>
          {/* Add more nav links here if needed */}
        </nav>
        <div className="mt-auto flex flex-col gap-2">
          <Button variant="secondary" className="w-full">
            User
          </Button>
          {/* Add user/account actions here */}
        </div>
      </aside>
      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 flex items-center px-6 border-b border-border bg-card/80 backdrop-blur-md shadow-sm">
          <span className="text-lg font-bold tracking-tight">
            TradePro Dashboard
          </span>
          {/* Add header actions here if needed */}
        </header>
        {/* Main dashboard grid */}
        <main className="flex-1 p-4 md:p-8 bg-background">
          <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-min">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
