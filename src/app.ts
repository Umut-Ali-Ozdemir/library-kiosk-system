import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import cors from "cors";

import seatRoutes from "./routes/seat.routes";
import authRoutes from "./routes/auth.routes";

const app = express();
const PORT = 3000;

// 🔴 CORS (ÇOK KRİTİK)
app.use(cors());

// JSON body parser
app.use(express.json());

// AUTH ROUTES
app.use("/auth", authRoutes);

// SEAT ROUTES
app.use(seatRoutes);

// Test endpoint
app.get("/", (req: Request, res: Response) => {
  res.send("Library Kiosk System Backend is running 🚀");
});

// Server start
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
