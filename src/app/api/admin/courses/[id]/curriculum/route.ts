import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { requireRole, unauthorized, forbidden, badRequest, notFound, serverError } from "@/lib/auth";

interface SectionInput {
  id?: string;
  title: string;
  sortOrder: number;
  lessons: LessonInput[];
}

interface LessonInput {
  id?: string;
  title: string;
  videoUrl?: string;
  duration?: string;
  body?: string;
  sortOrder: number;
}

// Replace the entire curriculum for a course
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireRole(req, "superadmin");
    const { id } = await params;

    // Verify course exists
    const course = await pool.query("SELECT id FROM courses WHERE id = $1", [id]);
    if (course.rows.length === 0) return notFound("Course not found");

    const { sections } = await req.json() as { sections: SectionInput[] };
    if (!Array.isArray(sections)) return badRequest("sections must be an array");

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Delete all existing sections (cascades to lessons)
      await client.query("DELETE FROM course_sections WHERE course_id = $1", [id]);

      // Insert new sections and lessons
      for (const sec of sections) {
        const secRes = await client.query(
          "INSERT INTO course_sections (course_id, title, sort_order) VALUES ($1, $2, $3) RETURNING id",
          [id, sec.title, sec.sortOrder]
        );
        const secId = secRes.rows[0].id;

        for (const lesson of sec.lessons || []) {
          await client.query(
            "INSERT INTO lessons (section_id, title, video_url, duration, body, sort_order) VALUES ($1, $2, $3, $4, $5, $6)",
            [secId, lesson.title, lesson.videoUrl || null, lesson.duration || null, lesson.body || null, lesson.sortOrder]
          );
        }
      }

      await client.query("COMMIT");
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") return unauthorized();
    if (err instanceof Error && err.message === "Forbidden") return forbidden();
    return serverError();
  }
}
