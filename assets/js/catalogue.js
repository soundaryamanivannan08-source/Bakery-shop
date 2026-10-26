/**
 * Stackly Bakery - Catalogue & Hearth Selection Application
 * Vanilla JavaScript: Sticky navbar, category filter pills,
 * shopping bag drawer, quantity management, newsletter, and mobile drawer.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. STICKY NAVBAR SCROLL STATE
  // --------------------------------------------------------------------------
  const header = document.getElementById('catalogueHeader');
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
  // 3. CATEGORY FILTER PILLS
  // --------------------------------------------------------------------------
  const filterPills = document.querySelectorAll('.filter-pill');
  const productCards = document.querySelectorAll('.product-card');

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const selectedCategory = pill.getAttribute('data-category');

      productCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (selectedCategory === 'all' || cardCategory === selectedCategory) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
            if (typeof AOS !== 'undefined') {
              AOS.refresh();
            }
          }, 200);
        }
      });
    });
  });


  // --------------------------------------------------------------------------
  // 4. INTERACTIVE SHOPPING BAG DRAWER
  // --------------------------------------------------------------------------
  const cartToggle = document.getElementById('cartToggle');
  const cartOverlay = document.getElementById('cartModalOverlay');
  const cartCloseBtn = document.getElementById('cartCloseBtn');
  const cartItemsContainer = document.getElementById('cartItemsList');
  const cartBadge = document.querySelector('.nav-cart-badge');
  const cartSubtotalEl = document.getElementById('cartSubtotal');
  const cartTotalEl = document.getElementById('cartTotal');

  // Default sample items matching Figma mock
  let cart = [
    {
      id: 'croissant',
      name: 'Classic Butter Croissant',
      price: 4.50,
      qty: 1,
      img: 'assets/images/catalogue_spotlight_croissant.webp'
    },
    {
      id: 'sourdough',
      name: 'Country Sourdough',
      price: 8.50,
      qty: 1,
      img: 'assets/images/catalogue_spotlight_sourdough.webp'
    }
  ];

  // Try load from localStorage if exists
  try {
    const saved = localStorage.getItem('stackly_cart');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        cart = parsed;
      }
    }
  } catch (_) {}

  function saveCart() {
    try {
      localStorage.setItem('stackly_cart', JSON.stringify(cart));
    } catch (_) {}
  }

  function renderCart() {
    if (!cartItemsContainer) return;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="cart-empty-message">
          <i class="fa-solid fa-basket-shopping" style="font-size: 2.5rem; color: var(--color-caramel); margin-bottom: 1rem; display: block;"></i>
          <p style="font-weight: 700; color: #fff; margin-bottom: 0.5rem;">Your shopping bag is empty</p>
          <p style="font-size: 0.88rem; color: var(--text-dark-muted);">Browse our fresh daily hearth pulls and flaky pastries to add your favorites.</p>
        </div>
      `;
      if (cartSubtotalEl) cartSubtotalEl.textContent = '$0.00';
      if (cartTotalEl) cartTotalEl.textContent = '$0.00';
      if (cartBadge) cartBadge.textContent = '0';
      return;
    }

    let subtotal = 0;
    let totalItems = 0;
    let html = '';

    cart.forEach((item, index) => {
      const itemTotal = item.price * item.qty;
      subtotal += itemTotal;
      totalItems += item.qty;

      html += `
        <div class="cart-item" data-id="${item.id}">
          <img src="${item.img}" alt="${item.name}" class="cart-item-thumb">
          <div class="cart-item-details">
            <h4 class="cart-item-name">${item.name}</h4>
            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
          </div>
          <div class="cart-item-qty">
            <button class="qty-btn" data-action="dec" data-index="${index}" aria-label="Decrease quantity">&minus;</button>
            <span class="qty-number">${item.qty}</span>
            <button class="qty-btn" data-action="inc" data-index="${index}" aria-label="Increase quantity">&plus;</button>
          </div>
          <button class="cart-item-remove" data-index="${index}" aria-label="Remove item">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      `;
    });

    cartItemsContainer.innerHTML = html;

    const total = subtotal; // No tax on unheated bakery items in NY or inclusive
    if (cartSubtotalEl) cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (cartTotalEl) cartTotalEl.textContent = `$${total.toFixed(2)}`;
    if (cartBadge) cartBadge.textContent = totalItems.toString();

    // Attach listeners to newly rendered qty & remove buttons
    cartItemsContainer.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.currentTarget.getAttribute('data-action');
        const idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
        if (action === 'inc') {
          cart[idx].qty += 1;
        } else if (action === 'dec') {
          cart[idx].qty -= 1;
          if (cart[idx].qty <= 0) {
            cart.splice(idx, 1);
          }
        }
        saveCart();
        renderCart();
      });
    });

    cartItemsContainer.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
        cart.splice(idx, 1);
        saveCart();
        renderCart();
      });
    });
  }

  function openCart() {
    if (!cartOverlay) return;
    renderCart();
    cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCart(e) {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    if (!cartOverlay) return;
    cartOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (cartToggle) {
    cartToggle.addEventListener('click', (e) => {
      e.preventDefault();
      openCart();
    });
  }

  if (cartCloseBtn) {
    cartCloseBtn.addEventListener('click', (e) => {
      closeCart(e);
    });
  }

  if (cartOverlay) {
    cartOverlay.addEventListener('click', (e) => {
      if (e.target === cartOverlay) closeCart();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cartOverlay && cartOverlay.classList.contains('open')) {
      closeCart();
    }
  });

  // Global Add to Bag Handler for all cards & spotlight buttons
  document.querySelectorAll('[data-add-to-cart]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-id');
      const name = btn.getAttribute('data-name');
      const price = parseFloat(btn.getAttribute('data-price'));
      const img = btn.getAttribute('data-img');

      const existingIndex = cart.findIndex(item => item.id === id);
      if (existingIndex > -1) {
        cart[existingIndex].qty += 1;
      } else {
        cart.push({ id, name, price, qty: 1, img });
      }

      saveCart();
      renderCart();

      // Button feedback
      const originalHtml = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Added!';
      btn.style.backgroundColor = '#16A34A';
      btn.style.borderColor = '#16A34A';
      btn.style.color = '#FFFFFF';

      setTimeout(() => {
        btn.innerHTML = originalHtml;
        btn.style.backgroundColor = '';
        btn.style.borderColor = '';
        btn.style.color = '';
      }, 1500);
    });
  });

  // Initial render of cart
  renderCart();

  // --------------------------------------------------------------------------
  // 5. NEWSLETTER SUBSCRIPTION STRIP
  // --------------------------------------------------------------------------
  const newsletterForm = document.getElementById('catalogueNewsletterForm');
  const newsletterEmail = document.getElementById('catalogueNewsletterEmail');
  const newsletterBtn = document.getElementById('catalogueNewsletterBtn');
  const newsletterFeedback = document.getElementById('catalogueNewsletterFeedback');

  if (newsletterForm && newsletterEmail) {
    newsletterEmail.addEventListener('input', () => {
      newsletterEmail.classList.remove('is-invalid');
      newsletterEmail.style.borderColor = '';
      if (newsletterFeedback) {
        newsletterFeedback.textContent = '';
        newsletterFeedback.className = 'newsletter-feedback';
      }
    });

    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletterEmail.value.trim();
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (!email) {
        newsletterEmail.focus();
        newsletterEmail.classList.add('is-invalid');
        if (newsletterFeedback) {
          newsletterFeedback.textContent = 'Email is required';
          newsletterFeedback.className = 'newsletter-feedback error';
        }
        return;
      }

      if (!emailRegex.test(email)) {
        newsletterEmail.focus();
        newsletterEmail.classList.add('is-invalid');
        if (newsletterFeedback) {
          newsletterFeedback.textContent = 'Please enter a valid email address';
          newsletterFeedback.className = 'newsletter-feedback error';
        }
        return;
      }

      newsletterEmail.classList.remove('is-invalid');
      newsletterEmail.style.borderColor = '';
      if (newsletterFeedback) {
        newsletterFeedback.className = 'newsletter-feedback';
        newsletterFeedback.textContent = '';
      }
      newsletterBtn.disabled = true;
      newsletterBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Subscribing...';

      setTimeout(() => {
        newsletterBtn.innerHTML = '<i class="fa-solid fa-check"></i> Subscribed!';
        newsletterBtn.style.backgroundColor = '#16A34A';
        if (newsletterFeedback) {
          newsletterFeedback.textContent = `You're on the list! Hearth dispatches will arrive at ${email} every Thursday morning.`;
          newsletterFeedback.className = 'newsletter-feedback active';
        }
        newsletterEmail.value = '';

        try {
          localStorage.setItem('stackly_catalogue_subscribed', 'true');
        } catch (_) {}
      }, 700);
    });
  }

  // --------------------------------------------------------------------------
  // 6. HERO FLOATING BADGE SCROLL
  // --------------------------------------------------------------------------
  const heroBadge = document.querySelector('.hero-floating-badge');
  if (heroBadge) {
    heroBadge.addEventListener('click', () => {
      const gridSection = document.getElementById('selection');
      if (gridSection) {
        gridSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // --------------------------------------------------------------------------
  // 7. AOS (ANIMATE ON SCROLL) CDNJS INITIALIZATION
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

