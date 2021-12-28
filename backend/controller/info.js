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

    async hall(req, res) {
        const { hall_id } = req.body;
        if (hall_id != undefined) {
            const hall = (await db.query(
                'SELECT * FROM hall where id = $1',
                [hall_id]
            )).rows[0];
            if (hall == undefined) {
                return res.sendStatus(400);
            }
            const places = (await db.query(
                'SELECT * FROM place where hall_id = $1',
                [hall_id]
            )).rows;
            const place_categorys = (await db.query(
                'SELECT * FROM place_category'
            )).rows;
            return res.json({ places, hall, place_categorys });
        }
        res.sendStatus(400);
    }

    async sessions(req, res) {
        const { film_id, date } = req.body;
        if (
            film_id != undefined &&
            date != undefined
        ) {
            const date1 = moment(moment(date, 'x').format("DD-MM-YY"), "DD-MM-YY");
            const date2 = moment(date1).add(1, "days");
            const sessions = (await db.query(
                'SELECT * FROM session where film_id = $1 AND date > $2 AND date < $3',
                [film_id, date1.format('x'), date2.format('x')]
            )).rows;
            console.log(date1);
            console.log(date2);
            console.log(sessions.length);
            console.log("123------------------");
            return res.json({ sessions });
        }
        res.sendStatus(400);
    }

    async films(req, res) {
        const films = (await db.query(
            'SELECT * FROM film where used = true'
        )).rows;
        const genres = (await db.query(
            'SELECT * FROM genre'
        )).rows;
        for (const film of films) {
            const film_genres = (await db.query(
                'SELECT * FROM film_genre where film_id = $1',
                [film.id]
            )).rows;

            film.genres = [];
            film_genres.forEach((film_genre) =>{
                const genreToAdd = genres.find(genre => genre.id == film_genre.genre_id);
                film.genres.push(genreToAdd)
            })
        }
        res.json({ films });
    };

    async forSession(req, res) {
        const films = (await db.query(
            'SELECT id, name FROM film used = true'
        )).rows;
        const halls = (await db.query(
            'SELECT * FROM hall'
        )).rows;
        res.json({ films, halls });
    };

    async checkDates(req, res) {
        const { hall_id } = req.body;
        if (hall_id != undefined) {
            const sessions = (await db.query(
                'SELECT * FROM session where hall_id = $1',
                [hall_id]
            )).rows;
            console.log(sessions); //    
            const dates = [];
            sessions.forEach((session) => {
                console.log(moment(session.date, 'x'))
                const date = new moment(session.date, "x");
                const index = dates.findIndex((elem, id) => {
                    if (elem.date == date.format("YYYY-MM-DD")) {
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
            return res.json({ dates });
        }
        res.sendStatus(400);
    }

    async showSessions(req, res) {
        const sessions = (await db.query(
            'SELECT * FROM session'
        )).rows;
        sessions.forEach((elem) => {
            elem.date = moment(elem.date, 'x').format('DD.MM.YYYY HH:mm');
        })
        res.json({ sessions });
    }

    async ticketsAtSession(req, res) {
        const { session_id } = req.body;
        if (session_id != undefined) {
            const tickets = (await db.query(
                'SELECT * FROM ticket where session_id = $1',
                [session_id]
            )).rows;
            return res.json({ tickets });
        }
        res.sendStatus(400);
    }

    async genres(req, res){
        const genres = (await db.query(
            'SELECT * FROM genre'
        )).rows;
        res.json({genres});
    }

    // async placeCategory(req, res){
    //     const {place_category_id} = req.body;
    //     if(place_category_id != undefined){
    //         const placeCategory = (await db.query(
    //             'SELECT * FROM place_category where id = $1',
    //             [place_category_id]
    //         )).rows[0];
    //         return res.json({placeCategory});
    //     }
    //     res.sendStatus(400);
    // }

};

module.exports = new InfoController();