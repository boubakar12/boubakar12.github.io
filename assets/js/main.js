/* Shared navigation and contact behavior. */
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  const closeMenu = () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  };
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && navLinks.classList.contains('open')) {
      closeMenu();
      navToggle.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-nav')) closeMenu();
  });
  window.matchMedia('(min-width: 641px)').addEventListener('change', event => {
    if (event.matches) closeMenu();
  });
}

// The small desktop rail follows whichever project is nearest the viewport center.
const sectionRail = document.querySelector('.section-nav');
if (sectionRail && 'IntersectionObserver' in window) {
  const links = [...sectionRail.querySelectorAll('a')];
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(link => {
        if (link.hash === `#heading-${entry.target.id.replace('project-', '')}`) {
          link.setAttribute('aria-current', 'location');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    });
  }, { rootMargin: '-20% 0px -45% 0px', threshold: 0 });
  document.querySelectorAll('.project-row').forEach(row => observer.observe(row));
}

// Compose an email draft in the visitor's mail app.
function handleSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const button = document.getElementById('submit-btn');
  const status = document.getElementById('form-ok');
  if (!(form instanceof HTMLFormElement) || !button || !status) return;
  const data = new FormData(form);
  const name = (data.get('name') || '').toString().trim();
  const email = (data.get('email') || '').toString().trim();
  const subject = (data.get('subject') || '').toString().trim() || `Portfolio inquiry from ${name || 'a visitor'}`;
  const message = (data.get('message') || '').toString().trim();
  const body = [name ? `Name: ${name}` : '', email ? `Email: ${email}` : '', '', message].join('\n');
  button.textContent = 'Open email again →';
  status.classList.add('visible');
  window.location.href = `mailto:bd453@cornell.edu?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
