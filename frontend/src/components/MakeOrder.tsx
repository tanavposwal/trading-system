import axios from "axios";
import { useState } from "react";

const MakeOrder = () => {
    const [formData, setFormData] = useState({
      side: 'bid',
      price: '',
      quantity: '',
      userId: ''
    });
    const [message, setMessage] = useState('');
  
    const handleSubmit = async (e: any) => {
      e.preventDefault();
      console.log("fetch")
      try {
        const res = await axios.post('http://localhost:3000/api/makeorder', {
          side: formData.side,
          price: Number(formData.price),
          quantity: Number(formData.quantity),
          userId: formData.userId,
        });
        console.log("fetch")
        if (res.data.ok) {
          setMessage('Order submitted successfully!');
          setFormData({ side: 'bid', price: '', quantity: '', userId: '' });
        } else {
          setMessage(res.data.msg)
        }
      } catch (error) {
        setMessage('Failed to submit order. Please try again.');
      }
    };
  
    return (
      <div className="flex flex-col items-center justify-center gap-2 w-full border-l border-r pb-5 pt-2">
        <p className="text-xl font-bold">Make order</p>
        <form onSubmit={handleSubmit} className="px-6 w-full flex flex-col gap-3">
          <div className="w-full flex gap-3">
          <div>
            <label className="block mb-1 font-semibold text-xs">Price:</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              className="w-full px-3 py-1 border rounded-md focus:border-black transition-colors outline-none shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-xs">Quantity:</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={(e) => setFormData({...formData, quantity: e.target.value})}
              className="w-full px-3 py-1 border rounded-md focus:border-black transition-colors outline-none shadow-sm"
              required
            />
          </div>
          </div>
          <div>
            <label className="block mb-1 font-semibold text-xs">User ID:</label>
            <input
              type="text"
              name="userId"
              value={formData.userId}
              onChange={(e) => setFormData({...formData, userId: e.target.value})}
              className="w-full px-3 py-1 border rounded-md focus:border-black transition-colors outline-none shadow-sm"
              required
            />
          </div>
          <div className="w-full flex gap-3 mt-1">
            <button className="flex flex-1 bg-green-500 items-center justify-center py-2 rounded-md text-white font-bold hover:scale-95 transition-transform shadow-sm">BID</button>
            <button className="flex flex-1 bg-red-500 items-center justify-center py-2 rounded-md text-white font-bold hover:scale-95 transition-transform shadow-sm">ASK</button>
          </div>
        </form>
        {message && (
          <div>{message}</div>
        )}
      </div>
    );
  };
export default MakeOrder;
