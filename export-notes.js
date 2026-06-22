(function () {
  // Export button — HOME PAGE ONLY (linked only in root index.html).
  // Collects ALL page notes stored in this browser and downloads them as JSON.
  var PREFIX = "pagenotes:";

  function collectAll() {
    var out = {};
    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
      if (key && key.indexOf(PREFIX) === 0) {
        var page = key.slice(PREFIX.length);
        try { out[page] = JSON.parse(localStorage.getItem(key)) || []; }
        catch (e) { out[page] = []; }
      }
    }
    return out;
  }

  function download() {
    var all = collectAll();
    var pageCount = Object.keys(all).length;
    if (pageCount === 0) { alert("No notes saved in this browser yet."); return; }
    var data = { exportedAt: new Date().toISOString(), notes: all };
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "page-notes-" + new Date().toISOString().slice(0, 10) + ".json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Sits just left of the "+" fab (which is at right:16px, ~44px wide).
  var css = ''
    + '#cmt-export{position:fixed;top:16px;right:72px;z-index:99999;height:44px;'
    + 'padding:0 14px;border:none;border-radius:22px;background:#0d9488;color:#fff;'
    + 'font:600 13px system-ui,sans-serif;cursor:pointer;'
    + 'box-shadow:0 2px 8px rgba(0,0,0,.25);}';
  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  var btn = document.createElement("button");
  btn.id = "cmt-export";
  btn.textContent = "Export notes";
  btn.title = "Download all page notes from this browser as JSON";
  btn.addEventListener("click", download);
  document.body.appendChild(btn);
})();
