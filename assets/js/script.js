/**
 * Kneadly Bakery — Interactive Application Script
 * Vanilla JavaScript (No dependencies, ultra-fast and reliable)
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // -------------------------------------------------------------------------
  // 1. DATA STATE & STORE
  // -------------------------------------------------------------------------
  function loadStoredCart() {
    try {
      const saved = localStorage.getItem('kneadly_cart') || localStorage.getItem('stackly_cart');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];
      return parsed.map(item => {
        const qty = Math.max(1, parseInt(item.quantity || item.qty, 10) || 1);
        let price = 0;
        if (typeof item.price === 'number') {
          price = item.price;
        } else if (item.price) {
          price = parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0;
        }
        return {
          id: item.id || ('item-' + Math.random().toString(36).substr(2, 8)),
          name: item.name || 'Bakery Item',
          price: price,
          quantity: qty,
          image: item.image || item.img || 'assets/images/croissant.webp'
        };
      });
    } catch (_) {
      return [];
    }
  }

  const state = {
    cart: loadStoredCart(),
    activeCategory: 'all',
    currentTestimonialIndex: 0,
    freeShippingThreshold: 35.00
  };

  const productsDatabase = [
    {
      id: 1,
      name: 'Traditional Butter Croissant',
      category: 'croissant',
      price: 4.50,
      image: 'assets/images/croissant.webp',
      badge: 'BESTSELLER',
      desc: '81 delicate layers of flaky laminated French butter dough baked to golden perfection.',
      ingredients: 'French Normandy butter, organic T65 wheat flour, water, fresh yeast, sea salt.'
    },
    {
      id: 2,
      name: 'Country Sourdough Boule',
      category: 'bread',
      price: 8.50,
      image: 'assets/images/sourdough.webp',
      badge: 'SIGNATURE',
      desc: '72-hour cold-fermented wild starter loaf with a caramelized blistered crust and airy crumb.',
      ingredients: 'Organic whole rye, stone-ground heritage wheat, wild sourdough culture, filtered water, sea salt.'
    },
    {
      id: 3,
      name: 'Cinnamon Brioche Swirl',
      category: 'sweet',
      price: 5.25,
      image: 'assets/images/cinnamon-roll.webp',
      badge: 'HOT AT 8 AM',
      desc: 'Soft, enriched brioche dough rolled with fragrant Ceylon cinnamon and topped with bourbon vanilla glaze.',
      ingredients: 'Pasture eggs, organic milk, Normandy butter, organic flour, Ceylon cinnamon, Madagascar vanilla.'
    },
    {
      id: 4,
      name: 'Pain au Chocolat',
      category: 'croissant',
      price: 5.00,
      image: 'assets/images/pain-au-chocolat.webp',
      badge: 'CLASSIC',
      desc: 'Crispy, golden viennoiserie folded around two batons of premium French Valrhona 64% dark chocolate.',
      ingredients: 'French butter, Valrhona 64% chocolate, organic flour, fresh yeast, organic sugar, sea salt.'
    }
  ];

  // -------------------------------------------------------------------------
  // 2. DOM CACHE
  // -------------------------------------------------------------------------
  const header = document.getElementById('siteHeader') || document.getElementById('header');
  const cartToggle = document.getElementById('cartToggle');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartClose = document.getElementById('cartClose');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartItemsList = document.getElementById('cartItemsList');
  const cartBadge = document.getElementById('cartBadge');
  const cartCount = document.getElementById('cartCount') || cartBadge;
  const cartDot = document.getElementById('cartDot');
  const cartDrawerCount = document.getElementById('cartDrawerCount');
  const cartSubtotal = document.getElementById('cartSubtotal');
  const cartTotalBtn = document.getElementById('cartTotalBtn');
  const clearCartBtn = document.getElementById('clearCartBtn');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const shippingBarFill = document.getElementById('shippingBarFill');
  const shippingBarText = document.getElementById('shippingBarText');

  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');

  const searchToggle = document.getElementById('searchToggle');
  const searchModal = document.getElementById('searchModal');
  const searchClose = document.getElementById('searchClose');
  const searchOverlay = document.getElementById('searchOverlay');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');

  const quickviewModal = document.getElementById('quickviewModal');
  const quickviewClose = document.getElementById('quickviewClose');
  const quickviewOverlay = document.getElementById('quickviewOverlay');
  const qvImage = document.getElementById('qvImage');
  const qvBadge = document.getElementById('qvBadge');
  const qvTitle = document.getElementById('qvTitle');
  const qvPrice = document.getElementById('qvPrice');
  const qvDesc = document.getElementById('qvDesc');
  const qvIngredients = document.getElementById('qvIngredients');
  const qvQty = document.getElementById('qvQty');
  const qvMinus = document.getElementById('qvMinus');
  const qvPlus = document.getElementById('qvPlus');
  const qvAddBtn = document.getElementById('qvAddBtn');
  let currentQvProduct = null;

  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterEmail = document.getElementById('newsletterEmail');
  const newsletterFeedback = document.getElementById('newsletterFeedback');

  const backToTop = document.getElementById('backToTop');
  const toastContainer = document.getElementById('toastContainer');

  // Testimonials
  const testSlides = document.querySelectorAll('.testimonial-slide');
  const testDots = document.querySelectorAll('.test-dot');
  const testPrev = document.getElementById('testPrev');
  const testNext = document.getElementById('testNext');

  // -------------------------------------------------------------------------
  // 3. TOAST NOTIFICATIONS
  // -------------------------------------------------------------------------
  function showToast(message, icon = '<i class="fa-solid fa-sparkles"></i>') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span style="color: var(--color-accent-gold); font-size: 1.1rem; display:inline-flex; align-items:center;">${icon}</span> <span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px) scale(0.9)';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // -------------------------------------------------------------------------
  // 4. CART SYSTEM
  // -------------------------------------------------------------------------
  function saveCart() {
    try {
      localStorage.setItem('kneadly_cart', JSON.stringify(state.cart));
      // Mirror to stackly_cart for cross-page compatibility with catalogue
      const mirrored = state.cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        qty: item.quantity,
        img: item.image
      }));
      localStorage.setItem('stackly_cart', JSON.stringify(mirrored));
      window.dispatchEvent(new Event('storage'));
    } catch (_) {}
    updateCartUI();
  }

  function addToCart(product, quantity = 1) {
    const existing = state.cart.find(item => String(item.id) === String(product.id));
    if (existing) {
      existing.quantity = (parseInt(existing.quantity, 10) || 1) + quantity;
    } else {
      let price = 0;
      if (typeof product.price === 'number') {
        price = product.price;
      } else if (product.price) {
        price = parseFloat(String(product.price).replace(/[^0-9.]/g, '')) || 0;
      }
      state.cart.push({
        id: product.id,
        name: product.name,
        price: price,
        image: product.image || product.img || 'assets/images/croissant.webp',
        quantity: quantity
      });
    }
    saveCart();
    showToast(`Added ${quantity}x "${product.name}" to basket!`, '<i class="fa-solid fa-cart-shopping"></i>');
    openCart();
  }

  function removeFromCart(productId) {
    state.cart = state.cart.filter(item => String(item.id) !== String(productId));
    saveCart();
    showToast('Item removed from basket', '<i class="fa-solid fa-trash-can"></i>');
  }

  function updateQuantity(productId, delta) {
    const item = state.cart.find(item => String(item.id) === String(productId));
    if (!item) return;

    item.quantity = (parseInt(item.quantity, 10) || 1) + delta;
    if (item.quantity <= 0) {
      removeFromCart(productId);
    } else {
      saveCart();
    }
  }

  function clearCart() {
    if (state.cart.length === 0) return;
    state.cart = [];
    saveCart();
    showToast('Basket cleared', '<i class="fa-solid fa-trash-can"></i>');
  }

  function updateCartUI() {
    const totalCount = state.cart.reduce((sum, item) => sum + (parseInt(item.quantity || item.qty, 10) || 1), 0);
    const subtotal = state.cart.reduce((sum, item) => {
      const q = parseInt(item.quantity || item.qty, 10) || 1;
      const p = typeof item.price === 'number' ? item.price : (parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0);
      return sum + (p * q);
    }, 0);

    // Update all numeric badges across header and navigation
    const badges = document.querySelectorAll('.nav-cart-badge, #cartBadge, #cartCount');
    badges.forEach(b => {
      b.textContent = totalCount.toString();
    });

    const dots = document.querySelectorAll('.cart-badge-dot, #cartDot');
    dots.forEach(d => {
      d.classList.toggle('active', totalCount > 0);
    });

    if (cartDrawerCount) cartDrawerCount.textContent = totalCount.toString();
    if (cartSubtotal) cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    if (cartTotalBtn) cartTotalBtn.textContent = `$${subtotal.toFixed(2)}`;

    // Free delivery progress calculation
    if (shippingBarFill) {
      const progress = Math.min(100, (subtotal / state.freeShippingThreshold) * 100);
      shippingBarFill.style.width = `${progress}%`;
    }

    if (shippingBarText) {
      if (subtotal >= state.freeShippingThreshold) {
        shippingBarText.innerHTML = '<i class="fa-solid fa-truck-fast"></i> You unlocked <strong>Free Morning Delivery</strong>!';
      } else {
        const remaining = state.freeShippingThreshold - subtotal;
        shippingBarText.innerHTML = `<i class="fa-solid fa-truck-fast"></i> Add <strong>$${remaining.toFixed(2)}</strong> more for Free Delivery!`;
      }
    }

    // Render items
    if (cartItemsList) {
      if (state.cart.length === 0) {
        cartItemsList.innerHTML = `
          <div class="cart-empty-message">
            <i class="fa-solid fa-bag-shopping cart-empty-icon" style="font-size: 2.2rem; color: var(--color-accent-gold); margin-bottom: 0.65rem; display: inline-block;"></i>
            <p style="font-weight: 700; margin-bottom: 0.35rem; color: var(--text-dark-primary);">Your basket is empty</p>
            <p style="font-size: 0.82rem;">Explore our fresh morning pastries and add some warm joy.</p>
          </div>
        `;
      } else {
        cartItemsList.innerHTML = state.cart.map(item => {
          const qty = parseInt(item.quantity || item.qty, 10) || 1;
          const p = typeof item.price === 'number' ? item.price : (parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0);
          const imgSrc = item.image || item.img || 'assets/images/croissant.webp';
          return `
          <div class="cart-item" data-id="${item.id}">
            <img src="${imgSrc}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-details">
              <h4 class="cart-item-title">${item.name}</h4>
              <span class="cart-item-price">$${(p * qty).toFixed(2)} <span style="font-size:0.75rem; font-weight:normal; color:#888;">($${p.toFixed(2)} ea)</span></span>
              <div class="cart-item-actions">
                <div class="cart-qty-ctrl">
                  <button class="cart-qty-btn cart-dec-btn" aria-label="Decrease quantity" data-id="${item.id}"><i class="fa-solid fa-minus"></i></button>
                  <span class="cart-qty-val">${qty}</span>
                  <button class="cart-qty-btn cart-inc-btn" aria-label="Increase quantity" data-id="${item.id}"><i class="fa-solid fa-plus"></i></button>
                </div>
                <button class="cart-item-remove" data-id="${item.id}"><i class="fa-solid fa-trash-can"></i> Remove</button>
              </div>
            </div>
          </div>
        `;
        }).join('');
      }
    }
  }

  function openCart() {
    if (!cartDrawer) return;
    cartDrawer.classList.add('open');
    cartDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    if (!cartDrawer) return;
    cartDrawer.classList.remove('open');
    cartDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Global window functions for interop
  window.openCart = openCart;
  window.closeCart = closeCart;
  window.openStacklyCart = openCart;
  window.closeStacklyCart = closeCart;
  window.updateStacklyCartBadge = updateCartUI;

  // Cart Event Listeners
  if (cartToggle) cartToggle.addEventListener('click', openCart);
  if (cartClose) cartClose.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);
  if (clearCartBtn) clearCartBtn.addEventListener('click', clearCart);

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', (e) => {
      window.location.href = 'catalogue.html';
    });
  }

  if (cartItemsList) {
    cartItemsList.addEventListener('click', (e) => {
      const incBtn = e.target.closest('.cart-inc-btn');
      const decBtn = e.target.closest('.cart-dec-btn');
      const removeBtn = e.target.closest('.cart-item-remove');

      if (incBtn) {
        updateQuantity(incBtn.dataset.id, 1);
      } else if (decBtn) {
        updateQuantity(decBtn.dataset.id, -1);
      } else if (removeBtn) {
        removeFromCart(removeBtn.dataset.id);
      }
    });
  }

  // Cross-page storage synchronization
  window.addEventListener('storage', () => {
    state.cart = loadStoredCart();
    updateCartUI();
  });
  window.addEventListener('pageshow', () => {
    state.cart = loadStoredCart();
    updateCartUI();
  });

  // -------------------------------------------------------------------------
  // 5. PRODUCT CARDS & CATEGORY FILTER
  // -------------------------------------------------------------------------
  const tabButtons = document.querySelectorAll('.tab-btn');
  const productCards = document.querySelectorAll('.product-card');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const cat = btn.dataset.category;
      state.activeCategory = cat;

      productCards.forEach(card => {
        if (cat === 'all' || card.dataset.category === cat) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.transition = 'all 0.35s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Quick Add Button on Cards
  productCards.forEach(card => {
    const quickAdd = card.querySelector('.quick-add-btn');
    const id = parseInt(card.dataset.id, 10);
    const prod = productsDatabase.find(p => p.id === id);

    if (quickAdd && prod) {
      quickAdd.addEventListener('click', (e) => {
        e.stopPropagation();
        addToCart(prod, 1);
      });
    }

    // Click on details button -> Open Quick View modal
    const detailsBtn = card.querySelector('.btn-quickview');
    if (detailsBtn) {
      detailsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (prod) openQuickView(prod);
      });
    }

    card.addEventListener('click', () => {
      if (prod) openQuickView(prod);
    });
  });

  // Carousel Arrow buttons
  const prodPrev = document.getElementById('prodPrev');
  const prodNext = document.getElementById('prodNext');
  if (prodPrev && prodNext) {
    prodPrev.addEventListener('click', () => {
      showToast('Showing previous bakery selections', '<i class="fa-solid fa-chevron-left"></i>');
    });
    prodNext.addEventListener('click', () => {
      showToast('Showing next freshly baked picks', '<i class="fa-solid fa-chevron-right"></i>');
    });
  }

  // -------------------------------------------------------------------------
  // 6. QUICK VIEW MODAL
  // -------------------------------------------------------------------------
  function openQuickView(prod) {
    currentQvProduct = prod;
    qvImage.src = prod.image;
    qvImage.alt = prod.name;
    qvBadge.textContent = prod.badge;
    qvTitle.textContent = prod.name;
    qvPrice.textContent = `$${prod.price.toFixed(2)}`;
    qvDesc.textContent = prod.desc;
    qvIngredients.textContent = prod.ingredients;
    qvQty.textContent = '1';

    quickviewModal.classList.add('open');
    quickviewModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeQuickView() {
    quickviewModal.classList.remove('open');
    quickviewModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    currentQvProduct = null;
  }

  quickviewClose.addEventListener('click', closeQuickView);
  quickviewOverlay.addEventListener('click', closeQuickView);

  qvMinus.addEventListener('click', () => {
    let q = parseInt(qvQty.textContent, 10);
    if (q > 1) qvQty.textContent = (q - 1).toString();
  });

  qvPlus.addEventListener('click', () => {
    let q = parseInt(qvQty.textContent, 10);
    qvQty.textContent = (q + 1).toString();
  });

  qvAddBtn.addEventListener('click', () => {
    if (!currentQvProduct) return;
    const q = parseInt(qvQty.textContent, 10);
    addToCart(currentQvProduct, q);
    closeQuickView();
  });

  // -------------------------------------------------------------------------
  // 7. TESTIMONIAL CAROUSEL
  // -------------------------------------------------------------------------
  function setTestimonialSlide(index) {
    testSlides.forEach((s, i) => {
      s.classList.toggle('active', i === index);
    });
    testDots.forEach((d, i) => {
      d.classList.toggle('active', i === index);
    });
    state.currentTestimonialIndex = index;
  }

  let testimonialInterval = null;
  function startTestimonialTimer() {
    if (testimonialInterval) clearInterval(testimonialInterval);
    testimonialInterval = setInterval(() => {
      let idx = (state.currentTestimonialIndex + 1) % testSlides.length;
      setTestimonialSlide(idx);
    }, 7000);
  }

  if (testPrev && testNext) {
    testPrev.addEventListener('click', () => {
      let idx = state.currentTestimonialIndex - 1;
      if (idx < 0) idx = testSlides.length - 1;
      setTestimonialSlide(idx);
      startTestimonialTimer();
    });

    testNext.addEventListener('click', () => {
      let idx = (state.currentTestimonialIndex + 1) % testSlides.length;
      setTestimonialSlide(idx);
      startTestimonialTimer();
    });
  }

  testDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.index, 10);
      setTestimonialSlide(idx);
      startTestimonialTimer();
    });
  });

  // Start auto rotate testimonials every 7 seconds
  startTestimonialTimer();

  // -------------------------------------------------------------------------
  // 8. SEARCH MODAL & LIVE FILTER
  // -------------------------------------------------------------------------
  function openSearch() {
    searchModal.classList.add('open');
    searchModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => searchInput.focus(), 100);
  }

  function closeSearch() {
    searchModal.classList.remove('open');
    searchModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    searchInput.value = '';
    searchResults.innerHTML = '<p class="search-hint">Type above to search our fresh morning oven menu</p>';
  }

  if (searchToggle) searchToggle.addEventListener('click', openSearch);
  if (searchClose) searchClose.addEventListener('click', closeSearch);
  if (searchOverlay) searchOverlay.addEventListener('click', closeSearch);

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    if (!query) {
      searchResults.innerHTML = '<p class="search-hint">Type above to search our fresh morning oven menu</p>';
      return;
    }

    const matches = productsDatabase.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.desc.toLowerCase().includes(query) ||
      p.ingredients.toLowerCase().includes(query)
    );

    if (matches.length === 0) {
      searchResults.innerHTML = `<p class="search-hint">No freshly baked items found matching "${query}"</p>`;
    } else {
      searchResults.innerHTML = matches.map(p => `
        <div class="search-result-item" data-id="${p.id}">
          <div style="display:flex; align-items:center; gap:0.75rem;">
            <img src="${p.image}" alt="${p.name}" style="width:40px; height:40px; border-radius:6px; object-fit:cover;">
            <div>
              <div class="search-res-title">${p.name}</div>
              <small style="color:var(--text-dark-secondary); font-size:0.75rem;">${p.badge}</small>
            </div>
          </div>
          <span class="search-res-price">$${p.price.toFixed(2)}</span>
        </div>
      `).join('');

      searchResults.querySelectorAll('.search-result-item').forEach(el => {
        el.addEventListener('click', () => {
          const id = parseInt(el.dataset.id, 10);
          const p = productsDatabase.find(item => item.id === id);
          if (p) {
            closeSearch();
            openQuickView(p);
          }
        });
      });
    }
    });
  }

  // -------------------------------------------------------------------------
  // 9. MOBILE MENU DRAWER
  // -------------------------------------------------------------------------
  if (mobileToggle && mobileDrawer) {
    const closeMobileDrawer = () => {
      mobileDrawer.classList.remove('open');
      mobileToggle.setAttribute('aria-expanded', 'false');
      mobileToggle.classList.remove('active');
      if (header) header.classList.remove('drawer-open');
      document.body.classList.remove('mobile-nav-open');
    };

    const openMobileDrawer = () => {
      mobileDrawer.classList.add('open');
      mobileToggle.setAttribute('aria-expanded', 'true');
      mobileToggle.classList.add('active');
      if (header) header.classList.add('drawer-open');
      document.body.classList.add('mobile-nav-open');
    };

    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const willOpen = !mobileDrawer.classList.contains('open');
      if (willOpen) {
        openMobileDrawer();
      } else {
        closeMobileDrawer();
      }
    });

    document.querySelectorAll('.mobile-nav-link, .mobile-drawer-footer .btn-header-login').forEach(link => {
      link.addEventListener('click', () => {
        closeMobileDrawer();
      });
    });

    document.addEventListener('click', (e) => {
      if (mobileDrawer.classList.contains('open') && !mobileDrawer.contains(e.target) && !mobileToggle.contains(e.target)) {
        closeMobileDrawer();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        closeMobileDrawer();
      }
    });
  }

  // -------------------------------------------------------------------------
  // 10. STICKY HEADER & SCROLL BEHAVIOR
  // -------------------------------------------------------------------------
  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // -------------------------------------------------------------------------
  // 11. NEWSLETTER SUBMISSION
  // -------------------------------------------------------------------------
  if (newsletterForm && newsletterEmail) {
    const inputGroup = newsletterEmail.closest('.input-group');

    newsletterEmail.addEventListener('input', () => {
      newsletterEmail.classList.remove('is-invalid');
      if (inputGroup) inputGroup.classList.remove('is-invalid');
      if (newsletterFeedback) {
        newsletterFeedback.textContent = '';
        newsletterFeedback.className = 'form-feedback';
      }
    });

    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletterEmail.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!email) {
        newsletterEmail.classList.add('is-invalid');
        if (inputGroup) inputGroup.classList.add('is-invalid');
        if (newsletterFeedback) {
          newsletterFeedback.textContent = 'Email is required';
          newsletterFeedback.className = 'form-feedback error';
        }
        newsletterEmail.focus();
        return;
      }

      if (!emailRegex.test(email)) {
        newsletterEmail.classList.add('is-invalid');
        if (inputGroup) inputGroup.classList.add('is-invalid');
        if (newsletterFeedback) {
          newsletterFeedback.textContent = 'Please enter a valid email';
          newsletterFeedback.className = 'form-feedback error';
        }
        newsletterEmail.focus();
        return;
      }

      newsletterEmail.classList.remove('is-invalid');
      if (inputGroup) inputGroup.classList.remove('is-invalid');
      if (newsletterFeedback) {
        newsletterFeedback.textContent = 'Welcome! You’re on the list for weekly bakery drops & secret recipes.';
        newsletterFeedback.className = 'form-feedback success';
      }
      newsletterEmail.value = '';
      showToast('Subscribed! Check your inbox for 10% off your first order.', '<i class="fa-solid fa-envelope"></i>');

      setTimeout(() => {
        if (newsletterFeedback) {
          newsletterFeedback.textContent = '';
          newsletterFeedback.className = 'form-feedback';
        }
      }, 5000);
    });
  }

  // -------------------------------------------------------------------------
  // 12. ESC KEY TO CLOSE MODALS
  // -------------------------------------------------------------------------
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCart();
      closeQuickView();
      closeSearch();
      mobileDrawer.classList.remove('open');
      mobileToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // -------------------------------------------------------------------------
  // 13. HERO TASTING SHOWCASE INTERACTIVE SELECTOR
  // -------------------------------------------------------------------------
  const heroTastingTabs = document.querySelectorAll('.tasting-tab');
  const heroPastryImg = document.getElementById('heroPastryImg');
  const heroCardBadge = document.getElementById('heroCardBadge');
  const heroCardTitle = document.getElementById('heroCardTitle');
  const heroCardMeta = document.getElementById('heroCardMeta');
  const heroCardPrice = document.getElementById('heroCardPrice');
  const heroQuickAddBtn = document.getElementById('heroQuickAddBtn');
  const hotspot1Title = document.getElementById('hotspot1Title');
  const hotspot1Sub = document.getElementById('hotspot1Sub');
  const hotspot2Title = document.getElementById('hotspot2Title');
  const hotspot2Sub = document.getElementById('hotspot2Sub');
  const heroShowcaseCol = document.querySelector('.hero-showcase-col');

  const heroTastingItems = [
    {
      id: 1,
      name: 'Traditional Butter Croissant',
      price: '$4.50',
      badge: 'FEATURED MORNING SPECIAL',
      meta: '81 layers of French laminated butter dough · Golden crisp',
      image: 'assets/images/figma_hero_croissants_trans.webp',
      alt: 'Freshly baked golden butter croissants',
      hs1Title: '81 Crisp Layers',
      hs1Sub: 'Beurre Charentes-Poitou AOP',
      hs2Title: 'Baked at 240°C',
      hs2Sub: 'Natural stone hearth heat'
    },
    {
      id: 2,
      name: 'Country Sourdough Boule',
      price: '$8.50',
      badge: '72H WILD STARTER',
      meta: 'Caramelized blistered crust with deep airy crumb',
      image: 'assets/images/sourdough.webp',
      alt: 'Artisanal country sourdough boule',
      hs1Title: '72h Ferment',
      hs1Sub: 'Wild living levain culture',
      hs2Title: 'Blistered Crust',
      hs2Sub: 'Caramelized stone hearth bake'
    },
    {
      id: 4,
      name: 'Pain au Chocolat',
      price: '$5.00',
      badge: 'FRENCH CLASSIC',
      meta: 'Double batons of premium French Valrhona 64% dark chocolate',
      image: 'assets/images/pain-au-chocolat.webp',
      alt: 'Crispy pain au chocolat with dark chocolate',
      hs1Title: 'Valrhona 64%',
      hs1Sub: 'Dual dark chocolate batons',
      hs2Title: 'Golden Viennoiserie',
      hs2Sub: 'Flaky melt-in-mouth folds'
    },
    {
      id: 3,
      name: 'Cinnamon Brioche Swirl',
      price: '$5.25',
      badge: 'HOT AT 8:00 AM',
      meta: 'Warm spices, Ceylon cinnamon, and bourbon vanilla glaze',
      image: 'assets/images/cinnamon-roll.webp',
      alt: 'Fluffy cinnamon brioche swirl with vanilla glaze',
      hs1Title: 'Ceylon Cinnamon',
      hs1Sub: 'Fragrant aromatic spiral',
      hs2Title: 'Bourbon Vanilla',
      hs2Sub: 'Velvety light sugar glaze'
    }
  ];

  let currentHeroIndex = 0;
  let heroAutoTimer = null;

  function setHeroShowcase(index) {
    if (!heroPastryImg || !heroTastingItems[index]) return;
    const item = heroTastingItems[index];
    currentHeroIndex = index;

    // Update active tab
    heroTastingTabs.forEach((tab, i) => {
      const isActive = i === index;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // Smooth image transition
    heroPastryImg.style.opacity = '0';
    heroPastryImg.style.transform = 'translateY(10px) scale(0.94)';

    setTimeout(() => {
      heroPastryImg.src = item.image;
      heroPastryImg.alt = item.alt;

      if (heroCardBadge) heroCardBadge.textContent = item.badge;
      if (heroCardTitle) heroCardTitle.textContent = item.name;
      if (heroCardMeta) heroCardMeta.textContent = item.meta;
      if (heroCardPrice) heroCardPrice.textContent = item.price;
      if (heroQuickAddBtn) {
        heroQuickAddBtn.dataset.id = item.id;
        heroQuickAddBtn.setAttribute('aria-label', `Add ${item.name} to basket`);
      }

      if (hotspot1Title) hotspot1Title.textContent = item.hs1Title;
      if (hotspot1Sub) hotspot1Sub.textContent = item.hs1Sub;
      if (hotspot2Title) hotspot2Title.textContent = item.hs2Title;
      if (hotspot2Sub) hotspot2Sub.textContent = item.hs2Sub;

      heroPastryImg.style.opacity = '1';
      heroPastryImg.style.transform = 'translateY(0) scale(1)';
    }, 180);
  }

  heroTastingTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      setHeroShowcase(index);
      resetHeroAutoTimer();
    });
  });

  if (heroQuickAddBtn) {
    heroQuickAddBtn.addEventListener('click', () => {
      const id = parseInt(heroQuickAddBtn.dataset.id, 10) || 1;
      const product = productsDatabase.find(p => p.id === id);
      if (product) {
        addToCart(product, 1);
      }
    });
  }

  function startHeroAutoTimer() {
    heroAutoTimer = setInterval(() => {
      const nextIdx = (currentHeroIndex + 1) % heroTastingItems.length;
      setHeroShowcase(nextIdx);
    }, 6000);
  }

  function resetHeroAutoTimer() {
    clearInterval(heroAutoTimer);
    startHeroAutoTimer();
  }

  if (heroShowcaseCol) {
    heroShowcaseCol.addEventListener('mouseenter', () => clearInterval(heroAutoTimer));
    heroShowcaseCol.addEventListener('mouseleave', startHeroAutoTimer);
  }

  startHeroAutoTimer();

  // -------------------------------------------------------------------------
  // 12. BAKING SCHEDULE FILTER TABS
  // -------------------------------------------------------------------------
  const schedTabs = document.querySelectorAll('.sched-tab');
  const schedCards = document.querySelectorAll('.schedule-card');

  if (schedTabs.length && schedCards.length) {
    schedTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const filterDay = tab.dataset.day || 'all';

        // Update tab styling & aria attributes
        schedTabs.forEach(t => {
          const isActive = t === tab;
          t.classList.toggle('active', isActive);
          t.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        // Filter cards smoothly
        schedCards.forEach(card => {
          const categories = (card.dataset.category || '').split(/\s+/);
          if (filterDay === 'all' || categories.includes(filterDay)) {
            card.style.display = 'grid';
            card.style.animation = 'fadeInUp 0.35s ease forwards';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // -------------------------------------------------------------------------
  // 13. FAQ ACCORDION INTERACTIVE TOGGLE
  // -------------------------------------------------------------------------
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const icon = item.querySelector('.faq-toggle-icon');

    if (!questionBtn || !answer) return;

    questionBtn.addEventListener('click', () => {
      const isAlreadyActive = item.classList.contains('active');

      // Close other accordion items
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.faq-question');
          const otherAns = otherItem.querySelector('.faq-answer');
          const otherIcon = otherItem.querySelector('.faq-toggle-icon');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          if (otherAns) otherAns.style.maxHeight = null;
          if (otherIcon) otherIcon.innerHTML = '<i class="fa-solid fa-plus"></i>';
        }
      });

      // Toggle current item
      if (isAlreadyActive) {
        item.classList.remove('active');
        questionBtn.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = null;
        if (icon) icon.innerHTML = '<i class="fa-solid fa-plus"></i>';
      } else {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = (answer.scrollHeight + 30) + 'px';
        if (icon) icon.innerHTML = '<i class="fa-solid fa-minus"></i>';
      }
    });
  });

  // Initialize Cart UI from localStorage
  updateCartUI();

  // -------------------------------------------------------------------------
  // 14. AOS (ANIMATE ON SCROLL) CDNJS INITIALIZATION
  // -------------------------------------------------------------------------
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 50,
      disableMutationObserver: false
    });
  }

  // -------------------------------------------------------------------------
  // 15. SITE PRELOADING ANIMATION CONTROLLER
  // -------------------------------------------------------------------------
  const sitePreloader = document.getElementById('sitePreloader');
  const preloaderBar = document.getElementById('preloaderBar');
  const preloaderStatus = document.getElementById('preloaderStatus');

  if (sitePreloader) {
    document.body.classList.add('preload-active');

    const statusSteps = [
      { progress: 28, text: 'Warming stone deck hearth...' },
      { progress: 58, text: 'Nurturing 10-year wild starter...' },
      { progress: 86, text: 'Proofing 81 flaky butter layers...' },
      { progress: 100, text: 'Fresh morning bakes ready!' }
    ];

    let currentStep = 0;
    const progressInterval = setInterval(() => {
      if (currentStep < statusSteps.length - 1) {
        currentStep++;
        if (preloaderBar) preloaderBar.style.width = statusSteps[currentStep].progress + '%';
        if (preloaderStatus) preloaderStatus.textContent = statusSteps[currentStep].text;
      }
    }, 280);

    let isDismissed = false;
    const dismissPreloader = () => {
      if (isDismissed) return;
      isDismissed = true;

      clearInterval(progressInterval);
      if (preloaderBar) preloaderBar.style.width = '100%';
      if (preloaderStatus) preloaderStatus.textContent = 'Fresh morning bakes ready!';

      setTimeout(() => {
        sitePreloader.classList.add('preloader-hidden');
        document.body.classList.remove('preload-active');

        // Refresh AOS scroll triggers now that the page is fully revealed
        if (typeof AOS !== 'undefined') {
          AOS.refresh();
        }

        setTimeout(() => {
          sitePreloader.style.display = 'none';
        }, 750);
      }, 350);
    };

    // When all page assets (images, fonts, stylesheets) have loaded
    if (document.readyState === 'complete') {
      setTimeout(dismissPreloader, 900);
    } else {
      window.addEventListener('load', () => {
        setTimeout(dismissPreloader, 750);
      });
      // Safety timeout: dismiss at 2.5s maximum so user is never stalled
      setTimeout(dismissPreloader, 2500);
    }
  }
});

