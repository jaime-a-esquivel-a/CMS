const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require('console.table');
const db = require("../server");

//Menu functions:
function selectTable(){

    inquirer.prompt([
        {
            type: 'list',
            message: 'Select the table you want to work on:',
            name: 'selectTable',
            choices: ['Department', 'Role', 'Employee', 'End Session']
        }
    ]).then((answers) => {

        if(answers.selectTable == 'Department'){
            selectOperationDepartment();
        }else if(answers.selectTable == 'Role'){
            selectOperationRole();
        }else if(answers.selectTable == 'Employee'){
            selectOperationEmployee();
        }else if(answers.selectTable == 'End Session'){
            process.exit();
        }

    });
}

function goBack(){

    inquirer.prompt([
        {
            type: 'list',
            message: `Select 'BACK' when you are ready for another DB Operation`,
            name: 'OperationOption',
            choices: ['BACK']
        }
    ]).then((answers) => {
        selectTable();
    });

}

//Menu functions: Department
function selectOperationDepartment(){

    inquirer.prompt([
        {
            type: 'list',
            message: `Available Operations on Departments:`,
            name: 'OperationOption',
            choices: ['View all Departments', 'Add Department']
        }
    ]).then((answers) => {

        if(answers.OperationOption == 'View all Departments'){
            viewDepartments();
        }else if(answers.OperationOption == 'Add Department') {
            addDepartment();
        }

    });

}

function viewDepartments(){

    db.conn.query('SELECT * FROM department', (err, results) => {

       const table = cTable.getTable(results);

       console.log(`\n${table}`);

       goBack();

    });
}

function addDepartment(){

    inquirer.prompt([
        {
            type: 'input',
            name: 'newDpt',
            message: 'Please enter the name of the new Department:',
            validate: (answer) => {
                if (answer) {
                    return true;
                } else {
                    return 'Please provide a name for the Department.';
                }
            }
        }
    ]).then((answers) => {

        execQuery(`INSERT INTO department (dpt_name) VALUES ("${answers.newDpt}")`);

        console.log(`\n${answers.newDpt} has been added.\n`);

        goBack();

    });
}

//Menu Functions: Role
function selectOperationRole(){

    inquirer.prompt([
        {
            type: 'list',
            message: `Available Operations on Roles:`,
            name: 'OperationOption',
            choices: ['View all Roles', 'Add Role']
        }
    ]).then((answers) => {

        if(answers.OperationOption == 'View all Roles'){
            viewRoles();
        }else if(answers.OperationOption == 'Add Role') {
            addRole();
        }

    });

}

function viewRoles(){

    const query = 'SELECT department.dpt_name, role.title, role.salary FROM role INNER JOIN department ON role.department_id = department.id;';

    db.conn.query(query, (err, results) => {

        const table = cTable.getTable(results);

        console.log(`\n${table}`);

        goBack();

    });

}

function addRole(){

    db.conn.query("SELECT * FROM department", function(err, results) {

        inquirer.prompt([
            {
                type: 'input',
                name: 'newRole',
                message: 'Please enter the name of the new Role:',
                validate: (answer) => {
                    if (answer) {
                        return true;
                    } else {
                        return 'Please provide a name for the Role.';
                    }
                }
            },
            {
                type: 'input',
                name: 'salaryRole',
                message: 'Please enter the annual salary in USD for the new Role:',
                validate: (answer) => {
                    if (answer) {
                        if(isNaN(answer)){
                            return 'Please provide a valid number as salary for the Role.'
                          }else{
                            return true;
                        }
                    } else {
                        return 'Please provide a salary for the Role.';
                    }
                }
            },
            {
                type: 'list',
                message: 'Please select the department the Role will belong to:',
                name: 'dptRole',
                choices: function(){
                    const arrDpt = []
                    for (let i = 0; i<results.length; i++) {
                        arrDpt.push(`${results[i].id}-${results[i].dpt_name}`);
                    }
                    return arrDpt;
                }
            }
        ]).then((answers) => {

            let answerDptRole = answers.dptRole.split('-');

            execQuery(`INSERT INTO role (title, salary, department_id) VALUES ("${answers.newRole}", ${answers.salaryRole}, ${answerDptRole[0]})`);

            console.log(`\n${answers.newRole} has been added.\n`);

            goBack();

        });

    });

}

//Menu Functions: Employee
function selectOperationEmployee(){

    inquirer.prompt([
        {
            type: 'list',
            message: `Available Operations on Employees:`,
            name: 'OperationOption',
            choices: ['View all Employees', 'Add Employee', 'Update Employee Role']
        }
    ]).then((answers) => {

        if(answers.OperationOption == 'View all Employees'){
            viewEmployees();
        }else if(answers.OperationOption == 'Add Employee') {
            addEmployee();
        }else if(answers.OperationOption == 'Update Employee Role'){
            updateEmpRole();
        }

    });

}

