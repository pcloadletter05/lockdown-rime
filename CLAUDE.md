# Lockdown Rime — Lisa's Workstation

## What This Is
A static website that simulates a Windows NT 4.0 desktop. Visitors "log in" to Lisa's work computer at CalCom Tower on Roosevelt Island, Washington DC, set in late December 1999. It's an immersive character profile for a Project Zomboid RP — personality, relationships, and lore are discovered through exploration, not exposition.

Hosted on GitHub Pages via GitHub Actions (deploys from `/public`).

## Tech Stack & Constraints
- **HTML / CSS / vanilla JS only** — no frameworks, no build tools, no npm
- **Static site** — no backend, no database, no server-side anything
- **Desktop only** — optimized for widescreen. Show a gate screen for viewports under 800x600
- **All content in JSON** — emails, documents, bookmarks, survey data live in `/public/content/*.json` so content updates don't require touching code
- **Period authentic** — everything should look and feel like Windows NT 4.0 (1999). Grey 3D-beveled chrome, MS Sans Serif / Tahoma fonts, silver/grey UI (#C0C0C0), teal desktop (#008080), navy active title bars (#000080). NOT Windows 98 or later.

## Folder Structure
```
/ (repo root)
├── .github/workflows/deploy.yml   ← GitHub Actions deploys /public to Pages
├── .dev/                           ← Planning, lore, content drafts (git-ignored)
│   ├── BUILD_PLAN.md               ← READ THIS — phased build plan with all tasks
│   ├── lore/                       ← World bible, character profiles, timeline
│   └── content-drafts/             ← Draft content in markdown before converting to JSON
├── CLAUDE.md                       ← You are here (git-ignored)
└── public/                         ← THE LIVE SITE
    ├── index.html                  ← Boot sequence entry point
    ├── desktop.html                ← Desktop environment
    ├── css/nt4.css                 ← All NT4 visual styling
    ├── js/
    │   ├── boot.js                 ← POST → NT Boot → login sequence
    │   ├── desktop.js              ← Window manager, taskbar, Start menu
    │   └── apps.js                 ← File Explorer, Email, Browser, Notepad
    ├── content/                    ← JSON data files (emails, files, bookmarks, etc.)
    └── assets/                     ← Icons, CalCom branding, sounds, wallpaper
```

## Before You Build — Read the Plan
The build plan lives at `.dev/BUILD_PLAN.md`. It breaks the project into 8 phases:
- **Phase 0:** Skeleton & boot sequence (POST → NT boot → login → empty desktop)
- **Phase 1:** Window manager & core shell (dragging, minimize/maximize, taskbar, Start menu)
- **Phase 2:** File Explorer & document viewers
- **Phase 3:** Email client (Outlook 98 style, time-gated delivery)
- **Phase 4:** Web browser (IE5) & Notepad content
- **Phase 5:** Survey folder deep content (CATI scripts, respondent profiles)
- **Phase 6:** Print queue & system tray polish
- **Phase 7:** Storytelling layers & hidden content

Read `.dev/BUILD_PLAN.md` before starting any phase. It has detailed specs and acceptance criteria.

## Key Visual Specs (Windows NT 4.0)
- **Window chrome:** Classic grey 3D-beveled title bars with raised/sunken borders
- **Buttons:** Flat beveled minimize/maximize/close (NOT Win98 rounded style)
- **Font:** MS Sans Serif 8pt → use Tahoma or a pixel-perfect web equivalent
- **Taskbar:** Bottom-anchored. Start button, quick launch, system tray with clock
- **Desktop icons:** Left-aligned grid, single-click select, double-click open
- **Color palette:** Silver/grey (#C0C0C0) UI, teal (#008080) desktop, navy (#000080) active title bars

## Key Features to Be Aware Of
- **Live clock** — Taskbar clock runs in real time, mapped to a 1999 date. Content is time-gated via `deliver_at` fields in JSON.
- **Stuck print queue** — Blinking printer icon in system tray. Opens to show a paper-jammed job with a narratively significant timestamp.
- **Three story layers** — Surface (normal office), Middle (anomalies for careful readers), Deep (secrets for thorough investigators). All told through discoverable content, never through narration.

## Read-Only — Do Not Edit
- **`.dev/lore/staff-lore/`** — This folder contains canonical lore written by server staff. **Never modify, overwrite, reformat, or delete any file in this directory.** Treat it as a read-only reference. You may read from it to inform content, but all original files must remain exactly as they are.

## Content Workflow
1. Lore and drafts live in `.dev/` (markdown, human-readable)
2. Finalized content gets converted to JSON in `public/content/`
3. The JS reads JSON at runtime — never hardcode content in JS/HTML

## Git Rules
- **No AI attribution in commits.** Do not add `Co-Authored-By` lines or mention Claude/AI in commit messages.

## Content Conventions
- **No em dashes (—) or en dashes (–) in survey response files.** This applies to all files in `.dev/content-drafts/survey/`, all generated respondent profiles, all `respondents.json` entries, all `call-log.json` entries, and any related Lisa-voice notes. Use periods, semicolons, commas, parentheses, or "to" for ranges. Hyphens are allowed only as compound modifiers (off-island, year-end, follow-up).

## Time Anchor
- **The simulation is a single continuous in-world timeline that starts in late December 1999 and continues forward through early 2000.** It is not a two-layer model. Everything sits on the same calendar.
- **Active anchor day for "now":** Thursday, January 13, 2000 (approx. mid-afternoon in-game). This is the Thursday workday the visitor experiences.
- **Backstory:** late December 1999. Pre-Y2K crunch. Legacy respondent files (H-1247 through H-1254), the Q4 satisfaction study, and the holiday party live here.
- **Forward content:** January 2000 onward. The Jan 13 anchor day, plus future content extending toward the Jan 24-26 blizzard window.
- All new respondent profiles, call-log entries, emails, and time-gated content should be authored on this continuous timeline. Use real dates that fit chronologically.
- Note: all narrative dates across shipped content now sit on the 1999 timeline. Remaining 1998 tokens in filenames (Annual_Report_1998.doc, Holiday_Party_Signup_1998.xls, Employee_Handbook_1998.doc) and folder names are intentional archive labels, not narrative dates.

## What's Currently Built
- Placeholder files only. Nothing functional yet. Start with Phase 0.
