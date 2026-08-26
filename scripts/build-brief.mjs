#!/usr/bin/env node
/**
 * Renders docs/App-Redesign-Brief.md to a styled PDF.
 * The markdown is the source of truth — regenerate after any edit:
 *
 *   npm i -D playwright --no-save && node scripts/build-brief.mjs
 *
 * Uses Chromium's print-to-PDF. LibreOffice is not usable in this environment
 * (it fails to load .docx at all, including pre-existing ones).
 */
import fs from 'node:fs'
import { chromium } from 'playwright'

const md = fs.readFileSync('docs/App-Redesign-Brief.md', 'utf8')
const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
const inline = s => esc(s)
  .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  .replace(/`([^`]+)`/g, '<code>$1</code>')
  .replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>')

const lines = md.split('\n').map(l => /^\s{1,3}\|/.test(l) ? l.trimStart() : l)
let html = '', i = 0, inList = null
const closeList = () => { if (inList) { html += `</${inList}>`; inList = null } }

// masthead
while (i < lines.length && !lines[i].startsWith('## 1.')) i++

html += `<div class="cover">
  <h1 class="brand">GET LUCKY GOLF</h1>
  <p class="tagline">Insurance-backed hole-in-one gaming</p>
  <h2 class="doctitle">Creative Direction &amp; App Redesign Brief</h2>
  <p class="lede">A full redesign of the Get Lucky Golf player app for public beta. The app
  that exists today is a reference for <em>what the product does</em> — not for how it should
  look, and not for how it should be put together.</p>
  <table class="meta">
    <tr><th>Prepared by</th><td>Johannes Le Roux, Founder</td></tr>
    <tr><th>Contact</th><td>johannes@getluckygolfclub.com</td></tr>
    <tr><th>Date</th><td>25 August 2026</td></tr>
    <tr><th>Status</th><td>Working beta — the app functions end to end; the visual layer has never been designed</td></tr>
    <tr><th>Engagement</th><td>Full redesign. Get Lucky V2.</td></tr>
  </table>
