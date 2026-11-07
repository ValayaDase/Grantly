# GRANTLY — Accessibility Audit & WCAG 2.1 AA Compliance Report

**Target Standard:** WCAG 2.1 Level AA & Section 508  
**Audited Viewports:** Mobile (360px), Tablet (768px), Desktop (1280px–1920px)  
**Status:** Remediated & Compliant  

---

## 1. Accessibility Remediations Implemented

### A. Skip to Main Content Navigation (WCAG 2.4.1)
* **Finding:** Keyboard and screen-reader users had to tab through the top navigation bar and logo on every page reload before accessing main scholarship content.
* **Remediation:** Added an accessible skip-to-content link in `src/app/layout.tsx`:
  ```tsx
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#5B4BDB] focus:text-white focus:rounded-xl focus:shadow-lg focus:outline-none"
  >
    Skip to main content
  </a>
  ```
  Primary landmark `<main id="main-content" tabIndex={-1}>` added across all layout templates.

### B. Form Labels & Accessible Names (WCAG 4.1.2)
* **Finding:** The landing hero search input relied exclusively on visual placeholder text, failing screen-reader input identification.
* **Remediation:** Added explicit `aria-label="Search scholarships and schemes"` to the search input in `HeroSection.tsx`.

### C. Icon-Only Action Buttons (WCAG 1.3.1, 4.1.2)
* **Finding:** Dismiss, removal, and toggle buttons rendered icon SVGs without accessible names.
* **Remediation:**
  - In `ComparisonDrawer.tsx`: Added `aria-label="Remove [Scholarship Title] from comparison"` and `aria-label="Clear all compared scholarships"`.
  - In `Navbar.tsx`: Added `aria-label="Toggle Navigation"` and dynamic `aria-expanded={mobileMenuOpen}`.

### D. Motion Accessibility (`prefers-reduced-motion`) (WCAG 2.3.3)
* **Finding:** GSAP timeline animations and continuous dual marquees continued playing for users with vestibular motion sensitivity.
* **Remediation:** Added `window.matchMedia('(prefers-reduced-motion: reduce)')` checks inside GSAP timelines and global CSS rules:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      scroll-behavior: auto !important;
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
  ```

### E. Touch Targets & Responsive Layouts (WCAG 2.5.5)
* **Finding:** Pinned desktop card animations caused horizontal overflow and awkward touch-scrolling on tablet viewports (641px–1023px).
* **Remediation:** Pinned GSAP ScrollTrigger timeline restricted strictly to desktop (`>=1024px`). Mobile and tablet viewports receive clean 2-column and 1-column responsive grid layouts with native touch scrolling and touch targets exceeding 44x44px.

