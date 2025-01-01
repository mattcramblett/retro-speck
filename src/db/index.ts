import "dotenv/config";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL!;

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(connectionString, {
  prepare: false,
  connect_timeout: 10,
  idle_timeout: 300,
});
export const db = drizzle(client);
