export interface CourseSection {
  title: string;
  lessons: string[];
}

export interface Course {
  slug: string;
  title: string;
  icon: string;
  description: string;
  status: string | null;
  price: string;
  lectures: number;
  hours: number;
  quizzes: number;
  certificate: boolean;
  about: string;
  sections: CourseSection[];
  faqs: { q: string; a: string }[];
}

export const courses: Course[] = [
  {
    slug: "web-development-fundamentals",
    title: "Web Development Fundamentals",
    icon: "🌐",
    description:
      "Learn HTML, CSS, and JavaScript from scratch. Build real-world projects and launch your career in web development.",
    status: "Registered",
    price: "FREE",
    lectures: 12,
    hours: 4.5,
    quizzes: 3,
    certificate: true,
    about:
      "This course provides a comprehensive introduction to modern web development. You will learn to build responsive websites using HTML5, style them with CSS3, and add interactivity with JavaScript. By the end, you'll have a portfolio of projects demonstrating your skills to potential employers.",
    sections: [
      {
        title: "Getting Started with HTML",
        lessons: ["What is HTML?", "Document structure", "Tags & elements", "Forms & inputs"],
      },
      {
        title: "Styling with CSS",
        lessons: ["CSS selectors", "Box model", "Flexbox & Grid", "Responsive design"],
      },
      {
        title: "JavaScript Essentials",
        lessons: ["Variables & types", "Functions", "DOM manipulation", "Events & listeners"],
      },
    ],
    faqs: [
      { q: "Do I need prior experience?", a: "No. This course is designed for complete beginners." },
      { q: "How long do I have access?", a: "Once enrolled, you have lifetime access to all materials." },
      { q: "Is there a certificate?", a: "Yes — you'll receive a certificate of completion after finishing all modules." },
    ],
  },
  {
    slug: "data-science-with-python",
    title: "Data Science with Python",
    icon: "📊",
    description:
      "Master data analysis, visualization, and machine learning using Python and popular libraries like Pandas and Scikit-learn.",
    status: null,
    price: "FREE",
    lectures: 10,
    hours: 3.2,
    quizzes: 4,
    certificate: true,
    about:
      "Dive into the world of data science with Python. This course covers data wrangling with Pandas, visualization with Matplotlib, and building predictive models with Scikit-learn. You'll work on real datasets and gain practical skills employers are looking for.",
    sections: [
      {
        title: "Python for Data Science",
        lessons: ["Python refresher", "NumPy arrays", "Pandas DataFrames", "Data cleaning"],
      },
      {
        title: "Data Visualization",
        lessons: ["Matplotlib basics", "Seaborn plots", "Interactive charts", "Storytelling with data"],
      },
      {
        title: "Machine Learning Intro",
        lessons: ["Supervised learning", "Regression models", "Classification", "Model evaluation"],
      },
    ],
    faqs: [
      { q: "Do I need to know Python?", a: "Basic Python knowledge helps, but we include a refresher module." },
      { q: "What tools do I need?", a: "Just a browser — we provide cloud-based Jupyter notebooks." },
      { q: "Can I use this for my job?", a: "Absolutely. The skills taught are directly applicable to industry roles." },
    ],
  },
  {
    slug: "digital-marketing-essentials",
    title: "Digital Marketing Essentials",
    icon: "📱",
    description:
      "Understand SEO, social media marketing, content strategy, and analytics to grow any business online.",
    status: null,
    price: "FREE",
    lectures: 8,
    hours: 2.0,
    quizzes: 2,
    certificate: true,
    about:
      "Learn how to build and execute digital marketing strategies that drive real results. From search engine optimization to social media campaigns, this course gives you the tools and frameworks used by top marketing professionals.",
    sections: [
      {
        title: "SEO Fundamentals",
        lessons: ["How search engines work", "Keyword research", "On-page SEO", "Link building"],
      },
      {
        title: "Social Media Marketing",
        lessons: ["Platform strategy", "Content creation", "Community management", "Paid ads"],
      },
      {
        title: "Analytics & Measurement",
        lessons: ["Google Analytics setup", "Tracking conversions", "A/B testing", "Reporting"],
      },
    ],
    faqs: [
      { q: "Is this for beginners?", a: "Yes — no marketing experience required." },
      { q: "Will I get hands-on practice?", a: "Each module includes practical exercises with real tools." },
    ],
  },
  {
    slug: "ui-ux-design-principles",
    title: "UI/UX Design Principles",
    icon: "🎨",
    description:
      "Learn user-centered design, wireframing, prototyping, and usability testing to create delightful digital experiences.",
    status: "Registered",
    price: "FREE",
    lectures: 9,
    hours: 3.0,
    quizzes: 2,
    certificate: true,
    about:
      "This course teaches you how to design digital products people love. You'll learn the principles of user experience research, create wireframes and prototypes, and conduct usability tests — everything you need to start a career in product design.",
    sections: [
      {
        title: "UX Research",
        lessons: ["User interviews", "Personas & journeys", "Information architecture"],
      },
      {
        title: "UI Design",
        lessons: ["Design principles", "Typography & color", "Component systems", "Responsive layouts"],
      },
      {
        title: "Prototyping & Testing",
        lessons: ["Wireframing tools", "Interactive prototypes", "Usability testing", "Iterating on feedback"],
      },
    ],
    faqs: [
      { q: "Do I need design software?", a: "We use Figma (free) for all exercises." },
      { q: "Is this course project-based?", a: "Yes — you'll design a complete app from scratch." },
    ],
  },
  {
    slug: "cloud-computing-basics",
    title: "Cloud Computing Basics",
    icon: "☁️",
    description:
      "Get started with cloud platforms, deployment, and DevOps practices for modern software delivery.",
    status: null,
    price: "FREE",
    lectures: 7,
    hours: 2.5,
    quizzes: 2,
    certificate: false,
    about:
      "Understand the fundamentals of cloud computing and how modern applications are built, deployed, and scaled. This course covers major cloud providers, containerization, CI/CD pipelines, and infrastructure as code.",
    sections: [
      {
        title: "Cloud Fundamentals",
        lessons: ["What is cloud computing?", "IaaS, PaaS, SaaS", "Major providers overview"],
      },
      {
        title: "Containers & Deployment",
        lessons: ["Docker basics", "Container orchestration", "CI/CD pipelines"],
      },
      {
        title: "Infrastructure as Code",
        lessons: ["Terraform intro", "Configuration management", "Monitoring & logging"],
      },
    ],
    faqs: [
      { q: "Do I need a cloud account?", a: "Free tiers from major providers are sufficient for all exercises." },
      { q: "Is DevOps experience required?", a: "No — we start from the basics." },
    ],
  },
  {
    slug: "cybersecurity-awareness",
    title: "Cybersecurity Awareness",
    icon: "🔒",
    description:
      "Learn to identify threats, protect data, and implement security best practices in your organization.",
    status: "Registered",
    price: "FREE",
    lectures: 6,
    hours: 1.8,
    quizzes: 3,
    certificate: true,
    about:
      "Cybersecurity is everyone's responsibility. This course teaches you how to recognize phishing attempts, secure your accounts, protect sensitive data, and build a culture of security awareness in your organization.",
    sections: [
      {
        title: "Threat Landscape",
        lessons: ["Common attack types", "Phishing & social engineering", "Malware overview"],
      },
      {
        title: "Protecting Your Data",
        lessons: ["Password management", "Multi-factor authentication", "Encryption basics", "Secure browsing"],
      },
      {
        title: "Organizational Security",
        lessons: ["Security policies", "Incident response", "Compliance basics"],
      },
    ],
    faqs: [
      { q: "Is this technical?", a: "No — it's designed for all professionals, not just IT staff." },
      { q: "How current is the content?", a: "Content is updated quarterly to reflect the latest threats." },
    ],
  },
];
