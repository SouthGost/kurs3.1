const { execSync } = require("child_process");
const Pool = require('pg').Pool;
const dotenv = require('dotenv');
dotenv.config();

const bd_user = "dron61";
const database = "node_pg_test";
const fileName = "cinema_db";
const pool = new Pool({
    user: bd_user,
    password: "123",
    host: "localhost",
    port: "5500",
    database,
});

pool.connect((err) => {
    if (err) {
        //console.log(err);
        let path = ""
        const fileNameSplit = __filename.split("\\");
        for (let i = 0; i < fileNameSplit.length - 1; i++) {
            path += `${fileNameSplit[i]}\\`
        }
        path += fileName;
        //execSync(`set PGPASSWORD=${process.env.DB_PASSWORD}&& pg_restore --no-owner -h ${process.env.DB_HOST} -p ${process.env.DB_PORT} -U ${process.env.DB_USER} ${process.env.DATABASE} > ${path}`);
        execSync(`set PGPASSWORD=${process.env.DB_PASSWORD}&& createdb -h ${process.env.DB_HOST} -p ${process.env.DB_PORT} -U ${process.env.DB_USER} ${process.env.DATABASE}`);
        execSync(`set PGPASSWORD=${process.env.DB_PASSWORD}&& pg_restore --no-privileges --no-owner -U ${process.env.DB_USER} -d ${process.env.DATABASE} ${path}`);
        //execSync(`pg_restore -U ${bd_user} -cC -d ${database} ${path}`);
    }
})

module.exports = pool;