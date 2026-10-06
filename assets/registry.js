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
  ]
};
