---
phase: quick-002
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - config/_default/params.toml
  - config/_default/menus.he.toml
  - config/_default/menus.en.toml
  - config/_default/languages.toml
  - content/english/_index.md
autonomous: true
must_haves:
  truths:
    - "No announcement banner appears on any page"
    - "Top navigation shows only Blog link (no Home, Services, About, Contact)"
    - "Language dropdown shows 'Hebrew' and 'En' (both in English)"
    - "English homepage displays translated NG Workshop content matching Hebrew structure"
    - "Navigation contact button is removed"
  artifacts:
    - path: "config/_default/params.toml"
      provides: "Banner disabled, nav button disabled"
      contains: "enable = false"
    - path: "config/_default/menus.he.toml"
      provides: "Hebrew nav with blog only"
    - path: "config/_default/menus.en.toml"
      provides: "English nav with blog only"
    - path: "config/_default/languages.toml"
      provides: "Hebrew languageName in English"
      contains: 'languageName = "Hebrew"'
    - path: "content/english/_index.md"
      provides: "English homepage content"
  key_links: []
---

<objective>
Homepage cleanup: disable announcement banner, simplify navigation to blog-only, fix language names to English, and translate the English homepage to match the Hebrew NG Workshop content.

Purpose: Clean up the site for a minimal professional presence with blog as the primary nav destination, and ensure the English homepage is real content (not Hugoplate template defaults).
Output: Updated config files and translated English homepage.
</objective>

<execution_context>
@/Users/guyelisha/.claude/get-shit-done/workflows/execute-plan.md
@/Users/guyelisha/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@config/_default/params.toml
@config/_default/menus.he.toml
@config/_default/menus.en.toml
@config/_default/languages.toml
@content/hebrew/_index.md
@content/english/_index.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Disable banner, strip nav to blog-only, fix language names</name>
  <files>
    config/_default/params.toml
    config/_default/menus.he.toml
    config/_default/menus.en.toml
    config/_default/languages.toml
  </files>
  <action>
    1. In `config/_default/params.toml`:
       - Set `[announcement]` > `enable = false` (line 60, change from `true` to `false`)
       - Set `[navigation_button]` > `enable = false` (line 42, change from `true` to `false`)

    2. In `config/_default/menus.he.toml`:
       - Remove ALL `[[main]]` entries EXCEPT the blog entry (name = "בלוג", url = "/he/blog/", weight = 3)
       - Keep the blog entry but change its weight to 1 (since it is now the only item)
       - Remove ALL `[[footer]]` entries (about, services, privacy, accessibility) since those pages are no longer navigable
       - Keep the footer section header comment but leave it empty (Hugo handles missing footer gracefully)

    3. In `config/_default/menus.en.toml`:
       - Remove ALL `[[main]]` entries EXCEPT Blog. Create a single top-level entry: name = "Blog", url = "/blog/", weight = 1 (NOT nested under "Pages")
       - Remove ALL `[[footer]]` entries (about, elements, privacy policy)

    4. In `config/_default/languages.toml`:
       - Change Hebrew `languageName` from `"עברית"` to `"Hebrew"` so the language dropdown always shows English names
       - Keep everything else (languageCode, languageDirection, contentDir, weight) unchanged
  </action>
  <verify>
    Run `hugo server` and verify:
    - No announcement banner at top of page
    - No contact button in nav
    - Only "Blog" appears in top navigation (both Hebrew and English sites)
    - Language switcher shows "Hebrew" and "En"
    - No footer nav links
  </verify>
  <done>
    Announcement banner disabled. Navigation shows only Blog link on both languages. Contact button removed. Language dropdown displays "Hebrew" and "En" (both English).
  </done>
</task>

