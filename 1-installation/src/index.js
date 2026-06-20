import express from "express";
import Redis from "ioredis";
import mongoose, { mongo } from "mongoose";

// App: express instance
const app = express();

const PORT = 8200;
const REDIS_URL = process.env.REDIS_URL ?? "redis://localhost:6379";
const MONGO_URL =
  process.env.MONGO_URL ?? "mongodb://localhost:27017/learning_redis";

// Redis instance or client:
const redis = new Redis(REDIS_URL);

app.get("/redis", async (req, res) => {
  const msg = await redis.ping();
  res.json({
    message: msg,
    success: true,
  });
});

app.get("/mongo", async (req, res) => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGO_URL);
  }
  res.json({
    message: "Mongo Connected",
    database: mongoose.connection.name
  })
});

app.listen(PORT, () => {
  console.log(`app is working on http://localhost:${PORT}/`);
});
