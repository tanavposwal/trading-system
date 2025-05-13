import axios from "axios";
import { useEffect, useState } from "react";
import { User as UserType } from "../types";

const Balance = ({ userId }: { userId: string }) => {
  const [info, setInfo] = useState<UserType | null>(null);
  useEffect(() => {
    function fetchUsers() {
      axios.get("http://localhost:3000/data/users").then((res) => {
        res.data.forEach((user: any) => {
          if (user.id === userId) {
            setInfo(user);
          }
        });
      });
    }

    fetchUsers();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-2 w-full border rounded-xl py-2">
      {info && (
        <div>
          <p className="text-lg">${info!.balances.cash}</p>
          <p className="text-lg">stocks - {info!.balances.stock}</p>
        </div>
      )}
    </div>
  );
};

export default Balance;
