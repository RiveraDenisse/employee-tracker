INSERT INTO employees (first_name,last_name,role_id,manager_id)
VALUES
('Denisse', 'Rivera','2','1'),
('Daren', 'Curry','1','2'),
('William', 'Gray','2','1'),
('Janet', 'Reberg','3','3'),
('William', 'Shakespeare','4','4'),
('Edith', 'Rios','4','3');

INSERT INTO employeerole (title,salary,department_id)
VALUES
('Senior Engineer','150000','1'),
('Engineer','95000','1'),
('Vice President of Engineering','200000','1'),
('Accountant','93000','3'),
('HR Generalist','65000','2'),
('Utility Designer','60000','4');

INSERT INTO department (name)
VALUES
('Engineering'),
('HR'),
('Finance'),
('Staking');