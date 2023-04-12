//import mysql from 'mysql2'
//import dotenv from 'dotenv'
const mysql = require('mysql2')
const dotenv = require('dotenv').config()
console.log(dotenv.parsed.MYSQL_DATABASE)
console.log(process.env.MYSQL_HOST)
//collection of connections to db
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise() ///now i can use promise api version instead of callbacks

async function getCourses() {
    const [rows] = await pool.query('SELECT * FROM college_schema.courses')
    console.log(rows)
    return rows
}
const rows = getCourses()
/*

//const rows = result[0]
const rows = getCourses()
//console.log(rows) */

module.exports = pool

