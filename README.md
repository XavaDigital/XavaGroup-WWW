# Xava Group website

A single-page static site for **Xava Group**, the parent company of Xava Digital, BeastMode, Medals.co.nz, Review Us and future brands.

This is the page people land on when they click through from a Xava Group invoice, receipt or reminder (sent from Xero). The **Billing** section explains that Xava Group invoices on behalf of all of our brands.

## Structure

```
index.html          The page
assets/styles.css   Styles
assets/main.js      Animations and contact form
assets/favicon.svg
assets/og-image.png Social share preview (source: og-image.svg)
```

No build step. Open `index.html` in a browser, or host the folder on any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages).

## Common edits

- **Add a brand:** copy one `<a class="card">` block in the `#brands` section of `index.html`. Set the `href`, the `--accent` colour, the initials badge, the name, the tag and the description. Also add the brand to the `topic` dropdown in the contact form, and to the footer if you want it there.
- **Review Us link:** it currently points to the contact section. Swap in the real URL once it's live (look for the `TODO` comment).
- **Email addresses:** `hello@xavagroup.com` and `accounts@xavagroup.com` are placeholders. Update them in `index.html` (contact details and the JSON-LD block) and in `CONTACT_EMAIL` in `assets/main.js`.

## Contact form

By default the form opens the visitor's email app with the message pre-filled, so it works with no backend.

To receive submissions directly instead, create a form endpoint (for example with [Formspree](https://formspree.io)) and paste its URL into `FORM_ENDPOINT` at the top of `assets/main.js`. The form sends JSON with `name`, `email`, `topic`, `invoice` and `message`.
