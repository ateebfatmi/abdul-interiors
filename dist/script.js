(() => {
  // --- 1. DEFAULT CONFIGURATION & SMART FALLBACKS ---
  const defaultConfig = {
    brandName: "Atelier Interiors",
    brandLogoMain: "ATELIER",
    brandLogoSub: "INTERIORS",
    tagline: "Furniture of Distinction",
    description: "Explore statement dining sets, sculptural seating and bespoke interior furniture crafted by master artisans.",
    phoneDisplay: "+1 (800) 555-0199",
    phoneTel: "+18005550199",
    email: "concierge@atelierinteriors.com",
    instagramHandle: "@atelier.interiors",
    instagramUrl: "https://instagram.com",
    whatsappNumber: "18005550199",
    whatsappMessage: "Hi, I am interested in commissioning a bespoke furniture piece with your atelier.",
    storyKicker: "The Atelier",
    storyTitle: "Designed to be<br /><em>remembered.</em>",
    storyLead: "Atelier Interiors creates sculptural sofas, bespoke beds, architectural dining furniture and handcrafted seating.",
    conciergePrompt: "Discuss a dining set, sofa, bed, chair or entirely custom piece directly with our design atelier.",
    reels: [],
    isDemo: true
  };

  const rawConfig = window.SITE_CONFIG || window.ABDUL_INTERIORS_CONFIG || {};
  const config = Object.assign({}, defaultConfig, rawConfig);

  // Parse query parameters
  const params = new URLSearchParams(window.location.search);
  const clientName = params.get('brand') || params.get('name') || params.get('client');
  if (clientName) {
    applyBrandName(clientName);
  }

  const phoneParam = params.get('phone') || params.get('tel');
  if (phoneParam) {
    config.phoneDisplay = phoneParam;
    config.phoneTel = phoneParam.replace(/[^\d+]/g, '');
    config.whatsappNumber = config.phoneTel.replace('+', '');
  }

  const igParam = params.get('ig') || params.get('instagram');
  if (igParam) {
    const handle = igParam.startsWith('@') ? igParam : `@${igParam}`;
    config.instagramHandle = handle;
    config.instagramUrl = `https://www.instagram.com/${handle.replace('@', '')}/`;
  }

  const emailParam = params.get('email');
  if (emailParam) {
    config.email = emailParam;
  }

  function applyBrandName(name) {
    config.brandName = name.trim();
    const parts = config.brandName.split(/\s+/);
    if (parts.length > 1) {
      config.brandLogoMain = parts[0].toUpperCase();
      config.brandLogoSub = parts.slice(1).join(' ').toUpperCase();
    } else {
      config.brandLogoMain = config.brandName.toUpperCase();
      config.brandLogoSub = 'INTERIORS';
    }
    config.storyLead = `${config.brandName} creates sculptural sofas, bespoke beds, architectural dining furniture and handcrafted seating.`;
  }

  // --- 2. APPLY CONFIGURATION TO DOM ---
  function applySiteConfig() {
    document.title = `${config.brandName} | ${config.tagline}`;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = config.description;
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = `${config.brandName} | ${config.tagline}`;

    document.querySelectorAll('.brand-primary').forEach((el) => {
      el.textContent = config.brandLogoMain;
    });
    document.querySelectorAll('.brand-secondary').forEach((el) => {
      el.textContent = config.brandLogoSub;
    });
    document.querySelectorAll('.brand-name').forEach((el) => {
      el.textContent = config.brandName;
    });

    document.querySelectorAll('.concierge-phone').forEach((el) => {
      el.href = `tel:${config.phoneTel}`;
      if (el.classList.contains('button')) {
        el.innerHTML = `Call ${config.phoneDisplay} <span>↗</span>`;
      } else {
        el.textContent = config.phoneDisplay;
      }
    });

    document.querySelectorAll('.concierge-email').forEach((el) => {
      el.href = `mailto:${config.email}`;
      el.textContent = config.email;
    });

    document.querySelectorAll('.concierge-instagram').forEach((el) => {
      el.href = config.instagramUrl;
      if (!el.classList.contains('button') && !el.classList.contains('atelier-link')) {
        el.textContent = `${config.instagramHandle} ↗`;
      }
    });

    const waNumber = config.whatsappNumber || config.phoneTel.replace(/[^\d]/g, '');
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(config.whatsappMessage)}`;
    document.querySelectorAll('.concierge-whatsapp, .dialog-whatsapp').forEach((el) => {
      el.href = waUrl;
    });

    const conciergePrompt = document.querySelector('#concierge-prompt');
    if (conciergePrompt && config.conciergePrompt) {
      conciergePrompt.textContent = config.conciergePrompt;
    }

    const storyLead = document.querySelector('.story-lead');
    if (storyLead && config.storyLead) {
      storyLead.textContent = config.storyLead;
    }
  }

  applySiteConfig();

  // --- 3. HEADER & MOBILE NAVIGATION ---
  const header = document.querySelector('#site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('#mobile-nav');

  const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 30);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
    mobileNav.hidden = isOpen;
    document.body.classList.toggle('menu-open', !isOpen);
    header.classList.toggle('menu-active', !isOpen);
  });

  mobileNav.querySelectorAll('a').forEach((link) =>
    link.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open menu');
      mobileNav.hidden = true;
      document.body.classList.remove('menu-open');
      header.classList.remove('menu-active');
    })
  );

  // --- 4. HERO ROOM VIEWS SWITCHER ---
  const roomButtons = document.querySelectorAll('.room-btn');
  const heroSlides = document.querySelectorAll('.hero-slide');
  let currentSlideIdx = 0;
  let heroTimer = null;

  function switchHeroView(viewKey) {
    roomButtons.forEach((btn) => {
      const active = btn.dataset.view === viewKey;
      btn.classList.toggle('active', active);
    });
    heroSlides.forEach((slide) => {
      const active = slide.dataset.slide === viewKey;
      slide.classList.toggle('active', active);
    });
  }

  roomButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      clearInterval(heroTimer);
      switchHeroView(btn.dataset.view);
    });
  });

  const viewsList = ['dining', 'living', 'atelier'];
  heroTimer = setInterval(() => {
    currentSlideIdx = (currentSlideIdx + 1) % viewsList.length;
    switchHeroView(viewsList[currentSlideIdx]);
  }, 8000);

  // --- 5. SCROLL REVEAL OBSERVER ---
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

  // --- 6. COLLECTION FILTERS ---
  const filters = document.querySelectorAll('.filter');
  const productCards = document.querySelectorAll('.product-card');
  filters.forEach((button) =>
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filters.forEach((item) => {
        const active = item === button;
        item.classList.toggle('active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      productCards.forEach((card) => {
        card.hidden = filter !== 'all' && card.dataset.category !== filter;
      });
    })
  );

  // --- 7. LIVE VISUAL BESPOKE CUSTOMIZER ---
  const customizerState = {
    wood: 'American Black Walnut',
    surface: 'Honed Roman Travertine',
    upholstery: 'Ivory Belgian Bouclé',
    price: '$5,400 – $7,200',
    img: 'assets/ai/hero-dining.jpg'
  };

  const stageImg = document.querySelector('#stage-img');
  const stagePriceVal = document.querySelector('#stage-price-val');
  const cfgWood = document.querySelector('#cfg-wood');
  const cfgSurface = document.querySelector('#cfg-surface');
  const cfgUph = document.querySelector('#cfg-uph');
  const customizerWaBtn = document.querySelector('#customizer-wa-btn');

  function updateCustomizer() {
    if (stageImg) stageImg.src = customizerState.img;
    if (stagePriceVal) stagePriceVal.textContent = customizerState.price;
    if (cfgWood) cfgWood.textContent = customizerState.wood;
    if (cfgSurface) cfgSurface.textContent = customizerState.surface;
    if (cfgUph) cfgUph.textContent = customizerState.upholstery;

    if (customizerWaBtn) {
      const waNumber = config.whatsappNumber || config.phoneTel.replace(/[^\d]/g, '');
      const text = `Hi ${config.brandName}, I configured a custom dining commission:\n• Hardwood: ${customizerState.wood}\n• Surface: ${customizerState.surface}\n• Upholstery: ${customizerState.upholstery}\nEstimated guide: ${customizerState.price}.\nCould we discuss drawings and timeline?`;
      customizerWaBtn.href = `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
    }
  }

  document.querySelectorAll('.swatch-picker').forEach((picker) => {
    picker.querySelectorAll('.swatch-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        picker.querySelectorAll('.swatch-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const param = picker.dataset.param;
        customizerState[param] = btn.dataset.val;

        if (btn.dataset.img) customizerState.img = btn.dataset.img;
        if (btn.dataset.price) customizerState.price = btn.dataset.price;

        updateCustomizer();
      });
    });
  });

  updateCustomizer();

  // --- 8. BEFORE & AFTER TRANSFORMATION SLIDER ---
  const sliderWrapper = document.querySelector('#before-after-slider');
  if (sliderWrapper) {
    const beforeImg = sliderWrapper.querySelector('.img-before');
    const divider = sliderWrapper.querySelector('.slider-divider');
    const handle = sliderWrapper.querySelector('.slider-handle-btn');
    let isDragging = false;

    function moveSlider(clientX) {
      const rect = sliderWrapper.getBoundingClientRect();
      let pos = (clientX - rect.left) / rect.width;
      pos = Math.max(0.05, Math.min(0.95, pos));
      const pct = pos * 100;
      beforeImg.style.clipPath = `polygon(0 0, ${pct}% 0, ${pct}% 100%, 0 100%)`;
      divider.style.left = `${pct}%`;
      handle.style.left = `${pct}%`;
    }

    sliderWrapper.addEventListener('mousedown', (e) => {
      isDragging = true;
      moveSlider(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      moveSlider(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    sliderWrapper.addEventListener('touchstart', (e) => {
      isDragging = true;
      moveSlider(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      moveSlider(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });
  }

  // --- 9. INTERACTIVE BESPOKE COMMISSION ESTIMATOR ---
  const estimatorState = {
    space: 'Dining Salon',
    material: 'American Black Walnut',
    scale: 'Grand (6–8 Seats)'
  };

  const optPills = document.querySelectorAll('.opt-pill');
  const summaryTitle = document.querySelector('#summary-title');
  const summaryDesc = document.querySelector('#summary-desc');
  const specSpace = document.querySelector('#spec-space');
  const specMaterial = document.querySelector('#spec-material');
  const specScale = document.querySelector('#spec-scale');
  const commissionAction = document.querySelector('#commission-action');

  function updateEstimator() {
    let title = '';
    if (estimatorState.space === 'Dining Salon') {
      title = `${estimatorState.scale.split(' ')[0]} Dining Suite`;
    } else if (estimatorState.space === 'Living Salon') {
      title = `Architectural Salon Suite`;
    } else if (estimatorState.space === 'Master Suite') {
      title = `Sanctuary Master Commission`;
    } else {
      title = `Executive Studio Commission`;
    }

    if (summaryTitle) summaryTitle.textContent = title;
    if (specSpace) specSpace.textContent = estimatorState.space;
    if (specMaterial) specMaterial.textContent = estimatorState.material;
    if (specScale) specScale.textContent = estimatorState.scale;
    if (summaryDesc) {
      summaryDesc.textContent = `A bespoke ${estimatorState.space.toLowerCase()} centerpiece sculpted in ${estimatorState.material}, proportioned for ${estimatorState.scale.toLowerCase()}.`;
    }

    if (commissionAction) {
      const waNumber = config.whatsappNumber || config.phoneTel.replace(/[^\d]/g, '');
      const text = `Hi ${config.brandName}, I would like to enquire about a bespoke commission: ${title} in ${estimatorState.material} for my ${estimatorState.space} (${estimatorState.scale}).`;
      commissionAction.href = `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
    }
  }

  optPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const parent = pill.closest('.estimator-options');
      const group = parent.dataset.group;
      parent.querySelectorAll('.opt-pill').forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      estimatorState[group] = pill.dataset.val;
      updateEstimator();
    });
  });

  updateEstimator();

  // --- 10. PRODUCT SPECIFICATIONS & LIGHTBOX DIALOG ---
  const products = {
    'signature-six': {
      title: 'The Signature Six',
      image: 'assets/ai/hero-dining.jpg',
      alt: 'Premium six-seater dining set with travertine table',
      copy: 'A six-seater statement dining suite with sculpted high-back chairs and a solid honed Roman travertine tabletop resting upon a monumental fluted dark walnut plinth.',
      dim: '260cm L × 110cm W × 76cm H',
      mat: 'Honed Roman Travertine & American Black Walnut'
    },
    'cane-curve': {
      title: 'The Cane Curve',
      image: 'assets/ai/cane-chair.jpg',
      alt: 'Curved cane-back wooden armchair',
      copy: 'An expressive steam-bent solid oak framework paired with intricately hand-woven natural cane backrest and tailored ivory Belgian bouclé seating.',
      dim: '72cm W × 78cm D × 84cm H (Seat 44cm)',
      mat: 'Solid White Oak, Natural Cane & Belgian Bouclé'
    },
    'carved-table': {
      title: 'The Carved Table',
      image: 'assets/ai/carved-dining.jpg',
      alt: 'Carved wooden dining set',
      copy: 'A richly detailed artisanal dining table crafted from solid dark smoked oak, featuring architectural fluted pedestal pillars and hand-rubbed satin oil luster.',
      dim: '300cm L × 120cm W × 76cm H',
      mat: 'Dark Smoked Architectural Oak'
    },
    'sculpted-chair': {
      title: 'The Sculpted Chair',
      image: 'assets/ai/sculpted-chair.jpg',
      alt: 'Sculptural wooden lounge chair',
      copy: 'Fluid biomorphic curves sculpted from solid American walnut. An iconic statement chair bridging the gap between functional seating and gallery art.',
      dim: '82cm W × 86cm D × 74cm H',
      mat: 'Carved Solid American Black Walnut'
    },
    'hand-finished': {
      title: 'Made by Hand',
      image: 'assets/ai/hand-craft.jpg',
      alt: 'Master artisan hand-finishing furniture',
      copy: 'Every contour, joint, and surface receives hand-burnished finishing inside our atelier workshop using organic plant oils and beeswax.',
      dim: 'Atelier Studies & Tailored Commissions',
      mat: 'Natural Organic Matte Oils & Sustainable Hardwoods'
    }
  };

  const dialog = document.querySelector('#product-dialog');
  const dialogImage = dialog.querySelector('img');
  const dialogTitle = dialog.querySelector('h2');
  const dialogCopy = dialog.querySelector('.dialog-copy');
  const dialogDim = dialog.querySelector('.spec-dim');
  const dialogMat = dialog.querySelector('.spec-mat');
  const dialogPhone = dialog.querySelector('.dialog-phone');
  const dialogWa = dialog.querySelector('.dialog-whatsapp');
  let lastTrigger = null;

  document.querySelectorAll('[data-open-product]').forEach((trigger) =>
    trigger.addEventListener('click', () => {
      const productKey = trigger.dataset.openProduct;
      const product = products[productKey];
      if (!product) return;

      lastTrigger = trigger;
      dialogImage.src = product.image;
      dialogImage.alt = product.alt;
      dialogTitle.textContent = product.title;
      dialogCopy.textContent = product.copy;

      if (dialogDim) dialogDim.textContent = product.dim || 'Custom dimensions available';
      if (dialogMat) dialogMat.textContent = product.mat || 'Noble Hardwood & Stone';

      if (dialogPhone) {
        dialogPhone.href = `tel:${config.phoneTel}`;
        dialogPhone.innerHTML = `Enquire by phone (${config.phoneDisplay}) <span>↗</span>`;
      }

      if (dialogWa) {
        const waNumber = config.whatsappNumber || config.phoneTel.replace(/[^\d]/g, '');
        const text = `Hi ${config.brandName}, I am interested in ordering or customizing "${product.title}". Could you provide details?`;
        dialogWa.href = `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
      }

      dialog.showModal();
    })
  );

  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('click', (event) => {
    const box = dialog.getBoundingClientRect();
    if (
      event.clientX < box.left ||
      event.clientX > box.right ||
      event.clientY < box.top ||
      event.clientY > box.bottom
    ) {
      dialog.close();
    }
  });
  dialog.addEventListener('close', () => lastTrigger?.focus());

  // --- 11. CONSULTATION BOOKING MODAL ---
  const bookingDialog = document.querySelector('#booking-dialog');
  const closeBookingBtn = document.querySelector('#close-booking-btn');
  const bookingForm = document.querySelector('#booking-form');
  const bookingStatus = document.querySelector('#booking-status');

  const openBookingBtns = [
    document.querySelector('#header-book-btn'),
    document.querySelector('#hero-consult-btn'),
    document.querySelector('#trade-cta-btn')
  ].filter(Boolean);

  openBookingBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (bookingDialog) bookingDialog.showModal();
    });
  });

  if (closeBookingBtn && bookingDialog) {
    closeBookingBtn.addEventListener('click', () => bookingDialog.close());
    bookingDialog.addEventListener('click', (e) => {
      const box = bookingDialog.getBoundingClientRect();
      if (e.clientX < box.left || e.clientX > box.right || e.clientY < box.top || e.clientY > box.bottom) {
        bookingDialog.close();
      }
    });

    document.querySelectorAll('.booking-opt-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.booking-opt-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    document.querySelectorAll('.slot-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.slot-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = bookingForm.elements.bookName.value.trim();
      const phone = bookingForm.elements.bookPhone.value.trim();
      const notes = bookingForm.elements.bookNotes.value.trim();
      const opt = document.querySelector('.booking-opt-btn.active')?.dataset.type || 'Virtual Consultation';
      const slot = document.querySelector('.slot-btn.active')?.textContent || 'Tomorrow';

      bookingStatus.textContent = `✓ Consultation Confirmed for ${name} (${opt} at ${slot}). An atelier concierge invitation has been prepared.`;
      bookingStatus.classList.add('show');

      setTimeout(() => {
        const waNumber = config.whatsappNumber || config.phoneTel.replace(/[^\d]/g, '');
        const waMsg = `Hi ${config.brandName}, I just scheduled an Atelier Consultation:\n• Client: ${name}\n• Contact: ${phone}\n• Format: ${opt} (${slot})\n• Notes: ${notes || 'None'}`;
        window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(waMsg)}`, '_blank');
      }, 1200);
    });
  }

  // --- 12. SWATCH SAMPLE BOX MODAL ---
  const swatchDialog = document.querySelector('#swatch-dialog');
  const closeSwatchBtn = document.querySelector('#close-swatch-btn');
  const swatchForm = document.querySelector('#swatch-form');
  const swatchStatus = document.querySelector('#swatch-status');

  const openSwatchBtns = [
    document.querySelector('#hero-swatch-btn'),
    document.querySelector('#trade-swatch-btn')
  ].filter(Boolean);

  openSwatchBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (swatchDialog) swatchDialog.showModal();
    });
  });

  if (closeSwatchBtn && swatchDialog) {
    closeSwatchBtn.addEventListener('click', () => swatchDialog.close());
    swatchDialog.addEventListener('click', (e) => {
      const box = swatchDialog.getBoundingClientRect();
      if (e.clientX < box.left || e.clientX > box.right || e.clientY < box.top || e.clientY > box.bottom) {
        swatchDialog.close();
      }
    });

    swatchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      swatchStatus.classList.add('show');
      setTimeout(() => {
        swatchDialog.close();
        swatchStatus.classList.remove('show');
      }, 2400);
    });
  }

  // Trade CAD Button
  const tradeCadBtn = document.querySelector('#trade-cad-btn');
  if (tradeCadBtn) {
    tradeCadBtn.addEventListener('click', () => {
      const waNumber = config.whatsappNumber || config.phoneTel.replace(/[^\d]/g, '');
      const text = `Hi ${config.brandName}, I am an architect / interior designer requesting the complete 3D CAD & BIM model pack (Revit/SketchUp/Rhino) for client project renders.`;
      window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`, '_blank');
    });
  }

  const tradeJoinBtn = document.querySelector('#trade-join-btn');
  if (tradeJoinBtn) {
    tradeJoinBtn.addEventListener('click', () => {
      if (swatchDialog) swatchDialog.showModal();
    });
  }

  // --- 13. AMBIENT AUDIO ATMOSPHERE (WEB AUDIO SYNTHESIS) ---
  const soundToggle = document.querySelector('#sound-toggle');
  let audioCtx = null;
  let isSoundPlaying = false;
  let droneNodes = [];

  function startAmbientAudio() {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.06, audioCtx.currentTime);
      masterGain.connect(audioCtx.destination);

      // Warm soothing chord frequencies (F# minor 9th ethereal atelier ambience)
      const freqs = [92.5, 138.59, 185.0, 277.18, 329.63];

      droneNodes = freqs.map((freq, i) => {
        const osc = audioCtx.createOscillator();
        const filter = audioCtx.createBiquadFilter();
        const gain = audioCtx.createGain();

        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, audioCtx.currentTime);

        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);
        osc.start();

        return { osc, gain };
      });

      isSoundPlaying = true;
      if (soundToggle) {
        soundToggle.classList.add('playing');
        soundToggle.querySelector('.sound-label').textContent = 'Sound: Active';
      }
    } catch (e) {
      console.log('Audio init prevented:', e);
    }
  }

  function stopAmbientAudio() {
    if (audioCtx) {
      audioCtx.close();
      audioCtx = null;
    }
    droneNodes = [];
    isSoundPlaying = false;
    if (soundToggle) {
      soundToggle.classList.remove('playing');
      soundToggle.querySelector('.sound-label').textContent = 'Atelier Sound';
    }
  }

  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      if (isSoundPlaying) {
        stopAmbientAudio();
      } else {
        startAmbientAudio();
      }
    });
  }

  // --- 14. MEMBERSHIP FORM ---
  const membershipForm = document.querySelector('#membership-form');
  const membershipStatus = membershipForm.querySelector('.membership-status');
  membershipForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = membershipForm.elements.memberName.value.trim();
    const contact = membershipForm.elements.memberContact.value.trim();
    if (name.length < 2 || contact.length < 5) {
      membershipStatus.textContent = 'Please provide your name and a valid contact number or email.';
      membershipStatus.classList.add('show');
      return;
    }

    membershipStatus.innerHTML = `Thank you, ${name}. Your private-access invitation has been registered with ${config.brandName}. For immediate commission consultations, please call <a href="tel:${config.phoneTel}">${config.phoneDisplay}</a> or message <a href="${config.instagramUrl}" target="_blank" rel="noopener">${config.instagramHandle}</a>.`;
    membershipStatus.classList.add('show');
  });

  // --- 15. FOOTER YEAR ---
  const yearEl = document.querySelector('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
