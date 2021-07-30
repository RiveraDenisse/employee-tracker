//import mysql2 package
const mysql = require("mysql2");

//to connect the application to MySQL database
const db = mysql.createConnection(
  {
    host: "localhost",
    //SQL username
    user: "root",
    //SQL password
    password: "Rocky956!",
    database: "etracking",
  },
  console.log("Connected to etracking database")
);
