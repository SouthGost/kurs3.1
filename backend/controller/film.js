const db = require('../db');

class FilmController{
    async createFilm(req, res){
        const {name, val} = req.body;
        const newFilm = await db.query(
            'INSERT INTO test (name, val) values ($1, $2) RETURNING *',
            [name, val]
        );
        res.json(newFilm.rows[0]);
    };

    async getFilm(req, res){
        const films = await db.query('SELECT * FROM test');
        res.json(films.rows);
    };

    async getOnFilm(req, res){
        const id = req.params.id;
        const film = await db.query(
            'SELECT * FROM test where id = $1',
            [id]
        );
        res.json(film.rows[0]);
    };

    async updateFilm(req, res){
        const {id, name, val} = req.body;
        const film = await db.query(
            'UPDATE test set name = $1, val = $2 where id = $3 RETURNING *',
            [name, val, id]
        );
        res.json(film.rows[0]);
    };

    async deleteFilm(req, res){
        const id = req.params.id;
        const film = await db.query(
            'DELETE FROM test where id = $1',
            [id]
        );
        res.json({
            message: "delete",
        });
    };
};

module.exports = new FilmController();