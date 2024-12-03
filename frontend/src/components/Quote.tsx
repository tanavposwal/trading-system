import axios from "axios";
import { useEffect, useState } from "react";

const Quote = () => {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    function fetchQuote() {
      axios.get("http://localhost:3000/api/quote").then((res) => {
        if (res.data.ok) {
          setMsg("$"+res.data.stock);
        } else {
          setMsg(res.data.msg);
        }
      });
    }

    fetchQuote();
    const interval = setInterval(fetchQuote, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className=" flex items-center justify-center gap-1 pb-5 text-gray-600">
      <h1 className="text-md font-bold">Quote:</h1>
      <p className="text-xl font-semibold">{msg}</p>
    </div>
  );
};

export default Quote;
