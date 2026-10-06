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
  ]
};
