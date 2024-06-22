const db = require("../utils/db-connect");

const createTables = async () => {
  const client = await db.connect();

  try {
    await client.query(`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL
      );
      `);

    await client.query(`
    CREATE TABLE chats (
      id SERIAL PRIMARY KEY,
      message TEXT NOT NULL,
      "targetId" INTEGER NOT NULL,
      "senderId" INTEGER NOT NULL,
      "conversationId" VARCHAR(255) NOT NULL
      )`);
    console.log("Tables created successfully");
  } catch (err) {
    console.error("Error creating tables", err.stack);
    throw err;
  } finally {
    client.release();
  }
};

module.exports = createTables;
