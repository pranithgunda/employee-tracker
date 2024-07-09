// Define all required dependencies
require('dotenv').config();
const inquirer = require('inquirer');
const pg = require('pg');
const {Client} =  pg

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
    user:'postgres',
    password:process.env.POSTGRESDBPWD,
    host:'localhost',
    port:5432,
    database:'postgres'
})

// function defined to prompt user to perform operations related to employee data
function promptUserForOperation(){
    inquirer
    .prompt([
        {
            type:"list",
            message:"What would you like to do ?",
            name:"operation",
            choices:operations
        }
    ])
    .then(response=>console.log(response));
}

// function to initialize the app
function init(){
    // make connection to database
    client.connect();
    // prompt user to perform operations
    promptUserForOperation();
}

// init function call to initialize the app
init();