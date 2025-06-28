import { createFileRoute, Navigate } from "@tanstack/react-router";
import Depth from "../components/Depth";
import MakeOrder from "../components/MakeOrder";
import Balance from "../components/Balance";
import { toast } from "sonner";
import Transactions from "@/components/Transactions";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const token = localStorage.getItem("token");

  if (token == "") {
    Navigate({ to: "/login" });
    toast.error("Please login first");
    return null;
  }

  return (
    <div className="flex items-start justify-center w-full gap-4 pt-2">
      <Depth />
      <div className="flex-col space-y-3 w-80">
        <Balance />
        <MakeOrder />
      </div>
      <Transactions />
    </div>
  );
}
