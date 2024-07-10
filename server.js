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
                    if (err) {
                        console.error(err);
                        return;
                    }
                    console.log(displayArrayAsTable(res.rows));
                    client.end();
                })
            }
            else if(response.operation === 'View All Roles'){
                client.query(role.viewRoles(),(err,res) =>{
                    if(err){
                        console.error(err)
                        return;
                    }
                    console.log(displayArrayAsTable(res.rows));
                    client.end();
                })
            }
            else if(response.operation === 'View All Departments'){
                client.query(department.viewDepartments(),(err,res)=>{
                    if(err){
                        console.error(err)
                        return;
                    }
                    console.log(displayArrayAsTable(res.rows));
                    client.end();
                })
            }
            else{
                client.end();
            }
        });
}

// function to initialize the app
function init() {
    // make connection to database
    client.connect();
    // prompt user to perform operations
    promptUserForOperation();
}

// init function call to initialize the app
init();