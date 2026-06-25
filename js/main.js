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

// Form submit — posts to hundredx public inquiry API
const HUNDREDX_API = 'https://100xrecruiting.com';

document.querySelectorAll('form[data-form]').forEach(form => {
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const btn = this.querySelector('button[type="submit"]');
    const successEl = this.querySelector('.alert-success');
    const orig = btn ? btn.textContent : '';
    if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

    const d = Object.fromEntries(new FormData(form));
    const name = ((d.first_name || '') + ' ' + (d.last_name || '')).trim();
    const notes = [
      d.role_title   ? 'Role: '             + d.role_title   : '',
      d.hire_type    ? 'Type: '             + d.hire_type    : '',
      d.location     ? 'Location: '         + d.location     : '',
      d.timeline     ? 'Timeline: '         + d.timeline     : '',
      d.compensation ? 'Compensation: '     + d.compensation : '',
      d.your_title   ? 'Submitter title: '  + d.your_title   : '',
      d.phone        ? 'Phone: '            + d.phone        : '',
      d.message      ? 'Message: '          + d.message      : '',
      d.notes        ? 'Notes: '            + d.notes        : '',
    ].filter(Boolean).join('\n');

    try {
      const res = await fetch(HUNDREDX_API + '/api/public/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employer_name:    name || d.name || '',
          employer_email:   d.email || '',
          employer_company: d.company || '',
          inquiry_type:     form.dataset.form,
          notes:            notes,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (json.ok) {
        form.reset();
        if (successEl) successEl.style.display = 'block';
        if (btn) { btn.textContent = 'Sent ✓'; }
      } else {
        throw new Error(json.error || 'server error');
      }
    } catch {
      if (btn) { btn.disabled = false; btn.textContent = orig; }
      alert('Something went wrong — please email gus@stafffinancial.com directly.');
    }
  });
});
