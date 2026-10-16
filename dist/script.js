(() => {
  // --- 1. CONFIGURATION & CLIENT PARAMETER RESOLUTION ---
  const defaultConfig = {
    brandName: "Atelier Interiors",
    brandLogoMain: "ATELIER",
    brandLogoSub: "INTERIORS",
    tagline: "Furniture of Distinction",
    description: "Explore statement dining sets, sculptural seating and bespoke interior furniture.",
    phoneDisplay: "+1 (800) 555-0199",
    phoneTel: "+18005550199",
    email: "concierge@atelierinteriors.com",
    instagramHandle: "@atelier.interiors",
    instagramUrl: "https://instagram.com",
    whatsappNumber: "",
    whatsappMessage: "Hi, I am interested in custom furniture. Could you share more details?",
    storyKicker: "The Atelier",
    storyTitle: "Designed to be<br /><em>remembered.</em>",
    storyLead: "Atelier Interiors creates sculptural sofas, bespoke beds, architectural dining furniture and handcrafted seating.",
    conciergePrompt: "Discuss a dining set, sofa, bed, chair or entirely custom piece directly with our design atelier.",
    reels: [],
    isDemo: true
  };

  const rawConfig = window.SITE_CONFIG || window.ABDUL_INTERIORS_CONFIG || {};
  const config = Object.assign({}, defaultConfig, rawConfig);

  // Allow instant personalization for client demos via URL parameters:
  // e.g. ?brand=Studio+Verve&phone=+919876543210&ig=@studioverve
  const params = new URLSearchParams(window.location.search);
  const clientName = params.get('brand') || params.get('name') || params.get('client');
  if (clientName) {
    config.brandName = clientName;
    const parts = clientName.trim().split(/\s+/);
    if (parts.length > 1) {
      config.brandLogoMain = parts[0].toUpperCase();
      config.brandLogoSub = parts.slice(1).join(' ').toUpperCase();
    } else {
      config.brandLogoMain = clientName.toUpperCase();
      config.brandLogoSub = 'INTERIORS';
    }
    config.storyLead = `${clientName} creates sculptural sofas, bespoke beds, architectural dining furniture and handcrafted seating.`;
  }

  const phoneParam = params.get('phone') || params.get('tel');
  if (phoneParam) {
    config.phoneDisplay = phoneParam;
    config.phoneTel = phoneParam.replace(/[^\d+]/g, '');
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

  const taglineParam = params.get('tagline');
  if (taglineParam) {
    config.tagline = taglineParam;
  }

  // --- 2. APPLY CLIENT BRANDING TO DOM ---
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

  document.querySelectorAll('.concierge-instagram').forEach((el) => {
    el.href = config.instagramUrl;
    if (!el.classList.contains('button') && !el.classList.contains('atelier-link')) {
      el.textContent = `${config.instagramHandle} ↗`;
    }
  });

  const conciergePrompt = document.querySelector('#concierge-prompt');
  if (conciergePrompt && config.conciergePrompt) {
    conciergePrompt.textContent = config.conciergePrompt;
  }

  const storyLead = document.querySelector('.story-lead');
  if (storyLead && config.storyLead) {
    storyLead.textContent = config.storyLead;
  }

  // Optional: If custom Instagram reels are provided in config, render iframes
  const filmGrid = document.querySelector('#film-grid');
  if (filmGrid && Array.isArray(config.reels) && config.reels.length > 0) {
    filmGrid.innerHTML = config.reels
      .map(
        (url, idx) =>
          `<iframe title="${config.brandName} workshop reel ${idx + 1}" src="${url}" loading="lazy" allowfullscreen></iframe>`
      )
      .join('');
  }

  // --- 3. HEADER & NAVIGATION ---
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

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
      menuToggle.click();
    }
  });

  // --- 4. SCROLL REVEAL OBSERVER ---
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

  // --- 5. COLLECTION FILTERS ---
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

  // --- 6. PRODUCT CATALOG & MODAL DIALOG ---
  const products = {
    'signature-six': {
      title: 'The Signature Six',
      image: 'assets/ai/hero-dining.jpg',
      alt: 'Premium six-seater dining set',
      copy: 'A six-seater statement dining suite with sculpted high-back chairs and a solid stone-finish tabletop.',
      source: '#contact'
    },
    'cane-curve': {
      title: 'The Cane Curve',
      image: 'assets/ai/cane-chair.jpg',
      alt: 'Curved cane-back wooden chair',
      copy: 'An expressive steam-bent timber frame paired with intricately hand-woven natural cane weave.',
      source: '#contact'
    },
    'carved-table': {
      title: 'The Carved Table',
      image: 'assets/ai/carved-dining.jpg',
      alt: 'Carved wooden dining set',
      copy: 'A richly detailed artisanal dining table paired with custom upholstered high-back seating.',
      source: '#contact'
    },
    'sculpted-chair': {
      title: 'The Sculpted Chair',
      image: 'assets/ai/sculpted-chair.jpg',
      alt: 'Sculpted wooden dining chair in progress',
      copy: 'Fluid architectural geometry sculpted in solid timber before final upholstery and hand finishing.',
      source: '#contact'
    },
    'hand-finished': {
      title: 'Made by Hand',
      image: 'assets/ai/hand-craft.jpg',
      alt: 'Furniture being finished by hand',
      copy: 'Every contour, joint, and surface receives hand-burnished finishing inside our atelier workshop.',
      source: '#contact'
    }
  };

  const dialog = document.querySelector('#product-dialog');
  const dialogImage = dialog.querySelector('img');
  const dialogTitle = dialog.querySelector('h2');
  const dialogCopy = dialog.querySelector('.dialog-copy');
  const dialogSource = dialog.querySelector('.dialog-source');
  const dialogPhone = dialog.querySelector('.dialog-phone');
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
      dialogSource.href = '#contact';

      if (dialogPhone) {
        dialogPhone.href = `tel:${config.phoneTel}`;
        dialogPhone.innerHTML = `Enquire by phone <span>↗</span>`;
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

  // --- 7. MEMBERSHIP FORM ---
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

    membershipStatus.innerHTML = `Your private-access request has been prepared. Our design concierge will be in touch shortly. For immediate enquiries, please call <a href="tel:${config.phoneTel}">${config.phoneDisplay}</a> or message <a href="${config.instagramUrl}" target="_blank" rel="noopener">${config.instagramHandle}</a>.`;
    membershipStatus.classList.add('show');
  });

  // --- 8. FOOTER YEAR ---
  const yearEl = document.querySelector('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
