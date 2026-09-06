# SCR-10: Notifications & Alerts — BQ Technician App

390×844, Material Design 3. Two-tab layout.

## Purpose
Monitor device notifications, manage active alerts, configure preferences.

## Tab 1: Live Feed

### Active Alerts Banner (top)
- Horizontal chips for current alerts: Low Battery | Empty Slot | Expired Cartridge | Motor Error | Sensor Error | Missed Dose
- Each chip tappable to acknowledge. "Acknowledge All" button right.

### Notification List (scrollable, newest first)
Each card:
- Left: type icon in circle (Clock=reminder, Check=complete, X=failed, Battery=low, Package=empty, Warning=expiring, Error=device error, Wifi-off=connectivity)
- Center: title from type, payload summary (one line)
- Right: timestamp, priority badge (Low=gray, Normal=blue, High=red)

## Tab 2: Settings
- **Notification Toggles:** Scheduled Reminders | Extraction Events | Battery Alerts | Cartridge Alerts | Error Alerts
- **Reminder Lead Time:** slider 0–60 minutes
- **Low Battery Threshold:** slider 5–50%
- **Quiet Hours:** two time pickers (start, end)
- Save button at bottom

## States
- No alerts: empty feed, "No notifications" with bell icon
- Active alerts: banner chips visible, feed populated
- High priority: red alert chips pulse gently
