# Requirements: Lockdown Rime — v1.9 Jan 15 Calls & Calculator Fix

**Defined:** 2026-04-30
**Core Value:** The visitor must feel like they've sat down at a real person's real work computer in 1999.

## v1.9 Requirements

### Jan 15 Call Log & Respondents

- [x] **CALL-08**: The Jan 15 call disposition log shows three confirmed outbound attempts: 11:30 AM 202-555-5618 Falkenburg complete, 12:30 PM 202-555-8307 Shaw complete, and an end-of-shift 202-555-3553 busy (retry of the 1/9 1:03 PM voicemail attempt)
- [ ] **CALL-09**: A Falkenburg respondent profile (H-0006) exists in `respondents.json` with Demographics, S1–S3 screener, full survey responses, and Lisa-voice notes consistent with the source transcript
- [ ] **CALL-10**: A Shaw respondent profile (H-0007) exists in `respondents.json` with Demographics, S1–S3 screener, full survey responses including the friend's number lead captured in the raw notes, and Lisa-voice notes consistent with the source transcript
- [ ] **CALL-11**: `Falkenburg_Fergus.doc` and `Shaw_Dustin.doc` appear in the survey respondents folder via `files.json` wiring, openable through File Explorer
- [x] **CALL-12**: The 555-3553 row's notes reference the prior 1/9 1:03 PM voicemail attempt so the retry reads as a continuity beat
- [x] **CALL-13**: All 1/15 survey response text, call-log entries, and Lisa-voice notes honor the no-em-dash / no-en-dash content convention

### Followup Sticky Note

- [ ] **STICKY-01**: A `StickyNote_Followups.txt` artifact exists on Lisa's desktop seeding the 555-7108 lead (Shaw's friend, battery failure, approximately one week dead) so a careful reader can find the lead before any future respondent profile lands
- [ ] **STICKY-02**: The sticky note is wired into the desktop / files data so it opens via the existing notepad / text-viewer pattern (consistent with `notes.txt`)
- [ ] **STICKY-03**: The sticky note content is in Lisa's voice and honors the no-em-dash / no-en-dash convention

### Calculator Window Position

- [ ] **CALC-FIX-01**: Opening Calculator from the Start menu places the full window inside the visible desktop viewport (title bar visible, taskbar not overlapping content) regardless of how many windows opened earlier in the session caused the cascade offset to advance
- [ ] **CALC-FIX-02**: The Calculator's positioning behavior remains period-authentic — either a stable centered/offset default like Winamp, or a cascade that resets/clamps before pushing small windows off-screen — with no visual regression for other apps that rely on the cascade

## v2.0+ Requirements

Deferred to a later milestone.

### Forward Timeline

- **FWD-01**: Jan 14 daily content (gap-fill between Jan 13 anchor and Jan 15 shift)
- **FWD-04**: H-0008 follow-up complete or callback for 202-555-7108 (Shaw's friend) once Lisa actually reaches him
- **FWD-05**: Surrounding 1/15 attempts (idea-bank fillers — VM, NA, Refusal, Callback, Hangup, Disconnected, Partial) if a heavier shift mix is wanted later
- **FWD-06**: Connection drift pattern memo (`Console_Drift_Pattern.txt`) once the dataset warrants it

## Out of Scope

| Feature | Reason |
|---------|--------|
| Idea-bank surrounding attempts on 1/15 | User decision: only ship the 3 confirmed attempts to keep the log honest |
| Same-shift dial of 555-7108 | User decision: hold for a later episode; sticky note seeds the lead |
| `Console_Drift_Pattern.txt` memo | User decision: drop drift-pattern artifact from this milestone |
| In-world self-flag list for the Margaret conversation | User decision: stays as authorial scaffolding only |
| Inbound Madison callback log on 1/15 | Outline scope: inbound calls live in a future inbound-call artifact, not this outbound CATI log |
| Mobile / responsive layout | Desktop-only by design |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| CALL-08 | Phase 34 | Complete |
| CALL-09 | Phase 34 | Pending |
| CALL-10 | Phase 34 | Pending |
| CALL-11 | Phase 34 | Pending |
| CALL-12 | Phase 34 | Complete |
| CALL-13 | Phase 34 | Complete |
| STICKY-01 | Phase 34 | Pending |
| STICKY-02 | Phase 34 | Pending |
| STICKY-03 | Phase 34 | Pending |
| CALC-FIX-01 | Phase 35 | Pending |
| CALC-FIX-02 | Phase 35 | Pending |

**Coverage:**
- v1.9 requirements: 11 total
- Mapped to phases: 11/11 ✓
- Unmapped: 0

---
*Requirements defined: 2026-04-30*
*Last updated: 2026-04-30 — traceability filled by roadmapper (Phases 34-35)*
