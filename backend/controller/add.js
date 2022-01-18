const fs = require('fs');
const moment = require('moment');
const db = require('../db');
const jwt = require('jsonwebtoken');
const { execSync } = require("child_process");
const dotenv = require('dotenv');
dotenv.config();

const bd_user = process.env.DB_USER;
const database = process.env.DATABASE;

function isApply(token, positions) {
    const user = jwt.verify(token, 'key');
    const position = positions.find(elem => elem === user.position);
    if (position === undefined) {
        return false;
    }
    return true;
}

class AddController {

    async addFilm(req, res) {
        try {
            const { name, choosedGenres, age_limit, description, token } = req.body;
            if (
                name !== undefined &&
                age_limit !== undefined &&
                description !== undefined &&
                choosedGenres.length !== 0 &&
                token !== undefined &&
                isApply(token, ["admin", "seller"])
            ) {
                const newFilm = (await db.query(
                    'INSERT INTO film (name, age_limit, description, used) values ($1, $2, $3, true) RETURNING *',
                    [name, age_limit, description]
                )).rows[0];
                for (const genre_id of choosedGenres) {
                    await db.query(
                        'INSERT INTO film_genre (film_id, genre_id) values ($1, $2) RETURNING *',
                        [newFilm.id, genre_id]
                    );
                }

                return res.json({ message: "Ok" });
            }
        } catch (e) {
            console.log(e.message);
        }
        return res.sendStatus(400);
    };

    async addSession(req, res) {
        try {
            const { film_id, hall_id, cost, date, d, palette, audio, token } = req.body;
            if (
                film_id != undefined &&
                hall_id != undefined &&
                cost != undefined &&
                date != undefined &&
                d != undefined &&
                palette != undefined &&
                audio != undefined &&
                isApply(token, ["admin", "seller"])
            ) {
                const viewType = (await db.query(
                    'SELECT * FROM view_type  where d = $1 AND palette = $2 AND audio = $3',
                    [d, palette, audio]
                )).rows[0];
                if (viewType == undefined) {
                    throw new Error("Не правильные данные типа показа");
                }
                const sessionAtThisСondition = (await db.query(
                    "SELECT * FROM session where hall_id = $1 AND date = $2",
                    [hall_id, date]
                )).rows[0];
                if (sessionAtThisСondition !== undefined) {
                    if (!sessionAtThisСondition.used) {
                        await db.query(
                            'UPDATE session set film_id = $1, cost = $2, view_type_id = $3, used = true where id = $4 RETURNING *',
                            [film_id, cost, viewType.id, sessionAtThisСondition.id]
                        );
                    } else {
                        throw new Error("Добавление на занятую дату");
                    }
                } else {
                    await db.query(
                        'INSERT INTO session (film_id, hall_id, cost, view_type_id, date, used) values ($1, $2, $3, $4, $5, true) RETURNING *',
                        [film_id, hall_id, cost, viewType.id, date]
                    );
                }
                return res.json({ message: "Ok" });
            }
        } catch (e) {
            console.log(e.message);
        }
        return res.sendStatus(400);
    };

    async addTickets(req, res) {
        try {
            const {
                session_id,
                choosed_places,
                employee_login,
                user_login
            } = req.body;
            if (
                session_id !== undefined &&
                choosed_places.length !== 0
            ) {
                for (const place_id of choosed_places) {
                    const ticket = (await db.query(
                        'SELECT * FROM ticket  where session_id = $1 AND place_id = $2',
                        [session_id, place_id]
                    )).rows[0];

                    if (ticket !== undefined) {

                        return res.sendStatus(400);
                    }
                }
                const newTickets = [];
                try {
                    for (const place_id of choosed_places) {
                        const newTicket = (await db.query(
                            'INSERT INTO ticket (place_id, session_id, user_login, employee_login) values ($1, $2, $3, $4) RETURNING *',
                            [place_id, session_id, user_login, employee_login]
                        )).rows[0];

                        newTickets.push(newTicket);
                    }
                    const session = (await db.query(
                        "SELECT * FROM session WHERE id = $1",
                        [session_id]
                    )).rows[0];
                    const film = (await db.query(
                        "SELECT * FROM film WHERE id = $1",
                        [session.film_id]
                    )).rows[0];
                    const hall = (await db.query(
                        "SELECT * FROM hall WHERE id = $1",
                        [session.hall_id]
                    )).rows[0];
                    const path = `tickets\\tiket${newTickets[0].id}.txt`;
                    const fileName = `tiket${newTickets[0].id}.txt`;
                    let text = "";

                    for (const ticket of newTickets) {
                        const place = (await db.query(
                            "SELECT * FROM place WHERE id = $1",
                            [ticket.place_id]
                        )).rows[0];

                        text += `${film.name} ${moment(session.date, "x").format("HH:mm DD.MM.YYYY")} ${hall.name}, Место: ряд ${place.row} номер ${place.number}.\n`
                    }
                    await fs.readdir("tickets", function (err, files) {
                        for (const file of files) {
                            fs.unlink(`tickets\\${file}`, function () { });
                        }
                    })
                    fs.writeFileSync(path, text);
                    return res.download(path, fileName);
                } catch (err) {
                    console.log(err.message);
                    for (const ticket of newTickets) {
                        const deleteTicked = await db.query(
                            'DELETE FROM ticket where id = $1',
                            [ticket.id]
                        );
                    }
                }
            }
        } catch (e) {
            console.log(e.message);
        }
        return res.sendStatus(400);
    }

    async addBackup(req, res) {
        try {
            const { token } = req.body;
            if (isApply(token, ["admin"])) {
                let path = ""
                const fileNameSplit = __filename.split("\\");
                for (let i = 0; i < fileNameSplit.length - 2; i++) {
                    path += `${fileNameSplit[i]}\\`
                }
                path += `backups\\${moment().format("HH-mm-ss_DD-MM-YYYY")}`;
                execSync(`pg_dump -U ${bd_user} -d ${database} -f ${path} -F t`);

                return res.json({ message: "Ok" });
            }
        } catch (e) {
            console.log(e);
        }
        return res.sendStatus(400);
    }

};

module.exports = new AddController();