function viewEmployees(){

    const query = `SELECT emp1.first_name, emp1.last_name, rl.title, rl.salary, dpt.dpt_name,
    (SELECT CONCAT(emp2.first_name,' ',emp2.last_name) FROM employee AS emp2 WHERE emp2.id = emp1.manager_id) AS 'manager_name'
    FROM employee AS emp1
    INNER JOIN role AS rl ON emp1.role_id = rl.id
    INNER JOIN department AS dpt ON rl.department_id = dpt.id;`;

    db.conn.query(query, (err, results) => {

        const table = cTable.getTable(results);

        console.log(`\n${table}`);

        goBack();

    });

}

function addEmployee(){

    db.conn.query("SELECT * FROM role", function(err, results) {

        inquirer.prompt([
            {
                type: 'input',
                name: 'newFirstName',
                message: 'Please enter the first name of the new Employee:',
                validate: (answer) => {
                    if (answer) {
                        return true;
                    } else {
                        return 'Please provide the first name of the Employee.';
                    }
                }
            },
            {
                type: 'input',
                name: 'newLastName',
                message: 'Please enter the last name of the new Employee:',
                validate: (answer) => {
                    if (answer) {
                        return true;
                    } else {
                        return 'Please provide the last name of the Employee.';
                    }
                }

            },
            {
                type: 'list',
                message: 'Please select the role the employee will have:',
                name: 'newRole',
                choices: function(){
                    const arrRol = []
                    for (let i = 0; i<results.length; i++) {
                        arrRol.push(`${results[i].id}-${results[i].title}`);
                    }
                    return arrRol;
                }
            }
        ]).then((answers) => {

            let arrNewRole = answers.newRole.split('-');

            db.conn.query(`INSERT INTO employee (first_name, last_name, role_id) VALUES ("${answers.newFirstName}", "${answers.newLastName}", ${arrNewRole[0]})`, (err, result) => {

                if (err) {
                    console.log(err);
                }

                let objNewEmp = JSON.parse(JSON.stringify(result));

                db.conn.query('SELECT * FROM employee',(err, results) => {

                    inquirer.prompt([
                        {
                            type: 'list',
                            message: `Please select the manager of ${answers.newFirstName} ${answers.newLastName}:`,
                            name: 'newMan',
                            choices: function(){
                                const arrMan = ['NULL-Do NOT Assign a Manager'];
                                for (let i = 0; i<results.length; i++) {
                                    arrMan.push(`${results[i].id}-${results[i].first_name} ${results[i].last_name}`);
                                }
                                return arrMan;
                            }
                        }
                    ]).then((answers2) => {

                        let arrNewMan = answers2.newMan.split('-');

                        execQuery(`UPDATE employee SET manager_id = ${arrNewMan[0]} WHERE id = ${objNewEmp.insertId}`);
                        
                        console.log(`\n${answers.newFirstName} ${answers.newLastName} has been added as employee.\n`);

                        goBack();

                    });

                });

            });

        });

    });

}

function updateEmpRole(){

    db.conn.query('SELECT * FROM employee',(err, results) => {

        inquirer.prompt([
            {
                type: 'list',
                message: `Please select the Employee to update the role:`,
                name: 'updEmp',
                choices: function(){
                    const arrEmp = []
                    for (let i = 0; i<results.length; i++) {
                        arrEmp.push(`${results[i].id}-${results[i].first_name} ${results[i].last_name}`);
                    }
                    return arrEmp;
                }
            }
        ]).then((answers) => {

            let arrUpdEmp = answers.updEmp.split('-');

            db.conn.query(`SELECT * FROM role`,(err, results2) => {

                inquirer.prompt([
                    {
        
                        type: 'list',
                        message: `Please select the new role for ${arrUpdEmp[1]}:`,
                        name: 'updRol',
                        choices: function(){

                            const arrRol = []
                            for (let i = 0; i<results2.length; i++) {
                                arrRol.push(`${results2[i].id}-${results2[i].title}`);
                            }
                            return arrRol;
    
                        }
        
                    }
                ]).then((answers2) => {

                    let arrUpdRol = answers2.updRol.split('-');

                    execQuery(`UPDATE employee SET role_id = ${arrUpdRol[0]} WHERE id = ${arrUpdEmp[0]}`);

                    console.log(`\n${arrUpdEmp[1]} has been assigned as ${arrUpdRol[1]}\n`);

                    goBack();

                });

            });


        });

    });

}
        
//Aux function to exec a given query
function execQuery(p_query){

    db.conn.query(p_query, (err, result) => {

        if (err) {
            console.log(err);
        }

    });

}

exports.selectTable = selectTable;