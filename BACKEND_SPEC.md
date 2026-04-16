# Toko Academy — Backend API Specification

## Table of Contents
1. [Database Schema](#database-schema)
2. [Data Shapes (Request / Response)](#data-shapes)
3. [API Endpoints](#api-endpoints)

---

## Database Schema

### users
| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK, auto-generated |
| first_name | VARCHAR(100) | NOT NULL |
| last_name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(255) | NOT NULL, UNIQUE |
| password_hash | VARCHAR(255) | NOT NULL |
| role | ENUM('superadmin', 'admin', 'student') | NOT NULL, DEFAULT 'student' |
| avatar_url | TEXT | NULLABLE |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() |

### courses
| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK, auto-generated |
| slug | VARCHAR(255) | NOT NULL, UNIQUE |
| title | VARCHAR(255) | NOT NULL |
| icon | VARCHAR(50) | NOT NULL |
| description | TEXT | NOT NULL |
| about | TEXT | NOT NULL |
| price | DECIMAL(10,2) | NOT NULL, DEFAULT 0 |
| hours | DECIMAL(4,1) | NOT NULL |
| quizzes | INT | NOT NULL, DEFAULT 0 |
| has_certificate | BOOLEAN | NOT NULL, DEFAULT false |
| published | BOOLEAN | NOT NULL, DEFAULT false |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() |

### course_sections
| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK, auto-generated |
| course_id | UUID | FK → courses.id, NOT NULL |
| title | VARCHAR(255) | NOT NULL |
| sort_order | INT | NOT NULL |

### lessons
| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK, auto-generated |
| section_id | UUID | FK → course_sections.id, NOT NULL |
| title | VARCHAR(255) | NOT NULL |
| video_url | TEXT | NULLABLE |
| duration | VARCHAR(20) | NULLABLE |
| body | TEXT | NULLABLE |
| sort_order | INT | NOT NULL |

### lesson_subtopics
| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK, auto-generated |
| lesson_id | UUID | FK → lessons.id, NOT NULL |
| title | VARCHAR(255) | NOT NULL |
| sort_order | INT | NOT NULL |

### course_resources
| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK, auto-generated |
| course_id | UUID | FK → courses.id, NOT NULL |
| type | ENUM('pdf', 'link') | NOT NULL |
| title | VARCHAR(255) | NOT NULL |
| description | TEXT | NULLABLE |
| url | TEXT | NULLABLE |
| file_size | VARCHAR(20) | NULLABLE |
| sort_order | INT | NOT NULL |

### course_faqs
| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK, auto-generated |
| course_id | UUID | FK → courses.id, NOT NULL |
| question | TEXT | NOT NULL |
| answer | TEXT | NOT NULL |
| sort_order | INT | NOT NULL |

### enrollments
| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK, auto-generated |
| user_id | UUID | FK → users.id, NOT NULL |
| course_id | UUID | FK → courses.id, NOT NULL |
| enrolled_at | TIMESTAMP | NOT NULL, DEFAULT NOW() |
| completed_at | TIMESTAMP | NULLABLE |
| UNIQUE(user_id, course_id) | | |

### lesson_completions
| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK, auto-generated |
| user_id | UUID | FK → users.id, NOT NULL |
| lesson_id | UUID | FK → lessons.id, NOT NULL |
| completed_at | TIMESTAMP | NOT NULL, DEFAULT NOW() |
| UNIQUE(user_id, lesson_id) | | |

### assessments
| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK, auto-generated |
| course_id | UUID | FK → courses.id, NOT NULL |
| title | VARCHAR(255) | NOT NULL |
| type | ENUM('quiz', 'assignment', 'exam') | NOT NULL |
| question_count | INT | NOT NULL |
| duration_minutes | INT | NOT NULL |
| due_date | DATE | NULLABLE |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() |

### assessment_submissions
| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK, auto-generated |
| assessment_id | UUID | FK → assessments.id, NOT NULL |
| user_id | UUID | FK → users.id, NOT NULL |
| status | ENUM('not_started', 'in_progress', 'completed') | NOT NULL, DEFAULT 'not_started' |
| score | DECIMAL(5,2) | NULLABLE |
| submitted_at | TIMESTAMP | NULLABLE |
| UNIQUE(assessment_id, user_id) | | |

### attendance_sessions
| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK, auto-generated |
| course_id | UUID | FK → courses.id, NOT NULL |
| topic | VARCHAR(255) | NOT NULL |
| session_date | DATE | NOT NULL |

### attendance_records
| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK, auto-generated |
| session_id | UUID | FK → attendance_sessions.id, NOT NULL |
| user_id | UUID | FK → users.id, NOT NULL |
| status | ENUM('present', 'absent', 'late') | NOT NULL |
| UNIQUE(session_id, user_id) | | |

### certificates
| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK, auto-generated |
| user_id | UUID | FK → users.id, NOT NULL |
| course_id | UUID | FK → courses.id, NOT NULL |
| credential_id | VARCHAR(50) | NOT NULL, UNIQUE |
| issued_at | TIMESTAMP | NOT NULL, DEFAULT NOW() |
| file_url | TEXT | NULLABLE |
| UNIQUE(user_id, course_id) | | |

### announcements
| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK, auto-generated |
| title | VARCHAR(255) | NOT NULL |
| body | TEXT | NOT NULL |
| category | ENUM('system', 'courses', 'course_update', 'general', 'event') | NOT NULL |
| pinned | BOOLEAN | NOT NULL, DEFAULT false |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() |

### support_tickets
| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK, auto-generated |
| user_id | UUID | FK → users.id, NOT NULL |
| subject | VARCHAR(255) | NOT NULL |
| message | TEXT | NOT NULL |
| status | ENUM('open', 'in_progress', 'resolved') | NOT NULL, DEFAULT 'open' |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() |

### feature_flags
| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK, auto-generated |
| key | VARCHAR(100) | NOT NULL, UNIQUE |
| enabled | BOOLEAN | NOT NULL, DEFAULT true |

---

## Data Shapes

### Auth

```typescript
// POST /api/auth/login — Request
{
  email: string;
  password: string;
}

// POST /api/auth/login — Response
{
  token: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: "superadmin" | "admin" | "student";
    avatarUrl: string | null;
  };
}
```

### Users (Superadmin only)

```typescript
// POST /api/admin/users — Request (create user account)
{
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "admin" | "student";
}

// POST /api/admin/users — Response
{
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "student";
  createdAt: string;
}

// GET /api/admin/users — Response
{
  users: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: "superadmin" | "admin" | "student";
    createdAt: string;
  }>;
  total: number;
  page: number;
  perPage: number;
}

// PATCH /api/admin/users/:id — Request
{
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: "admin" | "student";
}

// DELETE /api/admin/users/:id — Response
{ success: true }
```

### Profile (Authenticated user)

```typescript
// GET /api/me — Response
{
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatarUrl: string | null;
  createdAt: string;
}

// PATCH /api/me — Request
{
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
}

// PATCH /api/me/avatar — Request (multipart/form-data)
{
  file: File;
}
```

### Courses

```typescript
// GET /api/courses — Response
{
  courses: Array<{
    id: string;
    slug: string;
    title: string;
    icon: string;
    description: string;
    price: number;
    hours: number;
    lectureCount: number;
    quizzes: number;
    hasCertificate: boolean;
  }>;
}

// GET /api/courses/:slug — Response
{
  id: string;
  slug: string;
  title: string;
  icon: string;
  description: string;
  about: string;
  price: number;
  hours: number;
  quizzes: number;
  hasCertificate: boolean;
  sections: Array<{
    id: string;
    title: string;
    sortOrder: number;
    lessons: Array<{
      id: string;
      title: string;
      videoUrl: string | null;
      duration: string | null;
      body: string | null;
      sortOrder: number;
      subtopics: string[];
    }>;
  }>;
  resources: Array<{
    id: string;
    type: "pdf" | "link";
    title: string;
    description: string | null;
    url: string | null;
    fileSize: string | null;
  }>;
  faqs: Array<{
    id: string;
    question: string;
    answer: string;
  }>;
}
```

### Enrollments

```typescript
// POST /api/enrollments — Request
{
  courseId: string;
}

// POST /api/enrollments — Response
{
  id: string;
  courseId: string;
  enrolledAt: string;
}

// GET /api/me/enrollments — Response
{
  enrollments: Array<{
    id: string;
    course: {
      id: string;
      slug: string;
      title: string;
      icon: string;
      description: string;
      hours: number;
      lectureCount: number;
    };
    enrolledAt: string;
    completedAt: string | null;
    progress: number;           // 0–100 computed from lesson_completions
    completedLessons: number;
    totalLessons: number;
  }>;
}
```

### Lesson Completions

```typescript
// POST /api/lessons/:lessonId/complete — Response
{
  lessonId: string;
  completedAt: string;
}

// DELETE /api/lessons/:lessonId/complete — Response
{ success: true }

// GET /api/courses/:slug/progress — Response
{
  completedLessonIds: string[];
  totalLessons: number;
  completedCount: number;
  progressPercent: number;
}
```

### Assessments

```typescript
// GET /api/me/assessments — Response
{
  assessments: Array<{
    id: string;
    title: string;
    course: { id: string; title: string; };
    type: "quiz" | "assignment" | "exam";
    questionCount: number;
    durationMinutes: number;
    dueDate: string | null;
    status: "not_started" | "in_progress" | "completed";
    score: number | null;
    submittedAt: string | null;
  }>;
}
```

### Attendance

```typescript
// GET /api/me/attendance — Response
{
  summary: {
    present: number;
    absent: number;
    late: number;
  };
  courses: Array<{
    courseId: string;
    courseTitle: string;
    courseIcon: string;
    sessions: Array<{
      id: string;
      date: string;
      topic: string;
      status: "present" | "absent" | "late";
    }>;
  }>;
}
```

### Certificates

```typescript
// GET /api/me/certificates — Response
{
  certificates: Array<{
    id: string;
    course: { id: string; title: string; icon: string; };
    credentialId: string;
    issuedAt: string;
    fileUrl: string | null;
  }>;
  pending: Array<{
    course: { id: string; title: string; icon: string; };
    progressPercent: number;
  }>;
}

// GET /api/certificates/:id/download — Response
Binary PDF stream (Content-Type: application/pdf)
```

### Announcements

```typescript
// GET /api/announcements — Response
{
  announcements: Array<{
    id: string;
    title: string;
    body: string;
    category: "system" | "courses" | "course_update" | "general" | "event";
    pinned: boolean;
    createdAt: string;
  }>;
}
```

### Support Tickets

```typescript
// POST /api/support — Request
{
  subject: string;
  message: string;
}

// POST /api/support — Response
{
  id: string;
  subject: string;
  status: "open";
  createdAt: string;
}

// GET /api/me/support-tickets — Response
{
  tickets: Array<{
    id: string;
    subject: string;
    message: string;
    status: "open" | "in_progress" | "resolved";
    createdAt: string;
    updatedAt: string;
  }>;
}
```

### Dashboard Summary

```typescript
// GET /api/me/dashboard — Response
{
  stats: {
    enrolledCourses: number;
    completedCourses: number;
    inProgressCourses: number;
    certificatesEarned: number;
  };
  upcomingDeadlines: Array<{
    courseTitle: string;
    task: string;
    dueDate: string;
  }>;
  recentActivity: Array<{
    action: string;
    detail: string;
    timestamp: string;
  }>;
  courseProgress: Array<{
    courseSlug: string;
    courseTitle: string;
    courseIcon: string;
    progressPercent: number;
  }>;
}
```

### Feature Flags

```typescript
// GET /api/features — Response
{
  assessments: boolean;
  attendance: boolean;
  announcements: boolean;
  certificates: boolean;
  support: boolean;
}
```

---

## API Endpoints

All endpoints prefixed with `/api`. Authenticated routes require `Authorization: Bearer <token>` header.

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/login` | Public | Sign in, returns JWT + user |
| POST | `/api/auth/logout` | Authenticated | Invalidate token |

### User Management (Superadmin only)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/admin/users` | Superadmin | List all users (paginated) |
| GET | `/api/admin/users/:id` | Superadmin | Get single user |
| POST | `/api/admin/users` | Superadmin | Create a new user account |
| PATCH | `/api/admin/users/:id` | Superadmin | Update user details / role |
| DELETE | `/api/admin/users/:id` | Superadmin | Delete a user account |

### Profile
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/me` | Authenticated | Get current user profile |
| PATCH | `/api/me` | Authenticated | Update own profile |
| PATCH | `/api/me/avatar` | Authenticated | Upload avatar image |

### Dashboard
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/me/dashboard` | Authenticated | Stats, deadlines, activity, progress |

### Courses
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/courses` | Public | List all published courses |
| GET | `/api/courses/:slug` | Public | Full course detail with sections/lessons |

### Enrollments
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/me/enrollments` | Authenticated | List user's enrolled courses + progress |
| POST | `/api/enrollments` | Authenticated | Enroll in a course |
| DELETE | `/api/enrollments/:id` | Authenticated | Unenroll from a course |

### Lesson Progress
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/courses/:slug/progress` | Authenticated | Get completion state for a course |
| POST | `/api/lessons/:lessonId/complete` | Authenticated | Mark lesson as complete |
| DELETE | `/api/lessons/:lessonId/complete` | Authenticated | Unmark lesson completion |

### Assessments
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/me/assessments` | Authenticated | List user's assessments + scores |

### Attendance
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/me/attendance` | Authenticated | Attendance summary + per-course records |

### Certificates
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/me/certificates` | Authenticated | List earned + pending certificates |
| GET | `/api/certificates/:id/download` | Authenticated | Download certificate PDF |

### Announcements
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/announcements` | Authenticated | List all announcements |

### Support
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/support` | Authenticated | Submit a support ticket |
| GET | `/api/me/support-tickets` | Authenticated | List own support tickets |

### Feature Flags
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/features` | Public | Get enabled/disabled feature flags |

---

## Auth Notes

- **No public signup.** Only a superadmin can create user accounts via `POST /api/admin/users`.
- Users receive their credentials from the admin and sign in at `POST /api/auth/login`.
- JWT tokens should include `userId`, `role`, and `exp` claims.
- Role-based middleware: `superadmin` → full access, `admin` → manage content, `student` → read-only dashboard.
- Password hashing: bcrypt with minimum 12 rounds.
- Tokens: short-lived access token (15 min) + httpOnly refresh token (7 days) recommended.
