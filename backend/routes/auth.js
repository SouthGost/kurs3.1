const Router = require('express');
const router = new Router();
const authController = require('../controller/auth');

router.post('/register/', authController.regEmployee);//swap
router.get('/', authController.getEmployees);
router.post('/login/', authController.login);
router.post('/refresh/', authController.refresh);
// router.put('/', employeeController.updateFilm);
// router.delete('/delete/', employeeController.deleteEmployee);

module.exports = router;