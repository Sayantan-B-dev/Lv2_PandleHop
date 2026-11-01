-- PandalPass database schema for Aiven for MySQL 8.
-- Run once on a fresh service: mysql ... < db/schema.sql
-- Rerunning this file rebuilds the content tables and keeps user accounts.
-- Seed data lives in db/seed.sql; application queries live in db/queries.sql.

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
