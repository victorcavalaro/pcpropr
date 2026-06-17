/*
  home-sidebar-search.js
  Sidebar live search filter + mobile nav toggle for Pcpropr home redesign
*/
(function () {
  'use strict';

  /* ── Mobile menu toggle ─────────────────────────────────────────────── */
  function setupMobileNav() {
    const toggle = document.querySelector('.ap-menu-toggle');
    const nav = document.querySelector('.ap-nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('is-open');
    });

    nav.addEventListener('click', (e) => {
      if (e.target.closest('.ap-nav-link')) {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
      }
    });
  }

  /* ── Sidebar live search ─────────────────────────────────────────────── */
  function setupSidebarSearch() {
    const input = document.getElementById('sidebar-search');
    const list  = document.getElementById('sidebar-posts');
    if (!input || !list) return;

    function filterItems(query) {
      const q = query.toLowerCase().trim();
      const items = list.querySelectorAll('.sidebar-post-item');
      items.forEach((item) => {
        const text = item.textContent.toLowerCase();
        if (!q || text.includes(q)) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    }

    input.addEventListener('input', () => filterItems(input.value));
    input.addEventListener('search', () => filterItems(input.value));
  }

  /* ── Cookie banner for the new ap-cookie design ─────────────────────── */
  function setupApCookieBanner() {
    const banner = document.getElementById('ap-cookie-banner');
    const btn    = document.getElementById('ap-accept-cookies');
    if (!banner) return;

    function close() {
      try { localStorage.setItem('pcpropr-cookie-ok', '1'); } catch(e) {}
      banner.hidden = true;
    }

    // Also override the global so any lingering onclick calls work
    window.pcproprAcceptCookies = close;

    try {
      if (localStorage.getItem('pcpropr-cookie-ok')) {
        banner.hidden = true;
        return;
      }
    } catch(e) {}

    // Show with a slight delay so it doesn't flash on first paint
    setTimeout(() => { banner.hidden = false; }, 800);
    if (btn) btn.addEventListener('click', close);
  }

  /* ── Thermometer animation on load ──────────────────────────────────── */
  function animateThermometer() {
    const fill = document.getElementById('thermo-fill');
    if (!fill) return;
    // Start from 0 and animate to target
    const target = parseFloat(fill.style.height) || 72;
    fill.style.height = '0%';
    requestAnimationFrame(() => {
      setTimeout(() => {
        fill.style.height = target + '%';
      }, 300);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    setupMobileNav();
    setupSidebarSearch();
    setupApCookieBanner();
    animateThermometer();
  });
})();
