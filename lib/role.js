class Role {

    // method defined to view all available roles
    viewRoles() {
        return `SELECT * FROM role;`
    }

    // method defined to add role
    addRole() {
        return `INSERT INTO role (title,salary,department_id)
        VALUES($1,$2,$3);`
    }

    // method defined to view role names
    getRoles(){
        return `SELECT title FROM role;`
    }
}

module.exports = {
    Role
}