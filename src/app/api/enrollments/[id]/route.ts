import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { authenticate, unauthorized, notFound, serverError } from "@/lib/auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = authenticate(req);
    const { id } = await params;

    const { rowCount } = await pool.query(
      "DELETE FROM enrollments WHERE id = $1 AND user_id = $2",
      [id, payload.userId]
    );

    if (!rowCount) return notFound("Enrollment not found");

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") return unauthorized();
    return serverError();
  }
}
