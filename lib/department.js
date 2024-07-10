class Department{

    // function to view all available departments
    viewDepartments(){
        return `SELECT * FROM department;`
    }

    // function to add department
    addDepartment(){
        return `INSERT INTO department (name) VALUES($1)`
     }
}

module.exports={
    Department
}
