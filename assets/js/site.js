(function () {
  function safeStorageGet(key) {
    try {
      return window.localStorage ? window.localStorage.getItem(key) : null;
    } catch (e) {
      return null;
    }
  }

  function safeStorageSet(key, value) {
    try {
      if (window.localStorage) window.localStorage.setItem(key, value);
    } catch (e) {
      // Ignore storage errors and still close the banner.
    }
  }

  function closeCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    if (!banner) return;
    safeStorageSet('pcpropr-cookie-ok', '1');
    banner.hidden = true;
    banner.style.display = 'none';
    banner.setAttribute('aria-hidden', 'true');
  }

  window.pcproprAcceptCookies = closeCookieBanner;

  document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.site-nav');
    if (toggle && nav) {
      toggle.addEventListener('click', () => {
        const expanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!expanded));
        nav.classList.toggle('is-open');
      });
    }

    const banner = document.getElementById('cookie-banner');
    const accept = document.getElementById('accept-cookies');
    if (banner) {
      const accepted = safeStorageGet('pcpropr-cookie-ok');
      if (!accepted) {
        banner.hidden = false;
        banner.style.display = 'flex';
        banner.setAttribute('aria-hidden', 'false');
      } else {
        closeCookieBanner();
      }
    }

    if (accept) {
      accept.addEventListener('click', closeCookieBanner);
    }

    document.addEventListener('click', (event) => {
      const target = event.target;
      if (target && target.id === 'accept-cookies') {
        closeCookieBanner();
      }
    });
  });
})();
