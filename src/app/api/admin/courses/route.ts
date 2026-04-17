import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { requireRole, unauthorized, forbidden, badRequest, serverError } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    requireRole(req, "superadmin");

    const url = new URL(req.url);
    const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1"));
    const perPage = Math.min(100, Math.max(1, parseInt(url.searchParams.get("perPage") ?? "20")));
    const offset = (page - 1) * perPage;
    const search = url.searchParams.get("search")?.trim() ?? "";
    const status = url.searchParams.get("status")?.trim() ?? "";

    const conditions: string[] = [];
    const params: (string | number | boolean)[] = [];
    let idx = 1;

    if (search) {
      conditions.push(`(c.title ILIKE $${idx} OR c.slug ILIKE $${idx})`);
      params.push(`%${search}%`);
      idx++;
    }
    if (status === "published") {
      conditions.push(`c.published = $${idx}`);
      params.push(true);
      idx++;
    } else if (status === "draft") {
      conditions.push(`c.published = $${idx}`);
      params.push(false);
      idx++;
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const [coursesRes, countRes] = await Promise.all([
      pool.query(
        `SELECT c.id, c.slug, c.title, c.icon, c.thumbnail_url, c.description, c.about,
                c.price, c.hours, c.quizzes, c.has_certificate, c.published, c.created_at,
                (SELECT COUNT(*)::int FROM enrollments e WHERE e.course_id = c.id) AS enrolled_count,
                (SELECT COUNT(*)::int FROM course_sections cs WHERE cs.course_id = c.id) AS section_count
         FROM courses c ${where}
         ORDER BY c.created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`,
        [...params, perPage, offset]
      ),
      pool.query(`SELECT COUNT(*)::int AS total FROM courses c ${where}`, params),
    ]);

    return NextResponse.json({
      courses: coursesRes.rows.map((c) => ({
        id: c.id,
        slug: c.slug,
        title: c.title,
        icon: c.icon,
        thumbnailUrl: c.thumbnail_url,
        description: c.description,
        about: c.about,
        price: parseFloat(c.price),
        hours: parseFloat(c.hours),
        quizzes: c.quizzes,
        hasCertificate: c.has_certificate,
        published: c.published,
        createdAt: c.created_at,
        enrolledCount: c.enrolled_count,
        sectionCount: c.section_count,
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

    const body = await req.json();
    const { title, slug, icon, thumbnailUrl, description, about, price, hours, quizzes, hasCertificate, published } = body;

    if (!title || !slug || !description || !about) {
      return badRequest("Title, slug, description, and about are required");
    }

    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return badRequest("Slug must contain only lowercase letters, numbers, and hyphens");
    }

    // Check slug uniqueness
    const existing = await pool.query("SELECT id FROM courses WHERE slug = $1", [slug]);
    if (existing.rows.length > 0) {
      return badRequest("A course with this slug already exists");
    }

    const result = await pool.query(
      `INSERT INTO courses (title, slug, icon, thumbnail_url, description, about, price, hours, quizzes, has_certificate, published)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id`,
      [
        title, slug, icon || "book", thumbnailUrl || null,
        description, about,
        price || 0, hours || 0, quizzes || 0,
        hasCertificate ?? false, published ?? false,
      ]
    );

    return NextResponse.json({ id: result.rows[0].id }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") return unauthorized();
    if (err instanceof Error && err.message === "Forbidden") return forbidden();
    return serverError();
  }
}
