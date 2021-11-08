const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'dron61',
    password: '123',
    host: 'localhost',
    port: '5500',
    database: "postgres",
});

module.exports = pool;