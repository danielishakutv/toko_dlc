export interface LessonContent {
  videoId: string;
  duration: string;
  body: string;          // HTML-safe plain text rendered with paragraphs / headings
  subtopics: string[];
}

export interface CourseResource {
  type: "pdf" | "link";
  title: string;
  description: string;
  size?: string;          // for PDFs
  url?: string;           // for external links
}

export interface CourseContent {
  lessons: Record<string, LessonContent>;
  resources: CourseResource[];
}

// ──────────────────────────────────────────
// Web Development Fundamentals
// ──────────────────────────────────────────
const webDev: CourseContent = {
  lessons: {
    "What is HTML?": {
      videoId: "dQw4w9WgXcQ",
      duration: "12 min",
      body: "HTML (HyperText Markup Language) is the standard language for creating web pages. Every website you visit is built on an HTML foundation that tells the browser how to structure and display content. In this lesson we explore why HTML matters, how browsers interpret markup, and the role HTML plays in the broader web technology stack alongside CSS and JavaScript.",
      subtopics: ["History of HTML", "How browsers render pages", "HTML5 and modern standards", "The role of the W3C"],
    },
    "Document structure": {
      videoId: "dQw4w9WgXcQ",
      duration: "15 min",
      body: "A well-structured HTML document starts with a DOCTYPE declaration followed by the html, head, and body elements. The head contains metadata such as the page title, character encoding, and links to stylesheets, while the body holds the visible content. Understanding this structure is essential for building accessible, SEO-friendly websites.",
      subtopics: ["DOCTYPE declaration", "The head element", "Meta tags and SEO", "Semantic vs non-semantic markup"],
    },
    "Tags & elements": {
      videoId: "dQw4w9WgXcQ",
      duration: "18 min",
      body: "HTML tags are the building blocks of every web page. Each tag has an opening and closing form that wraps content and gives it meaning. In this lesson we cover the most commonly used tags — headings, paragraphs, links, images, lists, and tables — and learn the difference between block-level and inline elements.",
      subtopics: ["Block vs inline elements", "Self-closing tags", "Nesting rules", "Common HTML tags reference"],
    },
    "Forms & inputs": {
      videoId: "dQw4w9WgXcQ",
      duration: "20 min",
      body: "Forms allow users to submit data to a server and are central to any interactive website — from login screens to search bars to checkout flows. This lesson covers the form element, input types (text, email, password, checkbox, radio), labels, validation attributes, and how form data is sent to a backend.",
      subtopics: ["The form element and action attribute", "Input types deep dive", "Client-side validation", "Accessible form design"],
    },
    "CSS selectors": {
      videoId: "dQw4w9WgXcQ",
      duration: "14 min",
      body: "CSS selectors let you target specific HTML elements to apply styles. Mastering selectors is the foundation of writing clean, maintainable CSS. We cover element selectors, class selectors, ID selectors, combinators, pseudo-classes, and attribute selectors.",
      subtopics: ["Specificity hierarchy", "Class vs ID selectors", "Pseudo-classes and pseudo-elements", "Attribute selectors"],
    },
    "Box model": {
      videoId: "dQw4w9WgXcQ",
      duration: "16 min",
      body: "Every HTML element is rendered as a rectangular box consisting of content, padding, border, and margin. Understanding the box model is critical for controlling layout and spacing. We also cover the difference between content-box and border-box sizing and when to use each.",
      subtopics: ["Content, padding, border, margin", "Box-sizing property", "Collapsing margins", "Debugging with DevTools"],
    },
    "Flexbox & Grid": {
      videoId: "dQw4w9WgXcQ",
      duration: "22 min",
      body: "Flexbox and CSS Grid are modern layout systems that make it dramatically easier to build complex, responsive page layouts. Flexbox is ideal for one-dimensional alignment (rows or columns), while Grid excels at two-dimensional layouts. This lesson walks through real-world examples of both.",
      subtopics: ["Flex container and items", "Main axis vs cross axis", "Grid template areas", "When to use Flexbox vs Grid"],
    },
    "Responsive design": {
      videoId: "dQw4w9WgXcQ",
      duration: "19 min",
      body: "Responsive design ensures your website looks great on every screen size — from phones to ultrawide monitors. Using media queries, fluid grids, flexible images, and modern CSS units like rem and vw, you can create layouts that adapt seamlessly. We also cover the mobile-first approach and its benefits.",
      subtopics: ["Media queries", "Mobile-first strategy", "Fluid typography", "Responsive images and srcset"],
    },
    "Variables & types": {
      videoId: "dQw4w9WgXcQ",
      duration: "17 min",
      body: "JavaScript variables store data that your program can use and manipulate. We cover the three declaration keywords — var, let, and const — and the primitive data types: strings, numbers, booleans, null, undefined, and symbols. Understanding how JavaScript handles types (including type coercion) is fundamental for avoiding bugs.",
      subtopics: ["var vs let vs const", "Primitive types", "Type coercion", "Template literals"],
    },
    "Functions": {
      videoId: "dQw4w9WgXcQ",
      duration: "21 min",
      body: "Functions are reusable blocks of code that perform a specific task. In JavaScript you can define functions using declarations, expressions, and arrow syntax. This lesson covers parameters, return values, scope, closures, and how functions are first-class citizens in JavaScript.",
      subtopics: ["Function declarations vs expressions", "Arrow functions", "Scope and closures", "Higher-order functions"],
    },
    "DOM manipulation": {
      videoId: "dQw4w9WgXcQ",
      duration: "23 min",
      body: "The Document Object Model (DOM) is a tree-like representation of your HTML page that JavaScript can read and modify. Learning to select, create, update, and remove DOM elements is what makes web pages interactive. We cover querySelector, createElement, innerHTML vs textContent, and best practices for DOM performance.",
      subtopics: ["Selecting elements", "Creating and appending nodes", "Modifying attributes and classes", "Performance considerations"],
    },
    "Events & listeners": {
      videoId: "dQw4w9WgXcQ",
      duration: "20 min",
      body: "Events are actions or occurrences — clicks, key presses, form submissions — that your JavaScript code can respond to. Event listeners let you attach handler functions to elements. This lesson covers addEventListener, event objects, bubbling and capturing, event delegation, and how to prevent default browser behavior.",
      subtopics: ["addEventListener syntax", "Event bubbling and capturing", "Event delegation pattern", "Preventing default behavior"],
    },
  },
  resources: [
    { type: "pdf", title: "HTML5 Cheat Sheet", description: "Quick reference for all HTML5 elements and attributes", size: "1.2 MB" },
    { type: "pdf", title: "CSS Flexbox & Grid Guide", description: "Visual guide to modern CSS layout techniques", size: "2.4 MB" },
    { type: "pdf", title: "JavaScript ES6+ Reference", description: "Comprehensive reference for modern JavaScript features", size: "1.8 MB" },
    { type: "link", title: "MDN Web Docs", description: "The definitive resource for HTML, CSS, and JavaScript documentation", url: "https://developer.mozilla.org" },
    { type: "link", title: "Can I Use", description: "Browser compatibility tables for modern web technologies", url: "https://caniuse.com" },
    { type: "link", title: "CSS-Tricks", description: "Tips, tricks, and techniques on using CSS", url: "https://css-tricks.com" },
    { type: "link", title: "JavaScript.info", description: "The Modern JavaScript Tutorial — from basics to advanced", url: "https://javascript.info" },
  ],
};

