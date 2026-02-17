# Quick Task 001: Make Main Site Page Match Main Page Design

## Description
Redesign the homepage to match the "Main Page" design mockup from `temp_content/New Desing/Main Page/screen.png`.

## Key Changes

### 1. Hero Section - Replace Pipeline with Dashboard Mockup
- Remove the animated data pipeline (Raw Data → AI Processing → Approval)
- Replace with a clean dashboard UI mockup (tablet frame showing process dashboard)
- Add stats row below hero content (3 key metrics: projects, clients, uptime/accuracy)
- Keep text content, buttons, and background effects mostly the same

### 2. Service Cards - Simplify Layout
- Remove the large animated illustration area (spinning orbits, dashed circles)
- Replace with compact cards: small green icon box + text content
- Keep the 2x2 grid layout
- Keep card content (title, subtitle, description, tags)

### 3. Files to Modify
- `layouts/home.html` - Hero section visual + service card layout
- `content/hebrew/_index.md` - Add stats data to frontmatter

## Tasks
1. Update hero section in home.html (replace pipeline with dashboard mockup + stats)
2. Update service cards in home.html (simpler card design)
3. Add stats data to _index.md frontmatter
