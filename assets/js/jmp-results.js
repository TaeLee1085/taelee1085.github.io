const DATA = JSON.parse(document.getElementById("jmp-data").textContent);
const COLORS = { I2SLS: "var(--i2sls)", DML: "var(--dml)" };
const METHODS = ["I2SLS", "DML"];
const REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const MINUS = "−";
const f3 = v => { const s = Math.abs(v).toFixed(3); return Number(s) === 0 ? "0.000" : (v < 0 ? MINUS : "") + s; };
const f0 = v => (v < 0 ? MINUS : "") + Math.abs(Math.round(v));
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
function niceTicks(min, max, count) {
  const span = max - min || 1;
  let step = Math.pow(10, Math.floor(Math.log10(span / count)));
  const err = span / count / step;
  if (err >= 7.5) step *= 10; else if (err >= 3.5) step *= 5; else if (err >= 1.5) step *= 2;
  const ticks = [];
  for (let v = Math.ceil(min / step) * step; v <= max + step * 1e-6; v += step) ticks.push(Number(v.toFixed(10)));
  const dec = Math.max(0, -Math.floor(Math.log10(step) + 1e-9));
  return { ticks, fmt: v => (v < 0 ? MINUS : "") + Math.abs(v).toFixed(dec) };
}
const pick = (rows, k) => rows.find(r => Object.keys(k).every(a => r[a] === k[a]));
const vals = r => r.terms.map(t => t[0]).concat([r.bias[0]]);
const ses = r => r.terms.map(t => t[1]).concat([r.bias[1]]);
const TERMS = [
  { k: "Term I", d: "sample", name: "Sample error" },
  { k: "Term II", d: "slope", name: "Slope error" },
  { k: "Term III", d: "curve", name: "Curve error" },
  { k: "Term IV", d: "weights", name: "Weighting error" },
  { k: "Total", d: "error", name: "Total prediction error" }
];

/* ---------- tooltip ---------- */
const tip = document.getElementById("tip");
function showTip(html, x, y) {
  tip.innerHTML = html; tip.hidden = false;
  const r = tip.getBoundingClientRect();
  let left = x + 14, top = y + 14;
  if (left + r.width > window.innerWidth - 8) left = x - r.width - 14;
  if (left < 8) left = 8;
  if (top + r.height > window.innerHeight - 8) top = y - r.height - 14;
  tip.style.left = left + "px"; tip.style.top = Math.max(8, top) + "px";
}
const hideTip = () => { tip.hidden = true; };
document.addEventListener("pointerdown", e => { if (!e.target.closest("[data-tip]")) hideTip(); });
window.addEventListener("scroll", hideTip, { passive: true });
function wireTips(el, html) {
  const at = (t, x, y) => { const h = html(t.dataset.tip); if (h) showTip(h, x, y); };
  const move = e => { const t = e.target.closest("[data-tip]"); if (t) at(t, e.clientX, e.clientY); else if (e.pointerType === "mouse") hideTip(); };
  el.addEventListener("pointermove", move);
  el.addEventListener("pointerdown", move);
  el.addEventListener("pointerleave", e => { if (e.pointerType === "mouse") hideTip(); });
  el.addEventListener("focusin", e => { const t = e.target.closest("[data-tip]"); if (!t) return; const r = t.getBoundingClientRect(); at(t, r.left + r.width / 2, r.top); });
  el.addEventListener("focusout", hideTip);
}
/* What each level means, shown in the line under the buttons when one is pressed. Keyed by
   button group, then by the button's data-v. Facts from the paper: pp. 28-30 (instrument,
   outcome equation: only its direct X part is linear or a step) and the Card design's
   equations for the effect and the sample/target split. */
