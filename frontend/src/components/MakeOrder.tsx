// Required shadcn/ui components: card, tabs, button, input, label
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

const MakeOrder = ({ userId }: { userId: string }) => {
  const [side, setSide] = useState<"bid" | "ask">("bid");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/trade/makeorder", {
        side,
        price: Number(price),
        quantity: Number(quantity),
        userId: Number(userId),
      });
      if (res.data.ok) {
        toast.success("Order submitted successfully!");
        setPrice("");
        setQuantity("");
      } else {
        toast.info(res.data.msg);
      }
    } catch (error) {
      toast.warning("Network busy.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl bg-card text-card-foreground border border-border rounded-xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">
          Make Order
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          value={side}
          onValueChange={(v: string) => setSide(v as "bid" | "ask")}
          className="mb-4">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger
              value="bid"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-l-md">
              BUY (Bid)
            </TabsTrigger>
            <TabsTrigger
              value="ask"
              className="data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground rounded-r-md">
              SELL (Ask)
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="any"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price"
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="0"
              step="any"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity"
              required
              className="mt-1"
            />
          </div>
          <Button
            type="submit"
            className={`w-full font-bold py-2 mt-2 ${
              side === "bid"
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-destructive text-destructive-foreground hover:bg-destructive/90"
            }`}
            disabled={loading || !price || !quantity}>
            {loading
              ? "Placing Order..."
              : side === "bid"
                ? "Place Buy Order"
                : "Place Sell Order"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MakeOrder;
