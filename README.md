# Verdance Solutions — Website

Static marketing website for Verdance Solutions. Built with vanilla HTML, CSS, and JavaScript. Deployed via GitHub Pages.

Live at [verdancesolutions.net](https://verdancesolutions.net).

## Stack

- **Frontend:** Static HTML / CSS / JavaScript (no build tools)
- **Hosting:** GitHub Pages
- **Backend:** [Verdance-Server](https://github.com/VerdanceSolutions/Verdance-Server) on Railway
- **CRM:** Zoho CRM via server-side webhook

## Structure

```
/
├── index.html       # Single-page site
├── main.js          # Form logic, validation, custom dropdowns, country suggestion panel
├── styles.css       # Design tokens, component styles, dark mode
└── assets/          # Logo images (PNG + WebP)
```

## Features

- Fully responsive, mobile-first layout
- Light / dark mode (system preference + manual toggle)
- Contact form with:
  - Inline field validation and top-of-form error banner
  - Blank-form guard
  - Custom `<details>`-based single-select dropdowns (Country, Volume)
  - Multi-select Products dropdown
  - Country "Other" option with a custom starts-with filtered suggestion panel
- Form submits to `https://verdance-server-production.up.railway.app/api/submit`

## Local Development

No build step required. Open `index.html` directly in a browser or use a local server:

```bash
npx serve .
# or
python3 -m http.server
```

Note: the contact form posts to the production Railway server. For local backend testing, run [Verdance-Server](https://github.com/VerdanceSolutions/Verdance-Server) locally with `NODE_ENV=development` and update the `fetch` URL in `main.js` temporarily.

## Deployment

Pushes to `main` deploy automatically via GitHub Pages.
