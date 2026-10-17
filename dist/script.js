(() => {
  // ========================================================
  // 1. CONFIGURATION & PRESETS
  // ========================================================
  const presets = window.SITE_PRESETS || {
    abdul: {
      key: "abdul",
      brandName: "Abdul Interiors",
      brandLogoMain: "ABDUL",
      brandLogoSub: "INTERIORS",
      tagline: "Handcrafted Luxury & Bespoke Woodcraft",
      description: "Explore statement dining suites, sculptural seating and bespoke handcrafted interior furniture made by master artisans.",
      phoneDisplay: "+91 90129 30381",
      phoneTel: "+919012930381",
      email: "abdulinteriors21@gmail.com",
      instagramHandle: "@abdulinteriors21",
      instagramUrl: "https://www.instagram.com/abdulinteriors21/",
      whatsappNumber: "919012930381",
      whatsappMessage: "Hi Abdul Interiors, I am interested in commissioning a handcrafted furniture piece. Could you share designs, pricing and delivery details?",
      location: "Saharanpur & Delhi NCR · Pan-India & Worldwide Crating",
      currency: "INR",
      currencySymbol: "₹",
      foundingYear: "2015",
      storyKicker: "The Workshop Atelier",
      storyTitle: "Handcrafted to be<br /><em>cherished for generations.</em>",
      storyLead: "Abdul Interiors crafts monumental solid wood dining suites, royal bedroom collections, and hand-carved sculptural seating.",
      conciergePrompt: "Discuss a dining set, sofa, bed, chair or entirely custom piece directly with master artisan Mohd Imran."
    },
    atelier: {
      key: "atelier",
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
      whatsappMessage: "Hi Atelier Interiors, I am interested in commissioning a bespoke furniture piece. Could you share more details?",
      location: "Design District · Available Worldwide",
      currency: "USD",
      currencySymbol: "$",
      foundingYear: "2018",
      storyKicker: "The Atelier",
      storyTitle: "Designed to be<br /><em>remembered.</em>",
      storyLead: "Atelier Interiors creates sculptural sofas, bespoke beds, architectural dining furniture and handcrafted seating.",
      conciergePrompt: "Discuss a dining set, sofa, bed, chair or entirely custom piece directly with our design atelier."
    }
  };

  const params = new URLSearchParams(window.location.search);
  const savedKey = localStorage.getItem('client_site_preset');
  const currentKey = params.get('client') || savedKey || 'abdul';
  
  let currentConfig = Object.assign({}, presets[currentKey] || presets.abdul, window.SITE_CONFIG || {});

  // URL Query Parameter Overrides
  const brandParam = params.get('brand') || params.get('name');
  if (brandParam) applyBrandName(brandParam);

  const phoneParam = params.get('phone') || params.get('tel');
  if (phoneParam) {
    currentConfig.phoneDisplay = phoneParam;
    currentConfig.phoneTel = phoneParam.replace(/[^\d+]/g, '');
    currentConfig.whatsappNumber = currentConfig.phoneTel.replace('+', '');
  }

  const igParam = params.get('ig') || params.get('instagram');
  if (igParam) {
    const handle = igParam.startsWith('@') ? igParam : `@${igParam}`;
    currentConfig.instagramHandle = handle;
    currentConfig.instagramUrl = `https://www.instagram.com/${handle.replace('@', '')}/`;
  }

  const emailParam = params.get('email');
  if (emailParam) currentConfig.email = emailParam;

  const curParam = params.get('cur') || params.get('currency');
  if (curParam) {
    currentConfig.currency = curParam.toUpperCase();
    currentConfig.currencySymbol = currentConfig.currency === 'INR' ? '₹' : (currentConfig.currency === 'EUR' ? '€' : (currentConfig.currency === 'GBP' ? '£' : '$'));
  }

  function applyBrandName(name) {
    currentConfig.brandName = name.trim();
    const parts = currentConfig.brandName.split(/\s+/);
    if (parts.length > 1) {
      currentConfig.brandLogoMain = parts[0].toUpperCase();
      currentConfig.brandLogoSub = parts.slice(1).join(' ').toUpperCase();
    } else {
      currentConfig.brandLogoMain = currentConfig.brandName.toUpperCase();
      currentConfig.brandLogoSub = 'INTERIORS';
    }
    currentConfig.storyLead = `${currentConfig.brandName} creates sculptural sofas, bespoke beds, architectural dining furniture and handcrafted seating.`;
  }

  // Toast Notification
  const toastEl = document.querySelector('#toast-notification');
  let toastTimer = null;
  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2600);
  }

  // ========================================================
  // 2. CURRENCY & PRICING HELPERS
  // ========================================================
  function formatMoney(amount, currency) {
    const cur = currency || currentConfig.currency || 'INR';
    if (cur === 'INR') {
      return '₹' + Number(amount).toLocaleString('en-IN');
    } else if (cur === 'EUR') {
      return '€' + Number(amount).toLocaleString('en-US');
    } else if (cur === 'GBP') {
      return '£' + Number(amount).toLocaleString('en-US');
    } else {
      return '$' + Number(amount).toLocaleString('en-US');
    }
  }

  function updateCurrencyUI() {
    const isINR = currentConfig.currency === 'INR';
    const curLabel = isINR ? '₹ INR' : '$ USD';

    const curCodeEl = document.querySelector('#cur-code');
    if (curCodeEl) curCodeEl.textContent = curLabel;

    const mobCurLabel = document.querySelector('#mobile-cur-label');
    if (mobCurLabel) mobCurLabel.textContent = curLabel;

    // Update product grid badge prices
    document.querySelectorAll('.product-badge-price').forEach((badge) => {
      const priceText = isINR ? badge.dataset.inr : badge.dataset.usd;
      if (priceText) badge.textContent = priceText;
    });

    updateCustomizer();
    updateEstimator();
  }

  function toggleCurrency() {
    currentConfig.currency = currentConfig.currency === 'INR' ? 'USD' : 'INR';
    currentConfig.currencySymbol = currentConfig.currency === 'INR' ? '₹' : '$';
    updateCurrencyUI();
    showToast(`Currency updated to ${currentConfig.currencySymbol} ${currentConfig.currency}`);
  }

  const curToggleBtn = document.querySelector('#currency-toggle');
  if (curToggleBtn) curToggleBtn.addEventListener('click', toggleCurrency);

  const mobCurToggleBtn = document.querySelector('#mobile-currency-toggle');
  if (mobCurToggleBtn) mobCurToggleBtn.addEventListener('click', toggleCurrency);

  // ========================================================
  // 3. APPLY CONFIGURATION TO DOM
  // ========================================================
  function applySiteConfig() {
    document.title = `${currentConfig.brandName} | ${currentConfig.tagline}`;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = currentConfig.description;

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = `${currentConfig.brandName} | ${currentConfig.tagline}`;

    document.querySelectorAll('.brand-primary').forEach((el) => {
      el.textContent = currentConfig.brandLogoMain;
    });
    document.querySelectorAll('.brand-secondary').forEach((el) => {
      el.textContent = currentConfig.brandLogoSub;
    });
    document.querySelectorAll('.brand-name').forEach((el) => {
      el.textContent = currentConfig.brandName;
    });

    // Location
    const footerLoc = document.querySelector('#footer-location');
    if (footerLoc && currentConfig.location) {
      footerLoc.textContent = `📍 ${currentConfig.location}`;
    }

    // Phone
    document.querySelectorAll('.concierge-phone, .dialog-phone').forEach((el) => {
      el.href = `tel:${currentConfig.phoneTel}`;
      if (el.classList.contains('button') && !el.classList.contains('sticky-action-btn')) {
        el.innerHTML = `Call ${currentConfig.phoneDisplay} <span>↗</span>`;
      } else if (!el.classList.contains('sticky-action-btn')) {
        el.textContent = currentConfig.phoneDisplay;
      }
    });

    // Email
    document.querySelectorAll('.concierge-email').forEach((el) => {
      el.href = `mailto:${currentConfig.email}`;
      el.textContent = currentConfig.email;
    });

    // Instagram
    document.querySelectorAll('.concierge-instagram').forEach((el) => {
      el.href = currentConfig.instagramUrl;
      if (!el.classList.contains('button') && !el.classList.contains('atelier-link')) {
        el.textContent = `${currentConfig.instagramHandle} ↗`;
      }
    });

    // WhatsApp
    const waNumber = currentConfig.whatsappNumber || currentConfig.phoneTel.replace(/[^\d]/g, '');
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(currentConfig.whatsappMessage)}`;
    document.querySelectorAll('.concierge-whatsapp, .dialog-whatsapp').forEach((el) => {
      el.href = waUrl;
    });

    // Concierge prompt
    const conciergePrompt = document.querySelector('#concierge-prompt');
    if (conciergePrompt && currentConfig.conciergePrompt) {
      conciergePrompt.textContent = currentConfig.conciergePrompt;
    }

    // Story lead
    const storyLead = document.querySelector('.story-lead');
    if (storyLead && currentConfig.storyLead) {
      storyLead.textContent = currentConfig.storyLead;
    }

    const storyKicker = document.querySelector('.story-kicker');
    if (storyKicker && currentConfig.storyKicker) {
      storyKicker.textContent = currentConfig.storyKicker;
    }

    const storyTitle = document.querySelector('#story-title');
    if (storyTitle && currentConfig.storyTitle) {
      storyTitle.innerHTML = currentConfig.storyTitle;
    }

    // Preset active buttons in pitch modal
    document.querySelectorAll('.preset-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.preset === currentConfig.key);
    });

    updateCurrencyUI();
  }

  applySiteConfig();

  // ========================================================
  // 4. HEADER & MOBILE NAVIGATION
  // ========================================================
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

  // ========================================================
  // 5. HERO ROOM VIEWS SWITCHER & DYNAMIC FEATURED CARD
  // ========================================================
  const roomButtons = document.querySelectorAll('.room-btn');
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroFeatureTag = document.querySelector('#hero-feature-tag');
  const heroFeatureTitle = document.querySelector('#hero-feature-title');
  const heroFeatureDesc = document.querySelector('#hero-feature-desc');
  const heroFeatureBtn = document.querySelector('#hero-feature-btn');
  let currentSlideIdx = 0;
  let heroTimer = null;

  const roomFeatures = {
    dining: {
      tag: 'Featured · Dining Suite',
      title: 'The Signature Six',
      desc: 'Honed Roman travertine plinth with high-back sculpted walnut seating.',
      product: 'signature-six'
    },
    living: {
      tag: 'Featured · Grand Salon',
      title: 'The Monolith Salon',
      desc: 'Curved architectural bouclé sofa centered around organic stone coffee plinths.',
      product: 'monolith-salon'
    },
    atelier: {
      tag: 'Featured · Artisan Bench',
      title: 'Master Handcraft',
      desc: 'Traditional mortise-and-tenon craftsmanship with hand-burnished organic oil finish.',
      product: 'hand-finished'
    }
  };

  function switchHeroView(viewKey) {
    roomButtons.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.view === viewKey);
    });
    heroSlides.forEach((slide) => {
      slide.classList.toggle('active', slide.dataset.slide === viewKey);
    });

    const feat = roomFeatures[viewKey];
    if (feat) {
      if (heroFeatureTag) heroFeatureTag.textContent = feat.tag;
      if (heroFeatureTitle) heroFeatureTitle.textContent = feat.title;
      if (heroFeatureDesc) heroFeatureDesc.textContent = feat.desc;
      if (heroFeatureBtn) heroFeatureBtn.dataset.openProduct = feat.product;
    }
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
  }, 9000);

  // ========================================================
  // 6. SCROLL REVEAL OBSERVER
  // ========================================================
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );
  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

  // ========================================================
  // 7. COLLECTION FILTERS & PRODUCT GALLERY
  // ========================================================
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
        const match = filter === 'all' || card.dataset.category === filter;
        card.hidden = !match;
      });
    })
  );

  // ========================================================
  // 8. PRODUCT SPECIFICATIONS & LIGHTBOX DIALOG
  // ========================================================
  const products = {
    'signature-six': {
      title: 'The Signature Six',
      image: 'assets/ai/hero-dining.jpg',
      alt: 'Premium six-seater dining set with travertine table',
      copy: 'A monumental six-seater dining suite featuring sculpted high-back chairs and a honed Roman travertine tabletop resting upon a fluted dark walnut pedestal plinth.',
      dim: '260cm L × 110cm W × 76cm H',
      mat: 'Honed Roman Travertine & Solid American Walnut',
      craftTime: '4–6 Weeks Atelier Fabrication',
      priceINR: '₹1,85,000 – ₹2,45,000',
      priceUSD: '$5,400 – $7,200'
    },
    'cane-curve': {
      title: 'The Cane Curve Armchair',
      image: 'assets/ai/cane-chair.jpg',
      alt: 'Curved cane-back wooden armchair',
      copy: 'An expressive steam-bent solid oak framework paired with intricately hand-woven natural cane backrest and tailored ivory Belgian bouclé cushioning.',
      dim: '72cm W × 78cm D × 84cm H (Seat 44cm)',
      mat: 'Steam-Bent Oak, Natural Rattan Cane & Bouclé',
      craftTime: '3–4 Weeks Handcraft',
      priceINR: '₹45,000 – ₹68,000',
      priceUSD: '$1,800 – $2,400'
    },
    'royal-dining': {
      title: 'The Royal Heritage Dining Suite',
      image: 'assets/instagram/06-polished-dining-set.jpg',
      alt: 'Hand-carved polished solid teak dining suite',
      copy: 'Masterfully carved solid seasoned teak dining table with high-gloss natural polish, paired with 6 royal cushioned dining chairs featuring hand-carved crest rails.',
      dim: '240cm L × 105cm W × 78cm H',
      mat: 'Solid Seasoned Teak / Sheesham & Royal Upholstery',
      craftTime: '4–5 Weeks Master Joinery',
      priceINR: '₹1,45,000 – ₹1,95,000',
      priceUSD: '$4,200 – $5,800'
    },
    'sculpted-chair': {
      title: 'The Sculpted Biomorphic Chair',
      image: 'assets/ai/sculpted-chair.jpg',
      alt: 'Biomorphic sculpted wooden chair in gallery setting',
      copy: 'Fluid biomorphic contours sculpted from solid hardwood. An iconic statement chair bridging the gap between functional seating and gallery art.',
      dim: '82cm W × 86cm D × 74cm H',
      mat: 'Carved Solid Walnut & Satin Oil Finish',
      craftTime: '3–5 Weeks Hand Sculpture',
      priceINR: '₹75,000 – ₹95,000',
      priceUSD: '$2,600 – $3,400'
    },
    'monolith-salon': {
      title: 'The Monolith Salon Suite',
      image: 'assets/images/hero-living.webp',
      alt: 'Architectural curved sofa and stone table in living salon',
      copy: 'Curved architectural salon sofa wrapped in tactile bouclé, centered by an organic low-profile stone and dark timber coffee plinth.',
      dim: '320cm W × 110cm D × 72cm H',
      mat: 'Belgian Bouclé Wool & Solid Hardwood Framework',
      craftTime: '5–7 Weeks Atelier Upholstery',
      priceINR: '₹2,10,000 – ₹2,90,000',
      priceUSD: '$6,200 – $8,500'
    },
    'carved-table': {
      title: 'The Fluted Pedestal Dining Table',
      image: 'assets/ai/carved-dining.jpg',
      alt: 'Carved wooden dining set with fluted pedestal',
      copy: 'A richly detailed artisanal dining table crafted from solid dark smoked oak, featuring architectural fluted pedestal pillars and hand-rubbed satin oil luster.',
      dim: '300cm L × 120cm W × 76cm H',
      mat: 'Dark Smoked Architectural Oak',
      craftTime: '4–6 Weeks Fabrication',
      priceINR: '₹1,65,000 – ₹2,25,000',
      priceUSD: '$5,100 – $6,800'
    },
    'artisan-chairs': {
      title: 'Handcrafted Heritage Chairs',
      image: 'assets/instagram/01-wooden-chairs.jpg',
      alt: 'Pair of artisanal solid wood chairs with carved backs',
      copy: 'Traditional solid wood dining chairs built with mortise-and-tenon joints, slatted backs, and ergonomic curved seats designed to endure for generations.',
      dim: '52cm W × 55cm D × 92cm H',
      mat: 'Solid Seasoned Hardwood & Hand-Rubbed Polish',
      craftTime: '2–3 Weeks Workshop Craft',
      priceINR: '₹22,000 – ₹32,000',
      priceUSD: '$850 – $1,200'
    },
    'sanctuary-bed': {
      title: 'The Master Sanctuary Bedstead',
      image: 'assets/images/bedroom.webp',
      alt: 'Bespoke upholstered luxury king bedstead',
      copy: 'An architectural king-size bedstead with upholstered headboard wings, floating timber bedside plinths, and concealed under-frame ambient support.',
      dim: 'King Size: 220cm W × 230cm L × 110cm H',
      mat: 'Solid Hardwood Frame & Tailored Belgian Linen',
      craftTime: '4–6 Weeks Master Upholstery',
      priceINR: '₹1,55,000 – ₹2,10,000',
      priceUSD: '$4,800 – $6,500'
    },
    'hand-finished': {
      title: 'Made by Hand (Artisan Craft Study)',
      image: 'assets/ai/hand-craft.jpg',
      alt: 'Master artisan hand-finishing furniture with oil',
      copy: 'Every contour, joint, and surface receives hand-burnished finishing inside our workshop atelier using organic plant oils, natural wax, and traditional joinery.',
      dim: 'Custom Commissions & Studio Studies',
      mat: 'Hardwood Joinery & Natural Oil Finish',
      craftTime: 'Individually Fabricated',
      priceINR: '₹95,000 – ₹1,40,000',
      priceUSD: '$3,200 – $4,800'
    }
  };

  const productDialog = document.querySelector('#product-dialog');
  const dialogImg = productDialog.querySelector('img');
  const dialogTitle = productDialog.querySelector('h2');
  const dialogCopy = productDialog.querySelector('.dialog-copy');
  const dialogDim = productDialog.querySelector('.spec-dim');
  const dialogMat = productDialog.querySelector('.spec-mat');
  const dialogCraft = productDialog.querySelector('.spec-craft');
  const dialogPrice = productDialog.querySelector('.spec-price');
  const dialogPhone = productDialog.querySelector('.dialog-phone');
  const dialogWa = productDialog.querySelector('.dialog-whatsapp');
  let lastProductTrigger = null;

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-open-product]');
    if (!trigger) return;

    const productKey = trigger.dataset.openProduct;
    const prod = products[productKey];
    if (!prod) return;

    lastProductTrigger = trigger;
    dialogImg.src = prod.image;
    dialogImg.alt = prod.alt || prod.title;
    dialogTitle.textContent = prod.title;
    dialogCopy.textContent = prod.copy;

    if (dialogDim) dialogDim.textContent = prod.dim;
    if (dialogMat) dialogMat.textContent = prod.mat;
    if (dialogCraft) dialogCraft.textContent = prod.craftTime || '4–6 Weeks Atelier Handcraft';
    
    if (dialogPrice) {
      dialogPrice.textContent = currentConfig.currency === 'INR' ? prod.priceINR : prod.priceUSD;
    }

    if (dialogPhone) {
      dialogPhone.href = `tel:${currentConfig.phoneTel}`;
      dialogPhone.innerHTML = `Enquire by Phone (${currentConfig.phoneDisplay}) <span>↗</span>`;
    }

    if (dialogWa) {
      const waNumber = currentConfig.whatsappNumber || currentConfig.phoneTel.replace(/[^\d]/g, '');
      const text = `Hi ${currentConfig.brandName}, I am interested in commissioning "${prod.title}". Could you provide specifications, timeline and quote?`;
      dialogWa.href = `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
    }

    productDialog.showModal();
  });

  productDialog.querySelector('.dialog-close').addEventListener('click', () => productDialog.close());
  productDialog.querySelectorAll('a').forEach((l) => l.addEventListener('click', () => productDialog.close()));
  productDialog.addEventListener('click', (e) => {
    const box = productDialog.getBoundingClientRect();
    if (e.clientX < box.left || e.clientX > box.right || e.clientY < box.top || e.clientY > box.bottom) {
      productDialog.close();
    }
  });

  // ========================================================
  // 9. LIVE VISUAL BESPOKE CUSTOMIZER
  // ========================================================
  const customizerState = {
    wood: 'American Black Walnut',
    surface: 'Honed Roman Travertine',
    upholstery: 'Ivory Belgian Bouclé',
    woodTier: 'base',
    surfaceCost: 'travertine',
    uphCost: 'boucle',
    img: 'assets/ai/hero-dining.jpg'
  };

  const stageImg = document.querySelector('#stage-img');
  const stagePriceVal = document.querySelector('#stage-price-val');
  const cfgWood = document.querySelector('#cfg-wood');
  const cfgSurface = document.querySelector('#cfg-surface');
  const cfgUph = document.querySelector('#cfg-uph');
  const customizerWaBtn = document.querySelector('#customizer-wa-btn');

  function calculateCustomizerPrice() {
    // Base pricing values
    let baseUSDMin = 4800;
    let baseUSDMax = 6400;

    // Wood tier
    if (customizerState.woodTier === 'teak') { baseUSDMin += 200; baseUSDMax += 400; }
    else if (customizerState.woodTier === 'smoked') { baseUSDMin += 300; baseUSDMax += 500; }
    else if (customizerState.woodTier === 'oak') { baseUSDMin += 100; baseUSDMax += 200; }

    // Surface
    if (customizerState.surfaceCost === 'travertine') { baseUSDMin += 600; baseUSDMax += 800; }
    else if (customizerState.surfaceCost === 'timber') { baseUSDMin += 300; baseUSDMax += 500; }
    else if (customizerState.surfaceCost === 'cane') { baseUSDMin += 200; baseUSDMax += 300; }
    else if (customizerState.surfaceCost === 'marble') { baseUSDMin += 800; baseUSDMax += 1100; }

    // Upholstery
    if (customizerState.uphCost === 'boucle') { baseUSDMin += 300; baseUSDMax += 400; }
    else if (customizerState.uphCost === 'leather') { baseUSDMin += 500; baseUSDMax += 700; }
    else if (customizerState.uphCost === 'linen') { baseUSDMin += 200; baseUSDMax += 300; }
    else if (customizerState.uphCost === 'velvet') { baseUSDMin += 400; baseUSDMax += 500; }

    if (currentConfig.currency === 'INR') {
      const inrMin = Math.round((baseUSDMin * 34) / 1000) * 1000;
      const inrMax = Math.round((baseUSDMax * 34) / 1000) * 1000;
      return `${formatMoney(inrMin, 'INR')} – ${formatMoney(inrMax, 'INR')}`;
    } else {
      return `${formatMoney(baseUSDMin, currentConfig.currency)} – ${formatMoney(baseUSDMax, currentConfig.currency)}`;
    }
  }

  function updateCustomizer() {
    const formattedPrice = calculateCustomizerPrice();
    if (stageImg) stageImg.src = customizerState.img;
    if (stagePriceVal) stagePriceVal.textContent = formattedPrice;
    if (cfgWood) cfgWood.textContent = customizerState.wood;
    if (cfgSurface) cfgSurface.textContent = customizerState.surface;
    if (cfgUph) cfgUph.textContent = customizerState.upholstery;

    if (customizerWaBtn) {
      const waNumber = currentConfig.whatsappNumber || currentConfig.phoneTel.replace(/[^\d]/g, '');
      const text = `Hi ${currentConfig.brandName}, I configured a custom furniture piece on your website:\n• Timber: ${customizerState.wood}\n• Tabletop: ${customizerState.surface}\n• Upholstery: ${customizerState.upholstery}\nEstimated Guide: ${formattedPrice}\nCould we discuss drawings and timeline?`;
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
        if (btn.dataset.tier) customizerState.woodTier = btn.dataset.tier;
        if (btn.dataset.cost) {
          if (param === 'surface') customizerState.surfaceCost = btn.dataset.cost;
          if (param === 'upholstery') customizerState.uphCost = btn.dataset.cost;
        }

        updateCustomizer();
      });
    });
  });

  updateCustomizer();

  // ========================================================
  // 10. BEFORE & AFTER TRANSFORMATION SLIDER
  // ========================================================
  const sliderWrapper = document.querySelector('#before-after-slider');
  if (sliderWrapper) {
    const beforeImg = sliderWrapper.querySelector('.img-before');
    const divider = sliderWrapper.querySelector('.slider-divider');
    const handle = sliderWrapper.querySelector('.slider-handle-btn');
    let isDragging = false;

    function moveSlider(clientX) {
      const rect = sliderWrapper.getBoundingClientRect();
      let pos = (clientX - rect.left) / rect.width;
      pos = Math.max(0.04, Math.min(0.96, pos));
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

    window.addEventListener('mouseup', () => { isDragging = false; });

    sliderWrapper.addEventListener('touchstart', (e) => {
      isDragging = true;
      moveSlider(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      moveSlider(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchend', () => { isDragging = false; });
  }

  // ========================================================
  // 11. BESPOKE COMMISSION ESTIMATOR
  // ========================================================
  const estimatorState = {
    space: 'Dining Salon',
    material: 'American Black Walnut',
    scale: 'Grand (6–8 Seats)'
  };

  const summaryTitle = document.querySelector('#summary-title');
  const summaryDesc = document.querySelector('#summary-desc');
  const specSpace = document.querySelector('#spec-space');
  const specMaterial = document.querySelector('#spec-material');
  const specScale = document.querySelector('#spec-scale');
  const specGuidePrice = document.querySelector('#spec-guide-price');
  const commissionAction = document.querySelector('#commission-action');

  function calculateEstimatorPrice() {
    let base = 5000;
    if (estimatorState.space === 'Living Salon') base = 6000;
    else if (estimatorState.space === 'Master Suite') base = 4800;
    else if (estimatorState.space === 'Private Study') base = 3800;

    if (estimatorState.scale.includes('Monumental')) base *= 1.4;
    else if (estimatorState.scale.includes('Custom')) base *= 1.6;
    else if (estimatorState.scale.includes('Intimate')) base *= 0.75;

    const minUSD = Math.round(base * 0.9);
    const maxUSD = Math.round(base * 1.25);

    if (currentConfig.currency === 'INR') {
      const inrMin = Math.round((minUSD * 34) / 1000) * 1000;
      const inrMax = Math.round((maxUSD * 34) / 1000) * 1000;
      return `${formatMoney(inrMin, 'INR')} – ${formatMoney(inrMax, 'INR')}`;
    } else {
      return `${formatMoney(minUSD, currentConfig.currency)} – ${formatMoney(maxUSD, currentConfig.currency)}`;
    }
  }

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

    const priceRange = calculateEstimatorPrice();

    if (summaryTitle) summaryTitle.textContent = title;
    if (specSpace) specSpace.textContent = estimatorState.space;
    if (specMaterial) specMaterial.textContent = estimatorState.material;
    if (specScale) specScale.textContent = estimatorState.scale;
    if (specGuidePrice) specGuidePrice.textContent = priceRange;
    if (summaryDesc) {
      summaryDesc.textContent = `A bespoke ${estimatorState.space.toLowerCase()} centerpiece sculpted in ${estimatorState.material}, proportioned for ${estimatorState.scale.toLowerCase()}.`;
    }

    if (commissionAction) {
      const waNumber = currentConfig.whatsappNumber || currentConfig.phoneTel.replace(/[^\d]/g, '');
      const text = `Hi ${currentConfig.brandName}, I would like to enquire about a bespoke commission: ${title} in ${estimatorState.material} for my ${estimatorState.space} (${estimatorState.scale}). Indicative guide: ${priceRange}.`;
      commissionAction.href = `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
    }
  }

  document.querySelectorAll('.opt-pill').forEach((pill) => {
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

  // ========================================================
  // 12. MATERIAL DEEP-DIVE MODAL
  // ========================================================
  const materials = {
    walnut: {
      title: 'American Black Walnut',
      tag: 'Hardwood · Sustainable Sourcing',
      color: '#4b3621',
      desc: 'Prized for deep chocolate hues, undulating cathedral grain, and dimensional stability. Burnished by hand with organic matte oils for a silky tactile surface.',
      hardness: '1,010 lbf (Janka Scale)',
      origin: 'Eastern North America (FSC Certified)',
      finish: 'Hand-rubbed organic tung and beeswax satin oil',
      care: 'Wipe with microfiber cloth; condition with organic wood balm annually.'
    },
    travertine: {
      title: 'Honed Roman Travertine',
      tag: 'Living Natural Stone · Italy',
      color: '#dcd3c1',
      desc: 'Monumental porous limestone with warm cream-beige striations and organic cavities. Honed and sealed with an invisible penetrating matte sealant that preserves natural breathability.',
      hardness: '3–4 (Mohs Hardness Scale)',
      origin: 'Tivoli & Rome Quarries, Italy',
      finish: 'Honed matte with breathable penetrating organic sealant',
      care: 'Clean with pH-neutral stone wash; avoid acidic liquids.'
    },
    cane: {
      title: 'Natural Woven Cane (Rattan)',
      tag: 'Artisanal Fiber · Organic Handcraft',
      color: '#e2c290',
      desc: 'Sustainably harvested rattan peel, hand-woven in classic octagonal weave. Delivers breathable ergonomics and lightweight visual poetry.',
      hardness: 'High Tensile Structural Flexibility',
      origin: 'Sustainable Southeast Asian Groves',
      finish: 'Natural untreated fibers with protective organic beeswax',
      care: 'Mist lightly with water once every 6 months to maintain hydration.'
    },
    oak: {
      title: 'Dark Smoked Architectural Oak',
      tag: 'Hardwood · Ammonia Fumed',
      color: '#6a6458',
      desc: 'European white oak fumed with natural ammonia vapor to react with natural tannins. Yields a deep earthy charcoal tone straight through the wood core without artificial dyes.',
      hardness: '1,360 lbf (Janka Scale)',
      origin: 'Central European Managed Forests (PEFC)',
      finish: 'Deep wire-brushed texture with matte botanical oil seal',
      care: 'Dust with soft dry cloth; buff with natural wood conditioner.'
    },
    boucle: {
      title: 'Belgian Bouclé & Textured Linen',
      tag: 'Textile · Heavy Residential & Hospitality',
      color: '#e9e5dd',
      desc: 'High-character looped wool and flax blend woven in Belgium. Yields an ultra-tactile three-dimensional surface that resists crushing and pilling.',
      hardness: '50,000+ Martindale Rubs (Heavy Duty)',
      origin: 'Flanders, Belgium',
      finish: 'Natural fluorocarbon-free stain-resistant treatment',
      care: 'Vacuum with soft upholstery brush; blot spills immediately with water.'
    },
    brass: {
      title: 'Living Patina Solid Brass',
      tag: 'Noble Metal · Unlacquered Architectural Joinery',
      color: '#cbb47c',
      desc: 'Solid unlacquered brass hardware, structural brackets and foot ferrules. Develops an authentic, organic living patina unique to its environment over decades.',
      hardness: 'Solid C36000 Architectural Alloy',
      origin: 'Precision Hand-Turned',
      finish: 'Hand-brushed raw brass without synthetic clear-coats',
      care: 'Allow natural patina to develop, or polish with Cape Cod cloth for shine.'
    }
  };

  const matDialog = document.querySelector('#material-dialog');
  const matSwatch = document.querySelector('#material-dialog-swatch');
  const matTitle = document.querySelector('#material-dialog-title');
  const matDesc = document.querySelector('#material-dialog-desc');
  const matHardness = document.querySelector('#mat-spec-hardness');
  const matOrigin = document.querySelector('#mat-spec-origin');
  const matFinish = document.querySelector('#mat-spec-finish');
  const matCare = document.querySelector('#mat-spec-care');

  document.querySelectorAll('[data-open-material]').forEach((card) => {
    const handleOpen = () => {
      const matKey = card.dataset.openMaterial;
      const m = materials[matKey];
      if (!m || !matDialog) return;

      matSwatch.style.backgroundColor = m.color;
      matTitle.textContent = m.title;
      matDesc.textContent = m.desc;
      if (matHardness) matHardness.textContent = m.hardness;
      if (matOrigin) matOrigin.textContent = m.origin;
      if (matFinish) matFinish.textContent = m.finish;
      if (matCare) matCare.textContent = m.care;

      matDialog.showModal();
    };

    card.addEventListener('click', handleOpen);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleOpen();
      }
    });
  });

  const closeMatBtn = document.querySelector('#close-material-btn');
  const matCloseBtn = document.querySelector('#mat-close-btn');
  [closeMatBtn, matCloseBtn].forEach((btn) => {
    if (btn && matDialog) btn.addEventListener('click', () => matDialog.close());
  });

  if (matDialog) {
    matDialog.addEventListener('click', (e) => {
      const box = matDialog.getBoundingClientRect();
      if (e.clientX < box.left || e.clientX > box.right || e.clientY < box.top || e.clientY > box.bottom) {
        matDialog.close();
      }
    });
  }

  const matReqSwatchBtn = document.querySelector('#mat-req-swatch-btn');
  if (matReqSwatchBtn) {
    matReqSwatchBtn.addEventListener('click', () => {
      if (matDialog) matDialog.close();
      const swatchDialog = document.querySelector('#swatch-dialog');
      if (swatchDialog) swatchDialog.showModal();
    });
  }

  // ========================================================
  // 13. CONSULTATION SCHEDULER & .ICS CALENDAR DOWNLOAD
  // ========================================================
  function generateAndDownloadICS(title, description, location, timeStr) {
    try {
      const now = new Date();
      const dtStamp = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 1); // Tomorrow
      if (timeStr.includes('10:00')) startDate.setHours(10, 0, 0, 0);
      else if (timeStr.includes('02:30')) startDate.setHours(14, 30, 0, 0);
      else if (timeStr.includes('05:00')) startDate.setHours(17, 0, 0, 0);
      else startDate.setHours(11, 0, 0, 0);

      const endDate = new Date(startDate.getTime() + 30 * 60 * 1000);
      const dtStart = startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      const dtEnd = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

      const ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Atelier & Abdul Interiors//Consultation//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:REQUEST',
        'BEGIN:VEVENT',
        `UID:${Date.now()}@abdulinteriors.com`,
        `DTSTAMP:${dtStamp}`,
        `DTSTART:${dtStart}`,
        `DTEND:${dtEnd}`,
        `SUMMARY:${title}`,
        `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
        `LOCATION:${location}`,
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `Atelier_Consultation_${Date.now()}.ics`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.log('ICS generation fallback:', e);
    }
  }

  const bookingDialog = document.querySelector('#booking-dialog');
  const closeBookingBtn = document.querySelector('#close-booking-btn');
  const bookingForm = document.querySelector('#booking-form');
  const bookingStatus = document.querySelector('#booking-status');
  const bookingStatusText = document.querySelector('#booking-status-text');
  const bookingWaHandoff = document.querySelector('#booking-wa-handoff');

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
      const slot = document.querySelector('.slot-btn.active')?.textContent || '10:00 AM';

      // 1. Download ICS Calendar Event
      generateAndDownloadICS(
        `${currentConfig.brandName} Consultation with ${name}`,
        `Bespoke furniture commission consultation.\nFormat: ${opt}\nContact: ${phone}\nScope: ${notes || 'None'}`,
        currentConfig.location || 'Studio Atelier',
        slot
      );

      // 2. Prepare WhatsApp handoff
      const waNumber = currentConfig.whatsappNumber || currentConfig.phoneTel.replace(/[^\d]/g, '');
      const waMsg = `Hi ${currentConfig.brandName}, I just scheduled a design consultation:\n• Client: ${name}\n• Contact: ${phone}\n• Format: ${opt} (${slot})\n• Notes: ${notes || 'None'}`;
      if (bookingWaHandoff) {
        bookingWaHandoff.href = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMsg)}`;
      }

      if (bookingStatusText) {
        bookingStatusText.textContent = `✓ Consultation Confirmed for ${name} (${opt} at ${slot})! Your calendar invitation (.ics) is downloaded.`;
      }
      bookingStatus.classList.add('show');
      showToast('✓ Consultation booked & added to calendar!');
    });
  }

  // ========================================================
  // 14. SWATCH SAMPLE BOX MODAL
  // ========================================================
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
      showToast('📦 Swatch Box Registered for Dispatch!');
      setTimeout(() => {
        swatchDialog.close();
        swatchStatus.classList.remove('show');
      }, 2000);
    });
  }

  // Trade CAD & Concierge
  const tradeCadBtn = document.querySelector('#trade-cad-btn');
  if (tradeCadBtn) {
    tradeCadBtn.addEventListener('click', () => {
      const waNumber = currentConfig.whatsappNumber || currentConfig.phoneTel.replace(/[^\d]/g, '');
      const text = `Hi ${currentConfig.brandName}, I am an architect / interior designer requesting the 3D CAD & BIM model pack (Revit/SketchUp/Rhino) for client project renders.`;
      window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`, '_blank');
    });
  }

  const tradeJoinBtn = document.querySelector('#trade-join-btn');
  if (tradeJoinBtn) {
    tradeJoinBtn.addEventListener('click', () => {
      if (swatchDialog) swatchDialog.showModal();
    });
  }

  // ========================================================
  // 15. DISCRETE CLIENT PITCH & BRAND SWITCHER
  // ========================================================
  const pitchDialog = document.querySelector('#pitch-dialog');
  const closePitchBtn = document.querySelector('#close-pitch-btn');
  const pitchTrigger = document.querySelector('#pitch-trigger');
  const mobilePitchTrigger = document.querySelector('#mobile-pitch-trigger');
  const customPitchForm = document.querySelector('#custom-pitch-form');
  const copyPitchUrlBtn = document.querySelector('#copy-pitch-url-btn');

  function openPitchModal() {
    if (pitchDialog) pitchDialog.showModal();
  }

  if (pitchTrigger) pitchTrigger.addEventListener('click', openPitchModal);
  if (mobilePitchTrigger) mobilePitchTrigger.addEventListener('click', openPitchModal);

  // Keyboard shortcut: Alt + P or Cmd + K
  window.addEventListener('keydown', (e) => {
    if ((e.altKey && (e.key === 'p' || e.key === 'P')) || ((e.metaKey || e.ctrlKey) && e.key === 'k')) {
      e.preventDefault();
      openPitchModal();
    }
  });

  if (closePitchBtn && pitchDialog) {
    closePitchBtn.addEventListener('click', () => pitchDialog.close());
    pitchDialog.addEventListener('click', (e) => {
      const box = pitchDialog.getBoundingClientRect();
      if (e.clientX < box.left || e.clientX > box.right || e.clientY < box.top || e.clientY > box.bottom) {
        pitchDialog.close();
      }
    });
  }

  // Preset buttons
  document.querySelectorAll('.preset-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const presetKey = btn.dataset.preset;
      const target = presets[presetKey];
      if (!target) return;

      currentConfig = Object.assign({}, target);
      localStorage.setItem('client_site_preset', presetKey);
      applySiteConfig();
      if (pitchDialog) pitchDialog.close();
      showToast(`⚡ Switched to ${target.brandName}`);
    });
  });

  // Custom client form
  if (customPitchForm) {
    customPitchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const brand = customPitchForm.elements.customBrand.value.trim();
      const phone = customPitchForm.elements.customPhone.value.trim();
      const ig = customPitchForm.elements.customIg.value.trim();
      const cur = customPitchForm.elements.customCur.value;

      if (brand) applyBrandName(brand);
      if (phone) {
        currentConfig.phoneDisplay = phone;
        currentConfig.phoneTel = phone.replace(/[^\d+]/g, '');
        currentConfig.whatsappNumber = currentConfig.phoneTel.replace('+', '');
      }
      if (ig) {
        const h = ig.startsWith('@') ? ig : `@${ig}`;
        currentConfig.instagramHandle = h;
        currentConfig.instagramUrl = `https://www.instagram.com/${h.replace('@', '')}/`;
      }
      if (cur) {
        currentConfig.currency = cur;
        currentConfig.currencySymbol = cur === 'INR' ? '₹' : (cur === 'EUR' ? '€' : (cur === 'GBP' ? '£' : '$'));
      }

      applySiteConfig();
      if (pitchDialog) pitchDialog.close();
      showToast(`✓ Rebranded to ${currentConfig.brandName}`);
    });
  }

  // Copy shareable link
  if (copyPitchUrlBtn) {
    copyPitchUrlBtn.addEventListener('click', () => {
      const url = new URL(window.location.origin + window.location.pathname);
      url.searchParams.set('client', currentConfig.key || 'abdul');
      if (currentConfig.brandName) url.searchParams.set('brand', currentConfig.brandName);
      if (currentConfig.phoneDisplay) url.searchParams.set('phone', currentConfig.phoneDisplay);
      if (currentConfig.instagramHandle) url.searchParams.set('ig', currentConfig.instagramHandle);
      if (currentConfig.currency) url.searchParams.set('cur', currentConfig.currency);

      navigator.clipboard.writeText(url.toString()).then(() => {
        showToast('📋 Pitch Link copied to clipboard!');
      }).catch(() => {
        prompt('Copy your customized client link:', url.toString());
      });
    });
  }

  // ========================================================
  // 16. AMBIENT AUDIO ATMOSPHERE (WEB AUDIO SYNTHESIS)
  // ========================================================
  const soundToggle = document.querySelector('#sound-toggle');
  let audioCtx = null;
  let isSoundPlaying = false;
  let droneNodes = [];

  function startAmbientAudio() {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      masterGain.connect(audioCtx.destination);

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
      soundToggle.querySelector('.sound-label').textContent = 'Sound';
    }
  }

  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      if (isSoundPlaying) stopAmbientAudio();
      else startAmbientAudio();
    });
  }

  // ========================================================
  // 17. MEMBERSHIP FORM
  // ========================================================
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

    membershipStatus.innerHTML = `Thank you, ${name}. Your private-access invitation has been registered with ${currentConfig.brandName}. For immediate commission consultations, please call <a href="tel:${currentConfig.phoneTel}">${currentConfig.phoneDisplay}</a> or message <a href="${currentConfig.instagramUrl}" target="_blank" rel="noopener">${currentConfig.instagramHandle}</a>.`;
    membershipStatus.classList.add('show');
  });

  // ========================================================
  // 18. FOOTER YEAR
  // ========================================================
  const yearEl = document.querySelector('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
