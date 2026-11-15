# JMP Interactive Results Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Serve the reviewed v5 sample as a site page at `/jmp-results/` and add an "Interactive results" button to the JMP entry on `/research/`.

**Architecture:** A root-level Hugo content page with its own layout fills PaperMod's `main` block, so the site header, menu and footer stay. The numbers live in `data/jmp_results.json` and reach the page as inline JSON. The page's script is an ES module, so it cannot collide with PaperMod's own inline scripts, and its stylesheet is scoped under `.jmpx` and loaded only on this page.

**Tech Stack:** Hugo 0.148.1 extended (new template system: `layouts/`, `layouts/_partials/`), PaperMod, Hugo pipes (`minify`, `fingerprint`), plain JavaScript and SVG, Node for checks.

**Spec:** `docs/superpowers/specs/2026-11-14-jmp-results-page-design.md`

Sample sources (session scratchpad, not in the repo), referred to below as `$S`:
`/private/tmp/claude-502/-Users-taelee-Documents-CLO-Workspace-personal-website/0c68964c-a3b2-496d-9115-1a92f09ea7a1/scratchpad/jmpviz/`
— `template.html` (v5 page source), `data.json` (all parsed tables), `page.js` (v5 script as built), `harness.js` (13-scene check).

## Global Constraints

- Light theme only. Works on a phone. `hugo --gc --minify --cacheDir "$TMPDIR/hugocache"` exits 0 after every task.
- Every number traces to Table 2, 3 or 15 of the November 13, 2026 draft. No text changes beyond the removals in Task 1.
- No outside script, style or font. The page's own markup (inside `.jmpx`) has no absolute URL; the PDF link is `/kyungtae-lee-jmp.pdf`.
- Never `rm -rf public` without first running `find public -type f -newer public/index.html` and stopping if it prints anything (the owner sometimes drops files there).
- No commit until the owner has seen the pages (Task 4). Push only on the owner's yes.

## Review Focus

1. **Phone width (375px):** the three control groups wrap onto separate lines, bar labels do not collide, and tapping a bar shows its tooltip inside the screen. Pinned by Task 4 step 3.
2. **Theme rules leaking in:** PaperMod's reset sets `table { display:block; width:100% }`, strips `button` padding and background, colors links, and sets `body` to 18px. The numbers tables, segment buttons, tabs and readouts should look as they did in the sample. Pinned by Task 2 step 2 (explicit overrides) and Task 4 step 3.
3. **Script name collisions:** PaperMod's footer runs four inline classic scripts with top-level `let`/`var`. A classic script of ours declaring the same name would stop with a SyntaxError and leave empty charts. Pinned by Task 1 step 1 (`type="module"` assertion).
4. **Keyboard use:** the new button on `/research/` and every page control show a visible focus ring. Pinned by Task 2 step 1 and Task 3 step 1.
5. **JavaScript off:** charts and number tables are drawn by script. A visitor without it should see one plain line saying so, not empty boxes. Pinned by Task 1 step 1 (`<noscript>` assertion).

---

### Task 1: The page at `/jmp-results/` (content, data, layout, script)

**Files:**
- Create: `content/jmp-results.md`
- Create: `data/jmp_results.json`
- Create: `layouts/jmp-results.html`
- Create: `assets/js/jmp-results.js`
- Check script (scratchpad, not committed): `$S/check-site.js`

**Interfaces:**
- Produces: wrapper `<div class="jmpx">` around all page markup (Task 2 scopes every rule to it); front-matter `layout: jmp-results` (Task 2 keys the stylesheet on `.Layout`); URL `/jmp-results/` (Task 3 links to it).
- Script contract: `assets/js/jmp-results.js` is the body of the v5 `<script>` with one change, the first line becomes `const DATA = JSON.parse(document.getElementById("jmp-data").textContent);`. Top-level names `F`, `renderF`, `C`, `renderC` stay as in the sample (the check reads them).

- [ ] **Step 1: Write the checks first**

Baseline from the reviewed sample: `node $S/harness.js $S/page.js > $S/expected-readouts.txt` (ends with `ALL CLEAN`).

`$S/check-site.js <repo>` asserts, exiting 1 on the first failure:
- `public/jmp-results/index.html` exists and contains `id="chartF"`, `id="chartC"`, `id="tip"`, `<noscript>`, `href="/kyungtae-lee-jmp.pdf"`, and exactly one `<h1`.
- It contains `<script type="module"` and does not contain `Sample wording`, `not on the website yet`, `claude:viewport-fit-sides`, `https://taelee1085.github.io/kyungtae-lee-jmp.pdf`.
- No `<script src>` or stylesheet `<link href>` anywhere in the page points to a host other than `taelee1085.github.io` (PaperMod writes its own assets and favicons as absolute same-site URLs, and its footer links to Hugo and PaperMod, which is fine). Inside the `.jmpx` block there is no `http` URL at all. The built HTML is minified, so match attributes with or without quotes.
- The `<script type="application/json" id="jmp-data">` body parses, and has `t2.length === 32`, `t3` and `t15` arrays, and a `_source` string.
- Running `assets/js/jmp-results.js` with `"use strict";` prepended, in the `harness.js` DOM stub, with `getElementById("jmp-data").textContent` set to that parsed body, prints output identical to `$S/expected-readouts.txt` (same 13 scenes, same readouts, same SVG sizes, `ALL CLEAN`).
- The `<title>` is `From One LATE to Another: Interactive Results | Kyungtae Lee`, and `public/sitemap.xml` contains `/jmp-results/`.

