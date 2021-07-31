//to print MySQL rows to the console
const cTable = require("console.table");
const inquirer = require("inquirer");
//import mysql2 package
const mysql = require("mysql2");

function dbConnection() {
  return mysql.createConnection(
    {
      host: "localhost",
      //SQL username
      user: "root",
      //SQL password
      password: "Rocky956!",
      database: "etracking",
    }
    // console.log("Connected to etracking database")
  );
}

function initialMenu() {
  console.log(`
    ===============
    TEAM
    ==================`);
  inquirer
    .prompt([
      {
        type: "list",
        name: "options",
        message: "What would you like to do?",
        choices: [
          "Add Department",
          "view all roles",
          "View all employees",
          "View all departments",
          "add a role",
          "add an employee",
          "update an employee role",
        ],
      },
    ])
    .then(async (body) => {
      if (body.options === "Add Department") {
        const deptAns = await addDepartment();
        insertToTable("INSERT INTO department (name) VALUES (?)", [
          deptAns.name,
        ]);
      } else if (body.options === "View all departments") {
        selectFromTable("SELECT * FROM department");
      }
      initialMenu();
    });
}

function selectFromTable(query) {
  const db = dbConnection();
  db.promise()
    .query(query)
    .then(([rows, fields]) => {
      console.table(rows);
    })
    .then(() => db.end());
}

function insertToTable(query, params) {
  const db = dbConnection();

  db.promise()
    .query(query, params, (err, res) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: "success",
        data: params,
      });
    })
    .then(() => db.end());
}

function addDepartment() {
  return inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "What is the name of the department",
      validate: (deptInput) => {
        if (deptInput) {
          return true;
        } else {
          console.log("Please enter a department name");
          return false;
        }
      },
    },
  ]);
}
initialMenu();
