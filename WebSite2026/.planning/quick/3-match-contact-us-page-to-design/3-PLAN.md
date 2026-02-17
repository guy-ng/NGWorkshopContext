---
phase: quick-003
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - layouts/contact.html
autonomous: false

must_haves:
  truths:
    - "Desktop shows hero heading + subtitle, then two side-by-side glass-panel cards (WhatsApp right, Meeting left)"
    - "Mobile shows green WhatsApp banner button, 'or' divider, then meeting form card stacked vertically"
    - "Three feature cards appear below the main cards (3-col on md+, stacked on mobile)"
    - "WhatsApp link opens pre-filled chat, meeting form submits to FormSubmit then redirects to Calendly"
  artifacts:
    - path: "layouts/contact.html"
      provides: "Complete contact page matching design mockup"
      contains: "glass-panel"
  key_links:
    - from: "layouts/contact.html"
      to: "https://formsubmit.co/ajax/guy@ngworkshop.co.il"
      via: "fetch POST on form submit"
      pattern: "formsubmit\\.co"
    - from: "layouts/contact.html"
      to: "https://wa.me/972528232535"
      via: "WhatsApp link with pre-filled message"
      pattern: "wa\\.me"
    - from: "layouts/contact.html"
      to: "https://calendly.com/ngworkshop"
      via: "redirect after form submit"
      pattern: "calendly\\.com"
---

<objective>
Rewrite the contact page layout to match the new design mockup with a hero section, two side-by-side glass-panel cards (WhatsApp quick chat + meeting booking), three feature cards, and full mobile responsiveness.

Purpose: Transform the basic contact page into the polished, conversion-focused design with clear CTAs and trust signals.
Output: Rewritten `layouts/contact.html` matching desktop and mobile mockups.
</objective>

