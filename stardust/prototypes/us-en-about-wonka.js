// us-en-about-wonka.js — page behaviours, same contract as the source (Drupal behaviors wonkaAccordion + discoverHero).
// Accordion: independent toggles (no auto-close), aria-expanded / data-expanded / aria-hidden / inert kept in sync.
(() => {
  document.querySelectorAll('[data-accordion]').forEach((root) => {
    const set = (toggle, open) => {
      const id = toggle.dataset.accordionToggle;
      const item = toggle.closest('[data-accordion-item]');
      const panel = root.querySelector(`[data-accordion-panel="${id}"]`);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.dataset.expanded = open ? 'true' : 'false';
      if (item) item.dataset.expanded = open ? 'true' : 'false';
      if (panel) {
        panel.dataset.expanded = open ? 'true' : 'false';
        panel.setAttribute('aria-hidden', open ? 'false' : 'true');
        if (open) panel.removeAttribute('inert'); else panel.setAttribute('inert', '');
      }
    };
    root.querySelectorAll('[data-accordion-toggle]').forEach((toggle) => {
      set(toggle, false);
      toggle.addEventListener('click', () => set(toggle, toggle.getAttribute('aria-expanded') !== 'true'));
    });
  });
})();

// Discover-hero "Scroll Down": eased scroll to the anchor (cubic in-out, 700 px/s clamped to 1.2–2.6 s).
(() => {
  const ease = (p) => (p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2);
  document.querySelectorAll('[data-scroll-cta][href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = document.getElementById(link.getAttribute('href').slice(1));
      if (!target) return;
      event.preventDefault();
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { target.scrollIntoView({ block: 'start' }); return; }
      const startY = window.scrollY;
      const targetY = target.getBoundingClientRect().top + startY;
      const duration = Math.min(2600, Math.max(1200, (Math.abs(targetY - startY) / 700) * 1000));
      const t0 = performance.now();
      const step = (now) => {
        const p = Math.min((now - t0) / duration, 1);
        window.scrollTo(0, startY + (targetY - startY) * ease(p));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  });
})();
