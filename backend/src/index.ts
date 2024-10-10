import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors"

export const app = express();
app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

interface Balances {
  [key: string]: number;
}

interface User {
  id: string;
  name: string;
  balances: Balances;
}

interface Order {
  userId: string;
  price: number;
  quantity: number;
}

interface AnonyOrder {
  price: number;
  size: number;
}

// only google
export const TICKER = "GOOGLE";

interface orderbook {
  asks: AnonyOrder[];
  bids: AnonyOrder[];
}

let orderbook: orderbook = {
  asks: [],
  bids: [],
};

const users: User[] = [
  {
    id: "1",
    name: "Jack Spparow",
    balances: {
      GOOGLE: 5,
      USD: 50000,
    },
  },
  {
    id: "2",
    name: "Harry Potter",
    balances: {
      GOOGLE: 10,
      USD: 50000,
    },
  },
  {
    id: "3",
    name: "Tony Stark",
    balances: {
      GOOGLE: 15,
      USD: 50000,
    },
  },
];

const bids: Order[] = [];
const asks: Order[] = [];

// Place a limit order
app.post("/order", (req: Request, res: Response) => {
  const side: "bid" | "ask" = req.body.side;
  const price: number = req.body.price;
  const quantity: number = req.body.quantity;
  const userId: string = req.body.userId;

  // settle order and return remainQuantity which is not settled
  const remainingQty = fillOrders(side, price, quantity, userId);

  if (remainingQty === 0) {
    res.json({
      msg: `number of quantity filled with orderbook are ${quantity}.`,
    });
    return;
  }

  if (side === "bid") {
    bids.push({
      userId,
      price,
      quantity: remainingQty,
    });
    bids.sort((a, b) => (a.price < b.price ? -1 : 1));
  } else {
    asks.push({
      userId,
      price,
      quantity: remainingQty,
    });
    asks.sort((a, b) => (a.price < b.price ? 1 : -1));
  }

  res.json({
    msg: `number of quantity filled with orderbook are ${
      quantity - remainingQty
    }, numeber of quantity marked in orderbook are ${remainingQty}`,
  });
});

// it is just an orderbook
app.get("/depth", (req: Request, res: Response) => {
  orderbook.bids = [];
  orderbook.asks = [];

  for (let j = 0; j < bids.length; j++) {
    const existingItemIndex = orderbook.bids.findIndex(
      (item) => item.price === bids[j].price
    );

    if (existingItemIndex !== -1) {
      orderbook.bids[existingItemIndex].size += bids[j].quantity;
    } else {
      // If the item doesn't exist, add it to the list
      orderbook.bids.push({
        price: bids[j].price,
        size: bids[j].quantity,
      });
    }
  }
  for (let j = 0; j < asks.length; j++) {
    const existingItemIndex = orderbook.asks.findIndex(
      (item) => item.price === asks[j].price
    );

    if (existingItemIndex !== -1) {
      orderbook.asks[existingItemIndex].size += asks[j].quantity;
    } else {
      // If the item doesn't exist, add it to the list
      orderbook.asks.push({
        price: asks[j].price,
        size: asks[j].quantity,
      });
    }
  }

  orderbook.asks.sort((a, b) => (a.price > b.price ? -1 : 1));
  orderbook.bids.sort((a, b) => (a.price > b.price ? -1 : 1));

  res.json({
    orderbook,
  });
});

app.get("/users", (req: Request, res: Response) => {
  res.json(users)
})

app.get("/balance/:userId", (req: Request, res: Response) => {
  const userId = req.params.userId;
  const user = users.find((x) => x.id === userId);
  if (!user) {
    return res.json({
      USD: 0,
      [TICKER]: 0,
    });
  }
  res.json({ balances: user.balances });
});

app.get("/quote", (req: Request, res: Response) => {
  // TODO: Assignment
  if (orderbook.asks.length != 0 && orderbook.bids.length != 0) {
    res.json({
      ok: true,
      [TICKER]: (orderbook.asks[0].price + orderbook.bids[0].price) / 2,
    });
  } else {
    res.json({
      ok: false,
      msg: "trade not started",
    });
  }
});

app.listen(3000, () => console.log("listening on port http://localhost:3000/"));

function flipBalance(
  userId1: string,
  userId2: string,
  quantity: number,
  price: number
) {
  let user1 = users.find((x) => x.id === userId1);
  let user2 = users.find((x) => x.id === userId2);
  if (!user1 || !user2) {
    return;
  }
  user1.balances[TICKER] -= quantity;
  user2.balances[TICKER] += quantity;
  user1.balances["USD"] += quantity * price;
  user2.balances["USD"] -= quantity * price;
}

function fillOrders(
  side: string,
  price: number,
  quantity: number,
  userId: string
): number {
  let remainingQuantity = quantity;

  if (side === "bid") {
    // iterate over asks
    for (let i = asks.length - 1; i >= 0; i--) {
      if (asks[i].price <= price) {
        if (asks[i].quantity > remainingQuantity) {
          asks[i].quantity -= remainingQuantity;
          flipBalance(asks[i].userId, userId, remainingQuantity, asks[i].price);
          return 0;
        } else {
          remainingQuantity -= asks[i].quantity;
          flipBalance(asks[i].userId, userId, asks[i].quantity, asks[i].price);
          asks.pop();
        }
      }
    }
  } else {
    for (let i = bids.length - 1; i >= 0; i--) {
      if (bids[i].price >= price) {
        if (bids[i].quantity > remainingQuantity) {
          bids[i].quantity -= remainingQuantity;
          flipBalance(userId, bids[i].userId, remainingQuantity, price);
          return 0;
        } else {
          remainingQuantity -= bids[i].quantity;
          flipBalance(userId, bids[i].userId, bids[i].quantity, price);
          bids.pop();
        }
      }
    }
  }

  return remainingQuantity;
}
