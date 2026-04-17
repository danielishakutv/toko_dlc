import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { requireRole, unauthorized, forbidden, notFound, badRequest, serverError } from "@/lib/auth";

const DEFAULT_PASSWORD = "Toko@2022";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireRole(req, "superadmin");
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const password = body.password || DEFAULT_PASSWORD;

    if (password.length < 6) {
      return badRequest("Password must be at least 6 characters");
    }

    const hash = await bcrypt.hash(password, 12);

    const { rowCount } = await pool.query(
      "UPDATE users SET password_hash = $1, must_change_password = true, updated_at = NOW() WHERE id = $2",
      [hash, id]
    );

    if (!rowCount) return notFound("User not found");

    return NextResponse.json({ message: "Password reset successfully. User will be prompted to change password on next login." });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") return unauthorized();
    if (err instanceof Error && err.message === "Forbidden") return forbidden();
    return serverError();
  }
}
