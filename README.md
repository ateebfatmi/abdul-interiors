# Abdul Interiors website demo

Luxury, responsive commerce-style landing page built for Abdul Interiors. The static, dependency-free experience combines a high-end product collection, liquid-glass effects, brand storytelling, atelier films and an enquiry-led private membership CTA.

## Run locally

From this directory:

```bash
python3 -m http.server 4173 --directory dist
```

Then open `http://localhost:4173`.

## Verified business details

The demo uses information verified from the public `@abdulinteriors21` Instagram profile:

- Profile name: Mohd Imran
- Business: Abdul Interiors, furniture shop
- Phone: 90 1293 0381
- Instagram: `@abdulinteriors21`
- Offering: sofas, beds, dining furniture, chairs, handcrafted woodwork and custom orders

Edit `dist/config.js` to maintain these details. `whatsappNumber` intentionally remains empty because the public profile does not provide a verified country-coded WhatsApp number.

Until a valid WhatsApp number is added, WhatsApp interactions intentionally return visitors to the on-page enquiry flow. The enquiry form runs only in the browser and does not transmit or store personal data.

## Media and enquiry note

Product images and reel embeds come from the official public `@abdulinteriors21` Instagram account. Each product detail links to its original Instagram post. Product and membership actions are deliberately enquiry-led: the demo does not invent prices, availability or checkout capability, and no form data is transmitted or stored.

Before using this demo as a final commercial website, the business owner should confirm permission to republish the downloaded Instagram images and approve all captions and product descriptions.
