// codetabs.js — switchable Python / C++ blocks for the DSA notes.
// Works for code AND prose/notes. Markup expected:
//   <div class="codetabs">           (code, monospace)
//     <pre data-lang="py"><code>...</code></pre>
//     <pre data-lang="cpp"><code>...</code></pre>
//   </div>
//   <div class="langnote">            (language-specific notes)
//     <div data-lang="py">...</div>
//     <div data-lang="cpp">...</div>
//   </div>
// One global language choice, synced across every block on the page and
// remembered in localStorage. Python is the default.
(function () {
    var css = [
        ".codetabs,.langnote{margin:1em 0;border:1px solid #ddd;border-radius:4px;overflow:hidden}",
        ".codetab-btns{display:flex;background:#f0f0f0;border-bottom:1px solid #ddd}",
        ".codetab-btns button{font:inherit;padding:5px 14px;border:none;background:transparent;cursor:pointer;color:#555}",
        ".codetab-btns button.active{background:#fff;color:#000;font-weight:bold;box-shadow:inset 0 -2px 0 #0099ff}",
        ".codetabs pre{margin:0;border:none;border-radius:0}",
        ".langnote > [data-lang]{padding:0 12px}",
        ".codetabs pre[data-lang],.langnote > [data-lang]{display:none}",
        ".codetabs pre[data-lang].active{display:block}",
        ".langnote > [data-lang].active{display:block}"
    ].join("\n");
    var style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    var KEY = "dsa-codelang";
    var LABELS = { py: "Python", cpp: "C++" };
    var SWITCHES = ".codetabs, .langnote";

    function current() { return localStorage.getItem(KEY) || "py"; }

    function apply(lang) {
        var items = document.querySelectorAll(".codetabs pre[data-lang], .langnote > [data-lang]");
        for (var i = 0; i < items.length; i++) {
            items[i].classList.toggle("active", items[i].getAttribute("data-lang") === lang);
        }
        var btns = document.querySelectorAll(".codetab-btns button");
        for (var j = 0; j < btns.length; j++) {
            btns[j].classList.toggle("active", btns[j].getAttribute("data-lang") === lang);
        }
    }

    function setLang(lang) { localStorage.setItem(KEY, lang); apply(lang); }

    document.addEventListener("DOMContentLoaded", function () {
        var boxes = document.querySelectorAll(SWITCHES);
        for (var i = 0; i < boxes.length; i++) {
            var items = boxes[i].querySelectorAll(":scope > [data-lang]");
            var bar = document.createElement("div");
            bar.className = "codetab-btns";
            for (var j = 0; j < items.length; j++) {
                var lang = items[j].getAttribute("data-lang");
                var b = document.createElement("button");
                b.textContent = LABELS[lang] || lang;
                b.setAttribute("data-lang", lang);
                b.addEventListener("click", (function (l) { return function () { setLang(l); }; })(lang));
                bar.appendChild(b);
            }
            boxes[i].insertBefore(bar, boxes[i].firstChild);
        }
        apply(current());
    });
})();
