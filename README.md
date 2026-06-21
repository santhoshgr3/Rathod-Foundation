# Rathod Foundation — Dhanraj Rathod

A modern **multi-page** civic-leader website for **R. Dhanraj Rathod**, presenting
his work across **Banjara Hills, Hyderabad** as a problem-solver — with before/after
cases, a locality-impact section, an interactive map, and a working issue-report
form that issues live tracking numbers.

Built with **React + TypeScript + Vite + React Router + Tailwind CSS v4 + Framer
Motion** (no plain HTML — a real modern front-end stack).

### Design system — Indian-flag 50 / 30 / 20

- **50% white** — every page background is pure white (`#ffffff`)
- **30% saffron** (`#FF9933`) — primary accent: hero, buttons, page-header bands,
  ticker strip, active states
- **20% green** (`#138808`) — secondary accent: icons, checks, "Banjara Hills"
  highlights, map markers

All colors are CSS variables in `src/index.css` (`@theme` block) — change the brand
in one place. A tricolor rule (saffron/white/green) runs under the nav and footer.

## Run it

```bash
npm install      # first time only
npm run dev      # start local dev server  → http://localhost:5173
npm run build    # production build into /dist
npm run preview  # preview the production build
```

## Pages (React Router)

| Route        | Page          | What's on it |
|--------------|---------------|--------------|
| `/`          | Home          | Hero, **Vision**, "what we help with", live dashboard teaser, CTAs |
| `/seek-help` | **Seek help** | 8 categories (medical, education, schemes, pension, ration, electricity/water, emergency, senior) → form → **tracking number** + verification preview |
| `/track`     | **Track**     | Enter a tracking number → the **5-stage verification timeline** with current stage |
| `/dashboard` | **Dashboard** | Live cases received / verified / resolved, volunteers, wards, category breakdown, recent activity |
| `/volunteer` | **Get involved** | Become a volunteer, suggest a community issue, join campaigns |
| `/about`     | About         | Bio, timeline of service, values, photo with leadership |
| `/work`      | Work done     | Six **before/after** cases with a drag slider, dated & located |
| `/impact`    | Impact & map  | Locality **bars that fill on scroll** + interactive **Banjara Hills map** |
| `/process`   | How it works  | The **7-step Volunteer Verification workflow** + 4-step summary + contacts |
| `/report`    | Report        | Civic-issue form → **live tracking number** + lookup |

### Platform features (the social-work system)

- **Seek Help** — citizens submit a need in any of 8 categories and get a tracking number.
- **Volunteer Verification workflow** — received → volunteer assigned → field verified →
  under review → resolved (or *guided to a government office*). Shown on `/track`.
- **Interactive dashboard** (`/dashboard`) — every number is computed live from the store.
- **Emergency button** — floating red button on every page → call / WhatsApp / seek help.
- **WhatsApp integration** — every form and the emergency modal deep-link to `wa.me`.
- **Trilingual** — English / తెలుగు / हिन्दी switcher in the nav; the help flows, nav,
  dashboard labels, tracking stages and emergency modal are all translated. (Long-form
  story pages — bio, case write-ups — stay in English.)

### Data layer — `src/lib/store.ts`

All submissions persist to **localStorage** so the whole platform works with no backend.
The types (`Case`, `Volunteer`, `Suggestion`) map 1:1 to database tables — to go live,
replace the `read`/`write` helpers with **Supabase** calls. Seed cases make the dashboard
and map look populated on first visit. Translations live in `src/lib/i18n.tsx`; help
categories in `src/data/help.ts`.

Every inner page opens with a saffron page-header band; the nav highlights the
active page and collapses to a menu on mobile.

> **Hosting note (important for routing):** this is a single-page app with client-side
> routes, so the host must serve `index.html` for unknown paths. A `public/_redirects`
> (`/* /index.html 200`) is included for **Netlify**. On **Vercel** add a rewrite to
> `/index.html`; on Apache use `.htaccess`; on GitHub Pages use a `404.html` copy of
> `index.html`. Without this, refreshing `/about` would 404.

## Editing content — one file

Almost everything is in **`src/data/content.ts`**:

- `leader` — name, role, **phone numbers, WhatsApp, email, address** (update these!)
- `cases` — the six before/after cases (title, date, location, days, summary)
- `wards` — locality names + resolved-issue counts (drives bars **and** map)
- `stats`, `promises`, `steps`, `categories` — supporting copy

Anything marked `// TODO` is a realistic placeholder — replace with verified info.

### Adding the real before/after photos

1. Drop image files into `public/img/before-after/`
2. In `content.ts`, each case has `before` / `after` fields, e.g.
   `before: "before-after/drain-before.jpg"`. Set them to your filenames.
3. Until a photo exists, a styled "Before / After" placeholder is shown
   automatically — the layout never looks broken.

### Map locations

Marker positions live in `src/components/BanjaraMap.tsx` (`points` object).
Tweak the `x`/`y` of any locality to reposition it on the schematic map.

## Notes

- The report form stores tickets in the browser's `localStorage` so the tracking
  lookup works with no backend. To make submissions reach you for real, wire the
  `submit()` handler in `src/components/ReportForm.tsx` to an email/WhatsApp/API
  endpoint (e.g. Supabase, Formspree, or a Google Form). The "Send on WhatsApp too"
  button already forwards the full report to your WhatsApp.
- All colors come from CSS variables in `src/index.css` (`@theme` block) — change
  the brand palette in one place.
- Photos used: `public/img/` (sourced from the supplied images).
