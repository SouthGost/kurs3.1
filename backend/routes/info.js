const Router = require('express');
const router = new Router();
const infoController = require('../controller/info');

router.post('/allsessions', infoController.allSessions);
router.post('/sessions', infoController.sessions);
router.post('/halls', infoController.halls);
router.post('/hall', infoController.hall);
router.post('/viewTypes', infoController.viewTypes);
router.post('/viewType', infoController.viewType);
router.post('/films', infoController.films);
router.post('/checkdates', infoController.checkDates); 
router.post('/tickets', infoController.ticketsAtSession);
router.post('/genres', infoController.genres);
router.post('/employees', infoController.employees);
router.post('/history/films', infoController.historyFilms);
router.post('/history/sessions', infoController.historySessions);
router.post('/history/employees', infoController.historyEmployees);
router.post('/history/backups', infoController.backups);

module.exports = router;