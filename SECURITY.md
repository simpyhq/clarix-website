# Security operations

This is the checklist for ClarixHQ's production site. It does not contain secret values. Do not commit tokens, API keys, or env files.

Merge [the hardening PR](https://github.com/simpyhq/clarix-website/pull/4) first. This document assumes that deploy has `CRON_SECRET` set and the Mac mini token contract unchanged.

## Secrets

| Secret | Where it lives | What it unlocks |
| --- | --- | --- |
| `QBO_CLIENT_ID` | Vercel env | Intuit app id. Not a password, but treat the pair as a credential |
| `QBO_CLIENT_SECRET` | Vercel env | Intuit token exchange. It was emailed in plaintext once; rotate it |
| `QBO_TOKEN_API_SECRET` | Vercel env, and today on each Mac mini | Legacy shared secret for `/api/qbo-token`. One leak unlocks every client until `QBO_ALLOW_SHARED_SECRET` is off |
| Per-client API key (`cxk_…`) | One Mac mini, hash only in KV `qbo:apikey:<slug>` | That slug's access tokens |
| `QBO_KEY_ADMIN_SECRET` | Vercel env | `POST /api/qbo-client-key` |
| `CRON_SECRET` | Vercel env | Daily refresh and health crons |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` | Vercel env | All QuickBooks tokens, nonces, and the audit list. Also the fallback material for OAuth `state` signing |
| `QBO_OAUTH_STATE_SECRET` | Vercel env, optional | HMAC key for OAuth `state`. When unset, a key is derived from `KV_REST_API_TOKEN` |
| `QBO_TOKEN_ENC_KEY` | Vercel env, optional until you want encryption | AES-256-GCM key for token records |
| `QBO_TOKEN_ENC_KEY_VERSION` | Vercel env, optional | Version number written with the current key. Default 1 |
| `QBO_TOKEN_ENC_KEYS` | Vercel env, optional | Previous key versions, so old ciphertext can still be read |
| `SMTP_USER`, `SMTP_PASS` | Vercel env | Gmail SMTP for the intake form, and for the health alert when `RESEND_API_KEY` is unset |
| `RESEND_API_KEY` | Vercel env, optional | When set, the daily health alert is sent with Resend's HTTPS API instead of Gmail SMTP. Unset keeps today's SMTP path. Intake mail is unchanged |
| `RESEND_FROM` | Vercel env, optional | From address for that Resend send. When unset, the from address stays `Clarix QBO Health <support@clarixhq.ai>`. The domain must be verified in Resend |
| `OPENROUTER_CHAT_KEY` | Vercel env, if still set | Nothing in the current app. `/api/chat` returns 410 and does not call OpenRouter. An older copy of an OpenRouter key is in git history; revoke it |

Generate a new random value with `openssl rand -base64 32`. Do not put spaces in values that are compared as bearer tokens.

## Rotate each secret

Do these in Vercel → Project → Settings → Environment Variables, then redeploy. Vercel only injects a variable into deployments created after it exists.

### Intuit app secret (`QBO_CLIENT_SECRET`)

1. In the Intuit developer dashboard, rotate the client secret for the production app. The redirect URI stays `https://www.clarixhq.ai/qbo/callback`.
2. Put the new secret in `QBO_CLIENT_SECRET` and redeploy.
3. Existing refresh tokens keep working. You do not have to reconnect every company unless Intuit invalidates them.
4. This secret is not the OAuth `state` signing key. Do not copy it into `QBO_OAUTH_STATE_SECRET`.

### Shared token secret (`QBO_TOKEN_API_SECRET`)

1. Generate a new value and set it in Vercel. Redeploy.
2. Update every Mac mini that still sends `?secret=` or `X-QBO-Shared-Secret`. Until that is done, those minis get 401.
3. Prefer issuing a per-client key instead, then set `QBO_ALLOW_SHARED_SECRET=false` and redeploy. Steps are in [SETUP.md](./SETUP.md).

### Per-client API key

```bash
npx tsx scripts/issue-qbo-client-key.ts <slug> --rotate
```

The previous key works for 7 days. The new key is printed once. KV stores only the SHA-256 hash. The same action is `POST /api/qbo-client-key` with `Authorization: Bearer <QBO_KEY_ADMIN_SECRET>` and `{"slug":"<slug>","rotate":true}` after `QBO_KEY_ADMIN_SECRET` is set.

### `CRON_SECRET`

Set a new value, redeploy, and confirm a manual call with `Authorization: Bearer <CRON_SECRET>` returns 200. Vercel Cron uses the same variable. An unset or wrong value makes both cron routes return 401.

### KV token (`KV_REST_API_TOKEN`)

1. In the Upstash console, create a new REST token and revoke the old one.
2. Update `KV_REST_API_TOKEN` and redeploy before the old token stops working.
3. If `QBO_OAUTH_STATE_SECRET` is unset, OAuth `state` is signed with a key derived from this token. Set `QBO_OAUTH_STATE_SECRET` first so a KV rotation does not invalidate connect links that are already in flight. In-flight links expire in 10 minutes anyway.
4. Rotating the KV token does not re-encrypt QuickBooks records.

### OpenRouter key

1. In the OpenRouter dashboard, revoke the key that was shipped in the old static site (see the history scan below) and any key stored as `OPENROUTER_CHAT_KEY`.
2. You can delete `OPENROUTER_CHAT_KEY` from Vercel. The chat route does not use it.
3. Do not put a replacement key in client-side code.

### Encryption key (`QBO_TOKEN_ENC_KEY`)

First time:

1. `openssl rand -base64 32`
2. Set `QBO_TOKEN_ENC_KEY` to that value. Leave `QBO_TOKEN_ENC_KEY_VERSION` unset (version 1).
3. Redeploy. Reads of existing plaintext records keep working. The next token write stores ciphertext. The daily refresh cron also rewrites a still-fresh plaintext record without calling Intuit.
4. Confirm with `GET /api/qbo-token-debug?slug=<slug>` and header `X-QBO-Shared-Secret` (or `X-QBO-Client-Key`). `storage` should become `v1`. The response does not include tokens.

Rotation:

1. Generate a second key.
2. Set `QBO_TOKEN_ENC_KEYS` to `1:<the current key>`.
3. Set `QBO_TOKEN_ENC_KEY` to the new key and `QBO_TOKEN_ENC_KEY_VERSION` to `2`.
4. Redeploy. Old ciphertext still decrypts. New writes use version 2. The daily cron and ordinary refreshes rewrite records.
5. When debug shows `v2` for every slug, remove version 1 from `QBO_TOKEN_ENC_KEYS`.

Do not unset `QBO_TOKEN_ENC_KEY` after any record has been encrypted. Those reads will fail closed. Losing every version of the key means those companies must reconnect at Intuit; the ciphertext cannot be recovered.

If the key is unset, the app behaves as it does today and logs `QBO_TOKEN_ENC_KEY is unset; QuickBooks tokens are stored in plaintext` once per process.

## Rate limits

Fixed windows of 10 minutes, stored in KV. A counter that cannot be written fails open so a limiter bug cannot lock a Mac mini out. Failed token logins do not consume the per-slug budget.

| Route | Limit |
| --- | --- |
| `/api/qbo-token` per slug, after a successful login | 1200 / 10 min |
| `/api/qbo-token` per IP, all calls | 2400 / 10 min |
| `/api/qbo-token` failed logins per IP | 120 / 10 min |
| `/qbo/connect` per IP | 30 / 10 min |
| `/qbo/callback` per IP | 60 / 10 min |
| `POST /api/intake` per IP | 10 / 10 min, body capped at 64 KB |
| `POST /api/qbo-client-key` per IP | 30 / 10 min |
| `/api/qbo-token-debug` per IP and per slug | 120 / 10 min |

The token ceilings allow about two requests a second for ten minutes on one slug. A mini that polls a few times a minute will not hit them. Over the limit, the token API returns 429 `{ "error": true, "reason": "rate_limited" }` and `Retry-After`. The success body `{ accessToken, realmId }` is unchanged.

IP identity prefers `x-real-ip`, which Vercel sets, and otherwise the last `x-forwarded-for` hop.

## Audit log

Security events are written to the function log as `QBO audit {…}` and pushed onto the KV list `qbo:audit` (capped at 500). Events: `connect`, `reconnect_refused`, `key_issued`, `key_rotated`, `auth_failure`, `refresh_failure`, `rate_limited`, `alert_delivery_failed`. Fields are time, event, optional slug, optional IP, and a short reason code. Tokens, API keys, OAuth codes, and raw Intuit bodies are not stored.

`alert_delivery_failed` is written when the daily health email does not send. Its reason code is `smtp_535`, `smtp_auth`, `resend_http_<status>`, `resend_from_invalid`, or a generic `smtp_failed` / `resend_failed`. The same code is logged as `QBO_ALERT_DELIVERY_FAILED provider=<smtp|resend> code=<code>`. The HTTP response stays 200 so a bad mailbox password does not make Vercel stop the cron. The JSON body includes `alert_delivery` of `sent`, `failed`, or `not_needed`.

Read the list in the Upstash console with `LRANGE qbo:audit 0 50`. Hobby log retention is short, so the KV list is the copy that outlasts the function logs.

## Health alerts

`GET /api/cron/qbo-health` runs on the existing daily schedule (`0 15 * * *`). It does not add a cron. One email lists every client that needs attention:

| Status | Meaning |
| --- | --- |
| `dead` | `needs_reauth` is set, or `refresh_token_expires_at` is already in the past |
| `urgent` | the refresh token expires within 7 days |
| `warning` | the refresh token expires within 14 days, and it is not already urgent |
| `unknown` | the stored record has no `refresh_token_expires_at` |
| `healthy` | the refresh token expires later than 14 days |

Unknown is not an error and is not emailed. The cron JSON lists it as `"status": "unknown"`, `"days_remaining": null`, and `"note": "next_refresh_records_expiry"`. A successful Intuit refresh writes the field from `x_refresh_token_expires_in`. If Intuit omits that value, the stored expiry is 100 days from the refresh. An old record is left alone until that refresh; a guessed date could mark a live company urgent or hide a real deadline.

The email lists the client slug, status, days remaining (`unknown` when a dead record has no expiry), and a reconnect link. The link is `/qbo/connect?client=<slug>`. That route still mints a signed single-use `state` and the callback still refuses to point the slug at a different QuickBooks company. The message does not include tokens, realm ids, or API keys.

Recipients stay `michael@ospipe.com` and `christian@clarixhq.ai`, with `christian.simpson.2018@outlook.com` on cc.

Gmail error 535 means Google rejected `SMTP_USER` / `SMTP_PASS`. Create an app password for that mailbox (Google Account → Security → 2-Step Verification → App passwords) and set `SMTP_PASS` to the 16-character app password, or set `RESEND_API_KEY` and leave SMTP for the intake form. Resend must have the from-domain verified. Changing either variable requires a new Vercel deployment before the function can see it.

## Response headers

Every response gets HSTS (`max-age=31536000; includeSubDomains`), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`, and a Content-Security-Policy with `frame-ancestors 'none'`. `includeSubDomains` means every subdomain of the host that sends this header must be HTTPS.

The connect flow redirects the browser to `https://appcenter.intuit.com`. That is a navigation, not a fetch, and the policy does not set `navigate-to`. `script-src` and `style-src` allow inline content because the App Router bootstrap and the OAuth result page use it. `X-Powered-By` is disabled.

## Deployment protection

This repo cannot change Vercel project settings. Recommended, and not applied by this change:

- Turn on Vercel Deployment Protection for Preview deployments so old preview URLs are not a public copy of production routes.
- Production is `https://www.clarixhq.ai`. Do not attach production aliases to one-off deployments.
- The branch `chore/temp-force-refresh-debug` was not modified. Its `/api/qbo-force-refresh` route takes the shared secret in the query string and returns the stored token record, including access and refresh tokens. If any deployment of that branch is still reachable, remove the alias or delete that deployment from the Vercel dashboard. Do not delete the git branch from this change.

## History scan

gitleaks 8.28.0 scanned 48 commits (`git log --all`) on 28 Sep 2026.

One secret type was found. The same value appears 21 times, all on `origin/gh-pages` at commit `4bc37bb049ac006088f4d0c4cbd7309400056d3d` (`Updates`, 2026-04-20). It is still on the tip of that branch. Representative files: `index.html`, `__next._full.txt`, and the same static-export files under `about/`, `contact/`, `intake/`, `pricing/`, `services/`, and `_not-found/`.

Type: OpenRouter API key (`sk-or-v1-` prefix). It was serialized into the old static site as a client `apiKey` prop next to the Claude widget. It is not in the current app source on `main` or on this branch.

Rotate it. Revoke that key in OpenRouter, and revoke `OPENROUTER_CHAT_KEY` if it is the same key or is still set. Unpublish or replace the `gh-pages` site so the HTML is no longer served. Rewriting git history is a separate decision; until the key is revoked, history and the branch tip both expose it. This change does not rewrite history and does not push to `gh-pages`.

No other secret types (cloud keys, private keys, GitHub tokens, SMTP passwords, Intuit secrets, KV tokens) were reported.

## Incident response: leaked QuickBooks token

1. Treat a leaked access token as valid for up to one hour, and a leaked refresh token as valid until it is rotated or the 100-day window ends.
2. In Intuit, disconnect the affected company or revoke the app's access if you cannot identify the company. The production app is the shared one, so revoking the app forces every client to reconnect. Prefer disconnecting the one company when the realm is known.
3. Rotate `QBO_CLIENT_SECRET` if the Intuit app secret may have leaked with the tokens.
4. Rotate `QBO_TOKEN_API_SECRET` if the shared secret may have leaked, or rotate the one client's `cxk_` key if only that mini was exposed. Set `QBO_ALLOW_SHARED_SECRET=false` once every mini uses a per-client key.
5. Delete the KV record `qbo:client:<slug>` only after Intuit access is revoked. The next agent call then returns the existing `no_connection` reason instead of a usable token. Reconnect that slug at `/qbo/connect?client=<slug>`.
6. If the encryption key or `KV_REST_API_TOKEN` leaked, rotate those as well. A leaked KV token can read every record, encrypted or not, and a leaked encryption key can decrypt ciphertext the attacker already copied.
7. Read `LRANGE qbo:audit 0 50` and the function logs for `auth_failure`, `refresh_failure`, and `connect` around the time of the leak.
8. Tell the affected client to reconnect. Do not send tokens, refresh tokens, or API keys by email.

## What a deploy of this change needs

1. Merge the hardening PR and set `CRON_SECRET` first, if that is not already done.
2. Set `QBO_TOKEN_ENC_KEY` in Production (and Preview if previews should encrypt) before deploying this change if you want tokens encrypted on the first write. Leaving it unset is safe and keeps plaintext storage.
3. Do not set `QBO_ALLOW_SHARED_SECRET=false` until every Mac mini has moved off the shared secret.
4. No other new variable is required. Rate limits and the audit list use the existing KV database.
5. After deploy, check one homepage response for the security headers, one `GET /api/qbo-token` from a mini (same `{ accessToken, realmId }` body), and `storage` on the debug route after the first refresh or the next daily cron.