const HINT = "Press a button to see what it means.";
const EXPLAIN = {
  segS: { 1: `<b>Low spread.</b> X has a standard deviation of 1, so people differ only a little.`,
    10: `<b>High spread.</b> X has a standard deviation of 10, the largest in the paper, used as a stress test.` },
  segI: { 0: `<b>Low instrument nonlinearity.</b> The paper's "linear" design: X enters the S-shaped curve linearly. Because the curve is S-shaped, the chance of getting the instrument is still nonlinear in X.`,
    1: `<b>High instrument nonlinearity.</b> The paper's "cubic" design: a cubic term in X is added inside the S-shaped curve, so the chance is more nonlinear.` },
  segO: { 0: `<b>Low outcome nonlinearity.</b> The paper's "linear" design: the part of the outcome that depends directly on X rises linearly with X.`,
    1: `<b>High outcome nonlinearity.</b> The paper's "step" design: the part of the outcome that depends directly on X jumps when X passes zero.` },
  segL: { 0: `<b>Low treatment effect nonlinearity.</b> The true effect is the linear approximation of the effect calibrated to Card.`,
    1: `<b>High treatment effect nonlinearity.</b> The true effect is the full nonlinear effect calibrated to Card.` },
  segT: { 0: `<b>No difference.</b> People are split into sample and target at random, so both have the same mix of characteristics.`,
    0.5: `<b>Moderate difference.</b> People with higher values of the characteristics are more likely to be in the target.`,
    1: `<b>Strong difference.</b> People with higher values of the characteristics are even more likely to be in the target. This is the largest setting in the paper.` }
};
function segment(el, value, onPick, say) {
  el.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.v === String(value))));
  if (!el.dataset.wired) { el.dataset.wired = "1"; el.addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return;
    say.innerHTML = EXPLAIN[el.id][b.dataset.v]; onPick(Number(b.dataset.v)); }); }
}

/* ---------- error-by-term chart, shared by both sections ----------
   set(rows, focus, domain): rows = { I2SLS: [I, II, III, IV, Total], DML: [...] } with
   { v, se } per bar. Bars animate between settings; a new domain redraws without animation. */
