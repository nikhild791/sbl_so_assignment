import dotenv from "dotenv";
import { z } from "zod";

// Load .env file
dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string(),
  REDIS_URL: z.string(),
  GOOGLE_API_KEY: z.string()
  // NODE_ENV: z.enum(["development", "production"]).default("development"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
