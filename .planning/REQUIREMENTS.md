# Requirements: Lockdown Rime — v1.8 Timeline Forward & Drudge Report

**Defined:** 2026-04-29
**Core Value:** The visitor must feel like they've sat down at a real person's real work computer in 1999.

## v1.8 Requirements

### Anchor Shift

- [x] **ANCHOR-01**: In-game "now" advances from Jan 9 Sunday to Jan 13 Thursday, 2000 across the real-time-to-in-game clock mapping
- [x] **ANCHOR-02**: Taskbar clock and any "today is" references reflect Jan 13, 2000 (Thursday)
- [x] **ANCHOR-03**: All emails dated before Jan 13 are marked as read (Inbox, Sent); Jan 13+ emails remain unread until their `deliver_at` fires
- [x] **ANCHOR-04**: Existing Jan 9 emails, voicemails, and time-gated content appear as already-delivered archive on first visit (no regressions)
- [x] **ANCHOR-05**: PROJECT.md, CLAUDE.md, and the planning anchor docs reflect Jan 13 as the active anchor day

### Desktop Notes & Contacts

- [x] **NOTES-01**: Lisa's desktop `notes.txt` gains a Jan 12 entry mentioning the Syd party flyer ("RIOT AT THE RAVE / RAGE AGAINST THE LOCK DOWN") and capturing the 555-2033 callback number
- [x] **NOTES-02**: Lisa's desktop `notes.txt` gains a Jan 13 entry recording Lucy's referral of Francisco at 555-8818, grocery store management
- [x] **NOTES-03**: Lisa's call list / contact data in JSON includes 555-2033 (Syd flyer) and 555-8818 (Francisco) entries with appropriate context labels
- [x] **NOTES-04**: Both notes.txt entries follow existing Lisa-voice content conventions (no em or en dashes, period-authentic phrasing)

### Jan 12 Call Log & Respondents

- [x] **CALL-01**: Jan 12 call log includes a 7:00 AM full-call entry for 555-9949 (caller name TBD during build)
- [x] **CALL-02**: Jan 12 call log includes a voicemail entry showing Lisa left an LV on 555-7120 immediately after the 7 AM call
- [x] **CALL-03**: Jan 12 call log includes a 12:00 PM full-call entry for 555-4432 Kubwimana
- [ ] **CALL-04**: New H-XXXX respondent profile file exists for the 555-9949 caller, following the established CATI respondent format (Demographics, S1-S3 screener, Survey Responses)
- [ ] **CALL-05**: New H-XXXX respondent profile file exists for 555-4432 Kubwimana, following the same format
- [ ] **CALL-06**: Both new respondent files are wired into `files.json` so they appear in the survey folder via File Explorer
- [ ] **CALL-07**: Respondent files honor the no-em-dash / no-en-dash content convention for survey response text

### Drudge Report

- [ ] **DRUDGE-01**: A period-authentic Drudge Report page exists in the IE5 browser, visually accurate to its 1999/2000 reference (red banner with rotating headline, three-column link layout, siren GIFs for breaking news, central photo + caption block)
- [ ] **DRUDGE-02**: Drudge Report headlines and link text reflect in-world lore consistent with the Jan 13, 2000 timeline anchor (content sourced from staff lore Taylor will supply at build time)
- [ ] **DRUDGE-03**: Drudge Report is reachable via a bookmark entry in the IE5 bookmarks list
- [ ] **DRUDGE-04**: Drudge Report integrates with the existing internal-page registry pattern (no `mode: ext` iframe; pure styled HTML like Yahoo / Ask Jeeves)
- [ ] **DRUDGE-05**: Drudge Report uses Tahoma / Arial fonts and period-appropriate styling; no modern CSS effects (no gradients, drop shadows, border-radius beyond what 1999 browsers supported)

## v2.0+ Requirements

Deferred to a later milestone.

### Forward Timeline

- **FWD-01**: Jan 14 through Jan 23 daily content (call logs, emails, voicemails, notes)
- **FWD-02**: Blizzard window content (Jan 24-26)
- **FWD-03**: Post-blizzard content (Jan 27+)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Forward timeline beyond Jan 13 | Future milestone — keep v1.8 focused on the Jan 13 anchor day |
| Drudge Report comments / interactivity | Drudge in 1999 was static link list; no comment feature existed |
| Drudge external link-out to other in-world sites | Internal-page-only for v1.8; cross-page wiring deferred |
| Marking voicemails as listened/unlistened | Voicemail log is plain text, not a stateful inbox |
| New respondent for 555-7120 (the LV recipient) | Lisa left a voicemail; no respondent interview occurred |
| Mobile / responsive layout | Desktop-only by design |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| ANCHOR-01 | Phase 30 | Complete |
| ANCHOR-02 | Phase 30 | Complete |
| ANCHOR-03 | Phase 30 | Complete |
| ANCHOR-04 | Phase 30 | Complete |
| ANCHOR-05 | Phase 30 | Complete |
| NOTES-01 | Phase 31 | Complete |
| NOTES-02 | Phase 31 | Complete |
| NOTES-03 | Phase 31 | Complete |
| NOTES-04 | Phase 31 | Complete |
| CALL-01 | Phase 32 | Complete |
| CALL-02 | Phase 32 | Complete |
| CALL-03 | Phase 32 | Complete |
| CALL-04 | Phase 32 | Pending |
| CALL-05 | Phase 32 | Pending |
| CALL-06 | Phase 32 | Pending |
| CALL-07 | Phase 32 | Pending |
| DRUDGE-01 | Phase 33 | Pending |
| DRUDGE-02 | Phase 33 | Pending |
| DRUDGE-03 | Phase 33 | Pending |
| DRUDGE-04 | Phase 33 | Pending |
| DRUDGE-05 | Phase 33 | Pending |

**Coverage:**
- v1.8 requirements: 21 total
- Mapped to phases: 21
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-29*
*Last updated: 2026-04-29 after initial definition*
