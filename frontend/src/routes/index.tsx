import { createFileRoute } from "@tanstack/react-router";
import UserComponent from "../components/User";
import Depth from "../components/Depth";
import Balance from "../components/Balance";
import Quote from "../components/Quote";
import MakeOrder from "../components/MakeOrder";
import DashboardLayout from "../components/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

export const Route = createFileRoute("/")({
  component: Index,
});

function ChartPlaceholder() {
  return (
    <Card className="h-full min-h-[220px] flex flex-col justify-center items-center bg-card/80 shadow-md">
      <CardHeader>
        <CardTitle>Chart</CardTitle>
      </CardHeader>
      <CardContent className="text-muted-foreground text-center">
        Chart coming soon
      </CardContent>
    </Card>
  );
}

function Index() {
  return (
    <DashboardLayout>
      {/* Left: Orderbook */}
      <div className="col-span-1 row-span-3 flex flex-col gap-4 min-h-[500px]">
        <Depth />
      </div>
      {/* Center: Chart, Quote, MakeOrder */}
      <div className="col-span-2 row-span-1 flex flex-col gap-4">
        <ChartPlaceholder />
      </div>
      <div className="col-span-2 row-span-1 flex flex-col gap-4">
        <Quote />
      </div>
      <div className="col-span-2 row-span-1 flex flex-col gap-4">
        <MakeOrder userId={"1"} />
      </div>
      {/* Right: Balance, User list */}
      <div className="col-span-1 row-span-1 flex flex-col gap-4">
        <Balance userId={"1"} />
      </div>
      <div className="col-span-1 row-span-2 flex flex-col gap-4">
        <UserComponent />
      </div>
    </DashboardLayout>
  );
}
