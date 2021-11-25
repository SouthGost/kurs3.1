const db = require('../db');
const jwt = require('jsonwebtoken');

class AddController{
    async createFilm(req, res){
        const {name, img_url, age_limit, description} = req.body;
        if(
            name != undefined &&
            img_url != undefined &&
            age_limit != undefined &&
            description != undefined
        ){
            const newFilm = await db.query(
                'INSERT INTO film (name, img_url, age_limit, description) values ($1, $2, $3, $4) RETURNING *',
                [name, img_url, age_limit, description]
            );
            return res.json(newFilm.rows[0]);
        }
        return res.sendStatus(400);
    };

    async createSession(req, res){
        console.log("Dobavlayu sessiy");
        const {film_id, hall_id, cost, date, d, palette, audio, token} = req.body;
        try{
            console.log(palette, audio);
            const user = jwt.verify(token, 'key');
            if(
                film_id != undefined &&
                hall_id != undefined &&
                cost != undefined &&
                date != undefined &&
                d != undefined &&
                palette != undefined &&
                audio != undefined &&
                (user.position == "admin")
            ){
                const viewType = (await db.query(
                    'SELECT * FROM view_type  where d = $1 AND palette = $2 AND audio = $3',
                    [d, palette, audio]
                )).rows[0];
                if (viewType == undefined) {
                    throw new Error("Не правильные данные типа показа");
                }
                console.log(viewType);
                // const newSession = await db.query(
                //     'INSERT INTO session (film_id, hall_id, cost, view_type_id, date) values ($1, $2, $3, $4) RETURNING *',
                //     [film_id, hall_id, cost, viewType.id, date]
                // );
                return res.json({message: "dobro"});
            }
            console.log(film_id);
            console.log(hall_id);
            console.log(cost);
            console.log(d);
            console.log(user.position);
            return res.sendStatus(400);
        }catch(e){
            console.log(e.message);
            return res.sendStatus(400);
        }
    };

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