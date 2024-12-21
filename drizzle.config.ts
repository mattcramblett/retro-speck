import { defineConfig } from "drizzle-kit";
import 'dotenv/config';
import { config } from 'dotenv';

config({ path: '.env.local' });

export default defineConfig({
  out: './src/db',
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  schemaFilter: ["retro_speck"],
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
