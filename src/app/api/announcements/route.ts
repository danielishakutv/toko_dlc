import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { authenticate, unauthorized, serverError } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    authenticate(req);

    const { rows } = await pool.query(
      `SELECT id, title, body, category, pinned, created_at
      FROM announcements
      ORDER BY pinned DESC, created_at DESC`
    );

    return NextResponse.json({
      announcements: rows.map((r) => ({
        id: r.id,
        title: r.title,
        body: r.body,
        category: r.category,
        pinned: r.pinned,
        createdAt: r.created_at,
      })),
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") return unauthorized();
    return serverError();
  }
}
