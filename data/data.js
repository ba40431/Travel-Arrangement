const express = require('express');
const mysql = require('mysql2');
require('dotenv').config({path:'../.env'})

const pool = mysql.createPool({
    connectionLimit: 5,
    host: process.env.RDS_HOST,
    port: process.env.RDS_PORT,
    user: process.env.RDS_USER,
    password: process.env.RDS_PASSWORD, 
    database: process.env.RDS_DATABASE
});


pool.getConnection((err, connection) => {
    if (err) {
        return console.log(err.message);
    }
    console.log('Connected to the MySQL server.');
    connection.release();
});