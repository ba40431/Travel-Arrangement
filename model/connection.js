const mysql = require('mysql2');
require('dotenv').config({ path: './.env' });

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.RDS_HOST,
  port: process.env.RDS_PORT,
  user: process.env.RDS_USER,
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DATABASE,
});

// connection.connect((err) => {  //直接連接資料庫
//     if (err) {
//       return console.error('error: ' + err.message);
//     }

//     console.log('Connected to the MySQL server.');
// });

// pool.getConnection((err, connection) => { //使用Connection Pool連資料庫
//     if (err) {
//         return console.log(err.message);
//     }
//     console.log('Connected to the MySQL server.');
//     connection.release();
// });

module.exports = pool;
