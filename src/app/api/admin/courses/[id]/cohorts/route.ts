import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { requireRole, unauthorized, forbidden, badRequest, notFound, serverError } from "@/lib/auth";

// GET cohorts for a course
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireRole(req, "superadmin");
    const { id } = await params;

    const course = await pool.query("SELECT id FROM courses WHERE id = $1", [id]);
    if (course.rows.length === 0) return notFound("Course not found");

    const result = await pool.query(
      `SELECT c.id, c.name, c.start_date, c.end_date, c.created_at,
              (SELECT COUNT(*)::int FROM enrollments e WHERE e.cohort_id = c.id) AS student_count
       FROM cohorts c WHERE c.course_id = $1 ORDER BY c.created_at DESC`,
      [id]
    );

    return NextResponse.json({
      cohorts: result.rows.map((r) => ({
        id: r.id,
        name: r.name,
        startDate: r.start_date,
        endDate: r.end_date,
        studentCount: r.student_count,
        createdAt: r.created_at,
      })),
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") return unauthorized();
    if (err instanceof Error && err.message === "Forbidden") return forbidden();
    return serverError();
  }
}

// POST create cohort for a course
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireRole(req, "superadmin");
    const { id } = await params;

    const course = await pool.query("SELECT id FROM courses WHERE id = $1", [id]);
    if (course.rows.length === 0) return notFound("Course not found");

    const { name, startDate, endDate } = await req.json();
    if (!name?.trim()) return badRequest("Cohort name is required");

    const { rows } = await pool.query(
      `INSERT INTO cohorts (course_id, name, start_date, end_date)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, start_date, end_date, created_at`,
      [id, name.trim(), startDate || null, endDate || null]
    );

    const r = rows[0];
    return NextResponse.json({
      id: r.id,
      name: r.name,
      startDate: r.start_date,
      endDate: r.end_date,
      studentCount: 0,
      createdAt: r.created_at,
    }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") return unauthorized();
    if (err instanceof Error && err.message === "Forbidden") return forbidden();
    const pgErr = err as { code?: string };
    if (pgErr.code === "23505") return badRequest("A cohort with this name already exists for this course");
    return serverError();
  }
}
