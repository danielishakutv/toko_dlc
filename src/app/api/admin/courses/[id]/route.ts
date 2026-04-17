import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { requireRole, unauthorized, forbidden, badRequest, notFound, serverError } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireRole(req, "superadmin");
    const { id } = await params;

    const courseRes = await pool.query(
      `SELECT c.*, 
              (SELECT COUNT(*)::int FROM enrollments e WHERE e.course_id = c.id) AS enrolled_count
       FROM courses c WHERE c.id = $1`,
      [id]
    );
    if (courseRes.rows.length === 0) return notFound("Course not found");

    const c = courseRes.rows[0];

    // Get sections with lessons
    const sectionsRes = await pool.query(
      `SELECT id, title, sort_order FROM course_sections WHERE course_id = $1 ORDER BY sort_order`,
      [id]
    );

    const sections = [];
    for (const sec of sectionsRes.rows) {
      const lessonsRes = await pool.query(
        `SELECT id, title, video_url, duration, body, quiz_url, sort_order FROM lessons WHERE section_id = $1 ORDER BY sort_order`,
        [sec.id]
      );
      sections.push({
        id: sec.id,
        title: sec.title,
        sortOrder: sec.sort_order,
        lessons: lessonsRes.rows.map((l) => ({
          id: l.id,
          title: l.title,
          videoUrl: l.video_url,
          duration: l.duration,
          body: l.body,
          quizUrl: l.quiz_url,
          sortOrder: l.sort_order,
        })),
      });
    }

    // Get FAQs
    const faqsRes = await pool.query(
      `SELECT id, question, answer, sort_order FROM course_faqs WHERE course_id = $1 ORDER BY sort_order`,
      [id]
    );

    return NextResponse.json({
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
      sections,
      faqs: faqsRes.rows.map((f) => ({
        id: f.id,
        question: f.question,
        answer: f.answer,
        sortOrder: f.sort_order,
      })),
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") return unauthorized();
    if (err instanceof Error && err.message === "Forbidden") return forbidden();
    return serverError();
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireRole(req, "superadmin");
    const { id } = await params;

    const body = await req.json();
    const allowed = ["title", "slug", "icon", "thumbnailUrl", "description", "about", "price", "hours", "quizzes", "hasCertificate", "published"];
    const colMap: Record<string, string> = {
      title: "title", slug: "slug", icon: "icon", thumbnailUrl: "thumbnail_url",
      description: "description", about: "about", price: "price", hours: "hours",
      quizzes: "quizzes", hasCertificate: "has_certificate", published: "published",
    };

    const sets: string[] = [];
    const vals: unknown[] = [];
    let idx = 1;

    for (const key of allowed) {
      if (body[key] !== undefined) {
        sets.push(`${colMap[key]} = $${idx}`);
        vals.push(body[key]);
        idx++;
      }
    }

    if (sets.length === 0) return badRequest("No fields to update");

    // If slug is being changed, validate it
    if (body.slug !== undefined) {
      if (!/^[a-z0-9-]+$/.test(body.slug)) {
        return badRequest("Slug must contain only lowercase letters, numbers, and hyphens");
      }
      const dup = await pool.query("SELECT id FROM courses WHERE slug = $1 AND id != $2", [body.slug, id]);
      if (dup.rows.length > 0) return badRequest("A course with this slug already exists");
    }

    sets.push(`updated_at = NOW()`);
    vals.push(id);

    const result = await pool.query(
      `UPDATE courses SET ${sets.join(", ")} WHERE id = $${idx} RETURNING id`,
      vals
    );

    if (result.rows.length === 0) return notFound("Course not found");
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") return unauthorized();
    if (err instanceof Error && err.message === "Forbidden") return forbidden();
    return serverError();
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireRole(req, "superadmin");
    const { id } = await params;

    const result = await pool.query("DELETE FROM courses WHERE id = $1 RETURNING id", [id]);
    if (result.rows.length === 0) return notFound("Course not found");

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") return unauthorized();
    if (err instanceof Error && err.message === "Forbidden") return forbidden();
    return serverError();
  }
}
