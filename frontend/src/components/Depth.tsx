import { useEffect, useMemo, useState } from "react";
import { Orderbook, AnonyOrder } from "../types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";

const Depth = () => {
  const [orderBook, setOrderBook] = useState<Orderbook | null>(null);

  useEffect(() => {
    let ws: WebSocket;

    const connectToWebSocket = () => {
      ws = new WebSocket("ws://localhost:3000");

      ws.onopen = () => {
        // console.log("Listening Orderbook");
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.type === "orderbook") {
            setOrderBook(message.data);
          }
        } catch (error) {
          // console.error("Error parsing message:", error);
        }
      };

      ws.onerror = (error) => {
        // console.error("WebSocket error:", error);
      };
    };

    const fetchOrderbook = async () => {
      try {
        const res = await fetch("http://localhost:3000/orderbook");
        const data = await res.json();
        if (data.ok) {
          setOrderBook(data.data);
        }
      } catch (error) {
        // console.error("Failed to fetch order book", error);
      }
      connectToWebSocket();
    };

    fetchOrderbook();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

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
    const bgColor = side === "ask" ? "bg-destructive" : "bg-green-600";
    const barSide = side === "ask" ? "right-0" : "left-0";
    const textColor = side === "ask" ? "text-destructive" : "text-green-400";
    const barOpacity = "opacity-20";
    const rowBg = side === "ask" ? "bg-destructive/5" : "bg-green-900/10";

    return (
      <tr
        key={order.price}
        className={`relative font-semibold text-sm ${rowBg} border-b border-border`}>
        {side === "ask" ? (
          <>
            <td className="w-32 relative p-0">
              <div
                className={`absolute top-0 bottom-0 ${bgColor} ${barOpacity} ${barSide} h-full rounded-l-md`}
                style={{ width: `${percentage}%` }}></div>
            </td>
            <td className="px-4 py-2 relative z-10">{order.size}</td>
            <td className={`px-4 py-2 relative z-10 ${textColor}`}>
              ${order.price}
            </td>
          </>
        ) : (
          <>
            <td className={`px-4 py-2 relative z-10 ${textColor}`}>
              ${order.price}
            </td>
            <td className="px-4 py-2 relative z-10">{order.size}</td>
            <td className="w-32 relative p-0">
              <div
                className={`absolute top-0 bottom-0 ${bgColor} ${barOpacity} ${barSide} h-full rounded-r-md`}
                style={{ width: `${percentage}%` }}></div>
            </td>
          </>
        )}
      </tr>
    );
  };

  return (
    <Card className="w-full h-full shadow-xl bg-card text-card-foreground">
      <CardHeader className="pb-2 border-b border-border">
        <CardTitle className="text-xl font-bold text-center">Depth</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center px-2 pt-2">
        <div className="flex flex-row gap-8 w-full justify-center items-start h-[60vh] overflow-y-auto">
          {/* Sell Orders (Asks) */}
          <table className="min-w-[260px] text-sm rounded-lg overflow-hidden">
            <thead>
              <tr className="text-xs uppercase bg-muted text-muted-foreground">
                <th className="w-32"></th>
                <th className="px-4 py-2">Size</th>
                <th className="px-4 py-2">Sell (Ask)</th>
              </tr>
            </thead>
            <tbody>
              {orderBook?.asks?.length ? (
                orderBook.asks
                  .slice(0, 10)
                  .map((ask) => renderOrderRow(ask, "ask"))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="text-center py-2 text-muted-foreground">
                    No ask orders available
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Buy Orders (Bids) */}
          <table className="min-w-[260px] text-sm rounded-lg overflow-hidden">
            <thead>
              <tr className="text-xs uppercase bg-muted text-muted-foreground">
                <th className="px-4 py-2">Buy (Bid)</th>
                <th className="px-4 py-2">Size</th>
                <th className="w-32"></th>
              </tr>
            </thead>
            <tbody>
              {orderBook?.bids?.length ? (
                orderBook.bids
                  .slice(0, 10)
                  .map((bid) => renderOrderRow(bid, "bid"))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="text-center py-2 text-muted-foreground">
                    No bid orders available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default Depth;