<execution_context>
@/Users/guyelisha/.claude/get-shit-done/workflows/execute-plan.md
@/Users/guyelisha/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@layouts/contact.html
@assets/css/custom.css (has .glass-panel, .shadow-natural, .gradient-mesh, .circuit-pattern definitions)
@assets/css/buttons.css (has .btn, .btn-primary, .btn-primary-rounded)
@assets/css/utilities.css (has .form-input, .form-label @utility definitions)
@assets/css/components.css (has .section, .section-sm, .container)
@layouts/_partials/essentials/style.html (confirms Material Icons + Material Symbols Outlined are loaded via Google Fonts CDN)
@data/theme.json (primary: #8ABF3B, body: #FAF9F6, dark: #3E352B, text: #6B6054)
@content/hebrew/contact/_index.md (layout: "contact", title: "צרו קשר")
</context>

<tasks>

<task type="auto">
  <name>Task 1: Rewrite contact page layout to match design mockup</name>
  <files>layouts/contact.html</files>
  <action>
Completely rewrite the `{{ define "main" }}` block in `layouts/contact.html`. Keep `{{ partial "page-header" . }}` at the top. The new structure:

**1. Hero Section**
- Wrapper: `<section class="gradient-mesh relative overflow-hidden py-16 md:py-24">`
- Inside, a `circuit-pattern` absolute overlay div
- Container with centered text:
  - Desktop heading (`hidden md:block`): `"בואו נדבר על הצעד הבא שלכם"` in `text-3xl md:text-5xl font-bold text-[#3E352B]`
  - Mobile heading (`md:hidden`): `"בואו נדבר על הצעד הבא"` (shorter)
  - Subtitle: `"פגישת ייעוץ ראשונית ללא עלות. נבין את הצרכים שלכם ונבנה תוכנית פעולה מותאמת."` in `text-lg text-[#6B6054] max-w-2xl mx-auto`

**2. Two Main Cards Section (Desktop: side-by-side, Mobile: stacked)**

Desktop layout (`hidden lg:grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto mt-12`):

- **Right card (order-2 on lg)** - WhatsApp Quick Chat:
  - `glass-panel rounded-2xl p-8 shadow-natural`
  - Green chat icon using Material Icons: `<span class="material-icons text-4xl text-[#25d366]">chat</span>`
  - Title: `"שיחה מהירה בוואטסאפ"` (h3, font-bold)
  - Subtitle: `"קבלו מענה תוך דקות"` (text-[#6B6054])
  - Two fields: name (text) + phone (tel) - using Tailwind form styling (`w-full rounded-lg border border-gray-200 px-4 py-3 text-right focus:border-[#25d366] focus:ring-1 focus:ring-[#25d366] outline-none`)
  - Green CTA button: `"התחל צ'אט עכשיו"` with WhatsApp SVG icon. Link: `https://wa.me/972528232535?text=...` with the name injected into the message. Style: `bg-[#25d366] hover:bg-[#20ba5a] text-white font-bold py-3 px-6 rounded-xl w-full flex items-center justify-center gap-2 transition-all`
  - JavaScript: on click, read name + phone fields, build WhatsApp URL with pre-filled message including name, open in new tab

- **Left card (order-1 on lg)** - Meeting Booking:
  - `glass-panel rounded-2xl p-8 shadow-natural`
  - Badge at top: `"MEETING"` in small uppercase, styled `inline-block bg-[#3E352B] text-white text-xs font-bold px-3 py-1 rounded-full mb-4`
  - Calendar icon: `<span class="material-icons text-4xl text-[#3E352B]">calendar_today</span>`
  - Title: `"קביעת פגישת ייעוץ"` (h3, font-bold)
  - Three fields: name (text), email (email), phone (tel) - same input styling as WhatsApp card but with `focus:border-primary focus:ring-primary`
  - Consent checkbox (preserve existing logic)
  - Dark CTA button: `"בחירת מועד ביומן"` with calendar icon. Style: `bg-[#3E352B] hover:bg-[#2a2420] text-white font-bold py-3 px-6 rounded-xl w-full flex items-center justify-center gap-2 transition-all`
  - This is the main form - keep `id="contact-booking-form-desktop"` and the existing form submission logic (FormSubmit POST then Calendly redirect)

Mobile layout (`lg:hidden mt-8 px-4`):

- **WhatsApp banner button** (full-width, no form fields on mobile):
  - `bg-[#25d366] text-white rounded-2xl p-5 flex items-center justify-between shadow-natural`
  - Left side: WhatsApp SVG icon + text `"שיחה מהירה בוואטסאפ"` + subtitle `"קבלו מענה תוך דקות"`
  - Right side: arrow icon (Material Icons `arrow_back` since RTL)
  - Links directly to `https://wa.me/972528232535?text=...` (no form fields on mobile)

- **"או" divider**: centered text with horizontal lines on each side. `flex items-center gap-4 my-6` with `<div class="flex-1 h-px bg-gray-300"></div>` on each side and `"או"` text in center

- **Meeting form card** (same fields as desktop meeting card):
  - `glass-panel rounded-2xl p-6 shadow-natural`
  - Same form as desktop meeting card (name, email, phone, consent, submit button)
  - Use `id="contact-booking-form-mobile"` and attach the submit handler to BOTH forms in the script

**3. Feature Cards Section**
Below both desktop and mobile sections, add three feature cards:

Desktop (`hidden md:grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-12`):
- Each card: `glass-panel rounded-xl p-6 text-center shadow-natural`
- Card 1: shield/verified icon + `"שותפות רשמית"` title + `"שותף מורשה של Camunda לאזור ישראל"` description
- Card 2: analytics icon + `"ניתוח ROI חינם"` title + `"הערכת החזר השקעה מותאמת לארגון שלכם"` description
- Card 3: security icon + `"Enterprise Grade"` title + `"תשתית מוכנה לסביבות ייצור מחמירות"` description

Mobile (`md:hidden space-y-3 mt-8 px-4`):
- Each card: horizontal layout `glass-panel rounded-xl p-4 flex items-center gap-4 shadow-natural`
- Icon on one side, title + description on the other (compact)

**4. Style block**
Remove all existing inline `<style>` content. Add minimal styles only for things that cannot be achieved with Tailwind:
- Keep consent checkbox accent-color styling

**5. Script block**
Preserve the existing form submission logic but adapt for dual forms:
- Create a `handleBookingSubmit(e)` function
- Attach it to both `contact-booking-form-desktop` and `contact-booking-form-mobile` forms
- Keep the FormSubmit POST + Calendly redirect logic exactly as-is
- Add WhatsApp button handler for desktop: read name/phone fields, build URL, open `window.open(url, '_blank')`
- Keep all i18n template strings (`{{ i18n ... }}`) for validation error messages

**Important implementation notes:**
- Material Icons are already loaded (confirmed in style.html). Use `<span class="material-icons">icon_name</span>` syntax.
- Use existing CSS classes where possible: `glass-panel`, `shadow-natural`, `gradient-mesh`, `circuit-pattern`
- All text is RTL Hebrew - the site is RTL by default
- Color palette from theme.json: primary=#8ABF3B, dark=#3E352B, text=#6B6054, body=#FAF9F6
- WhatsApp green: #25d366 (existing in current code)
- Do NOT modify any other files - all changes in this single template
  </action>
  <verify>
Run `cd /Users/guyelisha/NGWorkshopContext/WebSite2026 && hugo --minify 2>&1 | tail -5` to confirm the Hugo build succeeds without errors. Then verify the output HTML contains key elements: `grep -c "glass-panel" layouts/contact.html` should return 5+ matches, `grep -c "gradient-mesh" layouts/contact.html` should return 1+, `grep -c "formsubmit" layouts/contact.html` should return 1+, `grep -c "wa.me" layouts/contact.html` should return 2+ (desktop + mobile).
  </verify>
  <done>
Contact page renders with: (1) hero section with gradient-mesh background and circuit-pattern overlay, (2) desktop shows two side-by-side glass-panel cards - WhatsApp on right with name/phone fields and green CTA, Meeting on left with name/email/phone fields and dark CTA, (3) mobile shows green WhatsApp banner link, "or" divider, then meeting form card, (4) three feature cards below in 3-col grid on desktop / stacked horizontal on mobile, (5) form submission to FormSubmit + Calendly redirect preserved, (6) WhatsApp link with pre-filled message preserved, (7) Hugo builds without errors.
  </done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Task 2: Visual verification of contact page redesign</name>
  <files>layouts/contact.html</files>
  <action>User verifies the contact page visually matches the design mockup on desktop and mobile.</action>
  <verify>User confirms visual match.</verify>
  <done>User approves the contact page design.</done>
  <what-built>Complete contact page redesign matching the design mockup with hero, dual glass-panel cards, feature cards, and responsive mobile layout</what-built>
  <how-to-verify>
    1. Start Hugo dev server: `hugo server -D` (or use existing running server)
    2. Visit http://localhost:1313/he/contact/ in desktop browser (width > 1024px)
    3. Verify: hero section with heading + subtitle on gradient background
    4. Verify: two side-by-side glass cards - WhatsApp (right) with green CTA, Meeting (left) with dark CTA
    5. Verify: three feature cards in a row below
    6. Resize browser to mobile width (< 1024px)
    7. Verify: green WhatsApp banner button at top
    8. Verify: "or" divider between WhatsApp and meeting form
    9. Verify: meeting form card with all fields
    10. Verify: feature cards stacked vertically in compact horizontal layout
    11. Test WhatsApp link opens correctly
    12. Test meeting form fields are functional (don't submit unless you want to)
  </how-to-verify>
  <resume-signal>Type "approved" or describe any visual/functional issues to fix</resume-signal>
</task>

</tasks>

<verification>
- Hugo build completes without errors
- `layouts/contact.html` contains glass-panel, gradient-mesh, shadow-natural classes
- Both WhatsApp and FormSubmit URLs are preserved
- Responsive breakpoints work: lg for dual cards, md for feature cards
- Form submission script handles both desktop and mobile form instances
</verification>

<success_criteria>
- Contact page visually matches the design mockup on both desktop and mobile
- WhatsApp quick chat with pre-filled message works
- Meeting booking form submits to FormSubmit and redirects to Calendly
- Three feature/trust cards display correctly
- Page uses existing design system classes (glass-panel, shadow-natural, gradient-mesh)
- Hugo builds successfully
</success_criteria>

<output>
After completion, create `.planning/quick/3-match-contact-us-page-to-design/3-SUMMARY.md`
</output>
