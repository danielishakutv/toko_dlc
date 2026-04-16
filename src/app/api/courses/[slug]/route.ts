import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { notFound, serverError } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const courseRes = await pool.query(
      `SELECT id, slug, title, icon, description, about, price, hours, quizzes, has_certificate
      FROM courses WHERE slug = $1 AND published = true`,
      [slug]
    );

    if (!courseRes.rows.length) return notFound("Course not found");
    const course = courseRes.rows[0];

    const [sectionsRes, resourcesRes, faqsRes] = await Promise.all([
      pool.query(
        `SELECT
          cs.id AS section_id, cs.title AS section_title, cs.sort_order AS section_sort,
          l.id AS lesson_id, l.title AS lesson_title, l.video_url, l.duration,
          l.body, l.sort_order AS lesson_sort
        FROM course_sections cs
        LEFT JOIN lessons l ON l.section_id = cs.id
        WHERE cs.course_id = $1
        ORDER BY cs.sort_order, l.sort_order`,
        [course.id]
      ),
      pool.query(
        `SELECT id, type, title, description, url, file_size
        FROM course_resources WHERE course_id = $1 ORDER BY sort_order`,
        [course.id]
      ),
      pool.query(
        `SELECT id, question, answer FROM course_faqs WHERE course_id = $1 ORDER BY sort_order`,
        [course.id]
      ),
    ]);

    // Fetch subtopics for all lessons
    const lessonIds = sectionsRes.rows.map((r) => r.lesson_id).filter(Boolean);
    let subtopicsMap = new Map<string, string[]>();
    if (lessonIds.length > 0) {
      const subRes = await pool.query(
        `SELECT lesson_id, title FROM lesson_subtopics WHERE lesson_id = ANY($1) ORDER BY sort_order`,
        [lessonIds]
      );
      for (const row of subRes.rows) {
        if (!subtopicsMap.has(row.lesson_id)) subtopicsMap.set(row.lesson_id, []);
        subtopicsMap.get(row.lesson_id)!.push(row.title);
      }
    }

    // Build sections structure
    const sectionsMap = new Map<string, {
      id: string; title: string; sortOrder: number;
      lessons: Array<{ id: string; title: string; videoUrl: string | null; duration: string | null; body: string | null; sortOrder: number; subtopics: string[] }>;
    }>();
    for (const r of sectionsRes.rows) {
      if (!sectionsMap.has(r.section_id)) {
        sectionsMap.set(r.section_id, { id: r.section_id, title: r.section_title, sortOrder: r.section_sort, lessons: [] });
      }
      if (r.lesson_id) {
        sectionsMap.get(r.section_id)!.lessons.push({
          id: r.lesson_id,
          title: r.lesson_title,
          videoUrl: r.video_url,
          duration: r.duration,
          body: r.body,
          sortOrder: r.lesson_sort,
          subtopics: subtopicsMap.get(r.lesson_id) ?? [],
        });
      }
    }

    return NextResponse.json({
      id: course.id,
      slug: course.slug,
      title: course.title,
      icon: course.icon,
      description: course.description,
      about: course.about,
      price: parseFloat(course.price),
      hours: parseFloat(course.hours),
      quizzes: course.quizzes,
      hasCertificate: course.has_certificate,
      sections: Array.from(sectionsMap.values()),
      resources: resourcesRes.rows.map((r) => ({
        id: r.id, type: r.type, title: r.title,
        description: r.description, url: r.url, fileSize: r.file_size,
      })),
      faqs: faqsRes.rows.map((r) => ({ id: r.id, question: r.question, answer: r.answer })),
    });
  } catch {
    return serverError();
  }
}
