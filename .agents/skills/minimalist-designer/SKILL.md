---
name: minimalist-designer
description: Enforces minimalist design principles focusing on typography, intentional whitespace, restrained monochrome and accent color palettes, high contrast readability, content-first layout hierarchy, subtle micro-interactions, and distraction-free UI design. Trigger when building clean, minimalist, modern, elegant, content-focused web interfaces.
---

# Minimalist Designer Skill Guide

The **Minimalist Designer** skill provides guidelines and patterns for creating sleek, functional, content-first user interfaces that remove distraction, emphasize typography and whitespace, and deliver maximum visual clarity.

---

## 1. Core Philosophy

- **Purpose over Ornamentation**: Every visual element (border, color, spacing, shadow) must have a clear functional purpose. If it doesn't add clarity, remove it.
- **Content is King**: Typography, copy, and layout structure guide the user experience rather than decorative background elements.
- **Negative Space as a Feature**: Whitespace is an intentional layout tool used to isolate elements, create groupings, and establish rhythm.
- **Tactile & Restrained Interactivity**: Interactions should be snappy, subtle, and natural—never flashy or distracting.

---

## 2. Color System & Contrast

### Color Palette Guidelines
- **Monochrome Base**: Build layouts using neutral tones (whites, slates, deep blacks/charcoals).
- **Single Accent Color**: Limit accent colors to a single, high-contrast hue used strictly for primary calls-to-action (CTAs) or critical status indicators.
- **Hairline Dividers**: Use faint border colors (`border-neutral-200` in light mode, `border-neutral-800` in dark mode) instead of heavy shadows or thick dividers.

```css
/* Minimalist Color Tokens Example */
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f9f9fb;
  --text-primary: #0f172a;
  --text-secondary: #64748b;
  --text-muted: #94a3b8;
  --border-subtle: #e2e8f0;
  --accent-primary: #000000;
  --accent-contrast: #ffffff;
}

[data-theme="dark"] {
  --bg-primary: #09090b;
  --bg-secondary: #121215;
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
  --border-subtle: #27272a;
  --accent-primary: #ffffff;
  --accent-contrast: #000000;
}
```

---

## 3. Typography & Hierarchy

### Font Families
- Prefer clean, highly legible sans-serif typefaces: **Inter**, **Geist**, **SF Pro**, **Plus Jakarta Sans**, or **Outfit**.
- Use monospace for data, codes, or timestamps (e.g., **JetBrains Mono**, **Geist Mono**).

### Scale & Weight Rules
- Use no more than 3 font weights per view (e.g., Regular `400`, Medium `500`, Semi-Bold `600`).
- Maintain a generous line-height (`1.5` to `1.75` for body text) to aid scannability.
- Utilize uppercase tracking (`tracking-wider text-xs font-semibold uppercase`) for section labels and metadata.

---

## 4. Layout & Spacing Rules

- **Container Constraints**: Keep content containers tight and readable (e.g., `max-w-2xl` or `max-w-4xl` for text/dashboards).
- **Spacing Rhythms**: Use consistent multiplier steps (`gap-2`, `gap-4`, `gap-8`, `gap-12`, `gap-16`).
- **Card Styling**:
  - Prefer clean flat surfaces with subtle 1px borders over heavy drop shadows.
  - Border radius should be restrained (e.g., `rounded-lg` or `rounded-xl`—avoid hyper-rounded pills for large cards).

---

## 5. Components & UI Patterns

### Buttons
- **Primary**: Solid background with inverse crisp text. Minimal scale on active state (`active:scale-[0.98]`).
- **Secondary / Ghost**: Faint border or background hover shift (`hover:bg-neutral-100 dark:hover:bg-neutral-800`).

### Forms & Inputs
- Borderless or fine-line input controls with distinct focus rings (`focus:ring-1 focus:ring-neutral-950 dark:focus:ring-white`).
- Clean inline label presentation.

### Tables & Lists
- Minimal row separators (`divide-y divide-neutral-200 dark:divide-neutral-800`).
- Ample padding on list items to avoid visual tightness.

---

## 6. Motion & Micro-Interactions

- Keep transition durations between **150ms and 250ms**.
- Use clean ease-out timing curves (`cubic-bezier(0.16, 1, 0.3, 1)`).
- Animations should strictly serve context (e.g., fade + subtle shift Y on load, smooth accordion expansion).

---

## 7. Minimalist Design Checklist

- [ ] Is there redundant visual noise (unnecessary icons, unnecessary background patterns)?
- [ ] Are font sizes and weights consistent across the layout?
- [ ] Is the primary CTA obvious without relying on multiple loud colors?
- [ ] Is line height and whitespace generous enough for low-fatigue reading?
- [ ] Does the UI function seamlessly across light and dark themes?
