class Role{
    constructor(title,salary,department_id){
        this.title=title;
        this.salary=salary;
        this.department_id=department_id;
    }

    // function to view all available roles
    viewRoles(){
        return `SELECT name FROM role;`
    }

    // function to add role
    addRole(title,salary,department_id){
        return `INSERT INTO role (title,salary,department_id)
        VALUES(title,salary,department_id);`
    }
}

module.exports={
    Role
}