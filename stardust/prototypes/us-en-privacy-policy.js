// us-en-privacy-policy.js — legal template behaviour.
// Accordion (source: OneTrust notice layer breakers): a click on a section row toggles its panel
// instantly (display none ↔ block, no transition) and flips the row marker " +" ↔ " -". Sections are
// independent (several may be open). While open the row shows the section's open label (the never-shown
// [data-acc-open-label] heading — the source's layer-breaker footer), closed it shows its own label again.
(() => {
  document.querySelectorAll('[data-legal-acc]').forEach((acc) => {
    const toggle = acc.querySelector('.legal-acc__toggle');
    const panel = acc.querySelector('.legal-acc__panel');
    if (!toggle || !panel) return;
    const closedLabel = toggle.textContent;
    const openEl = acc.querySelector('[data-acc-open-label]');
    const openLabel = openEl ? openEl.textContent : '';
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      toggle.classList.toggle('active', open); // the source's state class on the row
      panel.hidden = !open;
      if (openLabel) toggle.textContent = open ? openLabel : closedLabel;
    });
  });

  // In-page links to a section row (#<row id>) scroll to it, as on the source (the row stays collapsed).
  // The consent-settings buttons open the OneTrust preference centre when the SDK is present.
  document.querySelectorAll('[data-consent-settings]').forEach((btn) => {
    btn.addEventListener('click', () => { if (window.OneTrust && typeof window.OneTrust.ToggleInfoDisplay === 'function') window.OneTrust.ToggleInfoDisplay(); });
  });
})();
