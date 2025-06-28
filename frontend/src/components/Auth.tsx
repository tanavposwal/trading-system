import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "./ui/button";

export default function Auth() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  if (!token) {
    return (
      <div>
        <Button asChild>
          <Link to="/login">Login</Link>
        </Button>
      </div>
    );
  }
  return (
    <div className="flex gap-3">
      <Button variant={"outline"} asChild>
        <Link to="/login">Dashboard</Link>
      </Button>
      <Button
        variant={"destructive"}
        onClick={() => {
          localStorage.setItem("token", "");
          navigate({ to: "/dashboard" });
        }}>
        Signout
      </Button>
    </div>
  );
}
