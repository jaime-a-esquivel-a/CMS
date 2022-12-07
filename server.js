const mysql = require('mysql2');
const interface = require("./lib/interface");

const conn = mysql.createConnection(
    {
      host: 'localhost',
      user: '',      // add your DB user
      password: '',  // add the password for user
      database: 'employees_db'
    },
    console.log(`Connected to employees_db database.`)
  );

  interface.selectTable();

  exports.conn = conn;

