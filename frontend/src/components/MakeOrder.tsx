import axios from "axios";
import { useEffect, useState } from "react";

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
        await axios.post('http://localhost:3000/order', {
          ...formData,
          price: Number(formData.price),
          quantity: Number(formData.quantity),
        });
        setMessage('Order submitted successfully!');
        setFormData({ side: 'bid', price: '', quantity: '', userId: '' });
      } catch (error) {
        setMessage('Failed to submit order. Please try again.');
      }
    };
  
    return (
      <div className="m-5 flex flex-col items-center justify-center gap-3">
        <p className="text-3xl font-bold">Make order</p>
        <form onSubmit={handleSubmit} className="space-y-4 border rounded-lg p-3">
          <div>
            <label className="block mb-1">Side:</label>
            <select
              name="side"
              value={formData.side}
              onChange={(e) => setFormData({...formData, side: e.target.value})}
              className="w-full p-2 border rounded"
            >
              <option value="bid">Bid</option>
              <option value="ask">Ask</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Price:</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Quantity:</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={(e) => setFormData({...formData, quantity: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">User ID:</label>
            <input
              type="text"
              name="userId"
              value={formData.userId}
              onChange={(e) => setFormData({...formData, userId: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
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
