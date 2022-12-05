const mysql = require('mysql2');
const interface = require("./lib/interface");

const conn = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'Bl4ckb12d',
      database: 'employees_db'
    },
    console.log(`Connected to employees_db database.`)
  );

  interface.selectTable();

  exports.conn = conn;

