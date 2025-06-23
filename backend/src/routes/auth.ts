import { Router, Request, Response } from "express";
import { Order, Orderbook, User, UserOrder } from "../types";

const router = Router();

router.get("/echo", (req: Request, res: Response) => {
  res.json({
    ok: true,
    msg: "echo success",
  });
});

router.post("/login", (req: Request, res: Response) => {
  res.json({
    ok: true,
    msg: "login success",
  });
});

router.post("/signup", (req: Request, res: Response) => {
  res.json({
    ok: true,
    msg: "signup success",
  });
});

export default router;
