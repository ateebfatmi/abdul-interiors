# Luxury Interior & Furniture Showcase Template

A high-performance, mobile-optimized showcase template designed for bespoke interior designers, furniture ateliers, and luxury architectural studios.

**Live Demo:** [https://ateebfatmi.github.io/abdul-interiors/](https://ateebfatmi.github.io/abdul-interiors/)

---

## ⚡ Instant Client Sharing & Live Personalization

You can share this showcase with **any client** immediately. The site supports instant personalization directly via URL query parameters without editing any code:

### Example Personalized Links:
- **Custom Brand:**
  `https://ateebfatmi.github.io/abdul-interiors/?brand=Luxe+Living`
- **Brand + Contact Details:**
  `https://ateebfatmi.github.io/abdul-interiors/?brand=Studio+Verve&phone=%2B91%2098765%2043210&ig=@studioverve`
- **Full Override:**
  `https://ateebfatmi.github.io/abdul-interiors/?brand=Aura+Interiors&phone=%2B1%20(800)%20555-0199&ig=@aurainteriors&email=concierge@aurainteriors.com`

---

## 🛠 Permanent Client Configuration

To permanently configure the site for a specific client, simply edit [`dist/config.js`](dist/config.js):

```javascript
window.SITE_CONFIG = {
  brandName: "Your Client Name",
  brandLogoMain: "YOUR",
  brandLogoSub: "STUDIO",
  tagline: "Furniture of Distinction",
  phoneDisplay: "+1 (800) 555-0199",
  phoneTel: "+18005550199",
  email: "concierge@client.com",
  instagramHandle: "@clienthandle",
  instagramUrl: "https://instagram.com/clienthandle/",
  // Optional: Add Instagram reel embeds or custom video URLs
  reels: [],
};
```

---

## ✨ Features

- **White-label & Generic**: Zero hardcoded personal names or numbers.
- **Bespoke Craft Showcase**: Native interactive atelier study cards and media viewer.
- **Interactive Collection**: Category filtering (Dining, Seating, Atelier studies).
- **Responsive & Mobile-First**: Native touch-snapping carousels and glassmorphic dialogs.
- **Client Pitch Ready**: Send tailor-made preview links to any prospective client in seconds.
