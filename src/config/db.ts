import mysql2 from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "@/drizzle/schema";

const pool = mysql2.createPool(process.env.DATABASE_URL as string);

export const db = drizzle(pool, { schema, mode: "default" });