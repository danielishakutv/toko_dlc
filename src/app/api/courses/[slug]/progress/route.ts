import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { authenticate, unauthorized, notFound, serverError } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const payload = authenticate(req);
    const { slug } = await params;

    const courseRes = await pool.query(
      "SELECT id FROM courses WHERE slug = $1 AND published = true",
      [slug]
    );
    if (!courseRes.rows.length) return notFound("Course not found");
    const courseId = courseRes.rows[0].id;

    const { rows } = await pool.query(
      `SELECT l.id AS lesson_id, lc.lesson_id AS completed_id
      FROM course_sections cs
      JOIN lessons l ON l.section_id = cs.id
      LEFT JOIN lesson_completions lc ON lc.lesson_id = l.id AND lc.user_id = $1
      WHERE cs.course_id = $2`,
      [payload.userId, courseId]
    );

    const totalLessons = rows.length;
    const completedLessonIds = rows.filter((r) => r.completed_id).map((r) => r.lesson_id);

    return NextResponse.json({
      completedLessonIds,
      totalLessons,
      completedCount: completedLessonIds.length,
      progressPercent: totalLessons > 0
        ? Math.round((completedLessonIds.length / totalLessons) * 100)
        : 0,
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") return unauthorized();
    return serverError();
  }
}
