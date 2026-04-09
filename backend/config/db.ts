import mysql2 from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "../models/schema";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql2.createPool(process.env.DATABASE_URL as string);

export const db = drizzle(pool, { schema, mode: "default" });