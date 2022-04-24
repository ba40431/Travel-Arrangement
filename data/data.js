const express = require('express');
const mysql = require('mysql2');
require('dotenv').config()

const pool = mysql.createPool({
    connectionLimit: 5,
    host: process.env.host,
    user: process.env.user,
    password: process.env.password, 
    database: process.env.database
});


pool.getConnection((err, connection) => {
    if (err) {
        return console.log(err.message);
    }
    console.log('Connected to the MySQL server.');
    connection.release();
});