# DESIGN.md

arrivals — Design System

## 1. Visual Theme & Atmosphere

Dark purple glassmorphism landing page generator. Each app gets a landing page with the same visual DNA — deep purple gradients, frosted glass panels, magenta/pink accent glows, and smooth scroll-triggered fade-ins. The design is premium and polished: a showcase for llll-ll.com products. Theme colors are overridable per app via `meta.json`.

Inspirations: modern SaaS landing pages, Apple product pages, dark gradient portfolios.

## 2. Color Palette & Roles

CSS custom properties. Theme overridable via `meta.json`.

### Default Theme

| Variable    | Hex       | Usage                          |
| ----------- | --------- | ------------------------------ |
| `--bg`      | `#1a0a2e` | Page background                |
| `--fg`      | `#ffffff` | Text foreground                |
| `--accent`  | `#e879f9` | Accent, links, gradient text   |
| `--muted`   | `#c4b5fd` | Secondary text                 |

### Gradient System

| Variable                | Value                                                        | Usage              |
| ----------------------- | ------------------------------------------------------------ | ------------------ |
| `--gradient-purple`     | `linear-gradient(135deg, #a855f7, #ec4899)`                  | CTA buttons        |
| `--gradient-purple-dark` | `linear-gradient(135deg, #7c3aed, #a855f7)`                 | Feature icons      |
| `--gradient-text`       | `linear-gradient(135deg, #e879f9, #ec4899)`                  | Gradient text fill |
| `--glass-bg`            | `linear-gradient(135deg, rgba(139,92,246,0.15), rgba(168,85,247,0.08))` | Glass panels |
| `--glass-bg-strong`     | `linear-gradient(135deg, rgba(139,92,246,0.2), rgba(168,85,247,0.1))`   | Strong glass |

### Backgrounds

- Page gradient: `#2d1b4e` → `#1a0a2e` → `#0f051a`
- Card bg: `rgba(255,255,255,0.08)`
- Card border: `rgba(255,255,255,0.12)`
- White overlays: `/10`, `/15`, `/50`, `/70`

## 3. Typography Rules

### Font Family

```
system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans JP",
"Hiragino Kaku Gothic ProN", Meiryo, sans-serif
```

### Type Scale (Fluid with clamp)

| Element      | Size                            | Weight | Notes                |
| ------------ | ------------------------------- | ------ | -------------------- |
| H1           | `clamp(2.5rem, 7vw, 4rem)`     | 700    | Tracking -0.03em     |
| H2           | `clamp(1.25rem, 3vw, 1.75rem)` | 600    |                      |
| H3           | `1.25rem`                       | 600    |                      |
| Body/tagline | `clamp(1rem, 2vw, 1.25rem)`    | 400    | Line-height 1.6-1.8  |
| Feature text | `0.95rem`                       | 400    | Line-height 1.6      |
| Footer credit | `0.8rem`                       | 400    | Uppercase, tracking 0.08em |

### Gradient Text

`background-clip: text` with `-webkit-text-fill-color: transparent` for accent gradient headings.

## 4. Component Stylings

### CTA Button — Primary

```css
padding: 16px 32px;
background: var(--gradient-purple);
color: #fff;
font-size: 1.1rem; font-weight: 600;
border-radius: var(--radius-md); /* 12px */
box-shadow: var(--shadow-purple); /* 0 4px 24px rgba(168,85,247,0.4) */
hover: translateY(-3px), shadow-purple-lg;
active: translateY(0);
```

### CTA Button — Secondary

```css
background: rgba(255,255,255,0.1);
border: 1px solid rgba(255,255,255,0.2);
hover: translateY(-2px), bg rgba(255,255,255,0.12);
```

### Feature Cards

```css
background: var(--glass-bg-strong);
border: 1px solid rgba(255,255,255,0.1);
border-radius: var(--radius-xl); /* 20px */
padding: 28px;
backdrop-filter: blur(10px);
hover: translateY(-4px);
```

Feature icons: `48x48px`, colored gradient backgrounds (purple, yellow, cyan).

### Voice/Testimonial Cards

```css
background: var(--glass-bg);
border: 1px solid rgba(255,255,255,0.1);
border-radius: var(--radius-xl);
padding: 28px;
backdrop-filter: blur(10px);
```

### Gallery Images

```css
border-radius: var(--radius-md);
aspect-ratio: 16/10;
box-shadow: var(--shadow-sm);
hover: scale(1.02);
```

### Image Carousel

- Max-width: `900px`
- Shadow: double layer (black + purple glow)
- Track: flex, `transition: transform 0.5s ease-in-out`
- Dots: `10px` circles, active `scale(1.2)` + white

### Language Switcher

- Pill shape: `rounded-full`
- Default: `rgba(255,255,255,0.1)` + border
- Active/hover: `var(--gradient-purple)`

### Header

