/**
 * Client Configuration for Luxury Interior & Furniture Showcase
 *
 * Built-in presets for instant client pitch:
 * - 'abdul': Abdul Interiors (Mohd Imran, Saharanpur / Delhi, +91 90129 30381, @abdulinteriors21, INR ₹)
 * - 'atelier': Atelier Interiors (International Luxury Studio, USD $)
 *
 * Easily switch presets via URL (?client=abdul or ?client=atelier),
 * the in-page discreet pitch controller, or query parameters (?brand=...&phone=...&cur=INR)
 */
window.SITE_PRESETS = {
  abdul: {
    key: "abdul",
    brandName: "Abdul Interiors",
    brandLogoMain: "ABDUL",
    brandLogoSub: "INTERIORS",
    tagline: "Handcrafted Luxury & Bespoke Woodcraft",
    description:
      "Explore statement dining suites, sculptural seating and bespoke handcrafted interior furniture made by master artisans.",
    phoneDisplay: "+91 90129 30381",
    phoneTel: "+919012930381",
    email: "abdulinteriors21@gmail.com",
    instagramHandle: "@abdulinteriors21",
    instagramUrl: "https://www.instagram.com/abdulinteriors21/",
    whatsappNumber: "919012930381",
    whatsappMessage:
      "Hi Abdul Interiors, I am interested in commissioning a handcrafted furniture piece. Could you share designs, pricing and delivery details?",
    location: "Saharanpur & Delhi NCR · Pan-India & Worldwide Crating",
    foundingYear: "2015",
    currency: "INR",
    currencySymbol: "₹",
    currencyRate: 85, // Conversion baseline vs USD
    storyKicker: "The Workshop Atelier",
    storyTitle: "Handcrafted to be<br /><em>cherished for generations.</em>",
    storyLead:
      "Abdul Interiors crafts monumental solid wood dining suites, royal bedroom collections, and hand-carved sculptural seating.",
    conciergePrompt:
      "Discuss a dining set, sofa, bed, chair or entirely custom piece directly with master artisan Mohd Imran.",
    reels: [],
    isDemo: true,
  },
  atelier: {
    key: "atelier",
    brandName: "Atelier Interiors",
    brandLogoMain: "ATELIER",
    brandLogoSub: "INTERIORS",
    tagline: "Furniture of Distinction",
    description:
      "Explore statement dining sets, sculptural seating and bespoke interior furniture crafted by master artisans.",
    phoneDisplay: "+1 (800) 555-0199",
    phoneTel: "+18005550199",
    email: "concierge@atelierinteriors.com",
    instagramHandle: "@atelier.interiors",
    instagramUrl: "https://instagram.com",
    whatsappNumber: "18005550199",
    whatsappMessage:
      "Hi Atelier Interiors, I am interested in commissioning a bespoke furniture piece. Could you share more details?",
    location: "Design District · Available Worldwide",
    foundingYear: "2018",
    currency: "USD",
    currencySymbol: "$",
    currencyRate: 1,
    storyKicker: "The Atelier",
    storyTitle: "Designed to be<br /><em>remembered.</em>",
    storyLead:
      "Atelier Interiors creates sculptural sofas, bespoke beds, architectural dining furniture and handcrafted seating.",
    conciergePrompt:
      "Discuss a dining set, sofa, bed, chair or entirely custom piece directly with our design atelier.",
    reels: [],
    isDemo: true,
  },
};

// Check local storage or URL param for initial preset
const savedPresetKey = localStorage.getItem("client_site_preset");
const urlParams = new URLSearchParams(window.location.search);
const requestedPreset = urlParams.get("client") || savedPresetKey || "abdul";

window.SITE_CONFIG = Object.assign(
  {},
  window.SITE_PRESETS[requestedPreset] || window.SITE_PRESETS.abdul
);

// Backwards compatibility alias
window.ABDUL_INTERIORS_CONFIG = window.SITE_CONFIG;
