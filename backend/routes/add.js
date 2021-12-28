const Router = require('express');
const router = new Router();
const addController = require('../controller/add');

router.post('/film', addController.addFilm);//swap createSession
router.post('/session', addController.createSession);
router.post('/tickets', addController.addTickets);
// router.get('/update', addController.update);
// router.put('/', addController.updateFilm);
// router.delete('/:id', addController.deleteFilm);

module.exports = router;