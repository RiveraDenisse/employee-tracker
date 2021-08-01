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
          "Add an employee",
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
        console.table(await selectFromTable("SELECT * FROM department"));
      } else if (body.options === "Add a role") {
        const roleAns = await addRole();
        //get all departments
        const deptRowChoices = await selectFromTable(
          "SELECT * FROM department"
        );
        //loop through all departments
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
      } else if (body.options === "View all employees") {
        console.table(await selectFromTable("SELECT * FROM employees"));
      } else if (body.options === "Add an employee") {
        const employeeAns = await addEmployee();
        //get all roles to find role_id
        const roleRowChoices = await selectFromTable(
          "SELECT * FROM employeerole"
        );
        //loop through all roles
        let roleid;
        for (let i = 0; i < roleRowChoices.length; i++) {
          if (employeeAns.roleOptions === roleRowChoices[i].title) {
            //save id if name is equal
            roleid = roleRowChoices[i].id;
          }
        }
        const managerRowChoices = await selectFromTable(
          "SELECT * FROM employees"
        );
        let mngrid;
        for (let i = 0; i < managerRowChoices.length; i++) {
          if (
            employeeAns.mngrOptions ===
            managerRowChoices[i].first_name +
              " " +
              managerRowChoices[i].last_name
          ) {
            //save id if name is equal
            mngrid = managerRowChoices[i].id;
          }
        }
        insertToTable(
          "INSERT INTO employees (first_name,last_name,role_id, manager_id) VALUES (?,?,?,?)",
          [employeeAns.firstName, employeeAns.lastName, roleid, mngrid]
        );
      } else {
        const editEmployeeAns = await editEmployee();
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
async function addEmployee() {
  const roleRowChoices = await selectFromTable("SELECT * FROM employeerole");
  const managerRowChoices = await selectFromTable("SELECT * FROM employees");
  const roleChoices = [];
  const managerChoices = ["none"];
  for (let i = 0; i < roleRowChoices.length; i++) {
    roleChoices.push(roleRowChoices[i].title);
  }
  for (let i = 0; i < managerRowChoices.length; i++) {
    managerChoices.push(
      managerRowChoices[i].first_name + " " + managerRowChoices[i].last_name
    );
  }
  return inquirer.prompt([
    {
      type: "input",
      name: "firstName",
      message: "Please enter employee's first name",
      validate: (firstInput) => {
        if (firstInput) {
          return true;
        } else {
          console.log("Please enter employee's first name");
          return false;
        }
      },
    },
    {
      type: "input",
      name: "lastName",
      message: "Please enter employee's last name",
      validate: (lastNinput) => {
        if (lastNinput) {
          return true;
        } else {
          console.log("Please enter employee's last name");
          return false;
        }
      },
    },
    {
      type: "list",
      name: "roleOptions",
      message: "Please select department for this role",
      choices: roleChoices,
    },
    {
      type: "list",
      name: "mngrOptions",
      message: "Please select a manager",
      choices: managerChoices,
    },
  ]);
}
async function editEmployee() {
  const employeeRowChoices = await selectFromTable("SELECT * FROM employees");
  const employeeChoices = [];
  const roleRowChoices = await selectFromTable("SELECT * FROM employeerole");
  const roleChoices = [];
  for (let i = 0; i < employeeRowChoices.length; i++) {
    employeeChoices.push(
      employeeRowChoices[i].first_name + " " + employeeRowChoices[i].last_name
    );
  }
  for (let i = 0; i < roleRowChoices.length; i++) {
    roleChoices.push(roleRowChoices[i].title);
  }
  return inquirer.prompt([
    {
      type: "list",
      name: "employeeOptions",
      message: "Please select employee you would like to modify",
      choices: employeeChoices,
    },
    {
      type: "list",
      name: "roleOptions",
      message: "Please choose a role",
      choices: roleChoices,
    },
  ]);
}
initialMenu();
