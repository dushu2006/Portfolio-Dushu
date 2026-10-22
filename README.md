# Portfolio-Dushu
My Portfolio

## Verification and deployment (portfolio refinement)

Use Node.js 22+:

```bash
npm ci
npm run typecheck
npm run lint
npm run build
npm run start -- --hostname 0.0.0.0 --port 3000
# In another terminal, with the production server running:
npm run test:browser
```

The repeatable browser suite uses Playwright and an npm-bundled Linux Chromium. The runner extracts its bundled Linux libraries into the OS temporary directory and requires `tar`. Set `CHROMIUM_PATH` to use another installed compatible Chromium. Tests currently target Chromium; physical mobile/Safari/Firefox and assistive technology require separate checks. Screenshots and reports are ignored under `test-results/`. For development use `npm run dev -- --hostname 0.0.0.0`.

### Real contact submission

Copy `.env.example` to `.env.local`. Optional **server-only** variables:

- `RESEND_API_KEY`: a Resend sending API key.
- `CONTACT_FROM`: a sender on a domain verified in Resend, e.g. `Portfolio <hello@your-verified-domain.example>`.
- `CONTACT_TO`: destination inbox (the example preserves the portfolio's email).

Set the same values in your deployment's server environment and restart/redeploy. A Node/serverless runtime with outbound access to `https://api.resend.com` is required; static-only export cannot send mail. Verify the sender domain and test with a real inbox. Before enabling public sending, configure hosting-level rate limiting/bot protection for `POST /api/contact`; the API does not claim distributed abuse protection. Never prefix keys with `NEXT_PUBLIC_`.

Without configuration the endpoint returns 503 with an explicit fallback flag. The page offers a prefilled `mailto:` link and says **nothing has been sent**; the visitor must send from their email app. If no email app is configured, the direct address remains available to copy. Provider errors retain form content. A successful API response means the provider accepted the message, not that the recipient received it. Browser acceptance/error tests use labelled mocked responses and do not prove live delivery.

### Content and acceptance evidence

- `docs/IMPLEMENTATION-CHECKLIST.md`: verification status and remaining gaps.
- `docs/PROJECT-EVIDENCE.md`: source review and corrected project claims.
- `src/lib/projects.ts`: single source of truth for exactly ten projects.

Fonts are self-hosted via Fontsource; no Google Fonts connection is required. Natural and binary hero images share one layout; the scan layer alone is masked. Image delivery uses Next's optimizer, so deploy with Next image support.

### Animation ecosystem

`docs/TOOLKIT-AUDIT.md` documents actual library usage and Impeccable workflow application. GSAP owns scroll stages/tracks; Framer Motion owns the nested project-art tilt and preview-entry surface; CSS owns spotlight/focus feedback. Do not give competing libraries ownership of the same transform. Pointer surfaces are gated by `usePointerMotion`, with shared spring/timing in `src/lib/motion.ts`.
