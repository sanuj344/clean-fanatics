import express from "express";
import cors from "cors";
import prisma from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "Backend is running" });
});

app.get("/test-db", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});
app.use("/api/auth", authRoutes);


export default app;
