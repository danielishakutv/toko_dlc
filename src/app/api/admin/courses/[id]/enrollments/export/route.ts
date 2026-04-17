import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { requireRole, unauthorized, forbidden, notFound, serverError } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireRole(req, "superadmin");
    const { id } = await params;

    const course = await pool.query("SELECT id, title FROM courses WHERE id = $1", [id]);
    if (course.rows.length === 0) return notFound("Course not found");

    const url = new URL(req.url);
    const cohortFilter = url.searchParams.get("cohortId")?.trim() ?? "";
    const format = url.searchParams.get("format")?.trim() ?? "csv";

    let query = `
      SELECT u.first_name, u.last_name, u.email,
             e.enrolled_at, e.completed_at,
             ch.name AS cohort_name
      FROM enrollments e
      JOIN users u ON u.id = e.user_id
      LEFT JOIN cohorts ch ON ch.id = e.cohort_id
      WHERE e.course_id = $1`;
    const params2: string[] = [id];
    let paramIdx = 2;

    if (cohortFilter === "none") {
      query += ` AND e.cohort_id IS NULL`;
    } else if (cohortFilter) {
      query += ` AND e.cohort_id = $${paramIdx}`;
      params2.push(cohortFilter);
      paramIdx++;
    }

    query += ` ORDER BY ch.name NULLS LAST, u.last_name, u.first_name`;

    const result = await pool.query(query, params2);
    const courseTitle = course.rows[0].title;

    if (format === "csv") {
      const header = "First Name,Last Name,Email,Cohort,Enrolled Date,Completed Date";
      const rows = result.rows.map((r) => {
        const enrolled = r.enrolled_at ? new Date(r.enrolled_at).toLocaleDateString() : "";
        const completed = r.completed_at ? new Date(r.completed_at).toLocaleDateString() : "";
        const cohort = r.cohort_name || "Unassigned";
        // Escape commas in fields
        return [r.first_name, r.last_name, r.email, cohort, enrolled, completed]
          .map((v) => `"${(v || "").replace(/"/g, '""')}"`)
          .join(",");
      });
      const csvContent = [header, ...rows].join("\n");

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${courseTitle.replace(/[^a-zA-Z0-9 ]/g, "")}-enrollments.csv"`,
        },
      });
    }

    // JSON fallback (for PDF generation on client side)
    return NextResponse.json({
      courseTitle,
      enrollments: result.rows.map((r) => ({
        firstName: r.first_name,
        lastName: r.last_name,
        email: r.email,
        cohortName: r.cohort_name || "Unassigned",
        enrolledAt: r.enrolled_at,
        completedAt: r.completed_at,
      })),
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") return unauthorized();
    if (err instanceof Error && err.message === "Forbidden") return forbidden();
    return serverError();
  }
}
