import { Request, Response } from "express";
import { db } from "../config/db";
import { messages } from "../models/schema";

export const getMessages = async (req: Request, res: Response) => {
  try {
    const result = await db.select().from(messages);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};