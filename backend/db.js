const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'dron61',//postgres,dron61
    password: '123',//'','123'
    host: 'localhost',
    port: '5500',//5432,5500
    database: "node_pg_test",//postgres,node_pg_test
});

module.exports = pool;