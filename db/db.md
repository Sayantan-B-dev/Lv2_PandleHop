# PandalPass database

PandalPass stores its product content and user accounts in Aiven for MySQL. The
application reads the database through `lib/db.ts` and `lib/repository.ts`; it
never reads a real `.env` file itself.

## Files

| File | Purpose |
|---|---|
| `db/schema.sql` | Full schema for MySQL 8 plus the seed data from the archived `legacy/data.json`. |
| `db/apply.mjs` | Connects with the `AIVEN_MYSQL_*` variables, applies the schema and prints row counts. |
| `db/db.md` | This guide. |

## 1. Create the Aiven service

1. In the Aiven console, create an **Aiven for MySQL** service.
2. Wait until the service state is **Running**.
3. Open the service overview and copy the connection details.
4. Put these values in the project environment (not in git):

```text
AIVEN_MYSQL_HOST=your-service.aivencloud.com
AIVEN_MYSQL_PORT=12345
AIVEN_MYSQL_DATABASE=defaultdb
AIVEN_MYSQL_USER=avnadmin
AIVEN_MYSQL_PASSWORD=your-password
```

Optional values:

```text
AIVEN_MYSQL_CA=-----BEGIN CERTIFICATE-----...-----END CERTIFICATE-----
AUTH_SECRET=a-long-random-string
```

- `AIVEN_MYSQL_CA`: the project CA certificate from the Aiven console, under
  **CA certificate**. When set, the connection verifies the server certificate.
  Without it the connection is still encrypted but not certificate-verified.
  Newlines can be written as `\n`.
- `AUTH_SECRET`: signs session cookies. Set it in production. Without it the app
  uses a fixed local fallback, which makes session cookies predictable.

## 2. Apply the schema

Use one of these options.

If your Aiven console has no **Query editor**, use the bundled script. It reads
the same environment variables as the app and never prints credentials:

```bash
npm run db:apply
```

The script applies `db/schema.sql` and prints the row count for every table.

Alternatives:

**Aiven console Query editor:** paste all of `db/schema.sql` and run it.

**MySQL client:** run from the repository root, with the variables above already
present in your shell:

```bash
mysql \
  --host="$AIVEN_MYSQL_HOST" \
  --port="${AIVEN_MYSQL_PORT:-3306}" \
  --user="$AIVEN_MYSQL_USER" \
  --password \
  --ssl-mode=REQUIRED \
  --database="$AIVEN_MYSQL_DATABASE" \
  < db/schema.sql
```

The SQL creates the tables, loads the archived `legacy/data.json` content, and
leaves the `users` table alone. Running it again refreshes the content tables and
keeps existing accounts.

## 3. Verify

```sql
SELECT COUNT(*) FROM pandals;        -- 26
SELECT COUNT(*) FROM starts;         -- 12
SELECT COUNT(*) FROM foods;          -- 8
SELECT COUNT(*) FROM vibes;          -- 5
SELECT COUNT(*) FROM time_options;   -- 3
SELECT COUNT(*) FROM travel_modes;   -- 4
SELECT COUNT(*) FROM map_areas;      -- 11
SELECT COUNT(*) FROM settings;       -- 7
```

Then start the app with `npm run dev` and check `GET /api/data`. The response
should return 26 pandals, 12 starts and 8 foods, and the terminal should not log
a MySQL read error.

## Tables

| Table | Contents |
|---|---|
| `pandals` | 26 pandals with area, tagline, crowd level and planner grid coordinates. |
| `pandal_tags` | Vibe tags per pandal, ordered with `position`. |
| `starts` | 12 start points, ordered with `position`. |
| `foods` | 8 food stops with icon name and estimated price. |
| `vibes` | 5 planner vibes. |
| `time_options` | Duration choices and how many pandals each fits. |
| `travel_modes` | 4 travel styles used by the itinerary engine. |
| `map_areas` | Labels for the stylised SVG map. |
| `settings` | JSON rows: `site`, `defaultPrefs`, `home`, `pandalGlyphs`, `crowdLabels`, `tagLabels`, `engine`. |
| `users` | Username, scrypt password hash and creation time. |

Content tables use InnoDB, `utf8mb4` and `utf8mb4_unicode_ci`. The itinerary
engine configuration lives in `settings.engine`, so planner weighting can change
without a deploy.

## How the app uses the database

- `lib/db.ts` creates a single `mysql2` pool from the `AIVEN_MYSQL_*` variables.
  It requires host, database, user and password; the port defaults to `3306`.
- `lib/repository.ts` reads every table in parallel and assembles the same typed
  object the app expects. Results are cached in memory for 30 seconds.
- If the variables are missing or a query fails, the repository logs the error
  and the read fails. There is no file fallback: pages and APIs require the
  database.
- Pages and the `/api/data` and `/api/pass` routes use the repository and run per
  request (`dynamic = "force-dynamic"`), so a database change appears within the
  30 second cache window.

## Accounts and sessions

- Accounts are created at `/login` with a username and password. Registration
  posts to `POST /api/auth/register`, login to `POST /api/auth/login`.
- Usernames are 3 to 24 letters, numbers or underscores and are unique
  case-insensitively. Passwords must be 8 to 128 characters.
- Passwords are hashed with Node's `scrypt` and stored as
  `scrypt:salt:hash`. Plain passwords are never stored or logged.
- A successful login returns a JWT signed with HS256 in the
  `pandalpass.session` cookie. The cookie is `httpOnly`, `SameSite=Lax`, `Secure`
  in production, and lasts seven days.
- `GET /api/auth/me` returns the current user or `null`.
  `POST /api/auth/logout` clears the cookie.
- There is no email field, password reset flow or account deletion endpoint.

## Troubleshooting

| Symptom | Check |
|---|---|
| `Accounts are unavailable because the database is not configured.` | All four required `AIVEN_MYSQL_*` variables are set for the running process. |
| `Aiven MySQL read failed` in the terminal | Host, port, user, password and database name; the service is running. |
| `ER_NO_SUCH_TABLE` | Apply `db/schema.sql` to the database named in `AIVEN_MYSQL_DATABASE`. |
| TLS or certificate errors | Add `AIVEN_MYSQL_CA`, or remove it to use the encrypted fallback. |
| `That username is already taken.` | Usernames are unique; choose another. |
| Login works but the header still says Sign in | Confirm cookies are allowed for the site and `AUTH_SECRET` did not change. |

## Updating content

The SQL seed was generated from `legacy/data.json`, which is now only an archive.
When product content changes, edit the rows in MySQL or update the matching
`INSERT` statements in `db/schema.sql` and run `npm run db:apply` again. Editing
`legacy/data.json` has no effect on the app.
