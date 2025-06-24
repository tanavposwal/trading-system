import axios from "axios";
import { useEffect, useState } from "react";
import { User as UserType } from "../types";
import { RefreshCcw } from "lucide-react";

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
    console.log("user comp re");
  }, []);

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg w-full shadow-lg">
      <div className="mb-4 border-b border-gray-700 pb-2 flex">
        <h2 className="text-lg font-semibold">Balance</h2>
        <button
          onClick={() => fetchUsers()}
          className="cursor-pointer hover:opacity-70 ml-2">
          <RefreshCcw className="w-5 h-5" />
        </button>
      </div>
      {info ? (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Cash</span>
            <span className="text-lg font-mono bg-gray-700 px-2 py-1 rounded">
              ${info.balances.cash.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Stock Holdings</span>
            <span className="text-lg font-mono bg-gray-700 px-2 py-1 rounded">
              {info.balances.stock}
            </span>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500">Loading balance...</div>
      )}
    </div>
  );
};

export default Balance;
