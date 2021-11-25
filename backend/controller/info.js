const db = require('../db');

class InfoController {
    // checkEmployee(login){
    //     const employee;
    //     async () => {
    //         employee = await db.query(
    //             'SELECT * FROM employee where login = $1',
    //             [login]
    //         );
    //     }
    //     if(employee.rows[0] === undefined){
    //         console.log('Пусто');
    //     } else {
    //         console.log('Есть');
    //     }
    //     return employee.rows[0];
    // }

    async session(req, res) {
        const films = (await db.query(
            'SELECT id, name FROM film'
        )).rows;
        const halls = (await db.query(
            'SELECT * FROM hall'
        )).rows;
        res.json({films , halls});
    };

};

module.exports = new InfoController();