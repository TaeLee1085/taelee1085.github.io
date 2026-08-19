---
name: new-teaching
description: Add one teaching or TA entry (course, role, term, institution, evaluations, materials link) to the Teaching section of the personal academic website. Use when the user wants to add or update a teaching record.
---

# New Teaching — Teaching Entry Recipe

Adds one teaching/TA record to the Teaching section (`/teaching/`) the same way every
time, enforcing this project's rules (see `CLAUDE.md`). The section already has a working
template (`layouts/teaching/list.html`) — this skill is about writing a correct content
file for it, not building new layout.

## Rules this skill always enforces (from CLAUDE.md)

- **Academic accuracy first.** Never invent course titles, terms, institutions, or roles.
  Use only what the user confirms; ask if unknown.
- Light theme, mobile-responsive, site must still build
  (`hugo --gc --minify --cacheDir "$TMPDIR/hugocache"`).

## Inputs (ask for any not given, one at a time)

1. **Course title** (exact) — becomes the front-matter `title`.
2. **Role** — e.g. "Instructor", "Adjunct Instructor", "Teaching Assistant".
3. **Institution** — must match, character-for-character, one of the entries in the
   `$institutions` slice in `layouts/teaching/list.html` (currently: Brooklyn College,
   Baruch College, The City College of New York, The Graduate Center, CUNY, Hunter
   College, New York University). See Step 3 — this is the single most likely way to
   silently lose a teaching entry.
4. **Term(s)** — e.g. "Fall 2025", or a range like "Spring 2025 – Spring 2026" (existing
   entries use an en dash "–", not a hyphen, for ranges).

Do **not** ask for evaluation scores or a materials link — see the note at the end of
Step 4 for why.

## Steps

1. Choose a slug: `content/teaching/<slug>.md`. Existing convention is
   `<year>-<term>-<institution-abbrev>-<short-course>.md`, e.g.
   `2025-fall-ccny-principles-micro.md`. The slug has no effect on ordering or rendering
   — keep the convention for maintainability, not correctness.

2. Write the front matter (no page body — the template never reads `.Content` for
   teaching entries, so leave the body empty):

   ```yaml
   ---
   title: "<course title>"
   weight: <n>
   params:
     role: "<role>"
     institution: "<institution — exact match required, see Step 3>"
     terms: "<term string>"
   ---
   ```

3. **`weight` must be a top-level key**, a sibling of `title` — never nested under
   `params:`. It orders entries **only within their institution's list** (e.g. among the
   City College entries); it cannot move an entry to a different institution or reorder
   the institutions themselves. Institution order on the page is fixed by the
   `$institutions` slice in `layouts/teaching/list.html`. If `weight` is accidentally
   nested under `params:`, Hugo's `.Weight` silently stays `0`, which sorts the entry
   last within its institution — no build error, no warning.

   **If the institution is new to the site**, adding the content file alone is not
   enough: `layouts/teaching/list.html` only renders institutions in its
   `$institutions` slice, and an institution absent from that list renders nothing for
   its entries — no error, no warning, the build still exits 0. You must also add the
   institution name to that slice, in the position (top-to-bottom) you want it to appear
   on the page, in the same commit.

4. Leave `evaluation` and `materials` out of the front matter entirely. Both are
   deliberately unused: `layouts/teaching/list.html` never reads `Params.evaluation` or
   `Params.materials` (confirmed by grep — neither string appears in `layouts/`), and the
   site owner has asked for evaluation scores to be left off the site because the one
   perfect score on record came from a single respondent, so the number isn't meaningful.
   Don't "helpfully" add these fields back even if asked to surface an evaluation number
   — confirm with the site owner first, since this was a deliberate decision, not an
   oversight.

5. Verify: run `hugo --gc --minify --cacheDir "$TMPDIR/hugocache"` — must exit 0. Then
   also grep the built output for the course title, e.g.
   `grep -q "<course title>" public/teaching/index.html`, because a mistyped institution
   name builds clean with zero errors while silently rendering nothing (see Step 3).

6. Run the `academic-web-reviewer` agent on the change; fix CRITICAL/WARNING items.

7. Show the user the rendered entry (`hugo server -D`) and commit once approved.
