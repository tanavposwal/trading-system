import axios from "axios";
import { RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";

const Quote = () => {
  const [price, setPrice] = useState<any>();

  function fetchQuote() {
    axios.get("http://localhost:3000/quote").then((res) => {
      if (res.data.ok) {
        setPrice(res.data.data);
      } else {
        setPrice("⚠️");
      }
    });
  }

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <div className=" flex items-center justify-center gap-1 pb-5 text-gray-600">
      <p className="text-xl font-semibold">{price}</p>
      <button
        onClick={() => fetchQuote()}
        className="cursor-pointer hover:opacity-70 ml-2">
        <RefreshCcw className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Quote;
