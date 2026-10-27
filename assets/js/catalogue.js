/**
 * Stackly Bakery - Catalogue & Hearth Selection Application
 * Vanilla JavaScript: Sticky navbar, category filter pills,
 * shopping bag drawer, quantity management, newsletter, and mobile drawer.
 */

// Immediate global cart hooks
window.openStacklyCart = function(e) {
  if (e && typeof e.preventDefault === 'function') e.preventDefault();
  if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
  const overlay = document.getElementById('cartModalOverlay');
  if (!overlay) return;
  if (typeof window.renderStacklyCart === 'function') {
    try { window.renderStacklyCart(); } catch (_) {}
  }
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.closeStacklyCart = function(e) {
  if (e && typeof e.preventDefault === 'function') e.preventDefault();
  if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
  const overlay = document.getElementById('cartModalOverlay');
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
};

function initCatalogue() {
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
  function parsePrice(val) {
    if (typeof val === 'number') return isNaN(val) ? 0 : val;
    if (!val) return 0;
    const cleaned = String(val).replace(/[^0-9.]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }

  // Cart state - loaded from localStorage if previously stored
  let cart = [];

  try {
    const saved = localStorage.getItem('stackly_cart') || localStorage.getItem('kneadly_cart');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        cart = parsed.map(item => {
          return {
            id: item.id || ('item-' + Math.random().toString(36).substr(2, 8)),
            name: item.name || 'Bakery Item',
            price: parsePrice(item.price),
            qty: Math.max(1, parseInt(item.qty || item.quantity, 10) || 1),
            img: item.img || item.image || 'assets/images/catalogue_spotlight_croissant.webp'
          };
        });
      }
    }
  } catch (_) {}

  function saveCart() {
    try {
      localStorage.setItem('stackly_cart', JSON.stringify(cart));
      const mirrored = cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.qty,
        image: item.img
      }));
      localStorage.setItem('kneadly_cart', JSON.stringify(mirrored));
      window.dispatchEvent(new Event('storage'));
    } catch (_) {}
  }

  function updateCartBadge(count) {
    const badges = document.querySelectorAll('.nav-cart-badge, #cartBadge');
    badges.forEach(b => {
      b.textContent = count.toString();
    });
    const dots = document.querySelectorAll('.cart-badge-dot, #cartDot');
    dots.forEach(d => {
      d.classList.toggle('active', count > 0);
    });
  }

  function renderCart() {
    const cartItemsContainer = document.getElementById('cartItemsList');
    const cartSubtotalEl = document.getElementById('cartSubtotal');
    const cartTotalEl = document.getElementById('cartTotal');

    let subtotal = 0;
    let totalItems = 0;

    cart.forEach(item => {
      const p = parsePrice(item.price);
      const q = Math.max(1, parseInt(item.qty, 10) || 1);
      subtotal += p * q;
      totalItems += q;
    });

    updateCartBadge(totalItems);

    if (cartSubtotalEl) cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (cartTotalEl) cartTotalEl.textContent = `$${subtotal.toFixed(2)}`;

    if (!cartItemsContainer) return;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="cart-empty-message" style="text-align: center; padding: 3rem 1.5rem;">
          <i class="fa-solid fa-basket-shopping" style="font-size: 2.5rem; color: var(--color-caramel, #C68B59); margin-bottom: 1rem; display: block;"></i>
          <p style="font-weight: 700; color: #fff; margin-bottom: 0.5rem; font-size: 1.1rem;">Your shopping bag is empty</p>
          <p style="font-size: 0.88rem; color: var(--text-dark-muted, #A89F91); line-height: 1.5;">Browse our fresh daily hearth pulls and flaky pastries to add your favorites.</p>
        </div>
      `;
      return;
    }

    let html = '';
    cart.forEach((item, index) => {
      const p = parsePrice(item.price);
      const q = Math.max(1, parseInt(item.qty, 10) || 1);
      const img = item.img || 'assets/images/catalogue_spotlight_croissant.webp';
      const name = item.name || 'Bakery Item';

      html += `
        <div class="cart-item" data-id="${item.id}">
          <img src="${img}" alt="${name}" class="cart-item-thumb">
          <div class="cart-item-details">
            <h4 class="cart-item-name">${name}</h4>
            <div class="cart-item-price">$${p.toFixed(2)}</div>
          </div>
          <div class="cart-item-qty">
            <button class="qty-btn" data-action="dec" data-index="${index}" aria-label="Decrease quantity">&minus;</button>
            <span class="qty-number">${q}</span>
            <button class="qty-btn" data-action="inc" data-index="${index}" aria-label="Increase quantity">&plus;</button>
          </div>
          <button class="cart-item-remove" data-index="${index}" aria-label="Remove item">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      `;
    });

    cartItemsContainer.innerHTML = html;

    // Attach listeners to newly rendered qty & remove buttons
    cartItemsContainer.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const action = e.currentTarget.getAttribute('data-action');
        const idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
        if (isNaN(idx) || !cart[idx]) return;

        if (action === 'inc') {
          cart[idx].qty = (parseInt(cart[idx].qty, 10) || 1) + 1;
        } else if (action === 'dec') {
          cart[idx].qty = (parseInt(cart[idx].qty, 10) || 1) - 1;
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
        e.preventDefault();
        e.stopPropagation();
        const idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
        if (isNaN(idx) || !cart[idx]) return;
        cart.splice(idx, 1);
        saveCart();
        renderCart();
      });
    });
  }

  function openCart() {
    const overlay = document.getElementById('cartModalOverlay');
    if (!overlay) return;
    try {
      renderCart();
    } catch (err) {
      console.error('Cart render error:', err);
    }
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCart(e) {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    const overlay = document.getElementById('cartModalOverlay');
    if (!overlay) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Expose globally
  window.openStacklyCart = openCart;
  window.closeStacklyCart = closeCart;

  // Global document click delegation for all cart triggers
  document.addEventListener('click', (e) => {
    // 1. Shopping Bag Header Button
    const bagToggle = e.target.closest('#cartToggle, .action-btn-bag');
    if (bagToggle) {
      e.preventDefault();
      e.stopPropagation();
      openCart();
      return;
    }

    // 2. Cart Close Button inside Drawer
    const closeBtn = e.target.closest('#cartCloseBtn, .cart-close-btn');
    if (closeBtn) {
      e.preventDefault();
      e.stopPropagation();
      closeCart(e);
      return;
    }

    // 3. Cart Overlay Backdrop Click (outside drawer)
    const overlay = document.getElementById('cartModalOverlay');
    if (overlay && e.target === overlay) {
      e.preventDefault();
      e.stopPropagation();
      closeCart(e);
      return;
    }
  });

  window.addEventListener('keydown', (e) => {
    const overlay = document.getElementById('cartModalOverlay');
    if (e.key === 'Escape' && overlay && overlay.classList.contains('open')) {
      closeCart();
    }
  });

  // Global Add to Bag Handler for all cards & spotlight buttons
  document.querySelectorAll('[data-add-to-cart]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = btn.getAttribute('data-id') || ('prod-' + Math.random().toString(36).substr(2, 6));
      const name = btn.getAttribute('data-name') || 'Fresh Bakery Item';
      const price = parsePrice(btn.getAttribute('data-price'));
      const img = btn.getAttribute('data-img') || 'assets/images/catalogue_spotlight_croissant.webp';

      const existingIndex = cart.findIndex(item => item.id === id);
      if (existingIndex > -1) {
        cart[existingIndex].qty = (parseInt(cart[existingIndex].qty, 10) || 1) + 1;
      } else {
        cart.push({ id, name, price, qty: 1, img });
      }

      saveCart();
      renderCart();

      // Button feedback
      const originalHtml = btn.innerHTML;
      const isQuickAdd = btn.classList.contains('card-quick-add');
      if (isQuickAdd) {
        btn.innerHTML = '<i class="fa-solid fa-check"></i>';
      } else {
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Added!';
      }
      btn.style.backgroundColor = '#16A34A';
      btn.style.borderColor = '#16A34A';
      btn.style.color = '#FFFFFF';

      setTimeout(() => {
        btn.innerHTML = originalHtml;
        btn.style.backgroundColor = '';
        btn.style.borderColor = '';
        btn.style.color = '';
      }, 1200);

      // Open the cart drawer to show the item in the bag!
      openCart();
    });
  });

  // Initial render of cart
  window.renderStacklyCart = renderCart;
  renderCart();

  // Auto open cart if URL parameter or hash requests it
  if (window.location.search.includes('openCart') || window.location.hash.includes('cart')) {
    setTimeout(openCart, 200);
  }

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
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCatalogue);
} else {
  initCatalogue();
}


