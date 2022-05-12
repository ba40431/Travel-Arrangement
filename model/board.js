const pool = require('./connection');
//如果要使用board頁面，改connection database: process.env.RDS_BOARD_DATABASE
module.exports = {
    insertMessage: (title, imageUrl, cb) => {
        pool.getConnection((error, connection) => {
            if (error) {
                return cb(error.message);
            }
            connection.query(
                'INSERT INTO `message` (title, image_url) VALUES (?, ?);', [title, imageUrl],
                (error, result) => {
                    if (error) {
                        return cb(error);
                    }
                    console.log("Number of records inserted: " + result.affectedRows);
                    return cb(null,result)
                }
            )
            connection.release();
        })
    },
    checkMessage: (cb) => {
        pool.getConnection((error, connection) => { 
            if (error) {
                return cb(error.message);
            }
            console.log('Connected to the MySQL server.');
            connection.query(
                'SELECT * FROM `message`',
                (error, result) => {
                    if (error) {
                        return cb(error);
                    }
                    return cb(null,result)
                }
            )
            connection.release();
        });
    }
}