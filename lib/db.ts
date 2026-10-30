import mysql, { type Pool, type ResultSetHeader, type RowDataPacket } from "mysql2/promise";

let pool: Pool | null = null;

const required = ["AIVEN_MYSQL_HOST", "AIVEN_MYSQL_DATABASE", "AIVEN_MYSQL_USER", "AIVEN_MYSQL_PASSWORD"] as const;

export function isDatabaseConfigured(): boolean {
  return required.every((name) => Boolean(process.env[name]));
}

function sslConfig() {
  const ca = process.env.AIVEN_MYSQL_CA;
  if (ca) {
    return { ca: ca.replace(/\\n/g, "\n"), rejectUnauthorized: true };
  }
  // Aiven terminates TLS with its project CA. Without the CA certificate in the
  // environment the connection is still encrypted, just not certificate-verified.
  return { rejectUnauthorized: false };
}

export function getPool(): Pool {
  if (!isDatabaseConfigured()) {
    throw new Error("Aiven MySQL environment variables are not set");
  }
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.AIVEN_MYSQL_HOST,
      port: Number(process.env.AIVEN_MYSQL_PORT ?? 3306),
      database: process.env.AIVEN_MYSQL_DATABASE,
      user: process.env.AIVEN_MYSQL_USER,
      password: process.env.AIVEN_MYSQL_PASSWORD,
      ssl: sslConfig(),
      waitForConnections: true,
      connectionLimit: 5,
      connectTimeout: 5000,
      charset: "utf8mb4",
    });
  }
  return pool;
}

export async function query<T extends RowDataPacket>(
  sql: string,
  params: unknown[] = [],
): Promise<T[]> {
  const [rows] = await getPool().query<T[]>(sql, params);
  return rows;
}

export async function execute(sql: string, params: (string | number | null)[] = []): Promise<ResultSetHeader> {
  const [result] = await getPool().execute<ResultSetHeader>(sql, params);
  return result;
}
