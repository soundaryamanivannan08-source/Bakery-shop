/**
 * Stackly Bakery - Common Site Navbar Script
 * Handles sticky navbar scroll state, mobile menu drawer toggle,
 * cart badge state, and shopping bag drawer trigger across all pages.
 */

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header') || document.getElementById('header');
  const mobileToggle = document.getElementById('mobileToggle') || document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const cartToggle = document.getElementById('cartToggle');
  const cartDot = document.getElementById('cartDot');

  // 1. Sticky Header Scroll Effect
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // 2. Mobile Drawer Navigation Toggle
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      if (isOpen) {
        mobileToggle.classList.add('active');
      } else {
        mobileToggle.classList.remove('active');
      }
    });

    // Close when clicking outside drawer
    document.addEventListener('click', (e) => {
      if (mobileDrawer.classList.contains('open') && !mobileDrawer.contains(e.target) && !mobileToggle.contains(e.target)) {
        mobileDrawer.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.classList.remove('active');
      }
    });

    // Close mobile drawer on escape
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        mobileDrawer.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.classList.remove('active');
      }
    });
  }

  // 3. Shopping Bag Button Trigger
  if (cartToggle) {
    cartToggle.addEventListener('click', (e) => {
      // Check if current page has an interactive cart modal
      const cartModalOverlay = document.getElementById('cartModalOverlay') || document.getElementById('cartModal');
      const cartDrawer = document.getElementById('cartDrawer');
      if (cartModalOverlay) {
        e.preventDefault();
        cartModalOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
      } else if (!cartDrawer) {
        // If not on catalogue page or index page with cartDrawer, navigate to catalogue
        if (!window.location.pathname.endsWith('catalogue.html')) {
          e.preventDefault();
          window.location.href = 'catalogue.html';
        }
      }
    });
  }

  // 4. Cart Dot Indicator
  if (cartDot) {
    try {
      const savedCart = localStorage.getItem('stackly_cart') || localStorage.getItem('kneadly_cart');
      if (savedCart) {
        const items = JSON.parse(savedCart);
        if (Array.isArray(items) && items.length > 0) {
          cartDot.classList.add('active');
        } else {
          cartDot.classList.remove('active');
        }
      } else {
        // Default sample cart has items as shown in Figma mockup
        cartDot.classList.add('active');
      }
    } catch (_) {
      cartDot.classList.add('active');
    }
  }

  // 5. Ensure Footer Navigation Links Redirect to Respective Pages
  document.addEventListener('click', (e) => {
    const footerLink = e.target.closest('footer a, .site-footer a, .catalogue-footer a, .about-footer a, .contact-footer a, .blog-footer a');
    if (footerLink) {
      const href = (footerLink.getAttribute('href') || '').trim();
      if (
        href.includes('catalogue.html') || 
        href.includes('about.html') || 
        href.includes('contact.html') || 
        href.includes('blog.html') || 
        href.includes('index.html')
      ) {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = href;
        return;
      }
    }
  }, true);

  // 6. Universal Click Redirect to 404.html (Excluding Navbar, Respective Site Pages & Footer Links)
  const isExemptPage = window.location.pathname.endsWith('login.html') || 
                       window.location.pathname.endsWith('signup.html') || 
                       window.location.pathname.endsWith('404.html');
  if (!isExemptPage) {
    document.addEventListener('click', (e) => {
      // 1. Do NOT touch navbar or mobile drawer
      if (e.target.closest('#siteHeader, .site-header, #header, .header-container, .desktop-nav, .mobile-nav-drawer, #mobileDrawer, #mobileToggle, #mobileMenuToggle')) {
        return;
      }

      // 2. Do NOT touch modal/drawer close buttons, cart controls, or interactive modals
      if (e.target.closest(
        '#cartCloseBtn, #cartClose, .cart-close-btn, ' +
        '#modalCloseBtn, #searchCloseBtn, #inquiryCloseBtn, #quickviewClose, .modal-close-btn, .quickview-close, ' +
        '[data-close], [aria-label*="close" i], ' +
        '#cartModalOverlay, .cart-modal-overlay, #cartDrawer, .cart-drawer, ' +
        '.cart-modal-drawer, .cart-drawer-panel, .qty-btn, .cart-item-remove, .cart-inc-btn, .cart-dec-btn, #clearCartBtn, ' +
        '.story-modal, .search-modal, .inquiry-modal, .modal-overlay, .modal-backdrop'
      )) {
        const explicit404 = e.target.closest('a[href*="404.html"]');
        if (explicit404) {
          return;
        }
        return;
      }

      // 2b. Do NOT touch forms or submit buttons inside forms (forms handle their own strict validation)
      if (e.target.closest('form, button[type="submit"], input[type="submit"], .contact-form-btn, .strip-btn, .newsletter-btn, .btn-orange-pill[type="submit"]')) {
        return;
      }

      // 2. Do NOT touch footer navigation links
      if (e.target.closest('footer, .site-footer, .catalogue-footer, .about-footer, .contact-footer, .blog-footer')) {
        const footerLink = e.target.closest('a');
        if (footerLink) {
          const href = (footerLink.getAttribute('href') || '').trim();
          if (
            href.includes('catalogue.html') || 
            href.includes('about.html') || 
            href.includes('contact.html') || 
            href.includes('blog.html') || 
            href.includes('index.html') ||
            href.includes('login.html') || 
            href.includes('signup.html')
          ) {
            return;
          }
        }
      }

      // 3. Do NOT touch links to valid site pages
      const link = e.target.closest('a');
      if (link) {
        const href = (link.getAttribute('href') || '').trim();
        if (
          href.includes('catalogue.html') || 
          href.includes('about.html') || 
          href.includes('contact.html') || 
          href.includes('blog.html') || 
          href.includes('index.html') ||
          href.includes('login.html') || 
          href.includes('signup.html') ||
          href.startsWith('tel:') ||
          href.startsWith('mailto:')
        ) {
          return;
        }
      }

      // 4. Match any button, link, icon, or clickable element
      const clickable = e.target.closest(
        'a, button, input[type="submit"], input[type="button"], [role="button"], [role="tab"], i, svg, path, ' +
        '[class*="btn"], [class*="link"], [class*="badge"], [data-story-id], [data-add-to-cart], ' +
        '[data-filter], [data-category], .filter-btn, .filter-pill, .tab-btn, .faq-question, .back-to-top, ' +
        '.hero-floating-badge, .card-quick-add, .social-circle-link, .footer-social-btn, .social-btn'
      );
      
      if (clickable) {
        // Double check it's not a link to a valid site page
        if (clickable.tagName && clickable.tagName.toLowerCase() === 'a') {
          const href = (clickable.getAttribute('href') || '').trim();
          if (
            href.includes('catalogue.html') || 
            href.includes('about.html') || 
            href.includes('contact.html') || 
            href.includes('blog.html') || 
            href.includes('index.html') ||
            href.includes('login.html') || 
            href.includes('signup.html') ||
            href.startsWith('tel:') ||
            href.startsWith('mailto:')
          ) {
            return;
          }
        }

        e.preventDefault();
        e.stopPropagation();
        window.location.href = '404.html';
      }
    }, true);
  }
});

