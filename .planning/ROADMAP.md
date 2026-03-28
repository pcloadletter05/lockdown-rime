# Roadmap: Lockdown Rime -- Lisa's Workstation

## Overview

This roadmap delivers a Windows NT 4.0 desktop simulation in four phases. Phase 1 lays the visual and structural foundation (CSS, boot sequence, content architecture). Phase 2 builds the desktop environment (window manager, taskbar, shell). Phase 3 delivers all applications that run inside windows (File Explorer, document viewers, email, browser). Phase 4 seeds the narrative content that makes the desktop feel like a real person's computer (survey materials, print queue, three story layers).

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation** - NT4 visual system, boot sequence, content architecture, viewport gate
- [x] **Phase 2: Desktop Environment** - Window manager, taskbar, Start menu, desktop icons, system tray (completed 2026-03-28)
- [ ] **Phase 3: Applications** - File Explorer, document viewers, email client, web browser
- [ ] **Phase 4: Narrative Content** - Survey materials, print queue, story layers, hidden content

## Phase Details

### Phase 1: Foundation
**Goal**: Visitor experiences an authentic NT4 boot sequence and the visual foundation is established for all subsequent phases
**Depends on**: Nothing (first phase)
**Requirements**: BOOT-01, BOOT-02, BOOT-03, BOOT-04, BOOT-05, BOOT-06, VIS-01, VIS-02, VIS-03, VIS-04, VIS-05, VIS-06, CONT-01, CONT-02, CONT-03
**Success Criteria** (what must be TRUE):
  1. Visitor sees a complete POST-to-login boot sequence that looks like a real NT4 machine starting up
  2. All UI elements use correct NT4 visual language (silver chrome, solid navy title bars, beveled borders, period fonts)
  3. Visitors on small screens see a gate message instead of a broken layout
  4. Return visitors skip the boot sequence and land directly on the desktop
  5. Content JSON files exist and are loadable by the application layer
**Plans**: 3 plans

Plans:
- [ ] 01-01-PLAN.md -- NT4 CSS visual system, W95FA font, viewport gate styles, TimeEngine, HTML structure
- [ ] 01-02-PLAN.md -- Content architecture: 6 skeleton JSON files with documented schemas
- [ ] 01-03-PLAN.md -- Boot sequence: POST through login with skip mechanism and viewport gate

### Phase 2: Desktop Environment
**Goal**: Visitor lands on a functional NT4 desktop with working windows, taskbar, and desktop icons
**Depends on**: Phase 1
**Requirements**: WIN-01, WIN-02, WIN-03, WIN-04, WIN-05, WIN-06, SHELL-01, SHELL-02, SHELL-03, SHELL-04, SHELL-05
**Success Criteria** (what must be TRUE):
  1. Visitor can open, drag, minimize, maximize, and close windows that look and behave like NT4
  2. Multiple windows can be open simultaneously with correct z-index stacking (clicking brings to front)
  3. Taskbar shows Start button, a button for each open window, and a live clock showing 1999 date/time
  4. Desktop icons are visible in a left-aligned grid and double-clicking one opens the associated application
  5. Start menu opens and shows Programs, Documents, Settings, Shut Down entries
**Plans**: 2 plans

Plans:
- [ ] 02-01-PLAN.md -- EventBus, WindowManager core (create, drag, minimize, maximize, close, z-stacking), Phase 2 CSS
- [ ] 02-02-PLAN.md -- Taskbar, Start menu, desktop icons, system tray clock, app registry with stubs

### Phase 3: Applications
**Goal**: Visitor can explore Lisa's files, read her documents, browse her email, and visit 1999 websites
**Depends on**: Phase 2
**Requirements**: FILE-01, FILE-02, FILE-03, FILE-04, FILE-05, DOC-01, DOC-02, DOC-03, DOC-04, MAIL-01, MAIL-02, MAIL-03, MAIL-04, MAIL-05, MAIL-06, MAIL-07, WEB-01, WEB-02, WEB-03, WEB-04, WEB-05
**Success Criteria** (what must be TRUE):
  1. File Explorer shows a two-pane layout with navigable folder tree loaded from JSON
  2. Double-clicking files opens them in the correct viewer (WordPad for .doc, Notepad for .txt, spreadsheet for .xls)
  3. Email client shows Outlook 98-style three-pane layout with folders, message list, and preview pane
  4. Emails appear based on time-gating (only emails whose deliver_at has passed are visible)
  5. Web browser shows IE5-style chrome with working favorites and at least 3 pre-built period-appropriate pages
**Plans**: TBD

Plans:
- [ ] 03-01: File Explorer and document viewers
- [ ] 03-02: Email client with time-gated delivery
- [ ] 03-03: Web browser with period websites

### Phase 4: Narrative Content
**Goal**: Lisa's desktop tells a story across three layers that rewards different levels of visitor engagement
**Depends on**: Phase 3
**Requirements**: SURV-01, SURV-02, SURV-03, SURV-04, SYS-01, SYS-02, SYS-03, SYS-04, NARR-01, NARR-02, NARR-03
**Success Criteria** (what must be TRUE):
  1. Survey folder contains authentic CATI materials (scripts, call logs, respondent profiles) with subtly concerning data patterns
  2. Blinking printer icon in system tray opens a stuck print queue with a narratively significant timestamp
  3. Surface narrative layer presents normal office life across all content (emails, files, browser)
  4. Attentive visitors can discover 3+ middle-layer anomalies (headaches in responses, suspicious memos, timing inconsistencies)
  5. Thorough investigators can find at least 1 deep-layer secret (deleted email, misplaced file, cross-respondent pattern)
**Plans**: TBD

Plans:
- [ ] 04-01: Survey content and system tray polish (print queue, clock tooltip, Lisa's notes)
- [ ] 04-02: Narrative layer seeding across all content

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 0/3 | Planning complete | - |
| 2. Desktop Environment | 2/2 | Complete   | 2026-03-28 |
| 3. Applications | 0/3 | Not started | - |
| 4. Narrative Content | 0/2 | Not started | - |
