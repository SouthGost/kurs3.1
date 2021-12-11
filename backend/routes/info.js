const Router = require('express');
const router = new Router();
const infoController = require('../controller/info');

router.post('/forSession/', infoController.forSession);
router.post('/places/', infoController.places);
router.post('/sessions/', infoController.sessions);
router.post('/films/', infoController.films);
router.post('/checkdates/', infoController.checkDates); 
// router.put('/', employeeController.updateFilm);
// router.delete('/delete/', employeeController.deleteEmployee);

module.exports = router;