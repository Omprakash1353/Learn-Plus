import "dotenv/config";
import { sql } from "drizzle-orm";

import { db } from ".";

async function clearDB() {
  console.log("Emptying database...");
  try {
    await db.execute(sql`DROP SCHEMA public CASCADE`);
    await db.execute(sql`CREATE SCHEMA public`);
    await db.execute(sql`GRANT ALL ON SCHEMA public TO public`);

    console.log("Database cleared successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error clearing database:", error);
    process.exit(1);
  }
}

clearDB();
