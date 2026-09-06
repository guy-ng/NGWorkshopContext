# SCR-15: Settings — BQ Technician App

390×844, Material Design 3. Standard settings list layout.

## Purpose
App-level config: BLE connection parameters, appearance, data management, account.

## Layout (scrollable settings groups)

### Connection Settings
- Auto-connect on launch: toggle
- Connection interval: slider 15–100 ms (default 30)
- Slave latency: slider 0–10 (default 0)
- Supervision timeout: slider 1000–10000 ms (default 4000)
- MTU request: dropdown (23 / 128 / 185 / 247)

### Appearance
- Theme: Light / Dark / System (3-way toggle)
- Hex format: uppercase / lowercase toggle
- Show raw hex with parsed values: toggle (default on)

### Data Management
- Export all logs: button → generates ZIP (terminal, tests, sync, BLE logs)
- Clear local data: button + confirmation dialog showing data size
- Device history: list of past devices with bond info, tap to manage/forget

### Account
- Signed in as: user email + role badge
- Logout button
- Session timeout: dropdown (15min / 30min / 1hr / 4hr / Never)

### About
- App version, build number
- BLE plugin version
- Open source licenses link

## States
- Normal: all settings accessible
- Not logged in: Account section shows "Sign In" button instead
