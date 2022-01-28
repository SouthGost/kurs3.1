const db = require('../db');
const fs = require('fs');
const moment = require('moment');
const jwt = require('jsonwebtoken');

function isApply(token, positions) {
    const user = jwt.verify(token, 'key');
    const position = positions.find(elem => elem === user.position);
    if (position === undefined) {
        return false;
    }
    return true;
}

class InfoController {

    async hall(req, res) {
        try {
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
        } catch (err) {
            console.log(err);
        }
        res.sendStatus(400);
    }

    async films(req, res) {
        try {
            const films = (await db.query(
                'SELECT * FROM film where used = true ORDER BY id'
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
                film_genres.forEach((film_genre) => {
                    const genreToAdd = genres.find(genre => genre.id == film_genre.genre_id);
                    film.genres.push(genreToAdd)
                })
            }
            return res.json({ films });
        } catch (err) {
            console.log(err);
        }
        res.sendStatus(400);
    };

    async halls(req, res) {
        try {
            const halls = (await db.query(
                'SELECT * FROM hall ORDER BY id'
            )).rows;
            return res.json({ halls });
        } catch (err) {
            console.log(err);
        }
        res.sendStatus(400);
    };

    async viewTypes(req, res) {
        try {
            const view_types = (await db.query(
                'SELECT * FROM view_type ORDER BY id'
            )).rows;
            return res.json({ view_types });
        } catch (err) {
            console.log(err);
        }
        res.sendStatus(400);
    };

    async viewType(req, res) {
        try {
            const { id } = req.body;
            const view_type = (await db.query(
                "SELECT * FROM view_type where id = $1",
                [id]
            )).rows[0];
            return res.json({ view_type })
        } catch (err) {
            console.log(err)
        }
        res.sendStatus(400);
    }

    async checkDates(req, res) {
        try {
            const { hall_id } = req.body;
            if (hall_id != undefined) {
                const sessions = (await db.query(
                    'SELECT * FROM session where hall_id = $1 AND used = true',
                    [hall_id]
                )).rows;
                const dates = [];
                sessions.forEach((session) => {
                    const date = new moment(session.date, "x");
                    let index = -1;
                    for (let id = 0; id < dates.length; id++) {
                        if (dates[id].date === date.format("YYYY-MM-DD")) {
                            index = id;
                            break;
                        }
                    }
                    if (index === -1) {
                        dates.push({
                            date: date.format("YYYY-MM-DD"),
                            times: [`${date.format("HH:mm")}`],
                        });
                    } else {
                        dates[index].times.push(date.format("HH:mm"));
                    }
                });
                return res.json({ dates });
            }
        } catch (err) {
            console.log(err);
        }
        res.sendStatus(400);
    }

    async allSessions(req, res) {
        try {
            const dateNow = moment();
            const sessions = (await db.query(
                'SELECT * FROM session where date > $1 AND used = true ORDER BY date, hall_id',
                [dateNow.format('x')]
            )).rows;
            return res.json({ sessions });
        } catch (err) {
            console.log(err);
        }
        res.sendStatus(400);
    }

    async sessions(req, res) {
        try {
            const { film_id, date } = req.body;
            if (
                film_id != undefined &&
                date != undefined
            ) {
                let date1 = moment(moment(date, 'x').format("DD-MM-YY"), "DD-MM-YY");
                const date2 = moment(date1).add(1, "days");
                const dateNow = moment();
                if (date1.format("DD-MM-YY") === dateNow.format("DD-MM-YY") && dateNow > date1) {
                    date1 = dateNow;
                }
                const sessions = (await db.query(
                    'SELECT * FROM session where film_id = $1 AND date > $2 AND date < $3 AND used = true ORDER BY date',
                    [film_id, date1.format('x'), date2.format('x')]
                )).rows;
                return res.json({ sessions });
            }
        } catch (err) {
            console.log(err);
        }
        res.sendStatus(400);
    }

    async ticketsAtSession(req, res) {
        try {
            const { session_id } = req.body;
            if (session_id != undefined) {
                const tickets = (await db.query(
                    'SELECT * FROM ticket where session_id = $1 AND used = true',
                    [session_id]
                )).rows;
                return res.json({ tickets });
            }
        } catch (err) {
            console.log(err);
        }
        res.sendStatus(400);
    }

    async genres(req, res) {
        try {
            const genres = (await db.query(
                'SELECT * FROM genre'
            )).rows;
            return res.json({ genres });
        } catch (err) {
            console.log(err);
        }
        res.sendStatus(400);
    }

    async employees(req, res) {
        try {
            const employees = (await db.query(
                'SELECT * FROM employee where used = true ORDER BY login'
            )).rows;
            return res.json({ employees });
        } catch (err) {
            console.log(err);
        }
        res.sendStatus(400);
    }

    async historyFilms(req, res) {
        try {
            const tempFilms = (await db.query(
                "SELECT * FROM temp_film"
            )).rows;
            const genres = (await db.query(
                'SELECT * FROM genre'
            )).rows;
            for (const tempFilm of tempFilms) {
                const film_genres = (await db.query(
                    'SELECT * FROM temp_film_genre where temp_film_id = $1',
                    [tempFilm.id]
                )).rows;

                tempFilm.genres = [];
                film_genres.forEach((film_genre) => {
                    const genreToAdd = genres.find(genre => genre.id == film_genre.genre_id);
                    tempFilm.genres.push(genreToAdd)
                })
            }

            return res.json({ tempFilms })
        } catch (err) {
            console.log(err);
        }
        res.sendStatus(400);
    }

    async historySessions(req, res) {
        try {
            const dateNow = moment();
            let tempSessions = (await db.query(
                "SELECT * FROM temp_session where session_date > $1",
                [dateNow.format('x')]
            )).rows;
            const films = (await db.query(
                "SELECT * FROM film where used = true"
            )).rows;
            tempSessions = tempSessions.filter(elem => {
                if (films.find(film => film.id === elem.film_id) !== undefined) {
                    return elem;
                }
            });

            return res.json({ tempSessions });
        } catch (err) {
            console.log(err);
        }
        return res.sendStatus(400);
    }

    async historyEmployees(req, res) {
        try {
            const tempEmployees = (await db.query(
                "SELECT * FROM temp_employee"
            )).rows;
            return res.json({ tempEmployees });
        } catch (err) {
            console.log(err);
        }
        res.sendStatus(400);
    }

    async places(req, res) {
        try {
            const places = (await db.query(
                "SELECT * FROM place"
            )).rows;
            return res.json({ places });
        } catch (err) {
            console.log(err)
        }
        return res.sendStatus(400);
    }

    async alltickets(req, res) {
        try {
            const { token } = req.body;
            if (isApply(token, ["admin", "seller"])) {
                const dateNow = moment();
                const sessions = (await db.query(
                    'SELECT * FROM session where date > $1 AND used = true ORDER BY date, hall_id',
                    [dateNow.format('x')]
                )).rows;
                let tickets = [];
                for (const session of sessions) {
                    const ticketsAtSession = (await db.query(
                        "SELECT * FROM ticket where session_id = $1 and used = true",
                        [session.id]
                    )).rows;

                    tickets = tickets.concat(ticketsAtSession);
                }
                return res.json({ tickets });
            }
        } catch (err) {
            console.log(err)
        }
        return res.sendStatus(400);
    }

    async backups(req, res) {
        try {
            const backupFiles = fs.readdirSync("backups");
            return res.json({ backupFiles });
        } catch (err) {
            console.log(err)
        }
        return res.sendStatus(400);
    }

};

module.exports = new InfoController();