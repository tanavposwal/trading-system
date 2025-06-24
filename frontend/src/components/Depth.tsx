import { useEffect, useMemo, useState } from "react";
import { Orderbook, AnonyOrder } from "../types";

const Depth = () => {
  const [orderBook, setOrderBook] = useState<Orderbook | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch data from API
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000");

    ws.onopen = () => {
      setLoading(false);
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "orderbook") {
          setOrderBook(message.data);
          if (loading) setLoading(false);
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setLoading(false);
    };

    // Clean up the connection when the component unmounts
    return () => {
      ws.close();
    };
  }, [loading]);

  // Find the maximum order size for percentage bars
  const maxOrderSize = useMemo(() => {
    if (!orderBook) return 1;
    const allSizes = [...(orderBook.asks || []), ...(orderBook.bids || [])].map(
      (order) => order.size
    );
    return Math.max(...allSizes, 1);
  }, [orderBook]);

  const renderOrderRow = (order: AnonyOrder, side: "ask" | "bid") => {
    const percentage = (order.size / maxOrderSize) * 100;
    const bgColor = side === "ask" ? "bg-red-400" : "bg-green-400";
    const textColor = side === "ask" ? "text-red-700" : "text-green-700";

    return (
      <tr
        key={order.price}
        className={`relative bg-white border-b font-semibold text-sm ${
          side === "ask" ? "bg-red-100" : "bg-green-100"
        }`}>
        {side === "ask" ? (
          <>
            <td className="w-40">
              <div
                className={`absolute top-0 bottom-0 ${bgColor} opacity-20`}
                style={{
                  width: `${percentage}%`,
                  right: 0,
                }}></div>
            </td>
            <td className="px-6 py-2">{order.size}</td>
            <td className={`px-6 py-2 ${textColor}`}>${order.price}</td>
          </>
        ) : (
          <>
            <td className={`px-6 py-2 ${textColor}`}>${order.price}</td>
            <td className="px-6 py-2">{order.size}</td>
            <td className="w-40">
              <div
                className={`absolute top-0 bottom-0 ${bgColor} opacity-20`}
                style={{
                  width: `${percentage}%`,
                  left: 0,
                }}></div>
            </td>
          </>
        )}
      </tr>
    );
  };

  if (loading)
    return <div className="text-center py-4">Loading order book...</div>;

  return (
    <div className="flex flex-col px-6 pt-2">
      <p className="text-xl font-bold text-center">Depth</p>
      <div className="flex justify-center items-start w-full h-[60vh] overflow-y-auto">
        {/* Sell Orders (Asks) */}
        <table className="">
          <thead>
            <tr className="text-xs text-gray-700 uppercase bg-gray-50">
              <th className="w-32"></th>
              <th className="px-6 py-3">Size</th>
              <th className="px-6 py-3">Sell (Ask)</th>
            </tr>
          </thead>
          <tbody>
            {orderBook?.asks
              .slice(0, 10)
              .map((ask) => renderOrderRow(ask, "ask")) || (
              <tr>
                <td colSpan={3} className="text-center py-2">
                  No ask orders available
                </td>
              </tr>
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
            {orderBook?.bids
              .slice(0, 10)
              .map((bid) => renderOrderRow(bid, "bid")) || (
              <tr>
                <td colSpan={3} className="text-center py-2">
                  No bid orders available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Depth;
