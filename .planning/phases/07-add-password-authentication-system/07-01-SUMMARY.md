---
phase: "07"
plan: "01"
subsystem: boot-authentication
tags: [password, login, authentication, localStorage, return-visitor]
dependency_graph:
  requires: []
  provides: [password-gate, return-visitor-bypass]
  affects: [boot-sequence, login-dialog]
tech_stack:
  added: []
  patterns: [base64-obfuscation, promise-based-ui-loop]
key_files:
  created:
    - public/assets/icons/32/exclamation.png
  modified:
    - public/js/boot.js
    - public/css/nt4.css
decisions:
  - Password stored as base64 ('aG9yaXpvbg==') for minimal obfuscation, decoded at runtime
  - Error dialog uses img with onerror fallback to Unicode for graceful degradation
  - No lockout mechanism -- unlimited password retries by design
metrics:
  duration: "2min"
  completed: "2026-03-29"
---

# Phase 07 Plan 01: Password Authentication Summary

Password validation loop on NT4 login dialog using base64-decoded "horizon" with authentic error dialog and return visitor localStorage bypass.

## What Was Built

Added working password authentication to the existing login dialog in boot.js. The password field is now editable and empty (previously readonly with "password" prefilled). Entering the wrong password shows an NT4-authentic "Logon Message" error dialog with exclamation icon. Correct password ("horizon") proceeds to the desktop. Return visitors who previously authenticated skip the entire boot sequence via localStorage.

## Task Results

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Add password validation, error dialog, and return visitor wiring | d5f207a | boot.js, nt4.css, exclamation.png |
| 2 | Verify password authentication flow | -- | Auto-approved checkpoint |

## Key Changes

### public/js/boot.js
- **validatePassword()**: Compares input against `atob('aG9yaXpvbg==')` (decodes to "horizon")
- **waitForLoginSubmit()**: Promise-based handler for both OK click and Enter key
- **showLogonError()**: Creates NT4 "Logon Message" dialog overlay with exclamation icon and authentic error text
- **loginDialog()**: Password field now editable/empty with `id="login-password"`, validation loop replaces single OK click
- **bootSequence()**: Calls `setBootedFlag()` after successful login
- **DOMContentLoaded**: Branches on `isReturnVisitor()` to skip boot for returning visitors

### public/css/nt4.css
- `.dialog-icon-img`: 32x32 flex-shrink icon sizing for error dialog
- `.logon-error .dialog-body p`: 11px font with 1.4 line-height for error text

### public/assets/icons/32/exclamation.png
- Programmatically generated 32x32 yellow triangle with black exclamation mark
- onerror fallback renders Unicode warning character if image fails

## Deviations from Plan

None -- plan executed exactly as written.

## Self-Check: PASSED
