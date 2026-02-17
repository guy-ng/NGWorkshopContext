---
phase: quick-002
plan: 01
subsystem: homepage-config
tags: [configuration, navigation, localization, content-translation]
dependency_graph:
  requires: []
  provides: [clean-navigation, english-homepage-content]
  affects: [site-header, language-switcher, homepage-display]
tech_stack:
  added: []
  patterns: [hugo-config, yaml-frontmatter]
key_files:
  created: []
  modified:
    - config/_default/params.toml
    - config/_default/menus.he.toml
    - config/_default/menus.en.toml
    - config/_default/languages.toml
    - content/english/_index.md
decisions:
  - "Disabled announcement banner for cleaner header"
  - "Stripped navigation to blog-only for minimal professional presence"
  - "Changed Hebrew language name to English for consistent UI"
  - "Translated English homepage to match Hebrew NG Workshop content structure"
metrics:
  duration: "4m 5s"
  tasks_completed: 2
  files_modified: 5
  completed_date: "2026-02-17"
---

# Quick Task 002: Homepage Cleanup - Remove Banner & Simplify Navigation

**One-liner:** Disabled announcement banner, stripped navigation to blog-only, fixed language names to English, and translated English homepage to match Hebrew NG Workshop content.

## Overview

This quick task cleaned up the site for a minimal professional presence with the blog as the primary navigation destination. It also replaced the default Hugoplate template content on the English homepage with a proper translation of the Hebrew NG Workshop content.

## Tasks Completed

### Task 1: Disable banner, strip nav to blog-only, fix language names
**Status:** Complete
**Commit:** `3a22872`

**Changes made:**
1. **params.toml** - Disabled announcement banner (`enable = false` at line 60)
2. **params.toml** - Disabled navigation contact button (`enable = false` at line 42)
3. **menus.he.toml** - Removed all navigation links except Blog (weight changed to 1)
4. **menus.en.toml** - Removed all navigation links except Blog (weight = 1)
5. **languages.toml** - Changed Hebrew `languageName` from `"עברית"` to `"Hebrew"`

**Files modified:**
- `config/_default/params.toml`
- `config/_default/menus.he.toml`
- `config/_default/menus.en.toml`
- `config/_default/languages.toml`

### Task 2: Translate English homepage to match Hebrew NG Workshop content
**Status:** Complete
**Commit:** `82c7c9b`

**Changes made:**
1. Replaced entire `content/english/_index.md` with English translation
2. Maintained identical YAML structure to Hebrew version for template compatibility
3. Translated all sections:
   - **Hero:** Badge, title, subtitle, CTA buttons
   - **Services:** 4 expertise areas (AI Agents, Process Orchestration, Strategic Consulting, Custom Development)
   - **Methodology:** White Box approach with transparency features
   - **CTA:** Consultation call-to-action with contact buttons

**Files modified:**
- `content/english/_index.md`

## Deviations from Plan

None - plan executed exactly as written.

## Verification Results

- Hugo builds without errors
- Announcement banner disabled (not visible)
- Navigation shows only "Blog" link on both Hebrew and English sites
- Navigation contact button removed
- Language switcher displays "Hebrew" and "En" (both in English)
- English homepage displays real NG Workshop content with all 4 sections (hero, services, methodology, CTA)
- No Hugoplate template defaults remain on English homepage

## Technical Details

**Configuration changes:**
- Banner module disabled via params.toml
- Navigation button feature disabled
- Menu structure simplified to single top-level blog entry
- Footer navigation cleared (Hugo handles missing footer gracefully)
- Language display names standardized to English

**Content translation:**
- YAML frontmatter structure preserved for Hugo template compatibility
- All string values translated while maintaining same data structure
- Icons, tags, and technical terms kept in English
- Contact links and anchors preserved

## Impact

**User-facing:**
- Cleaner, more professional header without banner announcement
- Simplified navigation reduces cognitive load
- Consistent English language names in UI
- English site now has real business content matching Hebrew site

**Technical:**
- Reduced nav complexity
- Consistent YAML structure across language versions
- English homepage ready for production

## Next Steps

No immediate follow-up required. Site is now in minimal professional state with blog as primary destination and real content on both language versions.

## Self-Check

**Created files:** None

**Modified files:**
- [x] `config/_default/params.toml` exists
- [x] `config/_default/menus.he.toml` exists
- [x] `config/_default/menus.en.toml` exists
- [x] `config/_default/languages.toml` exists
- [x] `content/english/_index.md` exists

**Commits:**
- [x] `3a22872` exists (Task 1)
- [x] `82c7c9b` exists (Task 2)

## Self-Check: PASSED
