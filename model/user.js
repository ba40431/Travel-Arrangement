const pool = require('./connection');

module.exports = {
    insertUser: (userName, userEmail, userPassword, userPicture, cb) => {
        pool.getConnection((error, connection) => { 
            if (error) {
                return cb(error.message);
            }
            connection.query(
                'INSERT INTO `user` (name, email, password, profile) VALUES (?, ?, ?, ?);',
                [userName, userEmail, userPassword, userPicture],
                (error, result) => {
                    if (error) {
                        return cb(error);
                    }
                    return cb(null,result)
                }
            )
            connection.release();
        });
    },
    checkUser: (userEmail, cb) => {
        pool.getConnection((error, connection) => { 
            if (error) {
                return cb(error.message);
            }
            connection.query(
                'SELECT * FROM `user` WHERE email = ?;', [userEmail],
                (error, result) => {
                    if (error) {
                        return cb(error);
                    }
                    return cb(null,result)
                }
            )
            connection.release();
        });
    },
}