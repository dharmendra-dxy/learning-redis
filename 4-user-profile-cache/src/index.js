import express from "express";
import Redis from "ioredis";

const PORT = 8200;
const REDIS_URL = process.env.REDIS_URL ?? "redis://localhost:6379";

// App: express instance
const app = express();
const redis = new Redis(REDIS_URL);
app.use(express.json());

const REDIS_KEYS = {
  userId: (userId) => `app:user:${userId}`,
  userIdHash: (userId) => `app:user:${userId}:hash`,
};

/* -------------------------------------
  set : store single variable
  hset: store object
  hgetall: get entire object
------------------------------------- */

app.get("/", (req, res) => {
  return res.json({ message: "Welcom to the api" });
});

/* ---------------------------------------
DATA IN REDIS IS STORED AS A JSON FORMAT:
 ---------------------------------------*/

app.post("/user/:id", async (req, res) => {
  const key = REDIS_KEYS.userId(req.params.id);
  await redis.set(key, JSON.stringify(req.body));

  return res.json({ message: "Saved as Json", succees: true });
});

app.get("/user/:id", async (req, res) => {
  const key = REDIS_KEYS.userId(req.params.id);
  const user = await redis.get(key);

  return res.json({ succees: true, user: JSON.parse(user) });
});

/* ---------------------------------------
DATA IN REDIS IS STORED AS A HASH FORMAT:
 ---------------------------------------*/

app.post("/user/:id/hash", async (req, res) => {
  const key = REDIS_KEYS.userIdHash(req.params.id);
  await redis.hset(key, req.body);

  return res.json({ message: "Saved as HASHED", succees: true });
});

app.get("/user/:id/hash", async (req, res) => {
  const key = REDIS_KEYS.userIdHash(req.params.id);
  const user = await redis.hgetall(key);

  return res.json({ succees: true, user: user });
});

app.listen(PORT, () => {
  console.log(`app is working on http://localhost:${PORT}/`);
});
