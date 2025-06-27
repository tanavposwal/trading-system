import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET!;

export default function auth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ ok: false, msg: "Token missing" });

  jwt.verify(token, secretKey, (err, user: any) => {
    if (err)
      return res
        .status(403)
        .json({ ok: false, msg: "Token invalid or expired" });
    (req as any).email = user.email; // payload from JWT
    next();
  });
}
