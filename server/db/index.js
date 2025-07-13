const Database = require('better-sqlite3');
const db = new Database('booker.db');
module.exports = db;