import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { requireRole, unauthorized, forbidden, badRequest, notFound, serverError } from "@/lib/auth";

// GET enrolled students for a course
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireRole(req, "superadmin");
    const { id } = await params;

    const course = await pool.query("SELECT id FROM courses WHERE id = $1", [id]);
    if (course.rows.length === 0) return notFound("Course not found");

    const url = new URL(req.url);
    const search = url.searchParams.get("search")?.trim() ?? "";
    const cohortFilter = url.searchParams.get("cohortId")?.trim() ?? "";

    let query = `
      SELECT e.id AS enrollment_id, e.enrolled_at, e.completed_at, e.cohort_id,
             u.id, u.first_name, u.last_name, u.email,
             ch.name AS cohort_name
      FROM enrollments e
      JOIN users u ON u.id = e.user_id
      LEFT JOIN cohorts ch ON ch.id = e.cohort_id
      WHERE e.course_id = $1`;
    const params2: (string | number)[] = [id];
    let paramIdx = 2;

    if (search) {
      query += ` AND (u.first_name ILIKE $${paramIdx} OR u.last_name ILIKE $${paramIdx} OR u.email ILIKE $${paramIdx})`;
      params2.push(`%${search}%`);
      paramIdx++;
    }

    if (cohortFilter === "none") {
      query += ` AND e.cohort_id IS NULL`;
    } else if (cohortFilter) {
      query += ` AND e.cohort_id = $${paramIdx}`;
      params2.push(cohortFilter);
      paramIdx++;
    }

    query += ` ORDER BY e.enrolled_at DESC`;

    const result = await pool.query(query, params2);

    return NextResponse.json({
      enrollments: result.rows.map((r) => ({
        enrollmentId: r.enrollment_id,
        enrolledAt: r.enrolled_at,
        completedAt: r.completed_at,
        cohortId: r.cohort_id,
        cohortName: r.cohort_name,
        userId: r.id,
        firstName: r.first_name,
        lastName: r.last_name,
        email: r.email,
      })),
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") return unauthorized();
    if (err instanceof Error && err.message === "Forbidden") return forbidden();
    return serverError();
  }
}

// POST — enroll students (accepts array of user IDs)
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireRole(req, "superadmin");
    const { id } = await params;

    const course = await pool.query("SELECT id FROM courses WHERE id = $1", [id]);
    if (course.rows.length === 0) return notFound("Course not found");

    const { userIds, cohortId } = await req.json();
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return badRequest("userIds must be a non-empty array");
    }

    let enrolled = 0;
    for (const userId of userIds) {
      try {
        await pool.query(
          "INSERT INTO enrollments (user_id, course_id, cohort_id) VALUES ($1, $2, $3) ON CONFLICT (user_id, course_id) DO UPDATE SET cohort_id = COALESCE($3, enrollments.cohort_id)",
          [userId, id, cohortId || null]
        );
        enrolled++;
      } catch {
        // Skip invalid user IDs
      }
    }

    return NextResponse.json({ enrolled });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") return unauthorized();
    if (err instanceof Error && err.message === "Forbidden") return forbidden();
    return serverError();
  }
}

// DELETE — unenroll a student
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireRole(req, "superadmin");
    const { id } = await params;

    const { userId } = await req.json();
    if (!userId) return badRequest("userId is required");

    await pool.query("DELETE FROM enrollments WHERE course_id = $1 AND user_id = $2", [id, userId]);

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") return unauthorized();
    if (err instanceof Error && err.message === "Forbidden") return forbidden();
    return serverError();
  }
}
