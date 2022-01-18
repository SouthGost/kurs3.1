const Router = require('express');
const router = new Router();
const addController = require('../controller/add');

router.post('/film', addController.addFilm);
router.post('/session', addController.addSession);
router.post('/tickets', addController.addTickets);
router.post('/backup', addController.addBackup);

module.exports = router;