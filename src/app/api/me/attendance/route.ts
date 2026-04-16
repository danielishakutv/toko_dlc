import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { authenticate, unauthorized, serverError } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const payload = authenticate(req);

    const { rows } = await pool.query(
      `SELECT
        ar.status,
        s.id AS session_id,
        s.session_date,
        s.topic,
        c.id AS course_id,
        c.title AS course_title,
        c.icon AS course_icon
      FROM attendance_records ar
      JOIN attendance_sessions s ON s.id = ar.session_id
      JOIN courses c ON c.id = s.course_id
      WHERE ar.user_id = $1
      ORDER BY c.id, s.session_date DESC`,
      [payload.userId]
    );

    // Aggregate summary
    const summary = { present: 0, absent: 0, late: 0 };
    const coursesMap = new Map<string, {
      courseId: string;
      courseTitle: string;
      courseIcon: string;
      sessions: Array<{ id: string; date: string; topic: string; status: string }>;
    }>();

    for (const r of rows) {
      summary[r.status as keyof typeof summary]++;

      if (!coursesMap.has(r.course_id)) {
        coursesMap.set(r.course_id, {
          courseId: r.course_id,
          courseTitle: r.course_title,
          courseIcon: r.course_icon,
          sessions: [],
        });
      }
      coursesMap.get(r.course_id)!.sessions.push({
        id: r.session_id,
        date: r.session_date,
        topic: r.topic,
        status: r.status,
      });
    }

    return NextResponse.json({
      summary,
      courses: Array.from(coursesMap.values()),
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") return unauthorized();
    return serverError();
  }
}
