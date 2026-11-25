// canon-chrome.js — mobile menu toggle (same contract as the source: aria-expanded, label swap,
// inert content, html scroll lock, Escape closes).
(() => {
  const panel = document.querySelector('[data-mnav]');
  if (!panel) return;
  const toggle = panel.querySelector('[data-mnav-toggle]');
  const content = panel.querySelector('[data-mnav-content]');
  const set = (open) => {
    panel.dataset.open = open ? 'true' : 'false';
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (open) content.removeAttribute('inert'); else content.setAttribute('inert', '');
    document.documentElement.classList.toggle('has-overlay', open);
  };
  toggle.addEventListener('click', (e) => { e.stopPropagation(); set(panel.dataset.open !== 'true'); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && panel.dataset.open === 'true') { set(false); toggle.focus(); } });
  window.matchMedia('(min-width: 768px)').addEventListener('change', (mq) => { if (mq.matches) set(false); });
})();

// Decorative page clouds — port of the source's wonkaPageClouds placement: clouds alternate left/right,
// spread over the free bands between [data-cloud-avoid] sections (each padded 160px), with a light
// scroll parallax. Pages carrying [data-no-clouds] (legal, 404) get none.
(() => {
  const host = document.querySelector('[data-page-clouds]');
  const content = document.querySelector('[data-page-content]');
  if (!host || !content) return;
  const PAD = 160, EDGE = 120, STEP = 40, GAP = 40, SEP = 80, PX = 32;
  const SIZES = [{ w: 338, h: 302 }, { w: 352, h: 302 }, { w: 338, h: 430 }, { w: 274, h: 230 }, { w: 520, h: 404 }, { w: 350, h: 261 }];
  const assets = (host.dataset.cloudAssets || '').split(',').map((s) => s.trim()).filter(Boolean);
  const hits = (a, b, list) => list.some((r) => a < r.bottom && b > r.top);
  const layout = () => {
    if (document.querySelector('[data-no-clouds]')) { host.hidden = true; host.replaceChildren(); return; }
    host.hidden = false;
    const total = content.scrollHeight;
    const origin = host.getBoundingClientRect().top + window.scrollY;
    const avoid = [];
    content.querySelectorAll('[data-cloud-avoid]').forEach((el) => {
      if (el.parentElement && el.parentElement.closest('[data-cloud-avoid]')) return;
      const r = el.getBoundingClientRect();
      avoid.push({ top: r.top + window.scrollY - origin - PAD, bottom: r.bottom + window.scrollY - origin + PAD });
    });
    const lo = EDGE, hi = Math.max(lo, total - EDGE);
    const merged = avoid.map(({ top, bottom }) => ({ top: Math.max(lo, top), bottom: Math.min(hi, bottom) }))
      .filter((r) => r.bottom > r.top).sort((a, b) => a.top - b.top)
      .reduce((acc, r) => { const last = acc.at(-1); if (last && r.top <= last.bottom) last.bottom = Math.max(last.bottom, r.bottom); else acc.push({ ...r }); return acc; }, []);
    const free = []; let cur = lo;
    merged.forEach((r) => { if (r.top > cur) free.push({ top: cur, bottom: r.top }); cur = Math.max(cur, r.bottom); });
    if (cur < hi) free.push({ top: cur, bottom: hi });
    const pick = (frac, h) => {
      const bands = free.map((r) => ({ top: r.top, bottom: r.bottom - (h + GAP) })).filter((r) => r.bottom > r.top);
      if (!bands.length) return null;
      let left = bands.reduce((s, r) => s + r.bottom - r.top, 0) * frac;
      for (const r of bands) { const len = r.bottom - r.top; if (left <= len) return r.top + left; left -= len; }
      return bands.at(-1).bottom;
    };
    const placed = [];
    const settle = (y, h) => {
      const min = EDGE, max = Math.max(min, total - EDGE - h);
      const ok = (t) => !hits(t, t + h + GAP, avoid) && !hits(t - SEP, t + h + GAP + SEP, placed);
      for (let d = 0; d <= total; d += STEP) {
        for (const c of d === 0 ? [y] : [y + d, y - d]) { const t = Math.round(Math.min(max, Math.max(min, c))); if (ok(t)) return t; }
      }
      return null;
    };
    const frag = document.createDocumentFragment();
    assets.forEach((src, i) => {
      const size = SIZES[i] || SIZES.at(-1);
      const y0 = pick((i + 0.5) / assets.length, size.h);
      if (y0 === null) return;
      const top = settle(y0, size.h);
      if (top === null) return;
      const side = i % 2 === 0 ? 'left' : 'right';
      const img = new Image(size.w, size.h);
      img.src = src; img.alt = ''; img.decoding = 'async'; img.dataset.side = side;
      img.style.top = `${top}px`; img.style[side] = '0';
      frag.append(img); placed.push({ top, bottom: top + size.h });
    });
    host.replaceChildren(frag);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const imgs = [...host.querySelectorAll('img')];
    let raf = null;
    const parallax = () => {
      raf = null;
      const scrolled = window.scrollY - (host.getBoundingClientRect().top + window.scrollY);
      imgs.forEach((img) => {
        const top = parseFloat(img.style.top), start = top - window.innerHeight, end = top + img.height;
        const p = Math.min(1, Math.max(0, (scrolled - start) / (end - start))), e = p * p * (3 - 2 * p);
        img.style.setProperty('--cloud-x', `${((img.dataset.side === 'left' ? -1 : 1) * PX * e).toFixed(2)}px`);
        img.style.setProperty('--cloud-y', `${(GAP * e).toFixed(2)}px`);
      });
    };
    const queue = () => { if (raf === null) raf = requestAnimationFrame(parallax); };
    parallax();
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue, { passive: true });
  };
  if (document.readyState === 'complete') requestAnimationFrame(layout); else window.addEventListener('load', layout, { once: true });
})();
