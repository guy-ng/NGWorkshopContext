# NG Workshop website

Static bilingual marketing site built with Astro from the NG Workshop Figma design.

## Local development

Both npm and pnpm are supported and lockfiles are committed for each workflow.

```bash
npm install
npm run dev
```

or:

```bash
pnpm install
pnpm dev
```

Production verification:

```bash
npm run build
pnpm run build
```

The generated static site is written to `dist/`.

## Contact agent

The contact chat uses a Netlify Function backed by Google Gemini. Set
`GEMINI_API_KEY` in Netlify under **Project configuration → Environment
variables** with Functions scope, then redeploy. For local function testing,
copy `.env.example` to `.env`, add the key, and run the site with Netlify Dev.

Once the agent collects a name plus a phone number or email address, it submits
the lead and conversation to the `agent-lead` form in the Netlify dashboard.

## Languages

- Hebrew routes: `/he/...` (`dir="rtl"`)
- English routes: `/en/...` (`dir="ltr"`)
- `/` redirects to Hebrew.

## Blog and editor

The editor lives at `/admin/`. Blog articles are Markdown files under:

```text
src/content/blog/he/
src/content/blog/en/
```

Each localized article is independent. To connect Hebrew and English versions, give both files the same `translationKey`. An article may exist in either language without a counterpart.

For local CMS editing, run the site and a Decap proxy in a second terminal:

```bash
npx decap-server
```

Production publishing requires one of these authentication setups:

1. Netlify Identity + Git Gateway, matching the current `public/admin/config.yml`.
2. A GitHub OAuth provider, with the Decap backend changed to `github` and the repository configured.

Set `INCLUDE_DRAFTS=true` only on protected editorial preview builds when reviewers need draft routes. Do not set it on the public production build.

## Deployment

The ready-to-use publishing workflow targets **Netlify** because both Decap Git Gateway and the contact form depend on Netlify services. Enable Identity and Git Gateway, configure the build command as `npm run build` or `pnpm run build`, and set the publish directory to `dist`.

Contact submissions are stored in the Netlify site dashboard under **Forms → contact**. To receive them by email as well, add an email notification for the `contact` form under **Project configuration → Notifications → Form submission notifications**. Successful submissions redirect to the localized `/he/thank-you/` or `/en/thank-you/` page.

The generated `dist/` remains portable to other static hosts, but before deploying elsewhere you must replace the Decap backend with that host's GitHub OAuth integration and connect the contact form to a working form service or API endpoint.
