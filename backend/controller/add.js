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

class AddController {
    async addFilm(req, res) {
        const { name, choosedGenres, age_limit, description, token } = req.body;
        if (
            name !== undefined &&
            age_limit !== undefined &&
            description !== undefined &&
            choosedGenres.length !== 0 &&
            token !== undefined &&
            isApply(token, ["admin"])
        ) {
            const newFilm = (await db.query(
                'INSERT INTO film (name, age_limit, description, used) values ($1, $2, $3, true) RETURNING *',
                [name, age_limit, description]
            )).rows[0];
            for (const genre_id of choosedGenres) {
                const newFilmGenree = (await db.query(
                    'INSERT INTO film_genre (film_id, genre_id) values ($1, $2) RETURNING *',
                    [newFilm.id, genre_id]
                )).rows[0];
            }

            return res.json(newFilm);
        }
        return res.sendStatus(400);
    };

    async createSession(req, res) {
        const { film_id, hall_id, cost, date, d, palette, audio, token } = req.body;
        try {
            console.log(palette, audio);
            if (
                film_id != undefined &&
                hall_id != undefined &&
                cost != undefined &&
                date != undefined &&
                d != undefined &&
                palette != undefined &&
                audio != undefined &&
                isApply(token, ["admin"])
            ) {
                const viewType = (await db.query(
                    'SELECT * FROM view_type  where d = $1 AND palette = $2 AND audio = $3',
                    [d, palette, audio]
                )).rows[0];
                if (viewType == undefined) {
                    throw new Error("Не правильные данные типа показа");
                }
                const newSession = await db.query(
                    'INSERT INTO session (film_id, hall_id, cost, view_type_id, date) values ($1, $2, $3, $4, $5) RETURNING *',
                    [film_id, hall_id, cost, viewType.id, date]
                );
                console.log(newSession);
                return res.json({ message: "dobro" });
            }
            // console.log(film_id);
            // console.log(hall_id);
            // console.log(cost);
            // console.log(d);
            // console.log(user.position);
            return res.sendStatus(400);
        } catch (e) {
            console.log(e.message);
            return res.sendStatus(400);
        }
    };

    async addTickets(req, res) {
        const {
            session_id,
            choosed_places,
            employee_login,
            user_login
        } = req.body;
        console.log(choosed_places)
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
                return res.json({ newTickets });
            } catch {
                for (const ticket of newTickets) {
                    const deleteTicked = await db.query(
                        'DELETE FROM ticket where id = $1',
                        [ticket.id]
                    );
                }
            }
        }
        res.sendStatus(400);
    }

    // async update(req, res) {
    //     const employees = (await db.query(
    //         'SELECT * FROM employee'
    //     )).rows;
    //     const users = (await db.query(
    //         'SELECT * FROM public.user'
    //     )).rows;
    //     for (const elem of employees) {
    //         console.log(elem.password)
    //         elem.password = await bcrypt.hash("123", 10)
    //         const updateEmployee = await db.query(
    //             'UPDATE employee set password = $1 where login = $2 RETURNING *',
    //             [elem.password, elem.login]
    //         );
    //     };
    //     for (const elem of users) {
    //         elem.password = await bcrypt.hash("123", 10)
    //         const updateUser = await db.query(
    //             'UPDATE public.user set password = $1 where login = $2 RETURNING *',
    //             [elem.password, elem.login]
    //         );
    //     };
    //     res.json({employees, users});
    // }

    // async getFilm(req, res){
    //     const films = await db.query('SELECT * FROM film');
    //     res.json(films.rows);
    // };


    // async getOneFilm(req, res){
    //     const id = req.params.id;
    //     const film = await db.query(
    //         'SELECT * FROM film where id = $1',
    //         [id]
    //     );
    //     res.json(film.rows[0]);
    // };

    // async updateFilm(req, res){
    //     const {id, name, img_url, age_limit, description} = req.body;
    //     const film = await db.query(
    //         'UPDATE film set name = $1, img_url = $2, age_limit = $3, description = $4 where id = $5 RETURNING *',
    //         [name, img_url, age_limit, description, id]
    //     );
    //     res.json(film.rows[0]);
    // };

    // async deleteFilm(req, res){
    //     const id = req.params.id;
    //     const film = await db.query(
    //         'DELETE FROM film where id = $1',
    //         [id]
    //     );
    //     res.json({
    //         message: "delete",
    //     });
    // };
};

module.exports = new AddController();