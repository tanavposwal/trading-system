import { useEffect, useMemo, useState } from "react";
import { Orderbook, AnonyOrder } from "../types";
import axios from "axios";

const Depth = () => {
  const [orderBook, setOrderBook] = useState<Orderbook | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch data from API
  useEffect(() => {
    const fetchOrderBook = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/depth");
        setOrderBook(response.data.orderbook);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching order book:", error);
        setLoading(false);
      }
    };

    fetchOrderBook();
    const interval = setInterval(fetchOrderBook, 10000);

    return () => clearInterval(interval);
  }, []);

  // Find the maximum order size for percentage bars
  const maxOrderSize = useMemo(() => {
    if (!orderBook) return 1;
    const allSizes = [...(orderBook.asks || []), ...(orderBook.bids || [])].map(order => order.size);
    return Math.max(...allSizes, 1);
  }, [orderBook]);

  const renderOrderRow = (order: AnonyOrder, side: "ask" | "bid") => {
    const percentage = (order.size / maxOrderSize) * 50;
    const bgColor = side === "ask" ? "bg-red-400" : "bg-green-400";
    const textColor = side === "ask" ? "text-red-700" : "text-green-700";

    return (
      <tr key={order.price} className={`relative bg-white border-b font-semibold text-sm ${side === "ask" ? "bg-red-100" : "bg-green-100"}`}>
        {side === "ask" ? (
          <>
            <td className="px-6 py-2">{order.size}</td>
            <td className={`px-6 py-2 ${textColor}`}>${order.price}</td>
          </>
        ) : (
          <>
            <td className={`px-6 py-2 ${textColor}`}>${order.price}</td>
            <td className="px-6 py-2">{order.size}</td>
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
    <div className="flex flex-col">
      <p className="text-xl font-bold text-center">Depth</p>
      <caption className="text-xs text-gray-500 mb-3">refresh every 1 seconds</caption>
      <div className="flex justify-center items-start w-full h-[60vh] overflow-y-auto">
        {/* Sell Orders (Asks) */}
        <table className="">
          <thead>
            <tr className="text-xs text-gray-700 uppercase bg-gray-50">
              <th className="px-6 py-3">Size</th>
              <th className="px-6 py-3">Sell (Ask)</th>
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
            <tr className="text-xs text-gray-700 uppercase bg-gray-50">
              <th className="px-6 py-3">Buy (Bid)</th>
              <th className="px-6 py-3">Size</th>
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

export default Depth;
