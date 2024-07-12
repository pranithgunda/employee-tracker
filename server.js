// Define all required dependencies
require('dotenv').config();
const inquirer = require('inquirer');
const pg = require('pg');
const { Client } = pg
const { Department } = require('./lib/department');
const { Role } = require('./lib/role');
const { Employee } = require('./lib/employee');
const employee = new Employee();
const role = new Role();
const department = new Department();
// npm package of displaying tables in cli
const Table = require('cli-table');

// Global variables
const availableDepartments = [];
const availableRoles = [];
const availableEmployees = [];

// Define the operations array, user would like to perform
const operations = ['View All Employees',
    'Add Employee',
    'Update Employee Role',
    'View All Roles',
    'Add Role',
    'View All Departments',
    'Add Department',
    'Quit'
]

// client instance configuration to establish connection to db server
const client = new Client({
    user: 'postgres',
    password: process.env.POSTGRESDBPWD,
    host: 'localhost',
    port: 5432,
    database: 'employee_db'
})

// function defined to display array as table to console output

function displayArrayAsTable(arrayToDisplay) {
    if (arrayToDisplay) {
        // Create table instance, append keys as headers and values as rows from each array object
        const table = new Table({
            head: Object.keys(arrayToDisplay[0])
        })
        arrayToDisplay.forEach(arrayItem => {
            table.push(Object.values(arrayItem))
        });
        return table.toString();
    }
}

// function defined to prompt user to perform operations related to employee data
function promptUserForOperation() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to do ?",
                name: "operation",
                choices: operations
            }
        ])
        .then(response => {
            if (response.operation === 'View All Employees') {
                client.query(employee.viewEmployees(), (err, res) => {
                    console.log(displayArrayAsTable(res.rows));
                    promptUserForOperation();
                })
            }
            else if (response.operation === 'View All Roles') {
                client.query(role.viewRoles(), (err, res) => {
                    console.log(displayArrayAsTable(res.rows));
                    promptUserForOperation();
                })
            }
            else if (response.operation === 'View All Departments') {
                client.query(department.viewDepartments(), (err, res) => {
                    console.log(displayArrayAsTable(res.rows));
                    promptUserForOperation();
                })
            }
            else if (response.operation === 'Add Department') {
                inquirer
                    .prompt([{
                        type: 'text',
                        message: 'What is the name of the department?',
                        name: 'department'
                    }])
                    .then(response => {
                        if (response.department) {
                            client.query(department.addDepartment(), [response.department], (err, res) => {
                                console.log(`Added ${response.department} to the database`);
                                promptUserForOperation();
                            })
                        }
                        else {
                            // If no department, log to console and prompt again
                            console.log('Department not provided to add in database');
                            promptUserForOperation();
                        }
                    })
            } else if (response.operation === 'Add Role') {
                // Get available departments to associate new role
                client.query(department.getDepartments(), (err, res) => {
                    res.rows.forEach(row => availableDepartments.push(row));
                })
                inquirer
                    .prompt([
                        {
                            type: "text",
                            message: "What is the name of the role?",
                            name: "role"
                        },
                        {
                            type: "decimal",
                            message: "What is the salary of the role?",
                            name: "salary"
                        },
                        {
                            type: "list",
                            message: "Which department does the role belong to?",
                            name: "department",
                            choices: availableDepartments
                        }
                    ])
                    .then(response => {
                        if (response.role && response.salary && response.department) {
                            client.query(department.getDepartmentID(), [response.department], (err, res) => {
                                    response.department = res.rows[0].id;
                                    if (response.department) {
                                        const valuesToInsert = [response.role, response.salary, response.department];
                                        client.query(role.addRole(), valuesToInsert, (err, res) => {
                                                console.log(`${response.role} added to database`);
                                                promptUserForOperation();
                                            })
                                    }
                                })
                        }
                    })

            } else if (response.operation === 'Add Employee') {
                // Get available departments to associate with new employee
                client.query(role.getRoles(), (err, res) => {
                        res.rows.forEach((row) => availableRoles.push(row.title));
                        // Get available employees for manager selection
                        client.query(employee.getEmployeeNames(), (err, res) => {
                                res.rows.forEach((row) => availableEmployees.push(row.employee_name));
                                availableEmployees.push({ employee_name: 'None' });
                                inquirer
                                    .prompt([
                                        {
                                            type: "text",
                                            message: "What is employee's first name?",
                                            name: "first_name"
                                        },
                                        {
                                            type: "text",
                                            message: "What is employee's last name?",
                                            name: "last_name"
                                        },
                                        {
                                            type: "list",
                                            message: "What is the employee's role?",
                                            name: "role",
                                            choices: availableRoles,
                                        },
                                        {
                                            type: "list",
                                            message: "Who is employee's manager?",
                                            name: "manager",
                                            choices: availableEmployees,
                                        }
                                    ])
                                    .then(response => {
                                        console.log(response);
                                        promptUserForOperation();
                                    })
                            })
                    })
            }
            else {
                // If user selects quit, end the connection
                client.end();
            }
        })
        .catch(error => {
            // Handle all the errors from .then and .query methods
            console.error(error);
            client.end();
        })
}

// function to initialize the app
function init() {
    // prompt user to perform operations
    promptUserForOperation();
}

// make connection to database
client.connect();
// init function call to initialize the app
init();
