const mysql = require('mysql2');
require('dotenv').config()

const pool = mysql.createPool({
    connectionLimit: 5,
    host: process.env.host,
    user: process.env.user,
    password: process.env.password, 
    database: process.env.database
});

// connection.connect((err) => {  //直接連接資料庫
//     if (err) {
//       return console.error('error: ' + err.message);
//     }
  
//     console.log('Connected to the MySQL server.');
// });

pool.getConnection((err, connection) => { //使用Connection Pool連資料庫
    if (err) {
        return console.log(err.message);
    }
    console.log('Connected to the MySQL server.');
    connection.release();
});