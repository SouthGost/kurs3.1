const Router = require('express');
const router = new Router();
const employeeController = require('../controller/employee');

router.post('/register/', employeeController.regEmployee);//swap
router.get('/', employeeController.getEmployees);
router.post('/login/', employeeController.logEmployee);
// router.put('/', employeeController.updateFilm);
// router.delete('/delete/', employeeController.deleteEmployee);

module.exports = router;