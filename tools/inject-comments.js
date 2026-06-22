const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const TAG = '<script src="/comments.js" defer></script>';
const MARKER = "/comments.js";
const SKIP = new Set(["node_modules", ".git", "tools", ".github"]);

function walk(dir, out) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (SKIP.has(e.name)) continue;
      walk(path.join(dir, e.name), out);
    } else if (e.isFile() && /\.html?$/i.test(e.name)) {
      out.push(path.join(dir, e.name));
    }
  }
  return out;
}

let injected = 0, skipped = 0;
for (const file of walk(ROOT, [])) {
  let html = fs.readFileSync(file, "utf8");
  if (html.includes(MARKER)) { skipped++; continue; }
  if (/<\/body>/i.test(html)) {
    html = html.replace(/<\/body>/i, "  " + TAG + "\n</body>");
  } else {
    html += "\n" + TAG + "\n";   // fallback if no </body>
  }
  fs.writeFileSync(file, html);
  injected++;
  console.log("linked:", path.relative(ROOT, file));
}
console.log(`\nDone. injected=${injected} alreadyLinked=${skipped}`);
