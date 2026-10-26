# Marci Metzger Homes - Homepage Redesign

Single-page website (one `index.html`). Every menu link scrolls to a section on the same page.
The only link that leaves the page is "Search Now", which opens the original site's listings in a new tab,
because a real property search needs a listings database. Plain HTML5 + CSS3 + vanilla JavaScript (no frameworks, no build step).

```
marci-metzger-homes/
├── index.html
├── css/style.css
├── js/main.js
├── assets/images/
└── README.md
```

## Run it
Open `index.html` in a browser, or run `python3 -m http.server 8000` in this folder and visit http://localhost:8000.
(Only the live Google map needs an internet connection.)

## Where each image is used
| File in `assets/images/` | Used in |
|---|---|
| `hero-pond-mountains.webp` | Hero (full-screen background) |
| `marci-portrait.webp` | Agent section |
| `aerial-home-pool.webp` | "GET IT SOLD" section |
| `house-key.webp` | "Don't Just List it... Get it SOLD!" band |
| `living-room-red-chair.webp` | "Guide to Buyers" |
| `aerial-community-lake.webp` | "Find Your Dream Home" background (CSS) |
| `aerial-home-mountains.webp`, `kitchen.webp`, `patio-pool.webp`, `aerial-clubhouse-tennis.webp`, `aerial-tennis-courts.webp` | Photo Gallery (first one is the large featured photo) |
| `service-home-interior.webp` / `service-modern-home.webp` / `service-handshake.webp` | Real Estate Done Right / Commercial & Residential / Rely on Expertise |
| `logo-marci-metzger-homes.webp`, `logo-ridge-realty-group.webp`, `logo-realtor.webp`, `logo-equal-housing.webp`, `logo-pahrump-chamber.webp` | Logo strip above the footer |
| `map-highway-160.png` | Not used (the page uses a live Google map instead) |

The two large PNG photos were converted to WebP, and the hero was resized to 1920px wide, to keep the page fast.

## Colour palette (set in `:root` at the top of `style.css`)
Black and white only: near-black `#111111`, pure black `#000000`, white `#ffffff`, light grey `#f5f5f5`,
and mid grey `#555555` for secondary text. Photos and the brand logos stay in full colour.
The only non-grey colour is the red used for form error messages.
Font: Poppins (weights 400, 500, 600 + 600 italic), self-hosted in `assets/fonts/` and declared with
`@font-face` at the top of `style.css`, so the site does not depend on Google Fonts. Licence: `OFL-LICENSE.txt`.

## Making the form send email
The contact form validates the email but has no server. Easiest fix: create a free form at formspree.io,
then add `action="https://formspree.io/f/YOUR_ID" method="post"` to `#contact-form` and remove the
`e.preventDefault()` / success-message block in `js/main.js` (section 5).

## Deployment
- **Netlify / Vercel:** drag the folder onto the dashboard. Done.
- **GitHub Pages:** push to a repo, Settings > Pages > deploy from `main` / root.

## Responsive checklist (320 / 375 / 430 / 768 / 1024 / 1280 / 1440 / 1920 px)
- [x] No horizontal scroll at any width (tested 320 / 375 / 430 / 768)
- [x] Hamburger opens, closes (button, link click, Escape); page doesn't scroll behind it
- [ ] Hero text and buttons fit; Call Now visible without scrolling
- [ ] Search fields: 1 column (mobile), 2 (tablet), 4 (desktop); nothing overflows
- [ ] Gallery crops cleanly, no stretched images; lightbox arrows and Escape work
- [ ] Phone numbers tap-to-call on a real phone
- [ ] Map and form usable on mobile

## Accessibility checklist
- [x] Semantic landmarks, one `h1`, ordered headings (skip link removed by request)
- [x] Every input has a visible `<label>`; email error uses `role="alert"`
- [x] Visible focus ring on all controls
- [x] Descriptive alt text on images; icon-only buttons have `aria-label`
- [x] 48px touch targets, 16px body text, `prefers-reduced-motion` respected
- [x] Button contrast: black on white and white on black (21:1); grey text `#555` on white = 7.5:1
- [ ] Still to do: run Lighthouse and keyboard-tab through the page
