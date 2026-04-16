import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { requireRole, unauthorized, forbidden, notFound, serverError } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireRole(req, "superadmin");
    const { id } = await params;

    const { rows } = await pool.query(
      "SELECT id, first_name, last_name, email, role, created_at FROM users WHERE id = $1",
      [id]
    );

    if (!rows.length) return notFound("User not found");
    const u = rows[0];

    return NextResponse.json({
      id: u.id,
      firstName: u.first_name,
      lastName: u.last_name,
      email: u.email,
      role: u.role,
      createdAt: u.created_at,
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") return unauthorized();
    if (err instanceof Error && err.message === "Forbidden") return forbidden();
    return serverError();
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireRole(req, "superadmin");
    const { id } = await params;
    const { firstName, lastName, email, role } = await req.json();

    const fields: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (firstName) { fields.push(`first_name = $${idx++}`); values.push(firstName); }
    if (lastName) { fields.push(`last_name = $${idx++}`); values.push(lastName); }
    if (email) { fields.push(`email = $${idx++}`); values.push(email.toLowerCase().trim()); }
    if (role) {
      if (!["admin", "student"].includes(role)) {
        return NextResponse.json({ error: "Role must be admin or student" }, { status: 400 });
      }
      fields.push(`role = $${idx++}`);
      values.push(role);
    }

    if (!fields.length) return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    fields.push("updated_at = NOW()");
    values.push(id);

    const { rows } = await pool.query(
      `UPDATE users SET ${fields.join(", ")} WHERE id = $${idx} RETURNING id, first_name, last_name, email, role, created_at`,
      values
    );

    if (!rows.length) return notFound("User not found");
    const u = rows[0];

    return NextResponse.json({
      id: u.id,
      firstName: u.first_name,
      lastName: u.last_name,
      email: u.email,
      role: u.role,
      createdAt: u.created_at,
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") return unauthorized();
    if (err instanceof Error && err.message === "Forbidden") return forbidden();
    return serverError();
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireRole(req, "superadmin");
    const { id } = await params;

    const { rowCount } = await pool.query("DELETE FROM users WHERE id = $1", [id]);
    if (!rowCount) return notFound("User not found");

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") return unauthorized();
    if (err instanceof Error && err.message === "Forbidden") return forbidden();
    return serverError();
  }
}
