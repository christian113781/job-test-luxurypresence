/* ==========================================================
   Marci Metzger Homes - main.js
   Small, readable vanilla JavaScript. Sections:
   1. Mobile navigation
   2. Header background on scroll
   3. Reveal-on-scroll
   4. Gallery (missing-image fallback + lightbox)
   5. Contact form validation
   6. "Open now" office status
   ========================================================== */

(function () {
  'use strict';

  /* ---------- 1. MOBILE NAVIGATION ---------- */
  var header = document.getElementById('site-header');
  var navToggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('primary-nav');

  function setNav(open) {
    nav.classList.toggle('is-open', open);
    header.classList.toggle('nav-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('nav-locked', open);   // no scrolling behind the open menu
  }

  navToggle.addEventListener('click', function () {
    setNav(navToggle.getAttribute('aria-expanded') !== 'true');
  });

  // Close the menu after choosing a link
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setNav(false);
  });

  // Close with the Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
      setNav(false);
      navToggle.focus();
    }
  });

  // If the window grows to desktop size, reset the mobile menu
  window.matchMedia('(min-width: 768px)').addEventListener('change', function (e) {
    if (e.matches) setNav(false);
  });

  /* ---------- 2. HEADER BACKGROUND ON SCROLL ---------- */
  function updateHeader() {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  }
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  /* ---------- 2b. BACK-TO-TOP BUTTON ---------- */
  var toTop = document.getElementById('back-to-top');
  function updateToTop() {
    toTop.classList.toggle('is-visible', window.scrollY > 600);
  }
  updateToTop();
  window.addEventListener('scroll', updateToTop, { passive: true });

  /* ---------- 2c. LOGO CAROUSEL (arrow buttons only, no autoplay) ---------- */
  var track = document.getElementById('logo-track');
  var prevBtn = document.getElementById('logo-prev');
  var nextBtn = document.getElementById('logo-next');

  if (track && prevBtn && nextBtn) {
    var maxScroll = function () { return track.scrollWidth - track.clientWidth; };
    var step = function () { var li = track.querySelectorAll('li'); return li[1].offsetLeft - li[0].offsetLeft; };

    function go(dir) {
      var atEnd = track.scrollLeft >= maxScroll() - 2;
      var atStart = track.scrollLeft <= 2;
      if (dir > 0 && atEnd) track.scrollTo({ left: 0 });
      else if (dir < 0 && atStart) track.scrollTo({ left: maxScroll() });
      else track.scrollBy({ left: dir * step() });
    }

    prevBtn.addEventListener('click', function () { go(-1); });
    nextBtn.addEventListener('click', function () { go(1); });
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    });
  }

  /* ---------- 3. REVEAL-ON-SCROLL ---------- */
  var revealItems = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(function (el) { observer.observe(el); });
  } else {
    // Old browsers: just show everything
    revealItems.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- 4. GALLERY ---------- */
  var galleryItems = Array.prototype.slice.call(document.querySelectorAll('.g-item'));

  // If a gallery image file is missing, show a neutral block instead of a broken icon
  galleryItems.forEach(function (item) {
    var img = item.querySelector('img');
    function markMissing() { item.classList.add('is-missing'); }
    img.addEventListener('error', markMissing);
    if (img.complete && img.naturalWidth === 0) markMissing();
  });

  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var current = 0;

  function availableItems() {
    return galleryItems.filter(function (item) { return !item.classList.contains('is-missing'); });
  }

  function showPhoto(index) {
    var list = availableItems();
    if (!list.length) return;
    current = (index + list.length) % list.length;   // wrap around
    var item = list[current];
    lightboxImg.src = item.querySelector('.g-btn').dataset.full;
    lightboxImg.alt = item.querySelector('img').alt;
  }

  galleryItems.forEach(function (item) {
    item.querySelector('.g-btn').addEventListener('click', function () {
      if (item.classList.contains('is-missing') || typeof lightbox.showModal !== 'function') return;
      showPhoto(availableItems().indexOf(item));
      lightbox.showModal();
    });
  });

  document.getElementById('lightbox-close').addEventListener('click', function () { lightbox.close(); });
  document.getElementById('lightbox-prev').addEventListener('click', function () { showPhoto(current - 1); });
  document.getElementById('lightbox-next').addEventListener('click', function () { showPhoto(current + 1); });

  // Swipe left / right on the photo to change picture (phones)
  var touchX = null;
  lightboxImg.addEventListener('touchstart', function (e) { touchX = e.changedTouches[0].clientX; }, { passive: true });
  lightboxImg.addEventListener('touchend', function (e) {
    if (touchX === null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    touchX = null;
    if (Math.abs(dx) > 50) showPhoto(current + (dx < 0 ? 1 : -1));
  }, { passive: true });

  // Click on the dark backdrop closes the viewer
  lightbox.addEventListener('click', function (e) { if (e.target === lightbox) lightbox.close(); });

  // Arrow keys move between photos while the viewer is open
  lightbox.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') showPhoto(current - 1);
    if (e.key === 'ArrowRight') showPhoto(current + 1);
  });

  /* ---------- 5. CONTACT FORM ---------- */
  var form = document.getElementById('contact-form');
  var statusBox = document.getElementById('form-status');

  var checks = [
    { id: 'c-name',    error: 'c-name-error',    msg: 'Please enter your name.',
      ok: function (v) { return v.length > 0; } },
    { id: 'c-email',   error: 'c-email-error',   msg: 'Please enter a valid email address so Marci can reply.',
      ok: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); } },
    { id: 'c-message', error: 'c-message-error', msg: 'Please write a short message.',
      ok: function (v) { return v.length > 0; } }
  ];

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    statusBox.textContent = '';
    var firstBad = null;

    checks.forEach(function (c) {
      var input = document.getElementById(c.id);
      var err = document.getElementById(c.error);
      if (c.ok(input.value.trim())) {
        input.removeAttribute('aria-invalid');
        err.textContent = '';
      } else {
        input.setAttribute('aria-invalid', 'true');
        err.textContent = c.msg;
        if (!firstBad) firstBad = input;
      }
    });

    if (firstBad) { firstBad.focus(); return; }

    // TODO: connect a form service here (Formspree, Netlify Forms, etc.) - see README.
    statusBox.textContent = 'Thank you! Your message has been received.';
    form.reset();
  });

  /* ---------- 6. "OPEN NOW" OFFICE STATUS ---------- */
  // Office is open daily 8:00 am - 7:00 pm, Pahrump time (Pacific).
  var hoursStatus = document.getElementById('hours-status');

  try {
    var hour = parseInt(new Intl.DateTimeFormat('en-US', {
      hour: 'numeric', hour12: false, timeZone: 'America/Los_Angeles'
    }).format(new Date()), 10) % 24;

    hoursStatus.textContent = (hour >= 8 && hour < 19)
      ? 'Open now'
      : 'Closed now - appointments available, just call!';
  } catch (err) {
    hoursStatus.textContent = '';   // if the browser can't work out the time, show nothing
  }
})();
