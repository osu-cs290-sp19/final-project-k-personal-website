var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 30,
    connectionTimeout: 30000,
    host: "localhost",
    user: "root",
    password: "",
    database: "inbox", // database name is "inbox"
    multipleStatements: true
});

module.exports.pool = pool;