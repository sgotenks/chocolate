/* promo-prize-slider driver — mirrors the observed live mechanics only:
   a pagination click moves the track (transform, 0.3 s) and swaps the active dot
   (width / background / opacity, 0.6 s ease-in-out, in CSS). No autoplay fired on live. */
(() => {
  document.querySelectorAll('.promo-prizes').forEach((slider) => {
    const track = slider.querySelector('.promo-prizes__track');
    const dots = [...slider.querySelectorAll('.promo-prizes__dot')];
    if (!track || dots.length < 2) return;
    const go = (index) => {
      track.style.transform = `translate3d(${-100 * index}%, 0, 0)`;
      dots.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === index);
        if (i === index) dot.setAttribute('aria-current', 'true');
        else dot.removeAttribute('aria-current');
      });
    };
    dots.forEach((dot, i) => dot.addEventListener('click', () => go(i)));
  });
})();
