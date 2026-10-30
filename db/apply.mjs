// Applies db/schema.sql to the Aiven MySQL service configured in the environment.
// Run with: npm run db:apply
// The script never prints credentials or connection values.
import { readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import mysql from "mysql2/promise";

const here = dirname(fileURLToPath(import.meta.url));
const schemaPath = join(here, "schema.sql");

const required = ["AIVEN_MYSQL_HOST", "AIVEN_MYSQL_DATABASE", "AIVEN_MYSQL_USER", "AIVEN_MYSQL_PASSWORD"];
const missing = required.filter((name) => !process.env[name]);

if (missing.length) {
  console.error(`Missing environment variables: ${missing.join(", ")}`);
  console.error("Set them in .env or export them before running this script.");
  process.exit(1);
}

const ssl = process.env.AIVEN_MYSQL_CA
  ? { ca: process.env.AIVEN_MYSQL_CA.replace(/\\n/g, "\n"), rejectUnauthorized: true }
  : { rejectUnauthorized: false };

const schema = readFileSync(schemaPath, "utf8");
const tables = [
  "pandals",
  "pandal_tags",
  "starts",
  "foods",
  "vibes",
  "time_options",
  "travel_modes",
  "map_areas",
  "settings",
  "users",
];

const connection = await mysql.createConnection({
  host: process.env.AIVEN_MYSQL_HOST,
  port: Number(process.env.AIVEN_MYSQL_PORT ?? 3306),
  database: process.env.AIVEN_MYSQL_DATABASE,
  user: process.env.AIVEN_MYSQL_USER,
  password: process.env.AIVEN_MYSQL_PASSWORD,
  ssl,
  multipleStatements: true,
  connectTimeout: 15000,
});

try {
  console.log(`Applying ${relative(process.cwd(), schemaPath)} to the configured database.`);
  await connection.query(schema);
  console.log("Schema applied. Row counts:");

  for (const table of tables) {
    const [rows] = await connection.query(`SELECT COUNT(*) AS count FROM \`${table}\``);
    const count = Array.isArray(rows) && rows[0] ? rows[0].count : 0;
    console.log(`  ${table}: ${count}`);
  }
} catch (error) {
  console.error(`Failed to apply the schema: ${error.message}`);
  process.exitCode = 1;
} finally {
  await connection.end();
}
