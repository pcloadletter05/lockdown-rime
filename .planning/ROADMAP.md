# Roadmap: Lockdown Rime -- Lisa's Workstation

## Milestones

- ✅ **v1.0 MVP** — Phases 01-05 (shipped 2026-03-29)
- ✅ **v1.1 Polish & Security** — Phases 06-07 (shipped 2026-03-29)
- ✅ **v1.2 Visual Accuracy & Consistency** — Phases 08-09 (shipped 2026-03-29)
- ✅ **v1.3 Small Fixes & Content Refresh** — Phases 10-13 (shipped 2026-03-30)
- ✅ **v1.4 Winamp Player** — Phases 14-17 (shipped 2026-03-31)
- ✅ **v1.5 Network Neighborhood** — Phases 18-19 (shipped 2026-03-31)
- ✅ **v1.6 Browser & Survey Content** — Phases 20-23 (shipped 2026-04-29)
- ✅ **v1.7 Continuous Timeline & Desktop Polish** — Phases 24-29 (shipped 2026-04-30)
- ✅ **v1.8 Timeline Forward & Drudge Report** — Phases 30-33 (shipped 2026-04-30)
- 🟡 **v1.9 Jan 15 Calls & Calculator Fix** — Phases 34-35 (in progress)

## Phases

<details>
<summary>✅ v1.0–v1.7 (Phases 01-29) — SHIPPED</summary>

See individual milestone roadmaps in `.planning/milestones/` for details.

</details>

<details>
<summary>✅ v1.8 (Phases 30-33) — SHIPPED</summary>

- [x] **Phase 30: Anchor Shift to Jan 13** — Advance the in-game "now" from Jan 9 Sunday to Jan 13 Thursday, 2000 with read-state pass on archived email (completed 2026-04-30)
- [x] **Phase 31: Desktop Notes & Contacts** — Add Jan 12 (Syd flyer / 555-2033) and Jan 13 (Lucy → Francisco / 555-8818) entries to notes.txt and contact data (completed 2026-04-30)
- [x] **Phase 32: Jan 12 Call Log & Respondents** — 7 AM 555-9949 full call, 12 PM 555-4432 Kubwimana full call, 555-7120 voicemail entry; two new H-XXXX respondent files (completed 2026-04-30)
- [x] **Phase 33: Drudge Report Page** — Period-authentic 1999/2000 Drudge Report internal page in IE5 with bookmark entry (completed 2026-04-30)

</details>

### v1.9 Jan 15 Calls & Calculator Fix (Active)

**Granularity:** coarse
**Coverage:** 11/11 v1.9 requirements mapped

- [ ] **Phase 34: Jan 15 Call Log & Sticky Note** — Three Jan 15 outbound rows (Falkenburg complete, Shaw complete, 555-3553 busy retry), two new respondent profiles (H-0006, H-0007), and a notes.txt entry seeding the 555-7108 lead
- [ ] **Phase 35: Calculator Window Position Fix** — Diagnose and fix Calculator cascade so the small (248x310) window stays fully on-screen across repeated launches, without regressing other apps that rely on cascade

## Phase Details

### Phase 30: Anchor Shift to Jan 13
**Goal**: The simulation's in-game "now" advances from Jan 9 Sunday to Jan 13 Thursday, 2000, and pre-Jan 13 archived content reads as historical without regressing existing time-gated delivery.
**Depends on**: Nothing (foundational for v1.8)
**Requirements**: ANCHOR-01, ANCHOR-02, ANCHOR-03, ANCHOR-04, ANCHOR-05
**Success Criteria** (what must be TRUE):
  1. The taskbar clock and any in-app "today is" surface display Thursday, January 13, 2000 when a visitor logs in
  2. All Inbox and Sent emails dated before Jan 13 appear as already-read on first visit; Jan 13+ emails remain unread until their `deliver_at` fires
  3. Existing Jan 9 emails, voicemails, and time-gated content still appear as already-delivered archive (no regression in the v1.7 continuation arc)
  4. The real-time-to-in-game clock mapping resolves to Jan 13, 2000 across all consumers (taskbar, content gating, deliver_at evaluation)
  5. PROJECT.md, CLAUDE.md, and `.planning/` anchor docs cite Jan 13 Thursday as the active anchor day
**Plans**:
- [x] 30-01-PLAN.md — Flip ANCHOR_DAY constant from 9 to 13 in time.js + correct leading comment
- [x] 30-02-PLAN.md — Flip 9 Inbox emails to read:true in emails.json (pre-Jan 13 archive cutoff)
- [x] 30-03-PLAN.md — Update CLAUDE.md and .planning/PROJECT.md to cite Jan 13 Thursday as active anchor

