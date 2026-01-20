# Crisis Catalog - Development Guide

## Project Overview

Crisis Catalog is a static Astro website for Catholic family emergency preparedness checklists. The site features three comprehensive checklists (home, go-bag, car kit) with local-only persistence, interactive modals, and a St. Michael-inspired design.

## Key Technologies

- **Astro**: Static site generation framework
- **Preact**: Lightweight interactive UI components
- **TypeScript**: Type-safe development
- **Markdown**: Content authoring with YAML frontmatter
- **Service Workers**: Offline support

## Project Structure

```
src/
├── content/config.ts          # Content collection schema and validation
├── content/checklists/        # Markdown content files (home.md, gobag.md, car.md)
├── components/
│   └── ChecklistWidget.tsx    # Main interactive checklist island (Preact)
├── data/generate-data.ts      # Build-time content versioning and export
├── layouts/Layout.astro       # Main HTML layout with St. Michael background
├── pages/index.astro          # Home page with intro cards and widget
├── styles/
│   ├── global.css             # Global styles, St. Michael SVG background
│   └── checklist.css          # Checklist widget styles and accessibility
public/
└── sw.js                       # Service worker for offline caching
```

## Development Workflow

### Local Development
```bash
npm install                     # Install dependencies
npm run dev                    # Start dev server at localhost:4321
npm run build                  # Build for production
npm run preview                # Preview production build locally
```

### Editing Content

1. **Add/Edit Items**: Modify Markdown files in `src/content/checklists/`
2. **Update Schema**: Edit `src/content/config.ts` for new item properties
3. **Modify UI**: Edit `src/components/ChecklistWidget.tsx` for UI changes
4. **Styling**: Update `src/styles/checklist.css` or `src/styles/global.css`

### Content Schema

Each checklist item requires:
```yaml
- id: unique-identifier
  label: Display name
  category: water|food|meds|docs|tools|spiritual
  priority: high|med|low
  estimatedCost: number (0 or positive)
  recommendation: Neutral US military-tone guidance
  purchaseUrl: https://valid-url.com
  notes: Optional additional context
```

## Content Versioning

- Content version is auto-generated as a SHA-256 hash at build time
- Hash is computed from serialized item data (ids, titles, timestamps)
- Used to invalidate localStorage and service worker cache
- No manual versioning required—automatic on rebuild

## localStorage Keys

User selections stored as:
```
checklist:v1:{contentVersion}
```

Format: `{ [itemId]: boolean, ... }`

When content version changes, old data is automatically cleared.

## Service Worker

- Located at `public/sw.js`
- Implements stale-while-revalidate caching for JSON, CSS, JS, fonts, images
- Does NOT cache HTML to prevent outdated pages
- Auto-registers in production mode
- Falls back gracefully if registration fails

## Accessibility Features

- Keyboard-navigable (Tab, Enter, Escape)
- Focus trapping in modals
- ARIA labels and roles throughout
- Color contrast WCAG 2.1 AA compliant
- Reduced motion support
- Screen reader compatible

## Styling Architecture

### CSS Variables (src/styles/global.css)
```css
--color-primary: #1c3a4a          /* Deep blue-gray */
--color-accent: #c62828           /* Red for alerts */
--color-bg: #f5f7fa              /* Light background */
--bg-opacity: 0.15                /* St. Michael silhouette opacity */
```

### St. Michael Background
- Inline SVG silhouette as background image (data URI)
- Deep blue-gray gradient overlay
- Subtle noise pattern for texture
- Opacity and visibility controlled via CSS variables
- Accessible fallback for reduced-transparency preference

## Deployment

### To Cloudflare Pages
1. Push to GitHub
2. Create Cloudflare Pages project from Git
3. Build command: `npm run build`
4. Build output: `dist`
5. Auto-deploys on push

### Build Output
- All assets optimized and minified
- Service worker copied to dist/
- Static HTML generated from Astro pages
- Content versioning embedded in HTML

## Common Tasks

### Add a new checklist
1. Create `src/content/checklists/newname.md`
2. Follow schema in `src/content/config.ts`
3. Ensure frontmatter enclosed in `---` delimiters
4. `npm run dev` to test
5. `npm run build` to generate version hash

### Update item recommendations
1. Edit relevant item in `src/content/checklists/*.md`
2. Changes appear immediately in dev mode
3. Build updates content version (users' localStorage auto-clears)

### Modify styling
1. Edit `src/styles/global.css` for layout/colors/background
2. Edit `src/styles/checklist.css` for widget styles
3. Both support dark mode via `@media (prefers-color-scheme: dark)`

### Change St. Michael SVG
- Edit inline SVG in `src/styles/global.css` (body background-image)
- Data URI format: `url('data:image/svg+xml;utf8,...')`
- Adjust opacity via `--bg-opacity` CSS variable

## Testing

- **Dev Server**: `npm run dev` with hot reload
- **Production Build**: `npm run build` → `npm run preview`
- **Browser DevTools**: Check localStorage, service worker registration, console
- **Lighthouse**: Check performance, accessibility, best practices

## Troubleshooting

**Checklist items not loading**: Verify Markdown frontmatter syntax (YAML indentation, closing `---`)

**localStorage not persisting**: Check browser privacy settings, quota, dev tools Application tab

**Service worker not updating**: Hard refresh (Ctrl+Shift+R), check DevTools Application → Service Workers

**Build errors**: Run `npm run build` to see full error stack, check content schema validation

## Design Principles

1. **Privacy-First**: All data stays local; no backend or analytics
2. **Accessibility**: Keyboard navigation, focus management, WCAG 2.1 AA
3. **Performance**: Static export, minimal JavaScript, aggressive caching
4. **Maintainability**: Markdown content, TypeScript, clear component structure
5. **Catholic Integration**: St. Michael theme, spiritual item category, neutral US military tone

## Dependencies

- `astro@5.x` – Static site framework
- `@astrojs/preact` – Preact integration
- `preact` – UI library
- `zod` – Schema validation
- `typescript` – Type checking

See `package.json` for full list and versions.

## Future Enhancements

- PDF export of checklists
- Shareable checklist templates
- Multi-user support (if cloud sync added)
- Item filtering by priority/category
- Estimated timeline to completion
- Integration with shopping cart APIs
