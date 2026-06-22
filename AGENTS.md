# AGENTS.md

## Project type

Static portfolio site — vanilla HTML/CSS/JS. No framework, no build step, no package manager, no dependencies.

## Structure

- `index.html` — single-page app with all sections
- `css/themes.css` — CSS custom properties (dark/light theme tokens)
- `css/style.css` — all component and layout styles
- `js/main.js` — theme toggle, mobile nav, scroll effects, hero animation, Matrix canvas, contact form, smooth scroll
- `js/animations.js` — IntersectionObserver scroll-reveal system
- `assets/images/` — empty (no images used; all visuals are CSS gradients, inline SVGs, canvas)

## Commands

None. Open `index.html` in a browser to preview. No linting, formatting, or testing configured.

## CSS conventions

- **Utilities**: `u-` prefix (e.g., `u-container`, `u-section`, `u-theme-dark`)
- **Section themes**: applied via class on `<section>` — `u-theme-dark`, `u-theme-dark-alt`, `u-theme-light`
- **Component naming**: BEM-like (e.g., `.skill-card`, `.skill-card-featured`, `.project-card-visual`)
- **Responsive sizing**: `clamp()` used throughout for fluid typography/spacing
- **Custom easing**: `--ease-out: cubic-bezier(0.165, 0.84, 0.44, 1)`, `--ease-in-out: cubic-bezier(0.645, 0.045, 0.355, 1)`

## Theme system

- Controlled by `data-theme` attribute on `<html>` (`dark` or `light`)
- Persisted via `localStorage` key `'theme'`
- Defaults to dark mode
- Theme tokens defined in `css/themes.css`; section overrides in `css/style.css`

## Scroll reveal

- Trigger classes: `data-scroll`, `reveal-up`, `reveal-left`, `reveal-right`, `reveal-fade`
- Adds `is-visible` class when element enters viewport
- Each element observed once (unobserved after trigger)

## Gotchas

- Contact form is a **stub**: `formspree.io/f/YOUR_FORM_ID` placeholder — shows fake success message after 3s, does not actually submit
- All project/blog links point to external GitHub repos and Medium articles — no local content
- Two separate `DOMContentLoaded` listeners (one in `main.js`, one in `animations.js`) — not bundled
