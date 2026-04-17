import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { requireRole, unauthorized, forbidden, badRequest, serverError } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const payload = requireRole(req, "superadmin");
    void payload;

    const url = new URL(req.url);
    const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1"));
    const perPage = Math.min(100, Math.max(1, parseInt(url.searchParams.get("perPage") ?? "20")));
    const offset = (page - 1) * perPage;
    const search = url.searchParams.get("search")?.trim() ?? "";
    const roleFilter = url.searchParams.get("role")?.trim() ?? "";

    const conditions: string[] = [];
    const params: (string | number)[] = [];
    let paramIdx = 1;

    if (search) {
      conditions.push(`(first_name ILIKE $${paramIdx} OR last_name ILIKE $${paramIdx} OR email ILIKE $${paramIdx})`);
      params.push(`%${search}%`);
      paramIdx++;
    }
    if (roleFilter && ["student", "admin", "superadmin"].includes(roleFilter)) {
      conditions.push(`role = $${paramIdx}`);
      params.push(roleFilter);
      paramIdx++;
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const [usersRes, countRes] = await Promise.all([
      pool.query(
        `SELECT id, first_name, last_name, email, role, created_at
        FROM users ${where} ORDER BY created_at DESC LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`,
        [...params, perPage, offset]
      ),
      pool.query(`SELECT COUNT(*)::int AS total FROM users ${where}`, params),
    ]);

    return NextResponse.json({
      users: usersRes.rows.map((u) => ({
        id: u.id,
        firstName: u.first_name,
        lastName: u.last_name,
        email: u.email,
        role: u.role,
        createdAt: u.created_at,
      })),
      total: countRes.rows[0].total,
      page,
      perPage,
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") return unauthorized();
    if (err instanceof Error && err.message === "Forbidden") return forbidden();
    return serverError();
  }
}

export async function POST(req: NextRequest) {
  try {
    requireRole(req, "superadmin");

    const { firstName, lastName, email, password, role } = await req.json();

    if (!firstName || !lastName || !email || !password || !role) {
      return badRequest("All fields are required");
    }

    if (!["admin", "student"].includes(role)) {
      return badRequest("Role must be admin or student");
    }

    const hash = await bcrypt.hash(password, 12);

    const { rows } = await pool.query(
      `INSERT INTO users (first_name, last_name, email, password_hash, role, must_change_password)
      VALUES ($1, $2, $3, $4, $5, true)
      RETURNING id, first_name, last_name, email, role, created_at`,
      [firstName, lastName, email.toLowerCase().trim(), hash, role]
    );

    const user = rows[0];
    return NextResponse.json({
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      role: user.role,
      createdAt: user.created_at,
    }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") return unauthorized();
    if (err instanceof Error && err.message === "Forbidden") return forbidden();
    // Duplicate email
    const pgErr = err as { code?: string };
    if (pgErr.code === "23505") return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    return serverError();
  }
}
