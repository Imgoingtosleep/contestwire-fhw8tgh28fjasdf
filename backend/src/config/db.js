const { Pool } = require("pg");

function getPoolConfig() {
  if (process.env.DATABASE_URL) {
    return { connectionString: process.env.DATABASE_URL };
  }

  const config = {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT, 10) : undefined,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  };

  // Remove undefined keys so pg driver doesn't fail on explicit undefined
  Object.keys(config).forEach((key) => {
    if (config[key] === undefined) delete config[key];
  });

  return config;
}

const pool = new Pool(getPoolConfig());

pool.on("error", (err) => {
  console.error("[PostgreSQL] Unexpected error on idle client:", err.message);
});

async function initDB(retries = 5, delayMs = 3000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const client = await pool.connect();
      console.log("[PostgreSQL] Connected successfully to database");

      // Auto create tables if not exist
      await client.query(`
        CREATE TABLE IF NOT EXISTS submissions (
          id SERIAL PRIMARY KEY,
          full_name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          phone VARCHAR(50),
          team_name VARCHAR(255),
          video_title VARCHAR(255) NOT NULL,
          video_url TEXT,
          file_url TEXT,
          file_key VARCHAR(255),
          description TEXT,
          status VARCHAR(50) DEFAULT 'pending',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at DESC);
        CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
      `);

      client.release();
      console.log("[PostgreSQL] Tables verified and ready");
      return;
    } catch (err) {
      console.error(
        `[PostgreSQL] Connection attempt ${attempt}/${retries} failed: ${err.message}`
      );
      if (attempt === retries) {
        console.error("[PostgreSQL] Exhausted retries. Exiting...");
        process.exit(1);
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
  initDB,
};
