#!/usr/bin/env node
// Render an SVG or HTML file Claude wrote into a PNG/JPEG/WebP-ready PNG via headless Chromium.
// Usage: node render.js <input.svg|input.html> [output.png] [--width 1024] [--height 1024] [--scale 2] [--transparent]
const { chromium } = require("playwright");
const fs = require("fs"), path = require("path");
const a = process.argv.slice(2);
if (!a[0]) { console.error("usage: render.js input.(svg|html) [out.png] [--width N --height N --scale N --transparent]"); process.exit(1); }
const opt = (k, d) => { const i = a.indexOf("--" + k); return i < 0 ? d : a[i + 1]; };
const inp = path.resolve(a[0]);
const out = path.resolve(a[1] && !a[1].startsWith("--") ? a[1] : inp.replace(/\.(svg|html?)$/i, "") + ".png");
const src = fs.readFileSync(inp, "utf8");
let w = +opt("width", 0), h = +opt("height", 0);
if (/\.svg$/i.test(inp) && (!w || !h)) {
  const vb = src.match(/viewBox\s*=\s*["']\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)/);
  if (vb) { w = w || Math.round(+vb[1]); h = h || Math.round(+vb[2]); }
}
w = w || 1024; h = h || 1024;
const transparent = a.includes("--transparent");
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: +opt("scale", 2) });
  const html = /\.svg$/i.test(inp)
    ? `<!doctype html><html><body style="margin:0;${transparent ? "" : "background:#fff"}"><div style="width:${w}px;height:${h}px">${src.replace(/<\?xml[^>]*>/, "").replace(/<svg/, `<svg width="${w}" height="${h}"`)}</div></body></html>`
    : src;
  await p.setContent(html, { waitUntil: "networkidle" });
  await p.waitForTimeout(+opt("wait", 300));
  await p.screenshot({ path: out, omitBackground: transparent, clip: { x: 0, y: 0, width: w, height: h } });
  await b.close();
  console.log(`${out} (${w}x${h} @${opt("scale", 2)}x)`);
})().catch(e => { console.error(e.message); process.exit(1); });
