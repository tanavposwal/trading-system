import { createFileRoute } from "@tanstack/react-router";
import Depth from "../../components/Depth";
import MakeOrder from "../../components/MakeOrder";
import Balance from "../../components/Balance";

export const Route = createFileRoute("/user/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  return (
    <div>
      <div className="flex items-start justify-center">
        <Depth />
        <div className="flex-col space-y-3">
          <MakeOrder userId={id} />
          <Balance userId={id} />
        </div>
      </div>
    </div>
  );
}
