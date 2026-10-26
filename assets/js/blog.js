/**
 * Stackly Bakery - Editorial Journal & Blog Application
 * Vanilla JavaScript: Category filtering, Story Reading Drawer,
 * Interactive Masterclass Steps, Search, and Newsletter Subscriptions.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 0. INITIALIZE AOS (ANIMATE ON SCROLL) VIA CDNJS
  // --------------------------------------------------------------------------
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 750,
      easing: 'ease-out-cubic',
      once: true,
      offset: 40
    });
  }

  // --------------------------------------------------------------------------
  // 1. DATA: FULL STORIES DATABASE FOR EDITORIAL READING MODAL
  // --------------------------------------------------------------------------
  const storiesDatabase = {
    'fermentation': {
      title: 'Why good bread takes its time.',
      category: 'THE CRAFT',
      readTime: '6 min read',
      author: 'Elena Vance • Head Baker',
      date: 'May 14, 2026',
      image: 'assets/images/blog_sourdough_crumb.webp?v=2',
      quote: 'Time is our most generous ingredient. You cannot rush the microscopic alchemy of wild yeast and cold stone.',
      content: `
        <p>In our bakery hearth, the stone decks don't see raw dough until it has spent at least three full days quietly developing flavour inside our cedar cold room. To most industrial bakeries, 72 hours sounds commercially reckless. To us, it is the only way sourdough deserves to be baked.</p>
        <p>When wild yeast and lactobacilli ferment slowly at 4°C (39°F), complex starches break down into easily digestible simple sugars, and glutens are enzymatically softened. The result is a loaf with an airy, glossy, custard-like open crumb and a deeply blistered caramelized crust that stays fresh on the kitchen counter for days without preservatives.</p>
        <p>Every single loaf of our Levain No. 4 is hand-shaped using organic flour stoneground in small batches by regional millers. When you slice into it, you're not just tasting flour and water—you're tasting three days of patience, temperature stewardship, and honest woodcraft.</p>
      `
    },
    'cookies': {
      title: 'The secret to a really good cookie.',
      category: 'THE CRAFT',
      readTime: '4 min read',
      author: 'Julian Cole • Pastry Chef',
      date: 'May 10, 2026',
      image: 'assets/images/blog_chocolate_cookies.webp?v=2',
      quote: 'Brown butter adds toasted hazelnut notes, but it is the 48-hour cold dough rest that turns a cookie into an event.',
      content: `
        <p>A truly unforgettable chocolate chip cookie is not an accident. It is an exercise in heat transfer, fat emulsification, and ingredient restraint.</p>
        <p>First, we slowly brown our Normandy cultured butter until milk solids turn deep chestnut and release an irresistible hazelnut aroma. We cool the butter before beating it with dark muscovado and golden cane sugar.</p>
        <p>Second, we never bake cookie dough on the day it is made. Resting the portioned dough in the chiller for 48 hours allows flour enzymes to fully hydrate and sugars to caramelize uniformly. We fold in hand-chopped 70% Valrhona dark chocolate callets and finish every cookie with a pinch of hand-harvested flaky Maldon sea salt straight as it emerges bubbling from the oven.</p>
      `
    },
    'galette': {
      title: 'A little sunshine, folded into pastry.',
      category: 'SEASONAL SPECIAL',
      readTime: '5 min read',
      author: 'Clara Dupont • Viennoiserie',
      date: 'May 04, 2026',
      image: 'assets/images/blog_peach_galette.webp?v=2',
      quote: 'Fruit galettes celebrate the beautiful imperfection of rustic baking—golden rough-puff pastry framing nature at its peak.',
      content: `
        <p>Summer at Stackly means crates of sun-warmed stone fruits arriving weekly from family orchards. While formal patisserie demands geometric precision, our summer galettes celebrate freeform rusticity.</p>
        <p>We roll our rough-puff rye pastry thin and cold, spreading a layer of almond and cardamom frangipane across the center to catch excess fruit juices during baking. Sliced yellow peaches and royal apricots are fanned out in a spiral, dotted with vanilla butter, and dusted with coarse turbinado sugar.</p>
        <p>The edges are folded gently by hand, creating crisp, fluted pockets of caramelized pastry. Served lukewarm with a dollop of crème fraîche, it is summer captured in a single pastry plate.</p>
      `
    },
    'pause': {
      title: 'The case for a proper afternoon pause.',
      category: 'PAIRINGS',
      readTime: '3 min read',
      author: 'Marcus & Linnea • Cafe Curators',
      date: 'April 28, 2026',
      image: 'assets/images/blog_afternoon_pause.webp?v=2',
      quote: 'A cup of coffee and a slice of warm spice cake is not an indulgence—it is a conscious punctuation mark in the day.',
      content: `
        <p>In Sweden they call it <em>Fika</em>, in France <em>le goûter</em>. Around 3:30 PM, the energy of the morning has settled, and the evening has not yet arrived. It is the golden hour of the bakery.</p>
        <p>Our spiced cinnamon walnut cake is baked in heavy cast bundt pans with brown sugar streusel ribbons running through the crumb. It possesses just enough cinnamon, nutmeg, and ginger heat to awaken the palate, balanced by the crunch of toasted English walnuts.</p>
        <p>We pair it with a single-origin pour-over from Colombia with stone fruit acidity and chocolate body. Stepping away from the laptop for fifteen minutes with warm cake and quiet coffee is the simplest luxury we know.</p>
      `
    },
    'crumb': {
      title: 'The anatomy of an open, airy crumb.',
      category: 'BAKING GUIDES',
      readTime: '6 min read',
      author: 'Elena Vance • Head Baker',
      date: 'April 22, 2026',
      image: 'assets/images/blog_open_crumb_guide.webp?v=2',
      quote: 'An open crumb is not achieved through aggression; it is coaxed through hydration and gentle coil folds.',
      content: `
        <p>Bakers obsess over open crumb structure—the delicate, translucent webbing of gluten pockets that gives artisan sourdough its legendary custardy bite. But high hydration alone does not guarantee an open crumb.</p>
        <p>The real secret lies in gluten organization during bulk fermentation. Rather than heavy punch-downs, we utilize wet-hand coil folds every 45 minutes for the first two hours. This aligns gluten strands vertically without degassing precious micro-bubbles.</p>
        <p>Coupled with an 82% hydration levain and stone-milled whole wheat flour, the dough traps expanding water vapor during the bake, resulting in an ear that sings and interior honeycombing that catches every drop of butter.</p>
      `
    },
    'butter': {
      title: 'Cultured butter: The soul of viennoiserie.',
      category: 'THE CRAFT',
      readTime: '5 min read',
      author: 'Julian Cole • Pastry Chef',
      date: 'April 15, 2026',
      image: 'assets/images/blog_cultured_butter.webp?v=2',
      quote: 'Commercial butter has water; Normandy cultured butter has terroir, lactic acid, and pure pastry elasticity.',
      content: `
        <p>Ordinary supermarket butter contains roughly 80% butterfat and 18% water. In laminated viennoiserie, that excess water creates steam prematurely, boiling the dough rather than crisping the layers.</p>
        <p>We source 84% butterfat Beurre de Baratte made from grass-fed Normandy churns. The cream is naturally ripened with live lactic cultures for 24 hours before traditional wooden barrel churning.</p>
        <p>This gives our croissants not only their rich hazelnut undertones and deep golden hue, but also the crucial thermal plasticity needed to stretch into 81 micro-thin sheets without tearing or leaking onto the deck.</p>
      `
    },
    'buns': {
      title: 'Cardamom morning buns: Our winter warmth.',
      category: 'SEASONAL SPECIAL',
      readTime: '4 min read',
      author: 'Clara Dupont • Viennoiserie',
      date: 'April 08, 2026',
      image: 'assets/images/blog_morning_buns.webp?v=2',
      quote: 'Crushed green cardamom pods release citrus essential oils that elevate simple morning brioche into pure comfort.',
      content: `
        <p>In Nordic bakery tradition, cardamom is prized above cinnamon for morning pastries. We grind whole organic green cardamom pods in our mortar and pestle right before rolling into dough.</p>
        <p>Our slow-fermented brioche dough is rolled ultra-thin, brushed generously with brown sugar and vanilla butter, and folded into knotted ribbons. Before hitting the stone deck ovens, each bun is crowned with crunchy Swedish pearl sugar.</p>
        <p>Fresh from the deck at 7:30 AM, the edges caramelize into sticky toffee while the interior remains pillowy soft, fragrant, and citrus-spiced.</p>
      `
    },
    'masterclass': {
      title: 'The Architecture of Croissant Lamination.',
      category: 'BAKING TECHNIQUES',
      readTime: '7 min read',
      author: 'Elena Vance • Head Baker',
      date: 'May 01, 2026',
      image: 'assets/images/blog_laminated_dough.webp?v=2',
      quote: '81 layers of butter and dough: colder than the room, softer than a stone, pliable as silk.',
      content: `
        <p>Lamination is the culinary art of creating alternating microscopic sheets of dough (<em>détrempe</em>) and solid butter (<em>beurrage</em>). When baked at high heat, the moisture in the butter evaporates into steam, pushing the dough layers apart before baking into crisp honeycomb air pockets.</p>
        <p><strong>Step 1: Cold Butter Lock</strong><br>The butter block must match the exact pliable plasticity of the chilled dough. If the butter is too cold, it shatters into shards; if too warm, it melts into the flour.</p>
        <p><strong>Step 2: The Double and Single Turns</strong><br>We perform one book fold (double turn) followed by one letter fold (single turn), yielding precisely 81 distinct layers. Between each fold, the dough rests for 90 minutes in the cold room to relax gluten tensions.</p>
        <p><strong>Step 3: The Stone Deck Steam Bake</strong><br>Chilled croissants are proofed gently at 26°C (78°F) until they quiver like gelatin. They are baked at 220°C with 15 seconds of direct saturated steam to set the blistered glass-crisp exterior.</p>
      `
    },
    'homebaker': {
      title: 'How to bake bakery-quality loaves in a home oven.',
      category: 'BAKING GUIDES',
      readTime: '8 min read',
      author: 'Elena Vance • Head Baker',
      date: 'May 18, 2026',
      image: 'assets/images/blog_home_oven_baker.webp?v=2',
      quote: 'The secret is not spending ten thousand dollars on a deck oven—it is mastering steam and understanding dough elasticity.',
      content: `
        <p>Many home bakers struggle with pale crusts, weak oven spring, and gummy crumbs. But with a heavy cast-iron Dutch oven and disciplined temperature management, you can achieve professional sourdough boules in any residential kitchen.</p>
        <p>Preheat your pot and lid inside the oven at 250°C (485°F) for at least 45 minutes. When you drop the cold, scored dough into the hot pot and replace the lid, the dough’s own moisture is trapped in a tight chamber, replicating the steam injection of a commercial hearth.</p>
        <p>After 20 minutes, remove the lid to vent the steam and drop the temperature to 220°C. In the dry heat, sugars and amino acids undergo the Maillard reaction, forming deep reddish-brown blisters, a singing crust, and an open, glossy crumb.</p>
      `
    }
  };

  // --------------------------------------------------------------------------
  // 2. STICKY NAVBAR SCROLL STATE (Handled primarily by navbar.js)
  // --------------------------------------------------------------------------
  const header = document.querySelector('.blog-header');
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
  // 3. CATEGORY FILTER TABS FOR JOURNAL SECTION
  // --------------------------------------------------------------------------
  const filterButtons = document.querySelectorAll('.filter-btn');
  const journalCards = document.querySelectorAll('.journal-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Set active button
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.dataset.filter;

      journalCards.forEach(card => {
        const cardCategory = card.dataset.category;
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => {
            card.style.transition = 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.style.display = 'none';
        }
      });

      if (typeof AOS !== 'undefined') {
        setTimeout(() => AOS.refresh(), 100);
      }
    });
  });

  // --------------------------------------------------------------------------
  // 4. STORY READING DRAWER / MODAL
  // --------------------------------------------------------------------------
  const modalOverlay = document.getElementById('storyModalOverlay');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalTag = document.getElementById('modalStoryTag');
  const modalTitle = document.getElementById('modalStoryTitle');
  const modalMeta = document.getElementById('modalStoryMeta');
  const modalImg = document.getElementById('modalStoryImg');
  const modalQuote = document.getElementById('modalStoryQuote');
  const modalText = document.getElementById('modalStoryText');

  function openStoryModal(storyId) {
    const story = storiesDatabase[storyId] || storiesDatabase['fermentation'];

    modalTag.textContent = story.category;
    modalTitle.textContent = story.title;
    modalMeta.innerHTML = `<span><i class="fa-solid fa-user-pen"></i> ${story.author}</span> • <span><i class="fa-solid fa-clock"></i> ${story.readTime}</span> • <span>${story.date}</span>`;
    modalImg.src = story.image;
    modalImg.alt = story.title;
    modalQuote.textContent = story.quote;
    modalText.innerHTML = story.content;

    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeStoryModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Trigger modal on story links
  document.querySelectorAll('[data-story-id]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const storyId = link.dataset.storyId;
      openStoryModal(storyId);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeStoryModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeStoryModal();
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('open')) {
      closeStoryModal();
    }
  });

  // --------------------------------------------------------------------------
  // 5. INTERACTIVE MASTERCLASS TECHNIQUE STEPS
  // --------------------------------------------------------------------------
  const stepItems = document.querySelectorAll('.masterclass-step-item');
  stepItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      stepItems.forEach(s => s.style.opacity = '0.65');
      item.style.opacity = '1';
      item.style.transform = 'translateX(6px)';
      item.style.transition = 'all 0.25s ease';
    });

    item.addEventListener('mouseleave', () => {
      stepItems.forEach(s => {
        s.style.opacity = '1';
        s.style.transform = 'translateX(0)';
      });
    });

    item.addEventListener('click', () => {
      openStoryModal('masterclass');
    });
  });

  // --------------------------------------------------------------------------
  // 6. NEWSLETTER SUBSCRIPTION FORM WITH INSTANT FEEDBACK
  // --------------------------------------------------------------------------
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterInput = document.getElementById('newsletterEmail');
  const newsletterFeedback = document.getElementById('newsletterFeedback');
  const newsletterBtn = document.getElementById('newsletterSubmitBtn');

  if (newsletterForm && newsletterInput) {
    newsletterInput.addEventListener('input', () => {
      newsletterInput.classList.remove('is-invalid');
      newsletterInput.style.borderColor = '';
      if (newsletterFeedback) {
        newsletterFeedback.textContent = '';
        newsletterFeedback.className = 'newsletter-feedback';
      }
    });

    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletterInput.value.trim();
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (!email) {
        newsletterInput.focus();
        newsletterInput.classList.add('is-invalid');
        if (newsletterFeedback) {
          newsletterFeedback.textContent = 'Email is required';
          newsletterFeedback.className = 'newsletter-feedback error';
        }
        return;
      }

      if (!emailRegex.test(email)) {
        newsletterInput.focus();
        newsletterInput.classList.add('is-invalid');
        if (newsletterFeedback) {
          newsletterFeedback.textContent = 'Please enter a valid email address';
          newsletterFeedback.className = 'newsletter-feedback error';
        }
        return;
      }

      newsletterInput.classList.remove('is-invalid');
      newsletterInput.style.borderColor = '';
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
          newsletterFeedback.textContent = `You're on the list! We've sent our 72-Hour Wild Levain Starter Guide to ${email}.`;
          newsletterFeedback.className = 'newsletter-feedback active';
        }
        newsletterInput.value = '';

        try {
          localStorage.setItem('stackly_blog_subscribed', 'true');
        } catch (_) {}
      }, 700);
    });
  }

  // --------------------------------------------------------------------------
  // 7. FAST LIVE KEYWORD SEARCH MODAL
  // --------------------------------------------------------------------------
  const searchToggleBtn = document.getElementById('searchToggleBtn');
  const searchModalOverlay = document.getElementById('searchModalOverlay');
  const searchCloseBtn = document.getElementById('searchCloseBtn');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');

  function openSearchModal() {
    if (!searchModalOverlay) return;
    searchModalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      if (searchInput) searchInput.focus();
    }, 100);
  }

  function closeSearchModal() {
    if (!searchModalOverlay) return;
    searchModalOverlay.classList.remove('open');
    document.body.style.overflow = '';
    if (searchInput) searchInput.value = '';
    if (searchResults) searchResults.innerHTML = '';
  }

  if (searchToggleBtn) {
    searchToggleBtn.addEventListener('click', openSearchModal);
  }

  if (searchCloseBtn) {
    searchCloseBtn.addEventListener('click', closeSearchModal);
  }

  if (searchModalOverlay) {
    searchModalOverlay.addEventListener('click', (e) => {
      if (e.target === searchModalOverlay) closeSearchModal();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      if (!searchResults) return;

      if (!query) {
        searchResults.innerHTML = '';
        return;
      }

      const matches = Object.entries(storiesDatabase).filter(([id, story]) => {
        return (
          story.title.toLowerCase().includes(query) ||
          story.category.toLowerCase().includes(query) ||
          story.content.toLowerCase().includes(query)
        );
      });

      if (matches.length === 0) {
        searchResults.innerHTML = `<p style="color:var(--text-dark-muted); padding:1rem 0;">No journal stories found matching "${query}". Try "sourdough", "cookies", or "butter".</p>`;
      } else {
        searchResults.innerHTML = matches.map(([id, story]) => `
          <div class="search-result-row" data-story-id="${id}" style="padding:0.85rem; border-bottom:1px solid rgba(255,255,255,0.08); cursor:pointer; display:flex; gap:1rem; align-items:center;">
            <img src="${story.image}" alt="" style="width:52px; height:52px; border-radius:8px; object-fit:cover;">
            <div>
              <span style="font-size:0.72rem; color:var(--color-orange); font-weight:800; text-transform:uppercase;">${story.category}</span>
              <h4 style="font-size:0.95rem; font-weight:700; color:#fff; margin-top:2px;">${story.title}</h4>
            </div>
          </div>
        `).join('');

        searchResults.querySelectorAll('.search-result-row').forEach(row => {
          row.addEventListener('click', () => {
            const sid = row.dataset.storyId;
            closeSearchModal();
            openStoryModal(sid);
          });
        });
      }
    });
  }

  // --------------------------------------------------------------------------
  // 8. MOBILE DRAWER NAVIGATION
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
});
