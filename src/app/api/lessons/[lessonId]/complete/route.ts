import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { authenticate, unauthorized, notFound, serverError } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const payload = authenticate(req);
    const { lessonId } = await params;

    // Verify lesson exists
    const lessonRes = await pool.query("SELECT id FROM lessons WHERE id = $1", [lessonId]);
    if (!lessonRes.rows.length) return notFound("Lesson not found");

    const { rows } = await pool.query(
      `INSERT INTO lesson_completions (user_id, lesson_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, lesson_id) DO UPDATE SET completed_at = NOW()
      RETURNING lesson_id, completed_at`,
      [payload.userId, lessonId]
    );

    return NextResponse.json({
      lessonId: rows[0].lesson_id,
      completedAt: rows[0].completed_at,
    }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") return unauthorized();
    return serverError();
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const payload = authenticate(req);
    const { lessonId } = await params;

    await pool.query(
      "DELETE FROM lesson_completions WHERE user_id = $1 AND lesson_id = $2",
      [payload.userId, lessonId]
    );

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") return unauthorized();
    return serverError();
  }
}
