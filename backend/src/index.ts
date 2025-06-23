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

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  // console.log("Client connected via WebSocket");
  ws.send("Welcome from FYNC exchange!");

  ws.on("message", (message) => {
    try {
      const msg = JSON.parse(message.toString());
      console.log("Received:", msg);
      if (msg.type === "connect:orderbook") {
        // Handle orderbook connection
        ws.send(JSON.stringify({ type: "orderbook", data: orderbook }));
      } else if (msg.type === "connect:quote") {
        // Handle quote connection
        if (orderbook.asks.length != 0 && orderbook.bids.length != 0) {
          ws.send(
            JSON.stringify({
              type: "quote",
              data: (orderbook.asks[0].price + orderbook.bids[0].price) / 2,
            })
          );
        } else {
          ws.send(
            JSON.stringify({
              type: "quote",
              data: "Trade not started!",
            })
          );
        }
      }
    } catch (err) {
      console.log(err);
      ws.send(JSON.stringify({ type: "error", message: "Invalid JSON" }));
    }
  });
});

server.listen(3000, () =>
  console.log(`listening on port http://localhost:3000/`)
);
