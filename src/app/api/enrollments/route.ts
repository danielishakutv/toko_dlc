import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { authenticate, unauthorized, badRequest, serverError } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const payload = authenticate(req);
    const { courseId } = await req.json();

    if (!courseId) return badRequest("courseId is required");

    // Verify course exists and is published
    const courseRes = await pool.query(
      "SELECT id FROM courses WHERE id = $1 AND published = true",
      [courseId]
    );
    if (!courseRes.rows.length) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const { rows } = await pool.query(
      `INSERT INTO enrollments (user_id, course_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, course_id) DO NOTHING
      RETURNING id, course_id, enrolled_at`,
      [payload.userId, courseId]
    );

    if (!rows.length) {
      return NextResponse.json({ error: "Already enrolled" }, { status: 409 });
    }

    return NextResponse.json({
      id: rows[0].id,
      courseId: rows[0].course_id,
      enrolledAt: rows[0].enrolled_at,
    }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") return unauthorized();
    return serverError();
  }
}
