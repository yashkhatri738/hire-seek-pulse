"use server";

import fs from "fs";
import path from "path";

export async function saveImage(formData: FormData){
    const file = formData.get("file") as File | null;

    if (!file) {
        throw new Error("No file provided");
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "")}`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, buffer);

    return `/uploads/${fileName}`;
}