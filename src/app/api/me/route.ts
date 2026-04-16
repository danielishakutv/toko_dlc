import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { authenticate, unauthorized, serverError } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const payload = authenticate(req);
    const { rows } = await pool.query(
      "SELECT id, first_name, last_name, email, role, avatar_url, created_at FROM users WHERE id = $1",
      [payload.userId]
    );
    const user = rows[0];
    if (!user) return unauthorized("User not found");

    return NextResponse.json({
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatar_url,
      createdAt: user.created_at,
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") return unauthorized();
    return serverError();
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const payload = authenticate(req);
    const { firstName, lastName, email, password } = await req.json();

    const fields: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (firstName) { fields.push(`first_name = $${idx++}`); values.push(firstName); }
    if (lastName) { fields.push(`last_name = $${idx++}`); values.push(lastName); }
    if (email) { fields.push(`email = $${idx++}`); values.push(email.toLowerCase().trim()); }
    if (password) {
      const hash = await bcrypt.hash(password, 12);
      fields.push(`password_hash = $${idx++}`);
      values.push(hash);
    }

    if (fields.length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    fields.push(`updated_at = NOW()`);
    values.push(payload.userId);

    const { rows } = await pool.query(
      `UPDATE users SET ${fields.join(", ")} WHERE id = $${idx} RETURNING id, first_name, last_name, email, role, avatar_url, created_at`,
      values
    );

    const user = rows[0];
    return NextResponse.json({
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatar_url,
      createdAt: user.created_at,
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") return unauthorized();
    return serverError();
  }
}
