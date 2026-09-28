/* ════════════════════════════════════════════════════════════════
   Prince Kumar Portfolio — JavaScript
   Features: Nav scroll state, mobile menu, hero canvas particles,
   IntersectionObserver scroll reveals, active nav link tracking,
   hero typewriter effect, floating tag animation stagger
   ════════════════════════════════════════════════════════════════ */

'use strict';

// ── NAVBAR ─────────────────────────────────────────────────────────
const navbar    = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navLinks  = document.getElementById('nav-links');
const allNavLinks = document.querySelectorAll('.nav-link');

// Scroll state
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveLink();
}, { passive: true });

// Mobile toggle
navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

// Close on link click (mobile)
navLinks.addEventListener('click', (e) => {
  if (e.target.classList.contains('nav-link')) {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});

// Active link tracking
function updateActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 80;
    if (window.scrollY >= top) current = section.getAttribute('id');
  });
  allNavLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}


// ── HERO CANVAS — Particle Network ─────────────────────────────────
(function initCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], animFrame;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r  = Math.random() * 2 + 0.5;
      this.alpha = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(99, 102, 241, ${this.alpha})`;
      ctx.fill();
    }
  }

  function init() {
    resize();
    particles = Array.from({ length: 90 }, () => new Particle());
    loop();
  }

  function drawConnections() {
    const maxDist = 140;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    animFrame = requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animFrame);
    resize();
    loop();
  }, { passive: true });

  init();
})();


// ── HERO TYPEWRITER ─────────────────────────────────────────────────
(function typewriter() {
  const el = document.getElementById('hero-eyebrow');
  if (!el) return;
  const texts = [
    '>_ AI / ML Engineer',
    '>_ Computer Vision',
    '>_ LLM Developer',
    '>_ Cloud Practitioner',
  ];
  let tIdx = 0, cIdx = 0, deleting = false;

  function tick() {
    const current = texts[tIdx];
    if (!deleting && cIdx < current.length) {
      el.innerHTML = `<span class="mono">${current.substring(0, ++cIdx)}</span>`;
      setTimeout(tick, 65);
    } else if (!deleting && cIdx === current.length) {
      deleting = true;
      setTimeout(tick, 2200);
    } else if (deleting && cIdx > 0) {
      el.innerHTML = `<span class="mono">${current.substring(0, --cIdx)}</span>`;
      setTimeout(tick, 35);
    } else {
      deleting = false;
      tIdx = (tIdx + 1) % texts.length;
      setTimeout(tick, 400);
    }
  }

  // slight delay before starting
  setTimeout(tick, 1000);
})();


// ── SCROLL REVEAL (IntersectionObserver) ───────────────────────────
(function initReveal() {
  const SELECTORS = '.reveal, .reveal-card';
  const els = document.querySelectorAll(SELECTORS);
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // stagger siblings slightly
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal, .reveal-card')];
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 80);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  });

  els.forEach(el => observer.observe(el));
})();


// ── SMOOTH SCROLL FOR ANCHOR LINKS ─────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});


// ── HERO CTA BUTTON — subtle bounce on load ─────────────────────────
window.addEventListener('load', () => {
  const cta = document.querySelector('.hero-cta .btn-primary');
  if (!cta) return;
  setTimeout(() => {
    cta.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
    cta.style.transform = 'scale(1.05)';
    setTimeout(() => { cta.style.transform = 'scale(1)'; }, 400);
  }, 1800);
});


// ── INITIAL SCROLL CHECK ─────────────────────────────────────────────
updateActiveLink();
if (window.scrollY > 40) navbar.classList.add('scrolled');
