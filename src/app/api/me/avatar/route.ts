import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import pool from "@/lib/db";
import { authenticate, unauthorized, serverError, badRequest } from "@/lib/auth";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 2 * 1024 * 1024; // 2 MB

export async function PATCH(req: NextRequest) {
  try {
    const payload = authenticate(req);

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) return badRequest("No file provided");
    if (!ALLOWED_TYPES.includes(file.type)) return badRequest("Only JPEG, PNG, or WebP images are allowed");
    if (file.size > MAX_SIZE) return badRequest("File must be under 2 MB");

    const ext = file.type.split("/")[1];
    const filename = `${payload.userId}-${Date.now()}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "avatars");
    await mkdir(uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadDir, filename), buffer);

    const avatarUrl = `/uploads/avatars/${filename}`;
    await pool.query(
      "UPDATE users SET avatar_url = $1, updated_at = NOW() WHERE id = $2",
      [avatarUrl, payload.userId]
    );

    return NextResponse.json({ avatarUrl });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") return unauthorized();
    return serverError();
  }
}
