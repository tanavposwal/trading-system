import { createFileRoute, Navigate } from "@tanstack/react-router";
import Depth from "../components/Depth";
import MakeOrder from "../components/MakeOrder";
import Balance from "../components/Balance";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const token = localStorage.getItem("token");

  if (!token) {
    Navigate({ to: "/login" });
    toast.error("Please login first");
    return null;
  }

  return (
    <div>
      <div className="flex items-start justify-center w-full">
        <Depth />
        <div className="flex-col space-y-3 mt-6">
          <Balance />
          <MakeOrder />
        </div>
      </div>
    </div>
  );
}
