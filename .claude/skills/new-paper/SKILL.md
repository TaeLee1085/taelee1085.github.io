---
name: new-paper
description: Add one research paper (job market paper, working paper, work in progress, or publication) to the Research section of the personal academic website, with correct front matter, ordering, and links. Use when the user wants to add or update a paper on the site.
---

# New Paper — Research Entry Recipe

Adds one paper to the Research section the same way every time, enforcing this project's
rules (see `CLAUDE.md`).

## Rules this skill always enforces (from CLAUDE.md)

- **Academic accuracy first.** Never invent the title, coauthors, year, venue, or links.
  Use only what the user provides/confirms. If a field is unknown, ask — do not guess.
- **JMP front and center.** A job market paper sorts to the top of Research.
- **No broken links.** If a PDF/link isn't ready, omit it rather than ship a dead link.
- Light theme, mobile-responsive, site must still build (`hugo --gc --minify`).

## Inputs (ask for any not given, one at a time)

1. **Title** (exact).
2. **Authors** (order as they should appear; mark the user if coauthored).
3. **Year** (or "in progress").
4. **Status** — one of: `jmp` (job market paper), `working` (working paper),
   `wip` (work in progress), `published` (with venue).
5. **Venue** (only if `published`).
6. **Abstract** (optional but recommended).
7. **PDF** — a file the user provides (placed in `static/papers/`) or an external URL.
   Omit if not ready.

## Steps

1. If the Research section doesn't exist yet, create `content/papers/_index.md`:

   ```markdown
   ---
   title: "Research"
   ---
   ```

2. Choose a slug: `content/papers/<year>-<short-title>.md` (e.g. `2026-energy-prices.md`).
   If status is `wip`/no year, use `content/papers/<short-title>.md`.

3. If a PDF file was provided, place it at `static/papers/<slug>.pdf` and link it as
   `/papers/<slug>.pdf`. For an external URL, use it directly.

4. Write the entry file. Use `weight` for ordering: JMP = `1`, working = `10`,
   wip = `20`, published = `30` (lower = higher on the page). Front matter:

   ```markdown
   ---
   title: "<title>"
   date: <year>-01-01
   weight: <by status>
   params:
     authors: "<authors>"
     status: "<jmp|working|wip|published>"
     venue: "<venue, if published>"
     pdf: "/papers/<slug>.pdf"   # or external URL; omit if none
   ---

   <abstract, if provided>
   ```

5. If status is `jmp`, ensure the home/Research framing labels it "Job Market Paper". Note: PaperMod has no status-aware list/single layout, so rendering `params.status`/`params.authors` nicely will need a custom `layouts/papers/` template — use `brainstorming → writing-plans` before building that (don't hand-hack it inline).

6. Build to verify: `hugo --gc --minify` → exits 0, no broken-ref warnings.

7. Run the `academic-web-reviewer` agent on the change; fix CRITICAL/WARNING items.

8. Show the user the rendered entry (`hugo server -D`) and commit once approved.

## Notes

- This skill is intentionally small. For a redesign of how Research renders (custom
  layout), use `brainstorming → writing-plans` instead.
