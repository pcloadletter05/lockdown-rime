# Lisa's Workstation — Lockdown Rime

## What This Is

A static website that simulates a Windows NT 4.0 desktop environment. Visitors "log in" to Lisa Milavic's work computer at CalCom Tower on Roosevelt Island, set in late December 1999. It's an immersive character profile for a Project Zomboid RP — personality, relationships, and lore are discovered through exploration, not exposition.

## Core Value

The visitor must feel like they've sat down at a real person's real work computer in 1999. Every pixel, every interaction, every piece of content reinforces that illusion.

## Current State

All 8 milestones (v1.0–v1.7) shipped. 29 phases, 49 plans complete. The simulation is a fully immersive Windows NT 4.0 desktop with boot sequence, window manager, 7 applications (File Explorer, Outlook 98, IE5, Notepad/WordPad/Spreadsheet viewers, Winamp, Calculator), Network Neighborhood, Recycle Bin, system sounds, and a Mystify screensaver. Content spans the continuous Dec 1999 → Jan 13, 2000 timeline with time-gated email delivery, voicemail logs, and three narrative layers.

## Current Milestone: v1.8 Timeline Forward & Drudge Report

**Goal:** Advance the in-game anchor day from Jan 9 to Jan 13, 2000, layer in two days of new content (Jan 12 calls, Jan 13 desktop notes), and add a period-authentic Drudge Report page to the IE5 browser.

**Target features:**

- Anchor shift from Jan 9 Sunday to Jan 13 Thursday with read-state pass on archived email
- Jan 12-13 desktop notes additions (Syd flyer mention + Lucy/Francisco contact)
- Jan 12 call log + 2 new H-XXXX respondent profiles + 1 voicemail entry
- Period-authentic 1999/2000 Drudge Report page in IE5 with bookmark

## Requirements

### Validated