</div><div class="pagebreak"></div>`

const isTable = j => lines[j]?.startsWith('|') && /^\|[\s:|-]+\|$/.test(lines[j+1] ?? '')

while (i < lines.length) {
  const ln = lines[i]
  if (!ln.trim() || ln.trim() === '---') { closeList(); i++; continue }

  if (isTable(i)) {
    closeList()
    const head = lines[i].trim().replace(/^\||\|$/g,'').split('|').map(c=>c.trim())
    i += 2
    let body = ''
    while (i < lines.length && lines[i].startsWith('|')) {
      const cells = lines[i].trim().replace(/^\||\|$/g,'').split('|').map(c=>c.trim())
      body += '<tr>' + cells.slice(0, head.length).map(c=>`<td>${inline(c)}</td>`).join('') + '</tr>'
      i++
    }
    html += `<table><thead><tr>${head.map(h=>`<th>${inline(h)}</th>`).join('')}</tr></thead><tbody>${body}</tbody></table>`
    continue
  }
  if (ln.startsWith('### ')) { closeList(); html += `<h3>${inline(ln.slice(4))}</h3>` }
  else if (ln.startsWith('## ')) { closeList(); html += `<h2>${inline(ln.slice(3))}</h2>` }
  else if (ln.startsWith('# ')) { closeList(); html += `<h1>${inline(ln.slice(2))}</h1>` }
  else if (/^\s*[-*] /.test(ln)) {
    if (inList !== 'ul') { closeList(); html += '<ul>'; inList = 'ul' }
    html += `<li>${inline(ln.replace(/^\s*[-*] /,''))}</li>`
  }
  else if (/^\s*\d+\. /.test(ln)) {
    if (inList !== 'ol') { closeList(); html += '<ol>'; inList = 'ol' }
    html += `<li>${inline(ln.replace(/^\s*\d+\. /,''))}</li>`
  }
  else if (ln.startsWith('```')) {
    closeList(); i++
    let buf = []
    while (i < lines.length && !lines[i].startsWith('```')) buf.push(lines[i++])
    html += `<pre>${esc(buf.join('\n'))}</pre>`
  }
  else {
    closeList()
    let buf = [ln]
    while (i+1 < lines.length && lines[i+1].trim() && !/^(#|\||```|\s*[-*] |\s*\d+\. |---)/.test(lines[i+1])) buf.push(lines[++i].trim())
    html += `<p>${inline(buf.join(' '))}</p>`
  }
  i++
}
closeList()

const page_html = `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  :root{--green-dark:#1e3120;--green:#335231;--green-mid:#4a7a3d;--gold:#a07820;--cream:#faf7ef;--ink:#1a1a1a;--grey:#555}
  *{box-sizing:border-box}
  body{font-family:Inter,system-ui,sans-serif;font-size:10.2pt;line-height:1.55;color:var(--ink);margin:0}
  .cover{height:9.2in;display:flex;flex-direction:column;justify-content:center;text-align:center;page-break-after:always}
  .brand{font-size:34pt;letter-spacing:-.5px;color:var(--green-dark);margin:0 0 6px;border:none;padding:0}
  .tagline{font-size:12pt;color:var(--grey);margin:0 0 26px}
  .doctitle{font-size:17pt;color:var(--green);margin:0 0 22px;border:none;padding:0}
  .lede{font-style:italic;color:var(--grey);max-width:30em;margin:0 auto 34px;font-size:10.5pt}
  table.meta{width:auto;margin:0 auto;border:none;font-size:10pt}
  table.meta th{background:none;color:var(--green-dark);text-align:right;padding:4px 14px 4px 0;border:none;white-space:nowrap;font-weight:600}
  table.meta td{border:none;text-align:left;padding:4px 0;max-width:26em}
  .pagebreak{page-break-after:always}
  h1{font-size:17pt;color:var(--green-dark);margin:26px 0 10px;page-break-after:avoid}
  h2{font-size:13.5pt;color:var(--green);margin:22px 0 8px;padding-bottom:5px;border-bottom:2px solid #e3ddcc;page-break-after:avoid}
  h3{font-size:11pt;color:var(--green-mid);margin:16px 0 6px;page-break-after:avoid}
  p{margin:0 0 8px;orphans:2;widows:2}
  ul,ol{margin:0 0 10px;padding-left:20px}
  li{margin-bottom:3px}
  code{font-family:"SF Mono",Consolas,monospace;font-size:8.9pt;color:var(--gold);background:#f6f2e6;padding:1px 4px;border-radius:3px}
  pre{font-family:"SF Mono",Consolas,monospace;font-size:8.6pt;background:#f6f2e6;border-left:3px solid var(--green-mid);padding:9px 12px;margin:0 0 12px;white-space:pre-wrap;color:#333;border-radius:0 4px 4px 0}
  pre code{background:none;padding:0;color:inherit}
  table{width:100%;border-collapse:collapse;margin:6px 0 14px;font-size:9.2pt;page-break-inside:avoid}
  thead{display:table-header-group}
  th{background:var(--green);color:#fff;text-align:left;padding:6px 8px;font-weight:600;border:1px solid var(--green)}
  td{padding:5px 8px;border:1px solid #ddd6c4;vertical-align:top}
  tbody tr:nth-child(even){background:#faf8f2}
  strong{font-weight:600;color:var(--green-dark)}
</style></head><body>${html}</body></html>`

fs.writeFileSync('/tmp/brief.html', page_html)
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' })
const page = await browser.newPage()
await page.goto('file:///tmp/brief.html', { waitUntil: 'networkidle' })
await page.pdf({
  path: 'docs/App-Redesign-Brief.pdf', format: 'A4', printBackground: true,
  margin: { top: '18mm', bottom: '18mm', left: '18mm', right: '18mm' },
  displayHeaderFooter: true,
  headerTemplate: '<div></div>',
  footerTemplate: `<div style="width:100%;font-family:Inter,sans-serif;font-size:7.5pt;color:#888;padding:0 18mm;display:flex;justify-content:space-between;">
    <span>Get Lucky Golf — Creative Direction &amp; App Redesign Brief</span>
    <span class="pageNumber"></span></div>`,
})
await browser.close()
console.log('wrote docs/App-Redesign-Brief.pdf')
