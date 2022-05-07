const pool = require('./connection');

module.exports = {
    checkTown: (regionA, regionB, regionC, cb) => {
        pool.getConnection((error, connection) => { 
            if (error) {
                return cb(error.message);
            }
            console.log('Connected to the MySQL server.');
            connection.query(
                'select * from `town` where `region`= ? or `region`= ? or `region`= ?',
                [regionA, regionB, regionC],
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