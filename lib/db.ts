import mysql from "mysql2/promise";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: Number.parseInt(process.env.DATABASE_PORT || "3306"),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Generic query helper with typed result
// Usage examples:
//  - SELECT: const rows = await query<RowDataPacket[]>(sql, params)
//  - INSERT/UPDATE/DELETE: const result = await query<ResultSetHeader>(sql, params)
export async function query<T = any>(sql: string, values?: any[]): Promise<T> {
  const connection = await pool.getConnection();
  try {
    console.log("Executing SQL:", sql);
    console.log("With values:", values);
    const [results] = await connection.execute<RowDataPacket[] | ResultSetHeader>(
      sql,
      values || []
    );
    return results as unknown as T;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  } finally {
    connection.release();
  }
}

export default pool;
