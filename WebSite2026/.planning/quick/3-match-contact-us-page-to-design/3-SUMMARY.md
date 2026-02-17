# Quick Task 003: Match Contact Page to Design

## What Changed
- **File:** `layouts/contact.html` - Complete rewrite of contact page layout

## Design Implementation

### Hero Section
- Gradient-mesh background with circuit-pattern overlay
- Desktop heading: "בואו נדבר על הצעד הבא שלכם" (extrabold, up to 6xl)
- Mobile heading: "בואו נדבר על הצעד הבא" (shorter)
- Subtitle: "בין אם אתם מחפשים פתרון AI מותאם אישית..."

### Desktop Layout (lg+)
Two side-by-side glass-panel cards in 2-col grid:
- **Meeting card (left)**: "MEETING" badge, calendar_month icon, name/email/phone fields, dark CTA "בחירת מועד ביומן"
- **WhatsApp card (right)**: Green ring accent, chat icon, name/phone fields, primary CTA "התחל צ'אט עכשיו"
- Cards use `rounded-[40px]`, `glass-panel`, `shadow-natural`

### Mobile Layout (<lg)
- Green WhatsApp banner button (full-width, direct link to wa.me)
- "או" divider
- Meeting form card with name/email/phone fields + dark CTA
- All within max-w-md centered container

### Feature Cards
Desktop (3-col grid):
1. Camunda Certified Partner badge + "שותפות רשמית"
2. Insights icon + "ניתוח ROI חינם" (green accent bg)
3. Security icon + "Enterprise Grade"

Mobile (stacked horizontal):
- Compact cards with icon + text side by side

### Functionality Preserved
- Form submission: FormSubmit POST → Calendly redirect
- WhatsApp: Desktop pre-fills name/phone in message; Mobile links directly
- Dual form instances with shared JS handler
- Hugo i18n strings for all translatable text

## Commits
- Initial rewrite: `9c41c3c`
- Design refinements: pending (this commit)
