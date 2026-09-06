# SCR-18: Device Cloud Sync — BQ Technician App

390×844, Material Design 3. Primary #1B3A5C, Success #2E7D32, Error #C62828.

## Purpose
Upload device data (telemetry, test reports, logs) to cloud. Manage device registry entry. Enable fleet tracking.

## Layout

### Device Cloud Card (top, prominent)
- Device identity: serial, model, FW version
- Registration badge: "Registered" (green, cloud-check icon) or "Not Registered" (gray + "Register" button)
- Last cloud sync: relative timestamp ("2 hours ago")
- Status dropdown: Active | Maintenance | Retired
- Assigned technician: current user name (auto-set)

### Upload Queue Card
- Category rows with pending counts:
  - Telemetry Records: "142 pending"
  - Test Reports: "3 pending"
  - Extraction Events: "28 pending"
  - Error Events: "5 pending"
- Total size estimate: "~84 KB"
- **"Upload All" primary button** (full width)
- During upload: overall progress bar + per-category: "Uploading telemetry... 42/142"
- Individual category upload buttons for selective upload

### Upload History (scrollable)
- Past uploads list: timestamp, category icon, record count, status badge (Success=green / Failed=red+retry / Partial=amber)
- Filter chips: All | Telemetry | Tests | Extractions | Errors
- Pull-to-refresh

### Device History (collapsible section)
- Timeline from cloud: FW updates (version changes), test results (pass/fail), technician interactions (who/when), status changes
- Each entry: timestamp, type icon, summary
- "View Full History" link

### Sync Controls (bottom card)
- Auto-upload after device sync: toggle (default ON)
- Upload on WiFi only: toggle (default ON)
- Background sync: toggle (default ON)
- Retry failed uploads: button

## States
- Ready: queue counts shown, upload enabled
- Uploading: progress bars active, buttons disabled
- Complete: all counts 0, success toast
- Partial Failure: failed items red with retry, successful cleared
- Offline: banner "No internet — queued", upload disabled
- Not Registered: "Register Device" card replaces cloud card
