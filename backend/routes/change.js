const Router = require('express');
const router = new Router();
const changeController = require('../controller/change');

router.post('/films', changeController.changeFilms);
router.post('/sessions', changeController.changeSessions);
router.post('/employees', changeController.changeEmployees);

module.exports = router;