import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { serverError } from "@/lib/auth";

export async function GET() {
  try {
    const { rows } = await pool.query(
      `SELECT
        c.id, c.slug, c.title, c.icon, c.description, c.price, c.hours,
        c.quizzes, c.has_certificate,
        COUNT(DISTINCT l.id)::int AS lecture_count
      FROM courses c
      LEFT JOIN course_sections cs ON cs.course_id = c.id
      LEFT JOIN lessons l ON l.section_id = cs.id
      WHERE c.published = true
      GROUP BY c.id
      ORDER BY c.created_at DESC`
    );

    return NextResponse.json({
      courses: rows.map((r) => ({
        id: r.id,
        slug: r.slug,
        title: r.title,
        icon: r.icon,
        description: r.description,
        price: parseFloat(r.price),
        hours: parseFloat(r.hours),
        lectureCount: r.lecture_count,
        quizzes: r.quizzes,
        hasCertificate: r.has_certificate,
      })),
    });
  } catch {
    return serverError();
  }
}
