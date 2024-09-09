import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import fs from "fs";

import * as schema from "./schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

export const db = drizzle(pool, { schema });
