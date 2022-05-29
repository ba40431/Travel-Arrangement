const pool = require('./connection');

module.exports = {
    attractionDetail: (attractionId, cb) => {
        pool.getConnection((error, connection) => { 
            if (error) {
                return cb(error.message);
            }
            connection.query(
                'select * from attraction JOIN `arrangement`\
                     ON  `attraction`.`id` = `arrangement`.`attraction_id`  \
                     where `attraction`.`id`= ? ', [attractionId],
                (error, result) => {
                    if (error) {
                        return cb(error);
                    };
                    return cb(null, result)
                }
            )
            connection.release();
        });
    },
    hotelDetail: (hotelId, cb) => {
        pool.getConnection((error, connection) => { 
            if (error) {
                return cb(error.message);
            }
            connection.query(
                'select * from hotel where `id`= ? ', [hotelId],
                (error, result) => {
                    if (error) {
                        return cb(error);
                    };
                    return cb(null, result)
                }
            )
            connection.release();
        });
    },
}