# Quick Start Guide - Crisis Catalog

## Overview

Crisis Catalog is now ready to use! It's a static website for emergency preparedness with three comprehensive checklists for Catholic families.

## What's Included

✅ **Three Checklists**
- Home Emergency Kit (shelter-in-place supplies)
- Go-Bag (72-hour evacuation kit)
- Car Emergency Kit (roadside supplies)

✅ **70+ Items** across categories:
- Water & Hydration
- Food & Nutrition
- Medications & First Aid
- Documents & Financial
- Tools & Equipment
- Spiritual Items

✅ **User-Friendly Features**
- Local storage persistence (no cloud tracking)
- Detailed recommendations for each item
- Direct purchase links to Amazon and retailers
- Cost tracking (per-item and per-checklist)
- Responsive design (desktop, tablet, mobile)
- Offline support via service worker

✅ **Catholic Theme**
- St. Michael Archangel iconography background
- Spiritual preparedness integration
- Neutral US military-tone recommendations

## Running the Site

### Development (Local Testing)
```bash
npm run dev
```
Open http://localhost:4321 in your browser

### Production Build
```bash
npm run build
```
Output goes to the `dist/` folder

### Preview Production Build Locally
```bash
npm run preview
```

## Editing Checklists

All checklists are in Markdown files in `src/content/checklists/`:

- `home.md` - Home emergency kit
- `gobag.md` - Go-bag (72-hour evacuation)
- `car.md` - Car emergency kit

### To Add a New Item

Edit one of the checklist files and add:

```yaml
- id: unique-id
  label: Item Name
  category: water|food|meds|docs|tools|spiritual
  priority: high|med|low
  estimatedCost: 25.00
  recommendation: Your guidance text
  purchaseUrl: https://www.amazon.com/example
  notes: Optional notes
```

Save and the dev server will hot-reload!

## Deployment to Cloudflare Pages

1. Push code to GitHub repository
2. In Cloudflare Pages:
   - Create new project from Git
   - Select your repository
   - Build command: `npm run build`
   - Build output: `dist`
   - Deploy!

The site is static and requires zero backend infrastructure.

## Key Features Explained

### Checklist Persistence

Your selections are saved locally in the browser. When you check items, they're stored in `localStorage` and persist across sessions.

When you rebuild the site with new content, the content version automatically updates and clears old selections (fresh start).

### Interactive Details

Click the 📋 icon next to any item to view:
- Full recommendation
- Category and priority
- Estimated cost
- Notes
- Direct purchase link (opens in new tab)

### Cost Tracking

At the top of each checklist:
- **Progress**: How many items you've checked
- **Estimated Cost**: Total cost of checked items vs. total possible cost

### Responsive Design

The site works perfectly on:
- Desktop computers
- Tablets
- Mobile phones

Try resizing your browser to see it adapt!

## Customization Options

### Change Colors

Edit `src/styles/global.css` and modify CSS variables:
```css
:root {
  --color-primary: #1c3a4a;      /* Main color (deep blue) */
  --color-accent: #c62828;       /* Accent color (red) */
  --bg-opacity: 0.15;            /* St. Michael background opacity */
}
```

### Change St. Michael Background

The background SVG is embedded in `src/styles/global.css`. You can:
- Modify the SVG path to change the silhouette
- Adjust colors in the gradient
- Change `--bg-opacity` to make it more/less visible

### Dark Mode

Dark mode is automatically enabled based on user's OS preference. Styles are in `src/styles/global.css` under `@media (prefers-color-scheme: dark)`

## File Structure

```
crisis-catalog/
├── src/
│   ├── content/
│   │   ├── checklists/
│   │   │   ├── home.md
│   │   │   ├── gobag.md
│   │   │   └── car.md
│   │   └── config.ts
│   ├── components/
│   │   └── ChecklistWidget.tsx
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   └── index.astro
│   ├── styles/
│   │   ├── global.css
│   │   └── checklist.css
│   └── data/
│       └── generate-data.ts
├── public/
│   └── sw.js
├── dist/                    # Built site (run: npm run build)
├── package.json
└── README.md
```

## Troubleshooting

**"Items not showing"**
- Check that Markdown files have proper YAML frontmatter wrapped in `---`
- Verify category and priority values match the schema

**"Checkmarks not saving"**
- Check browser DevTools → Application → Local Storage
- Look for keys like `checklist:v1:{version}`
- Verify JavaScript is enabled

**"Build fails"**
- Run `npm run build` to see full error
- Common issue: Missing `---` closing delimiter in Markdown files
- Check YAML indentation (use spaces, not tabs)

**"Service worker issues"**
- Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
- Check DevTools → Application → Service Workers
- Service worker is only active in production builds

## Next Steps

1. **Test locally**: `npm run dev`
2. **Customize content**: Edit the Markdown files
3. **Build for production**: `npm run build`
4. **Deploy**: Push to GitHub and connect Cloudflare Pages
5. **Share**: Give your family the URL!

## Need Help?

- Review the full README.md for detailed documentation
- Check `.github/copilot-instructions.md` for development notes
- Astro docs: https://docs.astro.build
- See the inline code comments for implementation details

---

**Privacy Note**: All data stays on your device. No analytics, no cloud storage, no tracking. Just you and your emergency preparedness!

God bless your family's safety and readiness. 🙏✟
