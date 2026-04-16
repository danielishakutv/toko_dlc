import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { authenticate, unauthorized, serverError } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const payload = authenticate(req);

    const { rows } = await pool.query(
      `SELECT id, subject, message, status, created_at, updated_at
      FROM support_tickets
      WHERE user_id = $1
      ORDER BY created_at DESC`,
      [payload.userId]
    );

    return NextResponse.json({
      tickets: rows.map((r) => ({
        id: r.id,
        subject: r.subject,
        message: r.message,
        status: r.status,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      })),
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") return unauthorized();
    return serverError();
  }
}
