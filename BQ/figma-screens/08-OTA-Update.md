# SCR-07: OTA Firmware Update — BQ Technician App

390×844, Material Design 3. Primary #1B3A5C, Success #2E7D32, Error #C62828.

## Purpose
Flash firmware or SPIFFS over BLE with progress tracking, error recovery, and cloud firmware integration.

## Layout

### Current Firmware Card (top)
- Current FW version, HW revision, model, serial from device
- Last update timestamp

### Firmware Source Section
- **"Cloud Firmware" primary button** (recommended path) → navigates to Cloud Firmware Browser (SCR-17)
- Divider with "OR"
- **"Local File" outlined button** (fallback) → system file picker for .bin
- If cloud firmware pre-selected: "Selected: v2.1.0 (Stable) — 1.2 MB, downloaded" with "Change" link
- Radio: "Firmware Update" / "SPIFFS Update"
- Compression toggle: "Use zlib compression" (default on)
- Validation checklist: format OK ✓, size OK ✓, version newer ✓

### Transfer Progress (during OTA)
- Overall progress bar: percentage + transferred/total bytes
- Sector progress: "Sector 42/256" with mini bar
- Speed: "45 KB/s" | ETA: "~12s"
- Status: "Sending sector 42, packet 8/17"
- Sector map: row of small dots (green=done, blue=sending, gray=pending)

### Action Buttons
- "Start Update" primary → confirmation dialog ("Do not disconnect during transfer")
- "Abort" red outlined (during transfer)

### Result
- Success: green banner "Firmware updated. Device restarting..." + countdown → auto-reconnect
- Failure: red banner + error (CRC/Signature/Connection Lost) + "Retry" (resumes from last ACK)

## States
- Ready: file selected, checklist passed, "Start" enabled
- Transferring: progress section active, abort visible
- Complete: success banner, reconnecting
- Error: red banner with retry
- No File: source section prominent, progress hidden
