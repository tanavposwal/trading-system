import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

const MakeOrder = ({ userId }: { userId: string }) => {
  const [formData, setFormData] = useState({
    side: "bid",
    price: "",
    quantity: "",
    userId,
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log("fetch", userId);
    try {
      const res = await axios.post("http://localhost:3000/trade/makeorder", {
        side: formData.side,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        userId: Number(userId),
      });
      console.log("fetch");
      if (res.data.ok) {
        toast.success("Order submitted successfully!");
        setFormData({ side: "bid", price: "", quantity: "", userId: "" });
      } else {
        toast.info(res.data.msg);
      }
    } catch (error) {
      toast.warning("Network busy.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2 w-full border rounded-xl pb-5 pt-2">
      <p className="text-xl font-bold my-3">Make order</p>
      <form onSubmit={handleSubmit} className="px-6 w-full flex flex-col gap-3">
        <div>
          <label className="block mb-1 font-semibold text-xs">Price:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            className="w-full px-3 py-1 border rounded-md focus:border-black transition-colors outline-hidden shadow-xs"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold text-xs">Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={(e) =>
              setFormData({ ...formData, quantity: e.target.value })
            }
            className="w-full px-3 py-1 border rounded-md focus:border-black transition-colors outline-hidden shadow-xs"
            required
          />
        </div>
        <div className="w-full flex gap-3 mt-1">
          <button
            className="flex flex-1 bg-green-500 items-center justify-center py-2 rounded-md text-white font-bold hover:bg-green-600 transition-transform shadow-xs cursor-pointer"
            onClick={() => (formData.side = "bid")}>
            BUY (bid)
          </button>
          <button
            className="flex flex-1 bg-red-500 items-center justify-center py-2 rounded-md text-white font-bold hover:bg-red-600 transition-transform shadow-xs cursor-pointer"
            onClick={() => (formData.side = "ask")}>
            SELL (ask)
          </button>
        </div>
      </form>
    </div>
  );
};
export default MakeOrder;
