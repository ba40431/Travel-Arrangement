const pool = require('./connection');

module.exports = {
    searchItinerary: (itineraryId, cb) => {
        pool.getConnection((error, connection) => { 
            if (error) {
                return cb(error.message);
            }
            let itineraryList = []
            connection.query(
                'select * from `itinerary` where `itinerary_id`= ? ', [itineraryId],
                (error, result) => {
                    if (error) {
                        return cb(error);
                    };
                    itineraryList.push(result)
                }
            )
            connection.query(
                'select * from `dailyItinerary` where `itinerary_id`= ? ', [itineraryId],
                (error, result) => {
                    if (error) {
                        return cb(error);
                    };
                    itineraryList.push(result)
                    return cb(null, itineraryList)
                }
            )
            connection.release();
        });
    }
}