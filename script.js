// Ember 8 — shared site script

// Language toggle routing
const langMap = {
  '/index.html': '/en/index.html',
  '/': '/en/index.html',
  '/boeken.html': '/en/booking.html',
  '/contact.html': '/en/contact.html',
  '/en/': '/index.html',
  '/en/index.html': '/index.html',
  '/en/booking.html': '/boeken.html',
  '/en/contact.html': '/contact.html',
};

document.addEventListener('DOMContentLoaded', () => {
  const langToggle = document.getElementById('lang-toggle');
  if (langToggle) {
    langToggle.addEventListener('click', (e) => {
      e.preventDefault();
      let current = window.location.pathname;
      // Normalize trailing index
      if (current.endsWith('/')) current = current + 'index.html';
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
});
