# QuickBooks Online setup

This app holds ClarixHQ's shared Intuit OAuth connection. One QuickBooks company is stored per client slug under `qbo:client:<slug>` in Vercel KV / Upstash. Mac mini agents fetch a live access token from `/api/qbo-token`. Nothing in this file is a secret. Do not commit tokens, API keys, or env files.

Production redirect URI: `https://www.clarixhq.ai/qbo/callback`.

## Environment variables

Set these in Vercel. Do not put the values in git.

| Name | Required | Purpose |
| --- | --- | --- |
| `QBO_CLIENT_ID` | yes | Intuit app client id |
| `QBO_CLIENT_SECRET` | yes | Intuit app client secret |
| `QBO_REDIRECT_URI` | yes | `https://www.clarixhq.ai/qbo/callback` |
| `KV_REST_API_URL` | yes | Upstash REST URL |
| `KV_REST_API_TOKEN` | yes | Upstash REST token. Also the fallback key for OAuth `state` signing until `QBO_OAUTH_STATE_SECRET` is set |
| `QBO_TOKEN_API_SECRET` | yes, until every mini has a per-client key | Shared secret for the legacy token API |
| `CRON_SECRET` | **yes, before the deploy that adds the cron check** | Vercel sends `Authorization: Bearer <CRON_SECRET>` on cron invocations. Both cron routes reject every request when this is unset |
| `QBO_ALLOW_SHARED_SECRET` | no | Unset, `true`, or `1` keeps the legacy shared secret working. Set to `false` (also `0`, `no`, or `off`) after every Mac mini sends a per-client key |
| `QBO_KEY_ADMIN_SECRET` | no | Unlocks `POST /api/qbo-client-key`. The route stays 404 until this is set |
| `QBO_OAUTH_STATE_SECRET` | no | Dedicated HMAC key for OAuth `state`. When unset, the key is derived from `KV_REST_API_TOKEN` (not from `QBO_CLIENT_SECRET`) |
| `QBO_TOKEN_ENC_KEY` | no, but set it before this deploy if you want tokens encrypted | AES-256-GCM key, 32 bytes, base64 (`openssl rand -base64 32`). Unset keeps today's plaintext storage and logs a warning |
| `QBO_TOKEN_ENC_KEY_VERSION` | no | Integer stamped on new writes. Default `1`. Bump it when you rotate |
| `QBO_TOKEN_ENC_KEYS` | no | Older keys, `1:<base64>,2:<base64>`, so records written by a previous version can still be read |
| `SMTP_USER`, `SMTP_PASS` | yes, for health email | Gmail SMTP used by the daily health check and the intake form |

`CRON_SECRET` is new. Vercel only injects it into a deployment that was created after the variable exists, and these routes fail closed without it. Set it on Production (and Preview, if preview crons should run) before merging the change that requires it. A long random string with no spaces is enough. Example generation: `openssl rand -base64 32`.

Recommended order for the first deploy of this change:

1. Set `CRON_SECRET` in Vercel.
2. Merge and let Vercel deploy.
3. Confirm the two daily crons appear under Project → Settings → Cron Jobs, and that a manual run with the bearer token returns 200 rather than 401.

Leave `QBO_ALLOW_SHARED_SECRET` unset on that first deploy so the Mac minis keep working.

## Connect and callback

Start a connection at:

```text
https://www.clarixhq.ai/qbo/connect?client=<slug>
```

Slugs are lowercase letters, digits, and hyphens, 1–64 characters, and cannot start or end with a hyphen. The route stores a nonce for 11 minutes and redirects to Intuit with an HMAC-SHA256 `state` value that expires in 10 minutes. The callback accepts that `state` once. It does not accept a missing `state`, and it does not fall back to `realmId`.

A slug that already has a QuickBooks company can reconnect that same company. If the Intuit picker returns a different company, the callback refuses and leaves the stored company in place. The error page does not show other clients' slugs or realm ids. A company already stored under a different slug is also refused, with the same kind of generic page.

Health emails link to `/qbo/connect?client=<slug>`, which mints a fresh state when the link is opened. The link in the email is not itself the OAuth state, so it does not go stale in the inbox.

## Token API

