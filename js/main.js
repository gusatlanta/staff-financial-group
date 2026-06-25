/* Staff Financial Group — Main JS */

// Scroll-aware navbar
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (toggle && navLinks) {
  toggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
  });
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      navLinks.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', false);
    }
  });
}

// Active nav link
const currentPath = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPath || (currentPath === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// Form submit (opt-in / contact)
document.querySelectorAll('form[data-form]').forEach(form => {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const btn  = this.querySelector('button[type="submit"]');
    const alert = this.querySelector('.alert');
    const orig = btn ? btn.textContent : '';

    if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

    // Simulate async — replace with Formspree/Netlify/mailto action as needed
    setTimeout(() => {
      if (alert) { alert.style.display = 'block'; }
      form.reset();
      if (btn) { btn.disabled = false; btn.textContent = orig; }
    }, 900);
  });
});
