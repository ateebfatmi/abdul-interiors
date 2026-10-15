(() => {
  const config = window.ABDUL_INTERIORS_CONFIG || {};
  const header = document.querySelector('#site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('#mobile-nav');

  const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 32);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!open));
    menuToggle.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
    mobileNav.hidden = open;
    document.body.classList.toggle('menu-open', !open);
  });
  mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
    mobileNav.hidden = true;
    document.body.classList.remove('menu-open');
  }));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  const filters = document.querySelectorAll('.filter');
  const cards = document.querySelectorAll('.project-card');
  filters.forEach((button) => button.addEventListener('click', () => {
    const category = button.dataset.filter;
    filters.forEach((item) => {
      item.classList.toggle('active', item === button);
      item.setAttribute('aria-pressed', String(item === button));
    });
    cards.forEach((card) => { card.hidden = category !== 'all' && card.dataset.category !== category; });
  }));

  const dialog = document.querySelector('#project-dialog');
  const dialogImage = dialog.querySelector('img');
  const dialogTitle = dialog.querySelector('h2');
  const dialogCopy = dialog.querySelector('.dialog-copy');
  const dialogSource = dialog.querySelector('.dialog-source');
  let lastProjectTrigger = null;
  cards.forEach((card) => card.addEventListener('click', () => {
    lastProjectTrigger = card;
    dialogImage.src = card.dataset.image;
    dialogImage.alt = card.querySelector('img').alt;
    dialogTitle.textContent = card.dataset.title;
    dialogCopy.textContent = card.dataset.copy;
    dialogSource.href = card.dataset.url;
    dialog.showModal();
  }));
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('click', (event) => {
    const bounds = dialog.getBoundingClientRect();
    const outside = event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
    if (outside) dialog.close();
  });
  dialog.addEventListener('close', () => lastProjectTrigger?.focus());

  const whatsappButton = document.querySelector('#whatsapp-button');
  const isValidWhatsapp = /^\d{8,15}$/.test(String(config.whatsappNumber || '').replace(/\D/g, ''));
  if (isValidWhatsapp) {
    const number = String(config.whatsappNumber).replace(/\D/g, '');
    whatsappButton.setAttribute('aria-label', 'Enquire with Abdul Interiors on WhatsApp');
    whatsappButton.addEventListener('click', () => window.open(`https://wa.me/${number}?text=${encodeURIComponent(config.whatsappMessage)}`, '_blank', 'noopener'));
  } else {
    whatsappButton.title = 'WhatsApp number will be added once confirmed';
    whatsappButton.addEventListener('click', () => document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' }));
  }

  const form = document.querySelector('#contact-form');
  const status = form.querySelector('.form-status');
  const validators = {
    name: (value) => value.trim().length >= 2 ? '' : 'Please enter your name.',
    phone: (value) => value.replace(/\D/g, '').length >= 8 ? '' : 'Please enter a valid phone or WhatsApp number.',
    email: (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Please enter a valid email address.',
    project: (value) => value ? '' : 'Please select a project type.',
    message: (value) => value.trim().length >= 10 ? '' : 'Please add a little more detail (at least 10 characters).',
  };
  const validateField = (field) => {
    const error = validators[field.name]?.(field.value) || '';
    field.classList.toggle('invalid', Boolean(error));
    field.setAttribute('aria-invalid', String(Boolean(error)));
    field.closest('label')?.querySelector('.field-error')?.replaceChildren(document.createTextNode(error));
    return !error;
  };
  Object.keys(validators).forEach((name) => form.elements[name].addEventListener('blur', (event) => validateField(event.target)));
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const fields = Object.keys(validators).map((name) => form.elements[name]);
    const valid = fields.map(validateField).every(Boolean);
    if (!valid) {
      fields.find((field) => field.getAttribute('aria-invalid') === 'true')?.focus();
      return;
    }
    const data = new FormData(form);
    const summary = `New Abdul Interiors furniture enquiry\n\nName: ${data.get('name')}\nPhone: ${data.get('phone')}\nEmail: ${data.get('email') || 'Not provided'}\nFurniture type: ${data.get('project')}\nPreferred contact: ${data.get('contactMethod')}\n\n${data.get('message')}`;
    status.classList.add('show');
    status.innerHTML = `<strong>Your enquiry draft is ready.</strong><p>This demo does not send your details. Copy the draft, then contact Abdul Interiors on Instagram.</p><pre></pre><button type="button" class="copy-enquiry">Copy enquiry text</button> · <a href="${config.instagramUrl}" target="_blank" rel="noopener">Open Instagram ↗</a>`;
    status.querySelector('pre').textContent = summary;
    status.querySelector('.copy-enquiry').addEventListener('click', async (e) => {
      await navigator.clipboard.writeText(summary);
      e.currentTarget.textContent = 'Copied';
    });
    status.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  document.querySelector('#year').textContent = new Date().getFullYear();
})();
