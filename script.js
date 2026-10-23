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
      ctx.fillStyle = `rgba(62, 111, 150, ${this.alpha})`;
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
          ctx.strokeStyle = `rgba(62, 111, 150, ${alpha})`;
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


// ── GOOGLE SKILLS INTERACTIVE SYSTEM ─────────────────────────────────
(function initGoogleSkills() {
  const banner = document.getElementById('google-profile-banner');
  const pointsEl = document.getElementById('g-stat-points');
  const badgesEl = document.getElementById('g-stat-badges');
  const labsEl = document.getElementById('g-stat-labs');

  // 1. Dynamic Stats Counter Animation on Scroll
  if (banner && pointsEl && badgesEl) {
    let animated = false;
    function animateValue(el, start, end, duration, formatComma = false) {
      const startTime = performance.now();
      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // ease-out cubic
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (end - start) * ease);
        el.textContent = formatComma ? current.toLocaleString() : current;
        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = formatComma ? end.toLocaleString() : end;
        }
      }
      requestAnimationFrame(update);
    }

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          animateValue(pointsEl, 0, 22655, 1600, true);
          animateValue(badgesEl, 0, 27, 1200, false);
          if (labsEl) animateValue(labsEl, 0, 28, 1200, false);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    counterObserver.observe(banner);
  }

  // 2. Interactive Filtering & Search
  const filterTabs = document.querySelectorAll('.filter-tab');
  const searchInput = document.getElementById('badge-search-input');
  const searchClear = document.getElementById('badge-search-clear');
  const countIndicator = document.getElementById('visible-badge-count');
  const emptyState = document.getElementById('badges-empty-state');
  const resetBtn = document.getElementById('reset-badge-filters-btn');
  const badgeCards = document.querySelectorAll('#badges-grid .badge-card');

  let currentCategory = 'all';
  let currentSearch = '';

  function filterBadges() {
    let visibleCount = 0;
    const query = currentSearch.trim().toLowerCase();

    badgeCards.forEach(card => {
      const cat = card.dataset.cat || '';
      const title = (card.dataset.title || '').toLowerCase();
      const desc = (card.dataset.desc || '').toLowerCase();
      const tags = (card.dataset.tags || '').toLowerCase();

      const matchesCat = (currentCategory === 'all' || cat === currentCategory);
      const matchesSearch = !query || 
        title.includes(query) || 
        desc.includes(query) || 
        tags.includes(query);

      if (matchesCat && matchesSearch) {
        card.classList.remove('hidden');
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.classList.add('hidden');
        card.style.display = 'none';
      }
    });

    if (countIndicator) countIndicator.textContent = String(visibleCount);

    if (emptyState) {
      if (visibleCount === 0) {
        emptyState.style.display = 'block';
      } else {
        emptyState.style.display = 'none';
      }
    }
  }

  // Category Tab clicks
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      currentCategory = tab.dataset.filter || 'all';
      filterBadges();
    });
  });

  // Search input typing
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value;
      if (searchClear) {
        searchClear.style.display = currentSearch ? 'block' : 'none';
      }
      filterBadges();
    });
  }

  // Clear search button
  if (searchClear && searchInput) {
    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      currentSearch = '';
      searchClear.style.display = 'none';
      searchInput.focus();
      filterBadges();
    });
  }

  // Reset filters button
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      currentCategory = 'all';
      currentSearch = '';
      if (searchInput) searchInput.value = '';
      if (searchClear) searchClear.style.display = 'none';

      filterTabs.forEach(t => {
        const isAll = t.dataset.filter === 'all';
        t.classList.toggle('active', isAll);
        t.setAttribute('aria-selected', String(isAll));
      });

      filterBadges();
    });
  }

  // 3. 3D Card Tilt & Holographic Foil Effect
  const tiltCards = document.querySelectorAll('.tilt-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
      card.style.setProperty('--sheen-x', `${((x / rect.width) * 100).toFixed(1)}%`);
      card.style.setProperty('--sheen-y', `${((y / rect.height) * 100).toFixed(1)}%`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.removeProperty('--sheen-x');
      card.style.removeProperty('--sheen-y');
    });
  });

  // 4. Interactive Badge Modal Inspector
  const modal = document.getElementById('badge-modal');
  const modalClose = document.getElementById('badge-modal-close');
  const modalImg = document.getElementById('modal-badge-img');
  const modalCat = document.getElementById('modal-badge-cat');
  const modalTitle = document.getElementById('modal-badge-title');
  const modalDate = document.getElementById('modal-badge-date');
  const modalDesc = document.getElementById('modal-badge-desc');
  const modalTags = document.getElementById('modal-badge-tags');
  const modalLink = document.getElementById('modal-credential-link');
  const modalCopy = document.getElementById('modal-copy-link');
  const copyText = document.getElementById('copy-text');

  function openBadgeModal(card) {
    if (!modal) return;
    const title = card.dataset.title || '';
    const cat = card.dataset.cat || '';
    const date = card.dataset.date || '';
    const img = card.dataset.img || '';
    const verify = card.dataset.verify || '';
    const desc = card.dataset.desc || '';
    const tags = (card.dataset.tags || '').split(',').map(t => t.trim()).filter(Boolean);

    if (modalTitle) modalTitle.textContent = title;
    if (modalCat) {
      const catMap = {
        'genai': 'Generative AI & Gemini',
        'deep-learning': 'Deep Learning & NLP',
        'responsible-ai': 'Responsible AI & Safety',
        'cloud-mlops': 'Cloud & MLOps',
        'credly': 'AWS Cloud',
        'aws': 'AWS Cloud'
      };
      modalCat.textContent = catMap[cat] || cat;
    }
    if (modalDate) modalDate.textContent = `Earned ${date}`;
    if (modalImg) {
      modalImg.src = img;
      modalImg.alt = title;
    }
    if (modalDesc) modalDesc.textContent = desc;

    if (cat === 'credly' || cat === 'aws') {
      if (modalLink) modalLink.textContent = 'View on Credly ↗';
    } else {
      if (modalLink) modalLink.textContent = 'View on Google Skills ↗';
    }

    if (modalTags) {
      modalTags.innerHTML = '';
      tags.forEach(tag => {
        const span = document.createElement('span');
        span.className = 'tag tag-primary mono';
        span.textContent = tag;
        modalTags.appendChild(span);
      });
    }

    if (modalLink) modalLink.href = verify;
    if (modalCopy) {
      modalCopy.dataset.copyUrl = verify;
      if (copyText) copyText.textContent = 'Copy Link';
    }

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeBadgeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Open on card click
  document.querySelectorAll('.badge-card, .spotlight-card, .credly-badge-chip, .credly-badge-showcase-chip').forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't trigger modal if user clicked a direct external link button inside card
      if (e.target.closest('a')) return;
      openBadgeModal(card);
    });
  });

  // Close handlers
  if (modalClose) {
    modalClose.addEventListener('click', closeBadgeModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeBadgeModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeBadgeModal();
    }
  });

  // Copy link action
  if (modalCopy) {
    modalCopy.addEventListener('click', async () => {
      const url = modalCopy.dataset.copyUrl || window.location.href;
      try {
        await navigator.clipboard.writeText(url);
        if (copyText) copyText.textContent = '✓ Copied!';
        setTimeout(() => {
          if (copyText) copyText.textContent = 'Copy Link';
        }, 2200);
      } catch (err) {
        if (copyText) copyText.textContent = 'Link copied!';
      }
    });
  }
})();