// ──────────────────────────────────────────
// Data Science with Python
// ──────────────────────────────────────────
const dataScience: CourseContent = {
  lessons: {
    "Python refresher": {
      videoId: "dQw4w9WgXcQ",
      duration: "15 min",
      body: "Before diving into data science, we review core Python concepts including variables, data types, control flow, list comprehensions, and functions. This refresher ensures everyone starts from a solid foundation regardless of their prior experience level.",
      subtopics: ["Data types and variables", "Control flow and loops", "List comprehensions", "Functions and modules"],
    },
    "NumPy arrays": {
      videoId: "dQw4w9WgXcQ",
      duration: "18 min",
      body: "NumPy is the fundamental package for numerical computing in Python. Its ndarray object provides fast, memory-efficient multi-dimensional arrays with a rich set of operations for mathematical computation, broadcasting, and linear algebra.",
      subtopics: ["Creating arrays", "Array indexing and slicing", "Broadcasting", "Mathematical operations"],
    },
    "Pandas DataFrames": {
      videoId: "dQw4w9WgXcQ",
      duration: "22 min",
      body: "Pandas DataFrames are the workhorse of data analysis in Python. They provide a tabular data structure with labelled axes, making it easy to load, filter, transform, and aggregate datasets of any size. This lesson covers creation, indexing, selection, and common operations.",
      subtopics: ["Creating DataFrames", "Indexing with loc and iloc", "Filtering and sorting", "Groupby operations"],
    },
    "Data cleaning": {
      videoId: "dQw4w9WgXcQ",
      duration: "20 min",
      body: "Real-world data is messy. Missing values, duplicates, inconsistent formats, and outliers are all common issues that must be addressed before analysis. This lesson teaches techniques for identifying and handling dirty data using Pandas.",
      subtopics: ["Handling missing values", "Removing duplicates", "Data type conversion", "Outlier detection"],
    },
    "Matplotlib basics": {
      videoId: "dQw4w9WgXcQ",
      duration: "16 min",
      body: "Matplotlib is the most widely used plotting library in Python. We cover the fundamentals of creating line charts, bar charts, scatter plots, and histograms, as well as customizing labels, colors, and legends.",
      subtopics: ["Figure and axes objects", "Line and bar charts", "Customizing plots", "Saving charts to file"],
    },
    "Seaborn plots": {
      videoId: "dQw4w9WgXcQ",
      duration: "14 min",
      body: "Seaborn builds on Matplotlib to provide a high-level interface for creating attractive statistical graphics. With just a few lines of code you can produce heatmaps, violin plots, pair plots, and more — perfect for exploratory data analysis.",
      subtopics: ["Statistical plots", "Heatmaps and pair plots", "Theming and color palettes", "Integrating with Pandas"],
    },
    "Interactive charts": {
      videoId: "dQw4w9WgXcQ",
      duration: "17 min",
      body: "Static charts tell a story, but interactive charts let your audience explore the data themselves. This lesson introduces Plotly and its Express API for creating responsive, zoomable, and hoverable visualizations suitable for dashboards and reports.",
      subtopics: ["Plotly Express overview", "Hover and zoom features", "Dashboards with Dash", "Exporting interactive charts"],
    },
    "Storytelling with data": {
      videoId: "dQw4w9WgXcQ",
      duration: "13 min",
      body: "Effective data visualization is about more than just charts — it is about communicating insights clearly. This lesson covers principles of visual storytelling: choosing the right chart type, reducing clutter, using color purposefully, and guiding the viewer's attention.",
      subtopics: ["Choosing chart types", "Decluttering visuals", "Color theory for data", "Narrative structure"],
    },
    "Supervised learning": {
      videoId: "dQw4w9WgXcQ",
      duration: "19 min",
      body: "Supervised learning is the most common type of machine learning where models learn from labelled training data to make predictions. We cover the end-to-end workflow: splitting data, training a model, making predictions, and evaluating accuracy.",
      subtopics: ["Training vs testing data", "Feature engineering", "Overfitting and underfitting", "Cross-validation"],
    },
    "Regression models": {
      videoId: "dQw4w9WgXcQ",
      duration: "21 min",
      body: "Regression models predict continuous numerical outcomes — house prices, temperatures, sales figures. We implement linear regression and polynomial regression with Scikit-learn and learn to interpret coefficients, residuals, and R-squared values.",
      subtopics: ["Linear regression", "Polynomial regression", "Interpreting coefficients", "Residual analysis"],
    },
    "Classification": {
      videoId: "dQw4w9WgXcQ",
      duration: "20 min",
      body: "Classification models predict discrete categories — spam vs not spam, approved vs rejected. This lesson covers logistic regression, decision trees, and random forests, with a focus on understanding how each algorithm makes its predictions.",
      subtopics: ["Logistic regression", "Decision trees", "Random forests", "Confusion matrix"],
    },
    "Model evaluation": {
      videoId: "dQw4w9WgXcQ",
      duration: "16 min",
      body: "Building a model is only half the job — you also need to evaluate how well it performs. This lesson covers accuracy, precision, recall, F1 score, ROC curves, and strategies for selecting the best model for your use case.",
      subtopics: ["Accuracy vs precision vs recall", "F1 score", "ROC and AUC", "Model selection strategies"],
    },
  },
  resources: [
    { type: "pdf", title: "Python Data Science Cheat Sheet", description: "Quick reference for Pandas, NumPy, and Matplotlib", size: "2.1 MB" },
    { type: "pdf", title: "Scikit-learn Algorithm Guide", description: "Decision flowchart for choosing the right ML algorithm", size: "1.5 MB" },
    { type: "link", title: "Kaggle", description: "Free datasets and machine learning competitions to practice", url: "https://kaggle.com" },
    { type: "link", title: "Pandas Documentation", description: "Official documentation for the Pandas library", url: "https://pandas.pydata.org/docs/" },
    { type: "link", title: "Scikit-learn User Guide", description: "Comprehensive guide to Scikit-learn models and pipelines", url: "https://scikit-learn.org/stable/user_guide.html" },
  ],
};

