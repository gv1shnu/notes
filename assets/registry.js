/* =====================================================================
   REGISTRY — the list of folders on the desk
   ---------------------------------------------------------------------
   HOW TO ADD A NEW REPO FOLDER
     1. copy any existing folder (e.g. ppt/) to <new-slug>/
     2. set <body data-repo="new-slug" data-page="..."> on each page
     3. add an entry to `repos` below — `pages` order = tab order
   HOW TO ADD A PAGE TO AN EXISTING FOLDER
     create <slug>/<file>.html and add {file, title} to that repo's pages
   Fields:
     slug     folder name == GitHub repo name
     shelf    id from `shelves`
     status   deployed | wip | local | archived | assignment
     start/end  first and last commit date (YYYY-MM-DD) — drives the calendar
     commits  commit count on the default branch when the notes were written
   ===================================================================== */
window.NOTEBOOK = {
  title: "Workshop Notes",
  owner: "Vishnu Gandarapu",

  // EDIT: shelf order on the desk = order here
  shelves: [
    { id: "games", title: "Games & simulations", blurb: "things you play" },
    { id: "data", title: "Databases & SQL", blurb: "where most of my work lives" },
    { id: "web", title: "Web platforms", blurb: "full-stack apps with users" },
    { id: "ai", title: "AI, voice & local models", blurb: "LLMs on my own machine" },
    { id: "security", title: "Security & privacy", blurb: "breaking things, ethically" },
    { id: "tools", title: "Tools, scrapers & data", blurb: "small machines that save me time" },
    { id: "site", title: "Personal site & teaching", blurb: "the public face" },
    { id: "assignments", title: "Take-home assignments", blurb: "built to a brief" }
  ],

  // EDIT: one entry per repo folder (kept in commit order)
  repos: [
    { // ppt
      slug: "ppt", name: "ppt", shelf: "ai", status: "local",
      tagline: "Plain-English brief → styled .pptx, drafted by a local 3B model, drawn by Python.",
      url: "https://github.com/gv1shnu/ppt", live: null,
      start: "2026-08-18", end: "2026-08-18", commits: 1,
      stack: ["Python", "python-pptx", "Ollama"],
      pages: [ { file: "index", title: "Cover & problem" }, { file: "blueprint", title: "Blueprint" }, { file: "rebuild", title: "Log, decisions & rebuild" } ]
    },
    { // txt2sql2txt
      slug: "txt2sql2txt", name: "txt2sql2txt", shelf: "data", status: "deployed",
      tagline: "Two-way English ⇄ SQL in one static page, with an offline engine and real Postgres in the browser.",
      url: "https://github.com/gv1shnu/txt2sql2txt", live: "http://www.vishnugandarapu.in/txt2sql2txt/",
      start: "2026-09-19", end: "2026-09-19", commits: 1,
      stack: ["HTML/JS", "PGlite", "node-sql-parser"],
      pages: [ { file: "index", title: "Cover & problem" }, { file: "blueprint", title: "Blueprint" }, { file: "rebuild", title: "Log, decisions & rebuild" } ]
    },
    { // normalform
      slug: "normalform", name: "normalform", shelf: "data", status: "deployed",
      tagline: "One student database walked from a messy spreadsheet to 5NF, before/after at every step.",
      url: "https://github.com/gv1shnu/normalform", live: "http://www.vishnugandarapu.in/normalform/",
      start: "2026-09-15", end: "2026-09-16", commits: 7,
      stack: ["Vanilla JS", "Node self-test"],
      pages: [ { file: "index", title: "Cover & journey" }, { file: "blueprint", title: "Blueprint" }, { file: "rebuild", title: "Log, decisions & rebuild" } ]
    },
    { // learn
      slug: "learn", name: "learn · Cyber Learning OS", shelf: "security", status: "deployed",
      tagline: "Free-only cybersecurity learning platform: 67-concept graph, quizzes, roadmaps, progress in IndexedDB.",
      url: "https://github.com/gv1shnu/learn", live: "http://www.vishnugandarapu.in/learn/",
      start: "2026-08-27", end: "2026-09-28", commits: 2,
      stack: ["ES modules", "IndexedDB", "JSON"],
      pages: [ { file: "index", title: "Cover & problem" }, { file: "blueprint", title: "Blueprint" }, { file: "rebuild", title: "Log, decisions & rebuild" } ]
    },
    { // roundtable
      slug: "roundtable", name: "roundtable", shelf: "ai", status: "local",
      tagline: "Three local LLMs with personas and voices debate a topic out loud; I interject by typing or speaking.",
      url: "https://github.com/gv1shnu/roundtable", live: null,
      start: "2026-07-19", end: "2026-09-28", commits: 2,
      stack: ["Python", "Ollama", "Kokoro", "Whisper"],
      pages: [ { file: "index", title: "Cover & problem" }, { file: "blueprint", title: "Blueprint" }, { file: "rebuild", title: "Log, decisions & rebuild" } ]
    },
    { // privacy-lens
      slug: "privacy-lens", name: "Privacy Lens", shelf: "security", status: "deployed",
      tagline: "Type a URL, get a live report of the trackers, cookies, fingerprinting and form data a site collects.",
      url: "https://github.com/gv1shnu/privacy-lens", live: "https://privacy-lens-ggop.onrender.com/",
      start: "2026-08-11", end: "2026-08-11", commits: 3,
      stack: ["Node/Express", "Puppeteer", "Docker"],
      pages: [ { file: "index", title: "Cover & problem" }, { file: "blueprint", title: "Blueprint" }, { file: "rebuild", title: "Log, decisions & rebuild" } ]
    },
    { // web-timeline
      slug: "web-timeline", name: "web-timeline", shelf: "security", status: "local",
      tagline: "Staged web-assessment pipeline with a strict three-tier authorization gate and one typed result model.",
      url: "https://github.com/gv1shnu/web-timeline", live: null,
      start: "2026-07-15", end: "2026-09-28", commits: 4,
      stack: ["Python", "Flask", "ProjectDiscovery"],
      pages: [ { file: "index", title: "Cover & scope" }, { file: "blueprint", title: "Blueprint" }, { file: "rebuild", title: "Log, decisions & rebuild" } ]
    },
    { // finder
      slug: "finder", name: "finder", shelf: "ai", status: "local",
      tagline: "Offline natural-language agent for your files and desktop: the model plans, plain code acts.",
      url: "https://github.com/gv1shnu/finder", live: null,
      start: "2026-09-19", end: "2026-09-19", commits: 8,
      stack: ["Python", "Ollama", "SQLite"],
      pages: [ { file: "index", title: "Cover & problem" }, { file: "blueprint", title: "Blueprint" }, { file: "rebuild", title: "Log, decisions & rebuild" } ]
    },
    { // coursera-transcripts
      slug: "coursera-transcripts", name: "coursera-transcripts", shelf: "tools", status: "local",
      tagline: "Playwright scraper that logs in once, walks a course, and exports every lecture transcript as organised Markdown.",
      url: "https://github.com/gv1shnu/coursera-transcripts", live: null,
      start: "2026-06-24", end: "2026-08-14", commits: 5,
      stack: ["Python", "Playwright", "Brave"],
      pages: [ { file: "index", title: "Cover & problem" }, { file: "blueprint", title: "Blueprint" }, { file: "rebuild", title: "Log, decisions & rebuild" } ]
    },
    { // pubg
      slug: "pubg", name: "pubg · Battleground Telemetry", shelf: "data", status: "deployed",
      tagline: "Real-time telemetry pipeline (Kafka → Flink → Postgres → Superset) that stays correct under out-of-order, duplicate and late events.",
      url: "https://github.com/gv1shnu/pubg", live: "https://www.vishnugandarapu.in/pubg/",
      start: "2026-09-28", end: "2026-10-04", commits: 5,
      stack: ["Kafka", "Flink", "Postgres", "Superset"],
      pages: [ { file: "index", title: "Cover & architecture" }, { file: "blueprint", title: "Blueprint" }, { file: "rebuild", title: "Log, decisions & rebuild" } ]
    },
    { // nexus
      slug: "nexus", name: "Nexus", shelf: "tools", status: "deployed",
      tagline: "Metasearch engine that fans one query out to 8 sources and merges them with BM25 + RRF. No keys, no tracking.",
      url: "https://github.com/gv1shnu/nexus", live: "https://nexus-lixx.onrender.com/",
      start: "2026-02-21", end: "2026-09-05", commits: 8,
      stack: ["Node/Express", "Python", "SearXNG"],
      pages: [ { file: "index", title: "Cover & problem" }, { file: "blueprint", title: "Blueprint" }, { file: "rebuild", title: "Log, decisions & rebuild" } ]
    },
    { // world-of-books
      slug: "world-of-books", name: "world-of-books", shelf: "web", status: "deployed",
      tagline: "Full-stack book explorer over a live scrape: queued scraping, stale-while-revalidate cache, and a page-count PDF reader.",
      url: "https://github.com/gv1shnu/world-of-books", live: "http://www.vishnugandarapu.in/world-of-books/",
      start: "2026-01-12", end: "2026-10-04", commits: 19,
      stack: ["NestJS", "Next.js", "Postgres", "Redis"],
      pages: [ { file: "index", title: "Cover & problem" }, { file: "blueprint", title: "Blueprint" }, { file: "rebuild", title: "Log, decisions & rebuild" } ]
    },
    { // dilli-khoj
      slug: "dilli-khoj", name: "Dilli Khoj", shelf: "games", status: "deployed",
      tagline: "A 3D SQL learning game: explore ruined Delhi, restore 20 archives by writing SELECTs, graded server-side so XP can't be faked.",
      url: "https://github.com/gv1shnu/dilli-khoj", live: "http://www.vishnugandarapu.in/dilli-khoj/",
      start: "2026-09-03", end: "2026-10-04", commits: 119,
      stack: ["React", "Three.js", "PGlite", "Supabase"],
      pages: [ { file: "index", title: "Cover & idea" }, { file: "blueprint", title: "Blueprint" }, { file: "rebuild", title: "Log, decisions & rebuild" } ]
    },
    { // rapid-fire
      slug: "rapid-fire", name: "rapid-fire · The Lost Schema", shelf: "data", status: "deployed",
      tagline: "A timed SQL quiz with uncheatable server clocks, sealed answers, and good/evil Jerry tempters.",
      url: "https://github.com/gv1shnu/rapid-fire", live: "http://www.vishnugandarapu.in/rapid-fire/",
      start: "2026-09-11", end: "2026-10-04", commits: 45,
      stack: ["React", "Supabase", "Postgres"],
      pages: [ { file: "index", title: "Cover & problem" }, { file: "blueprint", title: "Blueprint" }, { file: "rebuild", title: "Log, decisions & rebuild" } ]
    },
    { // dino-hunt
      slug: "dino-hunt", name: "Dino Hunt", shelf: "games", status: "deployed",
      tagline: "An AI ecosystem sandbox: two agent teams raid a raptor nest. The game is the environment; the AI is the product.",
      url: "https://github.com/gv1shnu/dino-hunt", live: "https://www.vishnugandarapu.in/dino-hunt/",
      start: "2026-07-27", end: "2026-10-04", commits: 13,
      stack: ["Unity", "C#", "Utility AI", "GA"],
      pages: [ { file: "index", title: "Cover & research" }, { file: "blueprint", title: "Blueprint" }, { file: "rebuild", title: "Log, decisions & rebuild" } ]
    },
    { // meme-ar
      slug: "meme-ar", name: "meme-ar · Punchline", shelf: "ai", status: "deployed",
      tagline: "Drops GIPHY meme reactions into a video at the funny moments, analysed on-device so nothing is uploaded.",
      url: "https://github.com/gv1shnu/meme-ar", live: "https://meme-ar.vercel.app",
      start: "2026-10-04", end: "2026-10-04", commits: 1,
      stack: ["TypeScript", "MediaPipe", "GIPHY"],
      pages: [ { file: "index", title: "Cover & pipeline" }, { file: "blueprint", title: "Blueprint" }, { file: "rebuild", title: "Log, decisions & rebuild" } ]
    },
    { // traffic
      slug: "traffic", name: "traffic · Cause Investigator", shelf: "ai", status: "deployed",
      tagline: "Upload fixed-camera footage and get an evidence-first, deliberately conservative investigation of what's causing the jam.",
      url: "https://github.com/gv1shnu/traffic", live: "http://www.vishnugandarapu.in/traffic/",
      start: "2026-09-15", end: "2026-10-05", commits: 23,
      stack: ["FastAPI", "Celery", "YOLO/ByteTrack", "React"],
      pages: [ { file: "index", title: "Cover & scope" }, { file: "blueprint", title: "Blueprint" }, { file: "rebuild", title: "Log, decisions & rebuild" } ]
    },
    { // f1
      slug: "f1", name: "f1 · APEX TV", shelf: "games", status: "wip",
      tagline: "A browser multiplayer racer where the real work is the netcode: local 60Hz physics, 20Hz server snapshots, interpolated peers.",
      url: "https://github.com/gv1shnu/f1", live: "https://apex-tv-f1.onrender.com",
      start: "2026-09-06", end: "2026-10-05", commits: 6,
      stack: ["Three.js", "Node", "WebSocket"],
      pages: [ { file: "index", title: "Cover & netcode" }, { file: "blueprint", title: "Blueprint" }, { file: "rebuild", title: "Log, decisions & rebuild" } ]
    },
    { // project-bay
      slug: "project-bay", name: "Project BAY", shelf: "web", status: "deployed",
      tagline: "A social accountability game: stake virtual points on your own commitments and let friends bet you won't follow through.",
      url: "https://github.com/gv1shnu/project-bay", live: "https://project-bay-amber.vercel.app/",
      start: "2026-01-03", end: "2026-10-05", commits: 45,
      stack: ["FastAPI", "React", "Postgres", "Groq LLM"],
      pages: [ { file: "index", title: "Cover & economy" }, { file: "blueprint", title: "Blueprint" }, { file: "rebuild", title: "Log, decisions & rebuild" } ]
    },
  ]
};