- ✓ POST → NT boot → login → desktop boot sequence — v1.0
- ✓ Windows NT 4.0 visual fidelity (grey 3D-beveled chrome, correct color palette, period fonts) — v1.0
- ✓ Mobile gate screen for viewports under 800x600 — v1.0
- ✓ All content in JSON files under public/content/ — v1.0
- ✓ Window manager with drag, minimize, maximize, close, z-stacking — v1.0
- ✓ Taskbar with Start menu, window buttons, system tray with live clock — v1.0
- ✓ Desktop icons with select/open behavior — v1.0
- ✓ File Explorer with two-pane layout navigating JSON-driven folder tree — v1.0
- ✓ Document viewers (WordPad, Notepad, spreadsheet) rendering content from JSON — v1.0
- ✓ Outlook 98-style email client with time-gated delivery — v1.0
- ✓ IE5-style web browser with bookmarks and pre-built intranet/external pages — v1.0
- ✓ Survey folder with authentic CATI materials and respondent profiles — v1.0
- ✓ Stuck print queue with narratively significant timestamp — v1.0
- ✓ Three narrative layers: surface (normal office), middle (anomalies), deep (secrets) — v1.0
- ✓ Resizable windows with ghost outline and NT4 cursors — v1.0
- ✓ Date shift to December 1998 across all JS and JSON content — v1.1
- ✓ Ask Jeeves period-authentic search homepage in IE5 browser — v1.1
- ✓ CalCom logo branding on intranet, corporate, and login dialog — v1.1
- ✓ Password authentication on login dialog (password: "horizon") — v1.1
- ✓ Ask Jeeves page visually accurate to 1998 reference (lavender bg, maroon nav, red oval buttons) — v1.2
- ✓ Desktop icons in NT4 convention order with bottom-anchored Recycle Bin — v1.2
- ✓ All location references corrected to Roosevelt Island, Washington DC — v1.2
- ✓ Corporate page chrome unified with intranet (navy #000080, Arial, matched footer) — v1.2
- ✓ Ask Jeeves background corrected to pale yellow (#fefecd) — v1.3
- ✓ Timeline reverted to December 1999 across all JS and JSON — v1.3
- ✓ Email text rendering fixed (no white horizontal lines) — v1.3
- ✓ CalCom desktop logo watermark (white-on-teal, 15% opacity) — v1.3
- ✓ Grocery list and notepad notes updated to current canon — v1.3
- ✓ Intern email with clickable attachment opening in WordPad — v1.3
- ✓ Winamp 2.x desktop application with pixel-perfect bitmap sprite rendering — v1.4
- ✓ Audio playback engine with play/pause/stop/prev/next and seek — v1.4
- ✓ Oscilloscope visualizer via Web Audio API AnalyserNode — v1.4
- ✓ Playlist panel with 3 period-authentic tracks — v1.4
- ✓ Desktop icon, Start menu entry, and singleton window enforcement — v1.4
- ✓ Network Neighborhood Explorer with domain/machine/share browsing — v1.5
- ✓ Access Denied dialogs for locked network resources — v1.5
- ✓ UNC path display in address bar — v1.5
- ✓ Network JSON data architecture for CalCom network tree — v1.5
- ✓ External website browsing via iframe in IE5 browser — v1.6
- ✓ Link-out confirmation dialog for sites that block framing — v1.6
- ✓ Bookmark JSON schema extension with mode/src/displayUrl fields — v1.6
- ✓ DNS error page distinct from 404 — v1.6
- ✓ Throbber animation during iframe loading — v1.6
- ✓ IE popup ad window system with WindowManager minimizable/position support — v1.6
- ✓ Once-per-session popup trigger tracking with timer-based delayed spawn — v1.6
- ✓ Pop-under z-order support and explicit popup zOrder branch — v1.6
- ✓ H-0003 Andersen SMS respondent with 4-column Notes survey table — v1.6
- ✓ Screener section convention (S1-S3) for Jan 9+ respondents — v1.6
- ✓ channel field in respondents.json for SMS surveys — v1.6
- ✓ Evening addendum rows in Jan 9 call log (10:55 PM, 11:02 PM, 11:03 PM) — v1.6
- ✓ .dialog-overlay CSS rule for modal dialog backdrops — v1.6
- ✓ Continuous timeline: all 1998 dates swept to 1999, Jan 9 anchor preserved — v1.7
- ✓ Email continuation arc: 7 Jan 9 emails across 4 folders with time-gated delivery — v1.7
- ✓ Voicemail transcripts with progressive voice fatigue — v1.7
- ✓ Desktop notes.txt and off-island authorization memo — v1.7
- ✓ Content-drafts audit: all artifacts shipped, deferred, or killed — v1.7
- ✓ Recycle Bin with 3 deleted Margaret draft replies — v1.7
- ✓ NT4-authentic Calculator with full arithmetic engine — v1.7
- ✓ System sounds: SoundManager, 5 WAV files, boot chime, dialog triggers, mute toggle — v1.7
- ✓ Mystify screensaver with 3-minute idle timer and instant dismiss — v1.7

### Active

- [ ] In-game anchor day advanced from Jan 9 Sun to Jan 13 Thu, 2000
- [ ] All pre-Jan 13 emails marked as read; Jan 13+ stays unread
- [ ] Jan 12 desktop notes entry: Syd flyer mention + 555-2033 number
- [ ] Jan 13 desktop notes entry: Lucy/Francisco 555-8818 grocery contact
- [ ] Lisa's call list / contacts updated with both new numbers
- [ ] Jan 12 call log: 7am 555-9949 full call, 12pm 555-4432 full call, 555-7120 voicemail entry
- [ ] Two new H-XXXX respondent profile files for the Jan 12 full calls (555-9949 caller, 555-4432 Kubwimana)
- [ ] Period-authentic 1999/2000 Drudge Report page rendered in IE5 (banner, link columns, sirens, photo+caption)
- [ ] Drudge Report bookmark entry in browser bookmarks

### Out of Scope

- Mobile/responsive layout — desktop-only experience by design
- Any backend, database, or server-side logic — pure static site
- Build tools, frameworks, npm — HTML/CSS/vanilla JS only
- Right-click context menus — stretch goal
- Games (Minesweeper, Solitaire) — stretch goals
- Taskbar date display — cancelled from v1.3, may revisit
- Multiple screen savers (Pipes, Beziers, Marquee) — Mystify sufficient
- Calculator Scientific view — Standard sufficient for atmosphere
- Control Panel > Sounds UI — tray mute toggle sufficient
- Blizzard window (Jan 24-26) and dates beyond Jan 13 — deferred to a later milestone

## Context

v1.7 shipped — continuous timeline complete (Dec 1999 → Jan 9, 2000), email continuation arc with 7 time-gated emails, voicemail transcripts, Recycle Bin with deleted Margaret drafts, Calculator, SoundManager with 5 WAV files + mute toggle, Mystify screensaver. All 8 milestones complete.

~10,037 LOC across HTML/CSS/vanilla JS/JSON.
Tech stack: Static site on GitHub Pages, no build tools, no frameworks.
Deployed from `/public` via GitHub Actions.

All content lives in JSON files under `public/content/` — content updates don't require touching code.
The live clock maps real time to a 1999 date; content is time-gated via `deliver_at` fields.
Three story layers seeded throughout all content (surface office life, middle anomalies, deep secrets).

CalCom is a telecommunications company; Lisa works in their survey/research department doing CATI (Computer-Assisted Telephone Interviewing). The Horizon device health cover-up is the central narrative thread.

Email attachment system added in v1.3 — emails can include `attachment_contents` field with HTML content that opens in WordPad viewer.

Winamp player added in v1.4 — uses Webamp MIT-licensed bitmap sprites for pixel-perfect rendering, HTML5 Audio + Web Audio API for playback and oscilloscope visualizer. Singleton pattern prevents duplicate windows. 3-track playlist with period-authentic artists.

Network Neighborhood added in v1.5 — 704-line network.json, 12 machines across 3 domains, 5-level Explorer navigation with icon grid/list views, Access Denied dialogs for locked resources.

External browsing and popup ads added in v1.6 — IE5 iframes external sites with link-out fallback and DNS error page; popup-ads.json registry drives close-only popup windows triggered by visiting whitelisted pages (Yahoo gets the millionth-visitor ad). H-0003 Andersen extends the survey set with a text-mode SMS interview using a 4-column Notes survey variant, and the Jan 9 call log gains an evening time-jump (10:55 PM onward) hinting at off-script late-night work.

## Constraints

- **Tech stack**: HTML / CSS / vanilla JS only — no frameworks, no build tools, no npm
- **Deployment**: Static site on GitHub Pages from `/public` directory
- **Visual fidelity**: Must look like Windows NT 4.0 (1998), NOT Windows 98 or later
- **Content architecture**: All content in JSON files under `public/content/`, never hardcoded in JS/HTML
- **Viewport**: Desktop only, optimized for widescreen. Gate screen for < 800x600

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Vanilla JS, no frameworks | Period authenticity + simplicity + no build step | ✓ Good — 4.4K LOC stays manageable |
| JSON-driven content | Separate content from code; easy to update lore | ✓ Good — content changes don't touch JS |
| Single-page desktop (desktop.html) | Simulates real OS — no page navigation | ✓ Good — feels like real desktop |
| Time-gated email delivery | Creates sense of "live" workday unfolding | ✓ Good — adds immersion |
| Three narrative layers | Rewards different levels of engagement | ✓ Good — surface/middle/deep all working |
| Globals over ES modules | Consistent with no-build-tools constraint | ✓ Good — simple script tag loading |
| App builder pattern (buildXxxUI functions) | Each app returns HTMLElement, clean separation | ✓ Good — easy to add new apps |
| Ghost outline resize (not live resize) | Period-authentic NT4 behavior | ✓ Good — matches real NT4 |
| CSS step-end animation for printer blink | No JS timer needed, authentic binary flicker | ✓ Good — clean implementation |
| December 1998 timeline anchor | 1999 was too late for Y2K early-planning narrative | Reverted to 1999 in v1.3 Phase 03 |
| Base64 password obfuscation | Minimal security for narrative gate, not real auth | ✓ Good — "horizon" discoverable for determined visitors |
| No return visitor bypass | Full boot sequence is core experience | ✓ Good — every visit gets the immersion |
| CalCom logo proportional sizing | 80/120/140px across login/intranet/corporate | ✓ Good — scales well on each surface |
| Bottom-anchored Recycle Bin | Separate container from main icon column, matches NT4 convention | ✓ Good — uses DESKTOP_ICON_BOTTOM constant |
| Flat bookmark structure | Removed dead folders, kept 4 direct entries | ✓ Good — cleaner, no broken links |
| Unified corporate/intranet chrome | Both pages use #000080 navy + Arial for brand consistency | ✓ Good — feels like same company |
| Roosevelt Island, DC (not NY) | In-world location is Washington DC, matching call-log 202 area codes | ✓ Good — all references consistent |
| December 1999 timeline (reverted from 1998) | 1999 places the story in Christmas week before Y2K, party on Christmas Eve (Friday) | ✓ Good — calendar aligns, narrative stronger |
| Inline attachment_contents in emails.json | Avoids separate files; HTML content stored per-attachment in JSON | ✓ Good — consistent with content-in-JSON pattern |
| Citation/designator year preservation | Academic years [Author, 1998] and study codes HCS-98-Q4 kept as-is during timeline shift | ✓ Good — these are publication/version references, not narrative dates |
| Cat references removed from canon | Grocery list and notes no longer reference a pet cat | ✓ Good — aligns with current character canon |
| Webamp bitmap sprites over CSS-only | Pixel-perfect Winamp 2.x fidelity impossible with CSS alone; Webamp sprites are MIT licensed | ✓ Good — 1,438 lines of sprite CSS, zero visual artifacts |
| Custom JS + Webamp CSS (no fork) | Webamp is React/Redux; forking would violate no-framework constraint. Use sprites only. | ✓ Good — 785 LOC vanilla JS, full feature parity |
| Native 275x116 resolution (no 2x scaling) | 2x scaling was considered but native size fits NT4 desktop better | ✓ Good — crisp at native resolution |
| Singleton guard in AppRegistry.launch | Prevents duplicate Winamp windows; early return pattern keeps code simple | ✓ Good — clean 4-line guard |
| Separate icon grid vs list view in Network | Top levels (root, domains) use icon grid; machine/folder levels use list view like File Explorer | ✓ Good — matches NT4 conventions |
| navState history for Back button | Array-based navigation history instead of browser history API | ✓ Good — keeps window self-contained |
| Split buildUNCPath / buildAddressPath | Display path adds trailing backslash; canonical path stays clean for Access Denied dialogs | ✓ Good — prevents double-backslash bugs |

| External pages keyed by url field (ext:name) with _externalPages registry | Period-authentic IE behavior; 15s iframe timeout for hung loads | ✓ Good — clean separation of internal/external pages |
| Popup minimize hidden via display:none, maximize hidden | Close-only popup chrome matches 1999 ad behavior | ✓ Good — popups can't be minimized to taskbar |
| popup-ads.json eager fetch at browser init | Ad data ready before any trigger fires; ES5-style object-as-set for session tracking | ✓ Good — no lazy-load race conditions |
| Screener section (S1-S3) between Demographics and Survey Responses | Jan 9+ respondents need explicit screener disposition; older respondents stay as-is | ✓ Good — matches CATI script structure |
| H-0003 uses 4-column survey table with Notes column | Captures raw SMS text alongside coded values for text-mode interviews | ✓ Good — surfaces Lisa's improvisation under quota pressure |
| filePath property on desktop icons for direct file opening | Desktop icons like notes.txt use findFileByPath to walk files.json tree | ✓ Good — clean path-based routing without hardcoding |
| Left-to-right calculator evaluation (no precedence) | Matches real NT4 Standard Calculator behavior | ✓ Good — authentic, not confusing |
| SoundManager IIFE singleton with inline Audio for boot | SoundManager only loaded on desktop.html; boot page needs inline Audio | ✓ Good — cross-page sound without module coupling |
| z-index 50000 for screensaver canvas | Must render above shutdown overlay (30000) and all other UI | ✓ Good — clean layer separation |
| Recycle Bin reuses Explorer chrome pattern | Consistent with Network Neighborhood approach; no new rendering architecture | ✓ Good — single-pane Explorer reuse validated |

---
*Last updated: 2026-04-29 after v1.8 milestone started*
