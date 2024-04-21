import { createClient } from "redis";

const REDIS_URL = process.env.REDIS_URL || "placeholder_key";

const client = createClient({
  url: REDIS_URL,
});

client.on("error", (err) => {
  console.error("Redis Client Error", err);
});

const connectRedis = async () => {
  try {
    await client.connect();
    console.log("Connected to Redis");
  } catch (err) {
    console.error("Redis connection error:", err);
  }
};

export { client, connectRedis };