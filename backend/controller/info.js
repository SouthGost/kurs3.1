const db = require('../db');
const moment = require('moment');

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
        const date1 = moment(moment(date,'x').format("DD-MM-YY"),"DD-MM-YY");
        const date2 = moment(date1).add(1,"days");
        const sessions = (await db.query(
            'SELECT * FROM session where film_id = $1 AND date > $2 AND date < $3',
            [film_id, date1.format('x'), date2.format('x')]
        )).rows;
        console.log(date1);
        console.log(date2);
        console.log(sessions.length);
        console.log("123------------------");
        res.json({sessions});

        // res.json({
        //     date1: date1.format("DD-MM-YY"),
        //     date2: date2.format("DD-MM-YY")
        // });
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

    async checkDates(req, res){
        const {hall_id} = req.body;
        const sessions = (await db.query(
            'SELECT * FROM session where hall_id = $1',
            [hall_id]
        )).rows;
        console.log(sessions); //    
        const dates = [];
        sessions.forEach((session)=>{
            console.log(moment(session.date,'x'))
            const date = new moment(session.date, "x");
            const index = dates.findIndex((elem,id) => {
                if(elem.date == date.format("YYYY-MM-DD")){
                    console.log(id)
                    return id;
                }
            })
            console.log(index)
            if (index === -1) {
                dates.push({
                    date: date.format("YYYY-MM-DD"),
                    times: [`${date.format("HH:mm")}`],
                });
            } else {
                dates[index].times.push(date.format("HH:mm"));
            }
            // console.log(date.format("YYYY-MM-DD"));
            // console.log(date.format("hh:mm"));
            // if(dates[date.format("YYYY-MM-DD")] === undefined){
            //     dates[date.format("YYYY-MM-DD")] = []
            // }
            // dates[date.format("YYYY-MM-DD")].push(date.format("HH:mm")); 
            console.log(dates);
        });
        res.json({dates});
    }

};

module.exports = new InfoController();