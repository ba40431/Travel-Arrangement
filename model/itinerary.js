const pool = require('./connection');

module.exports = {
  getHotelData: (hotels, cb) => {
    pool.getConnection((error, connection) => {
      if (error) {
        return cb(error.message);
      }
      connection.beginTransaction((error) => {
        if (error) {
          connection.rollback()
          return cb(error.message);
        }
        let hotelList = [];
        let hotelLength = hotels.length;
        for (i in hotels) {
          connection.query(
            'select * from `hotel` where `id`= ? ',
            [parseInt(hotels[i].hotelId)],
            (error, result) => {
              if (error) {
                connection.rollback()
                return cb(error);
              }
              hotelList.push(result);
              hotelLength = hotelLength - 1;
              if (hotelLength === 0) {
                return cb(null, hotelList);
              }
            }
          );
        }
        connection.release();
      })
    });
  },
  searchAttraction: (hotels, distance, cb) => {
    pool.getConnection((error, connection) => {
      if (error) {
        return cb(error.message);
      }
      connection.beginTransaction((error) => {
        if (error) {
          connection.rollback()
          return cb(error.message);
        }
        let attractionList = [];
        let hotelLength = hotels.length;
        for (i in hotels) {
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
            [
              hotels[i][0].latitude,
              hotels[i][0].longitude,
              hotels[i][0].latitude,
              distance,
            ],
            (error, result) => {
              if (error) {
                connection.rollback()
                return cb(error);
              }
              attractionList.push(result);
              hotelLength = hotelLength - 1;
              if (hotelLength === 0) {
                return cb(null, attractionList);
              }
            }
          );
        }
        connection.release();
      })
    });
  },
  insertItinerary: (
    itineraryId,
    itineraryList,
    departureDate,
    returnDate,
    tripLength,
    cities,
    prefer,
    placeDate,
    placeId,
    placeName,
    userId,
    userEmail,
    cb
  ) => {
    pool.getConnection((error, connection) => {
      if (error) {
        return cb(error.message);
      }
      connection.beginTransaction((error) => {
        if (error) {
          connection.rollback()
          return cb(error.message);
        }
        let hotelId = null;
        let hotelName = null;
        let attractionId = null;
        let attractionName = null;
        let attractionDistance = null;
  
        for (let i = 0; i < itineraryList.length; i++) {
          for (let j = 0; j < itineraryList[i].dailyItinerary.length; j++) {
            if (itineraryList[i].hotelName === undefined) {
              hotelId = 99999;
              hotelName = '';
              attractionId = itineraryList[i].dailyItinerary[j].id;
              attractionName = itineraryList[i].dailyItinerary[j].name;
              attractionDistance = itineraryList[i].dailyItinerary[j].distance;
  
              connection.query(
                'INSERT INTO `arrangement` (itinerary_id, days, attraction_id,\
                          attraction_name, attraction_distance, hotel_id, hotel_name)\
                          VALUES (?, ?, ?, ?, ?, ?, ?);',
                [
                  itineraryId,
                  i + 1,
                  attractionId,
                  attractionName,
                  attractionDistance,
                  hotelId,
                  hotelName,
                ],
                (error, result) => {
                  if (error) {
                    connection.rollback()
                    return cb(error);
                  }
                }
              );
            } else if (itineraryList[i].dailyItinerary[j] === undefined) {
              continue;
            } else {
              hotelId = itineraryList[i].hotelName.hotelId;
              hotelName = itineraryList[i].hotelName.hotelName;
              attractionId = itineraryList[i].dailyItinerary[j].id;
              attractionName = itineraryList[i].dailyItinerary[j].name;
              attractionDistance = itineraryList[i].dailyItinerary[j].distance;
  
              connection.query(
                'INSERT INTO `arrangement` (itinerary_id, days, attraction_id,\
                          attraction_name, attraction_distance, hotel_id, hotel_name)\
                          VALUES (?, ?, ?, ?, ?, ?, ?);',
                [
                  itineraryId,
                  i + 1,
                  attractionId,
                  attractionName,
                  attractionDistance,
                  hotelId,
                  hotelName,
                ],
                (error, result) => {
                  if (error) {
                    connection.rollback()
                    return cb(error);
                  }
                }
              );
            }
          }
        }
        connection.query(
          'INSERT INTO `itinerary` (itinerary_id, departure_date, return_date, trip_length, cities, prefer,\
                      must_to_go_place_date, must_to_go_place_id, must_to_go_place_name, user_id, user_email)\
                          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
          [
            itineraryId,
            departureDate,
            returnDate,
            tripLength + 1,
            cities,
            prefer,
            placeDate,
            placeId,
            placeName,
            userId,
            userEmail,
          ],
          (error, result) => {
            if (error) {
              connection.rollback()
              return cb(error);
            }
          }
        );
        connection.query(
          'INSERT INTO `userRight` (user_id, user_email, itinerary_id)\
                          VALUES (?, ?, ?);',
          [userId, userEmail, itineraryId],
          (error, result) => {
            if (error) {
              connection.rollback()
              return cb(error);
            }
            connection.commit((error) => {
              if (error) {
                connection.rollback()
                return cb(error);
              }
              return cb(null, result);
            })
          }
        );
        connection.release();
      })
    });
  },
};
