const mysql = require('mysql2/promise');
require('dotenv').config({ path: './.env' });

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.RDS_HOST,
  port: process.env.RDS_PORT,
  user: process.env.RDS_USER,
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DATABASE,
});

module.exports = pool;