function termChart(el, aria) {
  let cur = null, tgt = null, focus = [0], dom = null, raf = 0;
  function draw() {
    const W = Math.max(290, el.clientWidth || 600), H = 320, m = { l: 48, r: 8, t: 22, b: 54 };
    const pw = W - m.l - m.r, ph = H - m.t - m.b;
    const gap = Math.min(24, pw * 0.04), band = (pw - gap) / 5, bw = Math.min(30, band * 0.3), inner = 3;
    const [lo, hi] = dom, y = v => m.t + (hi - v) / (hi - lo) * ph;
    const gx = i => m.l + band * i + (i === 4 ? gap : 0);
    const tk = niceTicks(lo, hi, 5), roomy = bw >= 24, minLab = (hi - lo) / 100;
    let o = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="group" aria-label="${esc(aria)}">`;
    focus.forEach(i => { o += `<rect x="${(gx(i) + 3).toFixed(1)}" y="${m.t}" width="${(band - 6).toFixed(1)}" height="${ph}" rx="6" fill="var(--focus)"/>`; });
    tk.ticks.forEach(v => { const yy = y(v).toFixed(1);
      o += `<line x1="${m.l}" x2="${W - m.r}" y1="${yy}" y2="${yy}" stroke="var(--rule)"/><text x="${m.l - 8}" y="${yy}" dy="0.32em" text-anchor="end" font-size="11" fill="var(--ink-3)">${tk.fmt(v)}</text>`; });
    o += `<line x1="${(gx(4) - gap / 2).toFixed(1)}" x2="${(gx(4) - gap / 2).toFixed(1)}" y1="${m.t}" y2="${H - m.b + 6}" stroke="var(--rule)" stroke-dasharray="3 3"/>`;
    o += `<text x="${m.l}" y="${m.t - 10}" font-size="11.5" fill="var(--ink-2)">Prediction error</text>`;
    // Value labels go on top of every bar with a white halo, so a neighbouring bar drawn later
    // cannot hide part of a number; the invisible hover targets go last.
    let labs = "", hits = "";
    for (let i = 0; i < 5; i++) {
      const cx = gx(i) + band / 2, key = focus.includes(i) || i === 4;
      let labPrev = null;
      METHODS.forEach((mt, j) => {
        const v = cur[mt][i], x = j === 0 ? cx - inner / 2 - bw : cx + inner / 2;
        const top = y(Math.max(0, v)), bot = y(Math.min(0, v));
        let h = bot - top, yt = top; if (h < 1.5) { h = 1.5; yt = y(0) - 0.75; }
        o += `<rect x="${x.toFixed(1)}" y="${yt.toFixed(1)}" width="${bw.toFixed(1)}" height="${h.toFixed(1)}" rx="3" fill="${COLORS[mt]}" opacity="${i === 4 ? 1 : 0.9}"/>`;
        const target = tgt[mt][i].v;
        if (key || (roomy && Math.abs(target) >= minLab)) {
          let ly = v >= 0 ? yt - 5 : yt + h + 13;
          if (j === 1 && labPrev && labPrev.up === (v >= 0) && Math.abs(labPrev.y - ly) < 13) ly = v >= 0 ? labPrev.y - 13 : labPrev.y + 13;
          labPrev = { y: ly, up: v >= 0 };
          labs += `<text x="${(x + bw / 2).toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="middle" font-size="10.5" font-weight="${key ? 700 : 500}" fill="var(--ink)" stroke="var(--bg)" stroke-width="3" stroke-linejoin="round" paint-order="stroke">${f3(target)}</text>`;
        } else if (j === 0) labPrev = null;
        hits += `<rect data-tip="${mt}|${i}" tabindex="0" role="img" aria-label="${mt} ${TERMS[i].name} ${f3(target)}" x="${x.toFixed(1)}" y="${m.t}" width="${bw.toFixed(1)}" height="${ph}" fill="transparent"/>`;
      });
      o += `<text x="${cx.toFixed(1)}" y="${H - m.b + 20}" text-anchor="middle" font-size="12.5" font-weight="${key ? 700 : 600}" fill="var(--ink)">${TERMS[i].k}</text>`;
      o += `<text x="${cx.toFixed(1)}" y="${H - m.b + 37}" text-anchor="middle" font-size="11.5" fill="var(--ink-2)">${TERMS[i].d}</text>`;
    }
    o += `<line x1="${m.l}" x2="${W - m.r}" y1="${y(0).toFixed(1)}" y2="${y(0).toFixed(1)}" stroke="var(--ink)" stroke-width="1.2"/>`;
    el.innerHTML = o + labs + hits + `</svg>`;
  }
  const plain = rows => ({ I2SLS: rows.I2SLS.map(c => c.v), DML: rows.DML.map(c => c.v) });
  function set(rows, f, d) {
    const newDom = !dom || d[0] !== dom[0] || d[1] !== dom[1];
    tgt = rows; focus = f; dom = d;
    cancelAnimationFrame(raf);
    const to = plain(rows), from = cur;
    if (!from || REDUCED || newDom) { cur = to; draw(); return; }
    const t0 = performance.now(), D = 520;
    const step = now => {
      const k = Math.min(1, (now - t0) / D), e = 1 - Math.pow(1 - k, 3);
      cur = { I2SLS: to.I2SLS.map((v, i) => from.I2SLS[i] + (v - from.I2SLS[i]) * e), DML: to.DML.map((v, i) => from.DML[i] + (v - from.DML[i]) * e) };
      draw();
      if (k < 1) raf = requestAnimationFrame(step); else { cur = to; draw(); }
    };
    raf = requestAnimationFrame(step);
  }
  wireTips(el, key => { const [mt, i] = key.split("|"); const c = tgt[mt][+i];
    return `<b>${mt} · ${TERMS[+i].name}</b><br><span class="v">${f3(c.v)}</span> (Monte Carlo SE ${c.se.toFixed(3)})`; });
  new ResizeObserver(() => { if (cur) draw(); }).observe(el);
  return { set };
}
const cells = r => vals(r).map((v, i) => ({ v, se: ses(r)[i] }));
function numbersTable(rows, note) {
  let tb = `<table><thead><tr><th>Component</th><th>I2SLS</th><th>DML</th></tr></thead><tbody>`;
  for (let i = 0; i < 5; i++) tb += `<tr><td>${TERMS[i].k} · ${TERMS[i].name}</td>` + METHODS.map(mt => `<td>${f3(rows[mt][i].v)} <span style="color:var(--ink-3)">(${rows[mt][i].se.toFixed(3)})</span></td>`).join("") + `</tr>`;
  return tb + `</tbody></table><p class="source">Monte Carlo standard errors are in parentheses. ${note}</p>`;
}

