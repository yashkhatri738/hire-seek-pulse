import type { Config } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config();

export default {
  schema: "./models/schema.ts",
  out: "./drizzle",
  dialect: "mysql", 
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;