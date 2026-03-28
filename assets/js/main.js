/* Boubakar Diallo Portfolio — main.js */

// NAV TOGGLE (mobile)
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
}

// SCROLL REVEAL
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.delay || 0);
      setTimeout(() => entry.target.classList.add('visible'), delay);
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// MODAL
function openModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('open');
  document.body.style.overflow = '';
}
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => {
      m.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
});

// TERMINAL TYPEWRITER
const TERMINAL_LINES = [
  { type: 'prompt', text: 'cat profile.txt' },
  { type: 'out',    text: 'Name: Boubakar Diallo' },
  { type: 'out',    text: 'Role: ECE @ Cornell, Class of 2028' },
  { type: 'out',    text: 'Focus: Embedded · FPGA · Edge AI · Robotics' },
  { type: 'prompt', text: 'ls -1 internships/' },
  { type: 'out',    text: 'simulacrum-nyc/  adas-safe/  beta-university/' },
  { type: 'out',    text: 'ewb-ithaca/  quincy-ma/' },
  { type: 'prompt', text: 'echo $AVAILABILITY' },
  { type: 'out',    text: 'Open to Summer 2026 internships ✓' },
];

function runTerminal() {
  const out = document.getElementById('term-output');
  if (!out || out.dataset.done) return;
  out.dataset.done = '1';
  out.innerHTML = '';
  let lineIdx = 0;

  function typeLine() {
    if (lineIdx >= TERMINAL_LINES.length) {
      out.innerHTML += `<div><span class="terminal-prompt">$ </span><span class="cursor-blink">▋</span></div>`;
      return;
    }
    const line = TERMINAL_LINES[lineIdx];
    const div = document.createElement('div');
    out.appendChild(div);
    let charIdx = 0;
    const isPrompt = line.type === 'prompt';
    const speed = isPrompt ? 34 : 10;

    const iv = setInterval(() => {
      const text = line.text.slice(0, charIdx);
      if (isPrompt) {
        div.innerHTML = `<span class="terminal-prompt">$ </span><span class="terminal-cmd">${text}<span class="cursor-blink">▋</span></span>`;
      } else {
        div.innerHTML = `<span class="terminal-out">${text}</span>`;
      }
      charIdx++;
      if (charIdx > line.text.length) {
        clearInterval(iv);
        if (isPrompt) {
          div.innerHTML = `<span class="terminal-prompt">$ </span><span class="terminal-cmd">${line.text}</span>`;
        } else {
          div.innerHTML = `<span class="terminal-out">${line.text}</span>`;
        }
        lineIdx++;
        setTimeout(typeLine, isPrompt ? 200 : 60);
      }
    }, speed);
  }
  typeLine();
}

// CONTACT FORM
function handleSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('submit-btn');
  const ok  = document.getElementById('form-ok');
  if (!btn || !ok) return;
  btn.textContent = 'Sent.';
  btn.style.background = '#1a3a5c';
  btn.disabled = true;
  ok.style.display = 'block';
}

// INIT
window.addEventListener('load', () => {
  runTerminal();
});