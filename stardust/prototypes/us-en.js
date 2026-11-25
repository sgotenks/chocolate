// us-en.js — home page behaviour: hat-portal intro, hat/ticket orbit, product-card details, hero scroll CTA.
(() => {
  const SEEN_KEY = 'wonka-hat-portal-seen';
  const html = document.documentElement;
  const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const content = document.querySelector('[data-page-content]');
  const portal = document.querySelector('[data-portal]');

  // ---------- hat portal ----------
  const release = () => {
    portal.hidden = true;
    portal.setAttribute('aria-hidden', 'true');
    portal.setAttribute('inert', '');
    html.classList.remove('portal-active');
    content.removeAttribute('aria-hidden');
    content.removeAttribute('inert');
    portal.querySelectorAll('video').forEach((v) => v.pause());
  };
  if (portal) {
    let seen = false;
    try { seen = sessionStorage.getItem(SEEN_KEY) === '1'; } catch (e) { /* storage blocked: show the intro */ }
    if (seen) {
      release();
    } else {
      content.setAttribute('aria-hidden', 'true');
      content.setAttribute('inert', '');
      const scene = portal.querySelector('.portal__scene');
      const scaler = portal.querySelector('[data-orbit]');
      const hat = portal.querySelector('[data-orbit-hat]');
      const ticket = portal.querySelector('[data-orbit-ticket]');
      // orbit slots (source: ORBIT.back.{desktop,mobile}, front = identity)
      const BACK = {
        desktop: { ticket: { x: 0.126, y: 0.076, s: 0.63, r: -14 }, hat: { x: 0.17, y: 0.05, s: 0.52, r: 4 } },
        mobile: { ticket: { x: 0.45, y: 0.14, s: 0.575, r: -16 }, hat: { x: 0.07, y: 0.12, s: 0.75, r: -12 } },
      };
      const place = (el, side, which) => {
        if (!which) { el.style.transform = 'translate3d(0px, 0px, 0) scale(1) rotate(0deg)'; el.style.zIndex = '30'; el.style.opacity = '1'; return; }
        const t = BACK[window.matchMedia('(max-width: 1023px)').matches ? 'mobile' : 'desktop'][which];
        const w = scaler.clientWidth || 1; const h = scaler.clientHeight || 1;
        el.style.transform = `translate3d(${(side * t.x * w).toFixed(2)}px, ${(-t.y * h).toFixed(2)}px, 0) scale(${t.s}) rotate(${side * t.r}deg)`;
        el.style.zIndex = '10'; el.style.opacity = '1';
      };
      const render = () => {
        const slide = scene.dataset.slide;
        if (slide === 'hat') { place(hat, 0, null); place(ticket, 1, 'ticket'); } else { place(hat, -1, 'hat'); place(ticket, 0, null); }
        scaler.dataset.front = slide;
      };
      const swap = () => { if (scene.dataset.state !== 'idle') return; scene.dataset.slide = scene.dataset.slide === 'hat' ? 'ticket' : 'hat'; render(); };
      render();
      window.addEventListener('resize', render);
      // stars backdrop: keep it playing while the intro idles (source: createBackgroundPlayback —
      // re-attempt play on media-ready events, user gestures, visibility, and a stall watchdog)
      const stars = portal.querySelector('.portal__stars video');
      if (stars) {
        stars.muted = true;
        const attempt = () => { if (scene.dataset.state === 'animating' || portal.hidden || !stars.paused) return; const pr = stars.play(); if (pr && pr.catch) pr.catch(() => {}); };
        ['loadedmetadata', 'loadeddata', 'canplay', 'canplaythrough', 'playing'].forEach((t) => stars.addEventListener(t, attempt));
        ['pointerdown', 'touchstart', 'keydown'].forEach((t) => document.addEventListener(t, attempt, { passive: true }));
        document.addEventListener('visibilitychange', () => { if (!document.hidden) attempt(); });
        window.addEventListener('pageshow', attempt);
        [0, 250, 750].forEach((ms) => setTimeout(attempt, ms));
        setInterval(attempt, 1000);
      }
      // ready sequence (source init): stars playing (≤1.2 s), hat animation preloaded, then the scene idles
      const hatVideo = portal.querySelector('.portal__hat--video');
      const once = (el, ev, ms) => new Promise((res) => { if (!el) { res(); return; } const t = setTimeout(res, ms); el.addEventListener(ev, () => { clearTimeout(t); res(); }, { once: true }); });
      (async () => {
        if (stars && (stars.paused || stars.readyState < 2)) await once(stars, 'playing', 1200);
        const wrap = portal.querySelector('.portal__cta-wrap');
        if (hatVideo) {
          wrap.dataset.loading = '';
          hatVideo.src = window.matchMedia('(max-width: 1023px)').matches ? hatVideo.dataset.srcMobile : hatVideo.dataset.srcDesktop;
          hatVideo.preload = 'auto';
          await once(hatVideo, 'canplaythrough', 2000);
        }
        delete wrap.dataset.loading;
        scene.dataset.state = 'idle';
      })();
      scaler.addEventListener('click', swap);
      portal.querySelector('[data-portal-swipe]').addEventListener('click', swap);
      window.addEventListener('keydown', (e) => { if (!portal.hidden && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) swap(); });
      const cta = portal.querySelector('[data-portal-cta]');
      cta.addEventListener('click', () => {
        if (scene.dataset.state !== 'idle') return;
        cta.classList.add('is-busy');
        try { sessionStorage.setItem(SEEN_KEY, '1'); } catch (e) { /* ignore */ }
        if (reduce()) { release(); return; }
        scene.style.setProperty('--hat-zoom', '3.7');
        scene.dataset.state = 'animating';
        if (hatVideo) { const pr = hatVideo.play(); if (pr && pr.catch) pr.catch(() => {}); }
        setTimeout(release, 1700);
      });
    }
  }

  // ---------- product cards: details disclosure ----------
  document.querySelectorAll('[data-product-card]').forEach((card) => {
    const toggle = card.querySelector('.pcard__toggle');
    const panel = card.querySelector('.pcard__panel');
    const label = toggle.querySelector('[data-label]');
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      panel.dataset.expanded = open ? 'true' : 'false';
      panel.setAttribute('aria-hidden', open ? 'false' : 'true');
      if (open) panel.removeAttribute('inert'); else panel.setAttribute('inert', '');
      label.textContent = open ? toggle.dataset.closeLabel : toggle.dataset.openLabel;
      if (!open) card.scrollIntoView({ block: 'start', behavior: reduce() ? 'auto' : 'smooth' });
    });
  });

  // ---------- hero CTA: smooth scroll to the product section ----------
  document.querySelectorAll('[data-scroll-to]').forEach((a) => a.addEventListener('click', (e) => {
    const target = document.getElementById(a.getAttribute('href').slice(1));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ block: 'start', behavior: reduce() ? 'auto' : 'smooth' });
  }));
})();
