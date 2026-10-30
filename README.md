# Shiqi Ge — Portfolio

A static portfolio for Shiqi Ge, MA student in Digital Arts & Humanities. The
site collects essays, data visualisations, poster design, and digital
humanities projects.

## Structure

- `index.html` — homepage and selected work
- `projects.html` — project index
- `essays.html` — essay index
- `about.html` — profile
- `essay-*.html` — long-form essays
- `tracking-my-sleep.html` — personal sleep-data narrative
- `dead-poets-poster.html`, `turtle-fractals.html`, `dh-project.html` — project pages
- `action2026.html` — ACTION 2026 project site
- `shanghai-tiktok.html` — interactive Shanghai TikTok dashboard
- `assets/css/` — shared and dashboard-specific styles
- `assets/js/` — dashboard logic
- `assets/data/` — CSV data used by the dashboard
- `assets/img/` — optimised WebP images, favicon, and social share card

## Local preview

Run a static server from the repository root:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000/>.

## Images

Images are stored as WebP at approximately 2× their displayed size. When adding
new images:

1. Resize to the largest size the layout will display (usually 800–1600px wide).
2. Export as WebP at quality 82–90.
3. Add `width`, `height`, `loading="lazy"`, and `decoding="async"` attributes.
4. Keep file names lowercase and hyphenated.

## SEO and accessibility

Every public page includes a description, canonical URL, Open Graph/Twitter
metadata, and a consistent navigation block. The site also ships with
`robots.txt`, `sitemap.xml`, a custom `404.html`, and a focus-visible /
reduced-motion stylesheet baseline.

## Deployment

The site is published with GitHub Pages from the `main` branch. No build step is
required; committing the static files is enough.
