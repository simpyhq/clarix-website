# Clarix website

Marketing site for ClarixHQ and Clarix Cash Desk, an AI finance desk for small businesses on QuickBooks Online.

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run lint
npm run build
```

## Routes

Public pages: `/`, `/cash-desk`, `/security`, `/pricing`, `/about`, `/demo`, `/privacy`, `/terms`.

`/intake` redirects to `/demo`. The demo form posts to `/api/intake`, which emails the same recipients as before.

QuickBooks OAuth, token refresh, and cron routes are separate from this marketing surface. Do not change them as part of a site redesign.

## Before launch

Privacy and Terms are draft scaffolds for counsel. The security page labels anything that still needs confirmation. Search the repo for `TODO(owner` before publishing customer proof, pricing, or legal text.
