const { Pool } = require("pg");

/** NOTE: connection string must be in .env file. */
const connectionUrl =
  "postgres://postgres.bsepxzyduavckhrddilb:RV3bxxocMfinqakN@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres";

const pool = new Pool({
  connectionString: connectionUrl,
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error("Error acquiring client", err.stack);
  }
  console.log("Connected to the database");
  release();
});

module.exports = pool;
