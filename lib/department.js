class Department{

    constructor(departmentName){
        this.departmentName = departmentName;
    }

    // function to view all available departments
    viewDepartments(){
        return `SELECT * FROM department;`
    }

    // function to add department
    addDepartment(departmentName){
        return `INSERT INTO department (name)
        VALUES(departmentName);`
     }
}

module.exports={
    Department
}
