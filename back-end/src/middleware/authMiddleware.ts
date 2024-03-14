import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/userModel";
import asyncHandler from "express-async-handler";
import { AuthenticationError } from "./errorMiddleware";
import { clearToken } from "../utils/auth";

export const authenticate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let token = req.cookies.jwt;

      if (!token) {
        clearToken(res);
      }

      const jwtSecret = process.env.JWT_SECRET || "";
      const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

      if (!decoded || !decoded.userId) {
        clearToken(res);
      }

      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        clearToken(res);
      }

      const user = await User.findById(decoded.userId, "_id name email");

      if (!user) {
        clearToken(res);
      }

      req.user = user;
      next();
    } catch (e) {
      throw new AuthenticationError("Invalid token");
    }
  }
);
