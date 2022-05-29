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
                'select * from `arrangement` where `itinerary_id`= ? ', [itineraryId],
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
                'select * from `userRight` join `user` ON `userRight`.`user_email`=`user`.`email` \
                    where `userRight`.`user_email` = ?;', [userEmail],
                    (error, result) => {
                        if (error) {
                            return cb(error);
                        };
                        if(result.length === 0) {
                            return cb(null, userItineraryList)
                        }
                        for(let i = 0; i < result.length; i++) {
                            let allItinerary = result
                            connection.query(
                                'select * from `itinerary` where `itinerary_id`= ? ', [allItinerary[i].itinerary_id],
                                (error, result) => {
                                    if (error) {
                                        return cb(error);
                                    };
                                    let userItinerary = result
                                    if(userItinerary.length === 0) {
                                        return cb(null, userItineraryList)
                                    }else {
                                        for(let j = 0; j < userItinerary.length; j++) {
                                            connection.query(
                                                'select * from `arrangement` where `itinerary_id`= ? ', [userItinerary.itinerary_id],
                                                (error, result) => {
                                                    if (error) {
                                                        return cb(error);
                                                    };
                                                    userItineraryList.push([userItinerary[j],result])
                                                    if(i === (allItinerary.length-1)) {
                                                        return cb(null, userItineraryList)
                                                    }
                                                }
                                            )
                                        }
                                    }
                                }
                            )
                        }
                    }
            )
            connection.release();
        });
    },

    deleteItinerary: (userEmail, itineraryId, cb) => {
        pool.getConnection((error, connection) => { 
            if (error) {
                return cb(error.message);
            }
            connection.query(
                'SELECT COUNT(*) AS count from `itinerary` where `itinerary_id`= ? and `user_email` = ?;'
                , [itineraryId, userEmail],
                (error, result) => {
                    if (error) {
                        return cb(error);
                    };
                    if(result[0].count === 0) {
                        connection.query(
                            'delete from `userRight` where `itinerary_id`= ? and `user_email` = ?'
                            , [itineraryId, userEmail],
                            (error, result) => {
                                if (error) {
                                    return cb(error);
                                };
                                return cb(null, result)
                            }
                        )
                    }else {
                        connection.query(
                            'delete from `itinerary` where `itinerary_id`= ? ', [itineraryId],
                            (error, result) => {
                                if (error) {
                                    return cb(error);
                                };
                            }
                        ),
                        connection.query(
                            'delete from `arrangement` where `itinerary_id`= ? ', [itineraryId],
                            (error, result) => {
                                if (error) {
                                    return cb(error);
                                };
                            }
                        ),
                        connection.query(
                            'delete from `userRight` where `itinerary_id`= ? ', [itineraryId],
                            (error, result) => {
                                if (error) {
                                    return cb(error);
                                };
                                return cb(null, result)
                            }
                        )
                    }
                }
            )
            connection.release();
        });
    },

    shareItinerary: (userId, userEmail, itineraryId, cb) => {
        pool.getConnection((error, connection) => {
            if (error) {
                return cb(error.message);
            }
            connection.query(
                'SELECT COUNT(*) AS count from `userRight` where `itinerary_id`= ? and `user_email` = ?;'
                    , [itineraryId, userEmail],
                (error, result) => {
                    if (error) {
                        return cb(error);
                    }
                    if(result[0].count === 0) {
                        connection.query(
                            'INSERT INTO `userRight` (user_id, user_email, itinerary_id) VALUES (?, ?, ?);'
                                , [userId, userEmail, itineraryId],
                            (error, result) => {
                                if (error) {
                                    return cb(error);
                                }
                                console.log("Number of records inserted: " + result.affectedRows);
                                return cb(null,result)
                            }
                        )
                    }else {
                        return cb(null, result[0].count)
                    }
                }
            )
            connection.release();
        })
    }
}