const Router = require('express');
const router = new Router();
const infoController = require('../controller/info');

router.get('/', infoController.showSessions);
router.post('/forSession', infoController.forSession);
router.post('/hall', infoController.hall);
router.post('/sessions', infoController.sessions);
router.post('/films', infoController.films);
router.post('/checkdates', infoController.checkDates); 
router.post('/tickets', infoController.ticketsAtSession);
router.post('/genres', infoController.genres);

module.exports = router;