/* ---------- what DML fixes: Table 2 (simple design, same mix of people in sample and target) ---------- */
const INST = ["linear", "cubic"], OUTC = ["linear", "step"];
const F = { scale: 10, inst: 1, out: 1 };
const DOM_F = { 1: [-0.25, 0.3], 10: [-32, 12] };
const t2 = (mt, s, i, o) => pick(DATA.t2, { method: mt, scale: s, inst: INST[i], outcome: OUTC[o], theta: 0 });
const chartF = termChart(document.getElementById("chartF"), "Prediction error by term for I2SLS and DML in the simple design");
const sayF = document.getElementById("sayF");
sayF.innerHTML = HINT;
function renderF() {
  segment(document.getElementById("segS"), F.scale, v => { F.scale = v; renderF(); }, sayF);
  segment(document.getElementById("segI"), F.inst, v => { F.inst = v; renderF(); }, sayF);
  segment(document.getElementById("segO"), F.out, v => { F.out = v; renderF(); }, sayF);
  const rows = { I2SLS: cells(t2("I2SLS", F.scale, F.inst, F.out)), DML: cells(t2("DML", F.scale, F.inst, F.out)) };
  chartF.set(rows, [0], DOM_F[F.scale]);
  const base = { I2SLS: cells(t2("I2SLS", F.scale, 0, 0)), DML: cells(t2("DML", F.scale, 0, 0)) };
  const a = rows.I2SLS[0].v, b = rows.DML[0].v, a4 = rows.I2SLS[3].v, b4 = rows.DML[3].v, aT = rows.I2SLS[4].v, bT = rows.DML[4].v;
  const what = F.inst && F.out ? "instrument and outcome nonlinearity are both high"
    : F.inst ? "instrument nonlinearity is high" : "outcome nonlinearity is high";
  let msg;
  if (!F.inst && !F.out) msg = `<p>Instrument and outcome nonlinearity are both low. Term I is <b>${f3(a)}</b> for I2SLS and <b>${f3(b)}</b> for DML.</p><p>Now set one of them to high and watch Term I.</p>`;
  else msg = `<p>When ${what}, Term I for I2SLS moves from ${f3(base.I2SLS[0].v)} to <b>${f3(a)}</b>. For DML, it moves from ${f3(base.DML[0].v)} to <b>${f3(b)}</b>.</p>`;
  if (Math.abs(aT) < Math.abs(bT) && Math.sign(a) !== Math.sign(a4) && Math.abs(a) > Math.abs(b))
    msg += `<p>The total error of I2SLS (${f3(aT)}) is smaller in size than that of DML (${f3(bT)}). But this is only because its Term I (${f3(a)}) and Term IV (${f3(a4)}) have opposite signs and partly cancel.</p>`;
  if (F.scale === 10) msg += `<p>Term IV, the weighting error, is about ${f0(a4)} for both methods. DML does not fix it. We come back to this in the next part.</p>`;
  else if (Math.abs(b) > Math.abs(a)) msg += `<p>With a low spread, every term is small. Here DML does not do better, and its Term I is slightly larger. I2SLS remains competitive at this scale.</p>`;
  document.getElementById("readF").innerHTML = msg;
  document.getElementById("tableF").innerHTML = numbersTable(rows, `Spread of X: ${F.scale === 10 ? "high (standard deviation 10)" : "low (standard deviation 1)"}. Instrument nonlinearity: ${F.inst ? `high (the paper's "cubic")` : `low (the paper's "linear")`}. Outcome nonlinearity: ${F.out ? `high (the paper's "step")` : `low (the paper's "linear")`}.`);
}
renderF();
{
  const kI = pick(DATA.t15, { kappa: 2, gamma: 0, theta: 0, method: "I2SLS" }), kD = pick(DATA.t15, { kappa: 2, gamma: 0, theta: 0, method: "DML" });
  document.getElementById("alsoF").innerHTML = `<b>The Card design shows the same pattern.</b> When instrument nonlinearity is made stronger than in the Card calibration, with a linear true effect and the same mix of people, the average prediction error is ${f3(kI.bias)} for I2SLS and ${f3(kD.bias)} for DML.`;
}

