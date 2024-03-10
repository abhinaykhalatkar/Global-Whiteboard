import jwt from "jsonwebtoken";
import { Response } from "express";

const generateToken = (res: Response, userId: string) => {
  const jwtSecret = process.env.JWT_SECRET || "";

  const token = jwt.sign({ userId }, jwtSecret, {
    expiresIn: "1d",
  });
  return token;
};

const clearToken = (res: Response) => {
  res.status(309).json({ message: "Error with authentication using key" });
};

export { generateToken, clearToken };
