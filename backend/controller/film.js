const db = require('../db');

class FilmController{
    async createFilm(req, res){
        const {name, img_url, age_limit, description} = req.body;
        if(
            name == undefined ||
            img_url == undefined ||
            age_limit == undefined ||
            description == undefined
        ){
            return res.sendStatus(400);
        }
        const newFilm = await db.query(
            'INSERT INTO film (name, img_url, age_limit, description) values ($1, $2, $3, $4) RETURNING *',
            [name, img_url, age_limit, description]
        );
        res.json(newFilm.rows[0]);
    };

    async getFilm(req, res){
        const films = await db.query('SELECT * FROM film');
        res.json(films.rows);
    };

    async getOneFilm(req, res){
        const id = req.params.id;
        const film = await db.query(
            'SELECT * FROM film where id = $1',
            [id]
        );
        res.json(film.rows[0]);
    };

    async updateFilm(req, res){
        const {id, name, img_url, age_limit, description} = req.body;
        const film = await db.query(
            'UPDATE film set name = $1, img_url = $2, age_limit = $3, description = $4 where id = $5 RETURNING *',
            [name, img_url, age_limit, description, id]
        );
        res.json(film.rows[0]);
    };

    async deleteFilm(req, res){
        const id = req.params.id;
        const film = await db.query(
            'DELETE FROM film where id = $1',
            [id]
        );
        res.json({
            message: "delete",
        });
    };
};

module.exports = new FilmController();