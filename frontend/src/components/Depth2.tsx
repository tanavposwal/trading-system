import { useEffect, useMemo, useState } from "react";
import { Orderbook, AnonyOrder } from "../types";
import axios from "axios";

const Depth2 = () => {
  const [orderBook, setOrderBook] = useState<Orderbook | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch data from API
  useEffect(() => {
    const fetchOrderBook = async () => {
      try {
        const response = await axios.get("http://localhost:3000/depth");
        setOrderBook(response.data.orderbook);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching order book:", error);
        setLoading(false);
      }
    };

    fetchOrderBook();
    const interval = setInterval(fetchOrderBook, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Find the maximum order size for percentage bars
  const maxOrderSize = useMemo(() => {
    if (!orderBook) return 1;
    const allSizes = [...(orderBook.asks || []), ...(orderBook.bids || [])].map(order => order.size);
    return Math.max(...allSizes, 1);
  }, [orderBook]);

  const renderOrderRow = (order: AnonyOrder, side: "ask" | "bid") => {
    const percentage = (order.size / maxOrderSize) * 100;
    const bgColor = side === "ask" ? "bg-red-500" : "bg-green-500";
    const textColor = side === "ask" ? "text-red-600" : "text-green-600";

    return (
      <tr key={order.price} className={`relative ${side === "ask" ? "bg-red-100" : "bg-green-100"}`}>
        {side === "ask" ? (
          <>
            <td className="text-center">{order.size}</td>
            <td className={`text-center ${textColor}`}>${order.price}</td>
          </>
        ) : (
          <>
            <td className={`text-center ${textColor}`}>${order.price}</td>
            <td className="text-center">{order.size}</td>
          </>
        )}
        <td className="w-32">
          <div
            className={`absolute top-0 bottom-0 ${bgColor} opacity-20`}
            style={{ width: `${percentage}%`, [side === "ask" ? "right" : "left"]: 0 }}
          ></div>
        </td>
      </tr>
    );
  };

  if (loading) return <div className="text-center py-4">Loading order book...</div>;

  return (
    <div className="m-5 flex flex-col items-center justify-center gap-3">
      <p className="text-3xl font-bold">Depth</p>
      <div className="flex justify-center items-start border w-fit rounded-lg overflow-hidden">
        {/* Sell Orders (Asks) */}
        <table className="border-r">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Size</th>
              <th className="px-4 py-2">Sell (Ask)</th>
              <th className="w-32"></th>
            </tr>
          </thead>
          <tbody>
            {orderBook?.asks.slice(0, 10).map((ask) => renderOrderRow(ask, "ask")) || (
              <tr><td colSpan={3} className="text-center py-2">No ask orders available</td></tr>
            )}
          </tbody>
        </table>

        {/* Buy Orders (Bids) */}
        <table>
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Buy (Bid)</th>
              <th className="px-4 py-2">Size</th>
              <th className="w-32"></th>
            </tr>
          </thead>
          <tbody>
            {orderBook?.bids.slice(0, 10).map((bid) => renderOrderRow(bid, "bid")) || (
              <tr><td colSpan={3} className="text-center py-2">No bid orders available</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Depth2;
