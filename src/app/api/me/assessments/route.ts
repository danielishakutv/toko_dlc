import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { authenticate, unauthorized, serverError } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const payload = authenticate(req);

    const { rows } = await pool.query(
      `SELECT
        a.id,
        a.title,
        a.type,
        a.question_count,
        a.duration_minutes,
        a.due_date,
        c.id AS course_id,
        c.title AS course_title,
        COALESCE(sub.status, 'not_started') AS status,
        sub.score,
        sub.submitted_at
      FROM assessments a
      JOIN courses c ON c.id = a.course_id
      JOIN enrollments e ON e.course_id = c.id AND e.user_id = $1
      LEFT JOIN assessment_submissions sub ON sub.assessment_id = a.id AND sub.user_id = $1
      ORDER BY a.due_date ASC NULLS LAST, a.created_at DESC`,
      [payload.userId]
    );

    return NextResponse.json({
      assessments: rows.map((r) => ({
        id: r.id,
        title: r.title,
        course: { id: r.course_id, title: r.course_title },
        type: r.type,
        questionCount: r.question_count,
        durationMinutes: r.duration_minutes,
        dueDate: r.due_date,
        status: r.status,
        score: r.score ? parseFloat(r.score) : null,
        submittedAt: r.submitted_at,
      })),
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") return unauthorized();
    return serverError();
  }
}
