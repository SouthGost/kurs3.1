const Router = require('express');
const router = new Router();
const filmController = require('../controller/film');

router.post('/', filmController.createFilm);//swap
router.get('/', filmController.getFilm);
router.get('/:id', filmController.getOnFilm);
router.put('/', filmController.updateFilm);
router.delete('/:id', filmController.deleteFilm);

module.exports = router;