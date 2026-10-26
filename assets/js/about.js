/**
 * Stackly Bakery - About Page Application
 * Vanilla JavaScript: Sticky navbar, mobile menu drawer,
 * product interactions, and visit newsletter subscription.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. STICKY NAVBAR SCROLL STATE (Handled primarily by navbar.js)
  // --------------------------------------------------------------------------
  const header = document.getElementById('aboutHeader');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // --------------------------------------------------------------------------
  // 2. MOBILE DRAWER NAVIGATION
  // --------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileDrawerClose = document.getElementById('mobileDrawerClose');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  if (mobileDrawerClose && mobileDrawer) {
    mobileDrawerClose.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  // --------------------------------------------------------------------------
  // 3. VISIT NEWSLETTER SUBSCRIPTION FORM
  // --------------------------------------------------------------------------
  const visitForm = document.getElementById('visitForm');
  const visitEmail = document.getElementById('visitEmail');
  const visitSubmitBtn = document.getElementById('visitSubmitBtn');
  const visitFeedback = document.getElementById('visitFeedback');

  if (visitForm && visitEmail) {
    visitEmail.addEventListener('input', () => {
      visitEmail.classList.remove('is-invalid');
      visitEmail.style.borderColor = '';
      if (visitFeedback) {
        visitFeedback.textContent = '';
        visitFeedback.className = 'visit-feedback';
      }
    });

    visitForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = visitEmail.value.trim();
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (!email) {
        visitEmail.focus();
        visitEmail.classList.add('is-invalid');
        if (visitFeedback) {
          visitFeedback.textContent = 'Email is required';
          visitFeedback.className = 'visit-feedback error';
        }
        return;
      }

      if (!emailRegex.test(email)) {
        visitEmail.focus();
        visitEmail.classList.add('is-invalid');
        if (visitFeedback) {
          visitFeedback.textContent = 'Please enter a valid email address';
          visitFeedback.className = 'visit-feedback error';
        }
        return;
      }

      visitEmail.classList.remove('is-invalid');
      visitEmail.style.borderColor = '';
      if (visitFeedback) {
        visitFeedback.className = 'visit-feedback';
        visitFeedback.textContent = '';
      }
      visitSubmitBtn.disabled = true;
      visitSubmitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Subscribing...';

      setTimeout(() => {
        visitSubmitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Subscribed!';
        visitSubmitBtn.style.backgroundColor = '#16A34A';
        if (visitFeedback) {
          visitFeedback.textContent = `Welcome to the Bread Club! We've sent morning hold perks to ${email}.`;
          visitFeedback.className = 'visit-feedback active';
        }
        visitEmail.value = '';

        try {
          localStorage.setItem('stackly_about_subscribed', 'true');
        } catch (_) {}
      }, 700);
    });
  }

  // --------------------------------------------------------------------------
  // 4. FLOATING BADGE & STORY JUMP
  // --------------------------------------------------------------------------
  const heroBadge = document.querySelector('.hero-floating-badge');
  if (heroBadge) {
    heroBadge.addEventListener('click', () => {
      const heritageSection = document.getElementById('heritage');
      if (heritageSection) {
        heritageSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // --------------------------------------------------------------------------
  // 5. SMOOTH ANCHOR NAVIGATION FOR SECTIONS
  // --------------------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // --------------------------------------------------------------------------
  // 6. AOS (ANIMATE ON SCROLL) CDNJS INITIALIZATION
  // --------------------------------------------------------------------------
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 750,
      easing: 'ease-out-cubic',
      once: true,
      offset: 40,
      disableMutationObserver: false
    });
  }
});

