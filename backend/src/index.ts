import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import WebSocket from "ws";
import http from "http";
import { Order, Orderbook, User, UserOrder } from "./types";
import tradeRoutes from "./routes/trade";
import authRoutes from "./routes/auth";

export const app = express();
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/trade", tradeRoutes);
app.use("/auth", authRoutes);

export const orderbook: Orderbook = {
  asks: [],
  bids: [],
};

export const users: User[] = [
  {
    id: "1",
    name: "user1",
    balances: {
      cash: 1000,
      stock: 15,
    },
  },
  {
    id: "2",
    name: "user2",
    balances: {
      cash: 1000,
      stock: 7,
    },
  },
  {
    id: "3",
    name: "user3",
    balances: {
      cash: 1000,
      stock: 10,
    },
  },
];
export const bids: Order[] = [];
export const asks: Order[] = [];

app.get("/users", (req: Request, res: Response) => {
  res.json(users);
});

app.get("/quote", (req: Request, res: Response) => {
  if (orderbook.asks.length != 0 && orderbook.bids.length != 0) {
    res.send(
      JSON.stringify({
        ok: true,
        data: (orderbook.asks[0].price + orderbook.bids[0].price) / 2,
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
});

app.get("/orderbook", (req: Request, res: Response) => {
  res.json({
    ok: true,
    data: orderbook,
  });
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("Client connected via WebSocket");
});

// Broadcast orderbook to all clients every second
export function sendOrderbook() {
  const message = JSON.stringify({ type: "orderbook", data: orderbook });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

server.listen(3000, () =>
  console.log(`listening on port http://localhost:3000/`)
);
