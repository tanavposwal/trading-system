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
    <Card className="w-full max-w-xs mx-auto mb-4 bg-card text-card-foreground shadow-md">
      <CardContent className="flex items-center justify-center gap-2 py-4">
        <p className="text-2xl font-bold font-mono tracking-tight">{price}</p>
        <Button
          variant="ghost"
          size="icon"
          onClick={fetchQuote}
          aria-label="Refresh quote">
          <RefreshCcw className="w-5 h-5" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default Quote;
