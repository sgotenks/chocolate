/**
 * home-hero — the landing banner: airship with its golden banner (the page h1), sparkle stars,
 * cloud layers, the product line-up and two CTAs. Template-slotted: authored nodes are
 * classified by role and MOVED into the empty slot containers below.
 *   first image = airship; heading = banner text; next images = products (desktop, mobile);
 *   paragraphs with links = CTAs (bold = gold, italic = blurred).
 */
const ASSETS = `${window.hlx?.codeBasePath || ''}/blocks/home-hero/assets`;

// sparkle stars of the source banner: left %, top %, size cqi, duration s, delay s, opacity,
// drift x / end x (cqi), fall (cqi)
const STARS = [
  [84, 27.3, 1.59, 4, 0, 0.6, 19.05, -17.46, 53.97],
  [87, 28.25, 3.81, 5.7, -2.109, 0.71, 25.08, -26.67, 66.98],
  [86, 29.21, 6.03, 7.4, -1.776, 0.82, 31.11, -35.87, 80],
  [85, 27.62, 2.54, 9.1, -1.001, 0.93, 37.14, -45.08, 93.02],
  [84, 28.57, 4.76, 5.3, -2.544, 0.63, 20.95, -54.29, 106.03],
  [87, 29.52, 6.98, 7, -2.45, 0.74, 26.98, -22.22, 119.05],
  [86, 27.94, 3.49, 8.7, -1.914, 0.85, 33.02, -31.43, 59.05],
  [85, 28.89, 5.71, 4.9, -0.441, 0.96, 39.05, -40.63, 72.06],
  [84, 27.3, 2.22, 6.6, -3.036, 0.66, 22.86, -49.84, 85.08],
  [87, 28.25, 4.44, 8.3, -2.739, 0.77, 28.89, -17.78, 98.1],
  [86, 29.21, 6.67, 4.5, -0.9, 0.88, 34.92, -26.98, 111.11],
  [85, 27.62, 3.17, 6.2, -0.434, 0.99, 40.95, -36.19, 124.13],
  [84, 28.57, 5.4, 7.9, -3.476, 0.69, 24.76, -45.4, 64.13],
  [87, 29.52, 1.9, 4.1, -1.271, 0.8, 30.79, -54.6, 77.14],
  [86, 27.94, 4.13, 5.8, -1.044, 0.91, 36.83, -22.54, 90.16],
  [85, 28.89, 6.35, 7.5, -0.375, 0.61, 20.63, -31.75, 103.17],
  [84, 27.3, 2.86, 9.2, -3.864, 0.72, 26.67, -40.95, 116.19],
  [87, 28.25, 5.08, 5.4, -1.566, 0.83, 32.7, -50.16, 56.19],
  [86, 29.21, 1.59, 7.1, -1.136, 0.94, 38.73, -18.1, 69.21],
  [85, 27.62, 3.81, 8.8, -0.264, 0.64, 22.54, -27.3, 82.22],
  [84, 28.57, 6.03, 5, -2, 0.75, 28.57, -36.51, 95.24],
  [87, 29.52, 2.54, 6.7, -1.809, 0.86, 34.6, -45.71, 108.25],
  [86, 27.94, 4.76, 8.4, -1.176, 0.97, 40.63, -54.92, 121.27],
  [85, 28.89, 6.98, 4.6, -0.046, 0.67, 24.44, -22.86, 61.27],
  [84, 27.3, 3.49, 6.3, -2.394, 0.78, 30.48, -32.06, 74.29],
  [87, 28.25, 5.71, 8, -2, 0.89, 36.51, -41.27, 87.3],
  [86, 29.21, 2.22, 4.2, -0.504, 1, 20.32, -50.48, 100.32],
  [85, 27.62, 4.44, 5.9, -2.891, 0.7, 26.35, -18.41, 113.33],
  [84, 28.57, 6.67, 7.6, -2.736, 0.81, 32.38, -27.62, 126.35],
  [87, 29.52, 3.17, 9.3, -2.139, 0.92, 38.41, -36.83, 66.35],
  [86, 27.94, 5.4, 5.5, -0.55, 0.62, 22.22, -46.03, 79.37],
  [85, 28.89, 1.9, 7.2, -3.384, 0.73, 28.25, -55.24, 92.38],
  [84, 27.3, 4.13, 8.9, -3.026, 0.84, 34.29, -23.17, 105.4],
  [87, 28.25, 6.35, 5.1, -1.071, 0.95, 40.32, -32.38, 118.41],
  [86, 29.21, 2.86, 6.8, -0.544, 0.65, 24.13, -41.59, 58.41],
  [85, 27.62, 5.08, 8.5, -3.825, 0.76, 30.16, -50.79, 71.43],
  [84, 28.57, 1.59, 4.7, -1.504, 0.87, 36.19, -18.73, 84.44],
  [87, 29.52, 3.81, 6.4, -1.216, 0.98, 20, -27.94, 97.46],
  [86, 27.94, 6.03, 8.1, -0.486, 0.68, 26.03, -37.14, 110.48],
  [85, 28.89, 2.54, 4.3, -1.849, 0.79, 32.06, -46.35, 123.49],
  [84, 27.3, 4.76, 6, -1.8, 0.9, 38.1, -55.56, 63.49],
  [87, 28.25, 6.98, 7.7, -1.309, 0.6, 21.9, -23.49, 76.51],
  [86, 29.21, 3.49, 9.4, -0.376, 0.71, 27.94, -32.7, 89.52],
  [85, 27.62, 5.71, 5.6, -2.296, 0.82, 33.97, -41.9, 102.54],
  [84, 28.57, 2.22, 7.3, -2.044, 0.93, 40, -51.11, 115.56],
  [87, 29.52, 4.44, 9, -1.35, 0.63, 23.81, -19.05, 55.56],
  [86, 27.94, 6.67, 5.2, -0.104, 0.74, 29.84, -28.25, 68.57],
  [85, 28.89, 3.17, 6.9, -2.691, 0.85, 35.87, -37.46, 81.59],
  [84, 27.3, 5.4, 8.6, -2.236, 0.96, 19.68, -46.67, 94.6],
  [87, 28.25, 1.9, 4.8, -0.624, 0.66, 25.71, -55.87, 107.62],
  [86, 29.21, 4.13, 6.5, 0, 0.77, 31.75, -23.81, 120.63],
  [85, 27.62, 6.35, 8.2, -3.034, 0.88, 37.78, -33.02, 60.63],
  [84, 28.57, 2.86, 4.4, -1.056, 0.99, 21.59, -42.22, 73.65],
  [87, 29.52, 5.08, 6.1, -0.671, 0.69, 27.62, -51.43, 86.67],
  [86, 27.94, 1.59, 7.8, -3.744, 0.8, 33.65, -19.37, 99.68],
  [85, 28.89, 3.81, 4, -1.4, 0.91, 39.68, -28.57, 112.7],
  [84, 27.3, 6.03, 5.7, -1.254, 0.61, 23.49, -37.78, 125.71],
  [87, 28.25, 2.54, 7.4, -0.666, 0.72, 29.52, -46.98, 65.71],
  [86, 29.21, 4.76, 9.1, -4.186, 0.83, 35.56, -56.19, 78.73],
  [85, 27.62, 6.98, 5.3, -1.749, 0.94, 19.37, -24.13, 91.75],
  [84, 28.57, 3.49, 7, -1.4, 0.64, 25.4, -33.33, 104.76],
  [87, 29.52, 5.71, 8.7, -0.609, 0.75, 31.43, -42.54, 117.78],
  [86, 27.94, 2.22, 4.9, -2.156, 0.86, 37.46, -51.75, 57.78],
  [85, 28.89, 4.44, 6.6, -2.046, 0.97, 21.27, -19.68, 70.79],
  [84, 27.3, 6.67, 8.3, -1.494, 0.67, 27.3, -28.89, 83.81],
  [87, 28.25, 3.17, 4.5, -0.225, 0.78, 33.33, -38.1, 96.83],
  [86, 29.21, 5.4, 6.2, -2.604, 0.89, 39.37, -47.3, 109.84],
  [85, 27.62, 1.9, 7.9, -2.291, 1, 23.17, -56.51, 122.86],
  [84, 28.57, 4.13, 4.1, -0.656, 0.7, 29.21, -24.44, 62.86],
  [87, 29.52, 6.35, 5.8, -0.174, 0.81, 35.24, -33.65, 75.87],
];

