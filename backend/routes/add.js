const Router = require('express');
const router = new Router();
const addController = require('../controller/add');

router.post('/film', addController.createFilm);//swap createSession
router.post('/session', addController.createSession);
// router.get('/', addController.getFilm);
// router.get('/:id', addController.getOneFilm);
// router.put('/', addController.updateFilm);
// router.delete('/:id', addController.deleteFilm);

module.exports = router;