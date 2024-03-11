const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "chat-app",
  password: "admin",
  port: 5432,
});

// Function to check if the table exists
const tableExists = async (tableName) => {
  try {
    const query = `
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name = '${tableName}'
      );
      `;
    const result = await pool.query(query);
    return result.rows[0].exists;
  } catch (e) {
    throw e;
  }
};

// Function to create the users table
const createUserTable = async () => {
  try {
    const query = `
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL
      );
      `;
    await pool.query(query);
  } catch (e) {
    throw e;
  }
};

module.exports = {
  createUserTable,
  tableExists,
  pool,
};
