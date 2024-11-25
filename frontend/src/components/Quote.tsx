import axios from "axios";
import { useEffect, useState } from "react";

const Quote = () => {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3000/quote").then((res) => {
      if (res.data.ok) {
        setMsg(res.data.GOOGLE);
      } else {
        setMsg(res.data.msg);
      }
    });
  });

  return (
    <div className="m-5 flex items-center justify-center gap-3 border rounded-lg shadow p-1">
      <h1 className="text-md font-bold">Quote</h1>
      <div className="flex items-center justify-center gap-2">
      <p className="text-xl font-semibold">${msg}</p>
      <button
      className="hover:bg-black/5 px-3 py-2 rounded-lg transition-colors text-sm"
        onClick={() => {
          axios.get("http://localhost:3000/quote").then((res) => {
            if (res.data.ok) {
              setMsg(res.data.GOOGLE);
            } else {
              setMsg(res.data.msg);
            }
          });
        }}
      >
        Refresh
      </button>
      </div>
    </div>
  );
};

export default Quote;
