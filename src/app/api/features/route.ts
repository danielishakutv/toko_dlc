import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { serverError } from "@/lib/auth";

const KNOWN_FLAGS = ["assessments", "attendance", "announcements", "certificates", "support"];

export async function GET() {
  try {
    const { rows } = await pool.query(
      "SELECT key, enabled FROM feature_flags WHERE key = ANY($1)",
      [KNOWN_FLAGS]
    );

    const flags: Record<string, boolean> = {};
    // Default all to true, then override with DB values
    for (const key of KNOWN_FLAGS) flags[key] = true;
    for (const row of rows) flags[row.key] = row.enabled;

    return NextResponse.json(flags);
  } catch {
    return serverError();
  }
}
