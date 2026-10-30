-- PandalPass database schema for Aiven for MySQL 8.
-- Run once on a fresh service: mysql ... < db/schema.sql
-- Rerunning this file rebuilds the content tables and keeps user accounts.

SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  username VARCHAR(32) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY users_username_unique (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS pandal_tags;
DROP TABLE IF EXISTS pandals;
DROP TABLE IF EXISTS starts;
DROP TABLE IF EXISTS foods;
DROP TABLE IF EXISTS vibes;
DROP TABLE IF EXISTS time_options;
DROP TABLE IF EXISTS travel_modes;
DROP TABLE IF EXISTS map_areas;
DROP TABLE IF EXISTS settings;

CREATE TABLE pandals (
  id INT UNSIGNED NOT NULL,
  name VARCHAR(120) NOT NULL,
  area VARCHAR(80) NOT NULL,
  tagline VARCHAR(160) NOT NULL,
  crowd ENUM('low', 'moderate', 'heavy') NOT NULL,
  x SMALLINT UNSIGNED NOT NULL,
  y SMALLINT UNSIGNED NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE pandal_tags (
  pandal_id INT UNSIGNED NOT NULL,
  tag VARCHAR(40) NOT NULL,
  position TINYINT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (pandal_id, tag),
  CONSTRAINT pandal_tags_pandal_fk FOREIGN KEY (pandal_id) REFERENCES pandals (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE starts (
  name VARCHAR(80) NOT NULL,
  x SMALLINT UNSIGNED NOT NULL,
  y SMALLINT UNSIGNED NOT NULL,
  position TINYINT UNSIGNED NOT NULL,
  PRIMARY KEY (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE foods (
  id VARCHAR(64) NOT NULL,
  icon VARCHAR(40) NOT NULL,
  name VARCHAR(120) NOT NULL,
  kind VARCHAR(160) NOT NULL,
  area VARCHAR(80) NOT NULL,
  price SMALLINT UNSIGNED NOT NULL,
  position TINYINT UNSIGNED NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE vibes (
  id VARCHAR(40) NOT NULL,
  icon VARCHAR(40) NOT NULL,
  label VARCHAR(80) NOT NULL,
  position TINYINT UNSIGNED NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE time_options (
  hours TINYINT UNSIGNED NOT NULL,
  count TINYINT UNSIGNED NOT NULL,
  PRIMARY KEY (hours)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE travel_modes (
  id VARCHAR(40) NOT NULL,
  icon VARCHAR(40) NOT NULL,
  label VARCHAR(80) NOT NULL,
  position TINYINT UNSIGNED NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE map_areas (
  label VARCHAR(80) NOT NULL,
  x SMALLINT UNSIGNED NOT NULL,
  y SMALLINT UNSIGNED NOT NULL,
  position TINYINT UNSIGNED NOT NULL,
  PRIMARY KEY (label)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE settings (
  name VARCHAR(60) NOT NULL,
  value JSON NOT NULL,
  PRIMARY KEY (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Product content
INSERT INTO pandals (id, name, area, tagline, crowd, x, y) VALUES
  (1, 'Tala Park Pratyay', 'Tala', 'Contemporary art theme', 'moderate', 175, 38),
  (2, 'Kumartuli Park', 'Kumartuli', 'Artisan roots and classic craft', 'moderate', 190, 78),
  (3, 'Ahiritola Sarbojanin', 'Ahiritola', 'Riverside classic', 'moderate', 165, 102),
  (4, 'Hatibagan Nabin Pally', 'Hatibagan', 'Heritage lanes', 'heavy', 220, 128),
  (5, 'Manicktala Chaltabagan', 'Manicktala', 'Folk craft showcase', 'heavy', 240, 165),
  (6, 'College Square', 'College Street', 'Bookish and classic', 'heavy', 170, 178),
  (7, 'Santosh Mitra Sangha', 'Wellington', 'Grand-scale spectacle', 'heavy', 205, 215),
  (8, 'Mohammad Ali Park', 'Central Kolkata', 'Traditional ritual', 'heavy', 190, 238),
  (9, 'Sreebhumi Sporting', 'Lake Town', 'Themed marvel', 'heavy', 320, 95),
  (10, 'Baguiati Welfare', 'Baguiati', 'Neighbourhood warmth', 'low', 312, 150),
  (11, 'Salt Lake FD Block', 'Salt Lake', 'Light installations', 'moderate', 290, 195),
  (12, 'Suruchi Sangha', 'New Alipore', 'Elegant minimalism', 'moderate', 90, 330),
  (13, 'Behala Club', 'Behala', 'Community favourite', 'low', 110, 440),
  (14, 'Tollygunge Agrani', 'Tollygunge', 'Retro lanes', 'low', 150, 455),
  (15, 'Ballygunge Cultural', 'Ballygunge', 'Elegant and traditional', 'moderate', 225, 340),
  (16, 'Singhi Park', 'Ballygunge', 'Crowd-favourite theme', 'heavy', 300, 332),
  (17, 'Deshapriya Park', 'Ballygunge', 'Massive scale', 'heavy', 262, 352),
  (18, 'Maddox Square', 'Ballygunge', 'Neighbourhood classic', 'moderate', 247, 372),
  (19, 'Badamtala Ashar Sangha', 'Kalighat', 'Award-winning themes', 'moderate', 205, 385),
  (20, 'Chetla Agrani', 'Chetla', 'Riverside ritual', 'low', 190, 405),
  (21, 'Jodhpur Park', 'Jodhpur Park', 'Theme wizardry', 'heavy', 262, 425),
  (22, 'Babubagan Sarbojanin', 'Dhakuria', 'Lakeside glow', 'moderate', 285, 445),
  (23, 'Naktala Udayan', 'Naktala', 'Lively dhaak and dance', 'moderate', 285, 482),
  (24, 'Hindustan Club', 'Gariahat', 'Crowd-puller', 'heavy', 308, 300),
  (25, 'Park Circus Sarbojanin', 'Park Circus', 'Cultural melange', 'moderate', 262, 262),
  (26, 'Dum Dum Park Tarun Sangha', 'Dum Dum', 'Folk-art theme', 'moderate', 262, 55);

INSERT INTO pandal_tags (pandal_id, tag, position) VALUES
  (1, 'insta', 0),
  (1, 'iconic', 1),
  (2, 'iconic', 0),
  (2, 'family', 1),
  (3, 'family', 0),
  (3, 'quiet', 1),
  (4, 'iconic', 0),
  (4, 'energy', 1),
  (5, 'family', 0),
  (5, 'insta', 1),
  (6, 'iconic', 0),
  (6, 'family', 1),
  (7, 'iconic', 0),
  (7, 'insta', 1),
  (7, 'energy', 2),
  (8, 'iconic', 0),
  (8, 'family', 1),
  (9, 'iconic', 0),
  (9, 'insta', 1),
  (9, 'energy', 2),
  (10, 'family', 0),
  (10, 'quiet', 1),
  (11, 'insta', 0),
  (11, 'energy', 1),
  (12, 'quiet', 0),
  (12, 'insta', 1),
  (13, 'family', 0),
  (13, 'quiet', 1),
  (14, 'quiet', 0),
  (14, 'family', 1),
  (15, 'iconic', 0),
  (15, 'family', 1),
  (16, 'iconic', 0),
  (16, 'insta', 1),
  (16, 'energy', 2),
  (17, 'iconic', 0),
  (17, 'energy', 1),
  (18, 'family', 0),
  (18, 'quiet', 1),
  (19, 'iconic', 0),
  (19, 'insta', 1),
  (20, 'quiet', 0),
  (20, 'family', 1),
  (21, 'insta', 0),
  (21, 'iconic', 1),
  (22, 'insta', 0),
  (22, 'quiet', 1),
  (23, 'energy', 0),
  (23, 'family', 1),
  (24, 'energy', 0),
  (24, 'iconic', 1),
  (25, 'family', 0),
  (25, 'energy', 1),
  (26, 'energy', 0),
  (26, 'family', 1);

INSERT INTO starts (name, x, y, position) VALUES
  ('Barasat', 235, 12, 0),
  ('Salt Lake', 300, 175, 1),
  ('Sector V', 335, 205, 2),
  ('New Town', 340, 120, 3),
  ('Dum Dum', 270, 70, 4),
  ('Shyambazar', 200, 105, 5),
  ('Esplanade', 205, 250, 6),
  ('Howrah', 120, 190, 7),
  ('Park Circus', 255, 275, 8),
  ('Garia', 235, 505, 9),
  ('Tollygunge', 185, 470, 10),
  ('Behala', 95, 470, 11);

INSERT INTO foods (id, icon, name, kind, area, price, position) VALUES
  ('pujo-bhog', 'cookingPot', 'Pujo Bhog Stall', 'Khichuri, labra, payesh', 'Kumartuli', 180, 0),
  ('phuchka-chaat', 'soup', 'Phuchka & Chaat Lane', 'Street snacks', 'College Street', 90, 1),
  ('kathi-roll', 'sandwich', 'Kathi Roll Corner', 'Egg and chicken rolls', 'Park Circus', 140, 2),
  ('bengali-thali', 'fish', 'Bengali Thali House', 'Fish curry, rice, mishti', 'Ballygunge', 320, 3),
  ('mughlai-parantha', 'cookingPot', 'Mughlai Parantha Dhaba', 'Late-night classic', 'Esplanade', 200, 4),
  ('mishti-mandir', 'cakeSlice', 'Mishti Mandir', 'Sandesh, rosogolla, mishti doi', 'Gariahat', 120, 5),
  ('tangra-bites', 'utensils', 'Chinese Tangra Bites', 'Chowmein, chilli chicken', 'Tollygunge', 220, 6),
  ('cha-cutlet', 'coffee', 'Cha & Cutlet Adda', 'Kolkata cutlet and cha', 'Salt Lake', 100, 7);

INSERT INTO vibes (id, icon, label, position) VALUES
  ('iconic', 'star', 'Iconic pandals', 0),
  ('insta', 'camera', 'Instagram-worthy', 1),
  ('quiet', 'leaf', 'Less crowded', 2),
  ('family', 'users', 'Family friendly', 3),
  ('energy', 'zap', 'High-energy', 4);

INSERT INTO time_options (hours, count) VALUES
  (4, 3),
  (6, 4),
  (8, 5);

INSERT INTO travel_modes (id, icon, label, position) VALUES
  ('metro', 'train', 'Metro preferred', 0),
  ('auto_metro', 'bus', 'Auto + Metro', 1),
  ('walk', 'footprints', 'More walking', 2),
  ('cab', 'car', 'Cab friendly', 3);

INSERT INTO map_areas (label, x, y, position) VALUES
  ('Lake Town', 580, 14, 0),
  ('Shyambazar', 450, 150, 1),
  ('College St', 200, 180, 2),
  ('Sealdah', 510, 245, 3),
  ('Esplanade', 156, 230, 4),
  ('Maidan', 164, 300, 5),
  ('New Alipore', 16, 328, 6),
  ('Gariahat', 600, 318, 7),
  ('Chetla', 220, 405, 8),
  ('Tollygunge', 240, 470, 9),
  ('Naktala', 600, 500, 10);

INSERT INTO settings (name, value) VALUES
  ('site', '{"name":"PandalPass","festival":"Durga Pujo 2026","planningNote":"Crowd, time and cost are planning estimates, not live data.","storage":{"prefs":"pandalpass.prefs","pass":"pandalpass.pass"}}'),
  ('defaultPrefs', '{"start":"Barasat","vibes":["iconic","insta","quiet"],"hours":6,"mode":"auto_metro","food":true}'),
  ('home', '{"pickIds":[9,6,17,23],"foodCount":3}'),
  ('pandalGlyphs', '["landmark","flame","flower","palette","sparkles"]'),
  ('crowdLabels', '{"low":"Low","moderate":"Moderate","heavy":"Heavy"}'),
  ('tagLabels', '{"iconic":"Iconic","insta":"Instagram","quiet":"Low crowd","family":"Family","energy":"High energy"}'),
  ('engine', '{"distanceScale":0.05,"startClock":1110,"stayBase":24,"stayStep":2,"waitStep":2,"minLegMins":5,"foodOffset":2,"foodWalkMins":8,"foodWalkKm":0.6,"foodStayMins":45,"crowdBase":{"low":8,"moderate":20,"heavy":38},"travel":{"cab":{"label":"Cab","icon":"cab","baseMins":6,"minsPerKm":3,"baseCost":60,"costPerKm":18},"walk":{"label":"Walk","icon":"walk","maxKm":1.5,"minsPerKm":13,"cost":0},"auto":{"label":"Auto","icon":"auto","maxKm":4,"baseMins":6,"minsPerKm":3.2,"baseCost":30,"costPerKm":10},"metro":{"label":"Metro + walk","icon":"metro","baseMins":10,"minsPerKm":3,"walkKm":0.3,"cost":20}}}');
