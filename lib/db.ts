import mysql from "mysql2/promise";

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

export async function query(sql: string, values?: any[]) {
  const connection = await pool.getConnection();
  try {
    console.log("Executing SQL:", sql); // Logging untuk debugging
    console.log("With values:", values); // Logging nilai parameter
    const [results] = await connection.execute(sql, values || []); // Gunakan array kosong jika values undefined
    return results;
  } catch (error) {
    console.error("Database query error:", error);
    throw error; // Lempar error agar bisa ditangani di level atas
  } finally {
    connection.release();
  }
}

export default pool;