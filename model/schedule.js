const pool = require('./connection');

module.exports = {
    getHotelData: (hotels, cb) => {
        pool.getConnection((error, connection) => { 
            if (error) {
                return cb(error.message);
            }
            let hotelList = [];
            let hotelLength = hotels.length;
            for(i in hotels){
                connection.query(
                    'select * from `hotel` where `id`= ? ', [parseInt(hotels[i].hotelId)],
                    (error, result) => {
                        if (error) {
                            return cb(error);
                        };
                        hotelList.push(result);
                        hotelLength = hotelLength - 1;
                        if(hotelLength === 0) {
                            return cb(null, hotelList)
                        }
                    }
                )
            }

            connection.release();
        });
    },
    searchAttraction: (hotels, distance,  cb) => {
        pool.getConnection((error, connection) => { 
            if (error) {
                return cb(error.message);
            }
            let attractionList = [];
            let hotelLength = hotels.length;
            for(i in hotels){
                connection.query(
                    'SELECT *,\
                        (\
                            6371 *\
                            acos(cos(radians(?)) * \
                            cos(radians(`latitude`)) * \
                            cos(radians(`longitude`) - \
                            radians(?)) + \
                            sin(radians(?)) * \
                            sin(radians(`latitude`)))\
                        )\
                        AS distance \
                        FROM `attraction`\
                        HAVING distance < ?\
                        ORDER BY distance;',
                        [hotels[i][0].latitude, hotels[i][0].longitude, hotels[i][0].latitude, distance],
                    (error, result) => {
                        if (error) {
                            return cb(error);
                        };
                        attractionList.push(result);
                        hotelLength = hotelLength - 1;
                        if(hotelLength === 0) {
                            return cb(null, attractionList)
                        }
                    }
                )
            }
            connection.release();
        });
    },
}