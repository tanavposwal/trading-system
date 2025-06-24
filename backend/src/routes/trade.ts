import { Router, Request, Response } from "express";
import { Order, Orderbook, User, UserOrder } from "../types";
import { orderbook, users, bids, asks, sendOrderbook } from "../index";

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
    if (user == null || user.balances.cash < price * quantity) {
      res.json({
        ok: false,
        msg: `⚠️ Not enough cash.`,
      });
      return;
    }
  } else {
    const user = users.find((us) => us.id == userId);
    if (!user || user!.balances.stock < quantity) {
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
    updateOrderbook();
    res.json({
      ok: true,
      msg: `All quantity of ${quantity} is filled.`,
    });
    return;
  }

  if (side === "bid") {
    bids.push({
      userId,
      price,
      quantity: remainingQty,
    });
    bids.sort((a, b) => b.price - a.price);
  } else {
    asks.push({
      userId,
      price,
      quantity: remainingQty,
    });
    asks.sort((a, b) => a.price - b.price);
  }

  updateOrderbook();
  sendOrderbook();

  res.json({
    ok: true,
    msg: `${
      quantity - remainingQty
    } filled. ${remainingQty} placed in orderbook.`,
  });
});

// it is just an orderbook
router.get("/depth", (req: Request, res: Response) => {
  updateOrderbook();
  res.json({
    orderbook,
  });
});

function updateOrderbook() {
  orderbook.bids = [];
  orderbook.asks = [];

  for (let j = 0; j < bids.length; j++) {
    if (bids[j].quantity === 0) continue;
    const existingItemIndex = orderbook.bids.findIndex(
      (item) => item.price === bids[j].price
    );

    if (existingItemIndex !== -1) {
      orderbook.bids[existingItemIndex].size += bids[j].quantity;
    } else {
      orderbook.bids.push({
        price: bids[j].price,
        size: bids[j].quantity,
      });
    }
  }
  for (let j = 0; j < asks.length; j++) {
    if (asks[j].quantity === 0) continue;
    const existingItemIndex = orderbook.asks.findIndex(
      (item) => item.price === asks[j].price
    );

    if (existingItemIndex !== -1) {
      orderbook.asks[existingItemIndex].size += asks[j].quantity;
    } else {
      orderbook.asks.push({
        price: asks[j].price,
        size: asks[j].quantity,
      });
    }
  }

  orderbook.asks.sort((a, b) => a.price - b.price);
  orderbook.bids.sort((a, b) => b.price - a.price);
}

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
      if (asks[i].userId === userId) continue;
      if (asks[i].price <= price) {
        if (asks[i].quantity > remainingQuantity) {
          asks[i].quantity -= remainingQuantity;
          flipBalance(asks[i].userId, userId, remainingQuantity, asks[i].price);
          return 0;
        } else {
          remainingQuantity -= asks[i].quantity;
          flipBalance(asks[i].userId, userId, asks[i].quantity, asks[i].price);
          asks.splice(i, 1);
        }
      }
    }
  } else {
    // sells
    for (let i = bids.length - 1; i >= 0; i--) {
      if (bids[i].userId === userId) continue;
      if (bids[i].price >= price) {
        if (bids[i].quantity > remainingQuantity) {
          bids[i].quantity -= remainingQuantity;
          flipBalance(userId, bids[i].userId, remainingQuantity, bids[i].price);
          return 0;
        } else {
          remainingQuantity -= bids[i].quantity;
          flipBalance(userId, bids[i].userId, bids[i].quantity, bids[i].price);
          bids.splice(i, 1);
        }
      }
    }
  }

  return remainingQuantity;
}

export default router;
