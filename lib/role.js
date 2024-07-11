class Role {

    // function to view all available roles
    viewRoles() {
        return `SELECT * FROM role;`
    }

    // function to add role
    addRole() {
        return `INSERT INTO role (title,salary,department_id)
        VALUES($1,$2,$3);`
    }
}

module.exports = {
    Role
}