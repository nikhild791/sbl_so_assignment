    import { drizzle } from "drizzle-orm/node-postgres";
    import { Pool } from "pg";
    import * as schema from "./schema"; // Import your schema

import * as dotenv from "dotenv";
console.log("This is password",process.env.DATABASE_URL)
dotenv.config(); // make sure DATABASE_URL is available
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL!,
    });

    export const db = drizzle(pool, { schema });