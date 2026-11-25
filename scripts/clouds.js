/*
 * Decorative page clouds — port of the source's wonkaPageClouds placement (canon-chrome.js):
 * clouds alternate left/right over the free bands between [data-cloud-avoid] elements (each
 * padded 160px), with a light scroll parallax. Enabled per page by metadata `Clouds | <n>`
 * (n = 1–6 cloud images). A block or section opts out of cloud overlap with the
 * `data-cloud-avoid` attribute (section metadata `Cloud Avoid | true` sets it on the section).
 */
const PAD = 160;
const EDGE = 120;
const STEP = 40;
const GAP = 40;
const SEP = 80;
const PX = 32;
const SIZES = [
  { w: 338, h: 302 },
  { w: 352, h: 302 },
  { w: 338, h: 430 },
  { w: 274, h: 230 },
  { w: 520, h: 404 },
  { w: 350, h: 261 },
];

const hits = (a, b, list) => list.some((r) => a < r.bottom && b > r.top);

function freeBands(avoid, lo, hi) {
  const merged = avoid
    .map(({ top, bottom }) => ({ top: Math.max(lo, top), bottom: Math.min(hi, bottom) }))
    .filter((r) => r.bottom > r.top)
    .sort((a, b) => a.top - b.top)
    .reduce((acc, r) => {
      const last = acc.at(-1);
      if (last && r.top <= last.bottom) last.bottom = Math.max(last.bottom, r.bottom);
      else acc.push({ ...r });
      return acc;
    }, []);
  const free = [];
  let cur = lo;
  merged.forEach((r) => {
    if (r.top > cur) free.push({ top: cur, bottom: r.top });
    cur = Math.max(cur, r.bottom);
  });
  if (cur < hi) free.push({ top: cur, bottom: hi });
  return free;
}

function layout(host, assets) {
  const total = document.body.scrollHeight;
  const origin = host.getBoundingClientRect().top + window.scrollY;
  const avoid = [];
  document.querySelectorAll('[data-cloud-avoid]').forEach((node) => {
    if (node.parentElement && node.parentElement.closest('[data-cloud-avoid]')) return;
    const r = node.getBoundingClientRect();
    if (!r.height) return;
    avoid.push({
      top: r.top + window.scrollY - origin - PAD,
      bottom: r.bottom + window.scrollY - origin + PAD,
    });
  });
  const lo = EDGE;
  const hi = Math.max(lo, total - EDGE);
  const free = freeBands(avoid, lo, hi);
  const pick = (frac, h) => {
    const bands = free
      .map((r) => ({ top: r.top, bottom: r.bottom - (h + GAP) }))
      .filter((r) => r.bottom > r.top);
    if (!bands.length) return null;
    let left = bands.reduce((s, r) => s + r.bottom - r.top, 0) * frac;
    const band = bands.find((r) => {
      const len = r.bottom - r.top;
      if (left <= len) return true;
      left -= len;
      return false;
    });
    return band ? band.top + left : bands.at(-1).bottom;
  };
  const placed = [];
  const settle = (y, h) => {
    const min = EDGE;
    const max = Math.max(min, total - EDGE - h);
    const ok = (t) => !hits(t, t + h + GAP, avoid) && !hits(t - SEP, t + h + GAP + SEP, placed);
    for (let d = 0; d <= total; d += STEP) {
      const candidates = d === 0 ? [y] : [y + d, y - d];
      const hit = candidates
        .map((c) => Math.round(Math.min(max, Math.max(min, c))))
        .find((t) => ok(t));
      if (hit !== undefined) return hit;
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
    img.src = src;
    img.alt = '';
    img.decoding = 'async';
    img.dataset.side = side;
    img.style.top = `${top}px`;
    img.style[side] = '0';
    img.style.setProperty('--cloud-w', `${size.w}px`);
    img.style.setProperty('--cloud-h', `${size.h}px`);
    frag.append(img);
    placed.push({ top, bottom: top + size.h });
  });
  host.replaceChildren(frag);
}

function parallax(host) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let raf = null;
  const run = () => {
    raf = null;
    const scrolled = window.scrollY - (host.getBoundingClientRect().top + window.scrollY);
    host.querySelectorAll('img').forEach((img) => {
      const top = parseFloat(img.style.top);
      const start = top - window.innerHeight;
      const end = top + img.height;
      const p = Math.min(1, Math.max(0, (scrolled - start) / (end - start)));
      const e = p * p * (3 - 2 * p);
      const dir = img.dataset.side === 'left' ? -1 : 1;
      img.style.setProperty('--cloud-x', `${(dir * PX * e).toFixed(2)}px`);
      img.style.setProperty('--cloud-y', `${(GAP * e).toFixed(2)}px`);
    });
  };
  const queue = () => {
    if (raf === null) raf = requestAnimationFrame(run);
  };
  run();
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue, { passive: true });
}

/**
 * Places the page clouds once the page (header, sections, footer) has loaded.
 * @param {number} count number of cloud images (1–6)
 */
export default function initClouds(count) {
  const n = Math.min(SIZES.length, Math.max(0, parseInt(count, 10) || 0));
  if (!n) return;
  const base = `${window.hlx.codeBasePath}/styles/clouds`;
  const assets = Array.from({ length: n }, (_, i) => `${base}/cloud-${i + 1}.webp`);
  const host = document.createElement('div');
  host.className = 'page-clouds';
  host.setAttribute('aria-hidden', 'true');
  document.body.prepend(host);
  const footer = document.querySelector('footer .footer');
  const footerReady = () => !footer || footer.dataset.blockStatus === 'loaded';
  const start = () => {
    layout(host, assets);
    parallax(host);
  };
  let tries = 0;
  const whenReady = () => {
    tries += 1;
    if (footerReady() || tries > 100) requestAnimationFrame(start);
    else setTimeout(whenReady, 100);
  };
  if (document.readyState === 'complete') whenReady();
  else window.addEventListener('load', whenReady, { once: true });
}
