import { createFileRoute } from "@tanstack/react-router";
import UserComponent from "../components/User";
import Depth from "../components/Depth";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div>
      <div className="flex items-start justify-center">
        <Depth />
        <div>
          <UserComponent />
        </div>
      </div>
    </div>
  );
}
