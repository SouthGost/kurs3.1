const db = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

function isApply(token, positions) {
    const user = jwt.verify(token, 'key');
    const position = positions.find(elem => elem === user.position);
    if (position === undefined) {
        return false;
    }
    return true;
}

class ChangeController {

    async changeFilms(req, res) {
        try {
            const { changedFilms, token } = req.body;
            if (
                changedFilms.length > 0 &&
                isApply(token, ["admin"])
            ) {
                for (const film of changedFilms) {
                    if (film.used) {
                        await db.query(
                            'UPDATE film set name = $2, age_limit = $3, description = $4, used = $5 where id = $1',
                            [film.id, film.name, film.age_limit, film.description, film.used]
                        );
                        for (const newGenre of film.genres) {
                            await db.query(
                                'INSERT INTO film_genre (film_id, genre_id) values ($1, $2)',
                                [film.id, newGenre.id]
                            );
                        }

                    } else {
                        await db.query(
                            'UPDATE film set used = false where id = $1',
                            [film.id]
                        );
                    }
                }
                return res.json({ message: "Ok" })
            }
        } catch (err) {
            console.log(err);
        }
        return res.sendStatus(400);
    };

    async changeSessions(req, res) {
        try {
            const { changedSessions, token } = req.body;
            if (
                changedSessions.length > 0 &&
                isApply(token, ["admin"])
            ) {
                for (const session of changedSessions) {
                    if (session.used) {
                        await db.query(
                            'UPDATE session set film_id = $2, view_type_id = $3, cost = $4, used = $5 where id = $1',
                            [session.id, session.film_id, session.view_type_id, session.cost, session.used]
                        );
                    } else {
                        await db.query(
                            'UPDATE session set used = false where id = $1',
                            [session.id]
                        );
                    }
                }
                return res.json({ message: "Ok" })
            }
        } catch (err) {
            console.log(err);
        }
        return res.sendStatus(400);
    }

    async changeEmployees(req, res) {
        try {
            const { changedEmployees, token } = req.body;
            if (
                changedEmployees.length > 0 &&
                isApply(token, ["admin"])
            ) {
                for (const employee of changedEmployees) {
                    if (employee.used) {
                        if (employee.newPassword !== undefined && employee.newPassword !== "") {
                            employee.password = await bcrypt.hash(employee.newPassword, 10);
                        }
                        await db.query(
                            'UPDATE employee set password = $2, position = $3, name = $4, surname = $5, patronymic = $6, used = $7 where login = $1',
                            [employee.login, employee.password, employee.position, employee.name, employee.surname, employee.patronymic, employee.used]
                        );
                    } else {
                        await db.query(
                            'UPDATE employee set used = false where login = $1',
                            [employee.login]
                        );
                    }
                }

                return res.json({ message: "Ok" })
            }
        } catch (err) {
            console.log(err);
        }
        return res.sendStatus(400);
    }

};

module.exports = new ChangeController();