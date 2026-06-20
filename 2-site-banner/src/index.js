import express from "express";
import Redis from "ioredis";

// App: express instance
const app = express();

app.use(express.json())

const PORT = 8200;
const REDIS_URL = process.env.REDIS_URL ?? "redis://localhost:6379";

// Redis instance or client:
const redis = new Redis(REDIS_URL);

// KEYS:
const REDIS_KEYS = {
  bannerKey: "app:banner"
}

app.post("/banner", async (req, res)=>{
  console.log("Message Body: ", req.body)
  await redis.set(REDIS_KEYS.bannerKey, req.body.message ?? "Default description");
  return res.json({success: true});
})


app.get("/banner", async (req,res) => {
  const data = await redis.get(REDIS_KEYS.bannerKey)
  return res.json({data})
})

app.delete("/banner", async(req,res)=>{
  await redis.del(REDIS_KEYS.bannerKey)
  return res.json({success: true})
})

app.get("/banner/exists", async (req, res)=> {
  const data = await redis.exists(REDIS_KEYS.bannerKey);
  return res.json({exists: Boolean(data)})
})

app.get("/help",  (req,res) => {
  return res.json({message: "Welcom to the api"})
})


app.listen(PORT, () => {
  console.log(`app is working on http://localhost:${PORT}/`);
});
