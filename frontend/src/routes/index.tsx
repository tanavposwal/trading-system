import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "sonner";
import UserComponent from "../components/User";
import MakeOrder from "../components/MakeOrder";
import Depth from "../components/Depth";
import Quote from "../components/Quote";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen mx-auto max-w-(--breakpoint-xl)">
      <p className="text-3xl font-black text-center pt-5">
        TANAV STOCK EXCHANGE
      </p>
      <Quote />
      <div className="flex items-start justify-center border-t">
        <Depth />
        <div>
          <MakeOrder />
          <UserComponent />
        </div>
      </div>
      <Toaster />
    </main>
  );
}
