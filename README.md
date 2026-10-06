# Workshop Notes

My engineering notebook: one folder per repository I have built, written so the project can be
rebuilt from a blank editor. Served with GitHub Pages from the `main` branch (repo root).

<!-- EDIT: keep this file as the map of the notebook; the pages themselves are HTML. -->

## Layout

```
index.html            the desk: shelves of folders + project calendar
assets/
  notebook.css        paper, blueprint and handwriting styles (component cheat-sheet at the top)
  notebook.js         draws top bar, folder tabs, prev/next, SVG pen filter, desk shelves
  registry.js         THE list of folders and their pages: edit this to add a repo or a sheet
<repo-name>/
  index.html          1. cover: problem, observations, stack, links
  blueprint.html      2. architecture, data model, flowcharts
  log.html            3. build log reconstructed from git history
  decisions.html      4. decisions and trade-offs, deployment, metrics
  rebuild.html        5. rebuild guide and pending work
```

Small repos merge some sheets; the tabs at the top of each page always show what a folder holds.

## Editing

* Every page has `<!-- EDIT: ... -->` comments marking each section.
* Diagrams are inline SVG. The classes (`box`, `arr`, `lbl`, ...) are listed at the top of
  `assets/notebook.css`; the pen wobble comes from the `#rough` filter in `assets/notebook.js`.
* To add a repo, copy a folder, change `data-repo` on each page, and add an entry to `assets/registry.js`.

## Local preview

```
python3 -m http.server 8000   # then open http://localhost:8000
```
