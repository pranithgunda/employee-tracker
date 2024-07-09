DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

\c employee_db;

-- SQL Query to create department table

CREATE TABLE department(
    id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(30)
);

-- SQL Query to create role table

CREATE TABLE role(
    id SERIAL PRIMARY KEY NOT NULL,
    title VARCHAR(30),
    salary DECIMAL,
    department INTEGER,
    FOREIGN KEY (department) REFERENCES department(id) ON DELETE SET NULL
);

-- SQL Query to create employee table

CREATE TABLE employee(
    id SERIAL PRIMARY KEY NOT NULL,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INTEGER,
    manager_id INTEGER,
    FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE SET NULL,
    FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
)