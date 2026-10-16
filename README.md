# Atelier — Luxury Interior & Bespoke Furniture Showcase

A high-performance, mobile-optimized showcase template designed for bespoke interior designers, furniture ateliers, and luxury architectural studios.

**Live Demo:** [https://ateebfatmi.github.io/demo/](https://ateebfatmi.github.io/demo/)

---

## ⚡ Instant Client Sharing & Live Personalization

You can share this showcase with **any client** immediately. The site supports instant personalization directly via URL query parameters without editing any code:

### Example Personalized Links:
- **Custom Brand:**
  `https://ateebfatmi.github.io/demo/?brand=Luxe+Living`
- **Brand + Contact Details:**
  `https://ateebfatmi.github.io/demo/?brand=Studio+Verve&phone=%2B91%2098765%2043210&ig=@studioverve`
- **Full Override:**
  `https://ateebfatmi.github.io/demo/?brand=Aura+Interiors&phone=%2B1%20(800)%20555-0199&ig=@aurainteriors&email=concierge@aurainteriors.com`

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
  reels: [],
};
```

---

## ✨ Client-Acquisition Features

- **100% White-Label & Generic**: Zero hardcoded artisan names or personal numbers; completely bespoke for any client brand.
- **AI-Generated Architectural Visuals**: 8 bespoke, ultra-luxury editorial interior renders (dining salons, lounge chairs, craft details).
- **Interactive Room View Switcher**: Dynamic hero preview allowing clients to toggle between salon viewpoints with mood and specification tags.
- **Interactive Materiality Gallery**: Clients can inspect sustainably harvested French Oak, Carrara Marble, Bouclé Wool, and Burnished Brass.
- **Before & After Transformation Slider**: Interactive comparison slider demonstrating bespoke spatial renovations from raw shell to finished architectural atelier.
- **Live 3D-Style Customizer**: Interactive bespoke furniture configurator for real-time timber, upholstery, and metal accent pairing with instant quotation estimates.
- **Trade & Architecture Portal**: Dedicated sample swatch box request dialog for interior designers, architects, and hospitality developers.
- **Private Consultation Booking**: Calendar date/time/service booking scheduler with instant WhatsApp/Email concierge handoff.
- **Web Audio Ambient Soundscape**: Subtle, relaxing atelier workshop soundscape toggle for an immersive showroom experience.
- **Refined Architectural Navbar**: High-contrast dark frosted glass navigation bar with direct consultation CTA.
- **Ultra-Responsive**: Fast static delivery, 0 heavy frameworks, zero layout shift, and smooth iOS/Android native feel.
