/* =====================================================================
   WORKSHOP NOTEBOOK — page chrome
   ---------------------------------------------------------------------
   Runs on every page. It reads the folder list from assets/registry.js
   (window.NOTEBOOK) and draws:
     1. shared SVG <defs>: the "rough pen" filter + arrowheads
     2. on repo pages  (<body data-repo data-page>): top bar, folder tabs,
        prev/next pager, footer
     3. on the desk    (<body class="desk-page">): the shelves of folders
        and the project calendar strip
   You should rarely need to edit this file. To add a folder or a page,
   edit assets/registry.js instead.
   ===================================================================== */
(function () {
  "use strict";
  var NB = window.NOTEBOOK || { owner: "", shelves: [], repos: [] };

  /* ---------- 1. shared SVG defs ---------- */
  var defs =
    '<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>' +
    // EDIT: "scale" controls how shaky the pen looks (0 = ruler-straight)
    '<filter id="rough" x="-5%" y="-5%" width="110%" height="110%">' +
    '<feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7" result="n"/>' +
    '<feDisplacementMap in="SourceGraphic" in2="n" scale="2.6" xChannelSelector="R" yChannelSelector="G"/></filter>' +
    '<marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">' +
    '<path d="M0 0 L10 5 L0 10 L3 5 z" fill="#eaf3ff"/></marker>' +
    '<marker id="ah-ink" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">' +
    '<path d="M0 0 L10 5 L0 10 L3 5 z" fill="#1d2b5a"/></marker>' +
    '<marker id="ah-red" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">' +
    '<path d="M0 0 L10 5 L0 10 L3 5 z" fill="#c8342c"/></marker>' +
    "</defs></svg>";
  document.body.insertAdjacentHTML("afterbegin", defs);

  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    for (var k in attrs || {}) e.setAttribute(k, attrs[k]);
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function fmtMonth(d) { var m = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]; var x = new Date(d + "T00:00:00"); return m[x.getMonth()] + " " + x.getFullYear(); }
  var STATUS = { deployed: ["live", ""], wip: ["in progress", "wip"], local: ["runs locally", "blue"], archived: ["archived", "red"], assignment: ["assignment", "blue"] };

  /* ---------- 2. repo pages ---------- */
  var slug = document.body.getAttribute("data-repo");
  if (slug) {
    var repo = NB.repos.filter(function (r) { return r.slug === slug; })[0];
    var pageId = document.body.getAttribute("data-page") || "index";
    var main = document.querySelector("main");
    if (repo && main) {
      var cur = repo.pages.map(function (p) { return p.file; }).indexOf(pageId);
      var page = repo.pages[cur] || { title: "" };
      var bar = el("nav", { class: "topbar", "aria-label": "breadcrumb" },
        '<span class="brand">' + esc(NB.title) + '</span>' +
        '<a href="../index.html">the desk</a><span class="crumb-sep">/</span>' +
        '<a href="index.html">' + esc(repo.name) + '</a><span class="crumb-sep">/</span>' +
        "<span>" + esc(page.title) + "</span>" +
        '<span class="crumb-sep">·</span><a href="' + esc(repo.url) + '" target="_blank" rel="noopener">source ↗</a>' +
        (repo.live ? '<span class="crumb-sep">·</span><a href="' + esc(repo.live) + '" target="_blank" rel="noopener">live ↗</a>' : ""));
      var tabs = el("div", { class: "tabs", role: "tablist" });
      repo.pages.forEach(function (p, i) {
        var a = el("a", { href: p.file + ".html", class: i === cur ? "on" : "" }, (i + 1) + ". " + esc(p.title));
        tabs.appendChild(a);
      });
      main.parentNode.insertBefore(bar, main);
      main.parentNode.insertBefore(tabs, main);
      var prev = repo.pages[cur - 1], next = repo.pages[cur + 1];
      var pager = el("div", { class: "pager" },
        (prev ? '<a href="' + prev.file + '.html">← ' + esc(prev.title) + "</a>" : '<a href="../index.html">← back to the desk</a>') +
        (next ? '<a href="' + next.file + '.html">' + esc(next.title) + " →</a>" : '<a href="../index.html">back to the desk ↩</a>'));
      main.appendChild(pager);
      main.parentNode.appendChild(el("div", { class: "footer" }, esc(NB.owner) + " · engineering notebook · " + esc(repo.name)));
      document.title = repo.name + " — " + page.title;
    }
  }

  /* ---------- 3. the desk ---------- */
  if (document.body.classList.contains("desk-page")) {
    var host = document.getElementById("shelves");
    NB.shelves.forEach(function (shelf) {
      var items = NB.repos.filter(function (r) { return r.shelf === shelf.id; })
        .sort(function (a, b) { return a.start < b.start ? 1 : -1; });
      if (!items.length) return;
      host.appendChild(el("h2", { class: "shelf-title" }, esc(shelf.title) + "<small>" + esc(shelf.blurb || "") + "</small>"));
      var grid = el("div", { class: "folders" });
      items.forEach(function (r) {
        var st = STATUS[r.status] || STATUS.local;
        grid.appendChild(el("a", { class: "folder", href: r.slug + "/index.html" },
          '<span class="tab">' + esc(r.slug) + "/</span>" +
          '<div class="body"><div class="label-strip">' + r.commits + " commits · " + r.pages.length + " sheets</div>" +
          "<h3>" + esc(r.name) + "</h3><p>" + esc(r.tagline) + "</p>" +
          '<span class="stamp ' + st[1] + '">' + st[0] + "</span>" +
          '<div class="meta"><span>' + fmtMonth(r.start) + (r.end && r.end.slice(0, 7) !== r.start.slice(0, 7) ? " → " + fmtMonth(r.end) : "") + "</span><span>" + esc((r.stack || []).slice(0, 2).join(" · ")) + "</span></div></div>"));
      });
      host.appendChild(grid);
    });

    /* project calendar strip — one bar per repo from first to last commit */
    var cal = document.getElementById("calendar");
    if (cal && NB.repos.length) {
      var rs = NB.repos.slice().sort(function (a, b) { return a.start < b.start ? -1 : 1; });
      var t0 = new Date("2026-01-01T00:00:00").getTime(), t1 = new Date("2026-11-01T00:00:00").getTime();
      var W = 1000, L = 150, rowH = 16, H = 30 + rs.length * rowH;
      var x = function (d) { return L + (new Date(d + "T00:00:00").getTime() - t0) / (t1 - t0) * (W - L - 10); };
      var s = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="When each project was built">';
      ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct"].forEach(function (m, i) {
        var d = "2026-" + String(i + 1).padStart(2, "0") + "-01", xx = x(d);
        s += '<line x1="' + xx + '" y1="14" x2="' + xx + '" y2="' + H + '" stroke="rgba(156,195,255,.18)"/>' +
             '<text x="' + (xx + 4) + '" y="12" font-size="12">' + m + "</text>";
      });
      rs.forEach(function (r, i) {
        var y = 24 + i * rowH, x1 = x(r.start), x2 = Math.max(x(r.end || r.start), x1 + 5);
        s += '<a href="' + r.slug + '/index.html"><text x="' + (L - 8) + '" y="' + (y + 9) + '" font-size="12" text-anchor="end">' + esc(r.slug) + "</text>" +
             '<rect x="' + x1 + '" y="' + y + '" width="' + (x2 - x1) + '" height="10" rx="3" fill="' + (r.status === "wip" ? "#ffcf6e" : "#9cc3ff") + '" opacity=".85"><title>' + esc(r.name + ": " + r.start + " → " + r.end) + "</title></rect></a>";
      });
      cal.innerHTML = s + "</svg>";
    }
  }
})();
