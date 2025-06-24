import { Router, Request, Response } from "express";
import { Order, User, UserOrder } from "../types";
import { users, redisClient, sendOrderbook } from "../index";

const router = Router();

router.get("/echo", (req: Request, res: Response) => {
  res.json({
    ok: true,
    msg: "echo success",
  });
});

// Place a limit order
router.post("/makeorder", async (req: Request, res: Response) => {
  const { side, price, quantity, userId }: UserOrder = req.body;
  // check for enough balance
  const user = users.find((us) => us.id == userId);
  if (side == "bid") {
    if (!user || user.balances.cash < price * quantity) {
      res.json({
        ok: false,
        msg: `⚠️ Not enough cash.`,
      });
      return;
    }
  } else {
    if (!user || user.balances.stock < quantity) {
      res.json({
        ok: false,
        msg: `⚠️ Not enough quantity.`,
      });
      return;
    }
  }

  // settle order and return remainQuantity which is not settled
  const remainingQty = await fillOrders(side, price, quantity, userId);
  if (remainingQty === 0) {
    res.json({
      ok: true,
      msg: `All quantity of ${quantity} is filled.`,
    });
    sendOrderbook();
    return;
  }

  // Add remaining order to Redis orderbook
  const order = { userId, price, quantity: remainingQty };
  const key = side === "bid" ? "orderbook:bids" : "orderbook:asks";
  await redisClient.rPush(key, JSON.stringify(order));

  sendOrderbook();
  res.json({
    ok: true,
    msg: `${
      quantity - remainingQty
    } filled. ${remainingQty} placed in orderbook.`,
  });
});

// it is just an orderbook (deprecated, use /orderbook endpoint instead)
router.get("/depth", async (req: Request, res: Response) => {
  const asks = await redisClient.lRange("orderbook:asks", 0, -1);
  const bids = await redisClient.lRange("orderbook:bids", 0, -1);
  res.json({
    orderbook: {
      asks: asks.map((a: any) => JSON.parse(a)),
      bids: bids.map((b: any) => JSON.parse(b)),
    },
  });
});

async function fillOrders(
  side: string,
  price: number,
  quantity: number,
  userId: string
): Promise<number> {
  let remainingQuantity = quantity;
  if (side === "bid") {
    // Match against asks
    let asks = (await redisClient.lRange("orderbook:asks", 0, -1)).map(
      (a: any) => JSON.parse(a)
    );
    for (let i = asks.length - 1; i >= 0; i--) {
      if (asks[i].userId === userId) continue;
      if (asks[i].price <= price) {
        if (asks[i].quantity > remainingQuantity) {
          asks[i].quantity -= remainingQuantity;
          flipBalance(asks[i].userId, userId, remainingQuantity, asks[i].price);
          // Update ask in Redis
          await redisClient.lSet("orderbook:asks", i, JSON.stringify(asks[i]));
          return 0;
        } else {
          remainingQuantity -= asks[i].quantity;
          flipBalance(asks[i].userId, userId, asks[i].quantity, asks[i].price);
          // Remove ask from Redis
          await redisClient.lRem("orderbook:asks", 1, JSON.stringify(asks[i]));
        }
      }
    }
  } else {
    // Match against bids
    let bids = (await redisClient.lRange("orderbook:bids", 0, -1)).map(
      (b: any) => JSON.parse(b)
    );
    for (let i = bids.length - 1; i >= 0; i--) {
      if (bids[i].userId === userId) continue;
      if (bids[i].price >= price) {
        if (bids[i].quantity > remainingQuantity) {
          bids[i].quantity -= remainingQuantity;
          flipBalance(userId, bids[i].userId, remainingQuantity, bids[i].price);
          // Update bid in Redis
          await redisClient.lSet("orderbook:bids", i, JSON.stringify(bids[i]));
          return 0;
        } else {
          remainingQuantity -= bids[i].quantity;
          flipBalance(userId, bids[i].userId, bids[i].quantity, bids[i].price);
          // Remove bid from Redis
          await redisClient.lRem("orderbook:bids", 1, JSON.stringify(bids[i]));
        }
      }
    }
  }
  return remainingQuantity;
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

export default router;
