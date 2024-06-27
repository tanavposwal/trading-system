import { useEffect, useState } from "react";
import { Orderbook } from "../types";
import axios from "axios";

const Depth = () => {
  const [OrderBook, setOrderBook] = useState<Orderbook>();

  useEffect(() => {
    axios.get("http://localhost:3000/depth").then((res) => {
      setOrderBook(res.data.orderbook);
    });
  });

  return (
    <div className="m-5 flex flex-col items-center justify-center gap-3">
      <p className="text-3xl font-bold">Depth</p>
      <div className="flex border w-fit">
      <table>
       <tr>
        <th className="px-4 py-2">Ask Size</th>
        <th className="px-4 py-2">Ask Price</th>
       </tr>
      {OrderBook?.asks.map(item => (
        <tr>
          <td className="text-center">{item.size}</td>
          <td className="text-red-700 text-center">${item.price}</td>
        </tr>
      ))}
      </table>
      <table>
        <tr>
          <th className="px-4 py-2">Bid Price</th>
          <th className="px-4 py-2">Bid Size</th>
        </tr>
      {OrderBook?.bids.map(item => (
        <tr>
        <td className="text-green-700 text-center">${item.price}</td>
        <td className="text-center">{item.size}</td>
      </tr>
      ))}
      </table>
      </div>
    </div>
  );
};

export default Depth;
