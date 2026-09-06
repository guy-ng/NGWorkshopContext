# SCR-05: Pill Extraction — BQ Technician App

390×844, Material Design 3. Primary #1B3A5C, Success #2E7D32, Error #C62828, Warning #F57F17. Font: Roboto. Mono: JetBrains Mono.

## Purpose
Manage pill extraction: manual extract with live progress, scheduling, and history. Three-tab layout.

## Tab 1: Extract (Manual)
- **Slot Selector:** 12-slot circular visualizer (like clock face). Green dot = pill present, gray = empty (from pill detection bitmap). Tap to select.
- **Selected Slot Info Card:** Slot number, pill presence (Yes/No), last extraction time
- **Extract Button:** Large primary "Extract from Slot N", disabled if slot empty
- **Confirmation Dialog:** "Confirm extraction from Slot N?" with Cancel / Confirm
- **Progress Stepper (vertical, animated):** Idle → Rotating to Position → Extracting → Verifying → Complete. Active step = blue spinner, done = green check, failed = red X
- **Result Card:** Success = green check + "Pill extracted from Slot N" | Failure = red X + error (No Pill / Jam / Motor Error / Timeout)

## Tab 2: Schedule
- **Weekly Calendar View:** 7-day header (Sun–Sat), time slots as colored blocks
- **Schedule Cards:** Up to 14 entries, each showing time (HH:MM), slot number, enabled/disabled toggle
- **Add FAB:** Opens form: day checkboxes, time picker, slot selector (0–11), enable toggle
- Edit on tap, swipe to delete with confirmation

## Tab 3: History
- List of 10 records, each card: timestamp, slot icon + number, result badge (Success=green / Error=red with code)
- Export CSV button in app bar
- Pull-to-refresh

## States
- Idle: slot selector visible, no extraction active
- Extracting: stepper visible with animated progress
- Complete/Failed: result card with action buttons
- No Cartridge: "Insert cartridge" message, extract disabled