Legacy request, still accepted while `QBO_ALLOW_SHARED_SECRET` is not explicitly off:

```text
GET /api/qbo-token?client=<slug>&secret=<QBO_TOKEN_API_SECRET>
```

The same shared secret may be sent as `X-QBO-Shared-Secret` instead of the query string. Prefer the header. Query strings end up in access logs.

Per-client request:

```text
GET /api/qbo-token?client=<slug>
X-QBO-Client-Key: <key>
```

A key is scoped to exactly one slug. If the header is present, a shared secret on the same request is ignored.

Success:

```json
{ "accessToken": "...", "realmId": "..." }
```

Auth failure is `401` with `{ "error": true }`.

Known failures stay HTTP 200 so existing agents that read the JSON body keep working:

| `reason` | When | `detail` |
| --- | --- | --- |
| `no_connection: client "<slug>" has not connected QBO yet` | No token record for that slug | omitted |
| `missing_client` | Authenticated request without `client` | omitted |
| `corrupted_record` | Record cannot be parsed or is missing token fields | omitted |
| `storage_error` | KV could not be read | omitted |
| `refresh_failed` | Client must reconnect at Intuit | `reauth_required` |
| `refresh_in_progress` | Refresh lost the lock, lost a compare-and-set, timed out, or otherwise did not produce a usable token. Retry | `retry` |

`detail` is only one of `reauth_required`, `refresh_request_failed`, or `retry`. Intuit's response body is not returned. An access token whose `expires_at` is in the past is not returned; the caller gets `refresh_in_progress` and should retry.

A caller who exceeds the per-slug ceiling (1200 requests / 10 minutes) or the per-IP ceiling (2400 / 10 minutes) gets HTTP 429 `{ "error": true, "reason": "rate_limited" }`. Failed logins are counted separately (120 / 10 minutes per IP) and do not spend the slug's budget. Those ceilings are far above a Mac mini's normal polling. If the rate-limit counter cannot be written, the request is allowed.

`GET /api/qbo-token-debug?slug=<slug>` returns metadata only (company, realm, expiry, a sanitized refresh error, and `storage` of `plaintext` or `vN`). It does not return access or refresh tokens. Send the credential in a header, never in the query string, because query strings are written to access logs. Use `X-QBO-Client-Key`, or `X-QBO-Shared-Secret` while the shared secret is still allowed. A `secret` query parameter is rejected with `400` and `{ "error": true, "reason": "use_header" }` and is not checked as a password.

## Website chat

`POST /api/chat` and `GET /api/chat` return `410`. The route used to call OpenRouter with `OPENROUTER_CHAT_KEY` and no authentication. The only caller in this repo is `components/ChatWidget.tsx`, and no page or layout renders that widget, so nothing legitimate depends on the endpoint. The widget file is left in place for the marketing-page work. Do not turn the route back on without authentication and a rate limit.

These reason strings are the live contract the Mac mini agents already depend on. Internal refresh results use `not_connected`, `reauth_required`, and `refresh_request_failed`; the token route maps those onto the table above instead of renaming the public `reason` values.

## Per-client keys

Keys look like `cxk_` plus 32 random bytes, base64url. KV stores `qbo:apikey:<slug>` with the SHA-256 hex hash, a short prefix, and on rotation the previous hash. The previous key works for 7 days. The plaintext key is shown once.

HTTP (only after `QBO_KEY_ADMIN_SECRET` is set):

```text
POST /api/qbo-client-key
Authorization: Bearer <QBO_KEY_ADMIN_SECRET>
Content-Type: application/json

{"slug":"mikemills-buck"}
```

Rotate:

```json
{"slug":"mikemills-buck","rotate":true}
```

A second issue without `rotate` returns 409 `key_exists` and does not invalidate the current key. The response contains `apiKey` once. Do not log it.

From a machine that has the KV REST credentials in its environment and this repo checked out:

```bash
npx tsx scripts/issue-qbo-client-key.ts mikemills-buck
npx tsx scripts/issue-qbo-client-key.ts mikemills-buck --rotate
```

### Moving a Mac mini off the shared secret

