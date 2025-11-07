import { migrate } from "drizzle-orm/node-postgres/migrator";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as dotenv from "dotenv";

dotenv.config(); // make sure DATABASE_URL is available

const client = new Client({
  connectionString: process.env.DATABASE_URL!,
});

async function main() {
  await client.connect();
  const db = drizzle(client);

  console.log("⏳ Running migrations...");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("✅ Migrations applied!");

  await client.end();
}

main();
