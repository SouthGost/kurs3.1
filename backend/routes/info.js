const Router = require('express');
const router = new Router();
const infoController = require('../controller/info');

router.get('/session/', infoController.session);//swap
// router.put('/', employeeController.updateFilm);
// router.delete('/delete/', employeeController.deleteEmployee);

module.exports = router;