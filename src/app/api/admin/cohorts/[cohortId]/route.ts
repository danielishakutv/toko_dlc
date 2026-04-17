import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { requireRole, unauthorized, forbidden, badRequest, notFound, serverError } from "@/lib/auth";

// PATCH update cohort
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ cohortId: string }> }) {
  try {
    requireRole(req, "superadmin");
    const { cohortId } = await params;

    const { name, startDate, endDate } = await req.json();

    const sets: string[] = [];
    const vals: (string | null)[] = [];
    let idx = 1;

    if (name !== undefined) { sets.push(`name = $${idx++}`); vals.push(name.trim()); }
    if (startDate !== undefined) { sets.push(`start_date = $${idx++}`); vals.push(startDate || null); }
    if (endDate !== undefined) { sets.push(`end_date = $${idx++}`); vals.push(endDate || null); }

    if (sets.length === 0) return badRequest("No fields to update");

    vals.push(cohortId);
    const { rowCount } = await pool.query(
      `UPDATE cohorts SET ${sets.join(", ")} WHERE id = $${idx}`,
      vals
    );

    if (!rowCount) return notFound("Cohort not found");

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") return unauthorized();
    if (err instanceof Error && err.message === "Forbidden") return forbidden();
    const pgErr = err as { code?: string };
    if (pgErr.code === "23505") return badRequest("A cohort with this name already exists for this course");
    return serverError();
  }
}

// DELETE cohort (enrollments keep their rows, cohort_id becomes NULL)
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ cohortId: string }> }) {
  try {
    requireRole(req, "superadmin");
    const { cohortId } = await params;

    const { rowCount } = await pool.query("DELETE FROM cohorts WHERE id = $1", [cohortId]);
    if (!rowCount) return notFound("Cohort not found");

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") return unauthorized();
    if (err instanceof Error && err.message === "Forbidden") return forbidden();
    return serverError();
  }
}