### Phase 31: Desktop Notes & Contacts
**Goal**: Lisa's desktop notes.txt and contact JSON reflect two new days of jotted-down phone calls (Syd flyer Jan 12, Lucy → Francisco Jan 13) so the visitor can find both threads from the desktop without opening Outlook or the call log.
**Depends on**: Phase 30 (anchor must be Jan 13 for these entries to read as recent)
**Requirements**: NOTES-01, NOTES-02, NOTES-03, NOTES-04
**Success Criteria** (what must be TRUE):
  1. Opening notes.txt from the desktop shows a Jan 12 entry mentioning the Syd party flyer ("RIOT AT THE RAVE / RAGE AGAINST THE LOCK DOWN") with the 555-2033 callback number captured in Lisa's voice
  2. Opening notes.txt from the desktop shows a Jan 13 entry recording Lucy's referral of Francisco (grocery store management) at 555-8818
  3. Lisa's call list / contact JSON contains entries for 555-2033 and 555-8818 with appropriate context labels, accessible wherever contact data is consumed
  4. Both notes.txt entries follow Lisa-voice content conventions: no em dashes, no en dashes, period-authentic phrasing consistent with prior entries
**Plans**: 1 plan
- [x] 31-01-PLAN.md — Prepend Jan 12 and Jan 13 entries to notes.txt, create contacts.json, add rave bookmark

### Phase 32: Jan 12 Call Log & Respondents
**Goal**: The Jan 12 working day is fully represented in the survey folder — two complete CATI interviews and one voicemail attempt — so a visitor browsing the survey folder on Jan 13 sees yesterday's work as fresh archive material.
**Depends on**: Phase 30 (Jan 12 must read as "yesterday" relative to anchor); independent of Phase 31
**Requirements**: CALL-01, CALL-02, CALL-03, CALL-04, CALL-05, CALL-06, CALL-07
**Success Criteria** (what must be TRUE):
  1. The Jan 12 call log shows a 7:00 AM full-call entry for 555-9949, a voicemail entry for 555-7120 left immediately after the 7 AM call, and a 12:00 PM full-call entry for 555-4432 Kubwimana
  2. Two new H-XXXX respondent profile files exist (one for 555-9949, one for 555-4432 Kubwimana), each following the established CATI format (Demographics, S1-S3 screener, Survey Responses)
  3. Both new respondent files appear in the survey folder when navigated via File Explorer (wired into files.json)
  4. All survey response text and call-log entries honor the no-em-dash / no-en-dash content convention
**Plans**: 2 plans
- [x] 32-01-PLAN.md — Add Jan 12 call-log rows, Call_Disposition_Log_0112.xls, and Sent_Voicemails_0112.txt
- [x] 32-02-PLAN.md — Create H-0004 and H-0005 respondent profiles in respondents.json and files.json

### Phase 33: Drudge Report Page
**Goal**: A visitor opening IE5 can reach a period-authentic 1999/2000 Drudge Report page via a bookmark, with in-world headlines that fit the Jan 13, 2000 anchor and rendering consistent with internal-page styling (no iframe).
**Depends on**: Phase 30 (headline content must reflect the Jan 13 timeline); independent of Phases 31-32
**Requirements**: DRUDGE-01, DRUDGE-02, DRUDGE-03, DRUDGE-04, DRUDGE-05
**Success Criteria** (what must be TRUE):
  1. Opening the Drudge Report bookmark in IE5 renders a visually accurate 1999/2000 Drudge layout: red banner with rotating headline, three-column link layout, siren GIFs for breaking news, central photo + caption block
  2. Headlines and link text reflect in-world lore consistent with the Jan 13, 2000 anchor (sourced from staff lore at build time)
  3. The Drudge Report appears as a bookmark entry in the IE5 bookmarks list, reachable in one click from the browser
  4. The page integrates with the existing internal-page registry pattern (pure styled HTML like Yahoo / Ask Jeeves; no `mode: ext` iframe)
  5. Styling uses Tahoma / Arial fonts and period-appropriate CSS only (no gradients, drop shadows, or border-radius beyond 1999 browser support)
**Plans**: 2 plans
- [x] 33-01-PLAN.md — Build Drudge Report internal page HTML in browser.js with siren GIF asset
- [x] 33-02-PLAN.md — Add bookmark entry, popup trigger wiring, and visual verification

