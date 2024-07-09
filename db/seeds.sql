-- Insert data into deparment table
INSERT INTO department (name)
VALUES('Sales'),
('Engineering'),
('Finance'),
('Legal');

-- Insert data into role table

INSERT INTO role (title, salary, department_id)
VALUES('Sales Lead',100000,1),
('Salesperson',80000,1),
('Lead Engineer',150000,2),
('Software Engineer',120000,2),
('Account Manager',160000,3),
('Accountant',125000,3),
('Legal Team Lead',250000,4),
('Lawyer',190000,4);

-- Insert data into employee table

INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES('John','Smith',1,null),
('Alex','Travis',2,null),
('Joe','Jonas',3,null),
('John','Austin',4,3),
('Sam','Rodriguez',5,null),
('Jenniffer','Young',6,5),
('Park','Chris',7,null),
('Andrew','Downey',8,7);

