const { execSync } = require("child_process");
const Pool = require('pg').Pool;
const dotenv = require('dotenv');
dotenv.config();

const bd_user = process.env.DB_USER;
const database = process.env.DATABASE;
const fileName = "cinema_db";
const pool = new Pool({
    user: bd_user,
    password: process.env.PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database,
});

pool.connect((err) => {
    if (err) {
        console.log(err);
        let path = ""
        const fileNameSplit = __filename.split("\\");
        for (let i = 0; i < fileNameSplit.length - 2; i++) {
            path += `${fileNameSplit[i]}\\`
        }
        path += fileName;
        console.log(path)
        //execSync(`pg_restore -U ${bd_user} -cC -d ${database} ${path}`);
    }
})

module.exports = pool;