<task type="auto">
  <name>Task 2: Translate English homepage to match Hebrew NG Workshop content</name>
  <files>content/english/_index.md</files>
  <action>
    Replace the entire content of `content/english/_index.md` with a proper English translation of the Hebrew homepage (`content/hebrew/_index.md`). Use the SAME YAML frontmatter structure (hero, services, methodology, cta sections) so the same Hugo template renders it.

    Translate as follows:

    **Hero section:**
    - badge: "Enterprise AI & Process Engineering" (keep as-is, already English)
    - title: "Turning Complex Technology"
    - title_highlight: "Into Natural Business Advantage"
    - subtitle: "At NG Workshop, we specialize in building intelligent systems that scale with your organization. We integrate artificial intelligence with business process management (BPM), while maintaining full human control at critical decision points."
    - button_primary label: "Schedule a Discovery Session", link: "/contact/"
    - button_secondary label: "See Our Methodology", link: "#methodology"

    **Services section:**
    - title: "Our Areas of Expertise"
    - subtitle: "We provide a complete technology solution, from strategy through implementation and development, with emphasis on stable architecture and scalability."
    - Items (keep titles in English as they already are, translate subtitles and descriptions):
      1. AI Agent Integration - subtitle: "Smart AI Agent Integration", description: "Building Multi-Agent Systems that perform complex tasks autonomously, with full documentation of the decision-making process.", tags: same
      2. Process Orchestration - subtitle: "Camunda Implementation & Deployment", description: "We are official Camunda partners. We transform manual, fragmented processes into a single orchestrated system.", tags: same
      3. Strategic Consulting - subtitle: "AI Strategy & Organizational Readiness", description: "Don't adopt AI just because it's trending. We conduct needs mapping, technical feasibility assessment, and build a safe roadmap.", tags: same
      4. Custom Development - subtitle: "Custom Software Development", description: "Building robust web and mobile systems that support your business core. Modern microservices architecture with cutting-edge technologies.", tags: same

    **Methodology section:**
    - badge: "Transparent AI" (keep)
    - title: "The White Box Approach"
    - description: "Unlike closed off-the-shelf solutions, we believe technology should be transparent to the organization."
    - extended_description: "In the systems we build, the business logic remains yours. The AI model is just an assistive tool, but the final decision and control always stay in human hands or in defined business rules."
    - Features:
      1. icon: "visibility", title: "Full Transparency", description: "Complete access to the logic and algorithms driving the decisions."
      2. icon: "engineering", title: "Human-in-the-Loop", description: "Control mechanisms enabling real-time human intervention."
      3. icon: "lock_person", title: "Privacy & Security", description: "Stringent information security standards without compromise."

    **CTA section:**
    - title: "Ready to Upgrade Your Business Processes?"
    - description: "Let's talk. A complimentary initial consultation where we'll understand your needs and show how technology can serve you."
    - button_primary: label: "Schedule a Consultation", link: "/contact/", icon: "calendar_today"
    - button_secondary: label: "Contact Us by Email", link: "mailto:info@ngworkshop.co.il", icon: "email"

    IMPORTANT: The YAML structure must be identical to the Hebrew file (same keys, same nesting). Only the string values change.
  </action>
  <verify>
    Run `hugo server` and navigate to the English homepage. Verify:
    - Hero section renders with English title, subtitle, and buttons
    - Services section shows 4 cards with English content
    - Methodology section renders with White Box approach content
    - CTA section shows English call-to-action
    - No Hugoplate template text remains
  </verify>
  <done>
    English homepage displays fully translated NG Workshop content matching the Hebrew homepage structure. No Hugoplate default content remains. All sections (hero, services, methodology, CTA) render correctly in English.
  </done>
</task>

</tasks>

<verification>
1. `hugo server` starts without errors
2. Hebrew site (`/he/`) shows: no banner, only Blog in nav, no contact button, homepage content unchanged
3. English site (`/`) shows: no banner, only Blog in nav, translated homepage with all 4 sections
4. Language switcher shows "Hebrew" and "En" (not Hebrew characters)
5. Clicking Blog in nav works on both language versions
</verification>

<success_criteria>
- Announcement banner is disabled (not visible on any page)
- Top navigation contains only Blog link (both languages)
- Navigation contact button is removed
- Language dropdown displays English names: "Hebrew" and "En"
- English homepage has real NG Workshop content (hero, services, methodology, CTA) translated from Hebrew
- Hugo builds and serves without errors
</success_criteria>

<output>
After completion, create `.planning/quick/2-homepage-cleanup-remove-top-banner-simpl/2-SUMMARY.md`
</output>
