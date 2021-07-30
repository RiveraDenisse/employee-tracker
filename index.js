//import mysql2 package
const mysql = require("mysql2");

//to connect the application to MySQL database
const db = mysql.createConnection(
  {
    host: "localhost",
    //SQL username
    user: "",
    //SQL password
    password: "",
    database: "etracking",
  },
  console.log("Connected to etracking database")
);
