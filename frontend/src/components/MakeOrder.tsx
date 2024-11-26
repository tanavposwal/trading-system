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
      try {
        const res = await axios.post('http://localhost:3000/api/makeorder', {
          side: formData.side,
          price: Number(formData.price),
          quantity: Number(formData.quantity),
          userId: formData.userId,
        });
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
      <div className="flex flex-col items-center justify-center gap-3 w-full">
        <p className="text-xl font-bold">Make order</p>
        <form onSubmit={handleSubmit} className="space-y-2 rounded-lg p-3">
          <div>
            <label className="block mb-1 font-semibold text-xs">Side:</label>
            <select
              name="side"
              value={formData.side}
              onChange={(e) => setFormData({...formData, side: e.target.value})}
              className="w-full p-1 border rounded"
            >
              <option value="bid">Bid</option>
              <option value="ask">Ask</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-semibold text-xs">Price:</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              className="w-full px-2 py-1 border rounded"
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
              className="w-full px-2 py-1 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-xs">User ID:</label>
            <input
              type="text"
              name="userId"
              value={formData.userId}
              onChange={(e) => setFormData({...formData, userId: e.target.value})}
              className="w-full px-2 py-1 border rounded"
              required
            />
          </div>
          <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Submit Order
          </button>
        </form>
        {message && (
          <div>{message}</div>
        )}
      </div>
    );
  };
export default MakeOrder;
