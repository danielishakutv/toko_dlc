import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { requireRole, unauthorized, forbidden, notFound, serverError } from "@/lib/auth";

// GET students not enrolled in this course (for enrollment picker)
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireRole(req, "superadmin");
    const { id } = await params;

    const course = await pool.query("SELECT id FROM courses WHERE id = $1", [id]);
    if (course.rows.length === 0) return notFound("Course not found");

    const url = new URL(req.url);
    const search = url.searchParams.get("search")?.trim() ?? "";

    let query = `
      SELECT u.id, u.first_name, u.last_name, u.email
      FROM users u
      WHERE u.role = 'student'
        AND u.id NOT IN (SELECT e.user_id FROM enrollments e WHERE e.course_id = $1)`;
    const queryParams: string[] = [id];

    if (search) {
      query += ` AND (u.first_name ILIKE $2 OR u.last_name ILIKE $2 OR u.email ILIKE $2)`;
      queryParams.push(`%${search}%`);
    }

    query += ` ORDER BY u.first_name, u.last_name LIMIT 50`;

    const result = await pool.query(query, queryParams);

    return NextResponse.json({
      students: result.rows.map((u) => ({
        id: u.id,
        firstName: u.first_name,
        lastName: u.last_name,
        email: u.email,
      })),
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") return unauthorized();
    if (err instanceof Error && err.message === "Forbidden") return forbidden();
    return serverError();
  }
}