### Phase 34: Jan 15 Call Log & Sticky Note
**Goal**: A visitor browsing the survey folder on Jan 15 (or after) sees Saturday's shift as fresh archive material — three honest outbound rows, two complete respondent profiles (Falkenburg, Shaw), and a notes.txt entry seeding the 555-7108 lead so a careful reader finds the thread before any future profile lands.
**Depends on**: Phase 30 (Jan 13 anchor); Phase 32 (H-0005 must exist so H-0006/H-0007 numbering continues cleanly)
**Requirements**: CALL-08, CALL-09, CALL-10, CALL-11, CALL-12, CALL-13, STICKY-01, STICKY-02, STICKY-03
**Success Criteria** (what must be TRUE):
  1. The Jan 15 call log shows exactly three outbound rows: 11:30 AM 202-555-5618 Falkenburg Complete (H-0006), 12:30 PM 202-555-8307 Shaw Complete (H-0007) with the 555-7108 friend lead captured in the row notes, and an end-of-shift 202-555-3553 Busy whose notes reference the prior 1/9 voicemail attempt
  2. Opening Falkenburg_Fergus.doc from the survey folder via File Explorer renders a complete H-0006 respondent profile (Demographics, S1-S3 screener, full survey responses, Lisa-voice notes) consistent with the source transcript
  3. Opening Shaw_Dustin.doc from the survey folder via File Explorer renders a complete H-0007 respondent profile including the 555-7108 friend-lead beat and Lisa-voice notes consistent with the source transcript
  4. Opening notes.txt from the desktop shows a Jan 15 entry with the 555-7108 lead in Lisa's voice (Shaw's friend, battery, approximately one week dead, call back Monday)
  5. All Jan 15 call-log entries, both respondent files, and the notes.txt entry honor the no-em-dash / no-en-dash content convention
**Plans**: 4 plans
- [ ] 34-01-PLAN.md — Append 3 Jan 15 rows to call-log.json + add Call_Disposition_Log_0115.xls to files.json
- [ ] 34-02-PLAN.md — Falkenburg respondent profile (H-0006) in respondents.json + Falkenburg_Fergus.doc wired into files.json
- [ ] 34-03-PLAN.md — Shaw respondent profile (H-0007) in respondents.json + Shaw_Dustin.doc wired into files.json
- [ ] 34-04-PLAN.md — Prepend Jan 15 entry to notes.txt with 555-7108 lead (Shaw's friend, battery, call Monday)

### Phase 35: Calculator Window Position Fix
**Goal**: Launching Calculator from the Start menu places the full window inside the visible desktop viewport across repeated launches, without regressing the cascade behavior other apps rely on.
**Depends on**: Nothing (independent bug fix; can ship in parallel with Phase 34)
**Requirements**: CALC-FIX-01, CALC-FIX-02
**Success Criteria** (what must be TRUE):
  1. Opening Calculator from the Start menu after several earlier window launches in the same session lands the full 248x310 Calculator window inside the visible desktop viewport — title bar visible at top, taskbar not overlapping the bottom of the window content
  2. The fix is period-authentic — either a stable centered/offset default like Winamp, or a cascade that resets / clamps before pushing small windows off-screen
  3. Other cascade-relying apps (File Explorer, Outlook, IE5, Notepad, etc.) show no visible regression in their default opening positions across a fresh session
  4. Repeated open/close cycles of Calculator alone do not progressively walk the window off-screen
**Plans**: 1 plan
- [ ] 35-01-PLAN.md — Diagnose cascade behavior in public/js/desktop.js, pick fix strategy (centered default vs cascade clamp), implement, verify across multiple launches

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 01-05 | v1.0 MVP | 11/11 | Complete | 2026-03-29 |
| 06-07 | v1.1 Polish & Security | 3/3 | Complete | 2026-03-29 |
| 08-09 | v1.2 Visual Accuracy | 3/3 | Complete | 2026-03-29 |
| 10-13 | v1.3 Content Refresh | 5/5 | Complete | 2026-03-30 |
| 14-17 | v1.4 Winamp Player | 6/6 | Complete | 2026-03-31 |
| 18-19 | v1.5 Network Neighborhood | 4/4 | Complete | 2026-03-31 |
| 20-23 | v1.6 Browser & Survey | 6/6 | Complete | 2026-04-29 |
| 24-29 | v1.7 Timeline & Polish | 11/11 | Complete | 2026-04-30 |
| 30 | v1.8 Timeline Forward | 3/3 | Complete | 2026-04-30 |
| 31 | v1.8 Timeline Forward | 1/1 | Complete | 2026-04-30 |
| 32 | v1.8 Timeline Forward | 2/2 | Complete | 2026-04-30 |
| 33 | v1.8 Timeline Forward | 2/2 | Complete | 2026-04-30 |
| 34 | 3/4 | In Progress|  | — |
| 35 | v1.9 Calculator Fix | 0/1 | Not started | — |

---
*Roadmap created: 2026-03-29*
*Last updated: 2026-04-30 — v1.9 Phase 34 plans created (4 plans, 4 waves)*
