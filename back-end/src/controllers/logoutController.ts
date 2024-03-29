import { Request, Response } from "express";
import { clearToken } from "../utils/auth";

export const logoutUser = (req: Request, res: Response) => {
  clearToken(res);
  res.status(200).json({ message: "User logged out" });
};
