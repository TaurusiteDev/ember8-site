// Ember 8 — shared site script

// Language toggle routing
const langMap = {
  // NL → EN
  '/index.html': '/en/index.html',
  '/': '/en/index.html',
  '/boeken.html': '/en/booking.html',
  '/contact.html': '/en/contact.html',
  '/privacy.html': '/en/privacy.html',
  '/over.html': '/en/about.html',
  '/voorwaarden.html': '/en/terms.html',
  '/disclaimer.html': '/en/disclaimer.html',
  // EN → NL
  '/en/': '/index.html',
  '/en/index.html': '/index.html',
  '/en/booking.html': '/boeken.html',
  '/en/contact.html': '/contact.html',
  '/en/privacy.html': '/privacy.html',
  '/en/about.html': '/over.html',
  '/en/terms.html': '/voorwaarden.html',
  '/en/disclaimer.html': '/disclaimer.html',
};

document.addEventListener('DOMContentLoaded', () => {
  const langToggle = document.getElementById('lang-toggle');
  if (langToggle) {
    langToggle.addEventListener('click', (e) => {
      e.preventDefault();
      let current = window.location.pathname;
      // Normalize trailing slash
      if (current.endsWith('/') && current !== '/') current = current + 'index.html';
      const target = langMap[current] || '/';
      window.location.href = target;
    });
  }

  // Mobile menu
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileClose = document.getElementById('mobile-close');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
  }
  if (mobileClose && mobileMenu) {
    mobileClose.addEventListener('click', () => mobileMenu.classList.remove('open'));
  }

  // Reveal on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Contact form success message (intercept submit, post via fetch if Formspree configured)
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      // If action still has placeholder, just show success demo
      const action = form.getAttribute('action') || '';
      if (action.includes('YOUR_FORM_ID')) {
        e.preventDefault();
        document.getElementById('form-success').classList.add('show');
        form.reset();
        return;
      }
      // Otherwise let Formspree handle, but also show success via fetch
      e.preventDefault();
      try {
        const res = await fetch(action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          document.getElementById('form-success').classList.add('show');
          form.reset();
        } else {
          form.submit();
        }
      } catch {
        form.submit();
      }
    });
  }

  // About Ember8 popup — opens an in-page modal instead of navigating to a
  // separate page, so the main nav can stay Home / Boeken / Contact.
  const aboutOpenBtn = document.getElementById('about-open-btn');
  const aboutModal = document.getElementById('about-modal');
  const aboutCloseBtn = document.getElementById('about-close-btn');

  const openAboutModal = () => {
    if (!aboutModal) return;
    aboutModal.classList.add('open');
    document.body.classList.add('modal-open');
  };
  const closeAboutModal = () => {
    if (!aboutModal) return;
    aboutModal.classList.remove('open');
    document.body.classList.remove('modal-open');
  };

  if (aboutOpenBtn) aboutOpenBtn.addEventListener('click', openAboutModal);
  if (aboutCloseBtn) aboutCloseBtn.addEventListener('click', closeAboutModal);
  if (aboutModal) {
    // Click on the dark overlay (outside the box) also closes it
    aboutModal.addEventListener('click', (e) => {
      if (e.target === aboutModal) closeAboutModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAboutModal();
  });
});
