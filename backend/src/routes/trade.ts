import { Router, Request, Response } from "express";
import { Order, Orderbook, User, UserOrder } from "../types";
import { orderbook, users, bids, asks } from "../index";

const router = Router();

router.get("/echo", (req: Request, res: Response) => {
  res.json({
    ok: true,
    msg: "echo success",
  });
});

// Place a limit order
router.post("/makeorder", (req: Request, res: Response) => {
  const { side, price, quantity, userId }: UserOrder = req.body;
  // check for enough balance
  if (side == "bid") {
    const user = users.find((us) => us.id == userId);
    if (user == null || user.balances.cash < price) {
      res.json({
        ok: false,
        msg: `⚠️ Not enough cash.`,
      });
      return;
    }
  } else {
    const user = users.find((us) => us.id == userId);
    if (user == null || user.balances.stock < quantity) {
      res.json({
        ok: false,
        msg: `⚠️ Not enough quantity.`,
      });
      return;
    }
  }

  // settle order and return remainQuantity which is not settled
  const remainingQty = fillOrders(side, price, quantity, userId);
  if (remainingQty === 0) {
    res.json({
      ok: true,
      msg: `number of quantity filled with orderbook are ${quantity}.`,
    });
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
});

// it is just an orderbook
router.get("/depth", (req: Request, res: Response) => {
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

function flipBalance(
  userId1: string,
  userId2: string,
  quantity: number,
  price: number
) {
  let u1 = users.find((x) => x.id === userId1);
  let u2 = users.find((x) => x.id === userId2);
  if (!u1 || !u2) return;
  u1.balances.stock -= quantity;
  u2.balances.stock += quantity;
  u1.balances.cash += quantity * price;
  u2.balances.cash -= quantity * price;
}

function fillOrders(
  side: string,
  price: number,
  quantity: number,
  userId: string
): number {
  let remainingQuantity = quantity;

  if (side === "bid") {
    // buys
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
    // sells
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

export default router;
