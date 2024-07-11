class Department{

    // method to view all department data
    viewDepartments(){
        return `SELECT * FROM department;`
    }

    // method to add department
    addDepartment(){
        return `INSERT INTO department (name) VALUES($1)`
     }

    //  method to return department names
    getDepartments(){
        return `SELECT name FROM department;`
    }

    // method to return department id by name
    getDepartmentID(){
        return `SELECT id FROM department
        WHERE name=$1`
    }
}

module.exports={
    Department
}
