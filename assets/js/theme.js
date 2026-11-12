/* Apply the saved theme before paint, then wire up the shared switch. */
(() => {
  const key = 'boubakar-portfolio-theme';
  const preference = window.matchMedia('(prefers-color-scheme: dark)');
  let saved;
  try { saved = localStorage.getItem(key); } catch { /* Storage may be unavailable. */ }
  if (saved !== 'light' && saved !== 'dark') saved = null;

  function apply(theme) {
    document.documentElement.dataset.theme = theme;
    document.querySelectorAll('.theme-toggle').forEach(button => {
      const dark = theme === 'dark';
      button.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} mode`);
      button.setAttribute('aria-pressed', String(dark));
      button.querySelector('.theme-toggle-icon').textContent = dark ? '☼' : '☾';
    });
  }

  apply(saved || (preference.matches ? 'dark' : 'light'));
  document.addEventListener('DOMContentLoaded', () => {
    apply(document.documentElement.dataset.theme);
    document.querySelectorAll('.theme-toggle').forEach(button => {
      button.addEventListener('click', () => {
        saved = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
        apply(saved);
        try { localStorage.setItem(key, saved); } catch { /* Keep the current session usable. */ }
      });
    });
  });
  preference.addEventListener('change', event => {
    if (!saved) apply(event.matches ? 'dark' : 'light');
  });
  window.addEventListener('storage', event => {
    if (event.key !== key) return;
    saved = event.newValue === 'light' || event.newValue === 'dark' ? event.newValue : null;
    apply(saved || (preference.matches ? 'dark' : 'light'));
  });
})();
