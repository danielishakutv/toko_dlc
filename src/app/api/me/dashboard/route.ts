import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { authenticate, unauthorized, serverError } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const payload = authenticate(req);
    const userId = payload.userId;

    const [statsRes, deadlinesRes, activityRes, progressRes] = await Promise.all([
      pool.query(
        `SELECT
          COUNT(*)::int AS enrolled_courses,
          COUNT(completed_at)::int AS completed_courses,
          COUNT(CASE WHEN completed_at IS NULL THEN 1 END)::int AS in_progress_courses
        FROM enrollments WHERE user_id = $1`,
        [userId]
      ),
      pool.query(
        `SELECT c.title AS course_title, a.title AS task, a.due_date
        FROM assessments a
        JOIN courses c ON c.id = a.course_id
        JOIN enrollments e ON e.course_id = c.id AND e.user_id = $1
        LEFT JOIN assessment_submissions sub ON sub.assessment_id = a.id AND sub.user_id = $1
        WHERE a.due_date IS NOT NULL
          AND (sub.status IS NULL OR sub.status != 'completed')
        ORDER BY a.due_date ASC
        LIMIT 5`,
        [userId]
      ),
      pool.query(
        `SELECT 'Completed lesson' AS action, l.title AS detail, lc.completed_at AS timestamp
        FROM lesson_completions lc
        JOIN lessons l ON l.id = lc.lesson_id
        WHERE lc.user_id = $1
        ORDER BY lc.completed_at DESC
        LIMIT 10`,
        [userId]
      ),
      pool.query(
        `SELECT
          c.slug AS course_slug,
          c.title AS course_title,
          c.icon AS course_icon,
          COUNT(DISTINCT l.id)::int AS total_lessons,
          COUNT(DISTINCT lc.lesson_id)::int AS completed_lessons
        FROM enrollments e
        JOIN courses c ON c.id = e.course_id
        JOIN course_sections cs ON cs.course_id = c.id
        JOIN lessons l ON l.section_id = cs.id
        LEFT JOIN lesson_completions lc ON lc.lesson_id = l.id AND lc.user_id = $1
        WHERE e.user_id = $1
        GROUP BY c.id`,
        [userId]
      ),
    ]);

    const certRes = await pool.query(
      "SELECT COUNT(*)::int AS count FROM certificates WHERE user_id = $1",
      [userId]
    );

    const stats = statsRes.rows[0];

    return NextResponse.json({
      stats: {
        enrolledCourses: stats.enrolled_courses,
        completedCourses: stats.completed_courses,
        inProgressCourses: stats.in_progress_courses,
        certificatesEarned: certRes.rows[0].count,
      },
      upcomingDeadlines: deadlinesRes.rows.map((r) => ({
        courseTitle: r.course_title,
        task: r.task,
        dueDate: r.due_date,
      })),
      recentActivity: activityRes.rows.map((r) => ({
        action: r.action,
        detail: r.detail,
        timestamp: r.timestamp,
      })),
      courseProgress: progressRes.rows.map((r) => ({
        courseSlug: r.course_slug,
        courseTitle: r.course_title,
        courseIcon: r.course_icon,
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
