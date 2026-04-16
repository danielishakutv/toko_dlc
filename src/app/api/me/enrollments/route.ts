import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { authenticate, unauthorized, serverError } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const payload = authenticate(req);

    const { rows } = await pool.query(
      `SELECT
        e.id,
        e.enrolled_at,
        e.completed_at,
        c.id AS course_id,
        c.slug,
        c.title,
        c.icon,
        c.description,
        c.hours,
        (
          SELECT COUNT(*)::int
          FROM lessons l
          JOIN course_sections cs ON cs.id = l.section_id
          WHERE cs.course_id = c.id
        ) AS total_lessons,
        (
          SELECT COUNT(*)::int
          FROM lesson_completions lc
          JOIN lessons l ON l.id = lc.lesson_id
          JOIN course_sections cs ON cs.id = l.section_id
          WHERE cs.course_id = c.id AND lc.user_id = $1
        ) AS completed_lessons
      FROM enrollments e
      JOIN courses c ON c.id = e.course_id
      WHERE e.user_id = $1
      ORDER BY e.enrolled_at DESC`,
      [payload.userId]
    );

    const enrollments = rows.map((r) => ({
      id: r.id,
      course: {
        id: r.course_id,
        slug: r.slug,
        title: r.title,
        icon: r.icon,
        description: r.description,
        hours: parseFloat(r.hours),
        lectureCount: r.total_lessons,
      },
      enrolledAt: r.enrolled_at,
      completedAt: r.completed_at,
      progress: r.total_lessons > 0 ? Math.round((r.completed_lessons / r.total_lessons) * 100) : 0,
      completedLessons: r.completed_lessons,
      totalLessons: r.total_lessons,
    }));

    return NextResponse.json({ enrollments });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") return unauthorized();
    return serverError();
  }
}
