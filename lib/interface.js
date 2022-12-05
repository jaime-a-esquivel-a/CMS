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

/*
function selectOperation(table){

    inquirer.prompt([
        {
            type: 'list',
            message: `Select the task you want to perform on ${table}`,
            name: 'OperationOption',
            choices: ['View', 'Add', 'Update']
        }
    ]).then((answers) => {

        console.log(`Operation: ${answers.OperationOption}`);

        if(table == 'Department'){
            if(answers.OperationOption == 'View'){
                viewDepartments();
            }else if(answers.OperationOption == 'Add') {
                addDepartment();
            }
        }

    });

}
*/

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

        console.log(`Operation: ${answers.OperationOption}`);

        if(answers.OperationOption == 'View all Departments'){
            viewDepartments();
        }else if(answers.OperationOption == 'Add Department') {
            addDepartment();
        }

    });

}

function viewDepartments(){

    db.conn.query('SELECT * FROM department', function(err, results){

        console.log(console.table(results));

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

        db.conn.query('INSERT INTO department (dpt_name) VALUES (?)', answers.newDpt, (err, result) => {

            if (err) {
                console.log(err);
            }
            console.log(`${answers.newDpt} has been added.`);

            goBack();

        });
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

    db.conn.query(query, function(err, results){

        console.log(console.table(results));

        goBack();

    });
}

function addRole(){

    db.conn.query("SELECT * FROM department", function(err, res) {

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
                type: 'list',
                message: 'Select the department your role will belong to:',
                name: 'dptRole',
                choices: function(){
                    const choiceArrayDepts = []
                    for (let i = 0; i<res.length; i++) {
                        choiceArrayDepts.push(`${res[i].id} | ${res[i].dpt_name}`);
                    }
                    return choiceArrayDepts;

                }
            }
        ]).then((answers) => {

            console.log(answers);

            goBack();

        });

    });

}


exports.selectTable = selectTable;