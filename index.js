//to print MySQL rows to the console
const cTable = require("console.table");

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

//to return all the data from employees table rows is the database query response
db.query(`SELECT * FROM employees`, (err, rows) => {
  if (err) {
    console.log(err);
  }
  console.log(rows);
});