// ──────────────────────────────────────────
// Digital Marketing Essentials
// ──────────────────────────────────────────
const digitalMarketing: CourseContent = {
  lessons: {
    "How search engines work": {
      videoId: "dQw4w9WgXcQ",
      duration: "12 min",
      body: "Search engines use crawlers to discover web pages, indexers to organize them, and ranking algorithms to decide which results appear first. Understanding this pipeline is the foundation of SEO — once you know how Google sees your site, you can optimize accordingly.",
      subtopics: ["Crawling and indexing", "Ranking algorithms", "Search intent types", "SERP features"],
    },
    "Keyword research": {
      videoId: "dQw4w9WgXcQ",
      duration: "15 min",
      body: "Keyword research is the process of finding the words and phrases your target audience uses when searching. We cover free and paid tools, search volume vs competition analysis, long-tail keywords, and how to build a keyword strategy that drives qualified traffic.",
      subtopics: ["Search volume and competition", "Long-tail keywords", "Keyword tools overview", "Building a keyword map"],
    },
    "On-page SEO": {
      videoId: "dQw4w9WgXcQ",
      duration: "18 min",
      body: "On-page SEO refers to optimizations you make directly on your website — title tags, meta descriptions, headings, image alt text, URL structure, and internal linking. These elements signal relevance to search engines and improve click-through rates from search results.",
      subtopics: ["Title tags and meta descriptions", "Heading hierarchy", "Image optimization", "Internal linking"],
    },
    "Link building": {
      videoId: "dQw4w9WgXcQ",
      duration: "16 min",
      body: "Backlinks from authoritative websites are one of the strongest ranking signals. This lesson covers ethical link building strategies including guest posting, broken link building, digital PR, and creating link-worthy content.",
      subtopics: ["Domain authority", "Guest posting", "Broken link building", "Content-led link acquisition"],
    },
    "Platform strategy": {
      videoId: "dQw4w9WgXcQ",
      duration: "14 min",
      body: "Not every social platform is right for every business. This lesson helps you choose where to invest your time based on your audience demographics, content strengths, and marketing goals — covering Facebook, Instagram, LinkedIn, Twitter/X, TikTok, and YouTube.",
      subtopics: ["Audience demographics per platform", "Content format strengths", "B2B vs B2C strategy", "Platform algorithm basics"],
    },
    "Content creation": {
      videoId: "dQw4w9WgXcQ",
      duration: "17 min",
      body: "Great content is the engine of social media marketing. We cover content planning, visual design basics, copywriting tips, video content creation, and how to repurpose a single piece of content across multiple platforms.",
      subtopics: ["Content calendar planning", "Visual design principles", "Copywriting for social", "Repurposing content"],
    },
    "Community management": {
      videoId: "dQw4w9WgXcQ",
      duration: "13 min",
      body: "Building an engaged community means more than posting content — it requires active listening, timely responses, and genuine interaction. This lesson covers moderation, engagement tactics, handling negative feedback, and measuring community health.",
      subtopics: ["Engagement tactics", "Handling negative feedback", "Community guidelines", "Measuring engagement"],
    },
    "Paid ads": {
      videoId: "dQw4w9WgXcQ",
      duration: "19 min",
      body: "Paid social advertising lets you reach specific audiences with precision. We cover campaign objectives, audience targeting, ad formats, budgeting, bidding strategies, and how to optimize campaigns based on performance data.",
      subtopics: ["Campaign objectives", "Audience targeting", "Ad formats and creative", "Budget optimization"],
    },
    "Google Analytics setup": {
      videoId: "dQw4w9WgXcQ",
      duration: "15 min",
      body: "Google Analytics 4 is the industry standard for website analytics. This lesson walks through account setup, property configuration, installing the tracking code, setting up goals/events, and understanding the key reports you will use daily.",
      subtopics: ["GA4 account structure", "Installing tracking code", "Event tracking", "Key reports overview"],
    },
    "Tracking conversions": {
      videoId: "dQw4w9WgXcQ",
      duration: "14 min",
      body: "A conversion is any valuable action a visitor takes — a purchase, a signup, a download. We cover how to define conversion events, set up conversion tracking in GA4, attribute conversions to marketing channels, and calculate return on ad spend.",
      subtopics: ["Defining conversions", "Attribution models", "UTM parameters", "Return on ad spend"],
    },
    "A/B testing": {
      videoId: "dQw4w9WgXcQ",
      duration: "16 min",
      body: "A/B testing (split testing) lets you compare two versions of a page, email, or ad to see which performs better. We cover hypothesis formation, sample size calculation, test duration, statistical significance, and common pitfalls.",
      subtopics: ["Hypothesis formation", "Sample size calculation", "Statistical significance", "Common testing pitfalls"],
    },
    "Reporting": {
      videoId: "dQw4w9WgXcQ",
      duration: "12 min",
      body: "Data without storytelling is just numbers. This lesson teaches you how to build marketing reports that communicate performance clearly — choosing the right metrics, designing dashboards, writing executive summaries, and making data-driven recommendations.",
      subtopics: ["Choosing KPIs", "Dashboard design", "Executive summaries", "Data-driven recommendations"],
    },
  },
  resources: [
    { type: "pdf", title: "SEO Audit Checklist", description: "Step-by-step checklist for auditing any website's SEO", size: "0.8 MB" },
    { type: "pdf", title: "Social Media Content Calendar Template", description: "Monthly planning template for multi-platform content", size: "0.5 MB" },
    { type: "link", title: "Google Search Central", description: "Official Google resources for webmasters and SEO", url: "https://developers.google.com/search" },
    { type: "link", title: "Meta Business Suite", description: "Manage Facebook and Instagram marketing in one place", url: "https://business.facebook.com" },
    { type: "link", title: "Google Analytics Academy", description: "Free courses on Google Analytics from Google", url: "https://analytics.google.com/analytics/academy/" },
  ],
};

