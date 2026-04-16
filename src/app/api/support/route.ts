import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { authenticate, unauthorized, badRequest, serverError } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const payload = authenticate(req);
    const { subject, message } = await req.json();

    if (!subject?.trim() || !message?.trim()) {
      return badRequest("Subject and message are required");
    }

    const { rows } = await pool.query(
      `INSERT INTO support_tickets (user_id, subject, message)
      VALUES ($1, $2, $3)
      RETURNING id, subject, status, created_at`,
      [payload.userId, subject.trim(), message.trim()]
    );

    return NextResponse.json({
      id: rows[0].id,
      subject: rows[0].subject,
      status: rows[0].status,
      createdAt: rows[0].created_at,
    }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") return unauthorized();
    return serverError();
  }
}
