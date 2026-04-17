import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { authenticate, unauthorized, badRequest, serverError } from "@/lib/auth";

export async function PUT(req: NextRequest) {
  try {
    const payload = authenticate(req);
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return badRequest("Current password and new password are required");
    }

    if (newPassword.length < 6) {
      return badRequest("New password must be at least 6 characters");
    }

    const { rows } = await pool.query(
      "SELECT password_hash FROM users WHERE id = $1",
      [payload.userId]
    );

    if (!rows.length) return unauthorized();

    const valid = await bcrypt.compare(currentPassword, rows[0].password_hash);
    if (!valid) {
      return badRequest("Current password is incorrect");
    }

    const hash = await bcrypt.hash(newPassword, 12);

    await pool.query(
      "UPDATE users SET password_hash = $1, must_change_password = false, updated_at = NOW() WHERE id = $2",
      [hash, payload.userId]
    );

    // Reissue session cookie with mustChangePassword cleared
    const sessionToken = jwt.sign(
      { userId: payload.userId, role: payload.role, mustChangePassword: false },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );
    const response = NextResponse.json({ message: "Password changed successfully" });
    response.cookies.set("session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return response;
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") return unauthorized();
    return serverError();
  }
}
