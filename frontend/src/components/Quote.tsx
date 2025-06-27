import axios from "axios";
import { RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";

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
    <div className="flex gap-2 items-center justify-center">
      <p className="text-lg font-bold font-mono tracking-tight">
        Market Price: {price}
      </p>
      <Button
        variant="ghost"
        size="icon"
        onClick={fetchQuote}
        aria-label="Refresh quote">
        <RefreshCcw className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default Quote;
