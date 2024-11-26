import axios from "axios";
import { useEffect, useState } from "react";

const Quote = () => {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    function fetchUsers() {
      axios.get("http://localhost:3000/api/quote").then((res) => {
        if (res.data.ok) {
          setMsg(res.data.stock);
        } else {
          setMsg(res.data.msg);
        }
      });
    }

    fetchUsers();
    const interval = setInterval(fetchUsers, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="m-5 flex items-center justify-center gap-3 border rounded-lg shadow p-1">
      <h1 className="text-md font-bold">Quote</h1>
      <div className="flex items-center justify-center gap-2">
      <p className="text-xl font-semibold">${msg}</p>
      </div>
    </div>
  );
};

export default Quote;
