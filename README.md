# Crisis Catalog: Catholic Family Emergency Preparedness

A static website for emergency preparedness checklists designed specifically for Catholic families. Built with Astro, this site helps you organize essential supplies across multiple scenarios: your home, a portable go-bag for evacuation, and your vehicle.

## Features

- **Three Comprehensive Checklists**: Home (shelter-in-place), Go-Bag (72-hour evacuation kit), and Car (roadside emergency supplies)
- **Editable Content**: Author checklists in Markdown with structured frontmatter
- **Local-Only Persistence**: User selections are saved in browser localStorage—no cloud storage or tracking
- **Detailed Item Information**: Each item includes priority level (high/med/low), estimated cost, neutral US military-tone recommendations, and direct purchase links
- **Interactive Modal**: Click any item to view full recommendations and purchase links opening in new tabs
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Offline Support**: Service worker enables offline reading of cached content
- **Catholic Theme**: Subtle St. Michael iconography background with minimal foreground design
- **Accessibility**: WCAG 2.1 compliant with proper focus management, ARIA labels, and keyboard navigation

## Project Structure

```
src/
├── content/
│   ├── checklists/        # Markdown content files
│   │   ├── home.md
│   │   ├── gobag.md
│   │   └── car.md
│   ├── config.ts          # Content collection schema
├── components/
│   └── ChecklistWidget.tsx # Interactive checklist (Preact island)
├── layouts/
│   └── Layout.astro       # Main layout with header and footer
├── pages/
│   └── index.astro        # Home page with intro and checklist widget
├── styles/
│   ├── global.css         # Global styles and St. Michael background
│   └── checklist.css      # Checklist widget styles
├── data/
│   └── generate-data.ts   # Build-time data generation and versioning
└── public/
    └── sw.js              # Service worker for offline support
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository or open the workspace
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the local dev server:

```bash
npm run dev
```

The site will be available at `http://localhost:4321`. Changes to Markdown files will hot-reload.

### Building for Production

Build the static site for Cloudflare Pages (or any static host):

```bash
npm run build
```

The output will be in the `dist/` directory, ready to deploy.

## Editing Checklists

### Adding or Modifying Items

Edit the Markdown files in `src/content/checklists/` (home.md, gobag.md, car.md). Each item follows this structure:

```yaml
- id: unique-item-id
  label: Human-readable item name
  category: water | food | meds | docs | tools | spiritual
  priority: high | med | low
  estimatedCost: 25.00
  recommendation: Neutral US military-tone guidance on selection and usage
  purchaseUrl: https://www.amazon.com/example
  notes: Optional field for additional context
```

### Categories

- **water**: Water storage, purification, electrolytes
- **food**: Non-perishable meals, comfort foods
- **meds**: Prescription, OTC, and first aid supplies
- **docs**: Legal documents, financial records, ID copies
- **tools**: Shelter, clothing, light, tools, communication
- **spiritual**: Sacramentals, prayer books, religious items

### Priority Levels

- **high**: Essential for immediate survival or critical care
- **med**: Important for extended survival or quality of life
- **low**: Beneficial but not critical

## Content Versioning

The site automatically generates a content version hash when you rebuild. This hash is used to:

1. Invalidate stale user selections when content changes
2. Clear old cached data in localStorage
3. Trigger service worker cache updates

No manual version management is required—the hash is generated from the checksum of all item data.

## Local Storage

User checklist selections are stored in localStorage under keys like:
```
checklist:v1:{contentVersion}
```

When you rebuild the site with content changes (new items or modified IDs), the version changes and old selections are automatically cleared.

## Deployment to Cloudflare Pages

1. Push your repository to GitHub
2. In Cloudflare Pages, create a new project from your Git repository
3. Set the build command to `npm run build`
4. Set the build output directory to `dist`
5. Deploy!

The site will be served as a static site with excellent performance.

## Customization

### Styling

- **Background**: Modify the St. Michael silhouette SVG and gradient in `src/styles/global.css`
- **Colors**: Adjust CSS variables in `src/styles/global.css` (--color-primary, etc.)
- **Dark Mode**: Dark mode styles are included via `prefers-color-scheme` media query

### Service Worker

The service worker (`public/sw.js`) caches static assets and JSON files using stale-while-revalidate strategy. HTML is not cached to prevent stale pages.

## Accessibility

- All interactive elements are keyboard accessible
- Focus management in modal dialogs with focus trap
- ARIA labels and roles throughout
- Color contrast meets WCAG 2.1 AA standards
- Reduced motion support
- Screen reader friendly

## Privacy

This is a static site with zero backend. All user data stays on their device:

- No server-side analytics
- No cloud storage of selections
- No third-party tracking (except potential links to external retailers)
- Data persists only in browser localStorage

## Technologies

- **Astro**: Static site generation
- **Preact**: Lightweight interactive components
- **TypeScript**: Type-safe development
- **CSS**: Responsive design with custom properties
- **Service Workers**: Offline support

## License

This project is provided as-is for personal use. Feel free to customize and deploy for your family or community.

## Contributing

To add items, improve recommendations, or fix issues:

1. Edit the relevant Markdown checklist file
2. Test locally with `npm run dev`
3. Build and preview with `npm run build`
4. Deploy to Cloudflare Pages

## Support

For questions or issues with the site, review the Astro documentation: https://docs.astro.build
