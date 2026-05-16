# Geometry Formulas Static Site

Static HTML, CSS, and JavaScript site for Cloudflare Pages.

## Build

```bash
npm run build
```

The build script writes one `index.html` per URL directory, plus `robots.txt`, `sitemap.xml`, `_redirects`, and a root redirect page.

Before production deployment, set the final domain when regenerating canonical URLs and the sitemap:

```bash
SITE_URL="https://your-domain.com" npm run build
```

## Local Preview

```bash
npm run serve
```

Then open `http://localhost:4173/`.

## Cloudflare Pages

Use these settings:

- Build command: `npm run build`
- Build output directory: `.`
- Node version: any current LTS version

The site has no framework dependency and no client-side rendering requirement for the main content.
