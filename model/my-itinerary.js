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
    },

    searchAllItinerary: (userEmail, cb) => {
        pool.getConnection((error, connection) => { 
            if (error) {
                return cb(error.message);
            }
            // let userItinerary = null
            let userItineraryList = []
            connection.query(
                'select * from `itinerary` where `user_email`= ? ', [userEmail],
                (error, result) => {
                    if (error) {
                        return cb(error);
                    };
                    let userItinerary = result
                    for(let i = 0; i < userItinerary.length; i++) {
                        connection.query(
                            'select * from `dailyItinerary` where `itinerary_id`= ? ', [userItinerary[i].itinerary_id],
                            (error, result) => {
                                if (error) {
                                    return cb(error);
                                };
                                userItineraryList.push(result)
                                if(i === (userItinerary.length-1)) {
                                    return cb(null, userItineraryList)
                                }
                            }
                        )
                    }
                }
            )

            connection.release();
        });
    }
}