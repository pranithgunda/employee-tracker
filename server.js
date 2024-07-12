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
let availableDepartments = [];
let availableRoles = [];
let availableEmployees = [];

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
                    // reset available roles to null
                    availableRoles = [];
                    res.rows.forEach((row) => availableRoles.push(row.title));
                    // Get available employees for manager selection
                    client.query(employee.getEmployeeNames(), (err, res) => {
                        // reset available employees to null
                        availableEmployees = [];
                        availableEmployees.push('None');
                        res.rows.forEach((row) => availableEmployees.push(row.employee_name));
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
                                    name: "role_id",
                                    choices: availableRoles,
                                },
                                {
                                    type: "list",
                                    message: "Who is employee's manager?",
                                    name: "manager_id",
                                    choices: availableEmployees,
                                }
                            ])
                            .then(response => {
                                if (response.first_name && response.last_name && response.role_id) {
                                    client.query(role.getRoleId(), [response.role_id], (err, res) => {
                                        response.role_id = res.rows[0].id
                                        if (response.role_id) {
                                            if (response.manager_id && response.manager_id !== 'None') {
                                                client.query(employee.getEmployeeId(), [response.manager_id], (err, res) => {
                                                    response.manager_id = res.rows[0].id
                                                    if (response.manager_id) {
                                                        client.query(employee.addEmployee(), [response.first_name, response.last_name, response.role_id, response.manager_id], (err, res) => {
                                                            console.log(`Employee ${response.first_name} ${response.last_name} added to database`)
                                                            promptUserForOperation();
                                                        })
                                                    }
                                                })

                                            } else {
                                                client.query(employee.addEmployee(), [response.first_name, response.last_name, response.role_id, null], (err, res) => {
                                                    console.log(`Employee ${response.first_name} ${response.last_name} added to database`)
                                                    promptUserForOperation();
                                                })
                                            }
                                        }
                                    })
                                }
                            })
                    })
                })
            } else if (response.operation === 'Update Employee Role') {
                // Get available employees
                client.query(employee.getEmployeeNames(), (err, res) => {
                    // reset array to empty
                    availableEmployees = [];
                    res.rows.forEach((row) => availableEmployees.push(row.employee_name));
                // Get available roles
                client.query(role.getRoles(),(err,res)=>{
                    // reset array to empty
                    availableRoles=[];
                    res.rows.forEach((row) => availableRoles.push(row.title));
                    inquirer
                    .prompt([
                        {
                         type:"list",
                         message:"Which employee's role do you want to update? ",
                         name:"employee_id",
                         choices:availableEmployees   
                        },
                        {
                            type:"list",
                            message:"Which role do you want to assign the selected employee?",
                            name:"role_id",
                            choices:availableRoles
                        }
                    ])
                    .then(response =>{
                        if(response.employee_id && response.role_id){
                            client.query(employee.getEmployeeId(),[response.employee_id],(err,res)=>{
                                response.employee_id = res.rows[0].id
                                if(response.employee_id){
                                    client.query(role.getRoleId(),[response.role_id],(err,res)=>{
                                        response.role_id = res.rows[0].id
                                        if(response.role_id){
                                            client.query(employee.updateEmployeeRole(),[response.role_id,response.employee_id],(err,res)=>{
                                                console.log('Updated employees role');
                                                promptUserForOperation();
                                            })
                                        }
                                    })
                                }
                            })

                        }
                        else{
                            console.log('Please select both employee and role to update')
                        }
                    })


                })}
                )}
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
