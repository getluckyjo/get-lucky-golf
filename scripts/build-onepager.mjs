#!/usr/bin/env node
/**
 * Renders docs/App-Redesign-Onepager.md to a single-page A4 PDF.
 * Must fit on ONE page — the script asserts that and fails if it doesn't.
 *
 *   npm i -D playwright --no-save && node scripts/build-onepager.mjs
 */
import fs from 'node:fs'
import { chromium } from 'playwright'

const SRC = 'docs/App-Redesign-Onepager.md'
const OUT = 'docs/App-Redesign-Onepager.pdf'
const FONT = 'design/03-assets/fonts/PosterGothicRoundATF-Heavy.woff2'
const SHOTS = [
  ['02-onboarding', 'Onboarding'],
  ['08-choose-stake', 'Choose stake'],
  ['16-home', 'Home'],
  ['20-membership', 'Membership'],
].map(([f, label]) => ({ label, src: 'file://' + process.cwd() + `/design/00-reference/current-app/${f}__default.png` }))

const md = fs.readFileSync(SRC, 'utf8')
const fontB64 = fs.readFileSync(FONT).toString('base64')

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const inline = s => esc(s)
  .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  .replace(/`([^`]+)`/g, '<code>$1</code>')
  .replace(/·/g, '<span class="dot">·</span>')

// Split the markdown into its sections so the lower band can go two-column.
const blocks = {}
let key = '_head'
for (const line of md.split('\n')) {
  const h = line.match(/^##\s+(.*)/)
  const h1 = line.match(/^#\s+(.*)/)
  if (h1) { blocks._title = h1[1]; continue }
  if (h) { key = h[1]; blocks[key] = []; continue }
  ;(blocks[key] ??= []).push(line)
}
const para = arr => (arr ?? []).join('\n').trim().split(/\n\s*\n/)
  .filter(Boolean).map(p => `<p>${inline(p.replace(/\n/g, ' '))}</p>`).join('')

const html = `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  @font-face{font-family:'Poster Gothic';src:url(data:font/woff2;base64,${fontB64}) format('woff2');font-weight:800;font-display:block}
  :root{--forest:#1e3120;--green:#335231;--green-light:#4a7a3d;--cream:#f5f0e1;--cream-dk:#e8e0cc;--gold:#c9a94e;--gold-dk:#8a6f28;--ink:#1a1a1a;--charcoal:#3a3a3a}
  *{box-sizing:border-box;margin:0;padding:0}
  @page{size:A4;margin:0}
  html,body{width:210mm}
  body{font-family:Inter,system-ui,sans-serif;font-size:9.7pt;line-height:1.44;color:var(--ink)}
  .sheet{width:210mm;height:297mm;padding:14mm 15mm;background:var(--cream);overflow:hidden;
         display:flex;flex-direction:column}
  .foot{margin-top:auto}
  h1{font-family:'Poster Gothic',Impact,sans-serif;font-weight:800;font-size:30pt;line-height:.94;
     text-transform:uppercase;letter-spacing:-.5px;color:var(--forest)}
  .kicker{font-size:9pt;font-weight:600;letter-spacing:2.4px;text-transform:uppercase;color:var(--gold-dk);margin-bottom:7px}
  .lede{font-size:11pt;font-weight:600;color:var(--green);margin:9px 0 8px}
  .rule{height:3px;background:linear-gradient(90deg,var(--gold) 0%,var(--gold) 62px,var(--cream-dk) 62px);margin:11px 0 12px}
  h2{font-family:'Poster Gothic',Impact,sans-serif;font-weight:800;font-size:13pt;text-transform:uppercase;
     letter-spacing:-.2px;color:var(--forest);margin:0 0 6px}
  p{margin:0 0 6px}
  .three{display:flex;flex-direction:column;gap:7px;margin-bottom:13px}
  .item{border-left:2.5px solid var(--green-light);padding-left:11px}
  .item strong:first-child{color:var(--forest)}
  .band{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:12px}
  .card{background:#fffdf7;border:1px solid var(--cream-dk);border-radius:7px;padding:11px 13px}
  .card h2{font-size:11.5pt;margin-bottom:5px}
  .fixed{font-size:9.1pt;color:var(--charcoal)}
  .dot{color:var(--gold-dk);font-weight:700;padding:0 1px}
  .today{margin:2px 0 12px}
  .today h2{font-size:11.5pt;margin-bottom:2px}
  .today .cap{font-size:8.7pt;color:var(--charcoal);margin-bottom:8px}
  .shots{display:grid;grid-template-columns:repeat(4,1fr);gap:11px}
  .shot{border:1px solid var(--cream-dk);border-radius:6px;overflow:hidden;background:#fff}
  .shot img{width:100%;height:112px;object-fit:cover;object-position:top center;display:block}
  .shot span{display:block;font-size:7.6pt;font-weight:600;letter-spacing:.4px;text-transform:uppercase;
             color:var(--charcoal);padding:4px 6px;border-top:1px solid var(--cream-dk)}
  .foot{background:var(--forest);color:var(--cream);border-radius:7px;padding:11px 14px;display:flex;
        justify-content:space-between;align-items:center;gap:18px}
  .foot p{margin:0;font-size:9.3pt;color:#e6e0cd}
  .foot strong{color:#fff}
  .next{font-family:'Poster Gothic',Impact,sans-serif;font-size:12.5pt;text-transform:uppercase;
        color:var(--gold);white-space:nowrap;letter-spacing:.2px}
  code{font-family:ui-monospace,Consolas,monospace;font-size:8.6pt;background:var(--cream-dk);
       padding:.5px 3.5px;border-radius:3px;color:var(--gold-dk)}
  strong{font-weight:600}
</style></head><body><div class="sheet">
  <div class="kicker">Creative brief · August 2026</div>
  <h1>${esc(blocks._title.replace('Get Lucky Golf — ', ''))}<br><span style="color:var(--green-light)">Get Lucky Golf</span></h1>
  <div class="rule"></div>
  ${para(blocks._head)}
  <h2>Three things that change how you'd approach this</h2>
  <div class="three">${para(blocks["Three things that change how you'd approach this"])
      .replace(/<p>/g, '<div class="item"><p>').replace(/<\/p>/g, '</p></div>')}</div>
  <div class="band">
    <div class="card"><h2>What you deliver</h2>${para(blocks['What you deliver'])}</div>
    <div class="card"><h2>What's fixed</h2><div class="fixed">${para(blocks["What's fixed"])}</div></div>
  </div>
  <div class="today">
    <h2>The app today</h2>
    <div class="cap">A reference for what it does, not how it should look. Twenty screens are in the pack.</div>
    <div class="shots">${SHOTS.map(s => `<div class="shot"><img src="${s.src}"><span>${s.label}</span></div>`).join('')}</div>
  </div>
  <div class="foot">
    <div>${para(blocks['Where everything is']).replace(/<p><strong>Next:<\/strong>.*?<\/p>/, '')}</div>
    <div class="next">Call this week<br>then Stage 0</div>
  </div>
</div></body></html>`

fs.writeFileSync('/tmp/onepager.html', html)

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' })
const page = await browser.newPage()
await page.goto('file:///tmp/onepager.html', { waitUntil: 'networkidle' })
await page.pdf({ path: OUT, format: 'A4', printBackground: true,
  margin: { top: '0', bottom: '0', left: '0', right: '0' } })
await browser.close()

// /Type /Pages (the page-tree node) contains '/Type /Page' — exclude it or every count is +1.
const pages = (fs.readFileSync(OUT).toString('latin1').match(/\/Type\s*\/Page(?![s\w])/g) ?? []).length
console.log(`${OUT} — ${pages} page(s), ${(fs.statSync(OUT).size / 1024).toFixed(0)} KB`)
if (pages !== 1) { console.error(`FAIL: must be exactly 1 page, got ${pages}. Cut copy.`); process.exit(1) }
