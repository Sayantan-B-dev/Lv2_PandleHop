-- PandalPass: all SQL queries used across the application.
--
-- Source files:
--   lib/repository.ts             - product data reads (cached for 30 seconds)
--   app/api/auth/login/route.ts   - user lookup by username
--   app/api/auth/register/route.ts - new user account insert
--
-- Run individually against the database, or review here for schema reference.

-- Product data reads (lib/repository.ts)
-- Fetched in parallel and assembled into the typed PandalPassData object.

-- All pandals with grid coordinates and crowd level.
SELECT
  id,
  name,
  area,
  tagline,
  crowd,
  x,
  y
FROM pandals
ORDER BY id;

-- Vibe tags per pandal, ordered by position.
SELECT
  pandal_id,
  tag
FROM pandal_tags
ORDER BY pandal_id, position;

-- Start points for itinerary planning, ordered by position.
SELECT
  name,
  x,
  y
FROM starts
ORDER BY position;

-- Food stops with icon, area and estimated price, ordered by position.
SELECT
  id,
  icon,
  name,
  kind,
  area,
  price
FROM foods
ORDER BY position;

-- Planner vibes with icon and label, ordered by position.
SELECT
  id,
  icon,
  label
FROM vibes
ORDER BY position;

-- Duration choices and how many pandals each fits, ordered by hours.
SELECT
  hours,
  count
FROM time_options
ORDER BY hours;

-- Travel styles used by the itinerary engine, ordered by position.
SELECT
  id,
  icon,
  label
FROM travel_modes
ORDER BY position;

-- Stylised SVG map area labels and coordinates, ordered by position.
SELECT
  label,
  x,
  y
FROM map_areas
ORDER BY position;

-- JSON configuration rows (site, defaultPrefs, home, etc.).
SELECT
  name,
  value
FROM settings;

-- Auth queries

-- Login: look up an existing user by username (app/api/auth/login/route.ts).
SELECT
  id,
  username,
  password_hash
FROM users
WHERE username = ?
LIMIT 1;

-- Register: insert a new user account (app/api/auth/register/route.ts).
INSERT INTO users (username, password_hash)
VALUES (?, ?);
