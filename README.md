# SleepyHub Website

Public static website for **SleepyHub**, **SleepySource**, and **SleepyChat**.


## What is included

- Animated SleepyHub welcome/splash screen with a random theme each visit
- Five shared site themes with the selector on the Home page
- SleepySource and SleepyChat product pages
- Compact side-by-side verified Downloads page
- Changelogs and official release-note links
- Support, GitHub, Privacy, and 404 pages
- Cloudflare Workers static-assets deployment configuration

## Local preview

No build step is required. Open `index.html` in a browser to preview the site directly.

The theme system also carries the selected theme between local `file://` pages so the extracted repository can be previewed without a local web server.

## Deploy

SleepyHub is deployed as a Cloudflare Worker with static assets using `wrangler.jsonc`.

From the repository root:

```bash
npx wrangler deploy
```

The Worker name is `sleepyhub`, and static assets are served from the repository root.

## Repository

Official SleepyHub repository:

`https://github.com/SleepyKevy/SleepyHub`

Related projects:

- `https://github.com/SleepyKevy/SleepySource`
- `https://github.com/SleepyKevy/SleepyChat`

## Repository safety

This repository is website-only. Do **not** commit:

- OAuth/client secrets
- API keys or tokens
- Cloudflare secrets
- Private backend configuration
- `.env` / `.dev.vars` files containing credentials

The included `.gitignore` excludes common local secret, tooling, log, and editor files.

## Site structure

```text
/
├── index.html             # Animated welcome screen
├── home.html              # Main SleepyHub home page + theme selector
├── downloads.html         # Verified downloads
├── sleepysource.html      # SleepySource product page
├── sleepychat.html        # SleepyChat product page
├── changelog.html         # Release history
├── support.html           # Support paths
├── github.html            # Official project repositories
├── privacy.html           # Website privacy information
├── 404.html               # Not-found page
├── assets/
│   ├── css/app.css        # Bundled site styles
│   ├── images/
│   └── js/app.js          # Bundled site scripts
├── _headers               # Static response headers
├── .assetsignore          # Files excluded from Workers static assets
└── wrangler.jsonc         # Cloudflare Workers configuration
```

## Notes

- The Home page is the only page that displays the theme selector.
- The selected theme carries across the rest of the site.
- The welcome splash uses an independent random theme and does not overwrite the saved site theme.
- No official Discord/community invite is included until one is intentionally configured.

### Repository optimization

The public site bundles shared CSS and JavaScript to reduce deploy/file overhead. Theme artwork is Git-deduplicated where possible; the green theme keeps its dedicated corrected artwork.
