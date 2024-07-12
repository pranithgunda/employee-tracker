class Department{

    // method defined to view all departments
    viewDepartments(){
        return `SELECT * FROM department;`
    }

    // method defined to add department
    addDepartment(){
        return `INSERT INTO department (name) VALUES($1)`
     }

    //  method defined to return department names
    getDepartments(){
        return `SELECT name FROM department;`
    }

    // method defined to return department id by name
    getDepartmentID(){
        return `SELECT id FROM department
        WHERE name=$1`
    }
}

module.exports={
    Department
}
