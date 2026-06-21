import express from "express";
import Redis from "ioredis";

const PORT = 8200;
const REDIS_URL = process.env.REDIS_URL ?? "redis://localhost:6379";

// App: express instance
const app = express();
const redis = new Redis(REDIS_URL);
app.use(express.json())

const REDIS_KEYS = {
  otp: "app:otp",
  otpPhone: (phone) => `app:otp:${phone}`,

  // Expiry:
  TTL_OTP: 30, // 30 seconds
}

// Utility functions
function generateRandomOTP(){
  const otp = Math.floor(100000 + Math.random()* 100000).toString();
  return otp;
}


app.get("/",  (req,res) => {
  return res.json({message: "Welcom to the api"})
})

app.post("/send-otp", async (req,res)=>{
  const {phone}= req.body
  const otp = generateRandomOTP();
  console.log("OTP: ", otp);

  //set otp and phone to redis:
  // Expiry / TTL set for 30sec
  await redis.set(REDIS_KEYS.otpPhone(phone), otp, 'EX', REDIS_KEYS.TTL_OTP)

  return res.json({message: "OTP send successfully"});
})

app.post("/login", async(req,res)=>{
  const {otp, phone} = req.body;

  const redisOTP = await redis.get(REDIS_KEYS.otpPhone(phone))

  if(!redisOTP) return res.json({message: "No OTP Found or OTP is expired"})

  if(redisOTP===otp) {
    return res.json({success: true});
  }
  return res.json({success: false});
})

// GET TTL FOR A REDIS_KEY
app.get("/otp/:phone/ttl", async (req,res)=>{
  const phone = req.params.phone
  const ttl = await redis.ttl(REDIS_KEYS.otpPhone(phone).ttl);
  return res.json({ttl})
});


app.listen(PORT, () => {
  console.log(`app is working on http://localhost:${PORT}/`);
});
