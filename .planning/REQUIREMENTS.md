# Requirements: Lockdown Rime -- Lisa's Workstation

**Defined:** 2026-03-28
**Core Value:** The visitor must feel like they've sat down at a real person's real work computer in 1999.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Boot Sequence

- [x] **BOOT-01**: Visitor sees POST screen with BIOS memory count and monospace text on black background
- [x] **BOOT-02**: Visitor sees NT Boot Loader with "OS Loader V4.01" and auto-select countdown
- [x] **BOOT-03**: Visitor sees blue "Starting Windows NT..." screen with progress indicator
- [x] **BOOT-04**: Visitor sees Ctrl+Alt+Delete prompt (accepts click/keypress as substitute)
- [x] **BOOT-05**: Visitor sees login dialog with pre-filled CALCOM\l.[surname] and password field
- [x] **BOOT-06**: Return visitors can skip boot sequence via localStorage flag

### Visual Fidelity

- [x] **VIS-01**: All UI chrome uses #C0C0C0 silver with 4-tone beveled borders via box-shadow: inset
- [x] **VIS-02**: Active title bars are solid navy (#000080), inactive are grey (#808080) -- no gradients
- [x] **VIS-03**: Window buttons are flat beveled rectangles (NT4 style, not Win98 rounded)
- [x] **VIS-04**: UI font is period-appropriate (Tahoma/MS Sans Serif equivalent at 11px)
- [x] **VIS-05**: Desktop background is teal (#008080)
- [x] **VIS-06**: Viewport gate shows message for screens under 800x600

### Window Manager

- [ ] **WIN-01**: Windows can be created from template with title bar, content area, and status bar
- [ ] **WIN-02**: Windows can be dragged by title bar without text selection artifacts
- [ ] **WIN-03**: Windows have working minimize, maximize, and close buttons
- [ ] **WIN-04**: Minimized windows appear as taskbar buttons; clicking restores them
- [ ] **WIN-05**: Clicking a window brings it to front (z-index stacking)
- [ ] **WIN-06**: Multiple windows can be open simultaneously

### Desktop Shell

- [ ] **SHELL-01**: Taskbar is bottom-anchored with Start button, window buttons area, and system tray
- [ ] **SHELL-02**: System tray shows live clock mapped to 1999 date/time
- [ ] **SHELL-03**: Start menu opens with Programs, Documents, Settings, Shut Down entries
- [ ] **SHELL-04**: Desktop icons are left-aligned in a grid with single-click select, double-click open
- [ ] **SHELL-05**: Each open window gets a taskbar button; active window button appears pressed

### File Explorer

- [ ] **FILE-01**: File Explorer has classic two-pane layout (tree view left, file list right)
- [ ] **FILE-02**: Folder structure is loaded from content/files.json
- [ ] **FILE-03**: Visitor can navigate by clicking folders in either pane
- [ ] **FILE-04**: Files show type-appropriate icons (.doc, .xls, .txt, folder)
- [ ] **FILE-05**: Double-clicking a file opens it in the appropriate viewer

### Document Viewers

- [ ] **DOC-01**: WordPad-style viewer renders .doc content from JSON with basic formatting
- [ ] **DOC-02**: Spreadsheet viewer renders .xls content in grid layout with column/row headers
- [ ] **DOC-03**: Notepad viewer renders .txt content in minimal chrome with monospace text
- [ ] **DOC-04**: All viewers have period-appropriate toolbars and menu bars (decorative)

### Email Client

- [ ] **MAIL-01**: Outlook 98-style three-pane layout (folder tree, message list, preview)
- [ ] **MAIL-02**: Folders include Inbox, Sent Items, Drafts, Deleted Items
- [ ] **MAIL-03**: Message list shows sender, subject, date, read/unread styling
- [ ] **MAIL-04**: Preview pane shows full email with headers (From, To, CC, Date, Subject)
- [ ] **MAIL-05**: Reply chains render with > quoted text and corporate signatures
- [ ] **MAIL-06**: Emails have deliver_at field; only emails whose deliver_at has passed are visible
- [ ] **MAIL-07**: Email data loaded from content/emails.json

### Web Browser

- [ ] **WEB-01**: IE5-style chrome with address bar, toolbar (Back/Forward/Stop/Refresh/Home)
- [ ] **WEB-02**: Favorites sidebar with bookmarks from content/bookmarks.json
- [ ] **WEB-03**: Default homepage is CalCom intranet page
- [ ] **WEB-04**: At least 3 pre-built pages (CalCom intranet, corporate site, 1999 web portal)
- [ ] **WEB-05**: Pages use late-90s web aesthetic (tables layout, visitor counters, beveled HRs)

### Survey Content

- [ ] **SURV-01**: Survey folder contains CATI script, call disposition log, quota sheet, supervisor memo, training guide
- [ ] **SURV-02**: Respondent profiles show official CATI records with Lisa's handwritten-style annotations
- [ ] **SURV-03**: Cross-tabulation results contain subtly concerning data patterns
- [ ] **SURV-04**: All survey documents render authentically in appropriate viewers

### System Polish

- [ ] **SYS-01**: Blinking printer icon in system tray
- [ ] **SYS-02**: Clicking printer opens print queue showing stuck job with narratively significant timestamp
- [ ] **SYS-03**: Clock tooltip shows full date
- [ ] **SYS-04**: Notepad contains Lisa's personal notes (to-do list, phone numbers, passwords)

### Narrative Layers

- [ ] **NARR-01**: Surface layer shows normal office life (deadlines, holiday party, positive survey data)
- [ ] **NARR-02**: Middle layer contains 3+ anomalies for attentive visitors (headaches in responses, suspicious memos, timing inconsistencies)
- [ ] **NARR-03**: Deep layer contains at least 1 secret for thorough investigators (deleted email, misplaced file, pattern across respondents)

### Content Architecture

- [x] **CONT-01**: All displayable content lives in JSON files under public/content/
- [x] **CONT-02**: Content updates don't require touching JS/HTML code
- [x] **CONT-03**: JSON files include: emails.json, files.json, bookmarks.json, survey-script.json, respondents.json, call-log.json

## v2 Requirements

### Stretch Features

- **V2-01**: CalCom branded desktop wallpaper (custom art)
- **V2-02**: Start Menu Shut Down animation
- **V2-03**: Right-click context menus
- **V2-04**: Sound effects (startup chime, error beep, email notification)
- **V2-05**: Screen saver after inactivity
- **V2-06**: My Computer system properties dialog
- **V2-07**: Recycle Bin with deleted story content
- **V2-08**: AIM/ICQ-style instant messenger with archived chat logs
- **V2-09**: Minesweeper/Solitaire in Start Programs Games
- **V2-10**: CRT scanline / screen flicker effect
- **V2-11**: Resizable windows
- **V2-12**: New email notification when time-gated email arrives during session

## Out of Scope

| Feature | Reason |
|---------|--------|
| Mobile/responsive layout | Desktop-only experience by design |
| Backend/database/server-side | Pure static site on GitHub Pages |
| Build tools/frameworks/npm | HTML/CSS/vanilla JS constraint |
| Functional text editing | Breaks immersion, adds complexity for zero narrative value |
| Working games (Minesweeper etc.) | Distraction from narrative; stretch goal only |
| Windows 98/2000 visual elements | Must be NT4 era specifically |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| BOOT-01 | Phase 1 | Complete |
| BOOT-02 | Phase 1 | Complete |
| BOOT-03 | Phase 1 | Complete |
| BOOT-04 | Phase 1 | Complete |
| BOOT-05 | Phase 1 | Complete |
| BOOT-06 | Phase 1 | Complete |
| VIS-01 | Phase 1 | Complete |
| VIS-02 | Phase 1 | Complete |
| VIS-03 | Phase 1 | Complete |
| VIS-04 | Phase 1 | Complete |
| VIS-05 | Phase 1 | Complete |
| VIS-06 | Phase 1 | Complete |
| CONT-01 | Phase 1 | Complete |
| CONT-02 | Phase 1 | Complete |
| CONT-03 | Phase 1 | Complete |
| WIN-01 | Phase 2 | Pending |
| WIN-02 | Phase 2 | Pending |
| WIN-03 | Phase 2 | Pending |
| WIN-04 | Phase 2 | Pending |
| WIN-05 | Phase 2 | Pending |
| WIN-06 | Phase 2 | Pending |
| SHELL-01 | Phase 2 | Pending |
| SHELL-02 | Phase 2 | Pending |
| SHELL-03 | Phase 2 | Pending |
| SHELL-04 | Phase 2 | Pending |
| SHELL-05 | Phase 2 | Pending |
| FILE-01 | Phase 3 | Pending |
| FILE-02 | Phase 3 | Pending |
| FILE-03 | Phase 3 | Pending |
| FILE-04 | Phase 3 | Pending |
| FILE-05 | Phase 3 | Pending |
| DOC-01 | Phase 3 | Pending |
| DOC-02 | Phase 3 | Pending |
| DOC-03 | Phase 3 | Pending |
| DOC-04 | Phase 3 | Pending |
| MAIL-01 | Phase 3 | Pending |
| MAIL-02 | Phase 3 | Pending |
| MAIL-03 | Phase 3 | Pending |
| MAIL-04 | Phase 3 | Pending |
| MAIL-05 | Phase 3 | Pending |
| MAIL-06 | Phase 3 | Pending |
| MAIL-07 | Phase 3 | Pending |
| WEB-01 | Phase 3 | Pending |
| WEB-02 | Phase 3 | Pending |
| WEB-03 | Phase 3 | Pending |
| WEB-04 | Phase 3 | Pending |
| WEB-05 | Phase 3 | Pending |
| SURV-01 | Phase 4 | Pending |
| SURV-02 | Phase 4 | Pending |
| SURV-03 | Phase 4 | Pending |
| SURV-04 | Phase 4 | Pending |
| SYS-01 | Phase 4 | Pending |
| SYS-02 | Phase 4 | Pending |
| SYS-03 | Phase 4 | Pending |
| SYS-04 | Phase 4 | Pending |
| NARR-01 | Phase 4 | Pending |
| NARR-02 | Phase 4 | Pending |
| NARR-03 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 58 total
- Mapped to phases: 58
- Unmapped: 0

---
*Requirements defined: 2026-03-28*
*Last updated: 2026-03-28 after roadmap creation*