/* ---------- what DML does not fix: Table 3 (Card design) ---------- */
const t3 = (mt, lam, th) => pick(DATA.t3, { method: mt, lam: lam, theta: th });
const C = { tab: "cate", lam: 1, theta: 0 };
const chartC = termChart(document.getElementById("chartC"), "Prediction error by term for I2SLS and DML in the Card design");
const DOM_C = [-0.15, 0.8];
let ctlTab = null; // the tab the buttons were built for; rebuilt only on a tab change so a pressed button keeps focus
const sayC = document.getElementById("sayC");
function renderC() {
  const isCate = C.tab === "cate";
  if (isCate) C.theta = 0; else C.lam = 1;
  document.getElementById("tabCate").setAttribute("aria-pressed", String(isCate));
  document.getElementById("tabW").setAttribute("aria-pressed", String(!isCate));
  document.getElementById("paramCate").hidden = !isCate;
  document.getElementById("paramW").hidden = isCate;
  document.getElementById("heldC").textContent = isCate
    ? "Here the sample and target have the same mix of people, and the instrument and outcome relationships stay as calibrated to the Card data."
    : "Here the true effect is the nonlinear one, and the instrument and outcome relationships stay as calibrated to the Card data.";
  const ctl = document.getElementById("ctlC");
  if (ctlTab !== C.tab) {
    ctl.innerHTML = isCate
      ? `<div class="ctl"><span class="name">Treatment effect nonlinearity</span><div class="seg" role="group" aria-label="Treatment effect nonlinearity" id="segL"><button type="button" data-v="0">low</button><button type="button" data-v="1">high</button></div></div>`
      : `<div class="ctl"><span class="name">Difference between sample and target</span><div class="seg" role="group" aria-label="Difference between sample and target" id="segT"><button type="button" data-v="0">none</button><button type="button" data-v="0.5">moderate</button><button type="button" data-v="1">strong</button></div></div>`;
    sayC.innerHTML = HINT;
  }
  ctlTab = C.tab;
  if (isCate) segment(document.getElementById("segL"), C.lam, v => { C.lam = v; renderC(); }, sayC);
  else segment(document.getElementById("segT"), C.theta, v => { C.theta = v; renderC(); }, sayC);
  const rows = { I2SLS: cells(t3("I2SLS", C.lam, C.theta)), DML: cells(t3("DML", C.lam, C.theta)) };
  chartC.set(rows, isCate ? [0] : [3], DOM_C);
  const d = rows.DML.map(c => c.v);
  let msg;
  if (isCate) {
    const other = vals(t3("DML", 1 - C.lam, 0))[0];
    msg = C.lam === 0
      ? `<p>With low treatment effect nonlinearity, Term I for DML is only <b>${f3(d[0])}</b>, and its total error is ${f3(d[4])}.</p><p>Now set it to high and watch Term I.</p>`
      : `<p>With high treatment effect nonlinearity, Term I for DML rises from ${f3(other)} to <b>${f3(d[0])}</b>, and its total error becomes ${f3(d[4])}. Flexible estimates of the other relationships do not fix a linear model of the effect.</p>`;
  } else {
    const iv = [0, 0.5, 1].map(th => vals(t3("DML", 1, th))[3]);
    const iv2 = [0, 0.5, 1].map(th => vals(t3("I2SLS", 1, th))[3]);
    msg = `<p>As the target moves away from the sample, Term IV grows in size for both methods. For DML it goes ${iv.map(f3).join(" → ")}, and for I2SLS it goes ${iv2.map(f3).join(" → ")}.</p>`;
    if (C.theta > 0) msg += `<p>For DML, Term I (${f3(d[0])}) and Term IV (${f3(d[3])}) have opposite signs, so its total error is only ${f3(d[4])}. The total falls even though the weighting error grows.</p>`;
    else msg += `<p>Now make the target different from the sample and watch Term IV.</p>`;
  }
  document.getElementById("readC").innerHTML = msg;
  document.getElementById("tableC").innerHTML = numbersTable(rows, `Treatment effect nonlinearity: ${C.lam ? "high (the full effect calibrated to Card)" : "low (its linear approximation)"}. Difference between sample and target: ${C.theta === 0 ? "none" : C.theta === 0.5 ? "moderate" : "strong"}.`);
}
document.getElementById("tabCate").addEventListener("click", () => { C.tab = "cate"; renderC(); });
document.getElementById("tabW").addEventListener("click", () => { C.tab = "w"; renderC(); });
renderC();
