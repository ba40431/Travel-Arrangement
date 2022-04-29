const express = require('express');
const mysql = require('mysql2');
const pool = require('./connection')

module.exports = {
    insertMessage: (title, imageUrl, cb) => {
        pool.getConnection((error, connection) => {
            if (error) {
                return cb(error.message);
            }
            console.log('Connected to the MySQL server.');
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