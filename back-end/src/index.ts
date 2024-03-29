import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import connectUserDB from "./connections/userDB";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/errorMiddleware";
import Router from "./routes/router";
import { authenticate } from "./middleware/authMiddleware";
import helmet from "helmet";
import http from "http";
import { Server } from "socket.io";
import socketRoutes from "./socket-Routes/socketRoutes";

dotenv.config();

interface UserBasicInfo {
  _id: string;
  name: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserBasicInfo | null;
    }
  }
}

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Authorization"],
    credentials: true,
  },
});

const port = process.env.PORT || 3010;

app.use(helmet());

app.use(cors());

app.use(cookieParser());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

io.on("connection", (socket) => {
  socketRoutes(socket);
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use(Router);

app.use("/users", authenticate, Router);

app.use(errorHandler);

connectUserDB();
