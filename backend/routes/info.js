const Router = require('express');
const router = new Router();
const infoController = require('../controller/info');

router.get('/forSession/', infoController.forSession);
router.post('/places/', infoController.places);
router.post('/sessions/', infoController.sessions);
router.post('/films/', infoController.films);
// router.put('/', employeeController.updateFilm);
// router.delete('/delete/', employeeController.deleteEmployee);

module.exports = router;