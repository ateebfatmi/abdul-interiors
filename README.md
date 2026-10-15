# Abdul Interiors website demo

Premium, responsive single-page website concept built for Abdul Interiors. This is a static, dependency-free site designed for fast previews and straightforward customization.

## Run locally

From this directory:

```bash
python3 -m http.server 4173 --directory dist
```

Then open `http://localhost:4173`.

## Business configuration

Edit `dist/config.js` to add verified business details:

- `whatsappNumber`: digits with country code, for example `919876543210`
- `phone`
- `email`
- `serviceAreas`
- Instagram handle and URL

Until a valid WhatsApp number is added, WhatsApp interactions intentionally return visitors to the on-page enquiry flow. The enquiry form runs only in the browser and does not transmit or store personal data.

## Important content note

All displayed interiors are AI-generated illustrative concepts created for this demo. The website labels them as inspiration and does not claim they are completed Abdul Interiors projects. Replace them with verified portfolio photography after approval.
