/**
 * NASIR YOUSUF — LUXURY EDITORIAL PORTFOLIO JAVASCRIPT
 * Pure Vanilla ES6 JavaScript (No frameworks, no dependencies)
 */

// Ensure initial view starts at top unless an explicit anchor is requested
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

document.addEventListener('DOMContentLoaded', () => {
  if (!window.location.hash) {
    window.scrollTo(0, 0);
  }
  initThemeToggle();
  initHeroParallax();
  initConnectingWires();
  initPortraitToggle();
  initNavigationHighlight();
  initCopyButtons();
  initDhakaClock();
  initContactForm();
  initModals();
  initMobileMenu();
});

window.addEventListener('load', () => {
  if (typeof updateWires === 'function') {
    updateWires();
  }
});

/* --------------------------------------------------------------------------
   1. THEME TOGGLE (LIGHT / DARK)
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  if (!themeToggleBtn) return;

  const currentTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  themeToggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    showToast(`Switched to ${newTheme} mode`);
    // Re-draw wires with correct colors if needed
    updateWires();
  });
}

function updateThemeIcon(theme) {
  const iconContainer = document.getElementById('theme-toggle-icon');
  if (!iconContainer) return;

  if (theme === 'dark') {
    // Sun icon for switching back to light
    iconContainer.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
    `;
  } else {
    // Moon icon
    iconContainer.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    `;
  }
}

/* --------------------------------------------------------------------------
   2. HERO MOUSE PARALLAX TILT
   -------------------------------------------------------------------------- */
function initHeroParallax() {
  const stage = document.querySelector('.hero-visual-stage');
  const portrait = document.querySelector('.portrait-photo');
  const cards = document.querySelectorAll('.hero-card-floating');

  if (!stage || window.innerWidth < 860) return;

  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;

  stage.addEventListener('mousemove', (e) => {
    const rect = stage.getBoundingClientRect();
    targetX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    targetY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
  });

  stage.addEventListener('mouseleave', () => {
    targetX = 0;
    targetY = 0;
  });

  function renderTilt() {
    mouseX += (targetX - mouseX) * 0.08;
    mouseY += (targetY - mouseY) * 0.08;

    cards.forEach((c, idx) => {
      const fx = (idx % 2 === 0 ? 1 : -1) * (5 + idx * 1.5);
      const fy = (idx % 3 === 0 ? 1 : -1) * (4 + idx * 1.2);
      c.style.transform = `translate3d(${mouseX * fx}px, ${mouseY * fy}px, 0)`;
    });

    if (portrait) {
      portrait.style.transform = `translate3d(${mouseX * -5}px, ${mouseY * -2.5}px, 0)`;
    }

    requestAnimationFrame(renderTilt);
  }

  requestAnimationFrame(renderTilt);
}

/* --------------------------------------------------------------------------
   3. RESPONSIVE CONNECTING SPLINE WIRES
   -------------------------------------------------------------------------- */
function initPortraitToggle() {
  const portraitImg = document.getElementById('hero-portrait');
  if (!portraitImg) return;

  let isBw = true;

  const toggle = () => {
    isBw = !isBw;
    portraitImg.src = isBw ? 'image/nasir-portrait-bw.png' : 'image/nasir-portrait-color.png';
    showToast(isBw ? 'Monochrome portrait active' : 'Color portrait active');
  };

  portraitImg.style.cursor = 'pointer';
  portraitImg.style.pointerEvents = 'auto';
  portraitImg.addEventListener('click', toggle);
}

function initConnectingWires() {
  updateWires();
  window.addEventListener('resize', debounce(updateWires, 100));
}

