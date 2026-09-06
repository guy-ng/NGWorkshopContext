# SCR-14: Test Runner — BQ Technician App

390×844, Material Design 3.

## Purpose
Execute automated test sequences against device with structured pass/fail reporting.

## Layout

### Test Suite Selector (top)
- Card carousel or dropdown of test suites:
  - Full Device Health Check (all sensors + motor + cartridge)
  - Extraction Cycle (all 12 slots)
  - Motor Stress Test (rapid position changes)
  - Sensor Calibration Verify
  - OTA Dry Run (start, verify accept, abort)
  - Custom (user-defined)
- Each card: name, description, est. duration, step count
- "Run" primary button on selected suite

### Execution View (during test)
- Overall progress bar: "Step 5/12 — 42%"
- Vertical step list: step number, description, status icon
  - Pending = gray clock
  - Running = blue spinner
  - Pass = green check
  - Fail = red X
- Current step: blue left border highlight
- Expandable per step: characteristic, bytes sent (hex), received (hex), expected, actual, duration
- "Stop Test" red button (marks remaining as Skipped)

### Results Summary (post-execution)
- Header banner: PASS (green) or FAIL (red) with "10/12 passed"
- Total duration
- Failed steps expanded with error details
- Device info: serial, FW, HW (captured at start)
- Export: PDF or JSON report

## States
- Suite selection: carousel visible, no execution
- Running: progress bar + step list animating
- Complete (Pass): green banner, all steps green
- Complete (Fail): red banner, failed steps expanded
