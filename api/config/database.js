module.exports = {
  development: {
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "12345",
    database: process.env.DB_NAME || "FinanceTracker",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT,
    dialect: 'postgresql',
    logging: console.log
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgresql',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
}