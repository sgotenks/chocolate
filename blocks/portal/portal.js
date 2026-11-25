/**
 * portal — the hat-portal intro (first visit per browser session): a fixed overlay over the
 * page with a hat / golden-ticket orbit, a looping stars backdrop video and two CTAs.
 * Template-slotted: authored rows are classified by content and their nodes MOVED into slots.
 *   slide rows (title p | desktop + mobile images | CTA p) — first = hat, second = ticket;
 *   backdrop row (link to the stars .mp4 | poster image); label row (the swipe hint text).
 * Same mechanism as the source: sessionStorage `wonka-hat-portal-seen=1` skips the intro.
 * @ew-exempt backdrop video link — configuration (its href becomes the <video> source)
 */
const SEEN_KEY = 'wonka-hat-portal-seen';
const ASSETS = `${window.hlx?.codeBasePath || ''}/blocks/portal/assets`;
const DESKTOP = '(width >= 1024px)';
// orbit slots (source: ORBIT.back.{desktop,mobile}; front = identity)
const BACK = {
  desktop: {
    ticket: {
      x: 0.126, y: 0.076, s: 0.63, r: -14,
    },
    hat: {
      x: 0.17, y: 0.05, s: 0.52, r: 4,
    },
  },
  mobile: {
    ticket: {
      x: 0.45, y: 0.14, s: 0.575, r: -16,
    },
    hat: {
      x: 0.07, y: 0.12, s: 0.75, r: -12,
    },
  },
};

const el = (tag, className, attrs = {}) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
};

const isSeen = () => {
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1';
  } catch (e) {
    return false;
  }
};

const markSeen = () => {
  try {
    sessionStorage.setItem(SEEN_KEY, '1');
  } catch (e) {
    // storage blocked: the intro shows again next visit
  }
};

const desktop = () => window.matchMedia(DESKTOP).matches;
const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function pageParts(section) {
  return [
    ...document.querySelectorAll('body > header, body > footer, main > .section'),
  ].filter((n) => n !== section);
}

function release(block, section) {
  section.hidden = true;
  document.documentElement.classList.remove('portal-active');
  pageParts(section).forEach((n) => {
    n.removeAttribute('inert');
    n.removeAttribute('aria-hidden');
  });
  block.querySelectorAll('video').forEach((v) => v.pause());
}

/** moves the pictures of a cell into desktop / mobile slots (first = desktop, last = mobile) */
function slotPictures(cell, item) {
  const pics = [...cell.querySelectorAll('picture')];
  const imgs = pics.length ? pics : [...cell.querySelectorAll('img')];
  imgs.forEach((pic, i) => {
    const slot = el('div', i === 0 && imgs.length > 1 ? 'portal-pic-desktop' : 'portal-pic-mobile');
    slot.append(pic);
    item.append(slot);
  });
}

function buildSlide(row, key, parts) {
  const cells = [...row.children];
  const picCell = cells.find((c) => c.querySelector('picture, img'));
  const [titleCell, ctaCell] = cells.filter((c) => c !== picCell);
  const item = el('div', `portal-item portal-item-${key}`);
  if (picCell) slotPictures(picCell, item);
  parts.items[key] = item;
  const title = el('div', `portal-title portal-title-${key}`);
  if (titleCell) title.append(...titleCell.childNodes);
  parts.titles.append(title);
  const slot = el('div', `portal-cta-slot portal-cta-slot-${key}`);
  if (ctaCell && ctaCell.querySelector('a')) {
    slot.append(...ctaCell.childNodes);
  } else if (ctaCell) {
    // a plain-text CTA is the intro's own action (no destination): a button-role wrapper
    const action = el('div', 'btn btn-lg btn-gold portal-action', {
      role: 'button', tabindex: '0',
    });
    action.append(...ctaCell.childNodes);
    slot.append(action);
  }
  parts.ctaWrap.append(slot);
  return { item, slot };
}