const el = (tag, className, attrs = {}) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
};

const deco = (className, file, w, h) => el('img', className, {
  src: `${ASSETS}/${file}`, alt: '', width: w, height: h, 'aria-hidden': 'true',
});

function buildStars() {
  const host = el('div', 'home-hero-stars', { 'aria-hidden': 'true' });
  STARS.forEach(([l, t, s, d, dl, o, dx, dxe, f]) => {
    const star = el('span', 'home-hero-star');
    const props = {
      '--l': l,
      '--t': t,
      '--s': s,
      '--d': `${d}s`,
      '--dl': `${dl}s`,
      '--o': o,
      '--dx': dx,
      '--dxe': dxe,
      '--f': f,
    };
    Object.entries(props).forEach(([k, v]) => star.style.setProperty(k, v));
    star.append(el('i'));
    host.append(star);
  });
  return host;
}

export default function decorate(block) {
  if (block.querySelector('.home-hero-inner')) return;
  const section = block.closest('.section');
  if (section) section.dataset.cloudAvoid = '';

  const pictures = [...block.querySelectorAll('picture')];
  const media = pictures.length ? pictures : [...block.querySelectorAll('img')];
  const heading = block.querySelector('h1, h2, h3, h4, h5, h6');
  const ctas = [...block.querySelectorAll('p')].filter((p) => p.querySelector('a'));

  const inner = el('div', 'home-hero-inner');
  const shipRow = el('div', 'home-hero-ship-row');
  const ship = el('div', 'home-hero-ship');
  const frame = el('div', 'home-hero-frame');
  const shipSlot = el('div', 'home-hero-ship-img');
  const banner = el('div', 'home-hero-banner');
  const products = el('div', 'home-hero-products');
  const ctaRow = el('div', 'home-hero-ctas');

  const [shipPic, ...productPics] = media;
  if (shipPic) shipSlot.append(shipPic);
  if (heading) banner.append(heading);
  productPics.forEach((pic, i) => {
    const last = i === productPics.length - 1 && productPics.length > 1;
    const slot = el('div', last ? 'home-hero-products-mobile' : 'home-hero-products-desktop');
    if (productPics.length === 1) slot.className = 'home-hero-products-all';
    slot.append(pic);
    products.append(slot);
  });
  ctas.forEach((p) => {
    ctaRow.append(p);
    const a = p.querySelector('a');
    const href = a.getAttribute('href') || '';
    if (/^https?:/.test(href) && !href.includes(window.location.host)) {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    }
    if (href.startsWith('#')) {
      const icon = el('span', 'btn-icon', { 'aria-hidden': 'true' });
      icon.append(el('img', '', { src: `${ASSETS}/arrow-downward-brown.svg`, alt: '' }));
      a.prepend(icon);
      a.addEventListener('click', (e) => {
        const target = document.getElementById(href.slice(1));
        if (!target) return;
        e.preventDefault();
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        target.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' });
      });
    }
  });

  frame.append(buildStars(), shipSlot, banner);
  ship.append(frame);
  shipRow.append(ship);
  inner.append(
    deco('home-hero-cloud home-hero-cloud-tl', 'clouds-top-left.webp', 327, 302),
    deco('home-hero-cloud home-hero-cloud-tr', 'clouds-top-right.webp', 363, 302),
    shipRow,
    deco('home-hero-cloud-back', 'clouds-bottom-back.webp', 2081, 383),
    products,
    deco(
      'home-hero-cloud-front home-hero-cloud-front-d',
      'clouds-bottom-front-desktop.webp',
      1211,
      205,
    ),
    deco(
      'home-hero-cloud-front home-hero-cloud-front-m',
      'clouds-bottom-front-mobile.webp',
      481,
      166,
    ),
    ctaRow,
  );
  [...block.children].forEach((row) => row.remove());
  block.append(inner);
  block.setAttribute('aria-label', 'Hero banner');
  block.setAttribute('role', 'region');
}
