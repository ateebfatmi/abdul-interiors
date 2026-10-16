/**
 * Generic Client Configuration for Luxury Interior & Furniture Showcase
 *
 * Easily customize this file for any client, or override dynamically
 * via URL query parameters (e.g. ?brand=Studio+Name&phone=1234567890&ig=@handle)
 */
window.SITE_CONFIG = {
  // Brand Identity
  brandName: "Atelier Interiors",
  brandLogoMain: "ATELIER",
  brandLogoSub: "INTERIORS",
  tagline: "Furniture of Distinction",
  description:
    "Explore statement dining sets, sculptural seating and bespoke interior furniture.",

  // Contact Information
  phoneDisplay: "+1 (800) 555-0199",
  phoneTel: "+18005550199",
  email: "concierge@atelierinteriors.com",
  instagramHandle: "@atelier.interiors",
  instagramUrl: "https://instagram.com",
  whatsappNumber: "+18005550199",
  whatsappMessage:
    "Hi Atelier Interiors, I am interested in commissioning a custom furniture piece. Could you share more details?",

  // Atelier & Location Details
  location: "Design District · Available Worldwide",
  foundingYear: "2018",

  // Narrative
  storyKicker: "The Atelier",
  storyTitle: "Designed to be<br /><em>remembered.</em>",
  storyLead:
    "Atelier Interiors creates sculptural sofas, bespoke beds, architectural dining furniture and handcrafted seating.",
  conciergePrompt:
    "Discuss a dining set, sofa, bed, chair or entirely custom piece directly with our design atelier.",

  // Atelier Film Reels
  // Add Instagram reel embed URLs here if you want to feature specific client reels:
  // e.g. ["https://www.instagram.com/reel/EXAMPLE1/embed/", "https://www.instagram.com/reel/EXAMPLE2/embed/"]
  // If left empty, the site renders high-definition built-in atelier craft study cards.
  reels: [],

  // Demo mode notice
  isDemo: true,
};

// Backwards compatibility alias
window.ABDUL_INTERIORS_CONFIG = window.SITE_CONFIG;