- [ ] **Step 2: Run it and see it fail**

Run: `node $S/check-site.js .`
Expected: FAIL, `public/jmp-results/index.html` missing.

- [ ] **Step 3: Write the data, content and layout**

`data/jmp_results.json`: `{ "_source": "Kwon and Lee, From One LATE to Another, November 13, 2026 draft. t2 = Table 2, t3 = Table 3, t15 = Table 15.", "t2": …, "t3": …, "t15": … }`, with `t2`, `t3`, `t15` copied unchanged from `$S/data.json` (drop `t14`, the page does not use it).

`content/jmp-results.md` front matter only, no body:
```yaml
title: "From One LATE to Another: Interactive Results"
description: "Interactive figures from the job market paper From One LATE to Another, showing which parts of the prediction error machine learning reduces and which it does not."
layout: jmp-results
```

`layouts/jmp-results.html` defines `main` with the v5 markup from `template.html` lines 97–193, changed only as follows:
- outer `<div class="wrap">` becomes `<div class="jmpx">`, and `<div id="tip" hidden></div>` moves inside it (so the tooltip sees the page's color variables);
- delete the `<p class="spike">…</p>` line and the `<span class="tag">Sample wording</span>` element;
- the PDF link becomes `href="/kyungtae-lee-jmp.pdf"`;
- the page's own `<header>` and `<footer>` become `<div class="jmpx-head">` and `<div class="jmpx-credit">` (the theme already has site-level header and footer elements);
- add, right after the `jmpx-head` block: `<noscript><p class="jmpx-noscript">The figures and number tables on this page need JavaScript.</p></noscript>`;
- before the closing `</div>`: `<script type="application/json" id="jmp-data">{{ site.Data.jmp_results | jsonify | safeJS }}</script>`, then the script, built with `resources.Get "js/jmp-results.js" | minify | fingerprint` and included as `<script type="module" src="…" integrity="…"></script>`.

If Hugo renders the page with PaperMod's `single.html` instead (the check finds no `id="chartF"`), rename to `type: jmp-results` plus `layouts/jmp-results/single.html`; do not change anything else.

- [ ] **Step 4: Write `assets/js/jmp-results.js`**

Copy the script body from `template.html` (after `<script>`, before `</script>`) and replace only the `DATA` line per the Interfaces block.

- [ ] **Step 5: Build and run the checks**

Run: `hugo --gc --minify --cacheDir "$TMPDIR/hugocache" && node --check assets/js/jmp-results.js && node $S/check-site.js .`
Expected: build exits 0; check prints the 13 scenes, `ALL CLEAN`, then `SITE CHECKS PASS`.

---

### Task 2: Page-only stylesheet and the wider column

**Files:**
- Create: `assets/css/jmp-results.css` (not under `css/extended/`, which PaperMod bundles into every page)
- Create: `layouts/_partials/extend_head.html`
- Check: `$S/check-css.js`

**Interfaces:**
- Consumes: `.jmpx` wrapper, `.jmpx-head`, `.jmpx-credit`, `.jmpx-noscript`, `#tip` inside `.jmpx`, and `layout: jmp-results` from Task 1.

- [ ] **Step 1: Write the check**

`$S/check-css.js <repo>` asserts:
- Every top-level rule selector in `assets/css/jmp-results.css` (split on commas, ignoring `@media` wrappers) starts with `.jmpx` or is exactly `.main`.
- The file contains a `.jmpx button:focus-visible` rule and a `.main` rule with `max-width: calc(820px + var(--gap) * 2)`.
- `public/jmp-results/index.html` links a stylesheet whose path contains `jmp-results`, and `public/research/index.html`, `public/index.html`, `public/teaching/index.html` do not.

- [ ] **Step 2: Write the stylesheet and the head partial**

`assets/css/jmp-results.css`: the v5 rules from `template.html` lines 7–94, with `:root` variables moved onto `.jmpx`, every selector prefixed with `.jmpx` (`body` rules go on `.jmpx` itself; `#tip` becomes `.jmpx #tip`), the `.spike` and `.tag` rules dropped, `header`/`footer` selectors renamed to `.jmpx-head`/`.jmpx-credit`. `.wrap`'s side padding is dropped because `.main` already pads. Add overrides for the theme reset: `.jmpx { font-size: 16px; }`, `.jmpx table { display: table; width: auto; }`, `.jmpx .seg button` and `.jmpx .tabs button` keep their own padding and background, `.jmpx a` keeps the sample's link look, `.jmpx ul` keeps `padding-left: 18px` inside `.param`. Then `.main { max-width: calc(820px + var(--gap) * 2); }`.

`layouts/_partials/extend_head.html` (overrides PaperMod's empty one): when `.Layout` is `jmp-results`, emit `<link rel="stylesheet">` for `css/jmp-results.css | minify | fingerprint` with its integrity hash. Nothing on other pages.

- [ ] **Step 3: Build and run both checks**

Run: `hugo --gc --minify --cacheDir "$TMPDIR/hugocache" && node $S/check-css.js . && node $S/check-site.js .`
Expected: `CSS CHECKS PASS` and `SITE CHECKS PASS`.

---

### Task 3: "Interactive results" button on the JMP entry

**Files:**
- Modify: `content/research/from-one-late-to-another.md` (front matter: add `interactive: "/jmp-results/"` under `params`)
- Modify: `layouts/research/list.html` (after the `params.note` block, before `params.presentations`)
- Modify: `assets/css/extended/zz-site.css` (append)
- Check: `$S/check-button.sh`

**Interfaces:**
- Consumes: URL `/jmp-results/` from Task 1.
- Produces: front-matter field `params.interactive` (a site-relative URL). Shown only when set.

- [ ] **Step 1: Write the check**

`$S/check-button.sh <repo>` (run after an unminified build into a temp dir, `hugo --cacheDir "$TMPDIR/hugocache" -d "$TMPDIR/pub-check"`, so attribute quotes survive):
- `class="paper-button"` occurs exactly once in `research/index.html`, with `href="/jmp-results/"`.
- In that file its position is after the JMP's `paper-meta` line and before the JMP's `paper-presentations` line.
- The button contains `<span aria-hidden="true">▶</span>` and the text `Interactive results`.
- `zz-site.css` contains `a.paper-button:focus-visible`.

- [ ] **Step 2: Run it and see it fail**

Run: `bash $S/check-button.sh .`
Expected: FAIL, `paper-button` found 0 times.

- [ ] **Step 3: Add the field, the template block and the style**

Template, exact markup:
```
{{- with $p.Params.interactive }}
    <p class="paper-interactive"><a class="paper-button" href="{{ . }}"><span aria-hidden="true">▶</span> Interactive results</a></p>
{{- end }}
```
Style, `.md-content` qualified so it beats PaperMod's `.post-content a` underline: `p.paper-interactive` gets `margin-top: 8px`; `.md-content a.paper-button` is inline-block, 15px, weight 600, `border: 1.5px solid #2a78d6`, `border-radius: 999px`, `padding: 3px 12px`, `box-shadow: none`, text color `#1d5fae`; on `:hover` and `:focus-visible`, `background: #eaf2fc`; `:focus-visible` also gets `outline: 2px solid #2a78d6; outline-offset: 2px`. (Text is the darker `#1d5fae`, contrast 6.4:1 on white, because `#2a78d6` text is 4.4:1 and fails WCAG AA at 15px. The outline stays the page's DML blue.)

- [ ] **Step 4: Build and run all checks**

Run: `hugo --gc --minify --cacheDir "$TMPDIR/hugocache" && bash $S/check-button.sh . && node $S/check-css.js . && node $S/check-site.js .`
Expected: all three print PASS.

---

### Task 4: Record, review, look, commit

**Files:**
- Modify: `WORKFLOW.md` (one Decision Log row dated 2026-11-14, after the last row)

- [ ] **Step 1: Decision Log row**

Records: the page at `/jmp-results/` (layout, data file, module script, page-only stylesheet); the `params.interactive` field and its button; the darker text blue and why; the upkeep rule from spec section 8 (when the JMP PDF is replaced, compare Tables 2, 3, 15 with `data/jmp_results.json` and the footer's draft date, rerun the checks); `/new-paper` does not mention `params.interactive` and `.claude/skills` is write-protected.

- [ ] **Step 2: Reviewer**

Dispatch `academic-web-reviewer` on the change (new page, button, stylesheet, data). Fix CRITICAL and WARNING items, rerun the three checks.

- [ ] **Step 3: Look at the pages**

Ask the owner to run `hugo server` in their own terminal (the sandbox cannot bind a port). Through Chrome, open `http://localhost:1313/jmp-results/` and `http://localhost:1313/research/` at laptop width and at 375px. Confirm Review Focus 1, 2 and 4: controls wrap, labels do not collide, a tapped bar's tooltip stays on screen, the numbers table and buttons look as in the sample, the focus ring shows when tabbing, the button sits under the coauthor line. If the owner prefers to skip this, they check on their phone after the push.

- [ ] **Step 4: Commit after the owner has seen it**

```bash
git add content/jmp-results.md data/jmp_results.json layouts/jmp-results.html layouts/_partials/extend_head.html assets/js/jmp-results.js assets/css/jmp-results.css content/research/from-one-late-to-another.md layouts/research/list.html assets/css/extended/zz-site.css WORKFLOW.md docs/superpowers/specs/2026-11-14-jmp-results-page-design.md docs/superpowers/plans/2026-11-14-jmp-results-page.md
git commit -m "Add the interactive JMP results page and its button on Research"
git show --stat HEAD
```
Expected: the twelve paths above, nothing from `public/`. Push only on the owner's yes, then confirm the live page with `curl`.
