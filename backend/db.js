const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'postgres',
    password: '',//'','123'
    host: 'localhost',
    port: '5432',//5432,5500
    database: "node_pg_test",//postgres,node_pg_test
});

module.exports = pool;