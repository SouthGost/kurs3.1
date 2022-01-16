const { execute } = require('@getvim/execute');
const Pool = require('pg').Pool;

const fileName = "cinema_db";
const user = 'postgres'; //postgres,dron61
const database = "node_pg_test"; //node_pg_test
const pool = new Pool({
    user,
    password: '',//'','123' Ваш пароль от postgres
    host: 'localhost',
    port: '5432',//5432,5500 Ваш port postgres
    database,
});


pool.connect((err) => {
    if (err) {
        console.log(err)
        execute(`pg_restore -cC -d ${database} ${fileName}`).then(async () => {
            console.log("Data base set");
        }).catch(err => {
            console.log(err);
            console.log("Data base can't be set");
        })
    }
})

module.exports = pool;