// ──────────────────────────────────────────
// UI/UX Design Principles
// ──────────────────────────────────────────
const uiUx: CourseContent = {
  lessons: {
    "User interviews": {
      videoId: "dQw4w9WgXcQ",
      duration: "16 min",
      body: "User interviews are one of the most powerful UX research methods. By speaking directly with real users you uncover pain points, motivations, and behaviors that surveys and analytics cannot reveal. This lesson covers planning, recruiting participants, conducting interviews, and synthesizing findings.",
      subtopics: ["Interview planning", "Recruiting participants", "Question techniques", "Synthesizing findings"],
    },
    "Personas & journeys": {
      videoId: "dQw4w9WgXcQ",
      duration: "18 min",
      body: "Personas are fictional representations of your key user segments, based on research data. Journey maps visualize the steps users take to accomplish a goal, highlighting opportunities for improvement. Together they keep your team aligned on who you are designing for and why.",
      subtopics: ["Building personas from research", "Journey mapping steps", "Identifying pain points", "Communicating with stakeholders"],
    },
    "Information architecture": {
      videoId: "dQw4w9WgXcQ",
      duration: "20 min",
      body: "Information architecture (IA) is the practice of organizing and structuring content so users can find what they need. Good IA reduces cognitive load and improves navigation. We cover card sorting, site maps, navigation patterns, and labelling systems.",
      subtopics: ["Card sorting exercises", "Site maps", "Navigation patterns", "Labelling and taxonomy"],
    },
    "Design principles": {
      videoId: "dQw4w9WgXcQ",
      duration: "15 min",
      body: "Great UI design follows timeless principles: hierarchy, contrast, alignment, repetition, proximity, and whitespace. This lesson demonstrates each principle with real-world examples and shows how to apply them to create interfaces that are both beautiful and functional.",
      subtopics: ["Visual hierarchy", "Contrast and emphasis", "Alignment and grids", "Whitespace usage"],
    },
    "Typography & color": {
      videoId: "dQw4w9WgXcQ",
      duration: "17 min",
      body: "Typography and color are the two most impactful visual design tools. The right font pairing and color palette can establish brand identity, guide attention, and evoke emotion. We cover font selection, type scale, color theory, and accessibility considerations.",
      subtopics: ["Font pairing strategies", "Type scale and rhythm", "Color theory basics", "Accessibility and contrast ratios"],
    },
    "Component systems": {
      videoId: "dQw4w9WgXcQ",
      duration: "19 min",
      body: "A design system is a collection of reusable components and guidelines that ensure consistency across a product. This lesson covers atomic design methodology, building component libraries in Figma, documenting design tokens, and maintaining systems at scale.",
      subtopics: ["Atomic design methodology", "Building in Figma", "Design tokens", "Maintaining at scale"],
    },
    "Responsive layouts": {
      videoId: "dQw4w9WgXcQ",
      duration: "16 min",
      body: "Designing for multiple screen sizes requires a flexible approach to layout. We cover responsive grids, breakpoint strategies, adaptive vs responsive design, and how to design mobile-first interfaces that scale gracefully to larger screens.",
      subtopics: ["Responsive grid systems", "Breakpoint strategies", "Mobile-first design", "Adaptive vs responsive"],
    },
    "Wireframing tools": {
      videoId: "dQw4w9WgXcQ",
      duration: "14 min",
      body: "Wireframes are low-fidelity representations of a user interface that focus on structure and functionality rather than visual design. This lesson covers popular wireframing tools, techniques for rapid iteration, and how to present wireframes to stakeholders.",
      subtopics: ["Low-fidelity vs high-fidelity", "Figma wireframing", "Rapid iteration techniques", "Presenting to stakeholders"],
    },
    "Interactive prototypes": {
      videoId: "dQw4w9WgXcQ",
      duration: "21 min",
      body: "Interactive prototypes simulate real product interactions without writing code. They are invaluable for testing ideas, getting stakeholder buy-in, and validating designs before development. We build a clickable prototype in Figma from start to finish.",
      subtopics: ["Prototyping in Figma", "Transitions and animations", "Micro-interactions", "Prototype sharing"],
    },
    "Usability testing": {
      videoId: "dQw4w9WgXcQ",
      duration: "18 min",
      body: "Usability testing puts your design in front of real users to observe how they interact with it. This lesson covers test planning, task writing, moderated vs unmoderated testing, think-aloud protocol, and analyzing results to prioritize improvements.",
      subtopics: ["Test planning", "Task writing", "Moderated vs unmoderated", "Analyzing results"],
    },
    "Iterating on feedback": {
      videoId: "dQw4w9WgXcQ",
      duration: "13 min",
      body: "Design is an iterative process. After usability testing, you need to prioritize findings, make targeted improvements, and test again. This lesson covers affinity mapping, prioritization frameworks, communicating design changes, and knowing when a design is ready for development.",
      subtopics: ["Affinity mapping", "Prioritization frameworks", "Communicating changes", "Handoff to development"],
    },
  },
  resources: [
    { type: "pdf", title: "UX Research Toolkit", description: "Templates for interview guides, personas, and journey maps", size: "3.2 MB" },
    { type: "pdf", title: "Design System Starter Kit", description: "Foundational components and tokens for building a design system", size: "4.1 MB" },
    { type: "link", title: "Figma Community", description: "Free design files, plugins, and templates", url: "https://www.figma.com/community" },
    { type: "link", title: "Nielsen Norman Group", description: "Evidence-based UX research and articles", url: "https://www.nngroup.com" },
    { type: "link", title: "Laws of UX", description: "Collection of design principles and psychology heuristics", url: "https://lawsofux.com" },
  ],
};