1. Issue a key for that mini's slug.
2. Put the key only on that mini.
3. Change the agent to call `/api/qbo-token?client=<slug>` with header `X-QBO-Client-Key`, and stop sending `secret` in the URL.
4. Confirm that mini can fetch a token and that the key does not work for a different slug.
5. After every mini is migrated, set `QBO_ALLOW_SHARED_SECRET=false` and redeploy. Until that flag is off, anyone who still has the shared secret can read every client.

## Cron keep-alive

Hobby cron jobs may run only once per day. An expression that fires more often fails the deployment ([Vercel cron pricing](https://vercel.com/docs/cron-jobs/usage-and-pricing)). Hobby also runs the job sometime during the scheduled hour, not at the exact minute.

| Path | Schedule | What it does |
| --- | --- | --- |
| `/api/cron/qbo-refresh` | `0 10 * * *` (10:00–10:59 UTC) | Refreshes every KV client whose access token is expired or inside 5 minutes of expiry |
| `/api/cron/qbo-health` | `0 15 * * *` (15:00–15:59 UTC) | Emails if a client needs reconnect or the refresh token expires within 14 days |

Both routes require `Authorization: Bearer <CRON_SECRET>`. There is no hardcoded slug list. The job reads the `qbo:clients` set and every `qbo:client:*` key, so `chp-primary` and later clients are included as soon as their token record exists. A slug found only as a key is added to `qbo:clients`.

Intuit's access token lasts one hour (`expires_in` 3600). Agents already refresh through `/api/qbo-token` when they call. The refresh token lasts 100 days and the window rolls forward each time it is used. Intuit rotates the refresh-token value about every 24 hours, or on the next refresh after that, and the previous value then stops working ([Intuit authorization FAQ](https://developer.intuit.com/app/developer/qbo/docs/develop/authentication-and-authorization/faq), [refresh-token validity](https://help.developer.intuit.com/s/article/Validity-of-Refresh-Token)). There is also a five-year hard maximum that a daily refresh does not extend. The daily job is what keeps an idle company inside the 100-day window and persists the rotated refresh token. It skips a client whose access token still has more than five minutes of life, so it does not fight a mini that just refreshed.

Health mail goes to `michael@ospipe.com` and `christian@clarixhq.ai`, with `christian.simpson.2018@outlook.com` on cc. The reconnect link is `/qbo/connect?client=<slug>`.

Refresh compares-and-sets on a per-slug generation counter (`qbo:gen:<slug>`). The lock key `qbo:lock:<slug>` stores a random owner id and is deleted only when that owner still holds it. Intuit calls abort after 8 seconds. The lock lives 20 seconds, so a timed-out call cannot overlap the next refresh of the same company. If the waiter cannot get a fresh token, `/api/qbo-token` returns `refresh_in_progress` instead of an expired access token.

## Manual test plan

Automated coverage is `npm test`. Before relying on a production deploy, also:

1. `GET /api/cron/qbo-refresh` with no header returns 401. With `Authorization: Bearer <CRON_SECRET>` it returns JSON and does not contain access or refresh tokens.
2. Open `/qbo/callback?error=%3Cscript%3Ealert(1)%3C/script%3E`. The page shows a generic denial and the HTML source does not contain a `<script>` tag from the query string.
3. Open `/qbo/callback?code=abcdefgh&realmId=999`. The page says the link is invalid and does not connect the realm id as a client.
4. From `/qbo/connect?client=<a real slug>`, finish Intuit for the company already stored on that slug. The page says connected, and a second load of the callback URL does not connect again.
5. Repeat connect for that slug and pick a different QuickBooks company. The page refuses, names neither the other company id nor another client, and the stored realm id is unchanged.
6. `GET /api/qbo-token?client=<slug>&secret=<shared>` still returns `{ accessToken, realmId }` while the shared-secret flag is on.
7. Issue a key, call with `X-QBO-Client-Key`, and confirm that key returns 401 for a different slug.
8. Force a refresh failure (or inspect a `refresh_in_progress` response) and confirm the JSON has no Intuit error body.
9. `POST /api/chat` returns 410 and does not call an AI provider.
10. `GET /api/qbo-token-debug?slug=<slug>&secret=<shared>` returns 400 and does not include the secret or any token. The same slug with header `X-QBO-Shared-Secret` returns metadata and still no token.
