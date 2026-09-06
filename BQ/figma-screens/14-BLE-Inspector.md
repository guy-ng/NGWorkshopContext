# SCR-13: BLE Inspector — BQ Technician App

390×844, Material Design 3. Dense developer layout.

## Purpose
Low-level BLE debug tool. Raw access to all GATT services/characteristics without protocol interpretation.

## Layout

### Service Tree (collapsible accordion, full screen)
- Each GATT service = collapsible section header: service name, UUID (mono), handle range
- Expanded: characteristics listed with UUID (mono), property chips (Read=blue, Write=green, Notify=amber, Indicate=purple), current hex value, descriptors
- Standard BLE services = blue header tint, custom BQ services = teal

### Characteristic Action Sheet (on tap)
- Read button → displays raw hex + ASCII + decimal interpretation
- Write field: hex input + "Send" button (Write / WriteNR toggle)
- Subscribe toggle for Notify/Indicate: shows live incoming hex data stream
- Value display: always raw hex (mono) + parsed attempts

### Packet Log (bottom sheet, expandable)
- Chronological: direction arrow (↑TX/↓RX), timestamp, UUID (short), hex payload, op type
- Filter bar: by service, direction, characteristic
- Each entry expandable for full details
- Export: JSON, CSV, plaintext

### Connection Info (overflow menu)
- MTU size, connection interval, slave latency, supervision timeout
- PHY, RSSI history mini chart

## States
- Connected: service tree populated, all actions available
- Subscribed: characteristic shows live data stream with timestamps
- Logging: packet log growing in real-time
- Disconnected: tree empty, reconnect prompt

## Figma Notes
Dense layout is intentional. Use small fonts (12-14sp). Mono everywhere for data.
