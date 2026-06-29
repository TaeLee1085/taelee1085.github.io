---
name: new-teaching
description: Add one teaching or TA entry (course, role, term, institution, evaluations, materials link) to the Teaching section of the personal academic website. Use when the user wants to add or update a teaching record.
---

# New Teaching — Teaching Entry Recipe

Adds one teaching/TA record to the Teaching section, enforcing this project's rules
(see `CLAUDE.md`).

## Rules this skill always enforces (from CLAUDE.md)

- **Academic accuracy first.** Never invent course titles, terms, institutions, or
  evaluation numbers. Use only what the user confirms; ask if unknown.
- **No broken links.** Omit a materials/evaluations link rather than ship a dead one.
- Light theme, mobile-responsive, site must still build (`hugo --gc --minify`).

## Inputs (ask for any not given, one at a time)

1. **Course title** (exact).
2. **Role** — e.g. Instructor, Teaching Assistant.
3. **Institution**.
4. **Term(s)** — e.g. "Fall 2025".
5. **Evaluation** (optional) — a number/summary the user provides.
6. **Materials link** (optional) — URL or a file placed in `static/teaching/`.

## Steps

1. If the Teaching section doesn't exist, create `content/teaching/_index.md`:

   ```markdown
   ---
   title: "Teaching"
   ---
   ```

2. Slug: `content/teaching/<term>-<short-course>.md` (e.g. `2025-fall-intro-micro.md`).

3. Write the entry. Order newest first via `date` (most recent term = newest date):

   ```markdown
   ---
   title: "<course title>"
   date: <YYYY>-<MM>-01
   params:
     role: "<role>"
     institution: "<institution>"
     term: "<term>"
     evaluation: "<eval, if provided>"
     materials: "<URL or /teaching/<file>; omit if none>"
   ---
   ```

4. Build to verify: `hugo --gc --minify` → exits 0.

5. Run the `academic-web-reviewer` agent; fix CRITICAL/WARNING items.

6. Show the rendered entry and commit once approved.
