// drizzle.config.ts
import { defineConfig } from "drizzle-kit";
import {env} from '@repo/config/index'
import path from 'path';

export default defineConfig({
  out: "./drizzle",
  schema: path.resolve(__dirname, "./src/schema/index.ts"),
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL!,
  },
});
