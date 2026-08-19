# SleepyHub Website

Static Cloudflare Workers website for **SleepySource** and **SleepyChat**.

## Deploy
SleepyHub is deployed as a Cloudflare Worker with static assets using `wrangler.jsonc`.

From the repository root:

```bash
npx wrangler deploy
```

The Worker name is `sleepyhub`, and the static site is served from the repository root through the Wrangler `assets.directory` configuration.

## Repository
This is the official public SleepyHub website repository: https://github.com/SleepyKevy/SleepyHub

## Important
This repo is website-only. Keep private application credentials and backend configuration out of this repository.

## Product links
Official SleepySource and SleepyChat release/download links can be connected as they are published.

## Public site sections

- Home / product overview
- SleepySource product page
- SleepyChat product page
- Verified Downloads
- Changelogs
- Support
- GitHub / official project links
- Privacy

The experimental Platforms page is not part of the current public-site direction.
