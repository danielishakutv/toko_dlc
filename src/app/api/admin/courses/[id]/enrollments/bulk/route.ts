import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { requireRole, unauthorized, forbidden, badRequest, notFound, serverError } from "@/lib/auth";

function parseCsv(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/\s+/g, "_"));
  return lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim());
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => { obj[h] = values[i] || ""; });
    return obj;
  });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireRole(req, "superadmin");
    const { id } = await params;

    const course = await pool.query("SELECT id FROM courses WHERE id = $1", [id]);
    if (course.rows.length === 0) return notFound("Course not found");

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const cohortId = formData.get("cohortId") as string | null;

    if (!file) return badRequest("No file uploaded");
    if (!file.name.endsWith(".csv")) return badRequest("File must be a CSV");

    const text = await file.text();
    const rows = parseCsv(text);

    if (rows.length === 0) return badRequest("CSV is empty or has no data rows");

    const first = rows[0];
    if (!("email" in first)) {
      return badRequest("Missing required column: email");
    }

    // Validate cohort belongs to this course if provided
    if (cohortId) {
      const ch = await pool.query("SELECT id FROM cohorts WHERE id = $1 AND course_id = $2", [cohortId, id]);
      if (ch.rows.length === 0) return badRequest("Invalid cohort for this course");
    }

    const results: { email: string; status: string; error?: string }[] = [];

    for (const row of rows) {
      const email = row.email?.trim().toLowerCase();
      if (!email) {
        results.push({ email: "(empty)", status: "skipped", error: "Missing email" });
        continue;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        results.push({ email, status: "skipped", error: "Invalid email format" });
        continue;
      }

      // Look up user
      const userRes = await pool.query("SELECT id FROM users WHERE LOWER(email) = $1", [email]);
      if (userRes.rows.length === 0) {
        results.push({ email, status: "skipped", error: "User not found" });
        continue;
      }

      const userId = userRes.rows[0].id;

      try {
        await pool.query(
          `INSERT INTO enrollments (user_id, course_id, cohort_id)
           VALUES ($1, $2, $3)
           ON CONFLICT (user_id, course_id)
           DO UPDATE SET cohort_id = COALESCE($3, enrollments.cohort_id)`,
          [userId, id, cohortId || null]
        );
        results.push({ email, status: "enrolled" });
      } catch {
        results.push({ email, status: "failed", error: "Database error" });
      }
    }

    const enrolled = results.filter((r) => r.status === "enrolled").length;
    const skipped = results.filter((r) => r.status === "skipped").length;
    const failed = results.filter((r) => r.status === "failed").length;

    return NextResponse.json({ enrolled, skipped, failed, total: rows.length, results }, { status: 201 });
  } catch (err: unknown) {
    console.error("POST /enrollments/bulk error:", err);
    if (err instanceof Error && err.message === "Unauthorized") return unauthorized();
    if (err instanceof Error && err.message === "Forbidden") return forbidden();
    return serverError();
  }
}
