import { createFileRoute } from "@tanstack/react-router";
import UserComponent from "../components/User";
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
    <div className="max-w-2xl mx-auto">
      <UserComponent />
      <ChartPlaceholder />
    </div>
  );
}
