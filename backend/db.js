const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'postgres',//postgres,dron61
    password: '',//'','123'
    host: 'localhost',
    port: '5432',//5432,5500
    database: "node_pg_test",//node_pg_test
});

module.exports = pool;