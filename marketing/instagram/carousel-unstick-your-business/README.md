# Instagram Carousel — "Un-stick Your Business"

Promotes the NG Workshop Camunda workshop, positioning NG as Camunda's Gold Partner in Israel.

- **Figma board:** https://www.figma.com/design/08SsraiwmGFmr6Oy23TH40
- **Format:** 1080 × 1350 px (4:5), 5 slides, RTL Hebrew with English sublines
- **Exports:** `01-hook.png` … `05-cta.png` — post in numeric order

## ⚠️ Before publishing

Slide 5 carries bracketed placeholders that must be replaced:

- `[ תאריך הסדנה ]` — workshop date
- `[ מקום / אונליין ]` — venue or online

Edit them in the Figma board (Slide 5 → `Workshop details`) and re-export.

## Copy deck

| # | Role | Hebrew | English subline |
|---|------|--------|-----------------|
| 01 | Hook | התהליכים בארגון תקועים? | Processes stuck in your organization? |
| 02 | Problem | כשיש צווארי בקבוק, הביצועים צונחים. | When bottlenecks exist, performance plummets. |
| 03 | Solution | הגיע הזמן לאוטומציה חכמה עם Camunda. NG, שותפת הזהב בישראל, תראה לכם איך להחליק כל תהליך. | It's time for smart automation with Camunda — with NG, Israel's Gold Partner. |
| 04 | Content | מה תלמדו בסדנה? · תזמור תהליכים מורכבים · זיהוי צווארי בקבוק בזמן אמת · שילוב BPMN בקלות | What will you learn in the workshop? |
| 05 | CTA | אל תישארו תקועים. הירשמו לסדנה הבלעדית של NG. — להרשמה עכשיו | Don't stay stuck. Register for NG's exclusive workshop. |

## Design system

- **Type:** Heebo (NG brand face) — Black for headlines, Bold, Medium for body.
- **Palette** (Figma variable collection `NG × Camunda Brand`):
  base `#0A0A0C` · Camunda orange `#FC5D0D` · Camunda teal `#00A7B5` ·
  partner gold `#AE9142` · NG green `#8ABF3B` · alert red `#E5484D`
- **Narrative arc:** red alarm (01–02) → blue + gold light (03) → orange action (05).
  Slide 01 asks *תקועים?* and slide 05 answers *אל תישארו תקועים.*
  The gears machine is the **same illustration** on slides 01 and 03 — jammed, then running.

## RTL note

Hebrew paragraphs that begin with Latin characters (e.g. `NG, שותפת הזהב…`) are prefixed with
a `U+200F` RIGHT-TO-LEFT MARK so the line keeps right-to-left order. Preserve that prefix when
editing copy, or the line will flip to LTR.

## Assets used

| Asset | Source |
|---|---|
| NG wordmark (white) | `marketing/graphics/ NG logo.png` — cream background knocked out, recoloured white |
| Camunda Gold Partner Certified | `marketing/graphics/Camunda/Camunda_GoldPartnerCert_Dark.svg` |
| Gears / circuit illustration (slides 01, 03) | `Camunda/graphice assets/The-Process-Orchestration-Platform-illustration-10.svg` — black line-work recoloured white for dark backgrounds |

The BPMN model on slide 04 and the bottleneck diagram on slide 02 are drawn as native Figma
vectors, so they stay editable.
