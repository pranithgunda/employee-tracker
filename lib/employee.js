class Employee{
    constructor(first_name,last_name,role_id,manager_id){
        this.first_name=first_name;
        this.last_name=last_name;
        this.role_id=role_id;
        this.manager_id=manager_id;
    }

    // function to view all employees
    viewEmployees(){
        return `SELECT emp.id AS id,emp.first_name AS first_name,emp.last_name AS last_name,role.title AS title,department.name AS department,role.salary AS salary,concat(mgr.first_name,' ',mgr.last_name) AS manager FROM employee emp INNER JOIN role ON emp.role_id = role.id INNER JOIN department ON role.department_id = department.id LEFT OUTER JOIN employee mgr ON emp.manager_id = mgr.id;`
    }

    // function to add an employee
    addEmployee(first_name,last_name,role_id,manager_id){
        return `INSERT INTO employee(first_name,last_name,role_id,manager_id)
        VALUES(first_name,last_name,role_id,manager_id)`
    }

}

module.exports = {
    Employee
}