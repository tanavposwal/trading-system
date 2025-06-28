import http from "http";
import cors from "cors";
import WebSocket from "ws";
import dotenv from "dotenv";
import { createClient } from "redis";
import bodyParser from "body-parser";
import authRoutes from "./routes/auth";
import tradeRoutes from "./routes/trade";
import express, { Request, Response } from "express";
import { db } from "./db";
import { users } from "./schema";
import { eq } from "drizzle-orm";
import auth from "./middlware/jwt";

dotenv.config();
export const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/trade", tradeRoutes);
app.use("/auth", authRoutes);

export const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient
  .connect()
  .then(() => {
    console.log("Connected to Redis");
  })
  .catch((err: unknown) => {
    console.error("Redis connection error:", err);
  });

app.get("/users", async (req: Request, res: Response) => {
  const data = await db.select().from(users);
  res.json(data);
});

app.get("/user/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const row = await db
    .select()
    .from(users)
    .where(eq(users.id, Number(id)));
  const user = row[0];
  res.json(user);
});

app.get("/me", auth, async (req: Request, res: Response) => {
  const { email } = req.body;
  const row = await db.select().from(users).where(eq(users.email, email));
  const user = row[0];
  res.json(user);
});

app.get("/quote", async (req: Request, res: Response) => {
  try {
    const asks = await redisClient.lRange("orderbook:asks", 0, -1);
    const bids = await redisClient.lRange("orderbook:bids", 0, -1);
    if (asks.length !== 0 && bids.length !== 0) {
      const bestAsk = JSON.parse(asks[0]);
      const bestBid = JSON.parse(bids[0]);
      res.send(
        JSON.stringify({
          ok: true,
          data: (bestAsk.price + bestBid.price) / 2,
        })
      );
    } else {
      res.send(
        JSON.stringify({
          ok: false,
          data: "Trade not started!",
        })
      );
    }
  } catch (err: any) {
    res
      .status(500)
      .json({ ok: false, error: "Failed to fetch quote from Redis" });
  }
});

app.get("/orderbook", async (req: Request, res: Response) => {
  try {
    const asks = await redisClient.lRange("orderbook:asks", 0, -1);
    const bids = await redisClient.lRange("orderbook:bids", 0, -1);
    res.json({
      ok: true,
      data: {
        asks: asks.map((a) => JSON.parse(a)),
        bids: bids.map((b) => JSON.parse(b)),
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ ok: false, error: "Failed to fetch orderbook from Redis" });
  }
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("Client connected via WebSocket");
});

// Broadcast orderbook to all clients every second
export async function sendOrderbook() {
  try {
    const asks = await redisClient.lRange("orderbook:asks", 0, -1);
    const bids = await redisClient.lRange("orderbook:bids", 0, -1);
    const message = JSON.stringify({
      type: "orderbook",
      data: {
        asks: asks.map((a) => JSON.parse(a)),
        bids: bids.map((b) => JSON.parse(b)),
      },
    });
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  } catch (err: any) {
    console.error("Failed to broadcast orderbook from Redis", err);
  }
}

server.listen(3000, () =>
  console.log(`listening on port http://localhost:3000/`)
);
