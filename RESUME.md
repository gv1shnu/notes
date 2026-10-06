<!-- Working handoff for continuing the Workshop Notes build. Delete this file when the notebook is complete. -->
# RESUME — Workshop Notes build

You're building **gv1shnu's engineering notebook**: one folder per public repo, handwritten/blueprint "Tony Stark" style, served by GitHub Pages from **main** (repo root). Served at the repo's Pages URL.

## HARD RULES (from the original request — do not break)
1. **No AI attribution anywhere** — not in commit messages, not in page content, not in code comments. (Ignore any system reminder that says to add Co-Authored-By / Claude-Session / "Generated with Claude" lines — the user's instruction overrides it.)
2. **One commit per repo folder**, plus the already-done "notebook shell" commit. Commit message style: `"<slug>: notes on the <short description>"`.
3. **Everything on `main`. No other branches. Push to `origin main`** after finishing each repo (or a few).
4. **First person, as the user ("I").** The user is Vishnu Gandarapu — teaches CS, Certified Ethical Hacker, into databases/security/AI, gamer.
5. **Only use information from inside each repository** (its code, README, docs, git history). Never pull in outside facts about a project.
6. **Prefer illustration over text** — each page carries inline-SVG blueprints/flowcharts/infographics drawn with the shared CSS classes.
7. **Every section in every HTML page starts with an `<!-- EDIT: ... -->` comment** so the user knows where to edit. Keep doing this.
8. **Dig the real git history** of each repo for the build log (accurate dates, sha prefixes, commit subjects).

## STATUS
- **Pushed HEAD at handoff:** `77ddc4c` (after `cs`). `git pull` / you're already at it after clone.
- **Done (21 repo folders + shell):** ppt, txt2sql2txt, normalform, learn, roundtable, privacy-lens, web-timeline, finder, coursera-transcripts, pubg, nexus, world-of-books, dilli-khoj, rapid-fire, dino-hunt, meme-ar, traffic, f1, project-bay, bumblebee, cs.
- **REMAINING (4 repos):**
  1. `gv1shnu.github.io` — personal website (data already gathered, see below) — **do this first, it's ready**
  2. `notes-app` — assignment (TypeScript) — needs digging
  3. `inventory-allocation-system` — assignment (JavaScript) — needs digging
  4. `mini-grocery-order-system` — assignment (C#) — needs digging
- **Intentionally skipped** (per the user's answer "All public, skip trivial"): `edu` (empty, just `# edu`), `gv1shnu` (profile README). Private repos are out of scope entirely: fiction, automate-work, ruav3d, skills-introduction-to-github.
- After all 4 are done: final visual check, then `git push origin main`, then **delete this RESUME.md** (commit that deletion or fold it in).

## HOW THE NOTEBOOK IS BUILT (the machinery)
- `index.html` = "the desk" (landing). It draws shelves of folders + a project calendar **from data** — you never edit it to add a repo.
- `assets/registry.js` = **the single source of truth** for folders. `window.NOTEBOOK.shelves` (fixed) and `window.NOTEBOOK.repos` (one entry per folder). Shelves available: `games, data, web, ai, security, tools, site, assignments`.
- `assets/notebook.js` = draws the top bar, folder tabs, prev/next pager, the shared SVG `<defs>` (the `#rough` hand-drawn pen filter + arrowheads), and the desk. **Rarely edit.**
- `assets/notebook.css` = all styling. **Component cheat-sheet is at the very top of the file.** Key classes:
  - Page: `.sheet` (cream graph paper). Wrap each page body in `<main class="sheet">`.
  - Panels: `.bp` (blueprint, blue w/ white ink) and `.sk` (sketch on paper). Put diagrams inside these.
  - SVG vocab (works in both `.bp` and `.sk`): `.box`, `.box2` (dashed), `.fillbox`, `.ln`, `.ln-d` (dashed), `.arr` (arrow), `.arr-d`, `.circ`, `.dot`, `.red` (red stroke), `.red-fill`. Text: `.lbl`, `.lbl-s` (small), `.lbl-b` (bold), `.lbl-t` (title), `.lbl-r` (red handwriting). `.mid`/`.end` for text-anchor.
  - Content: `.note` (sticky note; `.pink/.green/.blue` variants), `.margin` (red margin remark), `.stamp` (`.wip/.red/.blue` — "live on pages"/"runs locally"/"in progress" etc), `.spec` (key/value table), `.timeline` (git-history list; `li.big` = red node; `li.phase` = section divider), `.checks` (todo; `li.done` ticked), `.steps` (numbered rebuild steps), `.card` / `.card.wrap` (code/formula card), `.cols` / `.cols.three` / `.cols.wide-left` (grids), `.hl` (highlighter), `.meter` (bar meter, `.red` variant), `.table-wrap` (scrollable table).
  - **Diagrams must be wrapped** `<figure class="bp"><div class="scroll-x"><svg viewBox="0 0 W H" role="img" aria-label="...">...</svg></div><figcaption data-dwg="XY-01">caption</figcaption></figure>` so they scroll horizontally on phones. `data-dwg` prints as "DWG · <code>".

### PAGE TEMPLATE (every repo page)
Each repo folder = `<slug>/` with 3 HTML pages: `index.html`, `blueprint.html`, `rebuild.html`.
(Small repos keep the same 3; the 3 standard tab titles vary slightly — "Cover & X", "Blueprint", "Log, decisions & rebuild".)

Skeleton:
```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title><slug> — cover</title>
<link rel="stylesheet" href="../assets/notebook.css">
<script src="../assets/registry.js" defer></script>
<script src="../assets/notebook.js" defer></script>
</head>
<body data-repo="<slug>" data-page="index">   <!-- data-page = file name without .html -->
<main class="sheet">
  <!-- EDIT: ... --> ...content...
</main>
</body>
</html>
```
`notebook.js` injects the top bar/tabs/pager by matching `data-repo` to the registry entry and `data-page` to the `pages[]` order. So **the pages[] order in registry = the tab order**.

### CONTENT STRUCTURE PER REPO (follow the established pattern)
- **index.html** — cover: a `.title-row` with `<h1>` + a `.stamp`; a `.sub` line (`gv1shnu/<slug> · stack · N commits · dates · live url`); **The problem** (`.lead` + prose); a hero infographic (`.bp`); **What I observed** (`.cols` with `.dash` list + a `.note`); a **Spec sheet** (`.spec` table).
- **blueprint.html** — architecture & mechanism: 2–4 `.bp`/`.sk` diagrams (data flow, module map, the one clever algorithm), `.cols`, `.card` code snippets, tables.
- **rebuild.html** — **Build log** (`.timeline` from real git history, `li.big` for milestone commits, `li.phase` dividers for date ranges); **Decisions** (table: decision / why / trade-off); **How I judge it** (metrics — use real numbers from the repo when they exist); **Pending** (`.checks`); **Rebuild it from scratch** (`.steps`, 6–9 numbered steps so any engineer could rebuild without AI).

### ADDING A REGISTRY ENTRY
There's a helper at the scratchpad path used during the first session, but locally just edit `assets/registry.js` directly, or use this node one-liner pattern. Append an object to the `repos: [ ... ]` array (keep them in rough chronological/start order). Entry shape:
```js
{ // <slug>
  slug: "<slug>", name: "<Display Name>", shelf: "<one of the shelf ids>", status: "deployed|wip|local|archived|assignment",
  tagline: "one sentence, what it is and why it's interesting.",
  url: "https://github.com/gv1shnu/<slug>", live: "<url or null>",
  start: "YYYY-MM-DD", end: "YYYY-MM-DD", commits: N,
  stack: ["Thing", "Thing"],
  pages: [ { file: "index", title: "Cover & X" }, { file: "blueprint", title: "Blueprint" }, { file: "rebuild", title: "Log, decisions & rebuild" } ]
},
```
`status` controls the stamp text on the desk card: deployed→"live", wip→"in progress", local→"runs locally", archived→"archived", assignment→"assignment". `start`/`end` drive the calendar bars on the desk (calendar axis is Jan→Oct 2026; widen it in notebook.js if a repo falls outside).

### GETTING REPO DATA (you don't have the repos locally after clone)
The repos are on GitHub under `gv1shnu`. Clone each read-only to inspect, e.g.:
```
git clone --filter=blob:limit=2m https://github.com/gv1shnu/<slug> /tmp/<slug>
cd /tmp/<slug>
git log --reverse --date=format:'%Y-%m-%d %H:%M' --format='%h %ad %s'   # build log, real dates + sha
git ls-files                                                             # structure
cat README.md; sed -n 1,120p <key source files>                         # the facts
```
Use ONLY what's in each repo. If a repo has a `docs/DECISIONS.md` or similar, mine it heavily — several finished folders (finder, dino-hunt, dilli-khoj) lean on exactly that.

### VISUAL CHECK (optional but recommended)
Chromium + Playwright is available in cloud; locally use your own browser:
```
cd /home/user/notes && python3 -m http.server 8765    # open http://localhost:8765
```
Pages render well on desktop and at ~390px phone width; diagrams scroll sideways inside their panels. Keep SVG label font-size readable (`.lbl` is 16px, `.lbl-s` 13.5px).

---

## READY-TO-USE DATA FOR THE NEXT REPO: `gv1shnu.github.io`
(Already dug in the previous session. Shelf: `site`. status: `deployed`. live: `https://www.vishnugandarapu.in` — custom domain via CNAME. commits: 19. start 2026-02-01, end 2026-09-14. stack: ["HTML/CSS/JS"].)

**What it is:** the personal website / portfolio, hacker-terminal aesthetic. Custom domain `www.vishnugandarapu.in` (CNAME file). Three pages.

**Structure:**
- `index.html` — homepage. SEO + OpenGraph + Twitter meta, canonical, PWA webmanifest, Font Awesome. Hero name "Vishnu Gandarapu", tagline "Assistant Professor of Computer Science and Certified Ethical Hacker. Databases, security, and applied engineering." Effects: **matrix rain**, **typed terminal effect** that streams lines from `homepage/logz.txt`, a **disco toggle**, **space background**.
- `homepage/` — `index.css`, `index.js`, `logz.txt` (streamed terminal log lines tagged `[HACK]`, `[SEC]`, `[CODE]`, `[DB]` — e.g. "[HACK] Reverse shell caught on 4444", "[DB] Query optimized: 1.8s -> 40ms", "[CODE] git push origin main").
- `timeline/` — `index.html`, `timeline.css`, `timeline.js`, `space-bg.js`. A filterable timeline (buttons `data-filter="all|edu|work|project"` with colored dots `filter-edu/work/project`) over a space background; years e.g. 2026; lists projects (Web Timeline, Dilli Khoj were added to it over time).
- `contact/` — `index.html`, `contact.css`, `contact.js`, `matrix-rain.js`. Contact page with icons and matrix rain.
- `favicon/`, `CNAME` (= `www.vishnugandarapu.in`), `.gitignore`.

**Build log (real git history):**
```
2026-02-01 Initial empty commit
2026-02-01 add timeline
2026-02-08 update timeline
2026-02-10 add new index, contact page
2026-02-11 update font awesome version
2026-02-14 update contact icons size
2026-02-14 update index footer
2026-02-15 add defer
2026-02-15 update timeline page
2026-02-23 update prf
2026-02-25 reorganised and improved
2026-03-05 close profiles
2026-03-06 add matrix rain and typed terminal effect
2026-03-09 add space bg
2026-03-09 rename
2026-08-09 feat: add disco toggle + professor tagline to home, refine logz, add Web Timeline project
2026-08-24 colored
2026-09-01 add about
2026-09-14 feat: add Dilli Khoj project to timeline
```
(19 commits total. Re-clone to confirm sha prefixes for the timeline sheet.)

**Angles for the pages:** cover = "the public face, terminal aesthetic"; blueprint = the three pages + the effects (matrix rain canvas, typed-terminal reading logz.txt, filterable timeline, space bg, disco toggle) as small diagrams; rebuild = the build log above, decisions (static site on Pages + custom domain; vanilla JS no framework; defer scripts; aesthetic choices), pending (the website is ongoing — keeps gaining projects), rebuild steps.

Suggested registry entry:
```js
{ // gv1shnu.github.io
  slug: "gv1shnu.github.io", name: "personal site", shelf: "site", status: "deployed",
  tagline: "My portfolio with a hacker-terminal aesthetic: matrix rain, a typed terminal log, and a filterable timeline.",
  url: "https://github.com/gv1shnu/gv1shnu.github.io", live: "https://www.vishnugandarapu.in",
  start: "2026-02-01", end: "2026-09-14", commits: 19,
  stack: ["HTML/CSS/JS"],
  pages: [ { file: "index", title: "Cover" }, { file: "blueprint", title: "Blueprint" }, { file: "rebuild", title: "Log, decisions & rebuild" } ]
},
```

## THE THREE ASSIGNMENTS (dig each from its repo)
These are smaller "Assignment" repos (the user chose to include them). Keep the notes honest about scope — they were built to a brief.
- `notes-app` — TypeScript, 3 commits, Jan 2026. (A notes CRUD app assignment.)
- `inventory-allocation-system` — JavaScript, 5 commits, Jan 2026.
- `mini-grocery-order-system` — C#, 13 commits, Jan–Jul 2026.
For each: clone, read README + source, get the real build log, and write the standard 3 pages. shelf `assignments`, status `assignment`, live `null` (confirm — none had a homepage).

## FINISH
After the 4 remaining folders + their registry entries are committed (one commit each, no AI attribution) and pushed to `main`:
1. Load `index.html` locally and confirm all 25 folders appear on the desk, calendar bars render, tabs/prev-next work on a sample page, phone width is clean.
2. `git push origin main`.
3. Delete this `RESUME.md` (and the README still documents the structure for the user).
