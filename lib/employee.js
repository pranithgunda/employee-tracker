class Employee {
    // method defined to view all employees
    viewEmployees() {
        return `SELECT emp.id AS id,emp.first_name AS first_name,emp.last_name AS last_name,role.title AS title,department.name AS department,role.salary AS salary,concat(mgr.first_name,' ',mgr.last_name) AS manager FROM employee emp INNER JOIN role ON emp.role_id = role.id INNER JOIN department ON role.department_id = department.id LEFT OUTER JOIN employee mgr ON emp.manager_id = mgr.id;`
    }

    // method defined to add an employee
    addEmployee() {
        return `INSERT INTO employee(first_name,last_name,role_id,manager_id)
        VALUES($1,$2,$3,$4)`
    }

    // method defined to get employees full name
    getEmployeeNames() {
        return `SELECT concat(first_name,' ',last_name) AS employee_name FROM employee;`
    }

    // method defined to get employee id by name
    getEmployeeId() {
        return `SELECT id FROM employee WHERE concat(first_name,' ',last_name) = $1;`
    }

    // method defined to update employee role
    updateEmployeeRole(){
        return `UPDATE employee SET role_id = $1 WHERE id = $2;`
    }


}

module.exports = {
    Employee
}