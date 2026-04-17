import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { requireRole, unauthorized, forbidden, badRequest, serverError } from "@/lib/auth";

const DEFAULT_PASSWORD = "Newuser1234";

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

export async function POST(req: NextRequest) {
  try {
    requireRole(req, "superadmin");

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) return badRequest("No file uploaded");
    if (!file.name.endsWith(".csv")) return badRequest("File must be a CSV");

    const text = await file.text();
    const rows = parseCsv(text);

    if (rows.length === 0) return badRequest("CSV is empty or has no data rows");

    // Validate required columns
    const first = rows[0];
    const required = ["first_name", "last_name", "email"];
    for (const col of required) {
      if (!(col in first)) {
        return badRequest(`Missing required column: ${col}`);
      }
    }

    const hash = await bcrypt.hash(DEFAULT_PASSWORD, 12);

    const results: { email: string; status: string; error?: string }[] = [];

    for (const row of rows) {
      const firstName = row.first_name?.trim();
      const lastName = row.last_name?.trim();
      const email = row.email?.trim().toLowerCase();
      const role = row.role?.trim().toLowerCase() || "student";

      if (!firstName || !lastName || !email) {
        results.push({ email: email || "(empty)", status: "skipped", error: "Missing required fields" });
        continue;
      }

      if (!["admin", "student"].includes(role)) {
        results.push({ email, status: "skipped", error: "Role must be admin or student" });
        continue;
      }

      // Basic email format check
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        results.push({ email, status: "skipped", error: "Invalid email format" });
        continue;
      }

      try {
        await pool.query(
          `INSERT INTO users (first_name, last_name, email, password_hash, role, must_change_password)
          VALUES ($1, $2, $3, $4, $5::user_role, true)`,
          [firstName, lastName, email, hash, role]
        );
        results.push({ email, status: "created" });
      } catch (err: unknown) {
        const pgErr = err as { code?: string };
        if (pgErr.code === "23505") {
          results.push({ email, status: "skipped", error: "Email already exists" });
        } else {
          results.push({ email, status: "failed", error: "Database error" });
        }
      }
    }

    const created = results.filter((r) => r.status === "created").length;
    const skipped = results.filter((r) => r.status === "skipped").length;
    const failed = results.filter((r) => r.status === "failed").length;

    return NextResponse.json({ created, skipped, failed, total: rows.length, results }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") return unauthorized();
    if (err instanceof Error && err.message === "Forbidden") return forbidden();
    return serverError();
  }
}