- Fixed, `rgba(26,10,46,0.8)` + `backdrop-filter: blur(12px)`
- Border-bottom: `rgba(255,255,255,0.08)`
- Z-index: `50`

## 5. Layout Principles

### Container

- Max width: `1200px`
- Padding: `24px` horizontal
- Section padding: `clamp(100px, 12vw, 160px)` top

### Grid

- Features: `repeat(auto-fit, minmax(280px, 1fr))`
- Feature items: alternating left-right layout (RTL for even)
- Gallery: auto-fit with `280px` minimum

### Hero

- Center-aligned, max-width constraints per element
- Icon: `72x72px`
- H1 max: `800px`, tagline max: `650px`, desc max: `700px`

### Border Radius

| Token         | Value  |
| ------------- | ------ |
| `--radius-sm` | `8px`  |
| `--radius-md` | `12px` |
| `--radius-lg` | `16px` |
| `--radius-xl` | `20px` |
| `--radius-full` | `9999px` |

## 6. Depth & Elevation

### Shadows

| Token              | Value                                          |
| ------------------ | ---------------------------------------------- |
| `--shadow-sm`      | `0 4px 24px rgba(0,0,0,0.4)`                  |
| `--shadow-md`      | `0 8px 32px rgba(0,0,0,0.5)`                  |
| `--shadow-lg`      | `0 16px 64px rgba(0,0,0,0.6)`                 |
| `--shadow-purple`  | `0 4px 24px rgba(168,85,247,0.4)`              |
| `--shadow-purple-lg` | `0 8px 40px rgba(168,85,247,0.6)`            |
| `--shadow-hero`    | `0 16px 64px rgba(0,0,0,0.6), 0 0 80px rgba(168,85,247,0.15)` |

### Glassmorphism

- `backdrop-filter: blur(10px)` on cards
- `backdrop-filter: blur(12px)` on header
- Semi-transparent gradient backgrounds

### Z-Index

- Header: `50`

## 7. Do's and Don'ts

### Do

- Use glassmorphism (`backdrop-filter: blur` + semi-transparent gradient bg) on all cards
- Apply purple-to-pink gradients for CTAs and accent text
- Use `clamp()` for fluid typography — no fixed breakpoint font changes
- Support `prefers-reduced-motion` by disabling all animations
- Use IntersectionObserver for scroll-triggered fade-ins
- Allow per-app theme override via `meta.json` (bg, fg, accent, muted)
- Include print styles (white bg, black text, show link hrefs)

### Don't

- Use flat solid-color buttons — always gradient or glass
- Apply border-radius below `8px` — this is a premium, rounded design
- Add non-purple/pink accent colors to the default theme
- Remove the gradient text effect on headings
- Break the `1200px` max-width container

### Transitions

| Token                | Duration | Timing        |
| -------------------- | -------- | ------------- |
| `--transition-fast`  | 0.2s     | ease          |
| `--transition-normal` | 0.3s    | ease          |
| `--transition-slow`  | 0.5s     | ease-in-out   |
| Fade-in animation    | 0.6s     | ease          |
| Carousel slide       | 0.5s     | ease-in-out   |

## 8. Responsive Behavior

### Breakpoints

| Name    | Value  | Changes                              |
| ------- | ------ | ------------------------------------ |
| Mobile  | 600px  | Header nav compact, logo text hidden |
| Tablet  | 768px  | Feature grid 2→1 col, text centered  |

`clamp()` handles most responsive scaling without breakpoints.

### Mobile

- Single-column layouts
- Full-width cards
- Smaller header nav with `0.85rem` font
- Gallery: single column

## 9. Agent Prompt Guide

### Theme Variable Reference

```
Default theme (overridable per app):
--bg:     #1a0a2e  (dark purple)
--fg:     #ffffff  (white)
--accent: #e879f9  (magenta)
--muted:  #c4b5fd  (light purple)

Gradients:
Purple→Pink:  #a855f7 → #ec4899
Dark purple:  #7c3aed → #a855f7
Glass:        rgba(139,92,246,0.15) → rgba(168,85,247,0.08)
```

### When generating UI for this project

- Astro static site generator. No JS framework, vanilla JS for interactions
- Glassmorphism cards: semi-transparent gradient bg + `blur(10px)` + white/10 border
- Purple-to-pink gradient for all CTAs and accent text
- `clamp()` for all responsive typography
- IntersectionObserver fade-in animation (0.6s, translateY 20px)
- 4 theme colors overridable via `meta.json` per app
- Each landing page shares the same component library
- System font stack with Japanese fallbacks
- Print stylesheet included
- `prefers-reduced-motion` fully supported
- View Transitions API (Astro ClientRouter) for page navigation

### Color Emotion Reference

- **Deep purple (#1a0a2e):** Premium, depth, sophistication
- **Magenta (#e879f9):** Creativity, highlight, brand accent
- **Pink (#ec4899):** Energy, warmth, call to action
- **Light purple (#c4b5fd):** Secondary information, calm
