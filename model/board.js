const express = require('express');
const mysql = require('mysql2');
const pool = require('./connection')

function insertMessage(title,imageUrl) {
    pool.getConnection((err, connection) => {
        if (err) {
            return console.log(err.message);
        }
        console.log('Connected to the MySQL server.');
        connection.query('INSERT INTO `message` (title, image_url) VALUES (?, ?);', [title, imageUrl],
        function (err, result) {
            if (err) {
                throw err
            };
            connection.release();
            return console.log("Number of records inserted: " + result.affectedRows);
        });
    });
};

// function checkMessage() {
//     pool.getConnection((err, connection) => {
//         if (err) {
//             return console.log(err.message);
//         }
//         console.log('Connected to the MySQL server.');
//         connection.query('SELECT * FROM `message`',
//         function (err, result) {
//             if (err) {
//                 throw err
//             };
//             // console.log(result)
//             connection.release();
//             return result
//         });
//     });
// }

// module.exports = { insertMessage, checkMessage }
module.exports = { insertMessage }