function keepPlaying(video, scene, section) {
  const attempt = () => {
    if (scene.dataset.state === 'animating' || section.hidden) return;
    if (!video.paused) return;
    const pr = video.play();
    if (pr && pr.catch) pr.catch(() => {});
  };
  ['loadedmetadata', 'loadeddata', 'canplay', 'canplaythrough', 'playing']
    .forEach((t) => video.addEventListener(t, attempt));
  ['pointerdown', 'touchstart', 'keydown']
    .forEach((t) => document.addEventListener(t, attempt, { passive: true }));
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) attempt();
  });
  window.addEventListener('pageshow', attempt);
  [0, 250, 750].forEach((ms) => setTimeout(attempt, ms));
  setInterval(attempt, 1000);
}

const once = (node, ev, ms) => new Promise((resolve) => {
  if (!node) {
    resolve();
    return;
  }
  const t = setTimeout(resolve, ms);
  node.addEventListener(ev, () => {
    clearTimeout(t);
    resolve();
  }, { once: true });
});

export default function decorate(block) {
  if (block.querySelector('.portal-scene')) return;
  const section = block.closest('.section') || block.parentElement;
  const rows = [...block.children];

  const scene = el('div', 'portal-scene', { 'data-slide': 'hat' });
  const hatLayer = el('div', 'portal-hat-layer');
  const overlay = el('div', 'portal-overlay');
  const clouds = el('div', 'portal-clouds', { 'aria-hidden': 'true' });
  ['left-top', 'left-bottom', 'right'].forEach((name) => {
    const img = el('img', `portal-cloud portal-cloud-${name}`, {
      alt: '', src: `${ASSETS}/cloud-${name}.webp`,
    });
    clouds.append(img);
  });
  const stars = el('div', 'portal-stars', { 'aria-hidden': 'true' });
  const scaler = el('div', 'portal-scaler', { 'data-front': 'hat' });
  const parts = {
    items: {},
    titles: el('div', 'portal-titles'),
    ctaWrap: el('div', 'portal-cta-wrap'),
  };
  parts.ctaWrap.append(el('span', 'portal-spinner', { 'aria-hidden': 'true' }));
  const swipe = el('div', 'portal-swipe', {
    role: 'button', tabindex: '0', 'aria-label': 'Swipe',
  });
  const swipeIcon = el('span', 'portal-swipe-icon', { 'aria-hidden': 'true' });
  swipeIcon.append(el('img', '', { src: `${ASSETS}/swipe.svg`, alt: '' }));
  const swipeLabel = el('div', 'portal-swipe-label');
  swipe.append(swipeIcon, swipeLabel);

  const slideKeys = ['hat', 'ticket'];
  let starsVideo = null;
  rows.forEach((row) => {
    const videoLink = row.querySelector('a[href*=".mp4"]');
    if (videoLink) {
      starsVideo = el('video', '', {
        autoplay: '', muted: '', loop: '', playsinline: '', preload: 'auto',
      });
      starsVideo.muted = true;
      starsVideo.src = videoLink.getAttribute('href');
      const poster = row.querySelector('picture, img');
      const posterImg = poster && (poster.tagName === 'IMG' ? poster : poster.querySelector('img'));
      if (posterImg) starsVideo.poster = posterImg.currentSrc || posterImg.src;
      if (poster) {
        const still = el('div', 'portal-stars-still');
        still.append(poster);
        stars.append(still);
      }
      stars.append(starsVideo);
      (videoLink.closest('p') || videoLink).remove();
      return;
    }
    if (row.querySelector('picture, img') && slideKeys.length) {
      buildSlide(row, slideKeys.shift(), parts);
      return;
    }
    const cell = row.querySelector(':scope > div') || row;
    swipeLabel.append(...cell.childNodes);
  });

  const { hat, ticket } = parts.items;
  let hatVideo = null;
  if (hat) {
    hatVideo = el('video', 'portal-hat-video', {
      muted: '', playsinline: '', preload: 'none', 'aria-hidden': 'true',
    });
    hatVideo.muted = true;
    hat.append(hatVideo);
  }
  if (ticket) scaler.append(ticket);
  if (hat) scaler.append(hat);
  hatLayer.append(el('div', 'portal-curtain'), clouds, stars, scaler);
  overlay.append(hatLayer, parts.titles, swipe, parts.ctaWrap);
  scene.append(el('div', 'portal-bg', { 'aria-hidden': 'true' }), overlay);

  // external CTA: presentational arrow + new tab, like the source
  parts.ctaWrap.querySelectorAll('.portal-cta-slot-ticket a').forEach((a) => {
    const icon = el('span', 'btn-icon', { 'aria-hidden': 'true' });
    icon.append(el('img', '', { src: `${ASSETS}/arrow-external.svg`, alt: '' }));
    a.append(icon);
    if (/^https?:/.test(a.getAttribute('href') || '')) {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    }
  });

  rows.forEach((row) => row.remove());
  block.append(scene);
  block.setAttribute('role', 'dialog');
  block.setAttribute('aria-modal', 'true');
  const label = parts.titles.querySelector('.portal-title-hat');
  if (label) block.setAttribute('aria-label', label.textContent.replace(/\s+/g, ' ').trim());

  if (isSeen()) {
    release(block, section);
    return;
  }
  document.documentElement.classList.add('portal-active');
  pageParts(section).forEach((n) => {
    n.setAttribute('inert', '');
    n.setAttribute('aria-hidden', 'true');
  });

  const place = (node, side, which) => {
    if (!node) return;
    if (!which) {
      node.style.transform = 'translate3d(0px, 0px, 0) scale(1) rotate(0deg)';
      node.style.zIndex = '30';
      node.style.opacity = '1';
      return;
    }
    const t = BACK[desktop() ? 'desktop' : 'mobile'][which];
    const w = scaler.clientWidth || 1;
    const h = scaler.clientHeight || 1;
    const x = (side * t.x * w).toFixed(2);
    const y = (-t.y * h).toFixed(2);
    node.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${t.s}) rotate(${side * t.r}deg)`;
    node.style.zIndex = '10';
    node.style.opacity = '1';
  };
  const render = () => {
    if (scene.dataset.slide === 'hat') {
      place(hat, 0, null);
      place(ticket, 1, 'ticket');
    } else {
      place(hat, -1, 'hat');
      place(ticket, 0, null);
    }
    scaler.dataset.front = scene.dataset.slide;
  };
  const swap = () => {
    if (scene.dataset.state !== 'idle') return;
    scene.dataset.slide = scene.dataset.slide === 'hat' ? 'ticket' : 'hat';
    render();
  };
  render();
  // the section is display:none until its blocks load: place the orbit once it has a size
  if (window.ResizeObserver) new ResizeObserver(render).observe(scaler);
  window.addEventListener('resize', render);
  if (starsVideo) keepPlaying(starsVideo, scene, section);

  // ready sequence (source init): stars playing (<= 1.2 s), hat animation preloaded, then idle
  (async () => {
    if (starsVideo && (starsVideo.paused || starsVideo.readyState < 2)) {
      await once(starsVideo, 'playing', 1200);
    }
    const wrap = parts.ctaWrap;
    if (hatVideo) {
      wrap.dataset.loading = '';
      const file = desktop() ? 'hat-portal-anim-hat.webm' : 'hat-mobile-anim-hat.webm';
      hatVideo.src = `${ASSETS}/${file}`;
      hatVideo.preload = 'auto';
      await once(hatVideo, 'canplaythrough', 2000);
    }
    delete wrap.dataset.loading;
    scene.dataset.state = 'idle';
  })();

  scaler.addEventListener('click', swap);
  swipe.addEventListener('click', swap);
  swipe.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      swap();
    }
  });
  window.addEventListener('keydown', (e) => {
    if (section.hidden) return;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') swap();
  });

  const cta = parts.ctaWrap.querySelector('.portal-cta-slot-hat :is(.portal-action, a)');
  if (cta) {
    const enter = (e) => {
      e.preventDefault();
      if (scene.dataset.state !== 'idle') return;
      cta.classList.add('is-busy');
      markSeen();
      if (reduceMotion()) {
        release(block, section);
        return;
      }
      scene.style.setProperty('--hat-zoom', '3.7');
      scene.dataset.state = 'animating';
      if (hatVideo) {
        const pr = hatVideo.play();
        if (pr && pr.catch) pr.catch(() => {});
      }
      setTimeout(() => release(block, section), 1700);
    };
    cta.addEventListener('click', enter);
    cta.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') enter(e);
    });
  }
}
