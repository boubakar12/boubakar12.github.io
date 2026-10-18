/* Boubakar Diallo Portfolio — main.js */

// NAV TOGGLE (mobile)
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
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
document.querySelectorAll('.reveal').forEach(el => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.classList.add('visible');
  } else {
    el.classList.add('pending-reveal');
    revealObs.observe(el);
  }
});

// TERMINAL TYPEWRITER
const TERMINAL_LINES = [
  { type: 'prompt', text: 'cat profile.txt' },
  { type: 'out',    text: 'Name: Boubakar Diallo' },
  { type: 'out',    text: 'Role: ECE @ Cornell, Class of 2028' },
  { type: 'out',    text: 'Focus: Embedded · FPGA · Edge AI · Robotics' },
  { type: 'prompt', text: 'ls projects/' },
  { type: 'out',    text: 'risc-v/  rtos/  robotics/  forecasting/' },
  { type: 'prompt', text: 'cat next.txt' },
  { type: 'out',    text: 'PNC · Technology Intern · Summer 2027' },
];

function runTerminal() {
  const out = document.getElementById('term-output');
  if (!out || out.dataset.done) return;
  out.dataset.done = '1';
  out.innerHTML = '';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    TERMINAL_LINES.forEach(line => {
      const div = document.createElement('div');
      div.className = line.type === 'prompt' ? 'terminal-cmd' : 'terminal-out';
      div.textContent = (line.type === 'prompt' ? '$ ' : '') + line.text;
      out.append(div);
    });
    return;
  }
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
  const form = e.target;
  const btn = document.getElementById('submit-btn');
  const ok  = document.getElementById('form-ok');
  if (!(form instanceof HTMLFormElement) || !btn || !ok) return;

  const data = new FormData(form);
  const name = (data.get('name') || '').toString().trim();
  const email = (data.get('email') || '').toString().trim();
  const subjectInput = (data.get('subject') || '').toString().trim();
  const message = (data.get('message') || '').toString().trim();

  const subject = subjectInput || `Portfolio inquiry from ${name || 'a visitor'}`;
  const body = [
    name ? `Name: ${name}` : '',
    email ? `Email: ${email}` : '',
    '',
    message,
  ].join('\n');

  btn.textContent = 'Open email again →';
  ok.classList.add('visible');

  window.location.href = `mailto:bd453@cornell.edu?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// INIT
window.addEventListener('load', () => {
  runTerminal();
});
