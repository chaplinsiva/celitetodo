---
name: aesthetic-designer
description: Enforces vibrant, high-impact aesthetic design principles featuring dark mode aesthetics, dynamic glassmorphism, rich color gradients, glowing accents, smooth micro-animations, modern typography, and immersive hero elements. Trigger when building visually stunning, premium, state-of-the-art web interfaces that wow the user.
---

# Aesthetic Designer Skill Guide

The **Aesthetic Designer** skill provides guidelines and design patterns for building state-of-the-art, visually captivating, highly polished web interfaces. This skill emphasizes rich color palettes, glassmorphism, dynamic animations, ambient lighting effects, and modern typography to deliver a premium user experience.

---

## 1. Core Aesthetics & Visual Hierarchy

- **Stunning First Impression**: Deliver high visual quality instantly using layered depth, ambient glows, vibrant accents, and sleek dark modes.
- **Depth & Dimensionality**: Utilize multi-layered cards, soft drop shadows, backdrop filters, and subtle border highlights.
- **Dynamic Interactivity**: Elements react fluidly to user movement, hovers, clicks, and page transitions with smooth physics-inspired animations.
- **Curated Color Harmonies**: Avoid default browser colors. Combine deep dark canvas surfaces with electric HSL gradient highlights (violet, indigo, emerald, cyan, amber).

---

## 2. Color System, Gradients & Ambient Glows

### Background & Surface Hierarchy
- **Canvas Base**: Deep slate/zinc dark surfaces (`#030712`, `#090d16`, `#0b0f19`).
- **Surface Cards**: Semi-transparent dark surfaces with hairline white/slate borders (`bg-slate-900/60 border-slate-800/80`).
- **Gradients**: Multi-stop linear & radial gradients for hero text, action buttons, and background light blobs.

```css
/* Aesthetic Color & Light Tokens */
:root {
  --canvas-bg: #030712;
  --card-bg: rgba(15, 23, 42, 0.65);
  --card-border: rgba(255, 255, 255, 0.08);
  --card-border-hover: rgba(139, 92, 246, 0.4);
  
  --gradient-primary: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%);
  --gradient-emerald: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);
  --gradient-amber: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);

  --glow-purple: 0 0 25px -5px rgba(168, 85, 247, 0.4);
  --glow-cyan: 0 0 25px -5px rgba(6, 182, 212, 0.4);
}
```

---

## 3. Glassmorphism & Depth Layers

### Backdrop Filters & Frosted Glass
- Combine `backdrop-blur-xl` or `backdrop-blur-md` with semi-transparent background fills (`rgba(255,255,255,0.05)` or `rgba(15,23,42,0.7)`).
- Add top border highlights to emulate reflective glass edges (`border-t border-white/20`).

```html
<!-- Example Aesthetic Glass Card -->
<div class="relative group rounded-2xl p-6 bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl transition-all duration-300 hover:border-violet-500/40 hover:shadow-violet-500/10 hover:shadow-2xl">
  <div class="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-pink-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
  <div class="relative z-10">
    <!-- Card Content -->
  </div>
</div>
```

---

## 4. Typography & Gradient Headers

### Font Choices
- **Display & Headings**: **Outfit**, **Syne**, **Plus Jakarta Sans**, **Cabinet Grotesk**, or **Cinzel**.
- **Body & Interface**: **Inter**, **Satoshi**, or **DM Sans**.

### Gradient Text Styling
Use background-clip text for hero titles and high-impact metric headers:

```css
.text-gradient-hero {
  background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 40%, #818cf8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

---

## 5. Micro-Animations & Dynamic Motion

- **Hover Lifts**: Scale elements slightly on hover (`hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98]`).
- **Glow Pulse**: Subtle keyframe pulse for badges, live status dots, and active buttons.
- **Staggered Entry**: Page sections animate in sequentially with fade-in + slide-up motion.
- **Spring Physics**: Use cubic-bezier timing curves like `cubic-bezier(0.34, 1.56, 0.64, 1)` for snappy, bouncy interactions.

---

## 6. High-Impact UI Components

### Gradient Shimmer Buttons
Buttons that feature continuous subtle shimmer or gradient border animations on interaction.

### Animated Hero Stat Cards
Cards with glowing metric numbers, mini trend line charts, icon badges with background radial glow.

### Floating Modal Overlays
Modals with dark frosted glass backdrops (`bg-black/60 backdrop-blur-md`), entering with scale and spring fade animations.

---

## 7. Aesthetic Designer Checklist

- [ ] Does the app feel modern, vibrant, and visual upon landing?
- [ ] Are ambient glow effects and background gradients rich without overwhelming contrast?
- [ ] Is glassmorphism applied gracefully with backdrop blur and delicate border highlights?
- [ ] Are headings rendered with crisp typography and subtle gradient clipping where appropriate?
- [ ] Do interactive elements (buttons, cards, inputs) feature hover shifts and feedback animations?
