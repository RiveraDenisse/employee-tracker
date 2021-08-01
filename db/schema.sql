DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS employeerole;
DROP TABLE IF EXISTS department;

CREATE TABLE department (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

CREATE TABLE employeerole (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INTEGER NOT NULL,
    CONSTRAINT fk_role FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employees (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER NULL,
    CONSTRAINT fk_employees FOREIGN KEY (role_id) REFERENCES employeerole(id),
    CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES  employees(id)
);