// ──────────────────────────────────────────
// Cloud Computing Basics
// ──────────────────────────────────────────
const cloud: CourseContent = {
  lessons: {
    "What is cloud computing?": {
      videoId: "dQw4w9WgXcQ",
      duration: "14 min",
      body: "Cloud computing is the delivery of computing resources — servers, storage, databases, networking — over the internet on a pay-as-you-go basis. This lesson explains the benefits over traditional on-premises infrastructure, including scalability, cost efficiency, and global reach.",
      subtopics: ["On-premises vs cloud", "Benefits of cloud", "Cloud deployment models", "Shared responsibility model"],
    },
    "IaaS, PaaS, SaaS": {
      videoId: "dQw4w9WgXcQ",
      duration: "16 min",
      body: "Cloud services are typically categorized into three models: Infrastructure as a Service (IaaS), Platform as a Service (PaaS), and Software as a Service (SaaS). Each offers a different level of control and abstraction. Understanding the differences helps you choose the right service for your workload.",
      subtopics: ["IaaS overview", "PaaS overview", "SaaS overview", "Choosing the right model"],
    },
    "Major providers overview": {
      videoId: "dQw4w9WgXcQ",
      duration: "15 min",
      body: "The three largest cloud providers — AWS, Microsoft Azure, and Google Cloud Platform — each offer hundreds of services. This lesson compares their strengths, pricing models, global infrastructure, and the scenarios where each provider excels.",
      subtopics: ["AWS strengths", "Azure strengths", "GCP strengths", "Multi-cloud strategy"],
    },
    "Docker basics": {
      videoId: "dQw4w9WgXcQ",
      duration: "20 min",
      body: "Docker allows you to package applications and their dependencies into lightweight, portable containers. This lesson covers Docker concepts (images, containers, registries), writing a Dockerfile, building images, and running containers locally.",
      subtopics: ["Images and containers", "Writing a Dockerfile", "Building and running", "Docker Hub registry"],
    },
    "Container orchestration": {
      videoId: "dQw4w9WgXcQ",
      duration: "18 min",
      body: "When you run many containers across multiple hosts you need an orchestration tool to manage deployment, scaling, and networking. This lesson introduces Kubernetes — its architecture, pods, services, deployments, and how managed Kubernetes services simplify operations.",
      subtopics: ["Kubernetes architecture", "Pods and services", "Deployments and scaling", "Managed K8s services"],
    },
    "CI/CD pipelines": {
      videoId: "dQw4w9WgXcQ",
      duration: "19 min",
      body: "Continuous Integration and Continuous Deployment (CI/CD) automate the process of building, testing, and deploying software. This lesson covers pipeline concepts, popular tools (GitHub Actions, GitLab CI, Jenkins), and how to design a pipeline that ships code safely and frequently.",
      subtopics: ["CI vs CD concepts", "Pipeline stages", "GitHub Actions walkthrough", "Deployment strategies"],
    },
    "Terraform intro": {
      videoId: "dQw4w9WgXcQ",
      duration: "17 min",
      body: "Terraform is an open-source Infrastructure as Code tool that lets you define cloud resources in declarative configuration files. You can version, review, and reproduce your infrastructure just like application code. This lesson covers HCL syntax, providers, resources, and the plan/apply workflow.",
      subtopics: ["HCL syntax basics", "Providers and resources", "Plan and apply workflow", "State management"],
    },
    "Configuration management": {
      videoId: "dQw4w9WgXcQ",
      duration: "15 min",
      body: "Configuration management tools like Ansible ensure that servers are set up and maintained consistently. This lesson covers the difference between provisioning and configuration, Ansible playbooks, idempotency, and managing secrets securely.",
      subtopics: ["Provisioning vs configuration", "Ansible playbooks", "Idempotency", "Secret management"],
    },
    "Monitoring & logging": {
      videoId: "dQw4w9WgXcQ",
      duration: "16 min",
      body: "You cannot improve what you cannot measure. Monitoring and logging give you visibility into how your cloud applications perform and help you troubleshoot issues fast. We cover metrics, logs, traces, alerting, and popular tools like Prometheus, Grafana, and the ELK stack.",
      subtopics: ["Metrics vs logs vs traces", "Prometheus and Grafana", "ELK stack overview", "Alerting best practices"],
    },
  },
  resources: [
    { type: "pdf", title: "Docker Commands Cheat Sheet", description: "Essential Docker CLI commands for daily use", size: "0.6 MB" },
    { type: "pdf", title: "Kubernetes Architecture Diagram", description: "Visual overview of Kubernetes components and data flow", size: "1.1 MB" },
    { type: "link", title: "AWS Free Tier", description: "Explore AWS services for free within usage limits", url: "https://aws.amazon.com/free/" },
    { type: "link", title: "Terraform Registry", description: "Browse providers and modules for Terraform", url: "https://registry.terraform.io" },
    { type: "link", title: "Kubernetes Documentation", description: "Official Kubernetes docs and tutorials", url: "https://kubernetes.io/docs/" },
  ],
};

