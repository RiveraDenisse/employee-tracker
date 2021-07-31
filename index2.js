//to print MySQL rows to the console
const cTable = require("console.table");
const inquirer = require("inquirer");
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

const body = inquirer
  .prompt([
    {
      type: "input",
      name: "deptName",
      message: "What is the name of the department?",
      validate: (deptname) => {
        if (deptname) {
          return true;
        } else {
          console.log("What is the department's name");
          return false;
        }
      },
    },
    {
      type: "input",
      name: "deptName",
      message: "ddddddt?",
      validate: (deptname) => {
        if (deptname) {
          return true;
        } else {
          console.log("What is the department's name");
          return false;
        }
      },
    },
  ])
  .then((b) => {
    const sql = `INSERT INTO department (name)
                VALUES (?)`;
    const params = [b.deptname];

    db.query(sql, params, (err, res) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: "success",
        data: body,
      });
    });
  });
//to return all the data from employees table rows is the database query response (READ)
db.query(`SELECT * FROM department`, (err, rows) => {
  if (err) {
    console.log(err);
  }
  console.table(rows);
});

//create an employee
