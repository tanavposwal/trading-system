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
    <div className="card">
      Quote
      <p>{msg}</p>
      <button
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
  );
};

export default Quote;