function updateWires() {
  const cardVideo = document.getElementById('card-video');
  const cardWeb = document.getElementById('card-web');
  const cardCreative = document.getElementById('card-creative');
  const cardProjects = document.getElementById('card-projects');
  const cardCollab = document.getElementById('card-collab');
  const portraitWrapper = document.querySelector('.central-portrait-wrapper');
  const svg = document.querySelector('.connecting-wires-svg');

  if (!cardVideo || !cardWeb || !cardCreative || !cardProjects || !cardCollab || !portraitWrapper || !svg) return;

  const w1 = document.getElementById('wire-1');
  const w2 = document.getElementById('wire-2');
  const w3 = document.getElementById('wire-3');
  const w4 = document.getElementById('wire-4');
  const w5 = document.getElementById('wire-5');

  if (window.innerWidth < 860) {
    [w1, w2, w3, w4, w5].forEach(w => w && w.setAttribute('d', ''));
    return;
  }

  const svgRect = svg.getBoundingClientRect();
  const portRect = portraitWrapper.getBoundingClientRect();

  function drawCurve(fromRect, fromSide, toX, toY, wireEl, sag = 30) {
    if (!wireEl) return;
    const startX = fromSide === 'right' ? (fromRect.right - svgRect.left) : (fromRect.left - svgRect.left);
    const startY = fromRect.top + fromRect.height * 0.5 - svgRect.top;
    const endX = toX - svgRect.left;
    const endY = toY - svgRect.top;

    const dx = endX - startX;
    const c1x = startX + dx * 0.45;
    const c1y = startY + sag;
    const c2x = startX + dx * 0.8;
    const c2y = endY + (sag * 0.3);

    wireEl.setAttribute('d', `M ${startX} ${startY} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${endX} ${endY}`);
  }

  // Card 1: Video -> Nasir's right temple/hair
  drawCurve(cardVideo.getBoundingClientRect(), 'right', portRect.left + 210, portRect.top + 80, w1, 35);

  // Card 2: Web -> Nasir's right shoulder/chest
  drawCurve(cardWeb.getBoundingClientRect(), 'right', portRect.left + 130, portRect.top + 230, w2, 25);

  // Card 3: Creative -> Nasir's left temple/hair
  drawCurve(cardCreative.getBoundingClientRect(), 'left', portRect.right - 210, portRect.top + 80, w3, 35);

  // Card 4: Projects -> Nasir's left shoulder
  drawCurve(cardProjects.getBoundingClientRect(), 'left', portRect.right - 130, portRect.top + 210, w4, 25);

  // Card 5: Collab -> Nasir's lower torso
  drawCurve(cardCollab.getBoundingClientRect(), 'left', portRect.right - 90, portRect.top + 310, w5, 20);
}


/* --------------------------------------------------------------------------
   4. NAVIGATION HIGHLIGHTING (INTERSECTION OBSERVER)
   -------------------------------------------------------------------------- */
function initNavigationHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/* --------------------------------------------------------------------------
   5. COPY BUTTONS & TOAST NOTIFICATION
   -------------------------------------------------------------------------- */
function initCopyButtons() {
  const copyElements = document.querySelectorAll('[data-copy]');
  copyElements.forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = el.getAttribute('data-copy');
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`Copied to clipboard: ${textToCopy}`);
      }).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast(`Copied: ${textToCopy}`);
      });
    });
  });
}

let toastTimeout = null;
function showToast(message) {
  let toast = document.getElementById('toast-msg');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-msg';
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('show');

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* --------------------------------------------------------------------------
   6. REAL-TIME DHAKA, BANGLADESH CLOCK WIDGET
   -------------------------------------------------------------------------- */
function initDhakaClock() {
  const clockElement = document.getElementById('dhaka-live-clock');
  if (!clockElement) return;

  function updateClock() {
    const now = new Date();
    // UTC + 6 hours for Dhaka time
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const dhakaTime = new Date(utc + (3600000 * 6));

    let hours = dhakaTime.getHours();
    const minutes = String(dhakaTime.getMinutes()).padStart(2, '0');
    const seconds = String(dhakaTime.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 becomes 12
    const strHours = String(hours).padStart(2, '0');

    clockElement.textContent = `🇧🇩 Dhaka, BD: ${strHours}:${minutes}:${seconds} ${ampm} (GMT+6)`;
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/* --------------------------------------------------------------------------
   7. INTERACTIVE CONTACT FORM
   -------------------------------------------------------------------------- */
function initContactForm() {
  const contactForm = document.getElementById('portfolio-contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('form-name')?.value.trim() || 'Visitor';
    const email = document.getElementById('form-email')?.value.trim() || '';
    const subject = document.getElementById('form-subject')?.value || 'New Project Inquiry';
    const message = document.getElementById('form-message')?.value.trim() || '';

    if (!email || !message) {
      showToast('Please provide your email and message');
      return;
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = `<span>Sending...</span>`;
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      contactForm.reset();
      showToast('Thank you! Opening your email client to send message...');

      // Trigger mailto with formatted message
      const mailtoUrl = `mailto:nasiryousuf200511@gmail.com?subject=${encodeURIComponent(subject + ' - from ' + name)}&body=${encodeURIComponent('From: ' + name + ' (' + email + ')\n\n' + message)}`;
      window.location.href = mailtoUrl;
    }, 700);
  });
}

/* --------------------------------------------------------------------------
   8. MODALS (VIDEO SHOWCASE & EXPANDED VIEWS)
   -------------------------------------------------------------------------- */
function initModals() {
  const modal = document.getElementById('video-modal');
  const openButtons = document.querySelectorAll('[data-open-modal="video-modal"]');
  const closeButtons = document.querySelectorAll('[data-close-modal]');

  if (!modal) return;

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

/* --------------------------------------------------------------------------
   9. MOBILE DRAWER MENU
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const drawer = document.getElementById('mobile-nav-drawer');
  const closeBtn = document.getElementById('mobile-drawer-close');
  const drawerLinks = document.querySelectorAll('.mobile-nav-link');

  if (!mobileToggle || !drawer) return;

  mobileToggle.addEventListener('click', () => {
    drawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      drawer.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* --------------------------------------------------------------------------
   UTILITY: DEBOUNCE
   -------------------------------------------------------------------------- */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
