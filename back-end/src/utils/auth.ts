import jwt from "jsonwebtoken";
import { Response } from "express";

const generateToken = (res: Response, userId: string) => {
  const jwtSecret = process.env.JWT_SECRET || "";

  const token = jwt.sign({ userId }, jwtSecret, {
    expiresIn: "1h",
  });

  res.cookie("jwt-access-key", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 60 * 60 * 1,
  });
  return token;
};

const clearToken = (res: Response, clearCookie: boolean) => {
  if (clearCookie) {
    res.cookie("jwt-access-key", "", {
      httpOnly: true,
      expires: new Date(0),
    });
  }
  res.status(200).json({ name: "", email: "" });
};

export { generateToken, clearToken };