// ──────────────────────────────────────────
// Cybersecurity Awareness
// ──────────────────────────────────────────
const cybersecurity: CourseContent = {
  lessons: {
    "Common attack types": {
      videoId: "dQw4w9WgXcQ",
      duration: "14 min",
      body: "Cyber attacks come in many forms — from DDoS and SQL injection to ransomware and man-in-the-middle attacks. This lesson provides an overview of the most prevalent attack vectors, explains how they work at a high level, and discusses real-world examples of each.",
      subtopics: ["DDoS attacks", "SQL injection", "Ransomware", "Man-in-the-middle attacks"],
    },
    "Phishing & social engineering": {
      videoId: "dQw4w9WgXcQ",
      duration: "16 min",
      body: "Social engineering exploits human psychology rather than technical vulnerabilities. Phishing emails, pretexting, baiting, and tailgating are all techniques attackers use to trick people into revealing sensitive information. This lesson teaches you how to recognize and resist these attacks.",
      subtopics: ["Email phishing indicators", "Spear phishing", "Pretexting and baiting", "Reporting suspicious activity"],
    },
    "Malware overview": {
      videoId: "dQw4w9WgXcQ",
      duration: "15 min",
      body: "Malware is any software designed to damage, disrupt, or gain unauthorized access to systems. We cover the major categories — viruses, worms, trojans, spyware, adware, and ransomware — and discuss how modern endpoint protection tools detect and block them.",
      subtopics: ["Viruses and worms", "Trojans and spyware", "Ransomware deep dive", "Endpoint protection"],
    },
    "Password management": {
      videoId: "dQw4w9WgXcQ",
      duration: "12 min",
      body: "Weak or reused passwords are one of the most common entry points for attackers. This lesson covers password best practices, passphrase strategies, and how password managers help you maintain unique, strong credentials for every account.",
      subtopics: ["Password strength guidelines", "Passphrase strategies", "Password manager tools", "Credential stuffing defense"],
    },
    "Multi-factor authentication": {
      videoId: "dQw4w9WgXcQ",
      duration: "13 min",
      body: "Multi-factor authentication (MFA) adds a second layer of security beyond just a password. We cover the different MFA methods — SMS codes, authenticator apps, hardware keys — their security trade-offs, and how to enable MFA on your most important accounts.",
      subtopics: ["Something you know, have, are", "Authenticator apps", "Hardware security keys", "MFA bypass risks"],
    },
    "Encryption basics": {
      videoId: "dQw4w9WgXcQ",
      duration: "17 min",
      body: "Encryption converts readable data into an unreadable format that only authorized parties can decode. This lesson covers symmetric and asymmetric encryption, TLS/SSL, end-to-end encryption, and when to use encryption at rest vs in transit.",
      subtopics: ["Symmetric vs asymmetric", "TLS/SSL certificates", "End-to-end encryption", "Encryption at rest"],
    },
    "Secure browsing": {
      videoId: "dQw4w9WgXcQ",
      duration: "11 min",
      body: "Your web browser is your primary interface to the internet — and a common attack surface. This lesson covers recognizing secure connections (HTTPS), avoiding malicious downloads, browser security settings, VPN usage, and safe practices on public Wi-Fi.",
      subtopics: ["HTTPS and certificates", "Browser security settings", "VPN usage", "Public Wi-Fi safety"],
    },
    "Security policies": {
      videoId: "dQw4w9WgXcQ",
      duration: "14 min",
      body: "Organizational security starts with clear policies that define expected behaviors, access controls, and incident response procedures. This lesson covers acceptable use policies, access management, data classification, and how to build a security-aware culture.",
      subtopics: ["Acceptable use policies", "Access management", "Data classification", "Security culture"],
    },
    "Incident response": {
      videoId: "dQw4w9WgXcQ",
      duration: "16 min",
      body: "When a security incident occurs, a fast and coordinated response minimizes damage. This lesson covers the incident response lifecycle: preparation, identification, containment, eradication, recovery, and lessons learned — with a focus on practical runbooks.",
      subtopics: ["IR lifecycle phases", "Containment strategies", "Evidence preservation", "Post-incident review"],
    },
    "Compliance basics": {
      videoId: "dQw4w9WgXcQ",
      duration: "13 min",
      body: "Regulatory compliance frameworks like GDPR, HIPAA, and PCI-DSS set minimum security standards for handling data. Understanding which regulations apply to your organization and how to meet their requirements is essential for avoiding fines and building customer trust.",
      subtopics: ["GDPR overview", "HIPAA requirements", "PCI-DSS basics", "Audit preparation"],
    },
  },
  resources: [
    { type: "pdf", title: "Security Incident Response Template", description: "Ready-to-use runbook for handling security incidents", size: "1.0 MB" },
    { type: "pdf", title: "Phishing Awareness Poster", description: "Printable poster for office display with phishing red flags", size: "0.7 MB" },
    { type: "pdf", title: "Password Policy Template", description: "Organizational password policy template based on NIST guidelines", size: "0.4 MB" },
    { type: "link", title: "OWASP Top 10", description: "Top 10 web application security risks", url: "https://owasp.org/www-project-top-ten/" },
    { type: "link", title: "Have I Been Pwned", description: "Check if your email has been compromised in a data breach", url: "https://haveibeenpwned.com" },
    { type: "link", title: "NIST Cybersecurity Framework", description: "Framework for improving organizational cybersecurity", url: "https://www.nist.gov/cyberframework" },
  ],
};

// ──────────────────────────────────────────
// Export map keyed by course slug
// ──────────────────────────────────────────
export const courseContentMap: Record<string, CourseContent> = {
  "web-development-fundamentals": webDev,
  "data-science-with-python": dataScience,
  "digital-marketing-essentials": digitalMarketing,
  "ui-ux-design-principles": uiUx,
  "cloud-computing-basics": cloud,
  "cybersecurity-awareness": cybersecurity,
};
