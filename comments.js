(function () {
  var pageKey = window.location.pathname;
  var LS_KEY = "pagenotes:" + pageKey;

  // ---- Storage: localStorage only ----
  function getComments() {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; }
    catch (e) { return []; }
  }
  function saveComment(text) {
    var items = getComments();
    items.push({ text: String(text), ts: Date.now() });
    try { localStorage.setItem(LS_KEY, JSON.stringify(items)); } catch (e) {}
    return items;
  }

  // ---- Styles ----
  var css = ''
    + '#cmt-fab{position:fixed;top:16px;right:16px;z-index:99999;width:44px;'
    + 'height:44px;border-radius:50%;border:none;background:#2563eb;color:#fff;'
    + 'font-size:24px;line-height:44px;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.25);}'
    + '#cmt-panel{position:fixed;top:0;right:0;z-index:99998;width:320px;'
    + 'max-width:85vw;height:100vh;background:#fff;box-shadow:-2px 0 12px rgba(0,0,0,.2);'
    + 'transform:translateX(100%);transition:transform .25s ease;display:flex;'
    + 'flex-direction:column;font-family:system-ui,sans-serif;}'
    + '#cmt-panel.open{transform:translateX(0);}'
    + '#cmt-panel header{padding:14px 16px;border-bottom:1px solid #eee;display:flex;'
    + 'justify-content:space-between;align-items:center;}'
    + '#cmt-panel h3{margin:0;font-size:14px;font-weight:600;}'
    + '#cmt-close{border:none;background:none;font-size:20px;cursor:pointer;}'
    + '#cmt-form{padding:12px 16px;border-bottom:1px solid #eee;}'
    + '#cmt-text{width:100%;box-sizing:border-box;min-height:80px;resize:vertical;'
    + 'padding:8px;font:inherit;}'
    + '#cmt-submit{margin-top:8px;width:100%;padding:8px;border:none;border-radius:6px;'
    + 'background:#2563eb;color:#fff;cursor:pointer;}'
    + '#cmt-list{flex:1;overflow-y:auto;padding:8px 16px;margin:0;list-style:none;}'
    + '#cmt-list li{padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:14px;'
    + 'white-space:pre-wrap;word-break:break-word;}'
    + '#cmt-list time{display:block;color:#888;font-size:11px;margin-top:4px;}';
  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  // ---- Markup ----
  var fab = document.createElement("button");
  fab.id = "cmt-fab";
  fab.textContent = "+";
  fab.title = "Page notes";

  var panel = document.createElement("div");
  panel.id = "cmt-panel";
  panel.innerHTML =
    '<header><h3>Notes — ' + escapeHtml(pageKey) + '</h3>' +
    '<button id="cmt-close" title="Close">×</button></header>' +
    '<div id="cmt-form">' +
      '<textarea id="cmt-text" placeholder="Jot an idea for this page..."></textarea>' +
      '<button id="cmt-submit">Add</button>' +
    '</div>' +
    '<ul id="cmt-list"></ul>';

  document.body.appendChild(fab);
  document.body.appendChild(panel);

  // ---- Behaviour ----
  fab.addEventListener("click", function () {
    panel.classList.add("open");
    render();
  });
  panel.querySelector("#cmt-close").addEventListener("click", function () {
    panel.classList.remove("open");
  });
  panel.querySelector("#cmt-submit").addEventListener("click", function () {
    var ta = panel.querySelector("#cmt-text");
    var text = ta.value.trim();
    if (!text) return;
    saveComment(text);
    ta.value = "";
    render();
  });

  function render() {
    var items = getComments();
    var list = panel.querySelector("#cmt-list");
    list.innerHTML = "";
    items.sort(function (a, b) { return b.ts - a.ts; });
    items.forEach(function (c) {
      var li = document.createElement("li");
      li.textContent = c.text;                 // textContent => XSS-safe
      var t = document.createElement("time");
      t.textContent = new Date(c.ts).toLocaleString();
      li.appendChild(t);
      list.appendChild(li);
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
})();
