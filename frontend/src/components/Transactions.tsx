import axios from "axios";
import { useEffect, useState } from "react";
import { Transaction } from "../types";
import { Button } from "./ui/button";
import { RefreshCcw } from "lucide-react";
import { apiURL } from "@/routes/__root";

export default function Transactions() {
  const token = localStorage.getItem("token");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function fetchT() {
    axios
      .get(apiURL + "transactions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setTransactions(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch transactions");
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchT();
  }, []);

  return (
    <div className="w-96 text-card-foreground border py-4 px-6 rounded-xl">
      <div className="flex flex-row items-center justify-between pb-4">
        <h2 className="text-lg font-semibold">Transactions</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={fetchT}
          aria-label="Refresh balance">
          <RefreshCcw className="w-5 h-5" />
        </Button>
      </div>
      <div>
        {loading ? (
          <div className="text-muted-foreground">Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : transactions.length === 0 ? (
          <div className="text-muted-foreground">No transactions found.</div>
        ) : (
          <ul className="divide-y divide-border">
            {transactions.map((tx) => (
              <li key={tx.id} className="py-2 flex flex-col gap-1">
                <div className="flex justify-between">
                  <span className="font-mono text-xs text-muted-foreground">
                    {new Date(tx.timestamp).toLocaleString()}
                  </span>
                  <span
                    className={`font-semibold ${tx.type === "buy" ? "text-green-400" : "text-red-400"}`}>
                    {tx.type.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Qty: {tx.quantity}</span>
                  <span>Price: ${tx.price}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
