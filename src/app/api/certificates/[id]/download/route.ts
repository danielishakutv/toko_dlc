import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { authenticate, unauthorized, notFound, serverError } from "@/lib/auth";
import { createReadStream, existsSync } from "fs";
import path from "path";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = authenticate(req);
    const { id } = await params;

    const { rows } = await pool.query(
      "SELECT file_url, user_id FROM certificates WHERE id = $1",
      [id]
    );

    if (!rows.length) return notFound("Certificate not found");
    const cert = rows[0];

    if (cert.user_id !== payload.userId && payload.role === "student") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!cert.file_url) {
      return NextResponse.json({ error: "Certificate file not available" }, { status: 404 });
    }

    const filePath = path.join(process.cwd(), "public", cert.file_url);
    if (!existsSync(filePath)) {
      return NextResponse.json({ error: "Certificate file not found on server" }, { status: 404 });
    }

    const stream = createReadStream(filePath);
    // @ts-expect-error Node stream to Response body
    return new NextResponse(stream, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="certificate-${id}.pdf"`,
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") return unauthorized();
    return serverError();
  }
}
