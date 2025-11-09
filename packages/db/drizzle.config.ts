// drizzle.config.ts
import { defineConfig } from "drizzle-kit";
import {env} from '@repo/config/index'
export default defineConfig({
  out: "./drizzle",
  schema: "./src/schema/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL!,
  },
});
