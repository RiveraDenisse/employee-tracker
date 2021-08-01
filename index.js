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
          "View all roles",
          "View all employees",
          "View all departments",
          "Add a role",
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
        console.log(await selectFromTable("SELECT * FROM department"));
      } else if (body.options === "Add a role") {
        const roleAns = await addRole();
        //get all departments
        const deptRowChoices = await selectFromTable(
          "SELECT * FROM department"
        );
        //loop throught all departments
        for (let i = 0; i < deptRowChoices.length; i++) {
          //check for the chosen department in the list of departments
          if (roleAns.options === deptRowChoices[i].name) {
            //save id if name is equal
            insertToTable(
              "INSERT INTO employeerole (title,salary,department_id) VALUES (?,?,?)",
              [roleAns.name, roleAns.salary, deptRowChoices[i].id]
            );
          }
        }
      } else if (body.options === "View all roles") {
        console.table(await selectFromTable("SELECT * FROM employeerole"));
      }
      initialMenu();
    });
}

function selectFromTable(query) {
  const db = dbConnection();
  return db
    .promise()
    .query(query)
    .then(([rows, fields]) => {
      db.end();
      return rows;
    });
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

async function addRole() {
  const deptRowChoices = await selectFromTable("SELECT * FROM department");
  const deptChoices = [];
  for (let i = 0; i < deptRowChoices.length; i++) {
    deptChoices.push(deptRowChoices[i].name);
  }
  return inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "What is the name of the role?",
      validate: (roleInput) => {
        if (roleInput) {
          return true;
        } else {
          console.log("Please enter a name");
          return false;
        }
      },
    },
    {
      type: "input",
      name: "salary",
      message: "Please enter salary for the role?",
      validate: (salaryInput) => {
        if (salaryInput) {
          return true;
        } else {
          console.log("Please enter salary");
          return false;
        }
      },
    },
    {
      type: "list",
      name: "options",
      message: "Please choose department for this role",
      choices: deptChoices,
    },
  ]);
}
initialMenu();
