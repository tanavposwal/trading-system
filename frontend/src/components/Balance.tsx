import axios from "axios";
import { useEffect, useState } from "react";
import { User as UserType } from "../types";
import { RefreshCcw } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Button } from "../components/ui/button";

const Balance = ({ userId }: { userId: string }) => {
  const [info, setInfo] = useState<UserType | null>(null);

  function fetchUsers() {
    axios.get("http://localhost:3000/users").then((res) => {
      res.data.forEach((user: any) => {
        if (user.id === userId) {
          setInfo(user);
        }
      });
    });
  }

  useEffect(() => {
    fetchUsers();
    // console.log("user comp re");
  }, []);

  return (
    <Card className="w-full shadow-xl bg-card text-card-foreground">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border">
        <CardTitle className="text-lg font-semibold">Balance</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={fetchUsers}
          className="ml-2"
          aria-label="Refresh balance">
          <RefreshCcw className="w-5 h-5" />
        </Button>
      </CardHeader>
      <CardContent>
        {info ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Cash</span>
              <span className="text-lg font-mono bg-muted px-3 py-1 rounded">
                ${info.balances.cash.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Stock Holdings</span>
              <span className="text-lg font-mono bg-muted px-3 py-1 rounded">
                {info.balances.stock}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            Loading balance...
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Balance;
