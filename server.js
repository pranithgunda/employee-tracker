require('dotenv').config();
const pg = require('pg');
const {Client} =  pg

const client = new Client({
    user:'postgres',
    password:process.env.POSTGRESDBPWD,
    host:'localhost',
    port:5432,
    database:'postgres'
})

if (client.connect()){
    console.log('connected');
}