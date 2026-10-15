(() => {
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
  mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
    mobileNav.hidden = true;
    document.body.classList.remove('menu-open');
    header.classList.remove('menu-active');
  }));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') menuToggle.click();
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

  const filters = document.querySelectorAll('.filter');
  const productCards = document.querySelectorAll('.product-card');
  filters.forEach((button) => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filters.forEach((item) => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    productCards.forEach((card) => {
      card.hidden = filter !== 'all' && card.dataset.category !== filter;
    });
  }));

  const products = {
    'signature-six': {
      title: 'The Signature Six',
      image: 'assets/instagram/07-dining-photo.jpg',
      alt: 'Premium six-seater dining set',
      copy: 'A six-seater statement dining set with sculpted, high-back chairs and a bright stone-look tabletop.',
      source: 'https://www.instagram.com/abdulinteriors21/p/DdwL6ngTDAo/'
    },
    'cane-curve': {
      title: 'The Cane Curve',
      image: 'assets/instagram/02-bedroom-chair.jpg',
      alt: 'Curved cane-back wooden chair',
      copy: 'A curved wooden chair in the workshop, shaped with an expressive frame and hand-woven cane back.',
      source: 'https://www.instagram.com/abdulinteriors21/reel/DecbwWnzP7c/'
    },
    'carved-table': {
      title: 'The Carved Table',
      image: 'assets/instagram/10-wooden-dining-set.jpg',
      alt: 'Carved wooden dining set',
      copy: 'A richly carved wooden dining table paired with high-back upholstered chairs.',
      source: 'https://www.instagram.com/abdulinteriors21/reel/DdMghnmzBo8/'
    },
    'sculpted-chair': {
      title: 'The Sculpted Chair',
      image: 'assets/instagram/04-dining-set.jpg',
      alt: 'Sculpted wooden dining chair in progress',
      copy: 'A fluid chair form taking shape in the atelier before upholstery and final finishing.',
      source: 'https://www.instagram.com/abdulinteriors21/reel/DeTOYTtTJ5K/'
    },
    'hand-finished': {
      title: 'Made by Hand',
      image: 'assets/instagram/11-dining-furniture.jpg',
      alt: 'Furniture being finished by hand',
      copy: 'An authentic view of sculptural furniture receiving its hand-finished detail in the workshop.',
      source: 'https://www.instagram.com/abdulinteriors21/reel/DdI02CIz9fo/'
    }
  };
  const dialog = document.querySelector('#product-dialog');
  const dialogImage = dialog.querySelector('img');
  const dialogTitle = dialog.querySelector('h2');
  const dialogCopy = dialog.querySelector('.dialog-copy');
  const dialogSource = dialog.querySelector('.dialog-source');
  let lastTrigger = null;
  document.querySelectorAll('[data-open-product]').forEach((button) => button.addEventListener('click', () => {
    const product = products[button.dataset.openProduct];
    if (!product) return;
    lastTrigger = button;
    dialogImage.src = product.image;
    dialogImage.alt = product.alt;
    dialogTitle.textContent = product.title;
    dialogCopy.textContent = product.copy;
    dialogSource.href = product.source;
    dialog.showModal();
  }));
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('click', (event) => {
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => lastTrigger?.focus());

  const membershipForm = document.querySelector('#membership-form');
  const membershipStatus = membershipForm.querySelector('.membership-status');
  membershipForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = membershipForm.elements.memberName.value.trim();
    const contact = membershipForm.elements.memberContact.value.trim();
    if (name.length < 2 || contact.length < 5) {
      membershipStatus.textContent = 'Please add your name and a valid phone number or email.';
      membershipStatus.classList.add('show');
      return;
    }
    membershipStatus.innerHTML = 'Your private-access request is ready. This demo does not send details—please call <a href="tel:9012930381">90 1293 0381</a> or message <a href="https://www.instagram.com/abdulinteriors21/" target="_blank" rel="noopener">@abdulinteriors21</a>.';
    membershipStatus.classList.add('show');
  });

  document.querySelector('#year').textContent = new Date().getFullYear();
})();
