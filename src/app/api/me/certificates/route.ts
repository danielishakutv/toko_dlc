import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { authenticate, unauthorized, serverError } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const payload = authenticate(req);
    const userId = payload.userId;

    const [earnedRes, enrolledRes] = await Promise.all([
      pool.query(
        `SELECT cert.id, cert.credential_id, cert.issued_at, cert.file_url,
          c.id AS course_id, c.title AS course_title, c.icon AS course_icon
        FROM certificates cert
        JOIN courses c ON c.id = cert.course_id
        WHERE cert.user_id = $1
        ORDER BY cert.issued_at DESC`,
        [userId]
      ),
      pool.query(
        `SELECT
          c.id AS course_id,
          c.title AS course_title,
          c.icon AS course_icon,
          COUNT(DISTINCT l.id)::int AS total_lessons,
          COUNT(DISTINCT lc.lesson_id)::int AS completed_lessons
        FROM enrollments e
        JOIN courses c ON c.id = e.course_id AND c.has_certificate = true
        JOIN course_sections cs ON cs.course_id = c.id
        JOIN lessons l ON l.section_id = cs.id
        LEFT JOIN lesson_completions lc ON lc.lesson_id = l.id AND lc.user_id = $1
        LEFT JOIN certificates cert ON cert.course_id = c.id AND cert.user_id = $1
        WHERE e.user_id = $1 AND cert.id IS NULL
        GROUP BY c.id`,
        [userId]
      ),
    ]);

    return NextResponse.json({
      certificates: earnedRes.rows.map((r) => ({
        id: r.id,
        course: { id: r.course_id, title: r.course_title, icon: r.course_icon },
        credentialId: r.credential_id,
        issuedAt: r.issued_at,
        fileUrl: r.file_url,
      })),
      pending: enrolledRes.rows.map((r) => ({
        course: { id: r.course_id, title: r.course_title, icon: r.course_icon },
        progressPercent: r.total_lessons > 0
          ? Math.round((r.completed_lessons / r.total_lessons) * 100)
          : 0,
      })),
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") return unauthorized();
    return serverError();
  }
}
