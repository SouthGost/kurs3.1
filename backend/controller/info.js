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

    // async full(req, res) {
    //     const sessions = (await db.query(
    //         'SELECT * FROM session'
    //     )).rows;
    //     const films = (await db.query(
    //         'SELECT id, name FROM film'
    //     )).rows;
    //     const halls = (await db.query(
    //         'SELECT * FROM hall'
    //     )).rows;
    //     const view_types = (await db.query(
    //         'SELECT * FROM view_type'
    //     )).rows;
    //     res.json({sessions, films, halls, view_types});
    // };

    async places(req, res) {
        const { session_id, hall_id } = req.body;
        const tickets = (await db.query(
            'SELECT place_id FROM ticket where session_id = $1',
            [session_id]
        )).rows;
        const places = (await db.query(
            'SELECT * FROM place where hall_id = $1',
            [hall_id]
        )).rows;
        res.json({places, tickets});
    }

    async sessions(req,res) {
        const { film_id, date } = req.body;
        const date2 = date + 86400000;
        const sessions = (await db.query(
            'SELECT * FROM session where film_id = $1 AND date > $2 AND date < $3',
            [film_id, date, date2]
        )).rows;
        res.json({sessions});
    }

    async films(req,res){
        const films = (await db.query(
            'SELECT * FROM film'
        )).rows;
        res.json({films});
    }

    async forSession(req, res) {
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